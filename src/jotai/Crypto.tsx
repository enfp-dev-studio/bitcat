import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { UI } from "../constants/UI";
import { ExchangeDataType } from "../type/Type";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Coinprika, CoinGeko } from "../constants/CryptoSymbol2ID";

export const getPriceColor = (tradePrice: number, openingPrice: number) => {
  if (tradePrice > openingPrice) return UI.UpColor;
  else if (tradePrice < openingPrice) return UI.DownColor;
  else return UI.EqualColor;
};

export const getPriceIcon = (tradePrice: number, openingPrice: number): any => {
  if (tradePrice > openingPrice)
    return <ArrowDropUpIcon sx={{ width: UI.textSize, height: UI.textSize }} />;
  else if (tradePrice < openingPrice)
    return (
      <ArrowDropDownIcon sx={{ width: UI.textSize, height: UI.textSize }} />
    );
  else return <div></div>;
};

export enum CryptoSymbol {
  BTC = "btc",
  ETH = "eth",
}

export enum CryptoName {
  BTC = "bitcoin",
  ETH = "ethterum",
}

export enum CurrencySymbol {
  KRW = "KRW",
  USD = "USD",
}

export enum CryptoExchange {
  ubbit = "업비트 (Upbit)",
  bithumb = "빗썸 (Bithumb)",
  binance = "바이낸스 (Binance)",
  coinpaprika = "Coinpaprika",
  coingeko = "CoinGecko",
}

export enum BitcatState {
  STATE_DEAD = 1,
  STATE_PANIC = 40,
  STATE_NORMAL = 12,
  STATE_FEVER = 14,
  STATE_HAPPY = 6,
}

export const ExchangeDatas: ExchangeDataType[] = [
  {
    enum: CryptoExchange.coingeko,
    getPrice: async (cryptoSymbol: string, currencySymbol: string) => {
      // bitcoin
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currencySymbol}&ids=${CoinGeko(
          cryptoSymbol
        )}&price_change_percentage=24h`
      );
      const result = await response.json();
      // console.log(result[0]);
      return {
        tradePrice: result?.length > 0 ? result[0].current_price : 0,
        openingPrice:
          result?.length > 0
            ? result[0].current_price + result[0].price_change_24h
            : 0,
      };
    },
  },
  {
    enum: CryptoExchange.ubbit,
    getPrice: async (cryptoSymbol: string, currencySymbol: string) => {
      const response = await fetch(
        `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-${cryptoSymbol}`
      );
      const result = await response?.json();
      const value = result?.length > 0 && result[0];
      return {
        tradePrice: value?.tradePrice,
        openingPrice: value?.openingPrice,
      };
    },
  },
  {
    enum: CryptoExchange.bithumb,
    getPrice: async (cryptoSymbol: string, currencySymbol: string) => {
      const response = await fetch(
        `https://api.bithumb.com/public/ticker/${cryptoSymbol}`
      );
      const result = await response.json();
      // console.log(result?.data);

      return {
        tradePrice: result?.data?.closing_price,
        openingPrice: result?.data?.opening_price,
      };
    },
  },
  {
    enum: CryptoExchange.coinpaprika,
    getPrice: async (cryptoSymbol: string, currencySymbol: string) => {
      // 'btc-bitcoin'
      const response = await fetch(
        `https://api.coinpaprika.com/v1/tickers/${Coinprika(
          cryptoSymbol
        )}?quotes=${currencySymbol}`
      );
      const result = await response.json();
      const value = result?.quotes[currencySymbol];

      // console.log(value);
      return {
        tradePrice: parseInt(value.price),
        openingPrice: Math.floor(
          (value.percent_change_24h / 100 + 1) * value.price
        ),
      };
    },
  },

  // {
  //   name: "코인마켓캡 (Coinmarketcap)",
  //   getUrl: (cryptoSymbol, currencySymbol) => `https://api.coinmarketcap.com/v1/ticker/?limit=20`,
  // },
  // {
  //   enum: CryptoExchange.binance,
  //   getUrl: (cryptoSymbol, currencySymbol) =>
  //     `https://api.binance.com/api/v1/ticker/${cryptoSymbol}`,
  //   getPrice: (result) => {
  //     return {
  //       tradePrice: 0,
  //       openingPrice: 0,
  //     };
  //   },
  // },
];

export type CryptoDataType = {
  cryptoSymbol: CryptoSymbol;
  currencySymbol: CurrencySymbol;
  tradePrice: number;
  openingPrice: number;
  bitcatState: BitcatState;
};

export const CryptoDataAtom = atomWithStorage<CryptoDataType>("crypto", {
  cryptoSymbol: CryptoSymbol.BTC,
  currencySymbol: CurrencySymbol.KRW,
  tradePrice: 100000000,
  openingPrice: 90000000,
  bitcatState: BitcatState.STATE_NORMAL,
});

const updatePrice = (
  cryptoData: CryptoDataType,
  tradePrice: number,
  openingPrice: number,
  bitcatState: BitcatState
) => {
  return {
    ...cryptoData,
    tradePrice,
    openingPrice,
    bitcatState,
  };
};

export const updateCryptoPriceAtom = atom(
  () => "",
  (
    get,
    set,
    {
      tradePrice,
      openingPrice,
      bitcatState,
    }: { tradePrice: number; openingPrice: number; bitcatState: BitcatState }
  ) => {
    set(
      CryptoDataAtom,
      updatePrice(get(CryptoDataAtom), tradePrice, openingPrice, bitcatState)
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

const setExchange = (exchange: ExchangeDataType, name: string) => {
  const newExchange = ExchangeDatas.find((e) => {
    return e.enum === name;
  });
  return newExchange ? newExchange : exchange;
};

export const setExchangeAtom = atom(
  () => "",
  (get, set, { name }: { name: string }) => {
    set(ExchangeDataAtom, setExchange(get(ExchangeDataAtom), name));
  }
);
