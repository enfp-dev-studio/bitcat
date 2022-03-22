import { PrimitiveAtom, useAtom } from "jotai";
import { Rnd } from "react-rnd";
import TextareaAutosize from "react-textarea-autosize";
import { memo, useEffect, useRef, useState } from "react";
import { addListener } from "process";
import { preferenceAtom } from "./jotai/Preference";
import { MemoType } from "./type/Type";
import { addMemoAtom, memosAtom, updateMemoAtom } from "./jotai/Data";
import { DraggableEvent, DraggableEventHandler } from "react-draggable";
import { hexToRgb } from "@mui/material";
// import ReactRough, { Circle, Rectangle } from "react-rough";

// https://freefrontend.com/css-border-examples/
// https://codepen.io/SelenIT/pen/pqNZQv
// https://codepen.io/jadlimcaco/pen/ExjGrqJ
// https://codepen.io/silvia-odwyer/pen/RwKMOpb
const optionStyle: object = {
  //NEON
  animation: "pulsate 1.5s infinite alternate",
  border: "0.2rem solid #fff",
  borderRadius: "2rem",
  padding: "0.4em",
  boxShadow:
    "0 0 .2rem #fff, 0 0 .2rem #fff, 0 0 2rem #bc13fe, 0 0 0.8rem #bc13fe, 0 0 2.8rem #bc13fe, inset 0 0 1.3rem #bc13fe",
};

// const optionStyle3: object = {
//   boxShadow: "3px 15px 8px -10px rgba(0, 0, 0, 0.3)",
// };

export const Memo = (props: {
  memoAtom: PrimitiveAtom<MemoType>;
  removeMemoDataAtom: (atom: PrimitiveAtom<MemoType>) => void;
}) => {
  const [preference] = useAtom(preferenceAtom);
  const [isFocused, setIsFocused] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const textareaRef = useRef(null);
  const [, updateMemo] = useAtom(updateMemoAtom);
  const [memo] = useAtom(props.memoAtom);
  console.log(hexToRgb(preference.backgroundColor));
  const _handleCloseMemo = () => {
    // let newMemoDats = memos;
    // const removeIndex = memos.findIndex((e) => {
    //   return e.id === props.memo.id;
    // });
    // newMemoDats.splice(removeIndex, 1);
    // console.log(newMemoDats);
    props.removeMemoDataAtom(props.memoAtom);
  };

  const _handleKeyDown = (e: KeyboardEvent) => {
    if (isFocused && e.key === "Enter" && e.altKey) {
      setIsFocused(false);
    }
  };
  useEffect(() => {
    document.addEventListener("keyup", _handleKeyDown);
    return () => {
      document.removeEventListener("keyup", _handleKeyDown);
    };
  }, []);
  useEffect(() => {
    if (isFocused) {
      //@ts-ignore
      textareaRef?.current?.focus();
    } else {
      //@ts-ignore
      textareaRef?.current?.blur();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isSelected) {
    } else {
    }
  }, [isSelected]);
  // console.log(memo.id, memo.position);

  // const color = useStore((state) => state.color);
  return (
    <Rnd
      disableDragging={isFocused}
      default={{
        x: memo?.position.x,
        y: memo?.position.y,
        width: 1,
        height: preference.minBoxHeight,
      }}
      onDragStop={(e: any, d: any) => {
        e?.preventDefault();
        updateMemo({
          id: memo?.id,
          position: {
            x: d.x,
            y: d.y,
          },
          text: memo.text,
        });

        // setMemoData((prev) => (prev.position = d));
      }}
      position={memo?.position}
      style={{
        display: "flex",
        flexDirection: "row",
        minWidth: preference.minBoxWidth,
      }}
    >
      <TextareaAutosize
        onChange={(e: any) => {
          updateMemo({
            id: memo?.id,
            position: memo?.position,
            text: e.target.value,
          });
        }}
        ref={textareaRef}
        onDoubleClick={() => {
          //@ts-ignore
          setIsFocused(true);
        }}
        onClick={() => {
          if (!isFocused) setIsSelected(true);
        }}
        onFocus={() => {
          //@ts-ignore
          if (!isFocused) textareaRef?.current?.blur();
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        // autoFocus={false}
        style={{
          // border: "none",
          // backgroundColor: "transparent",
          resize: "none",
          // outline: "none",
          backgroundColor: preference.backgroundColor,
          padding: 10,
          color: preference.fontColor,
          cursor: isFocused ? "text" : "move",
          fontFamily: "NanumD",
          fontSize: 20,
          minWidth: preference.minBoxWidth,
          fontWeight: preference.fontWeight,
          // ...optionStyle,
        }}
        spellCheck={false}
      />
      {isSelected && (
        <button
          style={{
            zIndex: 10000,
            position: "absolute",
            right: 0,
            top: 0,
          }}
          onClick={_handleCloseMemo}
        >
          Delete
        </button>
      )}
    </Rnd>
  );
};
