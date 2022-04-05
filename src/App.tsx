import { IpcRenderer, NativeImage } from "electron";
import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Memo } from "./Memo";
import { useAtom } from "jotai";
import { TopMenu } from "./TopMenu";
import { preferenceAtom } from "./jotai/Preference";
import { MemoType, Position } from "./type/Type";
import { createNewMemoId } from "./util/Util";
import { memosAtom } from "./jotai/Data";
import { splitAtom } from "jotai/utils";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import FolderIcon from "@mui/icons-material/Folder";
//@ts-ignore
import { rootPath } from "electron-root-path";

import {
  BackgroundColorPicker,
  FontColorPicker,
} from "./components/ColorPicker";
import { Row, VerticalDivider } from "./components/HTMLComponents";
import {
  ColorPalete,
  DefaultWindowStyle,
  OutlineBorderStyle,
} from "./constants/Styles";
import { Box, Card, Divider, Input, TextField, Tooltip } from "@mui/material";

enum TargetColorType {
  COLOR_NONE,
  COLOR_BACKGROUND,
  COLOR_FONT,
}

const memoAtomsAtom = splitAtom(memosAtom);

function App() {
  const [image, setImage] = useState<NativeImage>();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [winSize, setWinSize] = useState({
    width: 1,
    height: 1,
  });
  const [preference] = useAtom(preferenceAtom);
  const [targetColorType, setTargetColorType] = useState(
    TargetColorType.COLOR_NONE
  );
  const [memoAtoms, removeMemoDataAtom] = useAtom(memoAtomsAtom);
  const [, setMemoDatas] = useAtom(memosAtom);
  const [showMenu, setShowMenu] = useState(true);
  const [savePath, setSavePath] = useState(rootPath);

  useEffect(() => {
    //@ts-ignore
    const it = document?.fonts?.entries();
    var result = it.next();
    // console.log(result);
    while (!result.done) {
      console.log(result.value); // 1 2 3
      result = it.next();
    }
    //@ts-ignore
    const ipcRenderer: IpcRenderer = window.ipcRenderer;
    if (ipcRenderer) {
      ipcRenderer?.on("SET_SOURCE", (event: any, data: any) => {
        console.log("set source invoke", data);
        setImage(data?.image);
        setWinSize({
          width: data.width,
          height: data.height,
        });
      });

      ipcRenderer?.on("SET_SAVE_PATH", (event: any, data: any) => {
        console.log(data);
        setSavePath(data?.path);
      });
    }

    window.addEventListener("resize", (e) => {
      console.log(e);
      //@ts-ignore
      if (window?.ipcRenderer) {
        //@ts-ignore
        // window?.ipcRenderer.send("RESIZE_WINDOW", {width: e.});
      }
    });
    // ipcRenderer.on("SET_SOURCE", async (event: any, sourceId: any) => {});
  }, []);
  const createMemo = (position: Position) => {
    const memo: MemoType = {
      id: createNewMemoId(),
      position,
      text: "test",
    };

    setMemoDatas((memos) => [...memos, memo]);
  };
  const handleClick = (e: any) => {
    if (e.altKey && e.shiftKey) {
      createMemo({ x: e?.clientX, y: e?.clientY });
    }
  };
  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.15)",
        // ...OutlineBorderStyle,
        ...DefaultWindowStyle,
        width: winSize.width,
        height: winSize.height,
        // resize: "none",
      }}
    >
      {/* <div
        style={{
          position: "absolute",
          backgroundColor: "rgba(255,255,255,0.5)",
          height: 60,
          right: 0,
          top: 0,
        }}
      >
        <TopMenu></TopMenu>
      </div> */}
      <img
        style={{ position: "absolute", zIndex: -1 }}
        src={image?.toDataURL()}
      ></img>
      {memoAtoms?.map((e, i) => {
        return (
          <Memo
            key={i}
            memoAtom={e}
            removeMemoDataAtom={removeMemoDataAtom}
          ></Memo>
        );
      })}
      <div
        style={{
          width: showMenu ? 320 : 60,
          resize: "none",
          position: "absolute",
          // height: "100vh",
          backgroundColor: ColorPalete.BackgroundColor,
        }}
      >
        {showMenu ? (
          <Box boxShadow={3}>
            <Row>
              <FontDownloadIcon></FontDownloadIcon>
              <VerticalDivider />
              <FontColorPicker></FontColorPicker>
            </Row>
            <Divider />
            <Row>
              <WallpaperIcon></WallpaperIcon>
              <VerticalDivider />
              <BackgroundColorPicker></BackgroundColorPicker>
            </Row>
            <Divider />
            <Row>
              <FolderIcon></FolderIcon>
              <VerticalDivider />
              <Tooltip title={savePath ? savePath : ""} arrow>
                <Box
                  onClick={() => {
                    //@ts-ignore
                    if (window?.ipcRenderer) {
                      //@ts-ignore
                      window?.ipcRenderer.send("MAIN_SELECT_PATH", "start-ipc");
                    }
                  }}
                >
                  {savePath?.slice(0, 20)}...
                </Box>
              </Tooltip>
            </Row>
            <Divider />
            {image && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  onClick={() => {
                    setShowMenu(!showMenu);
                  }}
                >
                  <KeyboardArrowUpIcon fontSize="large"></KeyboardArrowUpIcon>
                </Button>
              </div>
            )}
          </Box>
        ) : (
          <Box boxShadow={3}>
            <Button
              onClick={() => {
                setShowMenu(true);
              }}
            >
              <MenuIcon></MenuIcon>
            </Button>
          </Box>
        )}
      </div>
    </div>
  );
}

export default App;
