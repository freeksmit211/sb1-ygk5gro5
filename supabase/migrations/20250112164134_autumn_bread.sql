-- Add missing indexes and improve constraints
CREATE INDEX IF NOT EXISTS idx_sheq_vehicles_id ON sheq_vehicles(id);
CREATE INDEX IF NOT EXISTS idx_sheq_vehicle_permits_id ON sheq_vehicle_permits(id);

-- Ensure cascade delete is properly set up
ALTER TABLE sheq_vehicle_permits
DROP CONSTRAINT IF EXISTS sheq_vehicle_permits_vehicle_id_fkey,
ADD CONSTRAINT sheq_vehicle_permits_vehicle_id_fkey 
  FOREIGN KEY (vehicle_id) 
  REFERENCES sheq_vehicles(id) 
  ON DELETE CASCADE;

-- Create function to handle vehicle deletion
CREATE OR REPLACE FUNCTION handle_vehicle_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete related permits first to ensure clean deletion
  DELETE FROM sheq_vehicle_permits WHERE vehicle_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vehicle deletion
DROP TRIGGER IF EXISTS trigger_handle_vehicle_deletion ON sheq_vehicles;
CREATE TRIGGER trigger_handle_vehicle_deletion
  BEFORE DELETE ON sheq_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION handle_vehicle_deletion();