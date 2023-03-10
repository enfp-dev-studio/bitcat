import { useState, useEffect, useCallback } from 'react'
import { useAtom } from 'jotai'
import {
  CryptoDataAtom,
  currencyAtom,
  getPrice,
  getPriceColor,
  getPriceIcon,
  updateCryptoPriceAtom
} from '../jotai/Crypto'
import { UI } from '../constants/UI'
import { formatNumber } from '../util/Util'
import { Spring, animated } from '@react-spring/web'
import { loadingAtom } from '../jotai/Loading'
import { AnimationAtom, getFPS, getSpritesheet } from '../jotai/Animation'

const UIScale = 0.6

export const CryptoInfo = ({ scale }: { scale: number }) => {
  const [, setLoading] = useAtom(loadingAtom)
  const [cryptoData] = useAtom(CryptoDataAtom)
  const [currency] = useAtom(currencyAtom)
  const [, updateCryptoPrice] = useAtom(updateCryptoPriceAtom)
  const [duringProgress, setDuringProgress] = useState(false)
  const [, setAnimation] = useAtom(AnimationAtom)

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
    if (priceChangePercentage !== cryptoData.priceChangePercentage) {
      const spritesheet = getSpritesheet(priceChangePercentage)
      const fps = getFPS(priceChangePercentage)
      setAnimation({ spritesheet, fps })
    }
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
        width: UI.frameWidth * 0.75 * scale,
        overflow: 'hidden',
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
      }}
    >
      {duringProgress && (
        <Spring
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
          }}
        >
          {(styles: any) => <animated.div style={styles}></animated.div>}
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
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          alt=""
          src={cryptoData.cryptoImage}
          width={UI.textSize * scale}
          height={UI.textSize * scale}
          style={{
            alignSelf: 'center',
            borderRadius: '50%'
          }}
        ></img>
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
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
