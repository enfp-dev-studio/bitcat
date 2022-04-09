import { IpcRenderer, NativeImage } from "electron";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { splitAtom } from "jotai/utils";

//@ts-ignore
import Spritesheet from "react-responsive-spritesheet";

//@ts-ignore
import { rootPath } from "electron-root-path";
import { CryptoInfo } from "./components/CryptoInfo";

function App() {
  const [image, setImage] = useState<NativeImage>();
  const [winSize, setWinSize] = useState({
    width: 1,
    height: 1,
  });

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
        // backgroundColor: "transparent",
        backgroundColor: "white",
      }}
    >
      <Spritesheet
        image={"image/bitcat_down_sheet.png"}
        widthFrame={649}
        heightFrame={381}
        steps={9}
        fps={12}
        autoplay={true}
        loop={true}
        scale={0.1}
        /////////////
        // background={`https://raw.githubusercontent.com/danilosetra/react-responsive-spritesheet/master/assets/images/examples/sprite-image-background.png`}
        // backgroundSize={`cover`}
        // backgroundRepeat={`no-repeat`}
        // backgroundPosition={`center center`}
      />
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <CryptoInfo></CryptoInfo>
      </div>
    </div>
  );
}

export default App;
