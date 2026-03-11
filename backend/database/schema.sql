-- Fleet1 Database Schema for Supabase PostgreSQL
-- Run this in Supabase SQL Editor if you prefer manual schema over SQLAlchemy create_all

-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    company_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    shipment_id VARCHAR(100) UNIQUE NOT NULL,
    manufacturer_id INTEGER NOT NULL REFERENCES users(id),
    pickup_address VARCHAR(500) NOT NULL,
    pickup_city VARCHAR(100) NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    delivery_address VARCHAR(500) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    goods_description VARCHAR(500),
    quantity INTEGER DEFAULT 1,
    weight FLOAT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shipments_shipment_id ON shipments(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipments_manufacturer ON shipments(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);

-- Transporters
CREATE TABLE IF NOT EXISTS transporters (
    id SERIAL PRIMARY KEY,
    transporter_name VARCHAR(255) NOT NULL,
    operating_city VARCHAR(100) NOT NULL,
    route VARCHAR(500),
    contact VARCHAR(100) NOT NULL
);

-- Shipment Assignments
CREATE TABLE IF NOT EXISTS shipment_assignments (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    transporter_id INTEGER NOT NULL REFERENCES transporters(id),
    assigned_by INTEGER NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assignments_shipment ON shipment_assignments(shipment_id);
CREATE INDEX IF NOT EXISTS idx_assignments_transporter ON shipment_assignments(transporter_id);

-- Shipment Events (Timeline)
CREATE TABLE IF NOT EXISTS shipment_events (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    transporter_id INTEGER REFERENCES transporters(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_shipment ON shipment_events(shipment_id);
