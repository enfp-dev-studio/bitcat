import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Slider,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import {
  ExchangeDatas,
  setExchangeAtom,
  ExchangeDataAtom,
  CryptoExchange,
} from "../jotai/Crypto";
import { useAtom } from "jotai";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import { Button } from "@mui/material";
import "react-use-measure";
import { IpcRenderer } from "electron";
import { HorizontalDivider, Row, VerticalDivider } from "./HTMLComponents";
import {
  Preference,
  resetPreferenceAtom,
  savePositionAtom,
  setDisplayIndexAtom,
  setScaleAtom,
} from "../jotai/Preference";
import { UI } from "../constants/UI";
import { PositionSelect } from "./PositionSelect";
import { sendToMain } from "../util/Util";
import useMeasure from "react-use-measure";

import RefreshIcon from "@mui/icons-material/Refresh";

export const SettingDialog = () => {
  const [, savePosition] = useAtom(savePositionAtom);
  const [exchangeData] = useAtom(ExchangeDataAtom);
  const [, setExchange] = useAtom(setExchangeAtom);
  const [preference] = useAtom(Preference);
  const [, setScale] = useAtom(setScaleAtom);

  const [coins, setCoins] =
    useState<[{ symbol: string; id: string; name: string }]>();
  const [coin, setCoin] = useState<{
    symbol: string;
    id: string;
    name: string;
  }>();
  const [, setDisplayIndex] = useAtom(setDisplayIndexAtom);
  const [selectedDisplay, setSelectedDisplay] = useState<Electron.Display>();
  const [displays, setDisplays] = useState<Electron.Display[]>();

  const [position, setPosition] = useState({
    x: preference.positionX,
    y: preference.positionY,
  });

  const [tempScale, setTempScale] = useState(preference.scale);
  const [ref, bounds] = useMeasure();

  const [, resetPreference] = useAtom(resetPreferenceAtom);

  useEffect(() => {
    const getCoinList = async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const result = await response.json();
      if (result?.length > 100) {
        const coins = result.slice(0, 100);
        setCoins(coins);
        setCoin(coins[0]);
      }
    };
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
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value) {
      setExchange({ name: event.target.value });
    }
  };

  const handleChangeDisplayIndex = (event: SelectChangeEvent) => {
    event.preventDefault();
    if (event?.target?.value) {
      setDisplayIndex({ index: parseInt(event.target.value) });
    }
  };

  // useEffect(() => {
  //   console.log(bounds);
  //   if (bounds?.width > 0 && bounds?.height > 0) {
  //     sendToMain("SET_SETTING_DIALOG_WINDOW_SIZE", {
  //       width: bounds.width,
  //       height: bounds.height,
  //     });
  //   }
  // }, [bounds?.width, bounds?.height]);

  return (
    <Paper
      elevation={10}
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 10,
        backgroundColor: UI.DialogBackgroundColor,
        borderRadius: 4,
        // justifyContent: "space-evenly",
      }}
    >
      <div>
        <Row>
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
        </Row>
        <Row>
          <Typography fontFamily={"Maplestory"}>디스플레이: </Typography>
          <VerticalDivider></VerticalDivider>
          <Select
            value={selectedDisplay?.id.toString()}
            onChange={handleChangeDisplayIndex}
          >
            {displays?.map((display, index) => {
              return (
                <MenuItem key={index} value={display?.id}>
                  Display {index}
                </MenuItem>
              );
            })}
          </Select>
        </Row>
        <div
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
        </div>
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
                  setTempScale(parseFloat(e.target.value));
                }}
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={tempScale}
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
                <FormControlLabel value="1" control={<Radio />} label="크게" />
              </RadioGroup>
            </div>
          </FormControl>
        </Row>
      </div>
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
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
        <VerticalDivider></VerticalDivider>
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
      <div style={{ position: "absolute", top: 10, right: 10 }}>
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
      </div>
    </Paper>
  );
};
