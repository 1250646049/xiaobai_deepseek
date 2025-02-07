import { app, shell, BrowserWindow, ipcMain, remote } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

var mainWindow
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minHeight: 670,
    minWidth: 900,
    titleBarOverlay: false,
    center: true,
    titleBarStyle: 'hidden',
    frame: false,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      javascript: true,
      webgl: true,
      webSecurity: false,
      contextIsolation: false,
      webviewTag: true,
      nodeIntegrationInWorker:true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function getAllWindows() {
  return BrowserWindow.getAllWindows()
}
function getCurrentWindow(event) {
  return getAllWindows().find((item) => item.id === event.frameId)
}

//监听窗体改变
ipcMain.handle('toggleWindowType', (event, type) => {
  let win = getCurrentWindow(event)
  if (!win) return null
  switch (type) {
    //最小化
    case 0: {
      win.minimize()
      break
    }
    case 1: {
      if (win.isMaximized()) {
        win.restore()
      } else {
        win.maximize()
      }
      break
    }
    case 2: {
      if (win.id === mainWindow.id) {
        app.exit()
      } else {
        win.close()
      }
    }
  }
})

//监听窗体位置改变
ipcMain.handle('setPosition', (event, params) => {
  let win = getCurrentWindow(event)
  if (!win) return
  win.setPosition(params.appX, params.appY)
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
