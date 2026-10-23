import { clientIp, initCheckoutForm } from "@/lib/iyzico";

type Company = { id: string; email: string | null; phone: string | null; contact_name: string | null };
type Order = { id: string; template: string | null; address_text: string | null; city: string | null; budget: number | string | null };

// Kurumsal siparişin iyzico ödeme formunu açar; iyzico sepet/konuşma kimliği "corp-<sipariş>" olur.
export async function startCorporateCheckout(req: Request, order: Order, company: Company) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gaiacicegedair.com";
  const price = Number(order.budget) || 0;
  if (price <= 0) return { error: "Sipariş tutarı geçersiz; GAIA ile iletişime geçin." };

  const contact = company.contact_name || "GAIA Müşteri";
  const result = await initCheckoutForm({
    orderId: `corp-${order.id}`,
    total: price,
    callbackUrl: `${siteUrl}/api/odeme/callback`,
    ip: clientIp(req),
    buyer: {
      id: company.id,
      name: contact.split(" ")[0] || "GAIA",
      surname: contact.split(" ").slice(1).join(" ") || "Müşteri",
      email: company.email || "siparis@gaiacicegedair.com",
      phone: company.phone || "+905555555555",
      address: `${order.address_text || ""} ${order.city || "İstanbul"}`.trim(),
      city: order.city || "İstanbul",
    },
    basketItems: [{ id: order.id, name: order.template || "Kurumsal sipariş", price }],
  });
  if (result.status !== "success" || !result.paymentPageUrl) {
    console.error("[corporate-checkout] iyzico:", result.errorCode, result.errorMessage);
    return { error: result.errorMessage || "Ödeme başlatılamadı" };
  }
  return { paymentPageUrl: result.paymentPageUrl };
}
