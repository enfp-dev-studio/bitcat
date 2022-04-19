import { useEffect, useRef, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  setExchangeAtom,
  currencyAtom,
  CryptoDataAtom,
  getPrice,
  updateCryptoPriceAtom,
} from "../jotai/Crypto";
import { useAtom } from "jotai";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import { Button } from "@mui/material";
import "react-use-measure";
import { IpcRenderer } from "electron";
import { Row, VerticalDivider } from "./HTMLComponents";
import {
  Preference,
  setDisplayIndexAtom,
  setScaleAtom,
} from "../jotai/Preference";
import { UI } from "../constants/UI";
// import { PositionSelect } from "./PositionSelect";
import { getLocalCurrencies, sendToMain } from "../util/Util";
// import useMeasure from "react-use-measure";

// import RefreshIcon from "@mui/icons-material/Refresh";
import CryptoSelect from "./CryptoSelect";
import { setAnimationAtom } from "../jotai/Animation";
import { loadingAtom } from "../jotai/Loading";

export const SettingDialog = () => {
  const [, setLoading] = useAtom(loadingAtom);
  const [cryptoData] = useAtom(CryptoDataAtom);
  // const [, savePosition] = useAtom(savePositionAtom);
  // const [exchangeData] = useAtom(ExchangeDataAtom);
  const [, setExchange] = useAtom(setExchangeAtom);
  const [preference] = useAtom(Preference);
  const [, setScale] = useAtom(setScaleAtom);
  const [currency, setCurrency] = useAtom(currencyAtom);
  const [, updateCryptoPrice] = useAtom(updateCryptoPriceAtom);
  const [, setAnimation] = useAtom(setAnimationAtom);

  // const [coins, setCoins] =
  //   useState<[{ symbol: string; id: string; name: string }]>();
  // const [coin, setCoin] = useState<{
  //   symbol: string;
  //   id: string;
  //   name: string;
  // }>();
  const [, setDisplayIndex] = useAtom(setDisplayIndexAtom);
  const [selectedDisplay, setSelectedDisplay] = useState<Electron.Display>();
  const [displays, setDisplays] = useState<Electron.Display[]>();

  const [position, setPosition] = useState({
    x: preference.positionX,
    y: preference.positionY,
  });

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getDisplays = () => {
      //@ts-ignore
      const ipcRenderer: IpcRenderer = window.ipcRenderer;
      if (ipcRenderer) {
        ipcRenderer.on("GET_DISPLAYS_RESPONSE", (event, { displays }) => {
          // console.log(displays);
          setDisplays(displays);
          displays?.length > 0 && setSelectedDisplay(displays[0]);
        });
        ipcRenderer.send("GET_DISPLAYS");
      }
    };
    getDisplays();

    if (ref?.current) {
      sendToMain("SET_SETTING_DIALOG_WINDOW_SIZE", {
        width: ref?.current.offsetWidth,
        height: ref?.current.offsetHeight,
      });
    }
  }, []);

  // const handleChange = (event: SelectChangeEvent) => {
  //   if (event.target.value) {
  //     setExchange({ name: event.target.value });
  //   }
  // };

  const handleChangeDisplayIndex = (event: SelectChangeEvent) => {
    event.preventDefault();
    if (event?.target?.value) {
      setDisplayIndex({ index: parseInt(event.target.value) });
    }
  };

  const handleChangeCurrency = (event: SelectChangeEvent) => {
    event.preventDefault();
    if (event?.target?.value) {
      setLoading(true);
      getPrice(cryptoData.cryptoId, event?.target?.value)
        .then((result) => {
          const { openingPrice, tradePrice, priceChangePercentage } = result;
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
          setCurrency(event?.target?.value);
        })
        .catch(console.log)
        .finally(() => {
          setLoading(false);
        });
    }
  };
  // useEffect(() => {
  //   window?.addEventListener("resize", handleResize);
  //   return window?.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <div
      ref={ref}
      style={{
        // height: "100vh",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        className="container"
        style={{
          position: "sticky",
          height: 40,
          backgroundColor: UI.PrimaryColor,
        }}
      ></div>
      <div
        ref={ref}
        style={{
          // height: "100%",
          display: "flex",
          flexDirection: "column",
          // padding: 10,
          backgroundColor: UI.DialogBackgroundColor,
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            padding: 20,
          }}
        >
          {/* <Row>
          <Typography fontFamily={"Maplestory"}>거래소: </Typography>
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
            <Typography fontFamily={"Maplestory"}>통화: </Typography>
            <VerticalDivider></VerticalDivider>
            <Select
              sx={{ width: 200 }}
              size="small"
              value={currency}
              onChange={handleChangeCurrency}
            >
              {getLocalCurrencies().map((currency) => {
                return (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                );
              })}
            </Select>
          </Row>
          <Row>
            <Typography fontFamily={"Maplestory"}>디스플레이: </Typography>
            <VerticalDivider></VerticalDivider>
            <Select
              sx={{ width: 200 }}
              size="small"
              value={preference.displayIndex.toString()}
              onChange={handleChangeDisplayIndex}
            >
              {displays?.map((display, index) => {
                return (
                  <MenuItem key={index} value={display?.id}>
                    Display {index + 1}
                  </MenuItem>
                );
              })}
            </Select>
          </Row>
          {/* <div
          style={{
            padding: 10,
          }}
        >
          <Typography fontFamily={"Maplestory"}>비트캣 위치</Typography>
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
                  display: "flex",
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormLabel id="demo-radio-buttons-group-label">
                  <Typography fontFamily={"Maplestory"}>비트캣 크기</Typography>
                </FormLabel>
                <VerticalDivider></VerticalDivider>
                <RadioGroup
                  onChange={(e) => {
                    e.preventDefault();
                    // console.log(e.target.value);
                    setScale({ scale: parseFloat(e.target.value) });
                  }}
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={preference.scale}
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="0.5"
                    control={<Radio />}
                    label="작게"
                  />
                  <FormControlLabel
                    value="0.75"
                    control={<Radio />}
                    label="중간"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="크게"
                  />
                </RadioGroup>
              </div>
            </FormControl>
          </Row>
        </div>
        <Divider></Divider>
        <div
          style={{
            padding: 30,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Button
            sx={{ width: 100 }}
            variant="contained"
            onClick={() => {
              savePosition(position);
              // console.log("restart", tempScale, preference.scale);
              setScale({ scale: tempScale });
            }}
          >
            <Typography fontFamily={"Maplestory"}>적용하기</Typography>
          </Button>
          <VerticalDivider></VerticalDivider> */}
          <Button
            sx={{ width: 100 }}
            variant="contained"
            onClick={() => {
              sendToMain("HIDE_SETTING_DIALOG", {});
            }}
          >
            <Typography fontFamily={"Maplestory"}>닫기</Typography>
          </Button>
        </div>
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
  );
};
