import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
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

const postSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug gerekli")
    .regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve - içerebilir"),
  title: z.string().min(1, "Başlık gerekli"),
  excerpt: z.string().optional().default(""),
  body: z.string().optional().default(""),
  category: z.string().optional().default("Rehber"),
  author: z.string().optional().default("GAIA Admin"),
  authorRole: z.string().optional().default(""),
  authorPhoto: z.string().optional().default(""),
  cover: z.string().optional().default(""),
  readMin: z.number().int().min(1).optional().default(4),
  related: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(false),
});

const patchSchema = postSchema.partial().extend({ id: z.string().uuid() });

function toRow(d: z.infer<typeof postSchema>) {
  return {
    slug: d.slug,
    title: d.title,
    excerpt: d.excerpt || null,
    body: d.body || null,
    category: d.category || null,
    author: d.author || null,
    author_role: d.authorRole || null,
    author_photo: d.authorPhoto || null,
    cover_url: d.cover || null,
    read_minutes: d.readMin,
    related: d.related,
    published: d.published,
    published_at: d.published ? new Date().toISOString() : null,
  };
}

function refresh(slug?: string) {
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const admin = createAdminClient();
  const { data } = await admin
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  return NextResponse.json({ posts: data || [] });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Form hatalı" },
      { status: 422 },
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("blog_posts")
    .insert(toRow(parsed.data))
    .select("id")
    .single();

  if (error) {
    const msg = /duplicate|unique/i.test(error.message)
      ? "Bu slug zaten kullanılıyor."
      : "Yazı oluşturulamadı.";
    return NextResponse.json({ error: msg }, { status: 409 });
  }

  refresh(parsed.data.slug);
  return NextResponse.json({ ok: true, id: data.id });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Form hatalı" },
      { status: 422 },
    );
  }
  const { id, ...rest } = parsed.data;

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("blog_posts")
    .select("published, published_at")
    .eq("id", id)
    .single();

  const row: Record<string, unknown> = {};
  if (rest.slug !== undefined) row.slug = rest.slug;
  if (rest.title !== undefined) row.title = rest.title;
  if (rest.excerpt !== undefined) row.excerpt = rest.excerpt || null;
  if (rest.body !== undefined) row.body = rest.body || null;
  if (rest.category !== undefined) row.category = rest.category || null;
  if (rest.author !== undefined) row.author = rest.author || null;
  if (rest.authorRole !== undefined) row.author_role = rest.authorRole || null;
  if (rest.authorPhoto !== undefined) row.author_photo = rest.authorPhoto || null;
  if (rest.cover !== undefined) row.cover_url = rest.cover || null;
  if (rest.readMin !== undefined) row.read_minutes = rest.readMin;
  if (rest.related !== undefined) row.related = rest.related;
  if (rest.published !== undefined) {
    row.published = rest.published;
    // İlk kez yayınlanıyorsa tarih ata
    if (rest.published && !existing?.published_at) {
      row.published_at = new Date().toISOString();
    }
  }

  const { error } = await admin.from("blog_posts").update(row).eq("id", id);
  if (error) {
    const msg = /duplicate|unique/i.test(error.message)
      ? "Bu slug zaten kullanılıyor."
      : "Yazı güncellenemedi.";
    return NextResponse.json({ error: msg }, { status: 409 });
  }

  refresh(rest.slug);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("blog_posts").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Yazı silinemedi" }, { status: 500 });
  }
  refresh();
  return NextResponse.json({ ok: true });
}
