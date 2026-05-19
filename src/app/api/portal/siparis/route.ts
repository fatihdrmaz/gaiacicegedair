import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail, GAIA_NOTIFY_EMAIL } from "@/lib/resend";
import { YeniSiparisEmail } from "@/emails/yeni-siparis";
import { SiparisDurumuEmail } from "@/emails/siparis-durumu";
import { TEMPLATE_LABELS } from "@/lib/portal-map";
import { initCheckoutForm, iyzicoConfigured } from "@/lib/iyzico";

const createSchema = z.object({
  productId: z.string().uuid("Ürün seçilmedi"),
  recipient: z.string().min(1, "Alıcı gerekli"),
  addrId: z.string().optional().default(""),
  addr: z.string().optional().default(""),
  city: z.string().optional().default("İstanbul"),
  date: z.string().min(1, "Teslim tarihi gerekli"),
  time: z.string().optional().default("10:00"),
  palette: z.string().optional().default(""),
  concept: z.string().optional().default(""),
  note: z.string().optional().default(""),
  recipientPhone: z.string().optional().default(""),
});

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "pending",
    "reviewing",
    "approved",
    "workshop",
    "shipping",
    "delivered",
    "rejected",
  ]),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Sipariş eksik veya hatalı", issues: parsed.error.issues },
      { status: 422 },
    );
  }
  const d = parsed.data;

  const { data: company } = await supabase
    .from("companies")
    .select("id, name, email, phone, contact_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!company) {
    return NextResponse.json(
      { error: "Firma kaydı bulunamadı" },
      { status: 403 },
    );
  }

  const admin = createAdminClient();

  // Ürün firmaya tanımlı mı? Fiyat sunucuda belirlenir.
  const { data: cp } = await admin
    .from("company_products")
    .select("price, products(name)")
    .eq("company_id", company.id)
    .eq("product_id", d.productId)
    .maybeSingle();

  if (!cp) {
    return NextResponse.json(
      { error: "Bu ürün firmanıza tanımlı değil." },
      { status: 403 },
    );
  }
  const price = Number(cp.price) || 0;
  const productName =
    (cp.products as unknown as { name?: string } | null)?.name || "Ürün";

  const { data: order, error } = await admin
    .from("corporate_orders")
    .insert({
      company_id: company.id,
      created_by: user.id,
      product_id: d.productId,
      template: productName,
      recipient_name: d.recipient,
      recipient_phone: d.recipientPhone || null,
      address_id: d.addrId || null,
      address_text: d.addr || null,
      city: d.city || null,
      delivery_date: d.date,
      delivery_time: d.time || "10:00",
      concept: d.concept || null,
      palette: d.palette || null,
      note: d.note || null,
      budget: price,
      requires_approval: false,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !order) {
    console.error("[portal/siparis] insert hatası:", error);
    return NextResponse.json({ error: "Sipariş oluşturulamadı" }, { status: 500 });
  }

  await admin.from("order_events").insert({
    order_id: order.id,
    order_type: "corporate",
    event_type: "status_change",
    new_status: "pending",
    note: "Sipariş oluşturuldu",
    created_by: user.id,
  });

  try {
    await sendMail({
      to: GAIA_NOTIFY_EMAIL,
      subject: `Yeni kurumsal sipariş: ${company.name}`,
      react: YeniSiparisEmail({
        data: {
          company: company.name || "—",
          type: productName,
          recipient: d.recipient,
          address: `${d.addr}, ${d.city}`,
          deliveryDate: d.date,
          budget: price,
          requiresApproval: false,
          note: d.note,
        },
      }),
    });
  } catch (err) {
    console.error("[portal/siparis] e-posta hatası:", err);
  }

  // Kredi kartı ödemesi — iyzico checkout
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (!iyzicoConfigured) {
    // iyzico anahtarı yok — geliştirme modu, sipariş oluşturuldu kabul edilir
    return NextResponse.json({ ok: true, id: order.id, devMode: true });
  }
  try {
    const result = await initCheckoutForm({
      orderId: `corp-${order.id}`,
      total: price,
      callbackUrl: `${siteUrl}/api/odeme/callback`,
      buyer: {
        id: company.id,
        name: (company.contact_name || "GAIA").split(" ")[0] || "GAIA",
        surname: (company.contact_name || "Müşteri").split(" ").slice(1).join(" ") || "Müşteri",
        email: company.email || "siparis@cicegedair.com",
        phone: company.phone || "+905555555555",
        address: `${d.addr || ""} ${d.city || "İstanbul"}`.trim(),
        city: d.city || "İstanbul",
      },
      basketItems: [{ id: order.id, name: productName, price }],
    });
    if (result.status !== "success" || !result.paymentPageUrl) {
      return NextResponse.json(
        { error: result.errorMessage || "Ödeme başlatılamadı" },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, id: order.id, paymentPageUrl: result.paymentPageUrl });
  } catch (err) {
    console.error("[portal/siparis] iyzico hatası:", err);
    return NextResponse.json({ error: "Ödeme sağlayıcısına ulaşılamadı" }, { status: 502 });
  }
}

// Kanban / admin durum güncellemesi
export async function PATCH(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Yetki yok" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 422 });
  }
  const { id, status } = parsed.data;

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("corporate_orders")
    .select("status, template, recipient_name, companies(name, email)")
    .eq("id", id)
    .single();

  const { error } = await admin
    .from("corporate_orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[portal/siparis] güncelleme hatası:", error);
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }

  await admin.from("order_events").insert({
    order_id: id,
    order_type: "corporate",
    event_type: "status_change",
    old_status: existing?.status || null,
    new_status: status,
    created_by: user.id,
  });

  // Firmaya durum bildirimi gönder (onaylandı / teslim edildi)
  if (status === "approved" || status === "delivered") {
    const company = existing?.companies as
      | { name?: string; email?: string }
      | undefined;
    if (company?.email) {
      try {
        await sendMail({
          to: company.email,
          subject:
            status === "approved"
              ? "Siparişiniz onaylandı — GAIA Çiçeğe Dair"
              : "Siparişiniz teslim edildi — GAIA Çiçeğe Dair",
          react: SiparisDurumuEmail({
            recipientName: company.name || "Firmamız",
            orderType:
              TEMPLATE_LABELS[existing?.template || "custom"] ||
              existing?.template ||
              "Sipariş",
            status,
          }),
        });
      } catch (err) {
        console.error("[portal/siparis] durum e-postası hatası:", err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
