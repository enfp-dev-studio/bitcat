import { ipcRenderer, IpcRenderer } from "electron";
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
import { UI } from "./constants/UI";
import { BitcatState } from "./jotai/Crypto";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import { WindowInfo } from "./type/Type";
import { useAtom } from "jotai";
import { Preference } from "./jotai/Preference";

function App() {
  // const [image, setImage] = useState<NativeImage>();
  const spritesheetRef = createRef();
  const [fps, setFPS] = useState(12);
  const [preference] = useAtom(Preference);
  // const [windowInfo, setWindowInfo] = useState<WindowInfo>({
  //   x: 0,
  //   y: 0,
  //   maxX: UI.frameWidth * preference.scale,
  //   maxY: UI.frameHeight * preference.scale,
  // });

  // const [winSize, setWinSize] = useState({
  //   width: 1,
  //   height: 1,
  // });

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
      ipcRenderer?.on("MOVE_WINDOW", (event: any, data: any) => {
        // console.log("set source invoke", data);
        // setImage(data?.image);
        // setWinSize({
        //   width: data.width,
        //   height: data.height,
        // });
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

    // const getWindowPosition = async () => {
    //   //@ts-ignore
    //   const ipcRenderer: IpcRenderer = window.ipcRenderer;
    //   if (ipcRenderer) {
    //     ipcRenderer.send("GET_POSITION");
    //   }
    //   if (ipcRenderer) {
    //     ipcRenderer?.on(
    //       "GET_POSITION_RETURN",
    //       (
    //         event: any,
    //         data: { maxX: number; maxY: number; x: number; y: number }
    //       ) => {
    //         setWindowInfo(data);
    //       }
    //     );
    //   }
    // };
    // getWindowPosition();
    const applyPreference = () => {
      // console.log(preference);
      //@ts-ignore
      const ipcRenderer: IpcRenderer = window.ipcRenderer;
      if (ipcRenderer) {
        console.log(preference);
        ipcRenderer.send("APPLY_PREFERENCE", preference);
      }
    };
    applyPreference();
    // ipcRenderer.on("SET_SOURCE", async (event: any, sourceId: any) => {});
  }, []);
  return (
    <div
      style={{
        backgroundColor: "transparent",
        // backgroundColor: "rgba(255, 255, 255, 0.3)",
        width: UI.frameWidth * preference.scale,
        height: UI.frameHeight * preference.scale,
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
          top: 40 * preference.scale,
          // bottom: 0,

          left: 0,
          right: 0,
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "cetner",
        }}
      >
        <CryptoInfo></CryptoInfo>
        <IconButton
          style={{
            backgroundColor: "white",
            marginLeft: UI.margin,
            height: UI.priceBarHeight * preference.scale,
            width: UI.priceBarHeight * preference.scale,
          }}
          onClick={() => {
            //@ts-ignore
            const ipcRenderer: IpcRenderer = window.ipcRenderer;
            if (ipcRenderer) {
              ipcRenderer.send("SHOW_SETTING_DIALOG");
            }
          }}
        >
          <SettingsIcon
            sx={{
              width: UI.textSize * preference.scale,
              height: UI.textSize * preference.scale,
            }}
          />
        </IconButton>
      </div>
      {/* <div style={{ position: "absolute", bottom: 10, right: 10 }}>
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
        <Paper
          elevation={3}
          style={{ borderRadius: UI.textSize * preference.scale }}
        >
          <IconButton
            sx={{ fontSize: UI.textSize * preference.scale }}
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
      </div> */}
    </div>
  );
}

export default App;
