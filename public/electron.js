const {
  app,
  BrowserWindow,
  desktopCapturer,
  globalShortcut,
  screen,
  dialog,
  ipcMain,
  shell,
  Tray,
  Menu,
  nativeImage,
} = require("electron");

const isDev = require("electron-is-dev");
const path = require("path");
const fs = require("fs");
const electronReload = require("electron-reload");

let mainWindow;
let settingWindow;
let tray = null;

const windowWidth = 649;
const windowHeight = 381;

const getTraySourceImage = () => {
  //   'aix'
  // 'darwin'
  // 'freebsd'
  // 'linux'
  // 'openbsd'
  // 'sunos'
  // 'win32'

  let trayImage = null;
  switch (process.platform) {
    case "darwin":
      trayImage = nativeImage.createFromPath(
        path.join(__dirname, "logo192.png")
      );
      trayImage.setTemplateImage(true);
      trayImage = trayImage.resize({ width: 16, height: 16 });
      break;
    default:
      trayImage = nativeImage.createFromPath(
        path.join(__dirname, "favicon.ico")
      );
      break;
  }
  return trayImage;
};

const createSettingWindow = () => {
  settingWindow = new BrowserWindow({
    parent: mainWindow,
    width: 480,
    height: 720,
    transparent: true,
    modal: true,
    title: "",
    // center: true,
    hasShadow: false, // MAC 창 그림자 옵션을 끄위서
    // show: false,
    frame: false,
    // alwaysOnTop: true, // 무조건 최상단에 유지 되기 때문에 사용하기 어렵다
    // autoHideMenuBar: true, // 파일 메뉴를 숨긴다
    center: true,
    // fullscreenable:false,
    resizable: false, // 마우스로 사이즈 조절 하는 거 방지
    fullscreen: false,
    useContentSize: true,
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
    // transparent: isDev ? false : true, // 배경이 투명하게 만들려면 이렇게 해야 한다
    transparent: true,
    frame: false, // 상단프레임이 있으면 구리다
    hasShadow: false, // MAC 창 그림자 옵션을 끄위서
    // show: false,
    resizable: false,
    alwaysOnTop: true, // 무조건 최상단에 유지 되기 때문에 사용하기 어렵다
    autoHideMenuBar: true, // 파일 메뉴를 숨긴다
    // center: true,
    // fullscreenable:false,
    fullscreen: false,
    useContentSize: true,
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
      ? "http://localhost:3000?app"
      : `file://${path.join(__dirname, "../build/index.html?app")}`
  );

  //  하나의 front project에서 두 윈도우를 처리하기 위해  react-router를 사용
  //  index.html파일은 하나인데 url을 개별 윈도우에서 로드하기 위한 방법
  // 1. view manager를 만들어서 처리한다
  // 2.
  settingWindow.loadURL(
    isDev
      ? "http://localhost:3000?setting"
      : `file://${path.join(__dirname, "../build/index.html?setting")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
    settingWindow.webContents.openDevTools({ mode: "detach" });
  }

  // mainWindow.setResizable(false);
  mainWindow.focus();
  mainWindow.on("closed", () => {
    mainWindow = null;
    // 세팅윈도우는 숨기기만 하기 때문에 끄면 같이 해제 되도록 처리
    // settingWindow.close();
    settingWindow = null;
  });

  mainWindow.on("moved", async (e, d) => {
    await mainWindow.webContents.send("MOVE_WINDOW", {
      x: e.sender.getBounds().x,
      y: e.sender.getBounds().y,
    });
  });

  // const registered = globalShortcut.register("PrintScreen", () => {
  //   desktopCapturer
  //     .getSources({ types: ["screen"], thumbnailSize: { width, height } })
  //     .then(async (sources) => {
  //       for (const source of sources) {
  //         if (source.name === "Entire Screen") {
  //           await sendCaptureEvent({
  //             thumbnail: source.thumbnail,
  //             width,
  //             height,
  //           });
  //           mainWindow.setSize(width, height, true);
  //           mainWindow.focus();
  //           mainWindow.moveTop();
  //           return;
  //         }
  //       }
  //     });
  // });
  // console.log(`global short cut registered? : ${registered}`);

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
    console.log(x, y);
    mainWindow.setPosition(x, y);
    // sendWindowInfo();
  });

  ipcMain.on("MOVE_POSITION", async (event, { x, y }) => {
    const position = mainWindow.getPosition();
    mainWindow.setPosition(position.x + x, position.y + y);
    // sendWindowInfo();
  });

  ipcMain.on("SET_SCALE", async (event, { scale }) => {
    console.log(scale);
    mainWindow.setResizable(true);
    await mainWindow.setSize(
      Math.ceil(windowWidth * scale),
      Math.ceil(windowHeight * scale),
      true
    );
    mainWindow.setResizable(false);
    mainWindow.webContents.reloadIgnoringCache();
    // sendWindowInfo();
  });

  ipcMain.on("APPLY_PREFERENCE", async (event, preference) => {
    console.log(preference);
    // jotai에 저장한 preference로 부터 초기에 한번 불러와서 적용한다
    console.log(
      "set size",
      Math.ceil(windowWidth * preference.scale),
      Math.ceil(windowHeight * preference.scale)
    );
    await mainWindow.setSize(
      Math.ceil(windowWidth * preference.scale),
      Math.ceil(windowHeight * preference.scale),
      true
    );
    await mainWindow.setPosition(
      Math.ceil(preference.positionX),
      Math.ceil(preference.positionY)
    );
    // mainWindow.webContents.reloadIgnoringCache();

    // sendWindowInfo();
  });

  // ipcMain.on("RESTART_WINDOW", (preference) => {
  //   mainWindow.setSize(
  //     Math.ceil(windowWidth * preference.scale),
  //     Math.ceil(windowHeight * preference.scale)
  //     // true
  //   );
  //   mainWindow.webContents.reloadIgnoringCache();

  //   // electronReload
  //   // app.relaunch(); // 재시작이 필요한 경우, relaunch를 호출하고 종료한다
  //   // app.exit();
  // });

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

  ipcMain.on("OPEN_DOCUMENT_SITE", async (event, arg) => {
    // console.log("open doc");
    shell.openExternal(
      "https://puffy-sauce-5a7.notion.site/Bitcat-76740b78aa3e4fe69312f14983d60924"
    );
  });

  ipcMain.on("SET_SETTING_DIALOG_WINDOW_SIZE", (event, { width, height }) => {
    console.log(width, height);
    settingWindow.setResizable(true);
    settingWindow.setSize(Math.ceil(width), Math.ceil(height), false);
    settingWindow.setResizable(false);
  });

  tray = new Tray(getTraySourceImage());
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "설정",
      type: "normal",
      click: () => {
        settingWindow.show();
      },
    },
    {
      label: "초기화",
      type: "normal",
      click: () => {
        sendResetEvent();
      },
    },
    {
      label: "도움말",
      type: "normal",
      click: () => {
        shell.openExternal(
          "https://puffy-sauce-5a7.notion.site/Bitcat-76740b78aa3e4fe69312f14983d60924"
        );
      },
    },
    {
      label: "",
      type: "separator",
    },
    {
      label: "종료",
      type: "normal",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    tray.popUpContextMenu();
  });
}

// app.on("ready", initialize);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on("ready", initialize);
}

// 트레이 여러 개 보이는 이슈 해결 시도
app.on("before-quit", function () {
  tray.destroy();
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

const sendResetEvent = async () => {
  // console.log(win);
  if (mainWindow) {
    await mainWindow.webContents.send("RESET_PREFERENCE", {});
  }
};
