import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadDesigns } from "@/lib/b2c-packages-server";
import { DESIGN_FLOWER_TYPES } from "@/lib/b2c-packages";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Giriş gerekli", status: 401 as const };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Yetki yok", status: 403 as const };
  return { ok: true as const };
}

const createSchema = z.object({
  conceptId: z.string().min(1),
  flowerType: z.enum(DESIGN_FLOWER_TYPES),
  name: z.string().trim().min(1, "Aranjman adı gerekli"),
  description: z.string().optional().default(""),
  imageUrl: z.string().url("Fotoğraf gerekli"),
  sortOrder: z.number().int().optional().default(0),
});
const patchSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

const tableMissing = (message: string) =>
  /b2c_designs/.test(message)
    ? "Aranjman tablosu henüz oluşturulmamış. Supabase'de 021_b2c_designs.sql migration'ını çalıştırın."
    : message;

export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  return NextResponse.json({ designs: await loadDesigns({ includeInactive: true }) });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Geçersiz veri" }, { status: 422 });
  const d = parsed.data;
  const { error } = await createAdminClient().from("b2c_designs").insert({
    concept_id: d.conceptId,
    flower_type: d.flowerType,
    name: d.name,
    description: d.description || null,
    image_url: d.imageUrl,
    sort_order: d.sortOrder,
  });
  if (error) return NextResponse.json({ error: tableMissing(error.message) }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Geçersiz veri" }, { status: 422 });
  const { id, name, description, imageUrl, sortOrder, active } = parsed.data;
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (name !== undefined) row.name = name;
  if (description !== undefined) row.description = description || null;
  if (imageUrl !== undefined) row.image_url = imageUrl;
  if (sortOrder !== undefined) row.sort_order = sortOrder;
  if (active !== undefined) row.active = active;
  const { error } = await createAdminClient().from("b2c_designs").update(row).eq("id", id);
  if (error) return NextResponse.json({ error: tableMissing(error.message) }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  const { error } = await createAdminClient().from("b2c_designs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: tableMissing(error.message) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
