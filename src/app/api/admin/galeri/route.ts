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
  if (profile?.role !== "admin") {
    return { error: "Yetki yok", status: 403 as const };
  }
  return { ok: true as const };
}

const categorySchema = z.object({
  action: z.literal("category"),
  name: z.string().min(1, "Kategori adı gerekli"),
});

const imageSchema = z.object({
  action: z.literal("image"),
  categoryId: z.string().uuid(),
  imageUrl: z.string().url(),
  title: z.string().optional().default(""),
});

export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }
  const admin = createAdminClient();
  const [{ data: categories }, { data: images }] = await Promise.all([
    admin.from("gallery_categories").select("*").order("sort_order"),
    admin.from("gallery_images").select("*").order("created_at", { ascending: false }),
  ]);
  return NextResponse.json({ categories: categories || [], images: images || [] });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const admin = createAdminClient();

  const asCategory = categorySchema.safeParse(body);
  if (asCategory.success) {
    const { count } = await admin
      .from("gallery_categories")
      .select("id", { count: "exact", head: true });
    const { data, error } = await admin
      .from("gallery_categories")
      .insert({ name: asCategory.data.name, sort_order: (count || 0) + 1 })
      .select("id")
      .single();
    if (error) {
      console.error("[admin/galeri] kategori hatası:", error);
      return NextResponse.json({ error: "Kategori eklenemedi" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: data.id });
  }

  const asImage = imageSchema.safeParse(body);
  if (asImage.success) {
    const { data, error } = await admin
      .from("gallery_images")
      .insert({
        category_id: asImage.data.categoryId,
        image_url: asImage.data.imageUrl,
        title: asImage.data.title || null,
      })
      .select("id")
      .single();
    if (error) {
      console.error("[admin/galeri] görsel hatası:", error);
      return NextResponse.json({ error: "Görsel eklenemedi" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: data.id });
  }

  return NextResponse.json({ error: "Geçersiz veri" }, { status: 422 });
}

export async function DELETE(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  if (!id || (type !== "category" && type !== "image")) {
    return NextResponse.json({ error: "Geçersiz parametre" }, { status: 400 });
  }

  const admin = createAdminClient();
  const table = type === "category" ? "gallery_categories" : "gallery_images";
  const { error } = await admin.from(table).delete().eq("id", id);
  if (error) {
    console.error("[admin/galeri] silme hatası:", error);
    return NextResponse.json({ error: "Silinemedi" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
