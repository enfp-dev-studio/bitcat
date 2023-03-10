import { useEffect, useState } from 'react'
import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {
  // setExchangeAtom,
  currencyAtom
  // CryptoDataAtom,
  // updateCryptoPriceAtom
} from '../jotai/Crypto'
import { useAtom } from 'jotai'
import { Row, VerticalDivider } from './HTMLComponents'
import { UI } from '../constants/UI'
import { getLocalCurrencies, sendToMain, sendToMainAsync } from '../util/Util'

import CryptoSelect from './CryptoSelect'
import { CloseIcon } from './Icons'
import { Scale, scaleAtom } from '../jotai/Preference'

export const SettingDialog = () => {
  const [currency, setCurrency] = useAtom(currencyAtom)
  // const ref = useRef<HTMLInputElement>(null)
  const [scale, setScale] = useAtom(scaleAtom)
  const [autoLaunch, setAutoLaunch] = useState(false)

  useEffect(() => {
    // if (ref?.current) {
    //   sendToMain('SET_SETTING_DIALOG_WINDOW_SIZE', {
    //     width: ref?.current.offsetWidth,
    //     height: ref?.current.offsetHeight
    //   })
    // }
    sendToMainAsync('GET_AUTO_LAUNCH', {}).then((result) => {
      setAutoLaunch(result)
    })
  }, [])

  const handleChangeCurrency = (event: SelectChangeEvent) => {
    event.preventDefault()
    if (event?.target?.value) {
      setCurrency(event?.target?.value)
      // setLoading(true);
      // getPrice(cryptoData.cryptoId, event?.target?.value)
      //   .then((result) => {
      //     const { openingPrice, tradePrice, priceChangePercentage } = result;
      //     updateCryptoPrice({
      //       openingPrice,
      //       tradePrice,
      //       priceChangePercentage,
      //       // bitcatState:
      //       //   tradePrice > openingPrice
      //       //     ? BitcatState.STATE_HAPPY
      //       //     : BitcatState.STATE_PANIC,
      //     });
      //     if (priceChangePercentage !== cryptoData.priceChangePercentage)
      //       setAnimation({ percentage: priceChangePercentage });
      //     setCurrency(event?.target?.value);
      //   })
      //   .catch(console.log)
      //   .finally(() => {
      //     setLoading(false);
      //   });
    }
  }
  const handleSetAutoLaunch = (autoLaunch: boolean) => {
    sendToMain('SET_AUTO_LAUNCH', { autoLaunch })
    setAutoLaunch(autoLaunch)
  }

  const handleCloseApp = (e: any) => {
    e.preventDefault()
    sendToMain('HIDE_SETTING_DIALOG', {})
  }

  return (
    <div
      // ref={ref}
      style={{
        height: '100vh',
        width: '100vw',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: UI.DialogBackgroundColor
      }}
    >
      <div
        style={{
          // position: "sticky",
          height: 40,
          backgroundColor: UI.PrimaryColor,
          display: 'flex',
          flex: 1,
          flexDirection: 'row'
        }}
      >
        <div
          className="movable"
          style={{ display: 'flex', flex: 1, flexDirection: 'row', height: 40 }}
        ></div>
        <div style={{ padding: 4 }} onClick={handleCloseApp}>
          <CloseIcon size={28}></CloseIcon>
        </div>
      </div>
      <div
        // ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div
          style={{
            padding: 20
          }}
        >
          {/* <Row>
          <p fontFamily={"Maplestory"}>거래소: </p>
          <VerticalDivider></VerticalDivider>
          <Select
            // labelId="demo-simple-select-label"
            // id="demo-simple-select"
            value={exchangeData.enum}
            // label="Exchange"
            onChange={handleChange}
          >
            {ExchangeDatas.map((e) => {
              return (
                <MenuItem key={e.enum} value={e.enum}>
                  {e.enum}
                </MenuItem>
              );
            })}
          </Select>
        </Row> */}
          <Row>
            <CryptoSelect></CryptoSelect>
          </Row>
          <Row>
            <p
              style={{
                width: UI.LabelWidth,
                fontFamily: 'Maplestory'
              }}
            >
              통화:{' '}
            </p>
            <VerticalDivider></VerticalDivider>
            <Select
              style={{ flex: 1 }}
              size="small"
              value={currency}
              onChange={handleChangeCurrency}
            >
              {getLocalCurrencies().map((currency) => {
                return (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                )
              })}
            </Select>
          </Row>
          {/* <Row>
            <p
              style={{
                width: UI.LabelWidth,
                fontFamily: 'Maplestory'
              }}
            >
              디스플레이:{' '}
            </p>
            <VerticalDivider></VerticalDivider>
            <Select
              style={{ flex: 1 }}
              size="small"
              value={preference.displayIndex.toString()}
              onChange={handleChangeDisplayIndex}
            >
              {displays?.map((display, index) => {
                return (
                  <MenuItem key={index} value={display?.id}>
                    Display {index + 1}
                  </MenuItem>
                )
              })}
            </Select>
          </Row> */}
          {/* <div
          style={{
            padding: 10,
          }}
        >
          <p fontFamily={"Maplestory"}>비트캣 위치</p>
          <HorizontalDivider></HorizontalDivider>
          {selectedDisplay && (
            <PositionSelect
              position={position}
              setPosition={setPosition}
              display={selectedDisplay}
            ></PositionSelect>
          )}
        </div> */}
          <Row>
            <FormControl>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'Maplestory'
                }}
              >
                <p
                  style={{
                    width: UI.LabelWidth
                  }}
                >
                  비트캣 크기
                </p>
                <VerticalDivider></VerticalDivider>
                <RadioGroup
                  style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onChange={(e) => {
                    e.preventDefault()
                    // console.log(e.target.value);
                    const scale = parseFloat(e.target.value)
                    setScale(scale)
                    sendToMain('SET_SCALE', { scale })
                  }}
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={scale}
                  name="radio-buttons-group"
                >
                  <FormControlLabel value={Scale.small} control={<Radio />} label="작게" />
                  <FormControlLabel value={Scale.medium} control={<Radio />} label="중간" />
                  <FormControlLabel value={Scale.large} control={<Radio />} label="크게" />
                </RadioGroup>
              </div>
            </FormControl>
          </Row>
          <Row>
            <FormControl>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <p
                  style={{
                    width: UI.LabelWidth,
                    fontFamily: 'Maplestory'
                  }}
                >
                  자동실행
                </p>
                <VerticalDivider></VerticalDivider>
                <RadioGroup
                  onChange={(e) => {
                    e.preventDefault()
                    const autoLaunch = e.target.value === 'true'
                    handleSetAutoLaunch(autoLaunch)
                  }}
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={autoLaunch}
                  name="radio-buttons-group"
                >
                  <FormControlLabel value={true} control={<Radio />} label="예" />
                  <FormControlLabel value={false} control={<Radio />} label="아니오" />
                </RadioGroup>
              </div>
            </FormControl>
          </Row>
        </div>{' '}
        {/* <div style={{ position: "absolute", top: 10, right: 10 }}>
          <IconButton
            onClick={() => {
              // updatePrice();
              resetPreference();
            }}
          >
            <RefreshIcon></RefreshIcon>
          </IconButton>
          <IconButton
            onClick={() => {
              sendToMain("OPEN_DOCUMENT_SITE", {});
            }}
          >
            <QuestionMarkIcon></QuestionMarkIcon>
          </IconButton>
        </div> */}
      </div>
    </div>
  )
}
