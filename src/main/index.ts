import {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  shell,
  Tray,
  Menu,
  nativeImage,
  NativeImage
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
//@ts-ignore
import TrayIcon from '../../resources/trayTemplate.png?asset'
//@ts-ignore
import TrayFavicon from '../../resources/favicon.ico?asset'
const Store = require('electron-store')

const store = new Store()

let mainWindow: BrowserWindow | null = null
let settingWindow: BrowserWindow | null = null
let tray: Tray | null = null
let lastScale = 1.0

const windowWidth = 650
const windowHeight = 380

const Scale = {
  small: 0.5,
  medium: 0.75,
  large: 1
}

export const pathCreator = (route: string) => {
  if (is.dev) {
    const port = 5173
    const url = new URL(`http://localhost:${port}`)
    return url.href + '?' + route
  } else {
    return `file://${join(__dirname, '../renderer/index.html')}` + '?' + route
  }
}

const getTraySourceImage = () => {
  //   'aix'
  // 'darwin'
  // 'freebsd'
  // 'linux'
  // 'openbsd'
  // 'sunos'
  // 'win32'

  let trayImage: NativeImage | null = null
  switch (process.platform) {
    case 'darwin':
      trayImage = nativeImage.createFromPath(TrayIcon)
      trayImage.setTemplateImage(true)
      trayImage = trayImage.resize({ width: 16, height: 16 })
      break
    default:
      trayImage = nativeImage.createFromPath(TrayFavicon)
      break
  }
  return trayImage
}

const createSettingWindow = () => {
  settingWindow = new BrowserWindow({
    width: 480,
    height: 320,
    transparent: true,
    modal: false,
    title: '',
    // center: true,
    hasShadow: false, // MAC 창 그림자 옵션을 끄위서
    // show: false,
    frame: false,
    show: false,
    alwaysOnTop: true, // 무조건 최상단에 유지 되기 때문에 사용하기 어렵다
    // autoHideMenuBar: true, // 파일 메뉴를 숨긴다
    center: true,
    // fullscreenable:false,
    resizable: false, // 마우스로 사이즈 조절 하는 거 방지
    fullscreen: false,
    // useContentSize: true,
    webPreferences: {
      devTools: is.dev,
      preload: join(__dirname, '../preload/index.js'), // Preload.js 에서 필요한 모듈들을 미리 로드해서 사용한다 (리모트 모듈 사용 위해서)
      sandbox: false
    }
  })
}

// function createWindow(): void {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     width: 900,
//     height: 670,
//     show: false,
//     autoHideMenuBar: true,
//     ...(process.platform === 'linux' ? { icon } : {}),
//     webPreferences: {
//       preload: join(__dirname, '../preload/index.js'),
//       sandbox: false
//     }
//   })

//   mainWindow?.on('ready-to-show', () => {
//     mainWindow?.show()
//   })

//   mainWindow?.webContents.setWindowOpenHandler((details) => {
//     shell.openExternal(details.url)
//     return { action: 'deny' }
//   })

//   // HMR for renderer base on electron-vite cli.
//   // Load the remote URL for development or the local html file for production.
//   if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
//     mainWindow?.loadURL(process.env['ELECTRON_RENDERER_URL'])
//   } else {
//     mainWindow?.loadFile(join(__dirname, '../renderer/index.html'))
//   }
// }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.enfpdev.bitcat')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // createWindow()
  initialize()

  // app.on('activate', function () {
  //   // On macOS it's common to re-create a window in the app when the
  //   // dock icon is clicked and there are no other windows open.
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow()
  // })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// const sendWindowInfo = () => {
//   if (mainWindow) {
//     const x = mainWindow?.getPosition()[0];
//     const y = mainWindow?.getPosition()[1];
//     // console.log(mainWindow?.getPosition());
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
//     mainWindow?.webContents.send("GET_POSITION_RETURN", { maxX, maxY, x, y });
//   }
// };

function initialize() {
  const position = store.get('position')
  let scale = store.get('scale')
  if (scale === undefined) {
    scale = Scale.medium
  }
  
  // 사이즈가 정수가 아니면 이상한 크기가 된다 주의!
  mainWindow = new BrowserWindow({
    width: scale ? Math.ceil(windowWidth * scale) : windowWidth,
    height: scale ? Math.ceil(windowHeight * scale) : windowHeight,
    x: position ? position.x : undefined,
    y: position ? position.y : undefined,
    // transparent: is.dev ? false : true, // 배경이 투명하게 만들려면 이렇게 해야 한다
    transparent: true,
    frame: false, // 상단프레임이 있으면 구리다
    hasShadow: false, // MAC 창 그림자 옵션을 끄위서
    // show: false,
    resizable: false,
    alwaysOnTop: true, // 무조건 최상단에 유지 되기 때문에 사용하기 어렵다
    autoHideMenuBar: true, // 파일 메뉴를 숨긴다
    center: position ? false : true,
    // fullscreenable:false,
    fullscreen: false,
    // useContentSize: true,
    webPreferences: {
      devTools: is.dev,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    icon: join(__dirname, 'favicon.ico')
  })
  if (scale && lastScale !== scale) {
    lastScale = scale
  }

  createSettingWindow()

  // settingWindow?.on("close", function (evt) {
  //   console.log("call close");
  //   evt.preventDefault();
  //   mainWindow?.moveTop();
  //   mainWindow?.focus();
  //   settingWindow?.hide();
  // });

  // console.log(join(__dirname, "../src/assets/icons/favicon.ico"));
  // const backgroundURL = 'file://' + __dirname + '/background.html';
  // const backgroundProcessHandler = main.createBackgroundProcess(backgroundURL, true);
  // mainWindow = new BrowserWindow({width: 1280, height: 600});
  // backgroundProcessHandler.addWindow(mainWindow);
  // mainWindow?.loadURL('file://' + __dirname + '/foreground.html');

  mainWindow?.on('ready-to-show', () => {
    mainWindow?.setAlwaysOnTop(true, 'screen-saver')
    mainWindow?.show()
    mainWindow?.webContents.send("PARAMS_FROM_ELECTRON", {scale})
  })

  mainWindow?.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  // if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
  //   mainWindow?.loadURL(process.env['ELECTRON_RENDERER_URL'])
  // } else {
  //   mainWindow?.loadFile(join(__dirname, '../renderer/index.html'))
  // }

  mainWindow?.loadURL(pathCreator('app'))
  settingWindow?.loadURL(pathCreator('setting'))

  if (is.dev) {
    mainWindow?.webContents.openDevTools({ mode: 'detach' })
    settingWindow?.webContents.openDevTools({ mode: 'detach' })
  }

  // mainWindow?.setResizable(false);
  mainWindow?.on('closed', () => {
    mainWindow = null
    // 세팅윈도우는 숨기기만 하기 때문에 끄면 같이 해제 되도록 처리
    // settingWindow?.close();
    settingWindow = null
  })

  // mainWindow?.on('moved', async (e: any, _d: any) => {
  //   await mainWindow?.webContents.send('MOVE_WINDOW', {
  //     x: e.sender.getBounds().x,
  //     y: e.sender.getBounds().y
  //   })
  // })

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
  //           mainWindow?.setSize(width, height, true);
  //           mainWindow?.focus();
  //           mainWindow?.moveTop();
  //           return;
  //         }
  //       }
  //     });
  // });
  // ipcMain.on('SET_POSITION', async (event, { x, y }) => {
  //   console.log(x, y)
  //   mainWindow?.setPosition(x, y)
  //   // sendWindowInfo();
  // })

  // ipcMain.on('MOVE_POSITION', async (event, { x, y }) => {
  //   const position = mainWindow?.getPosition()
  //   mainWindow?.setPosition(position.x + x, position.y + y)
  //   // sendWindowInfo();
  // })

  ipcMain.on('SET_SCALE', async (_event, { scale }) => {
    if (lastScale !== scale) {
      // console.log("set scale")
      // console.log(Math.ceil(windowWidth * scale), Math.ceil(windowHeight * scale))
      mainWindow?.setResizable(true)
      mainWindow?.setSize(Math.ceil(windowWidth * scale), Math.ceil(windowHeight * scale), true)
      mainWindow?.setResizable(false)
      lastScale = scale
    }
    // mainWindow?.webContents.reloadIgnoringCache()
    // sendWindowInfo();
  })

  ipcMain.on('APPLY_PREFERENCE', (_event, preference) => {
    console.log(preference)
    // jotai에 저장한 preference로 부터 초기에 한번 불러와서 적용한다
    console.log(
      'set size',
      Math.ceil(windowWidth * preference.scale),
      Math.ceil(windowHeight * preference.scale)
    )
    mainWindow?.setSize(
      Math.ceil(windowWidth * preference.scale),
      Math.ceil(windowHeight * preference.scale),
      true
    )
    // mainWindow?.setPosition(Math.ceil(preference.positionX), Math.ceil(preference.positionY))
    // mainWindow?.webContents.reloadIgnoringCache();

    // sendWindowInfo();
  })

  // ipcMain.on("RESTART_WINDOW", (preference) => {
  //   mainWindow?.setSize(
  //     Math.ceil(windowWidth * preference.scale),
  //     Math.ceil(windowHeight * preference.scale)
  //     // true
  //   );
  //   mainWindow?.webContents.reloadIgnoringCache();

  //   // electronReload
  //   // app.relaunch(); // 재시작이 필요한 경우, relaunch를 호출하고 종료한다
  //   // app.exit();
  // });

  ipcMain.on('GET_DISPLAYS', async () => {
    if (settingWindow) {
      await settingWindow?.webContents.send('GET_DISPLAYS_RESPONSE', {
        displays: screen.getAllDisplays()
      })
    }
  })

  ipcMain.on('SHOW_SETTING_DIALOG', async () => {
    console.log('show setting dialog')
    if (!settingWindow) {
      createSettingWindow()
    }
    settingWindow?.moveTop()
    settingWindow?.focus()
    settingWindow?.show()
  })

  ipcMain.on('HIDE_SETTING_DIALOG', async () => {
    if (!settingWindow) {
      createSettingWindow()
    }
    settingWindow?.hide()
    mainWindow?.focus()
  })

  ipcMain.on('OPEN_DOCUMENT_SITE', async (_event, _arg) => {
    // console.log("open doc");
    shell.openExternal(
      'https://puffy-sauce-5a7.notion.site/Bitcat-76740b78aa3e4fe69312f14983d60924'
    )
  })

  // ipcMain.on('SET_SETTING_DIALOG_WINDOW_SIZE', (_event, { width, height }) => {
  //   settingWindow?.setResizable(true)
  //   settingWindow?.setSize(Math.ceil(width), Math.ceil(height), false)
  //   settingWindow?.setResizable(false)
  // })

  ipcMain.on('SET_AUTO_LAUNCH', (_event, { autoLaunch }) => {
    console.log('SET_AUTO_LAUNCH: ', autoLaunch)
    app.setLoginItemSettings({
      openAtLogin: autoLaunch,
      path: `"${process.execPath.toString()}"`
    })
  })

  ipcMain.handle('GET_AUTO_LAUNCH', async () => {
    return app.getLoginItemSettings().openAtLogin
  })

  ipcMain.handle('GET_SCALE', async () => {
    return lastScale
  })

  ipcMain.on('CLOSE_APP', (_e) => {
    mainWindow?.close()
    mainWindow = null
    app?.exit()
  })

  tray = new Tray(getTraySourceImage())
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Setting',
      type: 'normal',
      click: () => {
        settingWindow?.show()
      }
    },
    {
      label: '',
      type: 'separator'
    },
    {
      label: 'Quit',
      type: 'normal',
      click: () => {
        app.quit()
      }
    }
  ])
  // tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    tray?.popUpContextMenu()
  })

  const template: any = [{ role: 'appMenu', submenu: [{ role: 'quit' }] }]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.on('before-quit', () => {
  store.set('position', {
    x: mainWindow?.getPosition()[0],
    y: mainWindow?.getPosition()[1]
  })
  store.set('scale', lastScale)
  tray?.destroy()
  tray = null
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_event) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow?.isMinimized()) mainWindow?.restore()
      mainWindow?.focus()
    }
  })

  // app.on('ready', initialize)
}

// 시작 시 자동 실행
// 단 관리자 권한을 요구할 경우 동작하지 않는다는 스택오버플로우 글이 있었음 참조
app.setLoginItemSettings({
  openAtLogin: true,
  path: `"${process.execPath.toString()}"`
})
