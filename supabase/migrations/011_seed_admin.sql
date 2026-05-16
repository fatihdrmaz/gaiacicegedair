-- FAZ 9 — GAIA admin kullanıcısı ataması
-- fdurmaz@gmail.com hesabının profil rolünü 'admin' yapar.
-- Idempotent: kullanıcı yoksa hiçbir satır güncellenmez.

update profiles
set role = 'admin'
where id = (select id from auth.users where email = 'fdurmaz@gmail.com');
