import { useState, useEffect, useCallback } from 'react'
import { useAtom } from 'jotai'
import {
  // BitcatState,
  CryptoDataAtom,
  currencyAtom,
  getPrice,
  // ExchangeDataAtom,
  getPriceColor,
  getPriceIcon,
  // getPriceIcon,
  updateCryptoPriceAtom
} from '../jotai/Crypto'
import { UI } from '../constants/UI'
import { formatNumber } from '../util/Util'
import { Spring, animated } from '@react-spring/web'
import { setAnimationAtom } from '../jotai/Animation'
import { loadingAtom } from '../jotai/Loading'

const UIScale = 0.6

export const CryptoInfo = ({ scale }) => {
  const [, setLoading] = useAtom(loadingAtom)
  const [cryptoData] = useAtom(CryptoDataAtom)
  const [currency] = useAtom(currencyAtom)
  const [, updateCryptoPrice] = useAtom(updateCryptoPriceAtom)
  const [duringProgress, setDuringProgress] = useState(false)
  const [, setAnimation] = useAtom(setAnimationAtom)

  const updatePrice = useCallback(async () => {
    setLoading(true)
    const { openingPrice, tradePrice, priceChangePercentage } = await getPrice(
      cryptoData.cryptoId,
      currency
    )
    updateCryptoPrice({
      openingPrice,
      tradePrice,
      priceChangePercentage
    })
    if (priceChangePercentage !== cryptoData.priceChangePercentage)
      setAnimation({ percentage: priceChangePercentage })
    setLoading(false)
    setDuringProgress(true)
  }, [cryptoData, currency])

  useEffect(() => {
    updatePrice()
  }, [])

  useEffect(() => {
    updatePrice()
  }, [cryptoData.cryptoId, currency])

  useEffect(() => {
    if (!duringProgress) updatePrice()
  }, [duringProgress])

  return (
    <div
      style={{
        backgroundColor: UI.SurfaceColor,
        height: UI.priceBarHeight * scale,
        borderRadius: (UI.priceBarHeight / 2) * scale,
        // border: "solid 4px black",
        width: UI.frameWidth * 0.75 * scale,
        overflow: 'hidden',
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none'
        // flexDirection: "row",
      }}
    >
      {duringProgress && (
        <Spring
          // onStart={(e) => {
          //   console.log("onstart");
          // }}
          reset={duringProgress}
          loop={false}
          to={{
            height: UI.frameHeight,
            width: UI.frameWidth * 0.75 * scale,
            backgroundColor: UI.fillBackgroundColor
          }}
          from={{
            backgroundColor: UI.fillBackgroundColor,
            height: UI.frameHeight,
            width: 0
          }}
          config={{
            duration: UI.updateDuration
          }}
          onRest={async () => {
            setDuringProgress(false)
            // updatePrice();
          }}
        >
          {(styles) => <animated.div style={styles}></animated.div>}
        </Spring>
      )}
      <animated.div
        style={{
          position: 'absolute',
          top: 0,
          left: 'auto',
          right: 'auto',
          bottom: 0,
          marginLeft: 'auto',
          marginRight: 'auto',
          // topmargin: "auto",
          // bottommargin: "auto",
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
          // backgroundColor: "red",
          // maxWidth: UI.frameWidth * 0.75 * scale,
        }}
      >
        <img
          alt=""
          src={cryptoData.cryptoImage}
          width={UI.textSize * scale}
          height={UI.textSize * scale}
          style={{
            // padding: 2,
            alignSelf: 'center',
            borderRadius: '50%'
            // backgroundColor: "black",
          }}
        ></img>
        {/* <VerticalDivider></VerticalDivider> */}
        <div
          style={{
            height: '100%',
            fontSize: UI.textSize * scale,
            fontWeight: 'bold',
            color: getPriceColor(cryptoData.priceChangePercentage),
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 10
          }}
        >
          {/* {getPriceIcon(cryptoData.tradePrice, cryptoData.openingPrice)} */}
          {formatNumber(cryptoData.tradePrice)}
          <div
            style={{
              height: '70%',
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: 'row'
            }}
          >
            <div
              style={{
                fontSize: UI.textSize * UIScale * scale,
                marginLeft: 4
              }}
            >
              {currency}
            </div>
            <div className="flex flex-row items-center">
              {getPriceIcon(cryptoData?.priceChangePercentage, UI.textSize * UIScale * scale)}
              <div
                style={{
                  fontSize: UI.textSize * UIScale * scale
                }}
              >
                {Math.abs(cryptoData?.priceChangePercentage).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  )
}
