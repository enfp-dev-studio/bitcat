import { Box } from "@mui/material";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { UI } from "../constants/UI";
import { Preference } from "../jotai/Preference";
import { Position } from "../type/Type";

const UIScale = 0.2;
export const PositionSelect = ({
  display,
  setPosition,
  position,
}: {
  display: Electron.Display;
  setPosition: (position: Position) => void;
  position: Position;
}) => {
  const [preference] = useAtom(Preference);
  const screenWidth = display.size.width;
  const screenHeight = display.size.height;
  return (
    <div
      style={{
        width: screenWidth * UIScale,
        height: screenHeight * UIScale,
        backgroundColor: "black",
      }}
    >
      <Rnd
        default={{
          x: position.x * UIScale,
          y: position.y * UIScale,
          width: UI.frameWidth * UIScale * preference.scale,
          height: UI.frameHeight * UIScale * preference.scale,
        }}
        // position={position}
        // size={{
        //   width: UI.frameWidth * UIScale,
        //   height: UI.frameHeight * UIScale,
        // }}
        // dragGrid={[1, 1]}
        bounds="parent"
        onDragStop={(e, d) => {
          setPosition({ x: d.x / UIScale, y: d.y / UIScale });
        }}
      >
        <Box
          sx={{ backgroundColor: "white", width: "100%", height: "100%" }}
        ></Box>
      </Rnd>
    </div>
  );
};
