/*
  # Remove budget constraint from jobs table
  
  1. Changes
    - Make budget column nullable
    - Remove not-null constraint
*/

ALTER TABLE jobs
ALTER COLUMN budget DROP NOT NULL,
ALTER COLUMN budget SET DEFAULT NULL;