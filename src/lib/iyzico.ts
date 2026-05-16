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
      gsmNumber: buyer.phone,
      email: buyer.email,
      identityNumber: "11111111111",
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
