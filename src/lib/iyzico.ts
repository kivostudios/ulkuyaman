// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require("iyzipay");

type IyzipayClient = {
  checkoutFormInitialize: { create: (req: unknown, cb: (err: unknown, res: { status: string; checkoutFormContent?: string; errorMessage?: string }) => void) => void };
  checkoutForm: { retrieve: (req: unknown, cb: (err: unknown, res: { status: string; paymentStatus?: string; paymentId?: string }) => void) => void };
};

let client: IyzipayClient | null = null;

export function getIyzipay(): IyzipayClient {
  if (client) return client;

  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error(
      "Iyzico env vars missing: set IYZICO_API_KEY and IYZICO_SECRET_KEY."
    );
  }

  client = new Iyzipay({
    apiKey,
    secretKey,
    uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
  });
  return client!;
}

export type IyzicoAddress = {
  contactName: string;
  city: string;
  country: string;
  address: string;
  zipCode?: string;
};

export type IyzicoBuyer = {
  id: string;
  name: string;
  surname: string;
  email: string;
  identityNumber: string;
  registrationAddress: string;
  city: string;
  country: string;
  gsmNumber?: string;
};

export type IyzicoBasketItem = {
  id: string;
  name: string;
  category1: string;
  itemType: string;
  price: string;
};

export type IyzicoPaymentRequest = {
  locale: string;
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: string;
  basketId: string;
  paymentGroup: string;
  callbackUrl: string;
  enabledInstallments: number[];
  buyer: IyzicoBuyer;
  shippingAddress: IyzicoAddress;
  billingAddress: IyzicoAddress;
  basketItems: IyzicoBasketItem[];
};
