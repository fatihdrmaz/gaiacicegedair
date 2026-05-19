import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const orderPatchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "paid", "processing", "delivered"]),
});

const itemPatchSchema = z.object({
  itemId: z.string().uuid(),
  status: z.enum(["pending", "processing", "delivered"]),
});

// Admin — B2C özel gün siparişinin durumunu günceller
export async function PATCH(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Yetki yok" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Tek bir özel gün satırının durumu (her talep ayrı ayrı yönetilir)
  const asItem = itemPatchSchema.safeParse(body);
  if (asItem.success) {
    const { itemId, status } = asItem.data;
    const patch: Record<string, unknown> = { status };
    if (status === "delivered") patch.delivered_at = new Date().toISOString();
    const { error } = await admin
      .from("b2c_order_items")
      .update(patch)
      .eq("id", itemId);
    if (error) {
      console.error("[portal/b2c] satır güncelleme hatası:", error);
      return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // Sipariş geneli durum
  const asOrder = orderPatchSchema.safeParse(body);
  if (asOrder.success) {
    const { id, status } = asOrder.data;
    const patch: Record<string, unknown> = { status };
    if (status === "delivered") {
      await admin
        .from("b2c_order_items")
        .update({ status: "delivered", delivered_at: new Date().toISOString() })
        .eq("order_id", id);
    }
    const { error } = await admin.from("b2c_orders").update(patch).eq("id", id);
    if (error) {
      console.error("[portal/b2c] güncelleme hatası:", error);
      return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
    }
    await admin.from("order_events").insert({
      order_id: id,
      order_type: "b2c",
      event_type: "status_change",
      new_status: status,
      created_by: user.id,
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Geçersiz veri" }, { status: 422 });
}
