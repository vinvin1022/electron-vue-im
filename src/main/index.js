import { app, BrowserWindow,Tray } from 'electron'
import ipcMain from './ipcMain';
const path = require('path');
const _tray = require('./tray');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`


function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 830,
    useContentSize: true,
    autoHideMenuBar: true,
    minWidth:800,
    minHeight:500,
    width: 1230,
    // show:true
  })
  // mainWindow.webContents.openDevTools()
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit()
  })
  mainWindow.on('focus', () => {
      _tray.flashTray(false);
      mainWindow.flashFrame(false);
  })
  global.uiWin = mainWindow;
  ipcMain(mainWindow);
  _tray.init();  
    
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.commandLine.appendSwitch("--disable-http-cache");
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
