import { atomWithStorage } from 'jotai/utils'

export const Scale = {
  small: 0.5,
  medium: 0.75,
  large: 1
}

export const scaleAtom = atomWithStorage<number>('bitcat_scale', Scale.medium)
