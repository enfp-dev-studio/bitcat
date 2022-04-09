import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import {
  CryptoDataAtom,
  ExchangeDataAtom,
  getPriceColor,
  getPriceIcon,
  updateCryptoPriceAtom,
} from "../jotai/Crypto";
import { UI } from "../constants/UI";
import { Box, Paper, Typography } from "@mui/material";
import { VerticalDivider } from "./HTMLComponents";

export const CryptoInfo = () => {
  const [cryptoData] = useAtom(CryptoDataAtom);
  const [exchangeData] = useAtom(ExchangeDataAtom);
  const [, updateCryptoPrice] = useAtom(updateCryptoPriceAtom);
  const [time, setTime] = useState(0);
  useEffect(() => {
    const tick = setTimeout(async () => {
      const url = exchangeData.getUrl(
        cryptoData.cryptoSymbol,
        cryptoData.currencySymbol
      );
      const response = await fetch(url);
      const reuslt = await response.json();

      const { openingPrice, tradePrice } = exchangeData.getPrice(reuslt);
      updateCryptoPrice({ openingPrice, tradePrice });
      console.log(openingPrice, tradePrice);

      setTime(time + 1);
    }, 60000);
    return () => clearTimeout(tick);
  }, [time]);

  return (
    <Paper elevation={3} style={{ padding: 10 }}>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        {exchangeData.enum}
        <img
          src={`image/${cryptoData.cryptoSymbol}.svg`}
          width={30}
          height={30}
          style={{ alignSelf: "center" }}
        ></img>
        <VerticalDivider></VerticalDivider>
        <div
          style={{
            color: getPriceColor(
              cryptoData.tradePrice,
              cryptoData.openingPrice
            ),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {getPriceIcon(cryptoData.tradePrice, cryptoData.openingPrice)}
          {cryptoData.tradePrice}
        </div>
      </div>
    </Paper>
  );
};
