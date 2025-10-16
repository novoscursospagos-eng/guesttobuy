import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Organization = {
  id: string;
  master_id: string;
  name: string;
  trade_name?: string;
  cnpj?: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  size?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  notes?: string;
  source?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Branch = {
  id: string;
  organization_id: string;
  sub_id: string;
  full_id: string;
  name: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserRole = 'superadmin' | 'broker_owner' | 'broker_employee' | 'buyer';

export type User = {
  id: string;
  organization_id: string;
  branch_id?: string;
  sub_id: string;
  full_id: string;
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  role: UserRole;
  cpf?: string;
  creci?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Property = {
  id: string;
  organization_id: string;
  branch_id?: string;
  broker_id: string;
  sub_id: string;
  full_id: string;
  title: string;
  description?: string;
  property_type?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  price?: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  status: string;
  images: string[];
  amenities: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PropertyInterest = {
  id: string;
  property_id: string;
  buyer_id: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};
