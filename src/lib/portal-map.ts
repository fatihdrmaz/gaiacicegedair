// Supabase satırlarını portal bileşenlerinin beklediği şekillere dönüştürür.
import type {
  PortalOrder,
  PortalEvent,
  PortalAddress,
  PortalEmployee,
  PortalPending,
  B2COrder,
} from "@/lib/portal-data";

export const TEMPLATE_LABELS: Record<string, string> = {
  lobi: "Lobi Yenileme",
  meeting: "Toplantı Masası",
  birthday: "Çalışan Doğumgünü",
  welcome: "VIP Karşılama",
  opening: "Açılış Çelengi",
  custom: "Özel Talep",
};

const TEMPLATE_EVENT_TYPE: Record<string, string> = {
  lobi: "lobi",
  meeting: "meeting",
  birthday: "gift",
  welcome: "event",
  opening: "opening",
  custom: "special",
};

const STATUS_MAP: Record<string, PortalOrder["status"]> = {
  pending: "pending",
  reviewing: "pending",
  approved: "approved",
  workshop: "production",
  production: "production",
  shipping: "shipping",
  delivered: "delivered",
  rejected: "rejected",
  draft: "draft",
};

export function mapStatus(s: string | null): PortalOrder["status"] {
  return STATUS_MAP[s || "pending"] || "pending";
}

type CorporateOrderRow = {
  id: string;
  company_id: string | null;
  created_by: string | null;
  template: string | null;
  recipient_name: string | null;
  delivery_date: string | null;
  concept: string | null;
  palette: string | null;
  note: string | null;
  budget: number | null;
  status: string | null;
  tracking_photos: string[] | null;
  created_at: string;
  companies?: { name: string | null } | null;
  company_addresses?: { label: string | null; address: string | null; city: string | null } | null;
};

export function mapOrder(row: CorporateOrderRow): PortalOrder {
  const tpl = row.template || "custom";
  const addr =
    row.company_addresses?.address ||
    row.company_addresses?.label ||
    "—";
  return {
    id: row.id,
    company: row.companies?.name || "—",
    type: TEMPLATE_LABELS[tpl] || tpl,
    recipient: row.recipient_name || "—",
    addr,
    date: row.delivery_date || "",
    amount: Number(row.budget) || 0,
    status: mapStatus(row.status),
    template: TEMPLATE_LABELS[tpl] || tpl,
    notes: row.note || row.concept || "",
    createdBy: row.created_by || "—",
    createdAt: (row.created_at || "").slice(0, 10),
    photos: row.tracking_photos || [],
    assignee: "—",
  };
}

export function orderToEvent(row: CorporateOrderRow): PortalEvent {
  const tpl = row.template || "custom";
  return {
    id: `ev-${row.id}`,
    date: row.delivery_date || "",
    type: TEMPLATE_EVENT_TYPE[tpl] || "special",
    title: `${TEMPLATE_LABELS[tpl] || tpl} — ${row.recipient_name || ""}`.trim(),
  };
}

type AddressRow = {
  id: string;
  label: string | null;
  city: string | null;
  address: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  usage_count: number | null;
  type: string | null;
};

export function mapAddress(row: AddressRow): PortalAddress {
  return {
    id: row.id,
    label: row.label || "—",
    city: row.city || "—",
    addr: row.address || "—",
    contact: row.contact_name || "—",
    phone: row.contact_phone || "—",
    usage: row.usage_count || 0,
    type: row.type || "office",
  };
}

type EmployeeRow = {
  id: string;
  full_name: string | null;
  department: string | null;
  birth_date: string | null;
  start_date: string | null;
};

export function mapEmployee(row: EmployeeRow): PortalEmployee {
  return {
    id: row.id,
    name: row.full_name || "—",
    role: row.department || "—",
    birthday: (row.birth_date || "").slice(5) || "",
    startDate: row.start_date || "",
    addr: "",
  };
}

type CompanyRow = {
  id: string;
  name: string | null;
  tax_no: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  sector: string | null;
  size: string | null;
};

export function mapPending(row: CompanyRow): PortalPending {
  return {
    id: row.id,
    company: row.name || "—",
    taxNo: row.tax_no || "—",
    contact: row.contact_name || "—",
    email: row.email || "—",
    phone: row.phone || "—",
    appliedAt: (row.created_at || "").slice(0, 10),
    sector: row.sector || "—",
    size: row.size || "—",
  };
}

type B2CItemRow = {
  id: string;
  day_name: string | null;
  occasion: string | null;
  event_date: string | null;
  recipient: string | null;
  address: string | null;
  delivery_time: string | null;
  concept: string | null;
  note: string | null;
  package: string | null;
  package_price: number | null;
  status: string | null;
};

type B2COrderRow = {
  id: string;
  buyer_name: string | null;
  buyer_email: string | null;
  status: string | null;
  total_amount: number | null;
  paid_at: string | null;
  created_at: string;
  b2c_order_items?: B2CItemRow[] | null;
};

export function mapB2COrder(row: B2COrderRow): B2COrder {
  return {
    id: row.id,
    buyerName: row.buyer_name || "—",
    buyerEmail: row.buyer_email || "—",
    status: row.status || "pending",
    totalAmount: Number(row.total_amount) || 0,
    paidAt: row.paid_at ? row.paid_at.slice(0, 10) : "",
    createdAt: (row.created_at || "").slice(0, 10),
    items: (row.b2c_order_items || []).map((it) => ({
      id: it.id,
      dayName: it.day_name || "—",
      occasion: it.occasion || "—",
      eventDate: it.event_date || "",
      recipient: it.recipient || "—",
      address: it.address || "—",
      deliveryTime: it.delivery_time || "",
      concept: it.concept || "—",
      note: it.note || "",
      package: it.package || "—",
      packagePrice: Number(it.package_price) || 0,
      status: it.status || "pending",
    })),
  };
}
