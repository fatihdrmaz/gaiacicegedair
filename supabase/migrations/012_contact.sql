-- İletişim formu mesajları

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_created on contact_messages(created_at desc);

alter table contact_messages enable row level security;

-- Herkes (anonim dahil) mesaj gönderebilir; yalnızca admin görebilir.
create policy "contact_messages_insert_any" on contact_messages
  for insert with check (true);
create policy "contact_messages_select_admin" on contact_messages
  for select using (public.is_admin());
