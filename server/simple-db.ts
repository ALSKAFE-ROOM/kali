import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Create database directory if it doesn't exist
const dbDir = path.join(process.cwd(), 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create SQLite database file
const dbPath = path.join(dbDir, 'bookings.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create bookings table
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_date TEXT NOT NULL,
    period TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    amount_paid INTEGER NOT NULL,
    amount_remaining INTEGER NOT NULL,
    people_count INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Prepared statements for bookings
const insertBooking = db.prepare(`
  INSERT INTO bookings (booking_date, period, customer_name, customer_phone, amount_paid, amount_remaining, people_count)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const getAllBookings = db.prepare('SELECT * FROM bookings ORDER BY id DESC');
const getBookingById = db.prepare('SELECT * FROM bookings WHERE id = ?');
const getBookingsByDate = db.prepare('SELECT * FROM bookings WHERE booking_date = ?');
const updateBookingById = db.prepare(`
  UPDATE bookings 
  SET booking_date = ?, period = ?, customer_name = ?, customer_phone = ?, amount_paid = ?, amount_remaining = ?, people_count = ?
  WHERE id = ?
`);
const deleteBookingById = db.prepare('DELETE FROM bookings WHERE id = ?');

export const bookingDB = {
  // Get all bookings
  getAllBookings: () => {
    return getAllBookings.all();
  },

  // Get booking by ID
  getBookingById: (id: number) => {
    return getBookingById.get(id);
  },

  // Get bookings by date
  getBookingsByDate: (date: string) => {
    return getBookingsByDate.all(date);
  },

  // Create new booking
  createBooking: (booking: {
    bookingDate: string;
    period: string;
    customerName: string;
    customerPhone: string;
    amountPaid: number;
    amountRemaining: number;
    peopleCount: number;
  }) => {
    const result = insertBooking.run(
      booking.bookingDate,
      booking.period,
      booking.customerName,
      booking.customerPhone,
      booking.amountPaid,
      booking.amountRemaining,
      booking.peopleCount
    );
    
    return getBookingById.get(result.lastInsertRowid);
  },

  // Update booking
  updateBooking: (id: number, booking: {
    bookingDate: string;
    period: string;
    customerName: string;
    customerPhone: string;
    amountPaid: number;
    amountRemaining: number;
    peopleCount: number;
  }) => {
    updateBookingById.run(
      booking.bookingDate,
      booking.period,
      booking.customerName,
      booking.customerPhone,
      booking.amountPaid,
      booking.amountRemaining,
      booking.peopleCount,
      id
    );
    
    return getBookingById.get(id);
  },

  // Delete booking
  deleteBooking: (id: number) => {
    const result = deleteBookingById.run(id);
    return result.changes > 0;
  }
};