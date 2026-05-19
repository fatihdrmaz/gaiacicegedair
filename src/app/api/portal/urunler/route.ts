import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Giriş yapmış kurumsal kullanıcının firmasına tanımlı ürünler
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ products: [] });

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!company) return NextResponse.json({ products: [] });

  const { data } = await supabase
    .from("company_products")
    .select("price, products(id, name, description, active)")
    .eq("company_id", company.id);

  const products = (data || [])
    .map((r) => {
      const p = r.products as unknown as
        | { id: string; name: string; description: string | null; active: boolean }
        | null;
      if (!p || !p.active) return null;
      return {
        id: p.id,
        name: p.name,
        description: p.description || "",
        price: Number(r.price) || 0,
      };
    })
    .filter((x): x is { id: string; name: string; description: string; price: number } => x !== null);

  return NextResponse.json({ products });
}
