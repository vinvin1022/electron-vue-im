const {app, ipcMain, clipboard, Tray, dialog, nativeImage,BrowserWindow} = require('electron');
const _tray = require('./tray');
// import {wins} from '../renderer/renderProcess/createNewWindow.js';
const imageWinUrl = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#/imageView`
  : `file://${__dirname}/index.html#/imageView`;
let index=1,
    wins={};
const path = require('path');
let download=function(windowsName,url, path, done){
    wins[windowsName].webContents.downloadURL(url);
    wins[windowsName].webContents.session.on('will-download', function(event, item, webContents) {
        item.setSavePath(path)
        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {
                    // console.log(`Received bytes: ${item.getReceivedBytes()}`)
                }
            }
        })
        item.once('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download successfully')
            } else {
                console.log(`Download failed: ${state}`)
            }
            if(done) done(state)
        })
    });

};
export default function(mainWindow){
        wins.mainWindow=mainWindow;
        ipcMain.on("win",(event,arg) =>{
            wins[arg.winName][arg.winMethod]();
        })
        ipcMain.on("showWin",(event,arg) =>{
            wins[arg].show()
        })
        ipcMain.on("createImageWin",(event, file)=>{
             let winName=file.windowsName;
            if(wins[winName]){
                wins[winName].show();
                wins[winName].webContents.send('setImg', file)
                return;
            }
            wins[winName] = new BrowserWindow({
                // parent: uiWin,
                title: '图片预览',
                width:file.availWidth-320,
                height:file.availHeight-160,
                // show: false,
                frame: false,
                // transparent: true,
                // skipTaskbar: true,
                autoHideMenuBar: true,
            })
            // let imageUrl=imageWinUrl+'?imgUrl='+url;
            wins[winName].on('close', () => { wins[winName] = null });
            
            wins[winName].loadURL(imageWinUrl)
            wins[winName].show();
            
        })
         // 保存
        ipcMain.on("save",(event, arg) =>{
            // arg.name=encodeURI(arg.name)
            const options = {
                title: '另存为',
                defaultPath: path.resolve(app.getPath("downloads"), arg.name),
                filters: [
                  {name: 'Images', extensions: [arg.ext]},
                  {name: 'All Files', extensions: ['*']}
                ]
              }
            dialog.showSaveDialog(options, (filename) => {
                if(!filename){
                    return;
                }
                download(arg.windowsName,arg.url,filename)
            })
        })

        // 复制图片
        ipcMain.on("copy",(event, arg) =>{
           /*  let url= process.env.NODE_ENV === 'development'
            ? '': __dirname; */
            arg.name=encodeURI(arg.name);
            const imagePath = process.env.NODE_ENV === 'development'?path.join(`static/images/copyImg/${arg.name}.${arg.ext}`):path.join(__dirname, `../../../copyImg/${arg.name}.${arg.ext}`);
            download(arg.windowsName,arg.url, imagePath, () => {
                const image = nativeImage.createFromPath(imagePath)
                // const { width, height } = image.getSize()
                clipboard.writeImage(image, 'image')
            })

        })

        // 粘贴图片
        ipcMain.on("paste",(event, arg) =>{
            data = clipboard.readImage('pic').toDataURL()
            event.sender.send("pastePic", data)

        })
        ipcMain.on('onMsg', (event, arg) => {
             // 窗口看不到时 任务栏高亮
             const isFocused = global.uiWin.isFocused();
             if(!isFocused) {
                global.uiWin.flashFrame(true)
                 // 闪动小图标
                 _tray.flashTray(true)
             }
        })
}