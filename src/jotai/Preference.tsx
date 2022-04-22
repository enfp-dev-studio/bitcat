import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { sendToMain } from "../util/Util";

export type PreferenceType = {
  positionX: number;
  positionY: number;
  scale: number;
  displayIndex: number;
};

export const autoLaunchAtom = atom(true);

export const defaultPreference: PreferenceType = {
  positionX: 0,
  positionY: 0,
  scale: 1,
  displayIndex: 0,
};

export const Preference = atomWithStorage<PreferenceType>(
  "bitcat_preference",
  defaultPreference
);

const savePosition = (preference: PreferenceType, x: number, y: number) => {
  // sendToMain("SET_POSITION", { x, y });
  return {
    ...preference,
    positionX: x,
    positionY: y,
  };
};

export const savePositionAtom = atom(
  () => "",
  (get, set, { x, y }: { x: number; y: number }) => {
    set(Preference, savePosition(get(Preference), x, y));
  }
);

const setScale = (preference: PreferenceType, scale: number) => {
  sendToMain("SET_SCALE", { scale });
  return {
    ...preference,
    scale,
  };
};

export const setScaleAtom = atom(
  () => "",
  (get, set, { scale }: { scale: number }) => {
    set(Preference, setScale(get(Preference), scale));
  }
);

const setDisplayIndex = (preference: PreferenceType, index: number) => {
  return {
    ...preference,
    displayIndex: index,
  };
};

export const setDisplayIndexAtom = atom(
  () => "",
  (get, set, { index }: { index: number }) => {
    set(Preference, setDisplayIndex(get(Preference), index));
  }
);

export const resetPreference = () => {
  sendToMain("APPLY_PREFERENCE", defaultPreference);
  return defaultPreference;
};

export const resetPreferenceAtom = atom(
  () => "",
  (get, set) => {
    set(Preference, resetPreference());
  }
);

// export const setAutoLaunch = (
//   preference: PreferenceType,
//   autoLaunch: boolean
// ) => {
//   return {
//     ...preference,
//     autoLaunch,
//   };
// };

// export const setAutoLaunchAtom = atom(
//   () => "",
//   (get, set, { autoLaunch }: { autoLaunch: boolean }) => {
//     set(Preference, setAutoLaunch(get(Preference), autoLaunch));
//   }
// );
