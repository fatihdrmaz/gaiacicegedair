-- FAZ 4 — B2C özel günler siparişleri

create table if not exists b2c_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  buyer_name text,
  buyer_email text,
  buyer_phone text,
  status text not null default 'pending',
  total_amount numeric,
  payment_id text,
  payment_token text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists b2c_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references b2c_orders on delete cascade,
  day_name text,
  occasion text,
  event_date date,
  recipient text,
  address text,
  delivery_time time default '10:00',
  concept text,
  note text,
  package text,
  package_price numeric,
  status text not null default 'pending',
  delivered_at timestamptz
);

create index if not exists idx_b2c_orders_user on b2c_orders(user_id);
create index if not exists idx_b2c_orders_status on b2c_orders(status);
create index if not exists idx_b2c_orders_token on b2c_orders(payment_token);
create index if not exists idx_b2c_order_items_order on b2c_order_items(order_id);
