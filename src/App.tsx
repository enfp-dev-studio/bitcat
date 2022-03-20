import { IpcRenderer, NativeImage } from "electron";
import React, { useCallback, useEffect, useState } from "react";
// import Draggable from "react-draggable";
// import logo from "./logo.svg";
import "./App.css";
import { Memo } from "./Memo";
// import ReactFlow, { Node } from "react-flow-renderer";
import {
  CirclePicker,
  ColorChangeHandler,
  ColorResult,
  CompactPicker,
  SketchPicker,
} from "react-color";

import { useAtom } from "jotai";
import { TopMenu } from "./TopMenu";
import { preferenceAtom } from "./jotai/Preference";
import { MemoType } from "./type/Type";
import { createNewMemoId } from "./util/Util";
import { memosAtom } from "./jotai/Data";
import { splitAtom } from "jotai/utils";

// const useStore = create((set: any) => ({
//   color: "#ffffff",
//   pickColor: (color: ColorResult) => set(() => ({ color: color.hex })),
// }));

enum TargetColorType {
  COLOR_NONE,
  COLOR_BACKGROUND,
  COLOR_FONT,
}

const memoAtomsAtom = splitAtom(memosAtom);

function App() {
  const [image, setImage] = useState<NativeImage>();
  // const [elements, setElements] = useState<Node[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [preference, setPreference] = useAtom(preferenceAtom);
  const [targetColorType, setTargetColorType] = useState(
    TargetColorType.COLOR_NONE
  );
  const [memoAtoms, removeMemoDataAtom] = useAtom(memoAtomsAtom);
  const [, setMemoDatas] = useAtom(memosAtom);

  useEffect(() => {
    //@ts-ignore
    const it = document?.fonts?.entries();
    var result = it.next();
    console.log(result);
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
      });
    }
    // ipcRenderer.on("SET_SOURCE", async (event: any, sourceId: any) => {});
  }, []);
  const handleClick = (e: any) => {
    if (e.altKey && e.shiftKey) {
      // console.log(e?.clientX);
      const memo: MemoType = {
        id: createNewMemoId(),
        position: {
          x: e?.clientX,
          y: e?.clientY,
        },
        text: "test",
      };

      setMemoDatas((memos) => [...memos, memo]);
    }
  };
  // const pickColor = useStore((state) => state.pickColor);
  // const color = useStore((state) => state.color);

  return (
    <div
      onClick={handleClick}
      // className="App"
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        // backgroundImage: ,
      }}
    >
      <div
        style={{
          position: "absolute",
          backgroundColor: "rgba(255,255,255,0.5)",
          height: 60,
          right: 0,
          top: 0,
        }}
      >
        <TopMenu></TopMenu>
      </div>
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
      <div>
        <button
          style={{ color: preference.fontColor }}
          onClick={() => {
            setTargetColorType(TargetColorType.COLOR_FONT);
            setShowColorPicker(!showColorPicker);
          }}
        >
          Font Color
        </button>
        <button
          style={{ color: preference.backgroundColor }}
          onClick={() => {
            setTargetColorType(TargetColorType.COLOR_BACKGROUND);
            setShowColorPicker(!showColorPicker);
          }}
        >
          Background Color
        </button>
      </div>
      {showColorPicker && (
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.5)",
            position: "absolute",
            padding: 10,
          }}
        >
          <SketchPicker
            onChangeComplete={(
              colorResult: ColorResult,
              event: React.ChangeEvent<HTMLInputElement>
            ) => {
              // pickColor(color);
              switch (targetColorType) {
                case TargetColorType.COLOR_BACKGROUND:
                  setPreference({
                    ...preference,
                    backgroundColor: colorResult.hex,
                  });
                  break;
                case TargetColorType.COLOR_FONT:
                  setPreference({
                    ...preference,
                    fontColor: colorResult.hex,
                  });
                  break;

                default:
                  break;
              }
              setShowColorPicker(!showColorPicker);
            }}
          />
        </div>
      )}
      {/* <ReactFlow elements={elements} /> */}
    </div>
  );
}

export default App;
