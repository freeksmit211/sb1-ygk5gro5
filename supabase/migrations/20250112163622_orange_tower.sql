-- Add cascade delete to vehicle permits
ALTER TABLE sheq_vehicle_permits
DROP CONSTRAINT IF EXISTS sheq_vehicle_permits_vehicle_id_fkey,
ADD CONSTRAINT sheq_vehicle_permits_vehicle_id_fkey 
  FOREIGN KEY (vehicle_id) 
  REFERENCES sheq_vehicles(id) 
  ON DELETE CASCADE;

-- Create trigger to cleanup storage on vehicle deletion
CREATE OR REPLACE FUNCTION cleanup_vehicle_storage()
RETURNS TRIGGER AS $$
BEGIN
  -- Attempt to delete vehicle files from storage
  -- This is a best-effort operation, failures are logged but don't block deletion
  BEGIN
    PERFORM net.http_post(
      url := current_setting('supabase_functions_endpoint') || '/storage/v1/object/delete',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('supabase.auth.token'),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'prefixes', ARRAY['sheq/vehicles/' || OLD.id]
      )
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log error but continue with deletion
    RAISE WARNING 'Failed to cleanup storage for vehicle %: %', OLD.id, SQLERRM;
  END;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_cleanup_vehicle_storage ON sheq_vehicles;
CREATE TRIGGER trigger_cleanup_vehicle_storage
  BEFORE DELETE ON sheq_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_vehicle_storage();