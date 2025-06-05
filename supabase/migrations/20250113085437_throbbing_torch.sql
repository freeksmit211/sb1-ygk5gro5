-- Add sales rep code column to forms_fuel table
ALTER TABLE forms_fuel
ADD COLUMN sales_rep_code text CHECK (sales_rep_code IN ('SO1', 'SO3', 'SO5'));

-- Create index for better query performance
CREATE INDEX idx_forms_fuel_sales_rep_code ON forms_fuel(sales_rep_code);