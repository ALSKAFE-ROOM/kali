import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { bookingDB } from "./simple-db";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

// Simple booking validation schema
const bookingSchema = z.object({
  bookingDate: z.string(),
  period: z.enum(['morning', 'evening', 'both']),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  amountPaid: z.number().min(0),
  amountRemaining: z.number().min(0),
  peopleCount: z.number().min(1)
});

// Simple middleware without visitor tracking
function middleware(req: Request, res: Response, next: NextFunction) {
  next();

  // Get real visitor information with better accuracy
  // Use X-Forwarded-For header first if available (when behind a proxy)
  const ipSource = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
  // Convert possible comma-separated IPs to a single IP (first one is the client)
  const ip = typeof ipSource === 'string' ? ipSource.split(',')[0].trim() : 'unknown';
  
  const userAgent = req.headers['user-agent'] || 'unknown';
  const acceptLanguage = req.headers['accept-language'] || 'unknown';
  
  // More accurate device detection
  let device = 'unknown';
  let browser = 'unknown';
  let os = 'unknown';
  
  if (userAgent) {
    // Enhanced device detection
    const uaLower = userAgent.toLowerCase();
    
    // OS detection
    if (uaLower.includes('windows')) {
      os = 'Windows';
      if (uaLower.includes('windows nt 10')) os = 'Windows 10/11';
      else if (uaLower.includes('windows nt 6.3')) os = 'Windows 8.1';
      else if (uaLower.includes('windows nt 6.2')) os = 'Windows 8';
      else if (uaLower.includes('windows nt 6.1')) os = 'Windows 7';
    } else if (uaLower.includes('macintosh') || uaLower.includes('mac os')) {
      os = 'macOS';
    } else if (uaLower.includes('linux')) {
      os = 'Linux';
    } else if (uaLower.includes('android')) {
      os = 'Android';
    } else if (uaLower.includes('iphone') || uaLower.includes('ipad') || uaLower.includes('ipod')) {
      os = 'iOS';
    }
    
    // Device type detection
    if (uaLower.includes('iphone')) {
      device = 'iPhone';
    } else if (uaLower.includes('ipad')) {
      device = 'iPad';
    } else if (uaLower.includes('android') && (uaLower.includes('mobile') || uaLower.includes('phone'))) {
      device = 'Android Phone';
    } else if (uaLower.includes('android') && uaLower.includes('tablet')) {
      device = 'Android Tablet';
    } else if (os === 'Windows' || os === 'macOS' || os === 'Linux') {
      device = 'Desktop';
    }
    
    // More accurate browser detection
    if (uaLower.includes('firefox/')) {
      browser = 'Firefox';
    } else if (uaLower.includes('edg/')) {
      browser = 'Edge';
    } else if (uaLower.includes('opr/') || uaLower.includes('opera/')) {
      browser = 'Opera';
    } else if (uaLower.includes('chrome/') && !uaLower.includes('edg/') && !uaLower.includes('opr/')) {
      browser = 'Chrome';
    } else if ((uaLower.includes('safari/') && !uaLower.includes('chrome/')) || 
              (os === 'iOS' && !uaLower.includes('crios/'))) {
      browser = 'Safari';
    } else if (uaLower.includes('msie ') || uaLower.includes('trident/')) {
      browser = 'Internet Explorer';
    }
    
    // Extract version information for more detailed reporting
    const browserVersionMatch = 
      browser === 'Firefox' ? userAgent.match(/Firefox\/(\d+)/) :
      browser === 'Chrome' ? userAgent.match(/Chrome\/(\d+)/) :
      browser === 'Safari' ? userAgent.match(/Version\/(\d+)/) :
      browser === 'Edge' ? userAgent.match(/Edg\/(\d+)/) :
      null;
    
    if (browserVersionMatch && browserVersionMatch[1]) {
      browser = `${browser} ${browserVersionMatch[1]}`;
    }
    
    // Combine OS with device for more detailed information
    device = `${device} (${os})`;
  }
  
  // Additional data points to track and detect potential attackers
  const referrer = req.headers.referer || 'direct';
  const path = req.path;
  const method = req.method;
  const timestamp = new Date();
  
  // Record visitor with enhanced information
  storage.recordVisitor({
    ip,
    userAgent,
    device,
    browser,
  }).catch(err => console.error('Error recording visitor:', err));
  
  // Log suspicious activity (potential attacks)
  if (
    req.method !== 'GET' && req.method !== 'POST' ||
    req.path.includes('..') ||
    req.path.includes('admin') && !req.path.includes('/api/admin') ||
    req.path.includes('wp-') ||  // WordPress scanning
    req.path.includes('phpMyAdmin') ||
    req.path.includes('.php')
  ) {
    // Record suspicious activity
    storage.recordActivity({
      action: 'Suspicious Activity',
      details: `Unusual request: ${method} ${path}`,
      ip,
      userAgent
    }).catch(err => console.error('Error recording suspicious activity:', err));
  }
  
  // More robust blocking with improved error handling
  storage.isIpBlocked(ip)
    .then(isBlocked => {
      if (isBlocked) {
        // Always allow admin API access even from blocked IPs
        if (req.path.includes('/api/admin')) {
          next();
          return;
        }
        
        console.log(`Blocked request from ${ip} to ${req.path}`);
        
        // Block all API requests from blocked IPs
        if (req.path.startsWith('/api/')) {
          return res.status(403).json({ 
            message: 'Your IP address has been blocked by the administrator',
            status: 'blocked',
            timestamp: new Date().toISOString()
          });
        }
        
        // For non-API requests, redirect to a blocked page or serve a blocked message
        res.status(403).send(`
          <html>
            <head><title>Access Blocked</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
              <h1>Access Blocked</h1>
              <p>Your IP address (${ip}) has been blocked by the administrator.</p>
              <p>If you believe this is an error, please contact the site administrator.</p>
            </body>
          </html>
        `);
        return;
      }
      next();
    })
    .catch(err => {
      console.error('Error checking blocked IP:', err);
      // In case of error, allow the request to continue
      next();
    });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply visitor tracking middleware
  app.use(visitorTracking);
  
  // API routes for bookings
  
  // Get all bookings
  app.get("/api/bookings", async (req: Request, res: Response) => {
    try {
      const bookings = await storage.getAllBookings();
      
      // Convert dates to ISO strings for JSON serialization
      const formattedBookings = bookings.map(booking => ({
        ...booking,
        bookingDate: booking.bookingDate instanceof Date ? 
          booking.bookingDate.toISOString().split('T')[0] : booking.bookingDate,
        createdAt: booking.createdAt instanceof Date ? 
          booking.createdAt.toISOString() : booking.createdAt
      }));
      
      res.json(formattedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get bookings by date
  app.get("/api/bookings/date/:date", async (req: Request, res: Response) => {
    try {
      const dateParam = req.params.date;
      const date = new Date(dateParam);
      
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
      }
      
      const bookings = await storage.getBookingsByDate(date);
      
      // Convert dates to ISO strings for JSON serialization
      const formattedBookings = bookings.map(booking => ({
        ...booking,
        bookingDate: booking.bookingDate instanceof Date ? 
          booking.bookingDate.toISOString().split('T')[0] : booking.bookingDate,
        createdAt: booking.createdAt instanceof Date ? 
          booking.createdAt.toISOString() : booking.createdAt
      }));
      
      res.json(formattedBookings);
    } catch (error) {
      console.error("Error fetching bookings by date:", error);
      res.status(500).json({ message: "Failed to fetch bookings by date" });
    }
  });

  // Get a single booking by ID
  app.get("/api/bookings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Convert dates to ISO strings for JSON serialization
      const formattedBooking = {
        ...booking,
        bookingDate: booking.bookingDate instanceof Date ? 
          booking.bookingDate.toISOString().split('T')[0] : booking.bookingDate,
        createdAt: booking.createdAt instanceof Date ? 
          booking.createdAt.toISOString() : booking.createdAt
      };
      
      res.json(formattedBooking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Create a new booking
  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const result = insertBookingSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: "Invalid booking data", 
          errors: validationError.details 
        });
      }
      
      // Get date string from request - storage will handle conversion
      const bookingData = {
        ...result.data
      };
      
      // Check if there are conflicting bookings for the same date and period
      const bookingDate = new Date(result.data.bookingDate);
      const existingBookings = await storage.getBookingsByDate(bookingDate);
      
      // Check for conflicts
      const hasConflict = existingBookings.some(existing => {
        // If booking for both periods, it conflicts with any other booking
        if (existing.period === 'both' || bookingData.period === 'both') {
          return true;
        }
        
        // If existing and new booking are for the same period
        return existing.period === bookingData.period;
      });
      
      if (hasConflict) {
        return res.status(409).json({ message: "There's already a booking for this date and period" });
      }
      
      // Create the booking
      const newBooking = await storage.createBooking(bookingData);
      
      // Format for response
      const response = {
        ...newBooking,
        bookingDate: typeof newBooking.bookingDate === 'object' ? 
          newBooking.bookingDate.toISOString().split('T')[0] : newBooking.bookingDate,
        createdAt: typeof newBooking.createdAt === 'object' ? 
          newBooking.createdAt.toISOString() : newBooking.createdAt
      };
      
      // Validate response format
      const validatedResponse = bookingResponseSchema.parse(response);
      
      res.status(201).json(validatedResponse);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Update a booking
  app.patch("/api/bookings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      // Get existing booking
      const existingBooking = await storage.getBooking(id);
      
      if (!existingBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Partial validation
      const updateData = req.body;
      
      // If bookingDate or period changed, check for conflicts
      if (updateData.bookingDate || updateData.period) {
        const bookingDate = updateData.bookingDate ? 
          new Date(updateData.bookingDate) : existingBooking.bookingDate;
        const period = updateData.period || existingBooking.period;
        
        // Get bookings for this date
        const dateBookings = await storage.getBookingsByDate(bookingDate);
        
        // Check for conflicts excluding the current booking
        const hasConflict = dateBookings.some(booking => {
          if (booking.id === id) return false; // Skip current booking
          
          // If booking for both periods, it conflicts with any other booking
          if (booking.period === 'both' || period === 'both') {
            return true;
          }
          
          // If existing and new booking are for the same period
          return booking.period === period;
        });
        
        if (hasConflict) {
          return res.status(409).json({ message: "There's already a booking for this date and period" });
        }
        
        // Convert bookingDate to Date if it's being updated
        if (updateData.bookingDate) {
          updateData.bookingDate = bookingDate;
        }
      }
      
      // Update the booking
      const updatedBooking = await storage.updateBooking(id, updateData);
      
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Format for response
      const response = {
        ...updatedBooking,
        bookingDate: typeof updatedBooking.bookingDate === 'object' ? 
          updatedBooking.bookingDate.toISOString().split('T')[0] : updatedBooking.bookingDate,
        createdAt: typeof updatedBooking.createdAt === 'object' ? 
          updatedBooking.createdAt.toISOString() : updatedBooking.createdAt
      };
      
      res.json(response);
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  // Delete a booking
  app.delete("/api/bookings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const success = await storage.deleteBooking(id);
      
      if (!success) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ message: "Failed to delete booking" });
    }
  });

  // Admin API Routes
  
  // Get all visitors
  app.get("/api/admin/visitors", async (req: Request, res: Response) => {
    try {
      const visitors = await storage.getAllVisitors();
      
      // Format visit time
      const formattedVisitors = visitors.map(visitor => ({
        ...visitor,
        visitTime: visitor.visitTime instanceof Date ? 
          visitor.visitTime.toISOString() : visitor.visitTime
      }));
      
      res.json(formattedVisitors);
    } catch (error) {
      console.error("Error fetching visitors:", error);
      res.status(500).json({ message: "Failed to fetch visitors" });
    }
  });
  
  // Get all activity logs
  app.get("/api/admin/logs", async (req: Request, res: Response) => {
    try {
      const logs = await storage.getAllActivityLogs();
      
      // Format timestamp
      const formattedLogs = logs.map(log => ({
        ...log,
        timestamp: log.timestamp instanceof Date ? 
          log.timestamp.toISOString() : log.timestamp
      }));
      
      res.json(formattedLogs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });
  
  // Get all blocked IPs
  app.get("/api/admin/blocked-ips", async (req: Request, res: Response) => {
    try {
      const blockedIps = await storage.getAllBlockedIps();
      
      // Format blocked at timestamp
      const formattedBlockedIps = blockedIps.map(blockedIp => ({
        ...blockedIp,
        blockedAt: blockedIp.blockedAt instanceof Date ? 
          blockedIp.blockedAt.toISOString() : blockedIp.blockedAt
      }));
      
      res.json(formattedBlockedIps);
    } catch (error) {
      console.error("Error fetching blocked IPs:", error);
      res.status(500).json({ message: "Failed to fetch blocked IPs" });
    }
  });
  
  // Block an IP
  app.post("/api/admin/block-ip", async (req: Request, res: Response) => {
    try {
      const { ip, reason, blockedBy } = req.body;
      
      if (!ip) {
        return res.status(400).json({ message: "IP address is required" });
      }
      
      // Check if already blocked
      const isAlreadyBlocked = await storage.isIpBlocked(ip);
      if (isAlreadyBlocked) {
        return res.status(409).json({ message: "IP address is already blocked" });
      }
      
      // Block the IP
      const blockedIp = await storage.blockIp({
        ip,
        reason: reason || 'Blocked by admin',
        blockedBy: blockedBy || 'admin'
      });
      
      // Record activity
      await storage.recordActivity({
        action: 'Block IP',
        details: `IP ${ip} was blocked${reason ? ` - Reason: ${reason}` : ''}`,
        ip: req.ip || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown'
      });
      
      // Format response
      const response = {
        ...blockedIp,
        blockedAt: blockedIp.blockedAt instanceof Date ? 
          blockedIp.blockedAt.toISOString() : blockedIp.blockedAt
      };
      
      res.status(201).json(response);
    } catch (error) {
      console.error("Error blocking IP:", error);
      res.status(500).json({ message: "Failed to block IP" });
    }
  });
  
  // Unblock an IP
  app.post("/api/admin/unblock-ip", async (req: Request, res: Response) => {
    try {
      const { ip } = req.body;
      
      if (!ip) {
        return res.status(400).json({ message: "IP address is required" });
      }
      
      // Check if blocked
      const isBlocked = await storage.isIpBlocked(ip);
      if (!isBlocked) {
        return res.status(404).json({ message: "IP address is not blocked" });
      }
      
      // Unblock the IP
      const success = await storage.unblockIp(ip);
      
      if (!success) {
        return res.status(404).json({ message: "IP address not found or already unblocked" });
      }
      
      // Record activity
      await storage.recordActivity({
        action: 'Unblock IP',
        details: `IP ${ip} was unblocked`,
        ip: req.ip || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown'
      });
      
      res.json({ message: "IP address unblocked successfully" });
    } catch (error) {
      console.error("Error unblocking IP:", error);
      res.status(500).json({ message: "Failed to unblock IP" });
    }
  });

  // Record activity (Generic endpoint for activity logging)
  app.post("/api/admin/record-activity", async (req: Request, res: Response) => {
    try {
      const { action, details } = req.body;
      
      if (!action) {
        return res.status(400).json({ message: "Action is required" });
      }
      
      // Record the activity
      const activity = await storage.recordActivity({
        action,
        details: details || '',
        ip: req.ip || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown'
      });
      
      // Format response
      const response = {
        ...activity,
        timestamp: activity.timestamp instanceof Date ? 
          activity.timestamp.toISOString() : activity.timestamp
      };
      
      res.status(201).json(response);
    } catch (error) {
      console.error("Error recording activity:", error);
      res.status(500).json({ message: "Failed to record activity" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
