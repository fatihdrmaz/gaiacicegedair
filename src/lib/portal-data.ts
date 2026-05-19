// Portal mock data — pure data, no React/JSX.

export type PortalOrder = {
  id: string;
  company: string;
  type: string;
  recipient: string;
  addr: string;
  date: string;
  amount: number;
  status: 'pending' | 'approved' | 'production' | 'shipping' | 'delivered' | 'rejected' | 'draft';
  template: string;
  notes: string;
  palette?: string;
  concept?: string;
  note?: string;
  phone?: string;
  city?: string;
  createdBy: string;
  createdAt: string;
  photos: string[];
  assignee: string;
};

export type PortalEvent = {
  id: string;
  date: string;
  type: string;
  title: string;
  addr?: string;
  recurring?: string;
  suggestion?: boolean;
};

export type PortalAddress = {
  id: string;
  label: string;
  city: string;
  addr: string;
  contact: string;
  phone: string;
  usage: number;
  type?: string;
};

export type PortalEmployee = {
  id: string;
  name: string;
  role: string;
  birthday: string;
  startDate: string;
  addr: string;
};

export type PortalPending = {
  id: string;
  company: string;
  taxNo: string;
  contact: string;
  email: string;
  phone: string;
  appliedAt: string;
  sector: string;
  size: string;
};

export type PortalAuth = {
  type: 'company' | 'admin';
  name: string;
  company?: string;
  email: string;
  role?: string;
} | null;

export type B2COrderItem = {
  id: string;
  dayName: string;
  occasion: string;
  eventDate: string;
  recipient: string;
  address: string;
  deliveryTime: string;
  concept: string;
  note: string;
  package: string;
  packagePrice: number;
  status: string;
};

export type B2COrder = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  status: string;
  totalAmount: number;
  paidAt: string;
  createdAt: string;
  items: B2COrderItem[];
};

export type PortalState = {
  auth: PortalAuth;
  orders: PortalOrder[];
  events: PortalEvent[];
  addresses: PortalAddress[];
  employees: PortalEmployee[];
  pending: PortalPending[];
  b2cOrders: B2COrder[];
};

export function mockOrders(): PortalOrder[] {
  return [
    { id: 'O-2026-0042', company: 'Akbank', type: 'Lobi Yenileme', recipient: 'Genel Merkez · Levent', addr: 'Sabancı Center, Levent', date: '2026-05-18', amount: 8500, status: 'production', template: 'Standart lobi', notes: 'Mor + beyaz palet', createdBy: 'Ayşe Kaya', createdAt: '2026-05-15', photos: ['cLobby'], assignee: 'Mert' },
    { id: 'O-2026-0043', company: 'Akbank', type: 'Çalışan Doğumgünü', recipient: 'Selin Yılmaz', addr: 'Etiler Mah. No: 14', date: '2026-05-16', amount: 1450, status: 'shipping', template: 'Doğumgünü buketi', notes: 'Pastel buket, kart: "İyi ki varsın"', createdBy: 'Ayşe Kaya', createdAt: '2026-05-14', photos: ['pBouquet'], assignee: 'Elif' },
    { id: 'O-2026-0044', company: 'Akbank', type: 'Müşteri Açılış', recipient: 'X Mağazacılık', addr: 'Bağdat Cad. 142', date: '2026-05-20', amount: 3200, status: 'approved', template: 'Açılış çelengi', notes: 'Kurdele yazısı: "Akbank Aileniz ile"', createdBy: 'Murat Tan', createdAt: '2026-05-15', photos: ['pWreath'], assignee: '—' },
    { id: 'O-2026-0045', company: 'Akbank', type: 'Toplantı Masası', recipient: 'Yönetim Kurulu', addr: 'Genel Merkez Kat 12', date: '2026-05-22', amount: 2800, status: 'pending', template: 'Standart toplantı', notes: '14 kişilik U-masa, alçak aranjman', createdBy: 'Ayşe Kaya', createdAt: '2026-05-16', photos: ['cMeeting'], assignee: '—' },
    { id: 'O-2026-0041', company: 'Akbank', type: 'Lobi Yenileme', recipient: 'Genel Merkez · Levent', addr: 'Sabancı Center, Levent', date: '2026-05-11', amount: 8500, status: 'delivered', template: 'Standart lobi', notes: '', createdBy: 'Ayşe Kaya', createdAt: '2026-05-08', photos: ['cLobby'], assignee: 'Mert' },
    { id: 'O-2026-0040', company: 'Akbank', type: 'VIP Karşılama', recipient: 'Mr. Tanaka (Japonya)', addr: 'Çırağan Palace', date: '2026-05-04', amount: 4800, status: 'delivered', template: 'VIP karşılama', notes: 'Beyaz orkide + kurumsal kart', createdBy: 'Murat Tan', createdAt: '2026-05-02', photos: ['cWelcome'], assignee: 'Naz' },
  ];
}

export function mockEvents(): PortalEvent[] {
  return [
    { id: 'e1', date: '2026-05-18', type: 'lobi', title: 'Haftalık Lobi Yenileme', addr: 'Sabancı Center', recurring: 'weekly' },
    { id: 'e2', date: '2026-05-22', type: 'meeting', title: 'Yönetim Kurulu Toplantısı', addr: 'GM Kat 12' },
    { id: 'e3', date: '2026-05-25', type: 'lobi', title: 'Haftalık Lobi Yenileme', addr: 'Sabancı Center', recurring: 'weekly' },
    { id: 'e4', date: '2026-06-01', type: 'lobi', title: 'Haftalık Lobi Yenileme', addr: 'Sabancı Center', recurring: 'weekly' },
    { id: 'e5', date: '2026-06-03', type: 'gift', title: 'Selin Y. — Doğumgünü' },
    { id: 'e6', date: '2026-06-08', type: 'special', title: 'Anneler Günü Programı', suggestion: true },
    { id: 'e7', date: '2026-06-12', type: 'opening', title: 'X Mağaza Açılışı', addr: 'Bağdat Cad.' },
    { id: 'e8', date: '2026-06-15', type: 'gift', title: 'Murat T. — İş yıldönümü' },
    { id: 'e9', date: '2026-06-22', type: 'event', title: 'Kurum Yıldönümü Galası', addr: 'Hilton Bomonti' },
    { id: 'e10', date: '2026-07-01', type: 'lobi', title: 'Haftalık Lobi Yenileme', addr: 'Sabancı Center', recurring: 'weekly' },
  ];
}

export function mockAddresses(): PortalAddress[] {
  return [
    { id: 'a1', label: 'Genel Merkez', city: 'İstanbul', addr: 'Sabancı Center, Levent', contact: 'Ayşe Kaya', phone: '+90 212 365 25 25', usage: 28 },
    { id: 'a2', label: 'Etiler Şube', city: 'İstanbul', addr: 'Nispetiye Cad. No 14, Etiler', contact: 'Resepsiyon', phone: '+90 212 358 14 00', usage: 12 },
    { id: 'a3', label: 'X Mağazacılık', city: 'İstanbul', addr: 'Bağdat Cad. 142, Kadıköy', contact: 'Necla Akın', phone: '+90 216 411 22 33', usage: 5, type: 'client' },
    { id: 'a4', label: 'Ankara Bölge', city: 'Ankara', addr: 'Eskişehir Yolu, Çankaya', contact: 'Hakan Demir', phone: '+90 312 444 25 25', usage: 8 },
  ];
}

export function mockEmployees(): PortalEmployee[] {
  return [
    { id: 'p1', name: 'Selin Yılmaz', role: 'CFO', birthday: '06-03', startDate: '2019-09-01', addr: 'Etiler Mah. No 14' },
    { id: 'p2', name: 'Murat Tan', role: 'Marketing Director', birthday: '06-15', startDate: '2018-04-15', addr: 'Levent, Maslak Yolu' },
    { id: 'p3', name: 'Ayşe Kaya', role: 'IK Müdürü', birthday: '09-22', startDate: '2020-01-10', addr: 'Nişantaşı' },
    { id: 'p4', name: 'Burak Doğan', role: 'CTO', birthday: '11-08', startDate: '2017-06-01', addr: 'Bebek' },
    { id: 'p5', name: 'Naz Güner', role: 'Müşteri İlişkileri', birthday: '02-14', startDate: '2021-03-22', addr: 'Beşiktaş' },
  ];
}

export function mockPending(): PortalPending[] {
  return [
    { id: 'PR-001', company: 'Kahve Dünyası A.Ş.', taxNo: '5290111111', contact: 'Murat Yıldız', email: 'murat@kahvedunyasi.com.tr', phone: '+90 555 444 33 22', appliedAt: '2026-05-15', sector: 'F&B', size: '200+' },
    { id: 'PR-002', company: 'Limak Holding', taxNo: '5810222222', contact: 'Selen Atalay', email: 's.atalay@limak.com.tr', phone: '+90 555 222 11 00', appliedAt: '2026-05-14', sector: 'Konaklama', size: '500+' },
    { id: 'PR-003', company: 'NuAgent Ajans', taxNo: '6710333333', contact: 'Fatih Durmaz', email: 'fatih@nuagent.com', phone: '+90 555 999 88 77', appliedAt: '2026-05-13', sector: 'Pazarlama', size: '10–50' },
  ];
}

export const EVENT_COLORS: Record<string, { bg: string; fg: string; label: string }> = {
  lobi:    { bg: '#E5F0E9', fg: '#3a6a4a', label: 'Lobi' },
  meeting: { bg: '#FFF0E5', fg: '#995a30', label: 'Toplantı' },
  gift:    { bg: '#F0E5FF', fg: '#5C2D9B', label: 'Hediye' },
  opening: { bg: '#E5F0FF', fg: '#1F5DAB', label: 'Açılış' },
  event:   { bg: '#FFE5F0', fg: '#A12D6A', label: 'Etkinlik' },
  special: { bg: 'var(--accent-soft)', fg: 'var(--accent-deep)', label: 'Özel Gün' },
};

export function getMockPortalState(): PortalState {
  return {
    auth: null,
    orders: mockOrders(),
    events: mockEvents(),
    addresses: mockAddresses(),
    employees: mockEmployees(),
    pending: mockPending(),
    b2cOrders: [],
  };
}
