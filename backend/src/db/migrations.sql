-- Jxt Tap database schema
-- Run this once to create all tables

CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,           -- e.g. "Route 23"
  description VARCHAR(255),             -- e.g. "Town - Addis Ababa"
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stops (
  id SERIAL PRIMARY KEY,
  route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,           -- e.g. "Megenagna"
  sequence_order INTEGER NOT NULL,      -- order along the route, e.g. 1, 2, 3
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tariffs (
  id SERIAL PRIMARY KEY,
  route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  from_stop_id INTEGER NOT NULL REFERENCES stops(id),
  to_stop_id INTEGER NOT NULL REFERENCES stops(id),
  fare NUMERIC(10, 2) NOT NULL,         -- e.g. 8.00
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_to DATE,                    -- NULL = still active
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  balance NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(64) UNIQUE NOT NULL,      -- NFC/QR unique ID, e.g. "967AFCBE"
  account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'active',  -- active, blocked, lost
  issued_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS owners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  device_id VARCHAR(100),
  -- The driver's currently active leg — updated as the bus progresses along its route
  current_route_id INTEGER REFERENCES routes(id),
  current_from_stop_id INTEGER REFERENCES stops(id),
  current_to_stop_id INTEGER REFERENCES stops(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
  route_id INTEGER REFERENCES routes(id),
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  card_id INTEGER NOT NULL REFERENCES cards(id),
  vehicle_id INTEGER REFERENCES vehicles(id),
  driver_id INTEGER REFERENCES drivers(id),
  from_stop_id INTEGER REFERENCES stops(id),
  to_stop_id INTEGER REFERENCES stops(id),
  fare_amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL,          -- success, failed_insufficient_balance
  synced_offline BOOLEAN DEFAULT FALSE, -- true if this was queued offline then synced
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topups (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  method VARCHAR(30) NOT NULL,          -- MTN Mobile Money, Airtel Money, USSD
  created_at TIMESTAMP DEFAULT NOW()
);