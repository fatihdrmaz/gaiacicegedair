import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail, GAIA_NOTIFY_EMAIL } from "@/lib/resend";
import { IletisimMesajiEmail } from "@/emails/iletisim-mesaji";

const schema = z.object({
  name: z.string().min(2, "Ad soyad gerekli"),
  email: z.string().email("Geçerli e-posta gerekli"),
  phone: z.string().optional().default(""),
  message: z.string().min(5, "Mesaj gerekli"),
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
      { error: parsed.error.issues[0]?.message || "Form hatalı" },
      { status: 422 },
    );
  }
  const data = parsed.data;

  const admin = createAdminClient();
  const { error } = await admin.from("contact_messages").insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    message: data.message,
    status: "new",
  });

  if (error) {
    console.error("[iletisim] insert hatası:", error);
    return NextResponse.json({ error: "Mesaj kaydedilemedi" }, { status: 500 });
  }

  try {
    await sendMail({
      to: GAIA_NOTIFY_EMAIL,
      subject: `Yeni iletişim mesajı: ${data.name}`,
      react: IletisimMesajiEmail({ data }),
    });
  } catch (err) {
    console.error("[iletisim] e-posta hatası:", err);
    // Kayıt başarılı; e-posta hatası isteği bozmaz.
  }

  return NextResponse.json({ ok: true });
}
