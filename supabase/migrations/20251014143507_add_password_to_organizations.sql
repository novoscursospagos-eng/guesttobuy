/*
  # Add Password Field to Organizations

  ## Changes
  - Add password field to organizations table
  - This allows organizations to have login credentials
*/

-- Add password column to organizations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizations' AND column_name = 'password'
  ) THEN
    ALTER TABLE organizations ADD COLUMN password text;
  END IF;
END $$;
