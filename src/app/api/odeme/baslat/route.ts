import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { initCheckoutForm, iyzicoConfigured, clientIp } from "@/lib/iyzico";
import { loadPackages } from "@/lib/b2c-packages-server";

const daySchema = z.object({
  name: z.string().optional().default(""),
  date: z.string().optional().default(""),
  occasion: z.string().optional().default(""),
  recipient: z.string().optional().default(""),
  address: z.string().optional().default(""),
  time: z.string().optional().default("10:00"),
  note: z.string().optional().default(""),
  concept: z.string().optional().default(""),
  package: z.string().min(1, "Paket seçilmeli"),
});

const schema = z.object({
  days: z.array(daySchema).min(1, "En az bir özel gün gerekli"),
  buyer: z.object({
    name: z.string().min(2, "Ad soyad gerekli"),
    email: z.string().email("Geçerli e-posta gerekli"),
    phone: z.string().min(7, "Telefon gerekli"),
  }),
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
  const { days, buyer } = parsed.data;

  // Fiyatlar sunucuda hesaplanır — istemciden gelen total'a güvenilmez.
  const packages = new Map((await loadPackages()).map((p) => [p.id, p]));
  if (days.some((d) => !packages.has(d.package))) {
    return NextResponse.json({ error: "Seçilen paket artık mevcut değil, lütfen paketi yeniden seçin." }, { status: 422 });
  }
  const items = days.map((d) => ({
    ...d,
    packageName: packages.get(d.package)!.name,
    price: packages.get(d.package)!.price,
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
  const buyerName = buyer.name;
  const buyerEmail = buyer.email;

  const { data: order, error: orderErr } = await admin
    .from("b2c_orders")
    .insert({
      user_id: userId,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_phone: buyer.phone,
      status: "pending",
      total_amount: total,
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    console.error("[odeme/baslat] sipariş hatası:", orderErr);
    return NextResponse.json({ error: "Sipariş oluşturulamadı" }, { status: 500 });
  }

  const { data: itemRows, error: itemsErr } = await admin.from("b2c_order_items").insert(
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
      package: it.packageName,
      package_price: it.price,
      status: "pending",
    })),
  ).select("id");

  if (itemsErr || !itemRows || itemRows.length !== items.length) {
    console.error("[odeme/baslat] satır hatası:", itemsErr);
    return NextResponse.json({ error: "Sipariş satırları kaydedilemedi" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gaiacicegedair.com";

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
      ip: clientIp(req),
      buyer: {
        id: userId || order.id,
        name: buyerName.split(" ")[0] || "GAIA",
        surname: buyerName.split(" ").slice(1).join(" ") || "Müşteri",
        email: buyerEmail,
        phone: buyer.phone,
        address: items[0]?.address || "İstanbul",
        city: "İstanbul",
      },
      // Sepet kalemi = sipariş satırı; iade sırasında iyzico işlemi bu id ile eşleşir.
      basketItems: items.map((it, i) => ({
        id: itemRows[i].id,
        name: `${it.name || "Özel gün"} — ${it.packageName}`,
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
