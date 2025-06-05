-- First, identify and handle duplicate registrations
WITH duplicates AS (
  SELECT registration, array_agg(id ORDER BY created_at) as ids
  FROM sheq_vehicles
  GROUP BY registration
  HAVING COUNT(*) > 1
),
to_delete AS (
  SELECT unnest(ids[2:]) as id
  FROM duplicates
)
DELETE FROM sheq_vehicles
WHERE id IN (SELECT id FROM to_delete);

-- Update any invalid registrations to a valid format
UPDATE sheq_vehicles
SET registration = 'XXX 000 MP'
WHERE registration !~ '^[A-Z]{3} [0-9]{3} MP$';

-- Now add the unique constraint
ALTER TABLE sheq_vehicles
ADD CONSTRAINT unique_vehicle_registration UNIQUE (registration);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sheq_vehicles_registration 
ON sheq_vehicles(registration);

-- Update vehicle registration validation
ALTER TABLE sheq_vehicles
ADD CONSTRAINT valid_registration_format 
CHECK (registration ~ '^[A-Z]{3} [0-9]{3} MP$');