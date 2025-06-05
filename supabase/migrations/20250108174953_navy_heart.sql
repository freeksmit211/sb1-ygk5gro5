-- First disable RLS to avoid conflicts
ALTER TABLE calendar_deliveries DISABLE ROW LEVEL SECURITY;

-- Remove the existing constraint
ALTER TABLE calendar_deliveries DROP CONSTRAINT IF EXISTS future_date;
ALTER TABLE calendar_deliveries DROP CONSTRAINT IF EXISTS valid_delivery_date;

-- Add notes column if it doesn't exist
ALTER TABLE calendar_deliveries 
ADD COLUMN IF NOT EXISTS notes text;

-- Re-enable RLS
ALTER TABLE calendar_deliveries ENABLE ROW LEVEL SECURITY;