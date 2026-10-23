// iyzico ödeme entegrasyonu — checkout form akışı
import Iyzipay from "iyzipay";

const apiKey = process.env.IYZICO_API_KEY;
const secretKey = process.env.IYZICO_SECRET_KEY;
const uri = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

export const iyzicoConfigured = Boolean(apiKey && secretKey);

function client() {
  if (!iyzicoConfigured) {
    throw new Error("iyzico API anahtarları tanımlı değil");
  }
  return new Iyzipay({ apiKey: apiKey!, secretKey: secretKey!, uri });
}

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
  errorMessage?: string;
};

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

export function initCheckoutForm(input: CheckoutInput): Promise<CheckoutResult> {
  const iyzipay = client();
  const price = input.total.toFixed(2);
  const buyer = input.buyer;

  const request = {
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
      ip: input.ip || "85.34.78.112",
      registrationAddress: buyer.address,
      city: buyer.city,
      country: "Turkey",
    },
    shippingAddress: {
      contactName: `${buyer.name} ${buyer.surname}`,
      city: buyer.city,
      country: "Turkey",
      address: buyer.address,
    },
    billingAddress: {
      contactName: `${buyer.name} ${buyer.surname}`,
      city: buyer.city,
      country: "Turkey",
      address: buyer.address,
    },
    basketItems: input.basketItems.map((it) => ({
      id: it.id,
      name: it.name,
      category1: "Çiçek",
      itemType: "PHYSICAL",
      price: it.price.toFixed(2),
    })),
  };

  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request, (err: unknown, result: CheckoutResult) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export function retrieveCheckoutForm(token: string): Promise<CheckoutResult & {
  paymentStatus?: string;
  paymentId?: string;
  conversationId?: string;
}> {
  const iyzipay = client();
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(
      { locale: "tr", token },
      (err: unknown, result: CheckoutResult & { paymentStatus?: string; paymentId?: string; conversationId?: string }) => {
        if (err) reject(err);
        else resolve(result);
      },
    );
  });
}
