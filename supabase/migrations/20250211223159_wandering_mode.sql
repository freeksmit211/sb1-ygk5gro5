-- Insert vehicles with correct data
INSERT INTO vehicles (registration, make, model, year, status)
VALUES 
  ('HXJ 207 MP', 'Isuzu', 'D-Max', 2022, 'active'),
  ('JDT 129 MP', 'Isuzu', 'D-Max', 2022, 'active'),
  ('JTC 430 MP', 'Isuzu', 'D-Max', 2022, 'active'),
  ('JTC 437 MP', 'Isuzu', 'D-Max', 2022, 'active'),
  ('JXZ 199 MP', 'Isuzu', 'D-Max', 2022, 'active'),
  ('KPJ 902 MP', 'Isuzu', 'D-Max', 2022, 'active'),
  ('KPN 084 MP', 'Isuzu', 'D-Max', 2022, 'active'),
  ('KPN 089 MP', 'Isuzu', 'D-Max', 2022, 'active'),
  ('KRM 836 MP', 'Isuzu', 'D-Max', 2022, 'active'),
  ('KRP 201 MP', 'Isuzu', 'D-Max', 2022, 'active'),
  ('KWR 435 MP', 'Isuzu', 'D-Max', 2022, 'active'),
  ('KZJ 664 MP', 'Isuzu', 'D-Max', 2022, 'active'),
  ('KZW 922 MP', 'Isuzu', 'D-Max', 2022, 'active')
ON CONFLICT (registration) 
DO UPDATE SET
  make = EXCLUDED.make,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  status = EXCLUDED.status;

-- Add license data
INSERT INTO vehicle_licenses (vehicle, expiry_date)
SELECT 
  registration as vehicle,
  now() + (interval '1 month' * (random() * 6 + 1)) as expiry_date
FROM vehicles
WHERE status = 'active'
ON CONFLICT (vehicle) DO NOTHING;