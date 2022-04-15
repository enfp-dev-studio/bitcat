import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Slider,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
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
import { IpcRenderer } from "electron";
import { Row } from "./HTMLComponents";
import {
  Preference,
  savePositionAtom,
  setDisplayIndexAtom,
  setScaleAtom,
} from "../jotai/Preference";
import { UI } from "../constants/UI";
import { PositionSelect } from "./PositionSelect";
import { sendToMain } from "../util/Util";

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

  return (
    <div style={{ width: UI.frameWidth * 0.8, padding: 10 }}>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>거래소: </Typography>
        <Divider orientation="vertical" variant="middle" flexItem />
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
      </Box>
      <Select onChange={handleChangeDisplayIndex}>
        {displays?.map((display, index) => {
          return (
            <MenuItem key={index} value={index}>
              Display {index}
            </MenuItem>
          );
        })}
      </Select>
      {selectedDisplay && (
        <PositionSelect
          position={position}
          setPosition={setPosition}
          display={selectedDisplay}
        ></PositionSelect>
      )}
      <Row>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">크기</FormLabel>
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
            <FormControlLabel value="0.25" control={<Radio />} label="작게" />
            <FormControlLabel value="0.5" control={<Radio />} label="중간" />
            <FormControlLabel value="1" control={<Radio />} label="크게" />
          </RadioGroup>
        </FormControl>
        {/* <Button
          onClick={() => {
            //@ts-ignore
            const ipcRenderer: IpcRenderer = window.ipcRenderer;
            if (ipcRenderer) {
              ipcRenderer.send("RESTART_WINDOW");
            }
          }}
        >
          적용하기
        </Button> */}
        <Button
          onClick={() => {
            savePosition(position);
            // console.log("restart", tempScale, preference.scale);
            if (tempScale > 0 && tempScale !== preference.scale) {
              setScale({ scale: tempScale });
              sendToMain("RESTART_WINDOW", {});
            } else {
              sendToMain("HIDE_SETTING_DIALOG", {});
            }
          }}
        >
          닫기
        </Button>
      </Row>
    </div>
  );
};
