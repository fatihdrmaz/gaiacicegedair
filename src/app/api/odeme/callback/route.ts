import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { retrieveCheckoutForm } from "@/lib/iyzico";
import { sendMail, GAIA_NOTIFY_EMAIL } from "@/lib/resend";
import { B2CSiparisOnaylandiEmail } from "@/emails/b2c-siparis-onaylandi";
import { YeniSiparisEmail } from "@/emails/yeni-siparis";
import { SiparisDurumuEmail } from "@/emails/siparis-durumu";
import { UNPAID_ORDER_STATUSES } from "@/lib/portal-data";

export async function POST(req: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gaiacicegedair.com";

  let token: string | null = null;
  try {
    const form = await req.formData();
    token = (form.get("token") as string) || null;
  } catch {
    token = null;
  }

  if (!token) {
    return NextResponse.redirect(`${siteUrl}/ozel-gunlerim?odeme=hata`, 303);
  }

  const admin = createAdminClient();

  let result;
  try {
    result = await retrieveCheckoutForm(token);
  } catch (err) {
    console.error("[odeme/callback] iyzico hatası:", err);
    return NextResponse.redirect(`${siteUrl}/ozel-gunlerim?odeme=hata`, 303);
  }

  // iyzico detay yanıtında conversationId boş gelebiliyor; basketId sipariş kimliğini her zaman taşır.
  const conv = result.basketId || result.conversationId || "";
  const paid = result.paymentStatus === "SUCCESS" && result.status === "success";

  if (!conv) {
    return NextResponse.redirect(`${siteUrl}/ozel-gunlerim?odeme=hata`, 303);
  }

  // Kurumsal sipariş ödemesi (sepet kimliği "corp-" ön ekli)
  if (conv.startsWith("corp-")) {
    const corpId = conv.slice(5);
    const detailUrl = `${siteUrl}/portal/siparisler/${corpId}`;

    if (!paid) {
      const { data: failedRows } = await admin
        .from("corporate_orders")
        .update({ status: "payment_failed", updated_at: new Date().toISOString() })
        .eq("id", corpId)
        .in("status", UNPAID_ORDER_STATUSES)
        .select("id");
      if (failedRows?.length) {
        await admin.from("order_events").insert({
          order_id: corpId,
          order_type: "corporate",
          event_type: "status_change",
          new_status: "payment_failed",
          note: `Ödeme başarısız${result.errorMessage ? ": " + result.errorMessage : ""}`,
        });
      }
      return NextResponse.redirect(`${detailUrl}?odeme=basarisiz`, 303);
    }

    // Yalnızca ödeme bekleyen sipariş güncellenir — aynı dönüş tekrar gelirse e-postalar yinelenmez.
    const { data: paidRows } = await admin
      .from("corporate_orders")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", corpId)
      .in("status", UNPAID_ORDER_STATUSES)
      .select("template, recipient_name, address_text, city, delivery_date, budget, note, companies(name, email, contact_name)");
    const o = paidRows?.[0];
    if (o) {
      const amount = Number(o.budget) || 0;
      await admin.from("order_events").insert({
        order_id: corpId,
        order_type: "corporate",
        event_type: "status_change",
        new_status: "approved",
        note: `Ödeme alındı · ${amount.toLocaleString("tr-TR")} ₺ (iyzico ödeme ${result.paymentId || "—"})`,
      });
      const company = (o.companies as unknown as { name?: string; email?: string; contact_name?: string } | null) || {};
      try {
        await Promise.all([
          sendMail({
            to: GAIA_NOTIFY_EMAIL,
            subject: `Yeni kurumsal sipariş (ödendi): ${company.name || "Firma"}`,
            react: YeniSiparisEmail({
              data: {
                company: company.name || "—",
                type: o.template || "—",
                recipient: o.recipient_name || "—",
                address: [o.address_text, o.city].filter(Boolean).join(", ") || "—",
                deliveryDate: o.delivery_date || "—",
                budget: amount,
                requiresApproval: false,
                note: o.note || "",
              },
            }),
          }),
          ...(company.email
            ? [sendMail({
                to: company.email,
                subject: "Ödemeniz alındı — GAIA Çiçeğe Dair",
                react: SiparisDurumuEmail({
                  recipientName: company.contact_name || company.name || "Müşterimiz",
                  orderType: o.template || "Kurumsal sipariş",
                  status: "paid",
                }),
              })]
            : []),
        ]);
      } catch (err) {
        console.error("[odeme/callback] kurumsal e-posta hatası:", err);
      }
    }
    return NextResponse.redirect(`${detailUrl}?odeme=basarili`, 303);
  }

  const orderId = conv;

  if (!paid) {
    await admin.from("b2c_orders").update({ status: "failed" }).eq("id", orderId).eq("status", "pending");
    return NextResponse.redirect(`${siteUrl}/ozel-gunlerim?odeme=basarisiz`, 303);
  }

  // Yalnızca bekleyen sipariş ödendi yapılır — aynı dönüş tekrar gelirse e-postalar yinelenmez.
  const { data: paidRows } = await admin
    .from("b2c_orders")
    .update({
      status: "paid",
      payment_id: result.paymentId || null,
      paid_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("status", "pending")
    .select("id");
  const firstTime = Boolean(paidRows?.length);

  const { data: order } = await admin
    .from("b2c_orders")
    .select("*, b2c_order_items(*)")
    .eq("id", orderId)
    .single();

  if (firstTime) await admin.from("order_events").insert({
    order_id: orderId,
    order_type: "b2c",
    event_type: "status_change",
    old_status: "pending",
    new_status: "paid",
    note: "Ödeme alındı",
  });

  if (order && firstTime) {
    try {
      const items = order.b2c_order_items || [];
      const customerMail = order.buyer_email
        ? [
            sendMail({
              to: order.buyer_email,
              subject: "Ödemeniz alındı — GAIA Çiçeğe Dair",
              react: B2CSiparisOnaylandiEmail({
                buyerName: order.buyer_name || "Müşterimiz",
                total: Number(order.total_amount) || 0,
                items,
              }),
            }),
          ]
        : [];
      await Promise.all([
        ...customerMail,
        sendMail({
          to: GAIA_NOTIFY_EMAIL,
          subject: `Yeni B2C sipariş: ${items.length} özel gün`,
          react: B2CSiparisOnaylandiEmail({
            buyerName: order.buyer_name || "Müşteri",
            total: Number(order.total_amount) || 0,
            items,
          }),
        }),
      ]);
    } catch (err) {
      console.error("[odeme/callback] e-posta hatası:", err);
    }
  }

  const qs = new URLSearchParams({
    odeme: "basarili",
    tutar: String(Number(order?.total_amount) || 0),
    gun: String(order?.b2c_order_items?.length || 0),
  });
  return NextResponse.redirect(`${siteUrl}/ozel-gunlerim?${qs}`, 303);
}
