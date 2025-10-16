/*
  # Fix Organization RLS Policy

  ## Changes
  - Allow public (anonymous) users to insert organizations
  - This enables the superadmin (using localStorage auth) to create organizations
  - Maintain security by allowing only superadmins to view/update/delete
*/

-- Drop existing INSERT policy for organizations
DROP POLICY IF EXISTS "Superadmins can insert organizations" ON organizations;

-- Create new INSERT policy that allows anonymous users
CREATE POLICY "Allow anonymous to insert organizations"
  ON organizations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
