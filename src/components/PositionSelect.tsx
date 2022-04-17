import { Box } from "@mui/material";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { UI } from "../constants/UI";
import { Preference } from "../jotai/Preference";
import { Position } from "../type/Type";

const UIScale = 0.25;
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
  // console.log(preference.scale);
  return (
    <div
      style={{
        borderRadius: 4,
        width: screenWidth * UIScale,
        height: screenHeight * UIScale,
        backgroundColor: UI.ScreenBackground,
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
        size={{
          width: UI.frameWidth * UIScale * preference.scale,
          height: UI.frameHeight * UIScale * preference.scale,
        }}
        // dragGrid={[1, 1]}
        bounds="parent"
        onDragStop={(e, d) => {
          setPosition({ x: d.x / UIScale, y: d.y / UIScale });
        }}
      >
        <div
          style={{
            borderRadius: 4,
            backgroundColor: "white",
            width: "100%",
            height: "100%",
            // backgroundSize: "",
            backgroundImage: 'url("image/position_img.png")',
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </Rnd>
    </div>
  );
};
