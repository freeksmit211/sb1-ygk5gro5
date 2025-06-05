-- Delete the XXX 000 MP vehicle registration
DELETE FROM sheq_vehicles
WHERE registration = 'XXX 000 MP';

-- Add a check constraint to prevent XXX 000 MP from being used
ALTER TABLE sheq_vehicles
ADD CONSTRAINT prevent_xxx_registration 
CHECK (registration != 'XXX 000 MP');