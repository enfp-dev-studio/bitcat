import React, { useState, useEffect, useCallback } from "react";
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
import { IconButton } from "@mui/material";
import { formatNumber } from "../util/Util";
import {
  Preference,
  resetPreference,
  resetPreferenceAtom,
} from "../jotai/Preference";
import { Spring, animated, useSpringRef } from "@react-spring/web";
import RefreshIcon from "@mui/icons-material/Refresh";

export const CryptoInfo = () => {
  const [preference] = useAtom(Preference);
  const [cryptoData] = useAtom(CryptoDataAtom);
  const [exchangeData] = useAtom(ExchangeDataAtom);
  const [, updateCryptoPrice] = useAtom(updateCryptoPriceAtom);
  const [, resetPreference] = useAtom(resetPreferenceAtom);
  const [duringProgress, setDuringProgress] = useState(false);
  const springRef = useSpringRef();

  const updatePrice = useCallback(async () => {
    console.log(" call update", exchangeData);
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
    // setDuringProgress(true);
    springRef.start({
      to: {
        height: UI.frameHeight,
        width: UI.frameWidth * 0.75 * preference.scale,
        backgroundColor: UI.fillBackgroundColor,
        // borderRadius: (UI.priceBarHeight / 2) * preference.scale,
      },
      onRest: async () => {
        updatePrice();
      },
    });
  }, []);

  // useEffect(() => {
  //   updatePrice();
  // }, []);

  useEffect(() => {
    updatePrice();
  }, [exchangeData]);

  return (
    <div
      // ref={ref}
      style={{
        backgroundColor: "white",
        height: UI.priceBarHeight * preference.scale,
        borderRadius: (UI.priceBarHeight / 2) * preference.scale,
        // border: "solid 4px black",
        width: UI.frameWidth * 0.75 * preference.scale,
        display: "flex",
        overflow: "hidden",
        justifyContent: "center",
        alignSelf: "center",
        // flexDirection: "row",
      }}
    >
      <Spring
        // onResolve={(e) => {
        //   console.log("resolve", duringProgress);
        //   if (duringProgress) setDuringProgress(!duringProgress);
        // }}
        reset={duringProgress}
        loop={false}
        from={{
          backgroundColor: UI.fillBackgroundColor,
          // borderRadius: (UI.priceBarHeight / 2) * preference.scale,
          height: UI.frameHeight,
          width: 0,
        }}
        config={{
          duration: UI.updateDuration,
        }}
      >
        {(styles) => <animated.div style={styles}></animated.div>}
      </Spring>
      <animated.div
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          // left: 0,
          // right: 0,
          bottom: 0,
          marginLeft: "auto",
          marginRight: "auto",
          // topmargin: "auto",
          // bottommargin: "auto",
          display: "flex",
          flexDirection: "row",
          // maxWidth: UI.frameWidth * 0.75 * preference.scale,
        }}
      >
        <IconButton
          onClick={() => {
            // updatePrice();
            resetPreference();
          }}
        >
          <RefreshIcon></RefreshIcon>
        </IconButton>
        <img
          alt="symbol"
          src={`image/${cryptoData.cryptoSymbol}.svg`}
          width={UI.textSize * preference.scale}
          height={UI.textSize * preference.scale}
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
            fontSize: UI.textSize * preference.scale,
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
          <div
            style={{
              fontSize: UI.textSize * 0.6 * preference.scale,
              marginLeft: 10,
            }}
          >
            {cryptoData.currencySymbol}
          </div>
        </div>
      </animated.div>
    </div>
  );
};
