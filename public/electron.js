const {
  app,
  BrowserWindow,
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
let settingWindow;

const windowWidth = 649;
const windowHeight = 381;

const createSettingWindow = () => {
  settingWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    title: "Setting",
    // center: true,
    hasShadow: false, // MAC 창 그림자 옵션을 끄위서
    // show: false,
    // frame: false,
    alwaysOnTop: true, // 무조건 최상단에 유지 되기 때문에 사용하기 어렵다
    // autoHideMenuBar: true, // 파일 메뉴를 숨긴다
    // center: true,
    // fullscreenable:false,
    resizable: false, // 마우스로 사이즈 조절 하는 거 방지
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true, // 노드 기본 API들 사용 위해서
      enableRemoteModule: true, // 리모트 모듈 사용 위해서
      devTools: isDev,
      preload: path.join(__dirname, "preload.js"), // Preload.js 에서 필요한 모듈들을 미리 로드해서 사용한다 (리모트 모듈 사용 위해서)
      contextIsolation: false, //없으면 ipcRenderer가 옮겨지지 않는다
    },
    icon: path.join(__dirname, "../src/assets/icons/logo192.png"),
  });
  settingWindow.hide(); //일단 hide하고 시작해서 옵션 버튼을 누른 경우 보이게
};

// const sendWindowInfo = () => {
//   if (mainWindow) {
//     const x = mainWindow.getPosition()[0];
//     const y = mainWindow.getPosition()[1];
//     // console.log(mainWindow.getPosition());
//     let maxX = screen.getPrimaryDisplay().size.width;
//     let maxY = screen.getPrimaryDisplay().size.height;
//     screen.getAllDisplays().forEach((display) => {
//       if (display.bounds.x !== 0 || display.bounds.y !== 0) {
//         maxX += display.bounds.width;
//         maxY += display.bounds.height;
//       }
//       // console.log(display.bounds.x, display.bounds.y);
//     });

//     if (maxX > windowWidth) {
//       maxX -= windowWidth;
//     }

//     if (maxY > windowHeight) {
//       maxY -= windowHeight;
//     }
//     mainWindow.webContents.send("GET_POSITION_RETURN", { maxX, maxY, x, y });
//   }
// };

function initialize() {
  // console.log(path.join(__dirname, "preload.js"));
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    transparent: true, // 배경이 투명하게 만들려면 이렇게 해야 한다
    frame: false, // 상단프레임이 있으면 구리다
    hasShadow: false, // MAC 창 그림자 옵션을 끄위서
    // show: false,
    alwaysOnTop: true, // 무조건 최상단에 유지 되기 때문에 사용하기 어렵다
    autoHideMenuBar: true, // 파일 메뉴를 숨긴다
    // center: true,
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

  createSettingWindow();

  // settingWindow.on("close", function (evt) {
  //   console.log("call close");
  //   evt.preventDefault();
  //   mainWindow.moveTop();
  //   mainWindow.focus();
  //   settingWindow.hide();
  // });

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

  //  하나의 front project에서 두 윈도우를 처리하기 위해  react-router를 사용
  settingWindow.loadURL(
    isDev
      ? "http://localhost:3000/#/setting"
      : `file://${path.join(__dirname, "../build/index.html#/setting")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
    settingWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.setResizable(false);
  mainWindow.focus();
  mainWindow.on("closed", () => {
    mainWindow = null;
    // 세팅윈도우는 숨기기만 하기 때문에 끄면 같이 해제 되도록 처리
    settingWindow.close();
    settingWindow = null;
  });

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
            mainWindow.focus();
            mainWindow.moveTop();
            return;
          }
        }
      });
  });
  console.log(`global short cut registered? : ${registered}`);

  ipcMain.on("SAVE_IMAGE_FILE", async (event, { dataURL, savePath }) => {
    const result = await dialog.showOpenDialogSync({
      // filters: [
      //   { name: "Images", extensions: ["jpg", "png", "gif"] },
      //   { name: "Movies", extensions: ["mkv", "avi", "mp4"] },
      //   { name: "Custom File Type", extensions: ["as"] },
      //   { name: "All Files", extensions: ["*"] },
      // ],
      properties: ["openDirectory"], // 디렉토리를 선택하게 하기 위한 옵션
    });

    await mainWindow.webContents.send("SET_SAVE_PATH", {
      path: result,
    });
  });

  ipcMain.on("SET_POSITION", async (event, { x, y }) => {
    mainWindow.setPosition(x, y);
    // sendWindowInfo();
  });

  ipcMain.on("SET_SCALE", async (event, { scale }) => {
    // console.log(scale);
    mainWindow.setSize(windowWidth * scale, windowHeight * scale, true);
    // sendWindowInfo();
  });

  ipcMain.once("APPLY_PREFERENCE", (event, preference) => {
    // jotai에 저장한 preference로 부터 초기에 한번 불러와서 적용한다
    mainWindow.setPosition(preference.positionX, preference.positionY, true);
    mainWindow.setSize(
      parseInt(windowWidth * preference.scale),
      parseInt(windowHeight * preference.scale),
      true
    );
    // sendWindowInfo();
  });

  ipcMain.on("RESTART_WINDOW", () => {
    app.relaunch(); // 재시작이 필요한 경우, relaunch를 호출하고 종료한다
    app.exit();
  });

  ipcMain.on("GET_DISPLAYS", async () => {
    if (settingWindow) {
      await settingWindow.webContents.send("GET_DISPLAYS_RESPONSE", {
        displays: screen.getAllDisplays(),
      });
    }
  });

  ipcMain.on("SHOW_SETTING_DIALOG", async () => {
    console.log("show setting dialog");
    if (!settingWindow) {
      createSettingWindow();
    }
    settingWindow.show();
    settingWindow.focus();
  });

  ipcMain.on("HIDE_SETTING_DIALOG", async () => {
    if (!settingWindow) {
      createSettingWindow();
    }
    settingWindow.hide();
    mainWindow.focus();
  });
}

app.on("ready", initialize);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
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
