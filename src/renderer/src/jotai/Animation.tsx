import { atomWithStorage } from 'jotai/utils'
import DownAnimation from '../assets/image/bitcat_down_sheet.png'
import UpAnimation from '../assets/image/bitcat_up_sheet.png'

export const getFPS = (percentage: number) => {
  // 100 - log2(percent) * 16
  // 0~30% 10~100
  let val = percentage
  if (percentage > 2 && percentage < -2) {
    val = 2
  } else if (percentage > 32) {
    val = 32
  } else if (percentage < -32) {
    val = -32
  }
  return 100 - Math.abs(Math.ceil(Math.log2(Math.abs(val)))) * 16
}

export const getSpritesheet = (percentage: number) => {
  if (percentage <= 0) return DownAnimation
  else return UpAnimation
}

export type AnimationType = {
  fps: number
  spritesheet: string
}

const defaultAnimation: AnimationType = {
  fps: 84,
  spritesheet: DownAnimation
}

export const AnimationAtom = atomWithStorage<AnimationType>('bitcat_animation', defaultAnimation)
