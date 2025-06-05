-- Add job_card_number column to jobs table
ALTER TABLE jobs
ADD COLUMN job_card_number text;

-- Create unique index for job card numbers
CREATE UNIQUE INDEX idx_jobs_card_number ON jobs(job_card_number) 
WHERE job_card_number IS NOT NULL;