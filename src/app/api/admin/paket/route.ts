import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadPackages } from "@/lib/b2c-packages-server";

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

const fields = {
  name: z.string().trim().min(1, "Paket adı gerekli"),
  price: z.number().min(0, "Fiyat negatif olamaz"),
  description: z.string().optional().default(""),
  items: z.array(z.string().trim().min(1)).optional().default([]),
  sortOrder: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
};

const createSchema = z.object(fields);
const patchSchema = z.object({ id: z.string().min(1) }).extend(
  Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.optional()])) as {
    [K in keyof typeof fields]: z.ZodOptional<(typeof fields)[K]>;
  },
);

function toRow(d: Partial<z.infer<typeof createSchema>>) {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (d.name !== undefined) row.name = d.name;
  if (d.price !== undefined) row.price = d.price;
  if (d.description !== undefined) row.description = d.description || null;
  if (d.items !== undefined) row.items = d.items;
  if (d.sortOrder !== undefined) row.sort_order = d.sortOrder;
  if (d.active !== undefined) row.active = d.active;
  return row;
}

function tableMissing(message: string) {
  return /b2c_packages/.test(message)
    ? "Paket tablosu henüz oluşturulmamış. Supabase'de 018_b2c_packages.sql migration'ını çalıştırın."
    : message;
}

export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  return NextResponse.json({ packages: await loadPackages({ includeInactive: true }) });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Geçersiz veri" }, { status: 422 });
  }
  const { error } = await createAdminClient().from("b2c_packages").insert(toRow(parsed.data));
  if (error) {
    console.error("[admin/paket] ekleme hatası:", error);
    return NextResponse.json({ error: tableMissing(error.message) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Geçersiz veri" }, { status: 422 });
  }
  const { id, ...rest } = parsed.data;
  const { error } = await createAdminClient().from("b2c_packages").update(toRow(rest)).eq("id", id);
  if (error) {
    console.error("[admin/paket] güncelleme hatası:", error);
    return NextResponse.json({ error: tableMissing(error.message) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  const { error } = await createAdminClient().from("b2c_packages").delete().eq("id", id);
  if (error) {
    console.error("[admin/paket] silme hatası:", error);
    return NextResponse.json({ error: tableMissing(error.message) }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
