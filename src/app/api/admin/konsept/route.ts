import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadConcepts } from "@/lib/b2c-packages-server";

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

const fields = {
  name: z.string().trim().min(1, "Konsept adı gerekli"),
  tagline: z.string().optional().default(""),
  description: z.string().optional().default(""),
  imageUrl: z.string().url().nullable().optional(),
  sortOrder: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
};
const createSchema = z.object(fields);
const patchSchema = z.object({
  id: z.string().min(1),
  name: fields.name.optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().nullable().optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

function toRow(d: Partial<z.infer<typeof createSchema>>) {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (d.name !== undefined) row.name = d.name;
  if (d.tagline !== undefined) row.tagline = d.tagline || null;
  if (d.description !== undefined) row.description = d.description || null;
  if (d.imageUrl !== undefined) row.image_url = d.imageUrl;
  if (d.sortOrder !== undefined) row.sort_order = d.sortOrder;
  if (d.active !== undefined) row.active = d.active;
  return row;
}

const tableMissing = (message: string) =>
  /b2c_concepts/.test(message)
    ? "Konsept tablosu henüz oluşturulmamış. Supabase'de 020_b2c_concepts.sql migration'ını çalıştırın."
    : message;

export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  return NextResponse.json({ concepts: await loadConcepts({ includeInactive: true }) });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Geçersiz veri" }, { status: 422 });
  const { error } = await createAdminClient().from("b2c_concepts").insert(toRow(parsed.data));
  if (error) return NextResponse.json({ error: tableMissing(error.message) }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Geçersiz veri" }, { status: 422 });
  const { id, ...rest } = parsed.data;
  const { error } = await createAdminClient().from("b2c_concepts").update(toRow(rest)).eq("id", id);
  if (error) return NextResponse.json({ error: tableMissing(error.message) }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  const { error } = await createAdminClient().from("b2c_concepts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: tableMissing(error.message) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
