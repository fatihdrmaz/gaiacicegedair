-- FAZ 10 — Blog yönetimi: ek kolonlar + mevcut yazıların seed'i

alter table blog_posts add column if not exists author_photo text;
alter table blog_posts add column if not exists related text[];

-- Mevcut 5 yazı (içerik markdown'a dönüştürüldü)
insert into blog_posts
  (slug, title, excerpt, body, category, author, author_role, author_photo, cover_url, read_minutes, related, published, published_at)
values
(
  'dugun-palet',
  'Bir düğün paleti nasıl seçilir? Gerçek ipuçları.',
  'Mevsim, mekân, kıyafet renginiz ve duygu — bir paletin arkasındaki dört sütun.',
  $md$Düğün paleti sadece "renk seçimi" değildir. Seçtiğiniz üç-dört tonun arkasında mevsim, mekân, kıyafet ve duygu olmak üzere dört sütun vardır. Her biri göz ardı edilirse palet zorlanır; doğru kurulursa, kendi kendine akan bir tasarım elde edersiniz.

## 1. Mevsimle konuşun

Çiçeklerin üretim takvimi paletinize sınır çizer. Mayıs-Haziran düğünlerinde şakayık, gül, ortanca; sonbaharda dahlia, krizantem, kurutulmuş karışımlar öne çıkar. Mevsim dışı çiçek için ithalat maliyeti, paletinizi dar tutmanın en büyük nedenidir.

## 2. Mekânın zemin rengi ana tondur

Bir mekâna girdiğinizde ilk gördüğünüz renk, paletinizin "sessiz" tonudur. Beyaz kubbeli bir salon açık tonları çeker; ahşap panelli bir villa toprak tonlarıyla konuşur. Mekânla çelişmek yerine, mekânın üstüne bir kat daha katmak daha doğal bir görüntü verir.

## 3. Gelinlik ve damat kıyafeti

Çoğunlukla gözden kaçan ama en fark yaratan sütun. Fildişi bir gelinliğin yanında saf beyaz çiçek kaybolur; sıcak beyaz (ivory) ve şampanya tonları gelinlikle konuşur. Damadın takımı — koyu lacivert, zeytin, gri — yaka çiçeği seçiminde belirleyicidir.

## 4. Hissettirmek istediğiniz duygu

Son sütun tamamen size ait. Romantik mi, minimal mi, doğal mı, görkemli mi? Her duygu için farklı bir palet dili vardır. Romantik için pastel ve krem; minimal için beyaz + yeşil; doğal için toprak tonları ve kurutulmuş karışımlar; görkemli için koyu kırmızı, bordo ve mor.

> Palet seçmek bir eleme sürecidir. Elinizden çıkan her renk, kalanlara değer katar.

## Pratik kontrol listesi

- Ana renk + destek + aksan olmak üzere üç ton seç.
- Bir ton nötr (beyaz/krem/yeşil) olmalı.
- Aksan rengin en fazla %15 olmasına dikkat et.
- Gelinliğin beyaz tonunu örneklem fotoğrafla çek.
- Mekânı günün aynı saatinde gör — ışık paleti değiştirir.

Seçiminizi bitirdiğinizde, son bir test: üç tonu yan yana koyun ve gözlerinizi kısarak bakın. Hiçbir renk "bağırmıyorsa", paletiniz hazır demektir.$md$,
  'Düğün', 'Elif Yalçın', 'Kurucu & Tasarım', 'team2', 'blog1', 6,
  array['bukent-rehberi'], true, '2026-03-18'
),
(
  'bukent-rehberi',
  'Gelin buketi rehberi: silüet, mevsim, duygu.',
  'Yuvarlak mı, akıcı mı, vahşi mi — silüetiniz buketinizin ipuçlarını taşır.',
  $md$Gelin buketi, gelinliğin bir uzantısıdır — bağımsız bir obje değil. Bu yüzden buket seçimine gelinliğe başlarken başlanır, bitince değil.

## Silüete göre buket

A-kesim, prenses veya balon kesimler yuvarlak, dolgun buketleri sever. Mermaid ve düz kesimler ise akıcı, asimetrik, uzun buketlerle daha iyi çalışır. Boho ve rustik kıyafetler ise vahşi, kontrolsüz görünen ama aslında özenle kurgulanmış buketleri taşır.

## Boyut rehberi

- Boyunuza göre buket: en fazla belinizin bir karış altına kadar inmeli.
- Yuvarlak buket: 22–28cm çap ideal.
- Akıcı buket: 60–80cm uzunluk, genişliği kontrollü.
- Mini (el buketi): 15–18cm, sade törenler için.

## Mevsim çiçekleri

Mevsiminde olan çiçek, hem daha taze hem daha uygun fiyatlıdır. Şakayık (Nisan-Mayıs), gül (yıl boyu), ortanca (Haziran-Ekim), dahlia (Ağustos-Ekim), lavanta (Haziran-Ağustos) — mevsimini bilerek yola çıkmak paranın yarısını kurtarır.

> En iyi buket, fotoğrafta değil, elinizde güzel görünendir. Ağırlığı, tutuşu ve dengesi — hepsi önemlidir.$md$,
  'Düğün', 'Derya Kaptan', 'Konsept Direktörü', 'team1', 'blog2', 5,
  array['dugun-palet','surpriz-kutlama'], true, '2026-02-24'
),
(
  'kurumsal-lobi',
  'Kurumsal lobi çiçeği: hangi sıklıkta, hangi ölçekte?',
  'Haftalık, 10 günlük, aylık — kurumunuz için doğru sıklık nasıl bulunur?',
  $md$Kurumsal lobi çiçeği üzerinde en çok düşünülmeyen ama en çok fark eden detaylardan biri sıklıktır. Hangi aralıkla yenileneceği, sadece estetik değil bütçe ve operasyonel bir karardır.

## Haftalık (7 gün)

Yüksek trafikli ofisler, CEO katları, butik oteller ve premium mağazalar için ideal. Çiçekler tam tazeliğinde ve ziyaretçi yoğunluğunun yarattığı aşınma görünmeden yenilenir. Maliyet en yüksek seçenek ama aynı zamanda en profesyonel.

## 10 günlük

Orta-büyük ofisler için dengeli seçim. Hafta içi trafiğin yarattığı aşınma dahil olsa da çiçek genel olarak iyi görünür. Maliyet-fayda açısından en çok tercih edilen aralık.

## Aylık

Butik ofisler, kuaförler, galeri gibi düşük trafikli ama estetik öneren mekânlar için uygun. Uzun ömürlü çiçek seçimi (orkide, kala, antorium) ve kurutulmuş karışımlarla desteklenir.

## Tavsiye: ilk 3 ay tek sefer düzenleyin

Sözleşme imzalamadan önce 3 farklı sıklıkta örnek düzenleme yaptırmanızı öneririz. Bu süreçte hem ekibinizin tepkisi hem de çiçeğin ömrü gözlemlenir; sonra karar daha sağlam olur.$md$,
  'Kurumsal', 'Naz Güner', 'Kurumsal İlişkiler', 'team4', 'blog3', 4,
  array['kurutulmus-hediye'], true, '2026-01-30'
),
(
  'kurutulmus-hediye',
  'Kurutulmuş çiçek: eskimeyen hediye.',
  'Taze çiçeğin solan güzelliği yerine, zamana dayanan bir alternatif.',
  $md$Kurutulmuş çiçek, son yılların sessiz kahramanı. Hem estetik, hem pratik — üstelik taze çiçeğin bir sonraki gün solan hüznünden uzak.

## Neden kurutulmuş?

- Uzun ömürlü: 1–2 yıl şeklini korur.
- Bakım gerektirmez: su, ışık, sıcaklık — hiçbiri.
- Seyahat eder: kargolanabilir, yurt dışına gönderilebilir.
- Sürdürülebilir: döngüye yeniden katılabilir.

## Hangi çiçekler iyi kurur?

Lavanta, statice, ay çiçeği, buğday, pampas, ortanca — doğal olarak kuruyan çiçeklerin başında gelir. Gül ve şakayık da özel teknikle kurutulabilir ama renk kaybı olabilir.

## Bakım ipuçları

Direkt güneşten uzak tutun — renk solar. Nemli alanlardan kaçının. Tozlanırsa saç kurutucusunun soğuk ayarıyla hafifçe temizleyin.$md$,
  'Rehber', 'Mert Sönmez', 'Atölye Sorumlusu', 'team3', 'blog4', 5,
  array['kurumsal-lobi'], true, '2026-01-12'
),
(
  'surpriz-kutlama',
  'Sürpriz kutlama rehberi: ne yapılır, ne yapılmaz.',
  'Sürpriz değil, hayal kırıklığı olmasın — dikkat edilecekler.',
  $md$Sürpriz kutlamalar çoğu zaman ya çok güzel ya da çok tuhaf olur. Arada nadiren orta yol vardır. İşte o "çok güzel" tarafta kalmak için kurallar.

## Yapılacaklar

- Kişinin tarzını bilen bir arkadaşa danışın.
- Alerji, kokuya karşı hassasiyet soruşturun.
- Kurulum için en az 2 saat ayarlayın.
- Fotoğrafçı ya da en azından iyi telefon kamerası olsun.
- Pastanın yanında birşey içilecek hazır olsun.

## Kaçınılacaklar

- Sürpriz olsun diye kişinin özel günlerine müdahale etmeyin.
- Çok kalabalık davet listesi — intim kutlamalar daha güzel olur.
- Sürpriz için yorucu bir kurulum — kişi mutsuz olursa anlamı kalmaz.$md$,
  'Rehber', 'Derya Kaptan', 'Konsept Direktörü', 'team1', 'blog6', 3,
  array['bukent-rehberi'], true, '2025-11-28'
)
on conflict (slug) do nothing;
