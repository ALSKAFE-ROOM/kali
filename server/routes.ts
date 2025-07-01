import type { Express, Request, Response } from "express";
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all bookings
  app.get("/api/bookings", async (req: Request, res: Response) => {
    try {
      const bookings = bookingDB.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get bookings by date
  app.get("/api/bookings/date/:date", async (req: Request, res: Response) => {
    try {
      const { date } = req.params;
      const bookings = bookingDB.getBookingsByDate(date);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings by date:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get booking by ID
  app.get("/api/bookings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const booking = bookingDB.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Create new booking
  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const validation = bookingSchema.safeParse(req.body);
      
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error);
        return res.status(400).json({ 
          message: errorMessage.toString(),
          errors: validation.error.issues 
        });
      }

      const newBooking = bookingDB.createBooking(validation.data);
      res.status(201).json(newBooking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Update booking
  app.patch("/api/bookings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }

      const validation = bookingSchema.safeParse(req.body);
      
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error);
        return res.status(400).json({ 
          message: errorMessage.toString(),
          errors: validation.error.issues 
        });
      }

      const updatedBooking = bookingDB.updateBooking(id, validation.data);
      
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  // Delete booking
  app.delete("/api/bookings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }

      const deleted = bookingDB.deleteBooking(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ message: "Failed to delete booking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}