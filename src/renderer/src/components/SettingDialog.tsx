import { useEffect, useState } from 'react'
import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { currencyAtom } from '../jotai/Crypto'
import { useAtom } from 'jotai'
import { Row, VerticalDivider } from './HTMLComponents'
import { UI } from '../constants/UI'
import { getLocalCurrencies, sendToMain, sendToMainAsync } from '../util/Util'

import CryptoSelect from './CryptoSelect'
import { CloseIcon } from './Icons'
import { Scale, scaleAtom } from '../jotai/Preference'
import { useTranslation } from 'react-i18next'

export const SettingDialog = () => {
  const { t } = useTranslation()
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
              {t('SETTING_LABEL_CURRENCY')}{' '}
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
                  {t('SETTING_LABEL_WIDGET_SIZE')}
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
                  <FormControlLabel
                    value={Scale.small}
                    control={<Radio />}
                    label={t('SETTING_LABEL_SIZE_RADIO_SMALL')}
                  />
                  <FormControlLabel
                    value={Scale.medium}
                    control={<Radio />}
                    label={t('SETTING_LABEL_SIZE_RADIO_MEDIUM')}
                  />
                  <FormControlLabel
                    value={Scale.large}
                    control={<Radio />}
                    label={t('SETTING_LABEL_SIZE_RADIO_LARGE')}
                  />
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
                  {t('SETTING_LABEL_AUTO_LAUNCH')}
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
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label={t('SETTING_LABEL_RADIO_YES')}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label={t('SETTING_LABEL_RADIO_NO')}
                  />
                </RadioGroup>
              </div>
            </FormControl>
          </Row>
        </div>
      </div>
    </div>
  )
}
