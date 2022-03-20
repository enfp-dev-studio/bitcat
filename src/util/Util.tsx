// import dayjs from "dayjs";
// import { useAtom } from "jotai";
// import { memoAtom } from "../jotai/Preference";
import { v4 as uuidv4 } from "uuid";

export const createNewMemoId = () => {
  return uuidv4();
};
