import { IpcRenderer } from "electron";
import { createRef, useEffect, useState } from "react";
import Fab from "@mui/material/Fab";
//@ts-ignore
import Spritesheet from "react-responsive-spritesheet";
//@ts-ignore
// import Spritesheet from "react-spritesheet";
import SettingsIcon from "@mui/icons-material/Settings";

//@ts-ignore
// import { rootPath } from "electron-root-path";
import { CryptoInfo } from "./components/CryptoInfo";
import { IconButton, Paper } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { SettingDialog } from "./components/SettingDialog";
import { UI } from "./constants/UI";
import { BitcatState } from "./jotai/Crypto";
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';

function App() {
  // const [image, setImage] = useState<NativeImage>();
  const spritesheetRef = createRef();
  const [fps, setFPS] = useState(12);
  // const [winSize, setWinSize] = useState({
  //   width: 1,
  //   height: 1,
  // });
  const [showSetting, setShowSetting] = useState(false);

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
        // setImage(data?.image);
        setWinSize({
          width: data.width,
          height: data.height,
        });
      });

      ipcRenderer?.on("SET_SAVE_PATH", (event: any, data: any) => {
        // if (data?.path) {
        //   setSavePath(data?.path);
        // } else {
        //   setSavePath(rootPath);
        // }
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
  return (
    <div
      style={{
        backgroundColor: "transparent",
        // backgroundColor: "rgba(255, 255, 255, 0.3)",
        // backdropFilter: "blur(30px)",
        // WebkitBackdropFilter: "blur(30px)",
      }}
    >
      <Spritesheet
        ref={spritesheetRef}
        image={"image/bitcat_down_sheet.png"}
        widthFrame={UI.frameWidth}
        heightFrame={UI.frameHeight}
        steps={9}
        fps={fps}
        autoplay={true}
        loop={true}
        scale={0.1}
        /////////////
        // background={`https://raw.githubusercontent.com/danilosetra/react-responsive-spritesheet/master/assets/images/examples/sprite-image-background.png`}
        // backgroundSize={`cover`}
        // backgroundRepeat={`no-repeat`}
        // backgroundPosition={`center center`}
      />
      {/* <Spritesheet.AnimatedSpriteSheet
        filename="image/bitcat_down_sheet.png"
        initialFrame={0}
        frame={{ width: UI.frameWidth, height: UI.frameHeight }}
        bounds={{ x: 0, y: 0, width: 5841, height: UI.frameHeight }}
        isPlaying={isPlaying}
        loop
        speed={900}
      /> */}
      <div
        style={{
          position: "absolute",
          top: 20,
          // bottom: 0,

          left: 0,
          right: 0,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <CryptoInfo></CryptoInfo>
      </div>
      <div style={{ position: "absolute", bottom: 10, right: 10 }}>
        <Paper elevation={3} style={{ borderRadius: 40 }}>
          <IconButton
            onClick={() => {
              setShowSetting(true);
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Paper>
        <Paper elevation={3} style={{ borderRadius: 40 }}>
          <IconButton
            onClick={() => {
              // setIsPlaying(!isPlaying);
              setFPS(fps + 12);
              // @ts-ignore
              spritesheetRef.current.setFps(fps + 12);
            }}
          >
            <FastForwardIcon />
          </IconButton>
        </Paper>
        <Paper elevation={3} style={{ borderRadius: 40 }}>
          <IconButton
            onClick={() => {
              // setIsPlaying(!isPlaying);
              setFPS(fps - 12 > 0 ? fps - 12 : 1);
              // @ts-ignore
              spritesheetRef.current.setFps(fps - 12 > 0 ? fps - 12 : 1);
            }}
          >
            <FastRewindIcon />
          </IconButton>
        </Paper>

      </div>
      <Dialog
        open={showSetting}
        onClose={() => {
          setShowSetting(false);
        }}
      >
        <SettingDialog></SettingDialog>
      </Dialog>
    </div>
  );
}

export default App;
