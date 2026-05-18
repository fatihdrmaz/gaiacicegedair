import { createClient } from "@/lib/supabase/server";

export type GalleryCategory = { id: string; name: string };
export type GalleryImage = {
  id: string;
  categoryId: string;
  url: string;
  title: string;
};
export type GalleryData = {
  categories: GalleryCategory[];
  images: GalleryImage[];
};

// Genel galeri verisi — /galeri sayfası için (RLS: herkese açık okuma)
export async function getGalleryData(): Promise<GalleryData> {
  try {
    const supabase = await createClient();
    const [{ data: cats }, { data: imgs }] = await Promise.all([
      supabase.from("gallery_categories").select("id, name").order("sort_order"),
      supabase
        .from("gallery_images")
        .select("id, category_id, image_url, title")
        .order("created_at", { ascending: false }),
    ]);
    return {
      categories: (cats || []).map((c) => ({ id: c.id, name: c.name })),
      images: (imgs || []).map((i) => ({
        id: i.id,
        categoryId: i.category_id,
        url: i.image_url,
        title: i.title || "",
      })),
    };
  } catch {
    return { categories: [], images: [] };
  }
}
