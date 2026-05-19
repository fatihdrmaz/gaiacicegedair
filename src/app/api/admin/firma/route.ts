import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapOrder } from "@/lib/portal-map";

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

const ORDER_SELECT = "*, companies(name), company_addresses(label,address,city)";

// GET — id varsa tek firma detayı, yoksa firma listesi
export async function GET(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const admin = createAdminClient();
  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    const { data } = await admin
      .from("companies")
      .select("id, name, status, sector, city, contact_name, email, phone, created_at")
      .order("name");
    return NextResponse.json({ companies: data || [] });
  }

  const [{ data: company }, { data: products }, { data: assignments }, { data: orderRows }] =
    await Promise.all([
      admin.from("companies").select("*").eq("id", id).maybeSingle(),
      admin.from("products").select("*").eq("active", true).order("name"),
      admin
        .from("company_products")
        .select("id, price, product_id, products(name, description)")
        .eq("company_id", id),
      admin.from("corporate_orders").select(ORDER_SELECT).eq("company_id", id).order("delivery_date", { ascending: false }),
    ]);

  if (!company) return NextResponse.json({ error: "Firma bulunamadı" }, { status: 404 });

  return NextResponse.json({
    company,
    products: products || [],
    assignments: assignments || [],
    orders: (orderRows || []).map(mapOrder),
  });
}

const assignSchema = z.object({
  companyId: z.string().uuid(),
  productId: z.string().uuid(),
  price: z.number().min(0),
});

// POST — firmaya ürün ata / fiyat güncelle
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 }); }
  const parsed = assignSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri" }, { status: 422 });
  const { companyId, productId, price } = parsed.data;
  const admin = createAdminClient();
  const { error } = await admin
    .from("company_products")
    .upsert(
      { company_id: companyId, product_id: productId, price },
      { onConflict: "company_id,product_id" },
    );
  if (error) {
    console.error("[admin/firma] atama hatası:", error);
    return NextResponse.json({ error: "Ürün atanamadı" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

// DELETE — atamayı kaldır
export async function DELETE(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const assignmentId = new URL(req.url).searchParams.get("assignmentId");
  if (!assignmentId) return NextResponse.json({ error: "assignmentId gerekli" }, { status: 400 });
  const admin = createAdminClient();
  const { error } = await admin.from("company_products").delete().eq("id", assignmentId);
  if (error) {
    console.error("[admin/firma] atama silme hatası:", error);
    return NextResponse.json({ error: "Silinemedi" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
