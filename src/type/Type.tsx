export type Position = {
  x: number;
  y: number;
};

export type ExchangeType = {
  name: string;
  getUrl: (cryptoSymbol: string, currencySymbol: string) => string;
};
