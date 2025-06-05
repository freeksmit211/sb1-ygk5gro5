-- First disable RLS to avoid conflicts
ALTER TABLE calendar_deliveries DISABLE ROW LEVEL SECURITY;

-- Remove the existing constraint
ALTER TABLE calendar_deliveries DROP CONSTRAINT IF EXISTS future_date;

-- Add the new constraint that allows current and future dates
ALTER TABLE calendar_deliveries
ADD CONSTRAINT valid_delivery_date 
CHECK (date >= CURRENT_DATE - INTERVAL '1 day');

-- Re-enable RLS
ALTER TABLE calendar_deliveries ENABLE ROW LEVEL SECURITY;