import { CryptoExchange } from "../jotai/Crypto";

export type Position = {
  x: number;
  y: number;
};

export type ExchangeDataType = {
  enum: CryptoExchange;
  getUrl: (cryptoSymbol: string, currencySymbol: string) => string;
  getPrice: (result: any) => { openingPrice: number; tradePrice: number };
};
