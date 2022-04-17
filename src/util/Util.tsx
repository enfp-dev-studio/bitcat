// import dayjs from "dayjs";
// import { useAtom } from "jotai";
// import { memoAtom } from "../jotai/Preference";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { IpcRenderer } from "electron";

export const createNewMemoId = () => {
  return uuidv4();
};

export const createDirectoryItem = (
  name: string,
  fullpath: string,
  children: [] = []
) => {
  return {
    name: name,
    fullpath: fullpath,
    children: children,
  };
};
export const getChildDirectories = (folderPath: string) => {
  let names: string[] = fs.readdirSync(folderPath);
  let children: any[] = [];
  names.map((name) => {
    let fullpath = path.join(folderPath, name);
    let stat = fs.statSync(fullpath);
    if (stat.isDirectory()) {
      children.push(createDirectoryItem(name, fullpath));
    }
  });
  return children;
};

export const formatNumber = (num: number) => {
  if (typeof num !== "number") return 0;
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const sendToMain = (message: string, arg: any) => {
  //@ts-ignore
  const ipcRenderer: IpcRenderer = window.ipcRenderer;
  if (ipcRenderer) {
    ipcRenderer.send(message, arg);
  }
};