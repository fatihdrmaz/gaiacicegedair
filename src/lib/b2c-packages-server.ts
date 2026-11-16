import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_CONCEPTS, DEFAULT_PACKAGES, mapConcept, mapPackage, type B2CConcept, type B2CPackage } from "@/lib/b2c-packages";

// Tablo henüz oluşturulmadıysa (migration 018 öncesi) varsayılan paketlere düşer.
export async function loadPackages({ includeInactive = false } = {}): Promise<B2CPackage[]> {
  const admin = createAdminClient();
  let query = admin.from("b2c_packages").select("*").order("sort_order").order("created_at");
  if (!includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) {
    console.error("[b2c-packages] tablo okunamadı, varsayılanlar kullanılıyor:", error.message);
    return includeInactive ? DEFAULT_PACKAGES : DEFAULT_PACKAGES.filter((p) => p.active);
  }
  return (data || []).map(mapPackage);
}

// Tablo henüz oluşturulmadıysa (migration 020 öncesi) varsayılan konseptlere düşer.
export async function loadConcepts({ includeInactive = false } = {}): Promise<B2CConcept[]> {
  const admin = createAdminClient();
  let query = admin.from("b2c_concepts").select("*").order("sort_order").order("created_at");
  if (!includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) {
    console.error("[b2c-concepts] tablo okunamadı, varsayılanlar kullanılıyor:", error.message);
    return includeInactive ? DEFAULT_CONCEPTS : DEFAULT_CONCEPTS.filter((c) => c.active);
  }
  return (data || []).map(mapConcept);
}
