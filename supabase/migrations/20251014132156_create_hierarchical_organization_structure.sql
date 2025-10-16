/*
  # Sistema Hierárquico de Organizações

  ## Estrutura de IDs Master e Sub-IDs
  
  Este sistema implementa uma estrutura hierárquica completa com IDs únicos em cada nível:
  
  **Hierarquia:**
  1. Organização Matriz (ID Master: 00001)
     - Sub-ID Filial (0001, 0002...)
     - Sub-ID Corretor Principal (0002)
     - Sub-ID Corretores Funcionários (0003.1, 0003.2...)
     - Sub-ID Imóveis (0010, 0011...)
     - Sub-ID Clientes Compradores (0100, 0101...)

  ## Novas Tabelas

  ### 1. `organizations` - Organizações Matriz
  Tabela principal que representa a conta master de cada empresa.
  - `id` (uuid, primary key)
  - `master_id` (text, unique) - ID Master (ex: "00001")
  - `name` (text) - Razão social
  - `trade_name` (text) - Nome fantasia
  - `cnpj` (text, unique)
  - `email` (text, unique)
  - `phone` (text)
  - `website` (text)
  - `industry` (text) - Setor
  - `size` (text) - Porte da empresa
  - `address` (text)
  - `neighborhood` (text)
  - `city` (text)
  - `state` (text)
  - `zip_code` (text)
  - `notes` (text)
  - `source` (text) - Origem do contato
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `branches` - Filiais
  Filiais vinculadas a uma organização matriz.
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key) - Referência à organização matriz
  - `sub_id` (text) - Sub-ID da filial (ex: "0001")
  - `full_id` (text, unique) - ID completo (ex: "00001-0001")
  - `name` (text)
  - `cnpj` (text)
  - `email` (text)
  - `phone` (text)
  - `address` (text)
  - `neighborhood` (text)
  - `city` (text)
  - `state` (text)
  - `zip_code` (text)
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `user_roles` - Enum de Tipos de Usuário
  Enum definindo os tipos de usuário no sistema.

  ### 4. `users` - Usuários do Sistema
  Corretores (principal e funcionários) e clientes compradores.
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key) - Referência à organização
  - `branch_id` (uuid, foreign key, nullable) - Referência à filial
  - `sub_id` (text) - Sub-ID do usuário
  - `full_id` (text, unique) - ID completo hierárquico
  - `email` (text, unique)
  - `password_hash` (text)
  - `name` (text)
  - `phone` (text)
  - `role` (user_roles) - Tipo: superadmin, broker_owner, broker_employee, buyer
  - `cpf` (text)
  - `creci` (text) - Para corretores
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `properties` - Imóveis
  Imóveis vinculados à organização e corretor.
  - `id` (uuid, primary key)
  - `organization_id` (uuid, foreign key)
  - `branch_id` (uuid, foreign key, nullable)
  - `broker_id` (uuid, foreign key) - Corretor responsável
  - `sub_id` (text) - Sub-ID do imóvel (ex: "0010")
  - `full_id` (text, unique) - ID completo
  - `title` (text)
  - `description` (text)
  - `property_type` (text)
  - `address` (text)
  - `neighborhood` (text)
  - `city` (text)
  - `state` (text)
  - `zip_code` (text)
  - `price` (decimal)
  - `bedrooms` (integer)
  - `bathrooms` (integer)
  - `area` (decimal)
  - `status` (text) - available, reserved, sold
  - `images` (jsonb) - Array de URLs
  - `amenities` (jsonb) - Array de comodidades
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. `property_interests` - Interesse de Compradores
  Relacionamento entre compradores e imóveis.
  - `id` (uuid, primary key)
  - `property_id` (uuid, foreign key)
  - `buyer_id` (uuid, foreign key)
  - `status` (text) - interested, visiting_scheduled, visited, offer_made, negotiating
  - `notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Segurança

  Todas as tabelas têm RLS habilitado com políticas específicas:
  
  - **Superadmin**: Acesso total a tudo
  - **Corretor Proprietário (broker_owner)**: Acesso total à sua organização
  - **Corretor Funcionário (broker_employee)**: Acesso aos seus imóveis e clientes
  - **Comprador (buyer)**: Acesso apenas aos seus dados e imóveis de interesse

  ## Índices

  Índices criados para otimizar consultas:
  - Busca por master_id, full_id
  - Busca por organization_id, branch_id
  - Busca por email, cnpj
  - Busca por status de imóveis
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user roles enum
DO $$ BEGIN
  CREATE TYPE user_roles AS ENUM ('superadmin', 'broker_owner', 'broker_employee', 'buyer');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create organizations table (Matriz)
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  master_id text UNIQUE NOT NULL,
  name text NOT NULL,
  trade_name text,
  cnpj text UNIQUE,
  email text UNIQUE NOT NULL,
  phone text,
  website text,
  industry text,
  size text,
  address text,
  neighborhood text,
  city text,
  state text,
  zip_code text,
  notes text,
  source text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create branches table (Filiais)
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  sub_id text NOT NULL,
  full_id text UNIQUE NOT NULL,
  name text NOT NULL,
  cnpj text,
  email text,
  phone text,
  address text,
  neighborhood text,
  city text,
  state text,
  zip_code text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table (Corretores e Compradores)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  sub_id text NOT NULL,
  full_id text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  phone text,
  role user_roles NOT NULL DEFAULT 'buyer',
  cpf text,
  creci text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create properties table (Imóveis)
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  broker_id uuid REFERENCES users(id) ON DELETE SET NULL NOT NULL,
  sub_id text NOT NULL,
  full_id text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  property_type text,
  address text,
  neighborhood text,
  city text,
  state text,
  zip_code text,
  price decimal(12, 2),
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  area decimal(10, 2),
  status text DEFAULT 'available',
  images jsonb DEFAULT '[]'::jsonb,
  amenities jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create property_interests table (Interesse de Compradores)
CREATE TABLE IF NOT EXISTS property_interests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'interested',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(property_id, buyer_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_master_id ON organizations(master_id);
CREATE INDEX IF NOT EXISTS idx_organizations_email ON organizations(email);
CREATE INDEX IF NOT EXISTS idx_organizations_cnpj ON organizations(cnpj);

CREATE INDEX IF NOT EXISTS idx_branches_organization_id ON branches(organization_id);
CREATE INDEX IF NOT EXISTS idx_branches_full_id ON branches(full_id);

CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_branch_id ON users(branch_id);
CREATE INDEX IF NOT EXISTS idx_users_full_id ON users(full_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_properties_organization_id ON properties(organization_id);
CREATE INDEX IF NOT EXISTS idx_properties_branch_id ON properties(branch_id);
CREATE INDEX IF NOT EXISTS idx_properties_broker_id ON properties(broker_id);
CREATE INDEX IF NOT EXISTS idx_properties_full_id ON properties(full_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

CREATE INDEX IF NOT EXISTS idx_property_interests_property_id ON property_interests(property_id);
CREATE INDEX IF NOT EXISTS idx_property_interests_buyer_id ON property_interests(buyer_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_organizations_updated_at') THEN
    CREATE TRIGGER update_organizations_updated_at
      BEFORE UPDATE ON organizations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_branches_updated_at') THEN
    CREATE TRIGGER update_branches_updated_at
      BEFORE UPDATE ON branches
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_properties_updated_at') THEN
    CREATE TRIGGER update_properties_updated_at
      BEFORE UPDATE ON properties
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_property_interests_updated_at') THEN
    CREATE TRIGGER update_property_interests_updated_at
      BEFORE UPDATE ON property_interests
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_interests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations table
CREATE POLICY "Superadmins can view all organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'superadmin'
    )
  );

CREATE POLICY "Organization owners can view their organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
    )
  );

CREATE POLICY "Superadmins can insert organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'superadmin'
    )
  );

CREATE POLICY "Superadmins can update organizations"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'superadmin'
    )
  );

CREATE POLICY "Superadmins can delete organizations"
  ON organizations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'superadmin'
    )
  );

-- RLS Policies for branches table
CREATE POLICY "Users can view branches from their organization"
  ON branches FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
    )
  );

CREATE POLICY "Broker owners and superadmins can insert branches"
  ON branches FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('broker_owner', 'superadmin')
    )
  );

CREATE POLICY "Broker owners and superadmins can update branches"
  ON branches FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('broker_owner', 'superadmin')
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('broker_owner', 'superadmin')
    )
  );

CREATE POLICY "Broker owners and superadmins can delete branches"
  ON branches FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('broker_owner', 'superadmin')
    )
  );

-- RLS Policies for users table
CREATE POLICY "Users can view users from their organization"
  ON users FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users u
      WHERE u.id = auth.uid()
    )
    OR id = auth.uid()
  );

CREATE POLICY "Broker owners and superadmins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('broker_owner', 'superadmin')
    )
  );

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Broker owners and superadmins can update users from their organization"
  ON users FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('broker_owner', 'superadmin')
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('broker_owner', 'superadmin')
    )
  );

CREATE POLICY "Broker owners and superadmins can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('broker_owner', 'superadmin')
    )
  );

-- RLS Policies for properties table
CREATE POLICY "Users can view properties from their organization"
  ON properties FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
    )
  );

CREATE POLICY "Public can view active properties"
  ON properties FOR SELECT
  TO anon
  USING (is_active = true AND status = 'available');

CREATE POLICY "Brokers and superadmins can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('broker_owner', 'broker_employee', 'superadmin')
    )
  );

CREATE POLICY "Brokers can update their properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (
    broker_id = auth.uid()
    OR organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('broker_owner', 'superadmin')
    )
  )
  WITH CHECK (
    broker_id = auth.uid()
    OR organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('broker_owner', 'superadmin')
    )
  );

CREATE POLICY "Broker owners and superadmins can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('broker_owner', 'superadmin')
    )
  );

-- RLS Policies for property_interests table
CREATE POLICY "Users can view interests from their organization or their own interests"
  ON property_interests FOR SELECT
  TO authenticated
  USING (
    buyer_id = auth.uid()
    OR property_id IN (
      SELECT id FROM properties
      WHERE organization_id IN (
        SELECT organization_id FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('broker_owner', 'broker_employee', 'superadmin')
      )
    )
  );

CREATE POLICY "Buyers can insert their own interests"
  ON property_interests FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can update their own interests"
  ON property_interests FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Brokers can update interests on their properties"
  ON property_interests FOR UPDATE
  TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties
      WHERE broker_id = auth.uid()
      OR organization_id IN (
        SELECT organization_id FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('broker_owner', 'superadmin')
      )
    )
  )
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties
      WHERE broker_id = auth.uid()
      OR organization_id IN (
        SELECT organization_id FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('broker_owner', 'superadmin')
      )
    )
  );

CREATE POLICY "Users can delete their own interests"
  ON property_interests FOR DELETE
  TO authenticated
  USING (buyer_id = auth.uid());

-- Create function to generate next master_id
CREATE OR REPLACE FUNCTION generate_next_master_id()
RETURNS text AS $$
DECLARE
  next_id integer;
  next_id_text text;
BEGIN
  SELECT COALESCE(MAX(CAST(master_id AS integer)), 0) + 1 INTO next_id FROM organizations;
  next_id_text := LPAD(next_id::text, 5, '0');
  RETURN next_id_text;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate next sub_id for branches
CREATE OR REPLACE FUNCTION generate_next_branch_sub_id(org_id uuid)
RETURNS text AS $$
DECLARE
  next_id integer;
  next_id_text text;
BEGIN
  SELECT COALESCE(MAX(CAST(sub_id AS integer)), 0) + 1 INTO next_id 
  FROM branches 
  WHERE organization_id = org_id;
  next_id_text := LPAD(next_id::text, 4, '0');
  RETURN next_id_text;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate next sub_id for users based on role
CREATE OR REPLACE FUNCTION generate_next_user_sub_id(org_id uuid, user_role user_roles)
RETURNS text AS $$
DECLARE
  next_id integer;
  next_id_text text;
  base_id text;
BEGIN
  IF user_role = 'broker_owner' THEN
    base_id := '0002';
  ELSIF user_role = 'broker_employee' THEN
    SELECT COALESCE(MAX(CAST(SUBSTRING(sub_id FROM 6) AS integer)), 0) + 1 INTO next_id
    FROM users
    WHERE organization_id = org_id AND role = 'broker_employee';
    base_id := '0003.' || next_id::text;
  ELSIF user_role = 'buyer' THEN
    SELECT COALESCE(MAX(CAST(sub_id AS integer)), 99) + 1 INTO next_id
    FROM users
    WHERE organization_id = org_id AND role = 'buyer';
    base_id := LPAD(next_id::text, 4, '0');
  ELSE
    base_id := '9999';
  END IF;
  
  RETURN base_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate next sub_id for properties
CREATE OR REPLACE FUNCTION generate_next_property_sub_id(org_id uuid)
RETURNS text AS $$
DECLARE
  next_id integer;
  next_id_text text;
BEGIN
  SELECT COALESCE(MAX(CAST(sub_id AS integer)), 9) + 1 INTO next_id 
  FROM properties 
  WHERE organization_id = org_id;
  next_id_text := LPAD(next_id::text, 4, '0');
  RETURN next_id_text;
END;
$$ LANGUAGE plpgsql;