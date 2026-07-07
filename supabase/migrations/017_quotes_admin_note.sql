-- Admin iç notu ve durum genişletmesi teklif tablosuna
alter table quote_requests
  add column if not exists admin_note text;
