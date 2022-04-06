const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  desktopCapturer,
  globalShortcut,
  screen,
  dialog,
  ipcMain,
} = require("electron");

const isDev = require("electron-is-dev");
const path = require("path");
const fs = require("fs");

let mainWindow;

function initialize() {
  // console.log(path.join(__dirname, "preload.js"));
  mainWindow = new BrowserWindow({
    width: 320,
    height: 480,
    transparent: true,
    // frame: false,
    // show: false,
    // alwaysOnTop: true, // 무조건 최상단에 유지 되기 때문에 사용하기 어렵다
    autoHideMenuBar: true, // 파일 메뉴를 숨긴다
    center: true,
    // fullscreenable:false,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      devTools: isDev,
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false, //없으면 ipcRenderer가 옮겨지지 않는다
    },
    icon: path.join(__dirname, "../src/assets/icons/logo192.png"),
  });
  // console.log(path.join(__dirname, "../src/assets/icons/logo192.png"));

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

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const registered = globalShortcut.register("PrintScreen", () => {
    desktopCapturer
      .getSources({ types: ["screen"], thumbnailSize: { width, height } })
      .then(async (sources) => {
        for (const source of sources) {
          if (source.name === "Entire Screen") {
            await sendCaptureEvent({
              thumbnail: source.thumbnail,
              width,
              height,
            });
            mainWindow.setSize(width, height, true);
            mainWindow.setPosition(0, 0);
            mainWindow.focus();
            mainWindow.moveTop();
            return;
          }
        }
      });
  });
  // console.log(`global short cut registered? : ${registered}`);

  ipcMain.on("SAVE_IMAGE_FILE", async (event, { dataURL, savePath }) => {
    const result = await dialog.showOpenDialogSync({
      // filters: [
      //   { name: "Images", extensions: ["jpg", "png", "gif"] },
      //   { name: "Movies", extensions: ["mkv", "avi", "mp4"] },
      //   { name: "Custom File Type", extensions: ["as"] },
      //   { name: "All Files", extensions: ["*"] },
      // ],
      properties: ["openDirectory"],
    });

    await mainWindow.webContents.send("SET_SAVE_PATH", {
      path: result,
    });
  });

  ipcMain.on("RESIZE_WINDOW", (event, arg) => {
    win.setSize(arg.width, arg.height);
  });

  // mainWindow.maximize();
  // mainWindow.show();
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

// let tray = null;
// app.whenReady().then(() => {
//   tray = new Tray("logo192.png");
//   const contextMenu = Menu.buildFromTemplate([
//     { label: "Item1", type: "radio" },
//     { label: "Item2", type: "radio" },
//     { label: "Item3", type: "radio", checked: true },
//     { label: "Item4", type: "radio" },
//   ]);
//   tray.setToolTip("This is my application.");
//   tray.setContextMenu(contextMenu);
// });

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
