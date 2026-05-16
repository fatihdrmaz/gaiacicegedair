-- FAZ 9 — Row Level Security politikaları

-- Admin kontrolü için yardımcı fonksiyon
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Kullanıcının firmalarını döndüren yardımcı fonksiyon
create or replace function public.my_company_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select id from public.companies where user_id = auth.uid();
$$;

-- ========== profiles ==========
alter table profiles enable row level security;

create policy "profiles_select_own" on profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());
create policy "profiles_insert_own" on profiles
  for insert with check (id = auth.uid());

-- ========== companies ==========
alter table companies enable row level security;

create policy "companies_select" on companies
  for select using (user_id = auth.uid() or public.is_admin());
create policy "companies_insert_own" on companies
  for insert with check (user_id = auth.uid());
create policy "companies_update" on companies
  for update using (user_id = auth.uid() or public.is_admin());

-- ========== company_addresses ==========
alter table company_addresses enable row level security;

create policy "company_addresses_all" on company_addresses
  for all using (
    company_id in (select public.my_company_ids()) or public.is_admin()
  );

-- ========== company_employees ==========
alter table company_employees enable row level security;

create policy "company_employees_all" on company_employees
  for all using (
    company_id in (select public.my_company_ids()) or public.is_admin()
  );

-- ========== corporate_orders ==========
alter table corporate_orders enable row level security;

create policy "corporate_orders_select" on corporate_orders
  for select using (
    company_id in (select public.my_company_ids()) or public.is_admin()
  );
create policy "corporate_orders_insert" on corporate_orders
  for insert with check (
    company_id in (select public.my_company_ids())
  );
create policy "corporate_orders_update" on corporate_orders
  for update using (
    company_id in (select public.my_company_ids()) or public.is_admin()
  );

-- ========== order_events ==========
alter table order_events enable row level security;

create policy "order_events_select" on order_events
  for select using (
    public.is_admin()
    or order_id in (
      select id from corporate_orders
      where company_id in (select public.my_company_ids())
    )
    or order_id in (
      select id from b2c_orders where user_id = auth.uid()
    )
  );

-- ========== quote_requests ==========
alter table quote_requests enable row level security;

-- Herkes (anonim dahil) teklif gönderebilir; yalnızca admin görebilir.
create policy "quote_requests_insert_any" on quote_requests
  for insert with check (true);
create policy "quote_requests_select_admin" on quote_requests
  for select using (public.is_admin());

-- ========== b2c_orders ==========
alter table b2c_orders enable row level security;

create policy "b2c_orders_select" on b2c_orders
  for select using (user_id = auth.uid() or public.is_admin());

-- ========== b2c_order_items ==========
alter table b2c_order_items enable row level security;

create policy "b2c_order_items_select" on b2c_order_items
  for select using (
    public.is_admin()
    or order_id in (select id from b2c_orders where user_id = auth.uid())
  );

-- ========== blog_posts ==========
alter table blog_posts enable row level security;

create policy "blog_posts_public_read" on blog_posts
  for select using (published = true or public.is_admin());
create policy "blog_posts_admin_write" on blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- NOT: Yazma işlemleri (insert/update) API route'larında service-role
-- anahtarı ile yapılır; service-role RLS'i bypass eder.
