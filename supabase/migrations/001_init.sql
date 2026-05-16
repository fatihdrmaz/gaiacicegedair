-- GAIA Çiçeğe Dair — temel şema

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  phone text,
  role text not null default 'b2c',
  created_at timestamptz not null default now()
);

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  name text not null,
  tax_no text,
  tax_office text,
  sector text,
  size text,
  contact_name text,
  contact_role text,
  email text,
  phone text,
  address text,
  city text default 'İstanbul',
  status text not null default 'pending',
  approved_at timestamptz,
  approved_by uuid,
  monthly_budget numeric,
  kvkk boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists company_addresses (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies on delete cascade,
  label text,
  type text default 'office',
  address text,
  city text,
  contact_name text,
  contact_phone text,
  usage_count int default 0
);

create table if not exists company_employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies on delete cascade,
  full_name text,
  department text,
  email text,
  birth_date date,
  start_date date,
  notes text
);

create table if not exists corporate_orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies on delete cascade,
  created_by uuid references auth.users on delete set null,
  template text,
  recipient_name text,
  recipient_phone text,
  address_id uuid references company_addresses on delete set null,
  delivery_date date,
  delivery_time time default '10:00',
  concept text,
  palette text,
  note text,
  budget numeric,
  requires_approval boolean default false,
  approved_by uuid,
  status text not null default 'pending',
  tracking_photos text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid,
  order_type text,
  event_type text,
  old_status text,
  new_status text,
  note text,
  photo_url text,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text,
  excerpt text,
  body text,
  category text,
  author text,
  author_role text,
  cover_url text,
  read_minutes int,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_corporate_orders_company on corporate_orders(company_id);
create index if not exists idx_corporate_orders_status on corporate_orders(status);
create index if not exists idx_corporate_orders_delivery on corporate_orders(delivery_date);
create index if not exists idx_company_addresses_company on company_addresses(company_id);
create index if not exists idx_company_employees_company on company_employees(company_id);
