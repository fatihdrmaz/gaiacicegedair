import { createAdminClient } from "@/lib/supabase/admin";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  authorRole: string;
  authorPhoto: string;
  cover: string;
  readMin: number;
  related: string[];
  published: boolean;
  publishedAt: string;
};

type Row = Record<string, unknown>;

function mapPost(r: Row): BlogPost {
  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title ?? ""),
    excerpt: String(r.excerpt ?? ""),
    body: String(r.body ?? ""),
    category: String(r.category ?? "Rehber"),
    author: String(r.author ?? "GAIA Çiçeğe Dair"),
    authorRole: String(r.author_role ?? ""),
    authorPhoto: String(r.author_photo ?? ""),
    cover: String(r.cover_url ?? ""),
    readMin: Number(r.read_minutes ?? 4),
    related: Array.isArray(r.related) ? (r.related as string[]) : [],
    published: Boolean(r.published),
    publishedAt: r.published_at
      ? String(r.published_at).slice(0, 10)
      : String(r.created_at ?? "").slice(0, 10),
  };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return (data || []).map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data ? mapPost(data) : null;
}
