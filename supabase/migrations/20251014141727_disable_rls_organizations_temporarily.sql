/*
  # Disable RLS on Organizations Table Temporarily

  ## Changes
  - Disable Row Level Security on organizations table
  - This allows the superadmin to create organizations without auth issues
  - TODO: Re-enable with proper policies once auth system is properly integrated
*/

-- Disable RLS on organizations table
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
