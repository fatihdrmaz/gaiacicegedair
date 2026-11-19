-- Özel Günlerim: her konsept × çiçek türü için seçilebilir aranjman örnekleri (fiyatı değiştirmez)
create table if not exists b2c_designs (
  id uuid primary key default gen_random_uuid(),
  concept_id text not null references b2c_concepts(id) on delete cascade,
  flower_type text not null check (flower_type in ('kesme', 'saksi')),
  name text not null,
  description text,
  image_url text not null,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_b2c_designs_concept on b2c_designs(concept_id, flower_type);

alter table b2c_designs enable row level security;
drop policy if exists "b2c_designs_public_read" on b2c_designs;
create policy "b2c_designs_public_read" on b2c_designs for select using (active = true);

-- Siparişte seçilen aranjmanın o anki adı ve fotoğrafı
alter table b2c_order_items add column if not exists design_option text;
alter table b2c_order_items add column if not exists design_image text;
