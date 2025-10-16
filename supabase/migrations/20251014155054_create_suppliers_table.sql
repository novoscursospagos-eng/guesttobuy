/*
  # Create Suppliers Table

  ## Description
  Creates a table for managing suppliers/vendors within branches of organizations.

  ## New Tables
  - `suppliers`
    - `id` (uuid, primary key) - Unique identifier
    - `organization_id` (uuid, foreign key) - Links to organizations table
    - `branch_id` (uuid, foreign key, nullable) - Links to branches table
    - `sub_id` (text) - Sequential ID within organization
    - `full_id` (text, unique) - Complete hierarchical ID
    - `name` (text) - Supplier name
    - `company_name` (text) - Legal company name
    - `cnpj` (text, nullable) - Brazilian company tax ID
    - `email` (text) - Contact email
    - `phone` (text, nullable) - Contact phone
    - `address` (text, nullable) - Street address
    - `neighborhood` (text, nullable) - Neighborhood
    - `city` (text, nullable) - City
    - `state` (text, nullable) - State
    - `zip_code` (text, nullable) - Postal code
    - `category` (text, nullable) - Supplier category (furniture, construction, etc)
    - `notes` (text, nullable) - Additional notes
    - `is_active` (boolean) - Active status
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Disable RLS for now (superadmin access)
*/

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  branch_id uuid REFERENCES branches(id),
  sub_id text NOT NULL,
  full_id text UNIQUE NOT NULL,
  name text NOT NULL,
  company_name text,
  cnpj text,
  email text NOT NULL,
  phone text,
  address text,
  neighborhood text,
  city text,
  state text,
  zip_code text,
  category text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to generate next supplier sub_id
CREATE OR REPLACE FUNCTION generate_next_supplier_sub_id(org_id uuid)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  next_id integer;
  formatted_id text;
BEGIN
  SELECT COALESCE(MAX(CAST(sub_id AS integer)), 0) + 1
  INTO next_id
  FROM suppliers
  WHERE organization_id = org_id;
  
  formatted_id := LPAD(next_id::text, 4, '0');
  
  RETURN formatted_id;
END;
$$;
