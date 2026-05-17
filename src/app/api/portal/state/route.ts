import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PortalState } from "@/lib/portal-data";
import {
  mapOrder,
  orderToEvent,
  mapAddress,
  mapEmployee,
  mapPending,
  mapB2COrder,
} from "@/lib/portal-map";

const EMPTY: PortalState = {
  auth: null,
  orders: [],
  events: [],
  addresses: [],
  employees: [],
  pending: [],
  b2cOrders: [],
};

const ORDER_SELECT =
  "*, companies(name), company_addresses(label,address,city)";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(EMPTY);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "company";
  const isAdmin = role === "admin";

  // Admin tüm verileri görür; firma kullanıcısı yalnızca kendi firmasını.
  let companyId: string | null = null;
  let companyName: string | null = null;
  if (!isAdmin) {
    const { data: company } = await supabase
      .from("companies")
      .select("id, name")
      .eq("user_id", user.id)
      .maybeSingle();
    companyId = company?.id ?? null;
    companyName = company?.name ?? null;
  }

  let ordersQuery = supabase
    .from("corporate_orders")
    .select(ORDER_SELECT)
    .order("delivery_date", { ascending: true });
  if (!isAdmin && companyId) ordersQuery = ordersQuery.eq("company_id", companyId);
  if (!isAdmin && !companyId) ordersQuery = ordersQuery.eq("company_id", "00000000-0000-0000-0000-000000000000");

  const { data: orderRows } = await ordersQuery;

  let addresses: PortalState["addresses"] = [];
  let employees: PortalState["employees"] = [];
  if (companyId) {
    const [{ data: addrRows }, { data: empRows }] = await Promise.all([
      supabase.from("company_addresses").select("*").eq("company_id", companyId),
      supabase.from("company_employees").select("*").eq("company_id", companyId),
    ]);
    addresses = (addrRows || []).map(mapAddress);
    employees = (empRows || []).map(mapEmployee);
  }

  let pending: PortalState["pending"] = [];
  let b2cOrders: PortalState["b2cOrders"] = [];
  if (isAdmin) {
    const [{ data: pendingRows }, { data: b2cRows }] = await Promise.all([
      supabase
        .from("companies")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      supabase
        .from("b2c_orders")
        .select("*, b2c_order_items(*)")
        .order("created_at", { ascending: false }),
    ]);
    pending = (pendingRows || []).map(mapPending);
    b2cOrders = (b2cRows || []).map(mapB2COrder);
  }

  const orders = (orderRows || []).map(mapOrder);
  const events = (orderRows || [])
    .filter((o) => o.delivery_date)
    .map(orderToEvent);

  const state: PortalState = {
    auth: {
      type: isAdmin ? "admin" : "company",
      name: profile?.full_name || user.email || "Kullanıcı",
      company: companyName || undefined,
      email: user.email || "",
      role,
    },
    orders,
    events,
    addresses,
    employees,
    pending,
    b2cOrders,
  };

  return NextResponse.json(state);
}
