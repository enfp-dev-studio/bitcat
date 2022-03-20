import { atomWithStorage } from "jotai/utils";

export const preferenceAtom = atomWithStorage("preference", {
  fontColor: "#FFFFFF",
  backgroundColor: "rgba(0,0,0,0)",
  shortCutBlurMemo: "Alt Enter",
  shortCutEditMemo: "Double Click",
  minBoxWidth: 200,
  minBoxHeight: 40,
  fontWeight: 'normal',
});
