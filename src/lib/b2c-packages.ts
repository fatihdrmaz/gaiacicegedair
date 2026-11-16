// Özel Günlerim — paket = tasarım ölçeği (fiyatı belirler), konsept = stil (fiyatı değiştirmez).
// Kaynak b2c_packages / b2c_concepts tabloları; tablo yoksa bu varsayılanlar kullanılır.
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
  { id: 'kucuk', name: 'Zarif',     price: 750,  desc: 'Uygun fiyatlı ama şık · özenle hazırlanmış butik tasarım',    items: ['10-12 gövde mevsim çiçeği', 'El sarımı, kraft & saten sunum', 'Kart ve kişisel not', 'İstanbul içi teslimat'], active: true, sortOrder: 1 },
  { id: 'orta',  name: 'Seçkin',    price: 1500, desc: 'Bir tık daha gösterişli · zengin çiçek seçimi', items: ['20-25 gövde mevsim çiçeği', 'Premium sunum kutusu', 'Kişisel mesaj kartı', 'Çiçek + çikolata / mum seçeneği', 'Tercih edilen saate teslimat'], active: true, sortOrder: 2 },
  { id: 'buyuk', name: 'İhtişamlı', price: 3000, desc: 'Üst segment · etkileyici, büyük ölçekli tasarım',   items: ['Özel konsept & büyük ölçekli aranjman', 'Seramik / cam vazo hediyeli', 'Premium hediye seti', 'Kişiye özel video kart', 'VIP randevulu teslimat'], active: true, sortOrder: 3 },
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

export type B2CConcept = {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  imageUrl: string | null;
  active: boolean;
  sortOrder: number;
};

export const DEFAULT_CONCEPTS: B2CConcept[] = [
  { id: 'eos',     name: 'Eos',     tagline: 'Tebrikler · Yeni başlangıçlar', desc: 'Yeni iş, mezuniyet, başarı',               imageUrl: 'https://images.unsplash.com/photo-1610507121140-78606d4e5220?w=1200&q=80', active: true, sortOrder: 1 },
  { id: 'hestia',  name: 'Hestia',  tagline: 'Aile · Dostluk · Yakınlık',     desc: 'Aile üyeleri ve arkadaşlar',               imageUrl: 'https://images.unsplash.com/photo-1749491105960-7039dcf43451?w=1200&q=80', active: true, sortOrder: 2 },
  { id: 'afrodit', name: 'Afrodit', tagline: 'Aşk · Romantizm · Tutku',        desc: 'Sevgili ve eş',                            imageUrl: 'https://images.unsplash.com/photo-1672724332593-9ab35de16efd?w=1200&q=80', active: true, sortOrder: 3 },
  { id: 'atena',   name: 'Atena',   tagline: 'İş · Başarı · Saygınlık',        desc: 'Terfi, iş ortaklığı, kurumsal hediyeler', imageUrl: 'https://images.unsplash.com/photo-1618080578815-335456280012?w=1200&q=80', active: true, sortOrder: 4 },
];

export type B2CConceptRow = {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  active: boolean;
  sort_order: number;
};

export function mapConcept(r: B2CConceptRow): B2CConcept {
  return {
    id: r.id,
    name: r.name,
    tagline: r.tagline || '',
    desc: r.description || '',
    imageUrl: r.image_url,
    active: r.active,
    sortOrder: r.sort_order,
  };
}

// Çiçek türü fiyatı değiştirmez; "Özel tasarım" seçilirse müşteriden tasarım isteği alınır.
export const FLOWER_TYPES = [
  { id: 'kesme', name: 'Kesme çiçek',   desc: 'Buket ya da vazoda aranjman' },
  { id: 'saksi', name: 'Saksı bitkisi', desc: 'Uzun ömürlü, saksıda canlı bitki' },
  { id: 'ozel',  name: 'Özel tasarım',  desc: 'Hayalinizdeki tasarımı siz anlatın' },
] as const;

export const CUSTOM_FLOWER_TYPE = 'ozel';
