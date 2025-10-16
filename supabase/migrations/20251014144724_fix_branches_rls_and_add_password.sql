/*
  # Fix Branches RLS and Add Password Field

  ## Changes
  - Disable RLS for branches table temporarily (for superadmin access)
  - Add password field to branches table for authentication
*/

-- Disable RLS on branches table
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;

-- Add password column to branches table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'branches' AND column_name = 'password'
  ) THEN
    ALTER TABLE branches ADD COLUMN password text;
  END IF;
END $$;
