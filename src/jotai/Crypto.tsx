import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { emit } from "node:process";
import { UI } from "../constants/UI";
import { ExchangeDataType } from "../type/Type";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export const getPriceColor = (tradePrice: number, openingPrice: number) => {
  if (tradePrice > openingPrice) return UI.UpColor;
  else if (tradePrice < openingPrice) return UI.DownColor;
  else return UI.EqualColor;
};

export const getPriceIcon = (tradePrice: number, openingPrice: number): any => {
  if (tradePrice > openingPrice) return <ArrowDropUpIcon />;
  else if (tradePrice < openingPrice) return <ArrowDropDownIcon />;
  else return <div></div>;
};

export enum CryptoSymbol {
  BTC = "btc",
  ETH = "eth",
}

export enum CurrencySymbol {
  KRW = "KRW",
  USD = "USD",
}

export enum CryptoExchange {
  ubbit = "업비트 (Upbit)",
  bithumb = "빗썸 (Bithumb)",
  binance = "바이낸스 (Binance)",
}

export const ExchangeDatas: ExchangeDataType[] = [
  {
    enum: CryptoExchange.ubbit,
    getUrl: (cryptoSymbol: string, currencySymbol: string): string =>
      `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-${cryptoSymbol}`,
    getPrice: (result) => {
      const value = result[0];
      console.log(value);
      return {
        tradePrice: value?.tradePrice,
        openingPrice: value?.openingPrice,
      };
    },
  },
  {
    enum: CryptoExchange.bithumb,
    getUrl: (cryptoSymbol, currencySymbol) =>
      `https://api.bithumb.com/public/ticker/${cryptoSymbol}`,
    getPrice: (result) => {
      return {
        tradePrice: 0,
        openingPrice: 0,
      };
    },
  },
  // {
  //   name: "코인마켓캡 (Coinmarketcap)",
  //   getUrl: (cryptoSymbol, currencySymbol) => `https://api.coinmarketcap.com/v1/ticker/?limit=20`,
  // },
  {
    enum: CryptoExchange.binance,
    getUrl: (cryptoSymbol, currencySymbol) =>
      `https://api.binance.com/api/v1/ticker/${cryptoSymbol}`,
    getPrice: (result) => {
      return {
        tradePrice: 0,
        openingPrice: 0,
      };
    },
  },
];

export type CryptoDataType = {
  cryptoSymbol: CryptoSymbol;
  currencySymbol: CurrencySymbol;
  tradePrice: number;
  openingPrice: number;
};

export const CryptoDataAtom = atomWithStorage<CryptoDataType>("crypto", {
  cryptoSymbol: CryptoSymbol.BTC,
  currencySymbol: CurrencySymbol.KRW,
  tradePrice: 100000000,
  openingPrice: 90000000,
});

const updatePrice = (
  cryptoData: CryptoDataType,
  tradePrice: number,
  openingPrice: number
) => {
  return {
    ...cryptoData,
    tradePrice,
    openingPrice,
  };
};

export const updateCryptoPriceAtom = atom(
  () => "",
  (
    get,
    set,
    { tradePrice, openingPrice }: { tradePrice: number; openingPrice: number }
  ) => {
    set(
      CryptoDataAtom,
      updatePrice(get(CryptoDataAtom), tradePrice, openingPrice)
    );
  }
);

const setCrypto = (
  cryptoData: CryptoDataType,
  cryptoSymbol: CryptoSymbol,
  currencySymbol: CurrencySymbol
) => {
  return {
    ...cryptoData,
    cryptoSymbol,
    currencySymbol,
  };
};

export const setCryptoAtom = atom(
  () => "",
  (
    get,
    set,
    {
      cryptoSymbol,
      currencySymbol,
    }: { cryptoSymbol: CryptoSymbol; currencySymbol: CurrencySymbol }
  ) => {
    set(
      CryptoDataAtom,
      setCrypto(get(CryptoDataAtom), cryptoSymbol, currencySymbol)
    );
  }
);

export const ExchangeDataAtom = atomWithStorage<ExchangeDataType>("exchange", {
  ...ExchangeDatas[0],
});

const setExchange = (exchange: ExchangeDataType, name: CryptoExchange) => {
  const newExchange = ExchangeDatas.find((e) => {
    return e.enum === name;
  });
  return newExchange ? newExchange : exchange;
};

export const setExchangeAtom = atom(
  () => "",
  (get, set, { name }: { name: CryptoExchange }) => {
    set(ExchangeDataAtom, setExchange(get(ExchangeDataAtom), name));
  }
);
