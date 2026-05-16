import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail, GAIA_NOTIFY_EMAIL } from "@/lib/resend";
import { YeniFirmaBasvurusuEmail } from "@/emails/yeni-firma-basvurusu";

const schema = z.object({
  company: z.string().min(2, "Firma ünvanı gerekli"),
  taxNo: z.string().optional().default(""),
  taxOffice: z.string().optional().default(""),
  sector: z.string().optional().default(""),
  size: z.string().optional().default(""),
  contact: z.string().min(2, "Yetkili adı gerekli"),
  role: z.string().optional().default(""),
  email: z.string().email("Geçerli e-posta gerekli"),
  phone: z.string().min(7, "Telefon gerekli"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
  address: z.string().optional().default(""),
  city: z.string().optional().default("İstanbul"),
  kvkk: z.boolean().optional().default(false),
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
  const d = parsed.data;

  const admin = createAdminClient();

  // Auth kullanıcısı oluştur (e-posta doğrulamasız — onay GAIA tarafında)
  const { data: created, error: authErr } = await admin.auth.admin.createUser({
    email: d.email,
    password: d.password,
    email_confirm: true,
    user_metadata: { full_name: d.contact, phone: d.phone },
  });

  if (authErr || !created.user) {
    const msg = /already|registered|exists/i.test(authErr?.message || "")
      ? "Bu e-posta ile zaten bir hesap var."
      : "Hesap oluşturulamadı.";
    return NextResponse.json({ error: msg }, { status: 409 });
  }

  const userId = created.user.id;

  const { error: companyErr } = await admin.from("companies").insert({
    user_id: userId,
    name: d.company,
    tax_no: d.taxNo || null,
    tax_office: d.taxOffice || null,
    sector: d.sector || null,
    size: d.size || null,
    contact_name: d.contact,
    contact_role: d.role || null,
    email: d.email,
    phone: d.phone,
    address: d.address || null,
    city: d.city,
    status: "pending",
    kvkk: d.kvkk,
  });

  if (companyErr) {
    // Auth kullanıcısını geri al — yarım kayıt bırakma
    await admin.auth.admin.deleteUser(userId);
    console.error("[portal/kayit] firma kaydı hatası:", companyErr);
    return NextResponse.json(
      { error: "Firma kaydı oluşturulamadı." },
      { status: 500 },
    );
  }

  try {
    await sendMail({
      to: GAIA_NOTIFY_EMAIL,
      subject: `Yeni kurumsal başvuru: ${d.company}`,
      react: YeniFirmaBasvurusuEmail({
        data: {
          company: d.company,
          taxNo: d.taxNo,
          contact: d.contact,
          contactRole: d.role,
          email: d.email,
          phone: d.phone,
          sector: d.sector,
          size: d.size,
          address: d.address,
          city: d.city,
        },
      }),
    });
  } catch (err) {
    console.error("[portal/kayit] e-posta hatası:", err);
  }

  return NextResponse.json({ ok: true });
}
