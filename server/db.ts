import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'path';
import fs from 'fs';

// Create database directory if it doesn't exist
const dbDir = path.join(process.cwd(), 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create SQLite database file
const dbPath = path.join(dbDir, 'bookings.db');
const sqlite = new Database(dbPath);

// Enable WAL mode for better performance and concurrent access
sqlite.pragma('journal_mode = WAL');

// Create tables if they don't exist
const createTables = () => {
  // Users table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // Bookings table
  sqlite.exec(`
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

  // Visitors table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      user_agent TEXT,
      device TEXT,
      browser TEXT,
      visit_time TEXT DEFAULT CURRENT_TIMESTAMP,
      is_blocked INTEGER DEFAULT 0
    )
  `);

  // Activity logs table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      details TEXT,
      ip TEXT,
      user_agent TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Blocked IPs table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS blocked_ips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL UNIQUE,
      reason TEXT,
      blocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
      blocked_by TEXT
    )
  `);
};

// Initialize tables
createTables();

export const db = drizzle(sqlite);
