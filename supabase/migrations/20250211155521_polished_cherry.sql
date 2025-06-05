-- Create function to handle vehicle deletion
CREATE OR REPLACE FUNCTION handle_vehicle_deletion()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  -- Delete any associated vehicle licenses (should happen automatically due to CASCADE)
  DELETE FROM vehicle_licenses WHERE vehicle = OLD.registration;
  
  -- Delete any associated vehicle services
  DELETE FROM vehicle_services WHERE vehicle = OLD.registration;
  
  -- Delete any associated vehicle incidents
  DELETE FROM vehicle_incidents WHERE vehicle = OLD.registration;
  
  -- Delete any associated vehicle inspections
  DELETE FROM vehicle_inspections WHERE vehicle = OLD.registration;
  
  -- End any active vehicle allocations
  UPDATE sales_rep_vehicle_allocations
  SET end_date = now()
  WHERE vehicle = OLD.registration
  AND end_date IS NULL;

  -- Attempt to delete storage files
  BEGIN
    PERFORM net.http_delete(
      url := current_setting('supabase_functions_endpoint') || '/storage/v1/object/' || 
             'vehicles/' || OLD.registration,
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('supabase.auth.token'),
        'Content-Type', 'application/json'
      )
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log error but continue with deletion
    RAISE NOTICE 'Failed to delete storage files for vehicle %: %', OLD.registration, SQLERRM;
  END;

  RETURN OLD;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_handle_vehicle_deletion ON vehicles;

-- Create trigger for vehicle deletion
CREATE TRIGGER trigger_handle_vehicle_deletion
  BEFORE DELETE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION handle_vehicle_deletion();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION handle_vehicle_deletion TO authenticated;

-- Create function to check if vehicle can be deleted
CREATE OR REPLACE FUNCTION can_delete_vehicle(vehicle_registration text)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  -- Check if vehicle exists
  IF NOT EXISTS (SELECT 1 FROM vehicles WHERE registration = vehicle_registration) THEN
    RETURN false;
  END IF;

  -- Add any additional checks here if needed
  -- For example, check if vehicle is not in use, etc.

  RETURN true;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION can_delete_vehicle TO authenticated;