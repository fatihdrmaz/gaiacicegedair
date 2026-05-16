import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { retrieveCheckoutForm } from "@/lib/iyzico";
import { sendMail, GAIA_NOTIFY_EMAIL } from "@/lib/resend";
import { B2CSiparisOnaylandiEmail } from "@/emails/b2c-siparis-onaylandi";

export async function POST(req: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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

  const orderId = result.conversationId;
  const paid = result.paymentStatus === "SUCCESS" && result.status === "success";

  if (!orderId) {
    return NextResponse.redirect(`${siteUrl}/ozel-gunlerim?odeme=hata`, 303);
  }

  if (!paid) {
    await admin.from("b2c_orders").update({ status: "failed" }).eq("id", orderId);
    return NextResponse.redirect(`${siteUrl}/ozel-gunlerim?odeme=basarisiz`, 303);
  }

  await admin
    .from("b2c_orders")
    .update({
      status: "paid",
      payment_id: result.paymentId || null,
      paid_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  const { data: order } = await admin
    .from("b2c_orders")
    .select("*, b2c_order_items(*)")
    .eq("id", orderId)
    .single();

  await admin.from("order_events").insert({
    order_id: orderId,
    order_type: "b2c",
    event_type: "status_change",
    old_status: "pending",
    new_status: "paid",
    note: "Ödeme alındı",
  });

  if (order) {
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

  return NextResponse.redirect(`${siteUrl}/ozel-gunlerim?odeme=basarili`, 303);
}
