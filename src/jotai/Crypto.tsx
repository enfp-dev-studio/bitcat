import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { UI } from "../constants/UI";
import { ExchangeDataType } from "../type/Type";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import { Coinprika, CoinGeko } from "../constants/CryptoSymbol2ID";

export const getPriceColor = (percentage: number) => {
  if (percentage > 0) return UI.UpColor;
  else if (percentage < 0) return UI.DownColor;
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

// export enum CryptoSymbol {
//   BTC = "btc",
//   ETH = "eth",
// }

// export enum CryptoName {
//   BTC = "bitcoin",
//   ETH = "ethterum",
// }

// export enum CurrencySymbol {
//   KRW = "KRW",
//   USD = "USD",
// }

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
export const getCoinList = async () => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${"usd"}&order=market_cap_desc&per_page=200&page=1`
  );
  const result = await response.json();
  // console.log(result);
  if (result?.length > 100) {
    return result;
  }
};

export const getPrice = async (
  cryptoId: string,
  currencySymbol: string
) => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currencySymbol}&ids=${cryptoId}&price_change_percentage=24h`;
  // console.log(url);
  // bitcoin
  const response = await fetch(url);
  const result = await response.json();
  // console.log(result[0]);
  return {
    tradePrice: result?.length > 0 ? result[0].current_price : 0,
    openingPrice:
      result?.length > 0
        ? result[0].current_price + result[0].price_change_24h
        : 0,
    priceChangePercentage: result[0].price_change_percentage_24h,
  };
};

export const ExchangeDatas: ExchangeDataType[] = [
  {
    enum: CryptoExchange.coingeko,
    getPrice: async (cryptoId: string, currencySymbol: string) => {
      // bitcoin
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currencySymbol}&ids=${cryptoId}&price_change_percentage=24h`
      );
      const result = await response.json();
      // console.log(result[0]);
      return {
        tradePrice: result?.length > 0 ? result[0].current_price : 0,
        openingPrice:
          result?.length > 0
            ? result[0].current_price + result[0].price_change_24h
            : 0,
        priceChangePercentage: result[0].price_change_percentage_24h,
      };
    },
  },
  // {
  //   enum: CryptoExchange.ubbit,
  //   getPrice: async (cryptoSymbol: string, currencySymbol: string) => {
  //     const response = await fetch(
  //       `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-${cryptoSymbol}`
  //     );
  //     const result = await response?.json();
  //     const value = result?.length > 0 && result[0];
  //     return {
  //       tradePrice: value?.tradePrice,
  //       openingPrice: value?.openingPrice,
  //     };
  //   },
  // },
  // {
  //   enum: CryptoExchange.bithumb,
  //   getPrice: async (cryptoSymbol: string, currencySymbol: string) => {
  //     const response = await fetch(
  //       `https://api.bithumb.com/public/ticker/${cryptoSymbol}`
  //     );
  //     const result = await response.json();
  //     // console.log(result?.data);

  //     return {
  //       tradePrice: result?.data?.closing_price,
  //       openingPrice: result?.data?.opening_price,
  //     };
  //   },
  // },
  // {
  //   enum: CryptoExchange.coinpaprika,
  //   getPrice: async (cryptoSymbol: string, currencySymbol: string) => {
  //     // 'btc-bitcoin'
  //     const response = await fetch(
  //       `https://api.coinpaprika.com/v1/tickers/${Coinprika(
  //         cryptoSymbol
  //       )}?quotes=${currencySymbol}`
  //     );
  //     const result = await response.json();
  //     const value = result?.quotes[currencySymbol];

  //     // console.log(value);
  //     return {
  //       tradePrice: parseInt(value.price),
  //       openingPrice: Math.ceil(
  //         (value.percent_change_24h / 100 + 1) * value.price
  //       ),
  //     };
  //   },
  // },

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
  cryptoSymbol: string;
  cryptoId: string;
  cryptoImage: string;
  currencySymbol: string;
  tradePrice: number;
  openingPrice: number;
  priceChangePercentage: number;
  // bitcatState: BitcatState;
};

export const CryptoDataAtom = atomWithStorage<CryptoDataType>("crypto", {
  cryptoSymbol: "btc",
  cryptoId: "bitcoin",
  currencySymbol: "krw",
  cryptoImage:
    "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
  tradePrice: 100000000,
  openingPrice: 90000000,
  priceChangePercentage: 0,
  // bitcatState: BitcatState.STATE_NORMAL,
});

const updatePrice = (
  cryptoData: CryptoDataType,
  tradePrice: number,
  openingPrice: number,
  priceChangePercentage: number
  // bitcatState: BitcatState
) => {
  return {
    ...cryptoData,
    tradePrice,
    openingPrice,
    priceChangePercentage,
    // bitcatState,
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
      priceChangePercentage,
    }: // bitcatState,
    {
      tradePrice: number;
      openingPrice: number;
      priceChangePercentage: number;
      // bitcatState: BitcatState;
    }
  ) => {
    set(
      CryptoDataAtom,
      updatePrice(
        get(CryptoDataAtom),
        tradePrice,
        openingPrice,
        priceChangePercentage
        // bitcatState
      )
    );
  }
);

const setCrypto = (
  cryptoData: CryptoDataType,
  cryptoSymbol: string,
  cryptoId: string,
  cryptoImage: string
) => {
  return {
    ...cryptoData,
    cryptoSymbol,
    cryptoId,
    cryptoImage,
  };
};

export const setCryptoAtom = atom(
  () => "",
  (
    get,
    set,
    {
      cryptoSymbol,
      cryptoId,
      cryptoImage,
    }: {
      cryptoSymbol: string;
      cryptoId: string;
      cryptoImage: string;
    }
  ) => {
    set(
      CryptoDataAtom,
      setCrypto(get(CryptoDataAtom), cryptoSymbol, cryptoId, cryptoImage)
    );
  }
);

const setCurrency = (cryptoData: CryptoDataType, cryptoCurrency: string) => {
  return {
    ...cryptoData,
    cryptoCurrency,
  };
};

export const setCurrencyAtom = atom(
  () => "",
  (
    get,
    set,
    {
      cryptoCurrency,
    }: {
      cryptoCurrency: string;
    }
  ) => {
    set(CryptoDataAtom, setCurrency(get(CryptoDataAtom), cryptoCurrency));
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
