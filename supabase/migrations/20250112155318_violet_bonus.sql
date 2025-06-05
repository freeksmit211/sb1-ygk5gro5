-- Drop Franco tables
DROP TABLE IF EXISTS franco_feedback;
DROP TABLE IF EXISTS franco_activities;

-- Drop Freek tables
DROP TABLE IF EXISTS freek_feedback;
DROP TABLE IF EXISTS freek_activities;

-- Drop Jeckie tables
DROP TABLE IF EXISTS jeckie_feedback;
DROP TABLE IF EXISTS jeckie_activities;

-- Update sales_activities to handle all sales reps
ALTER TABLE sales_activities
  ADD CONSTRAINT valid_rep_id CHECK (rep_id IN ('franco', 'freek', 'jeckie', 'inHouse', 'cod'));

-- Update sales_feedback to handle all sales reps
ALTER TABLE sales_feedback
  ADD CONSTRAINT valid_rep_id CHECK (rep_id IN ('franco', 'freek', 'jeckie', 'inHouse', 'cod'));