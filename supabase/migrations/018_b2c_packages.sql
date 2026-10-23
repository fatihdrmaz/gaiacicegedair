-- Özel Günlerim paketleri — admin panelinden yönetilir
create table if not exists b2c_packages (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  price numeric(10,2) not null check (price >= 0),
  description text,
  items text[] not null default '{}',
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table b2c_packages enable row level security;

drop policy if exists "b2c_packages_public_read" on b2c_packages;
create policy "b2c_packages_public_read" on b2c_packages
  for select using (active = true);

insert into b2c_packages (id, name, price, description, items, sort_order) values
  ('mini',  'Mini',  50,   'Deneme paketi', array['Deneme siparişi'], 0),
  ('kucuk', 'Küçük', 750,  'Zarif ve anlamlı · günlük ölçekte butik buket',
    array['10-12 gövde mevsim çiçeği', 'El sarımı, kraft & saten sunum', 'Kart ve kişisel not', 'İstanbul içi teslimat'], 1),
  ('orta',  'Orta',  1500, 'Şık ve etkileyici · özenle hazırlanmış aranjman',
    array['20-25 gövde mevsim çiçeği', 'Premium sunum kutusu', 'Kişisel mesaj kartı', 'Çiçek + çikolata / mum seçeneği', 'Tercih edilen saate teslimat'], 2),
  ('buyuk', 'Büyük', 3000, 'Etkileyici bir sahne · özel konsept aranjman',
    array['Özel konsept & büyük ölçekli aranjman', 'Seramik / cam vazo hediyeli', 'Premium hediye seti', 'Kişiye özel video kart', 'VIP randevulu teslimat'], 3)
on conflict (id) do nothing;
