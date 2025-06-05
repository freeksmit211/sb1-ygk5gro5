-- Create vehicle service alerts view
CREATE OR REPLACE VIEW vehicle_service_alerts AS
SELECT 
  v.vehicle,
  v.service_km,
  v.next_service_km,
  v.next_service_km - v.service_km as km_to_service,
  v.created_at
FROM vehicle_services v
INNER JOIN (
  SELECT vehicle, MAX(created_at) as max_created_at
  FROM vehicle_services
  GROUP BY vehicle
) latest ON v.vehicle = latest.vehicle AND v.created_at = latest.max_created_at
WHERE v.next_service_km - v.service_km <= 2000;

-- Create license renewal alerts view
CREATE OR REPLACE VIEW license_renewal_alerts AS
SELECT *
FROM vehicle_licenses
WHERE 
  expiry_date <= CURRENT_DATE + INTERVAL '30 days'
  AND NOT renewal_reminder_sent
ORDER BY expiry_date ASC;