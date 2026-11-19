import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { initCheckoutForm, iyzicoConfigured, clientIp } from "@/lib/iyzico";
import { loadConcepts, loadDesigns, loadPackages } from "@/lib/b2c-packages-server";
import { CUSTOM_FLOWER_TYPE, FLOWER_TYPES } from "@/lib/b2c-packages";
import { dayStep1Errors, dayStep2Errors, dayStep3Errors } from "@/lib/b2c-rules";

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
  flowerType: z.string().optional().default(""),
  designNote: z.string().max(500).optional().default(""),
  designId: z.string().optional().default(""),
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

  const [pkgList, conceptList, designList] = await Promise.all([loadPackages(), loadConcepts(), loadDesigns()]);
  const designsFor = (conceptId: string, type: string) =>
    designList.filter((x) => x.conceptId === conceptId && x.flowerType === type);
  const valid = {
    conceptIds: conceptList.map((c) => c.id),
    packageIds: pkgList.map((p) => p.id),
    flowerTypeIds: FLOWER_TYPES.map((f) => f.id),
    customId: CUSTOM_FLOWER_TYPE,
    designIdsFor: (conceptId: string, type: string) => designsFor(conceptId, type).map((x) => x.id),
  };
  for (const [i, d] of days.entries()) {
    const msg = Object.values({ ...dayStep1Errors(d), ...dayStep2Errors(d), ...dayStep3Errors(d, valid) })[0];
    if (msg) return NextResponse.json({ error: `${i + 1}. özel gün: ${msg}` }, { status: 422 });
  }

  // Fiyatlar sunucuda hesaplanır — istemciden gelen total'a güvenilmez.
  const packages = new Map(pkgList.map((p) => [p.id, p]));
  const concepts = new Map(conceptList.map((c) => [c.id, c]));
  const items = days.map((d) => ({
    ...d,
    packageName: packages.get(d.package)!.name,
    price: packages.get(d.package)!.price,
    conceptName: concepts.get(d.concept)!.name,
    flowerTypeName: FLOWER_TYPES.find((f) => f.id === d.flowerType)!.name,
    designNote: d.flowerType === CUSTOM_FLOWER_TYPE ? d.designNote.trim() : "",
    design: d.flowerType === CUSTOM_FLOWER_TYPE ? undefined : designsFor(d.concept, d.flowerType).find((x) => x.id === d.designId),
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

  const rowFor = (it: (typeof items)[number], withNewColumns: boolean) => ({
    order_id: order.id,
    day_name: it.name || null,
    occasion: it.occasion || null,
    event_date: it.date || null,
    recipient: it.recipient || null,
    address: it.address || null,
    delivery_time: it.time || "10:00",
    note: it.note || null,
    package: it.packageName,
    package_price: it.price,
    status: "pending",
    ...(withNewColumns
      ? {
          concept: it.conceptName,
          flower_type: it.flowerTypeName,
          design_note: it.designNote || null,
          design_option: it.design?.name || null,
          design_image: it.design?.imageUrl || null,
        }
      // yeni sütunlar yoksa (migration öncesi) seçimler konsept alanında saklanır
      : { concept: [it.conceptName, it.flowerTypeName, it.design?.name, it.designNote].filter(Boolean).join(" · ") }),
  });
  let { data: itemRows, error: itemsErr } = await admin
    .from("b2c_order_items")
    .insert(items.map((it) => rowFor(it, true)))
    .select("id");
  if (itemsErr && /flower_type|design_note|design_option|design_image/.test(itemsErr.message)) {
    ({ data: itemRows, error: itemsErr } = await admin
      .from("b2c_order_items")
      .insert(items.map((it) => rowFor(it, false)))
      .select("id"));
  }

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
