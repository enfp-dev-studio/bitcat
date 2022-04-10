import React, { useCallback, useEffect, useState } from "react";
import { Box, Container, MenuItem } from "@mui/material";
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

export const SettingDialog = () => {
  const [exchangeData] = useAtom(ExchangeDataAtom);
  const [, setExchange] = useAtom(setExchangeAtom);
  const [coins, setCoins] =
    useState<[{ symbol: string; id: string; name: string }]>();
  const [coin, setCoin] =
    useState<{ symbol: string; id: string; name: string }>();

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

    // getCoinList();
    // return () => {};
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value) {
      setExchange({ name: event.target.value });
    }
  };

  return (
    <Container sx={{ padding: 10 }}>
      <Box
        sx={{
          display: "flex",
          flex: 0.8,
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
    </Container>
  );
};
