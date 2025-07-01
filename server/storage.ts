import { 
  users, type User, type InsertUser, 
  bookings, type Booking, type InsertBooking,
  visitors, type Visitor, type InsertVisitor,
  activityLogs, type ActivityLog, type InsertActivityLog,
  blockedIps, type BlockedIp, type InsertBlockedIp
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, and, desc } from "drizzle-orm";

// Extend the interface with CRUD methods for all entities
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Booking methods
  getAllBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByDate(date: Date): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<boolean>;

  // Visitor tracking methods
  getAllVisitors(): Promise<Visitor[]>;
  getVisitor(id: number): Promise<Visitor | undefined>;
  getVisitorByIp(ip: string): Promise<Visitor | undefined>;
  recordVisitor(visitor: InsertVisitor): Promise<Visitor>;
  updateVisitorBlockStatus(ip: string, isBlocked: boolean): Promise<Visitor | undefined>;

  // Activity log methods
  getAllActivityLogs(): Promise<ActivityLog[]>;
  getActivityLog(id: number): Promise<ActivityLog | undefined>;
  recordActivity(activity: InsertActivityLog): Promise<ActivityLog>;

  // IP blocking methods
  getAllBlockedIps(): Promise<BlockedIp[]>;
  getBlockedIp(ip: string): Promise<BlockedIp | undefined>;
  blockIp(blockedIp: InsertBlockedIp): Promise<BlockedIp>;
  unblockIp(ip: string): Promise<boolean>;
  isIpBlocked(ip: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Booking methods
  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getBookingsByDate(date: Date): Promise<Booking[]> {
    const dateStr = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
    
    // For SQLite, use direct text comparison
    const result = await db.select().from(bookings).where(
      eq(bookings.bookingDate, dateStr)
    );
    
    return result;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const bookingData = {
      ...insertBooking,
      createdAt: new Date().toISOString()
    };
    
    const result = await db.insert(bookings).values(bookingData).returning();
    return result[0];
  }

  async updateBooking(id: number, bookingUpdate: Partial<InsertBooking>): Promise<Booking | undefined> {
    const result = await db
      .update(bookings)
      .set(bookingUpdate)
      .where(eq(bookings.id, id))
      .returning();
    
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteBooking(id: number): Promise<boolean> {
    const result = await db.delete(bookings).where(eq(bookings.id, id)).returning();
    return result.length > 0;
  }

  // Visitor tracking methods
  async getAllVisitors(): Promise<Visitor[]> {
    return await db.select().from(visitors).orderBy(desc(visitors.visitTime));
  }

  async getVisitor(id: number): Promise<Visitor | undefined> {
    const result = await db.select().from(visitors).where(eq(visitors.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getVisitorByIp(ip: string): Promise<Visitor | undefined> {
    const result = await db.select().from(visitors).where(eq(visitors.ip, ip)).orderBy(desc(visitors.visitTime)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async recordVisitor(visitorData: InsertVisitor): Promise<Visitor> {
    // Check if this IP is already blocked
    const isBlocked = await this.isIpBlocked(visitorData.ip);
    
    const result = await db.insert(visitors).values({
      ...visitorData,
      isBlocked,
      visitTime: new Date()
    }).returning();
    
    return result[0];
  }

  async updateVisitorBlockStatus(ip: string, isBlocked: boolean): Promise<Visitor | undefined> {
    const result = await db
      .update(visitors)
      .set({ isBlocked })
      .where(eq(visitors.ip, ip))
      .returning();
    
    return result.length > 0 ? result[0] : undefined;
  }

  // Activity log methods
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.timestamp));
  }

  async getActivityLog(id: number): Promise<ActivityLog | undefined> {
    const result = await db.select().from(activityLogs).where(eq(activityLogs.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async recordActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const result = await db.insert(activityLogs).values({
      ...activity,
      timestamp: new Date()
    }).returning();
    
    return result[0];
  }

  // IP blocking methods
  async getAllBlockedIps(): Promise<BlockedIp[]> {
    return await db.select().from(blockedIps).orderBy(desc(blockedIps.blockedAt));
  }

  async getBlockedIp(ip: string): Promise<BlockedIp | undefined> {
    const result = await db.select().from(blockedIps).where(eq(blockedIps.ip, ip)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async blockIp(blockedIpData: InsertBlockedIp): Promise<BlockedIp> {
    // First, update all visitor entries with this IP to mark as blocked
    await this.updateVisitorBlockStatus(blockedIpData.ip, true);
    
    // Then add to blocked IPs table
    const result = await db.insert(blockedIps).values({
      ...blockedIpData,
      blockedAt: new Date()
    }).returning();
    
    return result[0];
  }

  async unblockIp(ip: string): Promise<boolean> {
    // First update all visitor entries with this IP to mark as unblocked
    await this.updateVisitorBlockStatus(ip, false);
    
    // Then remove from blocked IPs table
    const result = await db.delete(blockedIps).where(eq(blockedIps.ip, ip)).returning();
    return result.length > 0;
  }

  async isIpBlocked(ip: string): Promise<boolean> {
    const blockedIp = await this.getBlockedIp(ip);
    return blockedIp !== undefined;
  }
}

export const storage = new DatabaseStorage();
