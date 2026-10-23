import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cancelPayment, clientIp, refundTransaction, retrievePayment } from "@/lib/iyzico";
import { sendMail } from "@/lib/resend";
import { B2CIadeEmail } from "@/emails/b2c-iade";

const schema = z.object({
  orderId: z.string().uuid(),
  itemId: z.string().uuid().optional(),
});

type Item = {
  id: string;
  day_name: string | null;
  event_date: string | null;
  package_price: number | string | null;
  status: string | null;
};

const fail = (error: string, status = 409) => NextResponse.json({ error }, { status });

// Admin — B2C siparişinin tamamını ya da tek bir özel gününü iptal edip ücreti karta iade eder.
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("Giriş gerekli", 401);
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return fail("Yetki yok", 403);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("Geçersiz istek", 422);
  const { orderId, itemId } = parsed.data;

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("b2c_orders")
    .select("*, b2c_order_items(*)")
    .eq("id", orderId)
    .single();
  if (!order) return fail("Sipariş bulunamadı", 404);
  if (["pending", "failed"].includes(order.status)) return fail("Bu siparişin ödemesi tamamlanmamış.");

  const items: Item[] = order.b2c_order_items || [];
  const active = items.filter((it) => !["delivered", "refunded"].includes(it.status || ""));
  const targets = itemId ? active.filter((it) => it.id === itemId) : active;

  if (itemId && targets.length === 0) {
    const it = items.find((x) => x.id === itemId);
    if (!it) return fail("Özel gün bulunamadı", 404);
    return fail(it.status === "delivered" ? "Teslim edilmiş özel gün iade edilemez." : "Bu özel gün zaten iade edilmiş.");
  }
  if (targets.length === 0) return fail("İade edilebilecek özel gün kalmadı.");

  const price = (it: Item) => Number(it.package_price) || 0;
  const amount = targets.reduce((s, it) => s + price(it), 0);
  const ip = clientIp(req);
  const refundedIds: string[] = [];
  let method: "cancel" | "refund" | "manual";
  let note: string;

  if (!order.payment_id) {
    // Ödeme sağlayıcısından tahsilat yapılmamış (geliştirme modu) — yalnızca durum güncellenir.
    method = "manual";
    refundedIds.push(...targets.map((t) => t.id));
    note = "İptal edildi (karttan tahsilat kaydı yok)";
  } else {
    let cancelled = false;
    // Siparişin tamamı ve daha önce hiçbir kalem iade/teslim edilmemişse önce iptal denenir (komisyonsuz).
    if (targets.length === items.length) {
      const c = await cancelPayment(order.payment_id, ip).catch((e) => ({ status: "failure", errorMessage: String(e) }));
      if (c.status === "success") {
        cancelled = true;
        refundedIds.push(...targets.map((t) => t.id));
      } else {
        console.warn("[b2c-iade] iptal geçmedi, iadeye geçiliyor:", c.errorMessage);
      }
    }

    if (cancelled) {
      method = "cancel";
      note = `Ödeme iptal edildi · ${amount.toLocaleString("tr-TR")} ₺ (iyzico ödeme ${order.payment_id})`;
    } else {
      method = "refund";
      const detail = await retrievePayment(order.payment_id).catch(() => null);
      if (!detail || detail.status !== "success") {
        return fail("iyzico ödeme bilgisi alınamadı: " + (detail?.errorMessage || "bağlantı hatası"), 502);
      }
      const txs = detail.itemTransactions || [];
      const pairs = targets.map((it) => ({
        it,
        tx: txs.find((t) => t.itemId === it.id) ?? (items.length === 1 && txs.length === 1 ? txs[0] : undefined),
      }));
      if (pairs.some((p) => !p.tx)) {
        return fail("Bu siparişin iyzico kalemleri eşleştirilemedi; iadeyi iyzico panelinden yapın.");
      }

      const errors: string[] = [];
      for (const { it, tx } of pairs) {
        const r = await refundTransaction(tx!.paymentTransactionId, Math.min(price(it), tx!.paidPrice), ip)
          .catch((e) => ({ status: "failure", errorMessage: String(e) }));
        if (r.status === "success") refundedIds.push(it.id);
        else errors.push(`${it.day_name || "Özel gün"}: ${r.errorMessage || "iade reddedildi"}`);
      }
      const done = targets.filter((t) => refundedIds.includes(t.id));
      note = `İade edildi · ${done.reduce((s, it) => s + price(it), 0).toLocaleString("tr-TR")} ₺ · ${done.map((t) => t.day_name || "Özel gün").join(", ")}`;

      if (errors.length > 0 && refundedIds.length === 0) {
        return fail("iyzico iadeyi kabul etmedi — " + errors.join("; "), 502);
      }
      if (errors.length > 0) note += ` · Başarısız: ${errors.join("; ")}`;
    }
  }

  const now = new Date().toISOString();
  await admin.from("b2c_order_items").update({ status: "refunded" }).in("id", refundedIds);
  const remaining = items.filter((it) => it.status !== "refunded" && !refundedIds.includes(it.id));
  if (remaining.length === 0) {
    await admin.from("b2c_orders").update({ status: "refunded" }).eq("id", orderId);
  }
  await admin.from("order_events").insert({
    order_id: orderId,
    order_type: "b2c",
    event_type: "refund",
    old_status: order.status,
    new_status: remaining.length === 0 ? "refunded" : order.status,
    note,
    created_by: user.id,
  });

  const refundedItems = targets.filter((t) => refundedIds.includes(t.id));
  const refundedAmount = refundedItems.reduce((s, it) => s + price(it), 0);
  if (order.buyer_email && method !== "manual") {
    try {
      await sendMail({
        to: order.buyer_email,
        subject: method === "cancel" ? "Siparişiniz iptal edildi — GAIA Çiçeğe Dair" : "İadeniz başlatıldı — GAIA Çiçeğe Dair",
        react: B2CIadeEmail({
          buyerName: order.buyer_name || "Müşterimiz",
          amount: refundedAmount,
          items: refundedItems,
          cancelled: method === "cancel",
        }),
      });
    } catch (err) {
      console.error("[b2c-iade] e-posta hatası:", err);
    }
  }

  const partialFailure = refundedIds.length < targets.length;
  return NextResponse.json(
    { ok: !partialFailure, method, refundedAmount, at: now, ...(partialFailure ? { error: note } : {}) },
    { status: partialFailure ? 207 : 200 },
  );
}
