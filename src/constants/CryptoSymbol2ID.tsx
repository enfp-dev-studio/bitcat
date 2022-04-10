import { CryptoSymbol } from "../jotai/Crypto";

export const CoinGeko = (symbol: string) => {
  switch (symbol) {
    case CryptoSymbol.BTC: return "bitcoin";
    case CryptoSymbol.ETH: return "ethereum";

    default:
      break;
  }
};

export const Coinprika = (symbol: string) => {
    switch (symbol) {
      case CryptoSymbol.BTC: return "btc-bitcoin";
      case CryptoSymbol.ETH: return "eth-ethereum";
  
      default:
        break;
    }
  };
  