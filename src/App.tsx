import { IpcRenderer, NativeImage } from "electron";
import React, { useCallback, useEffect, useState } from "react";
// import Draggable from "react-draggable";
// import logo from "./logo.svg";
import "./App.css";
import { Memo } from "./Memo";
// import ReactFlow, { Node } from "react-flow-renderer";
import { useAtom } from "jotai";
import { TopMenu } from "./TopMenu";
import { preferenceAtom } from "./jotai/Preference";
import { MemoType, Position } from "./type/Type";
import { createNewMemoId } from "./util/Util";
import { memosAtom } from "./jotai/Data";
import { splitAtom } from "jotai/utils";
import Button from "@mui/material/Button";
import {
  BackgroundColorPicker,
  FontColorPicker,
} from "./components/ColorPicker";
import { Row } from "./components/HTMLComponents";

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
  const [preference] = useAtom(preferenceAtom);
  const [targetColorType, setTargetColorType] = useState(
    TargetColorType.COLOR_NONE
  );
  const [memoAtoms, removeMemoDataAtom] = useAtom(memoAtomsAtom);
  const [, setMemoDatas] = useAtom(memosAtom);
  const [showMenu, setShowMenu] = useState(true);

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
      // console.log(e?.clientX);
      createMemo({ x: e?.clientX, y: e?.clientY });
    }
  };
  return (
    <div
      onClick={handleClick}
      // className="App"
      style={{
        display: "flex",
        height: "100%",
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
      <div
        style={{
          position: "absolute",
          // width: showMenu ? 200 : 60,
          height: "100%",
          backgroundColor: "white",
          // transition: "all 1s ease",
          // place it initially at -100%
          // transform: showMenu ? "none" : "translate(140)",
        }}
      >
        <div style={{ minWidth: showMenu ? 200 : 60 }}>
          {showMenu ? (
            <div>
              <Row>
                Font Color
                <FontColorPicker></FontColorPicker>
                {/* <Button
                style={{ color: preference.fontColor }}
                onClick={() => {
                  setTargetColorType(TargetColorType.COLOR_FONT);
                  setShowColorPicker(!showColorPicker);
                }}
              ></Button> */}
              </Row>
              <Row>
                Background Color
                <BackgroundColorPicker></BackgroundColorPicker>
                {/* <Button
                style={{ color: preference.backgroundColor }}
                onClick={() => {
                  setTargetColorType(TargetColorType.COLOR_BACKGROUND);
                  setShowColorPicker(!showColorPicker);
                }}
              ></Button> */}
              </Row>
              <Button
                variant="contained"
                onClick={() => {
                  setShowMenu(!showMenu);
                }}
              >
                Hide
              </Button>
            </div>
          ) : (
            <div>
              <Button
                onClick={() => {
                  setShowMenu(true);
                }}
              >
                Show
              </Button>
            </div>
          )}
        </div>
        {/* {showColorPicker && (
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.5)",
              position: "absolute",
              padding: 10,
            }}
          >
            <ChromePicker
              onChangeComplete={(
                colorResult: ColorResult,
                event: React.ChangeEvent<HTMLInputElement>
              ) => {
                // pickColor(color);
                
                setShowColorPicker(!showColorPicker);
              }}
            />
          </div>
        )} */}
      </div>
      {/* <ReactFlow elements={elements} /> */}
    </div>
  );
}

export default App;
