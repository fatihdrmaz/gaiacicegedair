import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Giriş gerekli", status: 401 as const };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return { error: "Yetki yok", status: 403 as const };
  return { ok: true as const };
}

const createSchema = z.object({
  name: z.string().min(1, "Ürün adı gerekli"),
  description: z.string().optional().default(""),
  basePrice: z.number().optional().default(0),
});

const patchSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.number().optional(),
  active: z.boolean().optional(),
});

export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const admin = createAdminClient();
  const { data } = await admin.from("products").select("*").order("created_at", { ascending: false });
  return NextResponse.json({ products: data || [] });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 }); }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Form hatalı" }, { status: 422 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("products")
    .insert({
      name: parsed.data.name,
      description: parsed.data.description || null,
      base_price: parsed.data.basePrice,
    })
    .select("id")
    .single();
  if (error) {
    console.error("[admin/urun] insert hatası:", error);
    return NextResponse.json({ error: "Ürün eklenemedi" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: data.id });
}

export async function PATCH(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 }); }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri" }, { status: 422 });
  const { id, name, description, basePrice, active } = parsed.data;
  const patch: Record<string, unknown> = {};
  if (name !== undefined) patch.name = name;
  if (description !== undefined) patch.description = description || null;
  if (basePrice !== undefined) patch.base_price = basePrice;
  if (active !== undefined) patch.active = active;
  const admin = createAdminClient();
  const { error } = await admin.from("products").update(patch).eq("id", id);
  if (error) {
    console.error("[admin/urun] güncelleme hatası:", error);
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) {
    console.error("[admin/urun] silme hatası:", error);
    return NextResponse.json({ error: "Silinemedi" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
