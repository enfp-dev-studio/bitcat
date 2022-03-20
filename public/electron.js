const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  desktopCapturer,
  globalShortcut,
  screen,
} = require("electron");

const isDev = require("electron-is-dev");
const path = require("path");
const fs = require("fs");

let mainWindow;

function initialize() {
  console.log(path.join(__dirname, "preload.js"));
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      devTools: isDev,
      preload: path.join(__dirname, "preload.js"),
      contextIsolation:false //없으면 ipcRenderer가 옮겨지지 않는다
    },
  });

  // const backgroundURL = 'file://' + __dirname + '/background.html';
  // const backgroundProcessHandler = main.createBackgroundProcess(backgroundURL, true);
  // mainWindow = new BrowserWindow({width: 1280, height: 600});
  // backgroundProcessHandler.addWindow(mainWindow);
  // mainWindow.loadURL('file://' + __dirname + '/foreground.html');

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.setResizable(true);
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.focus();

  // Add ShortCut
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const registered = globalShortcut.register("PrintScreen", () => {
    console.log("global shortcut");
    desktopCapturer
      .getSources({ types: ["screen"], thumbnailSize: { width, height } })
      .then(async (sources) => {
        for (const source of sources) {
          if (source.name === "Entire Screen") {
            // console.log(source.thumbnail, source.thumbnail.getSize());

            await sendCaptureEvent({
              thumbnail: source.thumbnail,
              width,
              height,
            });
            return;
          }
        }
      });
  });
  console.log(`global short cut registered? : ${registered}`);

  // globalShortcut.register("Control+PrintScreen", () => {
  //   console.log("TODO START CAPTURE");
  //   desktopCapturer.getSources({ types: ["screen"] }).then(async (sources) => {
  //     for (const source of sources) {
  //       if (source.name === "Entire Screen") {
  //         console.log(source.id);
  //         mainWindow.webContents.send("SET_SOURCE", source.id);
  //         return;
  //       }
  //     }
  //   });
  // });
}

app.on("ready", initialize);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

let tray = null;
app.whenReady().then(() => {
  tray = new Tray("logo192.png");
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
});

const sendCaptureEvent = async ({ thumbnail, width, height }) => {
  // console.log(win);
  if (mainWindow) {
    await mainWindow.webContents.send("SET_SOURCE", {
      image: thumbnail,
      width,
      height,
    });
  }
};
