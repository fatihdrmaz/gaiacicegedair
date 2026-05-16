import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/resend";
import { FirmaOnaylandiEmail } from "@/emails/firma-onaylandi";
import { FirmaReddedildiEmail } from "@/emails/firma-reddedildi";

const schema = z.object({
  companyId: z.string().uuid(),
  action: z.enum(["approve", "reject"]),
  reason: z.string().optional().default(""),
});

export async function POST(req: Request) {
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

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 422 });
  }
  const { companyId, action, reason } = parsed.data;

  const admin = createAdminClient();
  const { data: company } = await admin
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single();

  if (!company) {
    return NextResponse.json({ error: "Firma bulunamadı" }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (action === "approve") {
    await admin
      .from("companies")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: user.id,
      })
      .eq("id", companyId);

    if (company.user_id) {
      await admin
        .from("profiles")
        .update({ role: "company" })
        .eq("id", company.user_id);
    }

    try {
      if (company.email) {
        await sendMail({
          to: company.email,
          subject: "Kurumsal başvurunuz onaylandı — GAIA Çiçeğe Dair",
          react: FirmaOnaylandiEmail({
            companyName: company.name || "Firmanız",
            contactName: company.contact_name || "Yetkili",
            loginUrl: `${siteUrl}/portal/giris`,
          }),
        });
      }
    } catch (err) {
      console.error("[portal/onay] e-posta hatası:", err);
    }

    return NextResponse.json({ ok: true, status: "approved" });
  }

  // reject
  await admin
    .from("companies")
    .update({ status: "rejected" })
    .eq("id", companyId);

  try {
    if (company.email) {
      await sendMail({
        to: company.email,
        subject: "Kurumsal başvurunuz hakkında — GAIA Çiçeğe Dair",
        react: FirmaReddedildiEmail({
          companyName: company.name || "Firmanız",
          contactName: company.contact_name || "Yetkili",
          reason,
        }),
      });
    }
  } catch (err) {
    console.error("[portal/onay] e-posta hatası:", err);
  }

  return NextResponse.json({ ok: true, status: "rejected" });
}
