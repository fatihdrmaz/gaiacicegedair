import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { iyzicoConfigured } from "@/lib/iyzico";
import { startCorporateCheckout } from "@/lib/corporate-checkout";
import { UNPAID_ORDER_STATUSES } from "@/lib/portal-data";

const schema = z.object({ id: z.string().uuid() });

// Firma — ödemesi tamamlanmamış kurumsal siparişin ödeme formunu yeniden açar.
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
  if (!iyzicoConfigured) return NextResponse.json({ error: "Kart ödemesi şu an kullanılamıyor" }, { status: 503 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz istek" }, { status: 422 });

  const { data: company } = await supabase
    .from("companies")
    .select("id, email, phone, contact_name")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!company) return NextResponse.json({ error: "Firma kaydı bulunamadı" }, { status: 403 });

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("corporate_orders")
    .select("id, status, template, address_text, city, budget")
    .eq("id", parsed.data.id)
    .eq("company_id", company.id)
    .maybeSingle();
  if (!order) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  if (!UNPAID_ORDER_STATUSES.includes(order.status)) {
    return NextResponse.json({ error: "Bu siparişin ödemesi zaten alınmış." }, { status: 409 });
  }

  try {
    const r = await startCorporateCheckout(req, order, company);
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: 502 });
    await admin.from("corporate_orders").update({ status: "awaiting_payment" }).eq("id", order.id);
    return NextResponse.json({ ok: true, paymentPageUrl: r.paymentPageUrl });
  } catch (err) {
    console.error("[portal/siparis/odeme] iyzico hatası:", err);
    return NextResponse.json({ error: "Ödeme sağlayıcısına ulaşılamadı" }, { status: 502 });
  }
}
