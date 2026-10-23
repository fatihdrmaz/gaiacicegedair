// iyzico ödeme entegrasyonu — checkout form akışı.
// iyzipay SDK'sı modülleri çalışma anında dinamik yüklediği için Vercel'de paketlenemiyor;
// iki uç doğrudan REST + IYZWSv2 imzasıyla çağrılır (SDK'nın imza mantığıyla birebir aynı).
import crypto from "node:crypto";

const apiKey = process.env.IYZICO_API_KEY;
const secretKey = process.env.IYZICO_SECRET_KEY;
const baseUrl = (process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com").replace(/\/$/, "");

export const iyzicoConfigured = Boolean(apiKey && secretKey);

export type CheckoutBasketItem = {
  id: string;
  name: string;
  price: number;
};

export type CheckoutInput = {
  orderId: string;
  total: number;
  callbackUrl: string;
  ip?: string;
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  basketItems: CheckoutBasketItem[];
};

type CheckoutResult = {
  status: string;
  token?: string;
  paymentPageUrl?: string;
  checkoutFormContent?: string;
  errorCode?: string;
  errorMessage?: string;
};

type RetrieveResult = CheckoutResult & {
  paymentStatus?: string;
  paymentId?: string;
  conversationId?: string;
};

// SDK'daki utils.formatPrice ile aynı: 50 → "50.0", 49.9 → "49.9"
function formatPrice(price: number): string {
  const s = parseFloat(String(price)).toString();
  return s.includes(".") ? s : s + ".0";
}

function normalizePhone(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.length === 10) return "+90" + digits;
  if (digits.length === 11 && digits.startsWith("0")) return "+9" + digits;
  if (digits.length === 12 && digits.startsWith("90")) return "+" + digits;
  return raw || "+905555555555";
}

export function clientIp(req: Request): string | undefined {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || undefined;
}

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  if (!iyzicoConfigured) throw new Error("iyzico API anahtarları tanımlı değil");
  const json = JSON.stringify(body);
  const randomKey = Date.now() + crypto.randomBytes(6).toString("hex");
  const signature = crypto
    .createHmac("sha256", secretKey!)
    .update(randomKey + path + json)
    .digest("hex");
  const auth = Buffer.from(
    `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`,
  ).toString("base64");

  const res = await fetch(baseUrl + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `IYZWSv2 ${auth}`,
      "x-iyzi-rnd": randomKey,
    },
    body: json,
    cache: "no-store",
  });
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`iyzico beklenmeyen yanıt (${res.status}): ${text.slice(0, 200)}`);
  }
}

export function initCheckoutForm(input: CheckoutInput): Promise<CheckoutResult> {
  const price = formatPrice(input.total);
  const buyer = input.buyer;
  const address = {
    contactName: `${buyer.name} ${buyer.surname}`,
    city: buyer.city,
    country: "Turkey",
    address: buyer.address,
  };

  return post<CheckoutResult>("/payment/iyzipos/checkoutform/initialize/auth/ecom", {
    locale: "tr",
    conversationId: input.orderId,
    price,
    paidPrice: price,
    currency: "TRY",
    basketId: input.orderId,
    paymentGroup: "PRODUCT",
    callbackUrl: input.callbackUrl,
    enabledInstallments: [1, 2, 3, 6],
    buyer: {
      id: buyer.id,
      name: buyer.name,
      surname: buyer.surname,
      gsmNumber: normalizePhone(buyer.phone),
      email: buyer.email,
      identityNumber: "11111111111",
      registrationAddress: buyer.address,
      ip: input.ip || "85.34.78.112",
      city: buyer.city,
      country: "Turkey",
    },
    shippingAddress: address,
    billingAddress: address,
    basketItems: input.basketItems.map((it) => ({
      id: it.id,
      name: it.name,
      category1: "Çiçek",
      itemType: "PHYSICAL",
      price: formatPrice(it.price),
    })),
  });
}

export function retrieveCheckoutForm(token: string): Promise<RetrieveResult> {
  return post<RetrieveResult>("/payment/iyzipos/checkoutform/auth/ecom/detail", {
    locale: "tr",
    token,
  });
}
