import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail, GAIA_NOTIFY_EMAIL } from "@/lib/resend";
import { YeniSiparisEmail } from "@/emails/yeni-siparis";
import { SiparisDurumuEmail } from "@/emails/siparis-durumu";
import { TEMPLATE_LABELS } from "@/lib/portal-map";

const APPROVAL_THRESHOLD = 5000;

const createSchema = z.object({
  template: z.string().optional().default("custom"),
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
  amount: z.number().optional().default(0),
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
    .select("id, name, monthly_budget")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!company) {
    return NextResponse.json(
      { error: "Firma kaydı bulunamadı" },
      { status: 403 },
    );
  }

  const requiresApproval = d.amount > APPROVAL_THRESHOLD;
  const admin = createAdminClient();

  const { data: order, error } = await admin
    .from("corporate_orders")
    .insert({
      company_id: company.id,
      created_by: user.id,
      template: d.template,
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
      budget: d.amount,
      requires_approval: requiresApproval,
      status: requiresApproval ? "reviewing" : "pending",
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
    new_status: requiresApproval ? "reviewing" : "pending",
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
          type: TEMPLATE_LABELS[d.template] || d.template,
          recipient: d.recipient,
          address: `${d.addr}, ${d.city}`,
          deliveryDate: d.date,
          budget: d.amount,
          requiresApproval,
          note: d.note,
        },
      }),
    });
  } catch (err) {
    console.error("[portal/siparis] e-posta hatası:", err);
  }

  return NextResponse.json({ ok: true, id: order.id, requiresApproval });
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
