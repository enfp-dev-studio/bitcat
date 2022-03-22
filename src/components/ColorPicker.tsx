"use strict";

import React, { useState } from "react";
import reactCSS from "reactcss";
import { ColorResult, SketchPicker } from "react-color";
import {
  preferenceAtom,
  setBackgroundColorAtom,
  setFontColorAtom,
} from "../jotai/Preference";
import { useAtom } from "jotai";

export const FontColorPicker = () => {
  const [preference] = useAtom(preferenceAtom);
  const [, setFontColor] = useAtom(setFontColorAtom);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleClose = () => {
    setShowColorPicker(false);
  };

  const handleChange = (color: ColorResult) => {
    setFontColor({ color: color.hex });
  };

  return (
    <div>
      <div
        style={{
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <div
          style={{
            width: "36px",
            height: "14px",
            borderRadius: "2px",
            background: preference.fontColor,
            // background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
          }}
        />
      </div>
      {showColorPicker ? (
        <div
          style={{
            position: "absolute",
            zIndex: "2",
          }}
        >
          <div
            style={{
              position: "fixed",
              top: "0px",
              right: "0px",
              bottom: "0px",
              left: "0px",
            }}
            onClick={handleClose}
          />
          <SketchPicker color={preference.fontColor} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

export const BackgroundColorPicker = () => {
  const [, setBackgroundColor] = useAtom(setBackgroundColorAtom);
  const [preference] = useAtom(preferenceAtom);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleClose = () => {
    setShowColorPicker(false);
  };

  const handleChange = (color: ColorResult) => {
    setBackgroundColor({
      color: `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`,
    });
  };

  return (
    <div>
      <div
        style={{
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <div
          style={{
            width: "36px",
            height: "14px",
            borderRadius: "2px",
            background: preference.backgroundColor,
          }}
        />
      </div>
      {showColorPicker ? (
        <div
          style={{
            position: "absolute",
            zIndex: "2",
          }}
        >
          <div
            style={{
              position: "fixed",
              top: "0px",
              right: "0px",
              bottom: "0px",
              left: "0px",
            }}
            onClick={handleClose}
          />
          <SketchPicker
            color={preference.backgroundColor}
            onChange={handleChange}
          />
        </div>
      ) : null}
    </div>
  );
};
