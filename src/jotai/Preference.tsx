import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ColorResult } from "react-color";
// @ts-ignore
import { rootPath } from "electron-root-path";
import dayjs from "dayjs";

export const preferenceAtom = atomWithStorage("preference", {
  fontColor: "#FFFFFF",
  backgroundColor: "rgba(0,0,0,1)",
  shortCutBlurMemo: "Alt Enter",
  shortCutEditMemo: "Double Click",
  minBoxHeight: 40,
  fontWeight: "normal",
  fontSize: 32,
  savePath: rootPath,
  memoBoxWidth: 200,
  memoPrefix: "memo_" + dayjs().format(),
});

export const setFontColorAtom = atom(
  () => "",
  (get, set, { color }: { color: string }) => {
    set(preferenceAtom, () => {
      const preference = get(preferenceAtom);
      return {
        ...preference,
        fontColor: color,
      };
    });
  }
);

export const setFontSizeAtom = atom(
  () => "",
  (get, set, { fontSize }: { fontSize: number }) => {
    set(preferenceAtom, () => {
      const preference = get(preferenceAtom);
      return {
        ...preference,
        fontSize,
      };
    });
  }
);

export const setBackgroundColorAtom = atom(
  () => "",
  (get, set, { color }: { color: string }) => {
    set(preferenceAtom, () => {
      const preference = get(preferenceAtom);
      return {
        ...preference,
        backgroundColor: color,
      };
    });
  }
);

export const setSavePathAtom = atom(
  () => "",
  (get, set, { savePath }: { savePath: string }) => {
    set(preferenceAtom, () => {
      const preference = get(preferenceAtom);
      return {
        ...preference,
        savePath,
      };
    });
  }
);

export const setMemoBoxWidthAtom = atom(
  () => "",
  (get, set, { memoBoxWidth }: { memoBoxWidth: number }) => {
    set(preferenceAtom, () => {
      const preference = get(preferenceAtom);
      return {
        ...preference,
        memoBoxWidth,
      };
    });
  }
);

export const setMemoPrefixAtom = atom(
  () => "",
  (get, set, { memoPrefix }: { memoPrefix: string }) => {
    set(preferenceAtom, () => {
      const preference = get(preferenceAtom);
      return {
        ...preference,
        memoPrefix,
      };
    });
  }
);
