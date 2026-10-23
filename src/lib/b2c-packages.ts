// Özel Günlerim paketleri — kaynak b2c_packages tablosu; tablo yoksa bu varsayılanlar kullanılır.
export type B2CPackage = {
  id: string;
  name: string;
  price: number;
  desc: string;
  items: string[];
  active: boolean;
  sortOrder: number;
};

export const DEFAULT_PACKAGES: B2CPackage[] = [
  { id: 'mini',  name: 'Mini',  price: 50,   desc: 'Deneme paketi', items: ['Deneme siparişi'], active: true, sortOrder: 0 },
  { id: 'kucuk', name: 'Küçük', price: 750,  desc: 'Zarif ve anlamlı · günlük ölçekte butik buket',    items: ['10-12 gövde mevsim çiçeği', 'El sarımı, kraft & saten sunum', 'Kart ve kişisel not', 'İstanbul içi teslimat'], active: true, sortOrder: 1 },
  { id: 'orta',  name: 'Orta',  price: 1500, desc: 'Şık ve etkileyici · özenle hazırlanmış aranjman', items: ['20-25 gövde mevsim çiçeği', 'Premium sunum kutusu', 'Kişisel mesaj kartı', 'Çiçek + çikolata / mum seçeneği', 'Tercih edilen saate teslimat'], active: true, sortOrder: 2 },
  { id: 'buyuk', name: 'Büyük', price: 3000, desc: 'Etkileyici bir sahne · özel konsept aranjman',   items: ['Özel konsept & büyük ölçekli aranjman', 'Seramik / cam vazo hediyeli', 'Premium hediye seti', 'Kişiye özel video kart', 'VIP randevulu teslimat'], active: true, sortOrder: 3 },
];

export type B2CPackageRow = {
  id: string;
  name: string;
  price: number | string;
  description: string | null;
  items: string[] | null;
  active: boolean;
  sort_order: number;
};

export function mapPackage(r: B2CPackageRow): B2CPackage {
  return {
    id: r.id,
    name: r.name,
    price: Number(r.price) || 0,
    desc: r.description || '',
    items: r.items || [],
    active: r.active,
    sortOrder: r.sort_order,
  };
}
