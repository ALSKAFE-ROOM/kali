import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping the existing one)
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Booking schema for the chalet booking system
export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingDate: text("booking_date").notNull(),
  period: text("period").notNull(), // 'morning', 'evening', or 'both'
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  amountPaid: integer("amount_paid").notNull(),
  amountRemaining: integer("amount_remaining").notNull(),
  peopleCount: integer("people_count").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const bookingResponseSchema = z.object({
  id: z.number(),
  booking_date: z.string(), // ISO date string
  period: z.enum(['morning', 'evening', 'both']),
  customer_name: z.string(),
  customer_phone: z.string(),
  amount_paid: z.number(),
  amount_remaining: z.number(),
  people_count: z.number(),
  created_at: z.string().optional() // ISO date string
});

// Visitor tracking schema
export const visitors = sqliteTable("visitors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ip: text("ip").notNull(),
  userAgent: text("user_agent"),
  device: text("device"),
  browser: text("browser"),
  visitTime: text("visit_time").default("CURRENT_TIMESTAMP"),
  isBlocked: integer("is_blocked").default(0),
});

export const insertVisitorSchema = createInsertSchema(visitors).omit({
  id: true,
  visitTime: true,
});

// System logs schema
export const activityLogs = sqliteTable("activity_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  details: text("details"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  timestamp: text("timestamp").default("CURRENT_TIMESTAMP"),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true,
});

// Blocked IPs schema
export const blockedIps = sqliteTable("blocked_ips", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ip: text("ip").notNull().unique(),
  reason: text("reason"),
  blockedAt: text("blocked_at").default("CURRENT_TIMESTAMP"),
  blockedBy: text("blocked_by"),
});

export const insertBlockedIpSchema = createInsertSchema(blockedIps).omit({
  id: true,
  blockedAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type BookingResponse = z.infer<typeof bookingResponseSchema>;

export type Visitor = typeof visitors.$inferSelect;
export type InsertVisitor = z.infer<typeof insertVisitorSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type BlockedIp = typeof blockedIps.$inferSelect;
export type InsertBlockedIp = z.infer<typeof insertBlockedIpSchema>;
