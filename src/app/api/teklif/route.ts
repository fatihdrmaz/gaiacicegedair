import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail, GAIA_NOTIFY_EMAIL } from "@/lib/resend";
import { TeklifAlindiEmail } from "@/emails/teklif-alindi";
import { TeklifGaiaEmail } from "@/emails/teklif-gaia";

const schema = z.object({
  ad: z.string().min(2, "Ad gerekli"),
  firma: z.string().optional().default(""),
  tel: z.string().min(7, "Telefon gerekli"),
  email: z.string().email("Geçerli e-posta gerekli"),
  tip: z.string().min(1),
  konsept: z.string().optional().default(""),
  kisi: z.string().optional().default(""),
  tarih: z.string().optional().default(""),
  mekan: z.string().optional().default(""),
  butce: z.string().optional().default(""),
  notlar: z.string().optional().default(""),
  files: z.array(z.string()).optional().default([]),
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
      { error: "Form eksik veya hatalı", issues: parsed.error.issues },
      { status: 422 },
    );
  }
  const data = parsed.data;

  // Giriş yapmış kullanıcı varsa user_id eşle (anonim de olabilir)
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    userId = null;
  }

  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("quote_requests")
    .insert({
      user_id: userId,
      ad: data.ad,
      firma: data.firma || null,
      tel: data.tel,
      email: data.email,
      tip: data.tip,
      konsept: data.konsept || null,
      kisi: data.kisi || null,
      tarih: data.tarih || null,
      mekan: data.mekan || null,
      butce: data.butce || null,
      notlar: data.notlar || null,
      files: data.files,
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[teklif] insert hatası:", error);
    return NextResponse.json(
      { error: "Kayıt oluşturulamadı" },
      { status: 500 },
    );
  }

  try {
    await Promise.all([
      sendMail({
        to: data.email,
        subject: "Teklifinizi aldık — GAIA Çiçeğe Dair",
        react: TeklifAlindiEmail({ data }),
      }),
      sendMail({
        to: GAIA_NOTIFY_EMAIL,
        subject: `Yeni teklif talebi: ${data.tip}`,
        react: TeklifGaiaEmail({ data }),
      }),
    ]);
  } catch (err) {
    console.error("[teklif] e-posta hatası:", err);
    // Kayıt başarılı; e-posta hatası isteği bozmaz.
  }

  return NextResponse.json({ ok: true, id: row.id });
}
