import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const getFPS = (percentage: number) => {
  // 0~30% 12~72fps
  if (percentage === 0) return 12;
  else if (percentage < 0) return Math.abs(Math.ceil(percentage)) * 2 + 12;
  else return Math.ceil(percentage) * 2 + 12;
};

export const getSpritesheet = (percentage: number) => {
  if (percentage <= 0) return "image/bitcat_down_sheet.png";
  else return "image/bitcat_up_sheet.png";
};

export type AnimationType = {
  fps: number;
  spritesheet: string;
};

const defaultAnimation: AnimationType = {
  fps: 12,
  spritesheet: "image/bitcat_up_sheet.png",
};

export const AnimationAtom = atomWithStorage<AnimationType>(
  "bitcat_animation",
  defaultAnimation
);

const setAnimation = (animation: AnimationType, percentage: number) => {
  return {
    spritesheet: getSpritesheet(percentage),
    fps: getFPS(percentage),
  };
};

export const setAnimationAtom = atom(
  () => "",
  (get, set, { percentage }: { percentage: number }) => {
    set(AnimationAtom, setAnimation(get(AnimationAtom), percentage));
  }
);
