import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { initCheckoutForm, iyzicoConfigured } from "@/lib/iyzico";

const PACKAGE_PRICES: Record<string, number> = {
  mini: 450,
  klasik: 850,
  premium: 1600,
  luks: 3200,
};

const daySchema = z.object({
  name: z.string().optional().default(""),
  date: z.string().optional().default(""),
  occasion: z.string().optional().default(""),
  recipient: z.string().optional().default(""),
  address: z.string().optional().default(""),
  time: z.string().optional().default("10:00"),
  note: z.string().optional().default(""),
  concept: z.string().optional().default(""),
  package: z.string().optional().default("klasik"),
});

const schema = z.object({
  days: z.array(daySchema).min(1, "En az bir özel gün gerekli"),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Sipariş eksik veya hatalı", issues: parsed.error.issues },
      { status: 422 },
    );
  }
  const { days } = parsed.data;

  // Fiyatlar sunucuda hesaplanır — istemciden gelen total'a güvenilmez.
  const items = days.map((d) => ({
    ...d,
    price: PACKAGE_PRICES[d.package] ?? PACKAGE_PRICES.klasik,
  }));
  const total = items.reduce((s, it) => s + it.price, 0);

  let userId: string | null = null;
  let userEmail: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
    userEmail = user?.email ?? null;
  } catch {
    userId = null;
  }

  const admin = createAdminClient();
  const buyerName = items[0]?.recipient || "GAIA Müşteri";
  const buyerEmail = userEmail || `siparis@cicegedair.com`;

  const { data: order, error: orderErr } = await admin
    .from("b2c_orders")
    .insert({
      user_id: userId,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      status: "pending",
      total_amount: total,
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    console.error("[odeme/baslat] sipariş hatası:", orderErr);
    return NextResponse.json({ error: "Sipariş oluşturulamadı" }, { status: 500 });
  }

  const { error: itemsErr } = await admin.from("b2c_order_items").insert(
    items.map((it) => ({
      order_id: order.id,
      day_name: it.name || null,
      occasion: it.occasion || null,
      event_date: it.date || null,
      recipient: it.recipient || null,
      address: it.address || null,
      delivery_time: it.time || "10:00",
      concept: it.concept || null,
      note: it.note || null,
      package: it.package,
      package_price: it.price,
      status: "pending",
    })),
  );

  if (itemsErr) {
    console.error("[odeme/baslat] satır hatası:", itemsErr);
    return NextResponse.json({ error: "Sipariş satırları kaydedilemedi" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // iyzico anahtarları yoksa ödeme atlanır — geliştirme modu.
  if (!iyzicoConfigured) {
    await admin
      .from("b2c_orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", order.id);
    return NextResponse.json({ ok: true, devMode: true, orderId: order.id, total });
  }

  try {
    const result = await initCheckoutForm({
      orderId: order.id,
      total,
      callbackUrl: `${siteUrl}/api/odeme/callback`,
      buyer: {
        id: userId || order.id,
        name: buyerName.split(" ")[0] || "GAIA",
        surname: buyerName.split(" ").slice(1).join(" ") || "Müşteri",
        email: buyerEmail,
        phone: "+905555555555",
        address: items[0]?.address || "İstanbul",
        city: "İstanbul",
      },
      basketItems: items.map((it, i) => ({
        id: `${order.id}-${i}`,
        name: `${it.name || "Özel gün"} — ${it.package}`,
        price: it.price,
      })),
    });

    if (result.status !== "success") {
      console.error("[odeme/baslat] iyzico:", result.errorMessage);
      return NextResponse.json(
        { error: result.errorMessage || "Ödeme başlatılamadı" },
        { status: 502 },
      );
    }

    if (result.token) {
      await admin
        .from("b2c_orders")
        .update({ payment_token: result.token })
        .eq("id", order.id);
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      total,
      paymentPageUrl: result.paymentPageUrl,
      checkoutFormContent: result.checkoutFormContent,
    });
  } catch (err) {
    console.error("[odeme/baslat] iyzico hatası:", err);
    return NextResponse.json({ error: "Ödeme sağlayıcısına ulaşılamadı" }, { status: 502 });
  }
}
