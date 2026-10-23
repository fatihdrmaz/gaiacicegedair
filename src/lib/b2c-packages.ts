// Özel Günlerim paketleri — istemci ve ödeme sunucusu aynı kaynağı kullanır.
export const PACKAGES = [
  { id: 'kucuk', name: 'Küçük', price: 750,  desc: 'Zarif ve anlamlı · günlük ölçekte butik buket',    items: ['10-12 gövde mevsim çiçeği', 'El sarımı, kraft & saten sunum', 'Kart ve kişisel not', 'İstanbul içi teslimat'] },
  { id: 'orta',  name: 'Orta',  price: 1500, desc: 'Şık ve etkileyici · özenle hazırlanmış aranjman', items: ['20-25 gövde mevsim çiçeği', 'Premium sunum kutusu', 'Kişisel mesaj kartı', 'Çiçek + çikolata / mum seçeneği', 'Tercih edilen saate teslimat'] },
  { id: 'buyuk', name: 'Büyük', price: 3000, desc: 'Etkileyici bir sahne · özel konsept aranjman',   items: ['Özel konsept & büyük ölçekli aranjman', 'Seramik / cam vazo hediyeli', 'Premium hediye seti', 'Kişiye özel video kart', 'VIP randevulu teslimat'] },
];

export const PACKAGE_PRICES: Record<string, number> = Object.fromEntries(PACKAGES.map(p => [p.id, p.price]));
