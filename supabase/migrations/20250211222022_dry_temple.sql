-- First clear out any sample vehicle data
DELETE FROM vehicles;

-- Reset any sequences
ALTER SEQUENCE IF EXISTS vehicles_id_seq RESTART;

-- Clear any related data
DELETE FROM vehicle_licenses;
DELETE FROM vehicle_services;
DELETE FROM vehicle_incidents;
DELETE FROM vehicle_inspections;
DELETE FROM sales_rep_vehicle_allocations;

-- Create indexes for better query performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_registration ON vehicles(registration);