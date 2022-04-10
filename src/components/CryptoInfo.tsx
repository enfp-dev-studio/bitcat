import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import {
  BitcatState,
  CryptoDataAtom,
  ExchangeDataAtom,
  getPriceColor,
  getPriceIcon,
  updateCryptoPriceAtom,
} from "../jotai/Crypto";
import { UI } from "../constants/UI";
import { Box, Paper, Typography } from "@mui/material";
import { VerticalDivider } from "./HTMLComponents";
import { formatNumber } from "../util/Util";

export const CryptoInfo = () => {
  const [cryptoData] = useAtom(CryptoDataAtom);
  const [exchangeData] = useAtom(ExchangeDataAtom);
  const [, updateCryptoPrice] = useAtom(updateCryptoPriceAtom);
  const [time, setTime] = useState(0);
  useEffect(() => {
    const tick = setTimeout(async () => {
      const { openingPrice, tradePrice } = await exchangeData?.getPrice(
        cryptoData.cryptoSymbol,
        cryptoData.currencySymbol
      );
      updateCryptoPrice({
        openingPrice,
        tradePrice,
        bitcatState:
          tradePrice > openingPrice
            ? BitcatState.STATE_HAPPY
            : BitcatState.STATE_PANIC,
      });
      console.log(openingPrice, tradePrice);

      setTime(time + 1);
    }, 60000);
    return () => clearTimeout(tick);
  }, [time]);

  useEffect(() => {
    const updatePrice = async () => {
      const { openingPrice, tradePrice } = await exchangeData?.getPrice(
        cryptoData.cryptoSymbol,
        cryptoData.currencySymbol
      );
      updateCryptoPrice({
        openingPrice,
        tradePrice,
        bitcatState:
          tradePrice > openingPrice
            ? BitcatState.STATE_HAPPY
            : BitcatState.STATE_PANIC,
      });
      console.log(openingPrice, tradePrice);
    };
    updatePrice();
  }, [exchangeData]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: "white",
          height: UI.priceBarHeight,
          borderRadius: UI.priceBarHeight / 2,
          border: "solid 4px black",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        {/* {exchangeData.enum} */}
        <img
          src={`image/${cryptoData.cryptoSymbol}.svg`}
          width={UI.textSize}
          height={UI.textSize}
          style={{
            // padding: 2,
            alignSelf: "center",
            borderRadius: "50%",
            // backgroundColor: "black",
          }}
        ></img>
        {/* <VerticalDivider></VerticalDivider> */}
        <div
          style={{
            fontSize: UI.textSize,
            fontWeight: "bold",
            color: getPriceColor(
              cryptoData.tradePrice,
              cryptoData.openingPrice
            ),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 10,
          }}
        >
          {/* {getPriceIcon(cryptoData.tradePrice, cryptoData.openingPrice)} */}
          {formatNumber(cryptoData.tradePrice)}
          {cryptoData.currencySymbol}
        </div>
      </div>
    </div>
  );
};
