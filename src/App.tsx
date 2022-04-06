import { IpcRenderer, NativeImage } from "electron";
import React, { createRef, useCallback, useEffect, useState } from "react";
import "./App.css";
import { Memo } from "./Memo";
import { useAtom } from "jotai";
import { TopMenu } from "./TopMenu";
import {
  preferenceAtom,
  setFontSizeAtom,
  setMemoBoxWidthAtom,
  setMemoPrefixAtom,
} from "./jotai/Preference";
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
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import StraightenIcon from "@mui/icons-material/Straighten";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
// import MemoryIcon from "@mui/icons-material/Memory";

//@ts-ignore
import { useScreenshot } from "use-react-screenshot";

//@ts-ignore
import { rootPath } from "electron-root-path";

import {
  BackgroundColorPicker,
  FontColorPicker,
} from "./components/ColorPicker";
import { Row, RowRight, VerticalDivider } from "./components/HTMLComponents";
import {
  ColorPalete,
  DefaultWindowStyle,
  OutlineBorderStyle,
  Params,
} from "./constants/Styles";
import {
  Box,
  Card,
  Divider,
  IconButton,
  Input,
  TextField,
  Tooltip,
} from "@mui/material";
// @ts-ignore
// import html2canvas from "html2canvas-render-offscreen";
import html2canvas from "html2canvas-render-offscreen";

enum TargetColorType {
  COLOR_NONE,
  COLOR_BACKGROUND,
  COLOR_FONT,
}

const memoAtomsAtom = splitAtom(memosAtom);

function App() {
  const [image, setImage] = useState<NativeImage>();
  const [winSize, setWinSize] = useState({
    width: 1,
    height: 1,
  });
  const [preference] = useAtom(preferenceAtom);
  const [targetColorType, setTargetColorType] = useState(
    TargetColorType.COLOR_NONE
  );
  const [memoAtoms, removeMemoDataAtom] = useAtom(memoAtomsAtom);
  const [, setFontSize] = useAtom(setFontSizeAtom);
  const [, setMemoBoxWidth] = useAtom(setMemoBoxWidthAtom);
  const [, setMemoDatas] = useAtom(memosAtom);
  const [, setMemoPrefix] = useAtom(setMemoPrefixAtom);
  const [showMenu, setShowMenu] = useState(true);
  const [savePath, setSavePath] = useState(rootPath);
  const [tempFontSize, setTempFontSize] = useState(preference.fontSize);
  const [tempMemoBoxWidth, setTempMemoBoxWidth] = useState(
    preference.memoBoxWidth
  );
  const [tempMemoPrefix, setTempMemoPrefix] = useState(preference.memoPrefix);

  const handleSave = () => {
    let element = document.getElementById("save_area");
    if (element) {
      html2canvas(element, {
        allowTaint: false,
      }).then((canvas: any) => {
        document.body.appendChild(canvas);
        const dataURL = canvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.href = dataURL;
        link.download = "filename";
        link.click();
        console.log(canvas);
      });
    }
  };

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
        if (data?.path) {
          setSavePath(data?.path);
        } else {
          setSavePath(rootPath);
        }
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
    <div>
      <div
        style={{
          width: showMenu ? 320 : 60,
          resize: "none",
          position: "absolute",
          // height: "100vh",
          backgroundColor: ColorPalete.BackgroundColor,
          zIndex: 10000,
        }}
      >
        {showMenu ? (
          <Box>
            <Row>
              <Tooltip title="Memo Font Color">
                <FontDownloadIcon></FontDownloadIcon>
              </Tooltip>
              <VerticalDivider />
              <FontColorPicker></FontColorPicker>
            </Row>
            <Divider />
            <Row>
              <Tooltip title="Memo Background Color">
                <WallpaperIcon></WallpaperIcon>
              </Tooltip>
              <VerticalDivider />
              <BackgroundColorPicker></BackgroundColorPicker>
            </Row>
            <Divider />
            <Row>
              <Tooltip title="Memo Font Size">
                <FormatSizeIcon></FormatSizeIcon>
              </Tooltip>
              <VerticalDivider />
              <input
                style={{
                  height: 18,
                  width: 40,
                  border: "none",
                  borderBottom: "solid 0.5px grey",
                }}
                type="number"
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    setFontSize({ fontSize: tempFontSize });
                    e.currentTarget.blur();
                  }
                  console.log(e.target);
                }}
                onBlur={() => {
                  setFontSize({ fontSize: tempFontSize });
                }}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value > Params.MAX_FONT_SIZE) {
                    setTempFontSize(Params.MAX_FONT_SIZE);
                  } else if (value < Params.MIN_FONT_SIZE) {
                    setTempFontSize(Params.MIN_FONT_SIZE);
                  } else {
                    setTempFontSize(value);
                  }
                  // console.log(e);
                }}
                defaultValue={tempFontSize}
              />
              {/* <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} /> */}
            </Row>
            <Divider />
            <Row>
              <Tooltip title="Memo Width(px)">
                <StraightenIcon></StraightenIcon>
              </Tooltip>
              <VerticalDivider />
              <input
                style={{
                  height: 18,
                  width: 40,
                  border: "none",
                  borderBottom: "solid 0.5px grey",
                }}
                type="number"
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    setMemoBoxWidth({ memoBoxWidth: tempMemoBoxWidth });
                    e.currentTarget.blur();
                  }
                  console.log(e.target);
                }}
                onBlur={() => {
                  setMemoBoxWidth({ memoBoxWidth: tempMemoBoxWidth });
                }}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value > Params.MAX_MEMOBOX_WIDTH) {
                    setTempMemoBoxWidth(Params.MAX_MEMOBOX_WIDTH);
                  } else if (value < Params.MIN_MEMOBOX_WIDTH) {
                    setTempMemoBoxWidth(Params.MIN_MEMOBOX_WIDTH);
                  } else {
                    setTempMemoBoxWidth(value);
                  }
                }}
                defaultValue={tempMemoBoxWidth}
              />
            </Row>
            <Divider />
            <Row>
              <Tooltip title="Save Directory">
                <FolderIcon></FolderIcon>
              </Tooltip>
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
                  {savePath?.length > Params.MAX_PATH_LENGTH_IN_UI
                    ? savePath?.slice(0, Params.MAX_PATH_LENGTH_IN_UI) + "..."
                    : savePath}
                </Box>
              </Tooltip>
            </Row>
            <Divider />
            <Row>
              <Tooltip title="Memo File Prefix">
                <DriveFileRenameOutlineIcon></DriveFileRenameOutlineIcon>
              </Tooltip>
              <VerticalDivider />
              <input
                style={{
                  height: 18,
                  width: 40,
                  border: "none",
                  borderBottom: "solid 0.5px grey",
                }}
                // type="number"
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    setMemoPrefix({ memoPrefix: tempMemoPrefix });
                    e.currentTarget.blur();
                  }
                  console.log(e.target);
                }}
                onBlur={() => {
                  setMemoPrefix({ memoPrefix: tempMemoPrefix });
                }}
                onChange={(e) => {
                  console.log(e.target.value);
                  setTempMemoPrefix(e.target.value);
                }}
                defaultValue={tempMemoPrefix}
              />
            </Row>
            <Divider />
            <Row>
              <Tooltip title="Merge Memo and Image">
                <Button
                  onClick={handleSave}
                  variant="contained"
                  startIcon={<CallMergeIcon />}
                >
                  Save
                </Button>
              </Tooltip>
            </Row>
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
          <Box>
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
      <div
        id="save_area"
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
        <img
          style={{
            position: "absolute",
            zIndex: -1,
            userSelect: "none",
          }}
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
      </div>
    </div>
  );
}

export default App;
