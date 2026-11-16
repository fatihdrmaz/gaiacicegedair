-- Özel Günlerim: Konsept → Ölçek → Çiçek türü yapısı

-- 1) Konseptler (fiyatı değiştirmez; görsel + anlatım)
create table if not exists b2c_concepts (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  tagline text,
  description text,
  image_url text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table b2c_concepts enable row level security;
drop policy if exists "b2c_concepts_public_read" on b2c_concepts;
create policy "b2c_concepts_public_read" on b2c_concepts for select using (active = true);

insert into b2c_concepts (id, name, tagline, description, image_url, sort_order) values
  ('eos',     'Eos',     'Tebrikler · Yeni başlangıçlar', 'Yeni iş, mezuniyet, başarı',               'https://images.unsplash.com/photo-1610507121140-78606d4e5220?w=1200&q=80', 1),
  ('hestia',  'Hestia',  'Aile · Dostluk · Yakınlık',     'Aile üyeleri ve arkadaşlar',               'https://images.unsplash.com/photo-1749491105960-7039dcf43451?w=1200&q=80', 2),
  ('afrodit', 'Afrodit', 'Aşk · Romantizm · Tutku',        'Sevgili ve eş',                            'https://images.unsplash.com/photo-1672724332593-9ab35de16efd?w=1200&q=80', 3),
  ('atena',   'Atena',   'İş · Başarı · Saygınlık',        'Terfi, iş ortaklığı, kurumsal hediyeler', 'https://images.unsplash.com/photo-1618080578815-335456280012?w=1200&q=80', 4)
on conflict (id) do nothing;

-- 2) Tasarım ölçekleri (fiyatı belirler) — mevcut paketler yeniden adlandırılır, admin'de düzenlenmişse dokunulmaz
update b2c_packages set name = 'Zarif',     description = 'Uygun fiyatlı ama şık · özenle hazırlanmış butik tasarım' where id = 'kucuk' and name = 'Küçük';
update b2c_packages set name = 'Seçkin',    description = 'Bir tık daha gösterişli · zengin çiçek seçimi'            where id = 'orta'  and name = 'Orta';
update b2c_packages set name = 'İhtişamlı', description = 'Üst segment · etkileyici, büyük ölçekli tasarım'          where id = 'buyuk' and name = 'Büyük';

-- 3) Sipariş satırında çiçek türü ve özel tasarım isteği
alter table b2c_order_items add column if not exists flower_type text;
alter table b2c_order_items add column if not exists design_note text;
