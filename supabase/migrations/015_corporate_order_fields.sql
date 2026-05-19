-- Kurumsal siparişe serbest adres, şehir ve alıcı telefonu alanları

alter table corporate_orders
  add column if not exists address_text text,
  add column if not exists city text,
  add column if not exists recipient_phone text;
