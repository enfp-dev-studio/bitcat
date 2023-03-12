import { atomWithStorage } from "jotai/utils";
import DownAnimation from "../assets/image/bitcat_down_sheet.png";
import UpAnimation from "../assets/image/bitcat_up_sheet.png";

export const getFPS = (percentage: number) => {
  // 0~30% 10~100
  let val = percentage
  if (percentage < -30) {
    val = -30
  } else if(percentage > 30) {
    val = 30
  }
  if (val === 0) return 100;
  else if (val < 0) return 100 - Math.abs(Math.ceil(percentage)) * 3;
  else return 100 - Math.ceil(val) * 3;
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
  fps: 100,
  spritesheet: DownAnimation,
};

export const AnimationAtom = atomWithStorage<AnimationType>(
  "bitcat_animation",
  defaultAnimation
);