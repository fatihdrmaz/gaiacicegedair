-- B2B ürün kataloğu + firma bazlı ürün/fiyat ataması

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  base_price numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists company_products (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies on delete cascade,
  product_id uuid references products on delete cascade,
  price numeric not null default 0,
  created_at timestamptz not null default now(),
  unique (company_id, product_id)
);

create index if not exists idx_company_products_company on company_products(company_id);

-- Kurumsal sipariş artık bir ürüne bağlanır
alter table corporate_orders
  add column if not exists product_id uuid references products on delete set null;

alter table products enable row level security;
alter table company_products enable row level security;

-- products: giriş yapmış herkes görebilir; yalnızca admin değiştirir (yazma API'de service-role)
drop policy if exists "products_read" on products;
create policy "products_read" on products
  for select using (auth.uid() is not null);
drop policy if exists "products_admin" on products;
create policy "products_admin" on products
  for all using (public.is_admin()) with check (public.is_admin());

-- company_products: firma kendi atamalarını görür; admin hepsini
drop policy if exists "company_products_read" on company_products;
create policy "company_products_read" on company_products
  for select using (
    company_id in (select public.my_company_ids()) or public.is_admin()
  );
drop policy if exists "company_products_admin" on company_products;
create policy "company_products_admin" on company_products
  for all using (public.is_admin()) with check (public.is_admin());
