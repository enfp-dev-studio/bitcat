import { PrimitiveAtom, useAtom } from "jotai";
import { Rnd } from "react-rnd";
import TextareaAutosize from "react-textarea-autosize";
import { memo, useEffect, useRef, useState } from "react";
import { preferenceAtom } from "./jotai/Preference";
import { MemoType } from "./type/Type";
import { addMemoAtom, memosAtom, updateMemoAtom } from "./jotai/Data";
import { Button, ClickAwayListener, hexToRgb } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
// import ReactRough, { Circle, Rectangle } from "react-rough";

// https://freefrontend.com/css-border-examples/
// https://codepen.io/SelenIT/pen/pqNZQv
// https://codepen.io/jadlimcaco/pen/ExjGrqJ
// https://codepen.io/silvia-odwyer/pen/RwKMOpb
const optionStyle: object = {
  //NEON
  animation: "pulsate 1.5s infinite alternate",
  border: "0.2rem solid grey",
  borderRadius: "4rem",
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
  console.log(preference.memoBoxWidth);

  // console.log(hexToRgb(preference.backgroundColor));
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

  const handleClickAway = () => {
    // console.log("handle");
    if (isSelected) setIsSelected(false);
  };
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Rnd
        disableDragging={isFocused}
        default={{
          x: memo?.position.x,
          y: memo?.position.y,
          width: 1,
          height: 1,
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
          width: preference.memoBoxWidth,
          minHeight: preference.minBoxHeight,
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
            cursor: isSelected ? "pointer" : isFocused ? "text" : "move",
            fontFamily: "NanumD",
            fontSize: preference.fontSize,
            minWidth: preference.memoBoxWidth,
            fontWeight: preference.fontWeight,
            border: "solid 0.2px grey",
            borderRadius: 4,
            // ...optionStyle,
          }}
          spellCheck={false}
        />
        {isSelected && (
          <Button
            onClick={_handleCloseMemo}
            // variant="contained"
            startIcon={<DeleteIcon />}
          ></Button>
        )}
      </Rnd>
    </ClickAwayListener>
  );
};
