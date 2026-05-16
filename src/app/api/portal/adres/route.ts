import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const createSchema = z.object({
  label: z.string().min(1, "Etiket gerekli"),
  type: z.enum(["office", "branch", "client"]).optional().default("office"),
  address: z.string().min(1, "Adres gerekli"),
  city: z.string().optional().default("İstanbul"),
  contactName: z.string().optional().default(""),
  contactPhone: z.string().optional().default(""),
});

async function resolveCompany() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Giriş gerekli", status: 401 as const };
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!company) return { error: "Firma kaydı bulunamadı", status: 403 as const };
  return { companyId: company.id };
}

export async function POST(req: Request) {
  const ctx = await resolveCompany();
  if ("error" in ctx) {
    return NextResponse.json({ error: ctx.error }, { status: ctx.status });
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
      { error: parsed.error.issues[0]?.message || "Form hatalı" },
      { status: 422 },
    );
  }
  const d = parsed.data;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("company_addresses")
    .insert({
      company_id: ctx.companyId,
      label: d.label,
      type: d.type,
      address: d.address,
      city: d.city,
      contact_name: d.contactName || null,
      contact_phone: d.contactPhone || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[portal/adres] insert hatası:", error);
    return NextResponse.json({ error: "Adres eklenemedi" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: data.id });
}

export async function DELETE(req: Request) {
  const ctx = await resolveCompany();
  if ("error" in ctx) {
    return NextResponse.json({ error: ctx.error }, { status: ctx.status });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  }

  const admin = createAdminClient();
  // Yalnızca kendi firmasının adresini silebilir
  const { error } = await admin
    .from("company_addresses")
    .delete()
    .eq("id", id)
    .eq("company_id", ctx.companyId);

  if (error) {
    console.error("[portal/adres] silme hatası:", error);
    return NextResponse.json({ error: "Adres silinemedi" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
