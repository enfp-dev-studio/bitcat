import { IpcRenderer, NativeImage } from "electron";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import {
  preferenceAtom,
} from "./jotai/Preference";
import { Position } from "./type/Type";
import { createNewMemoId } from "./util/Util";
import { splitAtom } from "jotai/utils";

//@ts-ignore
import Spritesheet from "react-responsive-spritesheet";

//@ts-ignore
import { rootPath } from "electron-root-path";

// @ts-ignore
// import html2canvas from "html2canvas-render-offscreen";
import html2canvas from "html2canvas-render-offscreen";

function App() {
  const [image, setImage] = useState<NativeImage>();
  const [winSize, setWinSize] = useState({
    width: 1,
    height: 1,
  });
  const [preference] = useAtom(preferenceAtom);
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
      }}
    >
      <Spritesheet
        image={"image/bitcat_down_sheet.png"}
        widthFrame={1298}
        heightFrame={762}
        steps={9}
        fps={12}
        autoplay={true}
        loop={true}
        /////////////
        // background={`https://raw.githubusercontent.com/danilosetra/react-responsive-spritesheet/master/assets/images/examples/sprite-image-background.png`}
        // backgroundSize={`cover`}
        // backgroundRepeat={`no-repeat`}
        // backgroundPosition={`center center`}
      />
    </div>
  );
}

export default App;
