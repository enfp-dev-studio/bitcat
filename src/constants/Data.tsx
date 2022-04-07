import { ExchangeType } from "../type/Type";

export const Exchanges: ExchangeType[] = [
  {
    name: "업비트 (Upbit)",
    getUrl: (cryptoSymbol, currencySymbol) => {
      return `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-${cryptoSymbol}`;
    },
  },
  {
    name: "빗썸 (Bithumb)",
    getUrl: (cryptoSymbol, currencySymbol) =>
      `https://api.bithumb.com/public/ticker/${cryptoSymbol}`,
  },
  // {
  //   name: "코인마켓캡 (Coinmarketcap)",
  //   getUrl: (cryptoSymbol, currencySymbol) => `https://api.coinmarketcap.com/v1/ticker/?limit=20`,
  // },
  {
    name: "바이낸스 (Binance)",
    getUrl: (cryptoSymbol, currencySymbol) =>
      `https://api.binance.com/api/v1/ticker/${cryptoSymbol}`,
  },
];
