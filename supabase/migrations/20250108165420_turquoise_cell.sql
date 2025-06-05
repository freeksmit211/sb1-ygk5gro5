/*
  # Update job card number constraints
  
  1. Changes
    - Drop the unique constraint on job_card_number
    - Keep job_card_number optional
*/

DROP INDEX IF EXISTS idx_jobs_card_number;

-- Create a new non-unique index for performance
CREATE INDEX idx_jobs_card_number ON jobs(job_card_number);