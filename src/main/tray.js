const {Tray, Menu, MenuItem,app,nativeImage} = require('electron')
const path = require('path')
// const ipcModule = require("../node/ipcModule");
// let devUrl=path.join(__dirname,'../../static/images/icons');
// let proUrl=path.join(__dirname,'../../../../icons');
let imagesUrl = process.env.NODE_ENV === 'development'
  ? path.join(__dirname,'../../static/assets')
  : path.join(__dirname,'static/assets');
let timer=null;
const _tray = {
    init() {
        this.trayIcon=nativeImage.createFromPath(path.join(imagesUrl, 'icon.ico'));
        this.emptyIcon=nativeImage.createFromPath(path.join(imagesUrl, 'empty.png'));
        global.tray = this.tray = new Tray(this.trayIcon);
        this.setToolTip()
        this.trayContextMenu()
        tray.on('click', () => {
            this.showAndFocusWindow();
        });
        tray.on('right-click', () => {
            tray.popUpContextMenu(this.trayContextMenu());
        });

    },
    trayContextMenu() {

        const trayContextMenu = Menu.buildFromTemplate([
            {
                label: '打开',
                click: () => {
                    this.showAndFocusWindow();
                }
            }, /* {
                label: '注销',
                click: () => {
                    console.log('line');
                    global.uiWin.webContents.send("line",'unline')
                    // global.sdkWin.webContents.send("line",'unline')
                    // global.uiWin.loadURL(path.join(__dirname, '../page/login.html'))
                    this.showAndFocusWindow();
                }
            }, */ {
                label: '退出',
                click: () => {
                    app.quit()
                }
            }
        ])
        return trayContextMenu

    },
    showAndFocusWindow(){
        global.uiWin.show()
    },
    setToolTip(val) {

        tray.setToolTip(val || '升学教师工作平台');
    },
    _trayIconCounter: 0,
    /* _trayIcons: [
        // path.join(imagesUrl, '/icon.ico'),
        // path.join(imagesUrl, '/empty.png')
        path.join(__dirname, '../../', 'assets', 'icon.ico'),
        path.join(__dirname, '../../', 'assets', 'empty.png')
    ], */
    flashTray(flash = true) {
        let _this=this;
        if (flash) {
            if (!timer) {
                timer = setInterval(() => {
                    if((_this._trayIconCounter++) % 2){
                        global.tray.setImage(_this.trayIcon);
                    }else{
                        global.tray.setImage(_this.emptyIcon);
                    }
                    // global.tray.setImage(this._trayIcons[(this._trayIconCounter++) % 2]);
                }, 400);
            }
        } else {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            global.tray.setImage(_this.trayIcon);
        }

    },

}


module.exports = _tray



