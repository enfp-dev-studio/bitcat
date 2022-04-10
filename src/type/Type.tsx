import { CryptoExchange } from "../jotai/Crypto";

export type Position = {
  x: number;
  y: number;
};

export type ExchangeDataType = {
  enum: CryptoExchange;
  getPrice: (
    cryptoSymbol: string,
    currencySymbol: string
  ) => Promise<{ openingPrice: number; tradePrice: number }>;
};
