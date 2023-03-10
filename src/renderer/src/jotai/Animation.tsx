import { atomWithStorage } from "jotai/utils";
import DownAnimation from "../assets/image/bitcat_down_sheet.png";
import UpAnimation from "../assets/image/bitcat_up_sheet.png";

export const getFPS = (percentage: number) => {
  // 0~30% 12~72fps
  if (percentage === 0) return 12;
  else if (percentage < 0) return Math.abs(Math.ceil(percentage)) * 2 + 12;
  else return Math.ceil(percentage) * 2 + 12;
};

export const getSpritesheet = (percentage: number) => {
  if (percentage <= 0) return DownAnimation;
  else return UpAnimation;
};

export type AnimationType = {
  fps: number;
  spritesheet: string;
};

const defaultAnimation: AnimationType = {
  fps: 12,
  spritesheet: DownAnimation,
};

export const AnimationAtom = atomWithStorage<AnimationType>(
  "bitcat_animation",
  defaultAnimation
);