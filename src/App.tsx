import { ipcRenderer, IpcRenderer } from "electron";
import { createRef, useEffect, useRef, useState } from "react";
import Fab from "@mui/material/Fab";
//@ts-ignore
import Spritesheet from "react-responsive-spritesheet";
//@ts-ignore
// import Spritesheet from "react-spritesheet";
import SettingsIcon from "@mui/icons-material/Settings";

//@ts-ignore
// import { rootPath } from "electron-root-path";
import { CryptoInfo } from "./components/CryptoInfo";
import { CircularProgress, IconButton, Modal, Paper } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { UI } from "./constants/UI";
// import { BitcatState } from "./jotai/Crypto";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import { WindowInfo } from "./type/Type";
import { useAtom } from "jotai";
import { Preference, resetPreference } from "./jotai/Preference";
import { AnimationAtom } from "./jotai/Animation";
import { sendToMain } from "./util/Util";
import "./App.css";
import { loadingAtom } from "./jotai/Loading";

function App() {
  const [loading] = useAtom(loadingAtom);
  const [animation] = useAtom(AnimationAtom);
  // const [image, setImage] = useState<NativeImage>();
  const spritesheetRef = useRef(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // const [fps, setFPS] = useState(animation.fps);
  const [preference] = useAtom(Preference);
  // const [isGrabbing, setIsGrabbing] = useState(false);
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

      ipcRenderer?.on("RESET_PREFERENCE", (event: any, data: any) => {
        resetPreference();
      });
    }

    window.addEventListener("resize", (e) => {
      //@ts-ignore
      if (window?.ipcRenderer) {
        //@ts-ignore
        // window?.ipcRenderer.send("RESIZE_WINDOW", {width: e.});
      }
    });

    // window.addEventListener("mousedown", (e) => {
    //   e.preventDefault();
    //   console.log("mousedown");
    //   if (!isGrabbing) {
    //     setIsGrabbing(true);
    //   }
    // });

    // window.addEventListener("mousemove", (e) => {
    //   e.preventDefault();
    //   console.log(1, isGrabbing);
    //   if (isGrabbing) {
    //     sendToMain("SET_POSITION", { x: e.clientX, y: e.clientY });
    //   }
    // });

    // window.addEventListener("mouseup", (e) => {
    //   e.preventDefault();
    //   if (isGrabbing) {
    //     setIsGrabbing(false);
    //     // sendToMain("SET_POSITION", { x: e.x, y: e.y });
    //   }
    // });

    // console.log(isGrabbing);

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
        // console.log(preference);
        ipcRenderer.send("APPLY_PREFERENCE", preference);
      }
    };
    applyPreference();
    // ipcRenderer.on("SET_SOURCE", async (event: any, sourceId: any) => {});
  }, []);

  console.log(animation);
  useEffect(() => {
    // @ts-ignore
    if (animation.fps !== spritesheetRef?.current?.fps) {
      // @ts-ignore
      spritesheetRef?.current?.setFps(animation.fps);
    }
  }, [animation]);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
      }}
    >
      <div
        className="container"
        // draggable="true"
        //   // onDrag={(e) => {
        //   //   console.log(e);
        //   // }}
        //   onDragStart={(e) => {
        //     // e.preventDefault();
        //     console.log(e);
        //     // e.dataTransfer.setDragImage(document.getElementById("myElement", 0, 0));
        //     setDragOffset({ x: e.clientX, y: e.clientY });
        //   }}
        //   onDragOver={(e) => {
        //     e.preventDefault();
        //     // console.log(e);
        //   }}
        //   onDragEnd={(e) => {
        //     e.preventDefault();
        //     console.log(dragOffset, e.screenX, e.screenY);
        //     sendToMain("SET_POSITION", {
        //       x: e.screenX - dragOffset.x,
        //       y: e.screenY - dragOffset.y,
        //     });
        //   }}
        style={{
          overflow: "hidden",
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          // backgroundColor: "rgba(255, 255, 255, 0.3)",
          width: UI.frameWidth * preference.scale,
          height: UI.frameHeight * preference.scale,
          cursor: "grabbing",
          // backdropFilter: "blur(30px)",
          // WebkitBackdropFilter: "blur(30px)",
        }}
      >
        <Spritesheet
          ref={spritesheetRef}
          image={animation.spritesheet}
          widthFrame={UI.frameWidth}
          heightFrame={UI.frameHeight}
          steps={9}
          // fps={fps}
          // fps={animation.fps}
          // autoplay={true}
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
            width: "100%",
            // bottom: 0,
            left: "auto",
            right: "auto",
          }}
        >
          <CryptoInfo></CryptoInfo>
          {/* <IconButton
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
        </IconButton> */}
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
      <Modal
        open={loading}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress></CircularProgress>
        </div>
      </Modal>
    </div>
  );
}

export default App;
