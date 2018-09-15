const {BrowserWindow} = require('electron').remote
const {ipcRenderer} = require('electron')

let index=1;
// 向主进程发送消息
export const toMain = (channelName,data) => {
    ipcRenderer.send(channelName, data)
}


// 接收来自主进程的消息
export const fromMain = (channelName,func) => {
    ipcRenderer.on(channelName, (event, arg) => {
        func(event, arg)
    })
}
// 图片窗口
let createNewImageWindow=function(file){
    let winName='imageWin'+index;
    file.windowsName=winName;
    file.availHeight=screen.availHeight;
    file.availWidth=screen.availWidth;
    localStorage.setItem("imageMessage",JSON.stringify(file));

    toMain("createImageWin",file);
    // index++;

};

export default createNewImageWindow;

