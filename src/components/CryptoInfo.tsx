import React, { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import {
  // BitcatState,
  CryptoDataAtom,
  getPrice,
  // ExchangeDataAtom,
  getPriceColor,
  // getPriceIcon,
  updateCryptoPriceAtom,
} from "../jotai/Crypto";
import { UI } from "../constants/UI";
import { IconButton } from "@mui/material";
import { formatNumber } from "../util/Util";
import { Preference } from "../jotai/Preference";
import { Spring, animated, useSpringRef } from "@react-spring/web";
import { setAnimationAtom } from "../jotai/Animation";

const UIScale = 0.6;

export const CryptoInfo = () => {
  const [preference] = useAtom(Preference);
  const [cryptoData] = useAtom(CryptoDataAtom);
  // const [exchangeData] = useAtom(ExchangeDataAtom);
  const [, updateCryptoPrice] = useAtom(updateCryptoPriceAtom);
  const [duringProgress, setDuringProgress] = useState(false);
  const springRef = useSpringRef();
  const [, setAnimation] = useAtom(setAnimationAtom);

  const updatePrice = useCallback(async () => {
    // console.log(" call update", cryptoData);
    const { openingPrice, tradePrice, priceChangePercentage } = await getPrice(
      cryptoData.cryptoId,
      cryptoData.currencySymbol
    );
    // console.log(priceChangePercentage);
    updateCryptoPrice({
      openingPrice,
      tradePrice,
      priceChangePercentage,
      // bitcatState:
      //   tradePrice > openingPrice
      //     ? BitcatState.STATE_HAPPY
      //     : BitcatState.STATE_PANIC,
    });
    setAnimation({ percentage: priceChangePercentage });
    // setDuringProgress(true);
    springRef.start({
      to: {
        height: UI.frameHeight,
        width: UI.frameWidth * 0.75 * preference.scale,
        backgroundColor: UI.fillBackgroundColor,
        // borderRadius: (UI.priceBarHeight / 2) * preference.scale,
      },
      onRest: async () => {
        // console.log("onreset");
        updatePrice();
      },
    });
  }, [
    cryptoData.cryptoSymbol,
    cryptoData.currencySymbol,
    preference.scale,
    setAnimation,
    springRef,
    updateCryptoPrice,
  ]);

  const fillColor = () => {
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
  };

  useEffect(() => {
    updatePrice();
  }, []);

  return (
    <div
      onClick={() => {
        fillColor();
      }}
      // ref={ref}
      style={{
        backgroundColor: UI.SurfaceColor,
        height: UI.priceBarHeight * preference.scale,
        borderRadius: (UI.priceBarHeight / 2) * preference.scale,
        // border: "solid 4px black",
        width: UI.frameWidth * 0.75 * preference.scale,
        overflow: "hidden",
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        justifyContent: "center",
        // flexDirection: "row",
      }}
    >
      {/* <Spring
        onStart={() => {
          console.log("onstart");
        }}
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
      </Spring> */}
      <animated.div
        style={{
          position: "absolute",
          top: 0,
          left: "auto",
          right: "auto",
          bottom: 0,
          marginLeft: "auto",
          marginRight: "auto",
          // topmargin: "auto",
          // bottommargin: "auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "red",
          // maxWidth: UI.frameWidth * 0.75 * preference.scale,
        }}
      >
        <img
          alt=""
          src={cryptoData.cryptoImage}
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
            height: "100%",
            fontSize: UI.textSize * preference.scale,
            fontWeight: "bold",
            color: getPriceColor(cryptoData.priceChangePercentage),
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
              height: "70%",
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                fontSize: UI.textSize * UIScale * preference.scale,
                marginLeft: 10,
              }}
            >
              {cryptoData.currencySymbol}
            </div>
            <div
              style={{
                fontSize: UI.textSize * UIScale * preference.scale,
                marginLeft: 10,
              }}
            >
              {cryptoData?.priceChangePercentage?.toFixed(2)}%
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};
