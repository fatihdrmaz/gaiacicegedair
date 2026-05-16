import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/resend";
import { OzelGunHatirlatmaEmail } from "@/emails/ozel-gun-hatirlatma";

// Vercel Cron — her sabah çalışır, 3 gün sonraki özel günleri hatırlatır.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  // 3 gün sonrasının tarihi (YYYY-MM-DD)
  const target = new Date();
  target.setDate(target.getDate() + 3);
  const targetDate = target.toISOString().slice(0, 10);

  const admin = createAdminClient();
  const { data: items, error } = await admin
    .from("b2c_order_items")
    .select("*, b2c_orders(buyer_name, buyer_email, status)")
    .eq("event_date", targetDate);

  if (error) {
    console.error("[cron/ozel-gun] sorgu hatası:", error);
    return NextResponse.json({ error: "Sorgu hatası" }, { status: 500 });
  }

  let sent = 0;
  for (const item of items || []) {
    const order = item.b2c_orders;
    if (!order || order.status !== "paid" || !order.buyer_email) continue;
    try {
      await sendMail({
        to: order.buyer_email,
        subject: `Özel gün yaklaşıyor — ${item.day_name || "Özel gününüz"}`,
        react: OzelGunHatirlatmaEmail({
          buyerName: order.buyer_name || "Müşterimiz",
          dayName: item.day_name || "Özel gününüz",
          recipient: item.recipient || "",
          eventDate: targetDate,
        }),
      });
      sent += 1;
    } catch (err) {
      console.error("[cron/ozel-gun] e-posta hatası:", err);
    }
  }

  return NextResponse.json({ ok: true, date: targetDate, found: items?.length ?? 0, sent });
}
