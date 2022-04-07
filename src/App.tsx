import { IpcRenderer, NativeImage } from "electron";
import { useEffect, useState } from "react";
import "./App.css";
import { Memo } from "./Memo";
import { useAtom } from "jotai";
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
import Spritesheet from "react-responsive-spritesheet";

//@ts-ignore
import { rootPath } from "electron-root-path";

import {
  BackgroundColorPicker,
  FontColorPicker,
} from "./components/ColorPicker";
import { Row, VerticalDivider } from "./components/HTMLComponents";
import { ColorPalete, DefaultWindowStyle, Params } from "./constants/Styles";
import { Box, Divider, Tooltip } from "@mui/material";
// @ts-ignore
// import html2canvas from "html2canvas-render-offscreen";
import html2canvas from "html2canvas-render-offscreen";

const memoAtomsAtom = splitAtom(memosAtom);

function App() {
  const [image, setImage] = useState<NativeImage>();
  const [winSize, setWinSize] = useState({
    width: 1,
    height: 1,
  });
  const [preference] = useAtom(preferenceAtom);
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
        //@ts-ignore
        if (window?.ipcRenderer) {
          //@ts-ignore
          window?.ipcRenderer.send("SAVE_IMAGE_FILE", {
            dataURL,
            savePath: preference.savePath,
          });
        }
        // let link = document.createElement("a");
        // link.href = dataURL;
        // link.download = "filename";
        // link.click();
      });
    }
  };

  useEffect(() => {
    //@ts-ignore
    const it = document?.fonts?.entries();
    var result = it.next();
    while (!result.done) {
      result = it.next();
    }
    //@ts-ignore
    const ipcRenderer: IpcRenderer = window.ipcRenderer;
    if (ipcRenderer) {
      ipcRenderer?.on("SET_SOURCE", (event: any, data: any) => {
        // console.log("set source invoke", data);
        setImage(data?.image);
        setWinSize({
          width: data.width,
          height: data.height,
        });
      });

      ipcRenderer?.on("SET_SAVE_PATH", (event: any, data: any) => {
        if (data?.path) {
          setSavePath(data?.path);
        } else {
          setSavePath(rootPath);
        }
      });
    }

    window.addEventListener("resize", (e) => {
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
      style={{
        backgroundColor: "transparent",
      }}
    >
      <Spritesheet
        // image={"src/assets/bitcat_down_sheet.png"}
        // widthFrame={1298}
        // heightFrame={762}
        // steps={9}
        // fps={100}
        image={`https://raw.githubusercontent.com/danilosetra/react-responsive-spritesheet/master/assets/images/examples/sprite-image-horizontal.png`}
        widthFrame={420}
        heightFrame={500}
        steps={14}
        fps={10}
        autoplay={true}
        loop={true}
        // background={`https://raw.githubusercontent.com/danilosetra/react-responsive-spritesheet/master/assets/images/examples/sprite-image-background.png`}
        // backgroundSize={`cover`}
        // backgroundRepeat={`no-repeat`}
        // backgroundPosition={`center center`}
      />
      <div style={{ backgroundColor: "transparent" }}>123456</div>
    </div>
  );
}

export default App;
