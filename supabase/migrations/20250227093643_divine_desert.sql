-- Insert vehicles with required fields
INSERT INTO vehicles (registration, make, model, year, status)
VALUES 
  ('JTC 430 MP', 'TBD', 'TBD', 2024, 'active'),
  ('KPN 084 MP', 'TBD', 'TBD', 2024, 'active'),
  ('JDT 129 MP', 'TBD', 'TBD', 2024, 'active'),
  ('KPJ 902 MP', 'TBD', 'TBD', 2024, 'active'),
  ('JTC 437 MP', 'TBD', 'TBD', 2024, 'active'),
  ('KZJ 664 MP', 'TBD', 'TBD', 2024, 'active'),
  ('JXZ 199 MP', 'TBD', 'TBD', 2024, 'active'),
  ('KZW 922 MP', 'TBD', 'TBD', 2024, 'active'),
  ('HXJ 207 MP', 'TBD', 'TBD', 2024, 'active'),
  ('KPN 089 MP', 'TBD', 'TBD', 2024, 'active'),
  ('KRP 201 MP', 'TBD', 'TBD', 2024, 'active'),
  ('KRM 836 MP', 'TBD', 'TBD', 2024, 'active'),
  ('KWR 435 MP', 'TBD', 'TBD', 2024, 'active')
ON CONFLICT (registration) 
DO UPDATE SET
  status = EXCLUDED.status;