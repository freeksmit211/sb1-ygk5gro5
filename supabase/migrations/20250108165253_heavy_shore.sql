/*
  # Remove job date constraint
  
  1. Changes
    - Remove the valid_job_date constraint that requires future dates
    - Allow jobs to be created with any date
*/

ALTER TABLE jobs
DROP CONSTRAINT IF EXISTS valid_job_date;