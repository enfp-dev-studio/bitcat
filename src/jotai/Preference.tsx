import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ColorResult } from "react-color";

export const preferenceAtom = atomWithStorage("preference", {
  fontColor: "#FFFFFF",
  backgroundColor: "rgba(0,0,0,1)",
  shortCutBlurMemo: "Alt Enter",
  shortCutEditMemo: "Double Click",
  minBoxWidth: 200,
  minBoxHeight: 40,
  fontWeight: "normal",
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