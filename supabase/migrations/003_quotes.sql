-- FAZ 3 — Teklif formu (quote_requests)

create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  ad text not null,
  firma text,
  tel text not null,
  email text not null,
  tip text not null,
  konsept text,
  kisi text,
  tarih date,
  mekan text,
  butce text,
  notlar text,
  files text[],
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists idx_quote_requests_status on quote_requests(status);
create index if not exists idx_quote_requests_created on quote_requests(created_at desc);
