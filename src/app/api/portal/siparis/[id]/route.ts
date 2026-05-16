import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Bir kurumsal siparişin durum geçmişini (order_events) döndürür.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
  }

  // RLS sayesinde kullanıcı yalnızca erişebildiği siparişin olaylarını görür.
  const { data: order } = await supabase
    .from("corporate_orders")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (!order) {
    return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  }

  const { data: events } = await supabase
    .from("order_events")
    .select("*")
    .eq("order_id", id)
    .eq("order_type", "corporate")
    .order("created_at", { ascending: true });

  return NextResponse.json({ events: events || [] });
}
