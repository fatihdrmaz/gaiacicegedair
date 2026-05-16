declare module "iyzipay" {
  type Callback<T = unknown> = (err: unknown, result: T) => void;

  interface IyzipayOptions {
    apiKey: string;
    secretKey: string;
    uri: string;
  }

  class Iyzipay {
    constructor(options: IyzipayOptions);
    checkoutFormInitialize: {
      create<T>(request: Record<string, unknown>, cb: Callback<T>): void;
    };
    checkoutForm: {
      retrieve<T>(request: Record<string, unknown>, cb: Callback<T>): void;
    };
  }

  export default Iyzipay;
}
