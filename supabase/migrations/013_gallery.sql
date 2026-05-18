-- Galeri — kategoriler + görseller (admin yönetimli)

create table if not exists gallery_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references gallery_categories on delete cascade,
  image_url text not null,
  title text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_gallery_images_category on gallery_images(category_id);

alter table gallery_categories enable row level security;
alter table gallery_images enable row level security;

-- Herkes görür; yalnızca admin değiştirir (yazma API'de service-role ile yapılır)
drop policy if exists "gallery_categories_read" on gallery_categories;
create policy "gallery_categories_read" on gallery_categories
  for select using (true);
drop policy if exists "gallery_categories_admin" on gallery_categories;
create policy "gallery_categories_admin" on gallery_categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "gallery_images_read" on gallery_images;
create policy "gallery_images_read" on gallery_images
  for select using (true);
drop policy if exists "gallery_images_admin" on gallery_images;
create policy "gallery_images_admin" on gallery_images
  for all using (public.is_admin()) with check (public.is_admin());

-- Başlangıç kategorileri
insert into gallery_categories (name, sort_order)
select * from (values
  ('Düğün', 1), ('Kurumsal', 2), ('Tekne', 3),
  ('Mekan', 4), ('Doğum Günü', 5), ('Kurutulmuş', 6)
) as v(name, sort_order)
where not exists (select 1 from gallery_categories);

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('galeri', 'galeri', true)
on conflict (id) do nothing;

drop policy if exists "galeri_read" on storage.objects;
create policy "galeri_read" on storage.objects
  for select using (bucket_id = 'galeri');
drop policy if exists "galeri_admin_write" on storage.objects;
create policy "galeri_admin_write" on storage.objects
  for insert with check (bucket_id = 'galeri' and public.is_admin());
drop policy if exists "galeri_admin_delete" on storage.objects;
create policy "galeri_admin_delete" on storage.objects
  for delete using (bucket_id = 'galeri' and public.is_admin());
