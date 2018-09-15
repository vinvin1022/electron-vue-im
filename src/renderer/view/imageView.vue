<template>
    <div class="fullImagContainer">
        <div class="imageWinHeader flex">
            <p class="grow1" style="-webkit-app-region: drag">图片预览</p>
            <div class="btns grow0">
                <i @click="handleWin('minimize')" title="最小化">-</i>
                <i @click="handleWin('maximize',true)" title="最大化" v-show="!isMax">□</i>
                <i @click="handleWin('unmaximize',false)" title="还原" v-show="isMax" class="iconfont unmaximize" >&#xe619;</i>
                <i class="quit" @click="handleWin('hide')" title="关闭">×</i>
            </div>
        </div>
        <div class="imgContainer" @mousewheel="handleMousewheel" @contextmenu.prevent="rightClick">
            <span class="tip" :class="{showTip:isShowTip}">{{scale}}%</span>
            <img :src="imageMessage.url" :style="imgstyle" class="image" ref="img"/>
        </div>
        <div class="toolBtns">
            <i class="el-icon-download" @click="handleSave" title="下载" ></i>
            <i class="iconfont" @click="handleRecovery" title="恢复">&#xe618;</i>
            <i class="iconfont" @click="handleRotate" title="旋转">&#xe617;</i>
        </div>
        <rightMenu ref="rightMenu" >
            <li class="el-dropdown-menu__item" @click="handleCopy">复制</li>
        </rightMenu>
    </div>
</template>
<script>
import {toMain,fromMain} from '@/renderProcess/createNewWindow';
import rightMenu from '@/components/rightMenu';
export default {
    components:{
        rightMenu
    },
    data() {
        return {
            imageMessage:{},
            scale: 100,
            scaleData: [
                5,
                6,
                7,
                9,
                11,
                14,
                17,
                21,
                26,
                32,
                39,
                47,
                50,
                57,
                69,
                83,
                100,
                120,
                172,
                200,
                240,
                288,
                345,
                414,
                496,
                595,
                714,
                856,
                1000
            ],
            scaleIdx: 16,
            isShowTip: false,
            timer: null,
            rotate:0,
            isMax:false
        };
    },
    created(){
        this.imageMessage=JSON.parse(localStorage.imageMessage);
        fromMain('setImg',  (e, arg)=> {
            this.handleRecovery();
            this.imageMessage=arg;
            
        })
    },
    computed: {
        imgstyle() {
            let scale = `scale(${this.scale / 100})`;
            let rotate=this.rotate*90;
            return {
                transform: `translate(-50%,-50%) rotate(${rotate}deg) ${scale}`
            };
        }
    },
    mounted(){
       
        this.handleDrag(this.$refs.img);
    },
    methods: {
        rightClick(e){
            this.$refs.rightMenu&&this.$refs.rightMenu.treeMenuClick(e);
        },
        handleCopy(){
            toMain('copy',this.imageMessage)
        },
        handleWin(methodName,isMax){
            let arg={
                winMethod:methodName,
                winName:this.imageMessage.windowsName
            }
            toMain('win',arg);
            if(isMax!==undefined){
                this.isMax=isMax;
            }
        },
        
        handleSave(){
            toMain('save',this.imageMessage)
        },
        handleRotate(){
            this.rotate++;
        },
        handleDrag(ele, config) {
            var $this = this;
            var box = ele;
            var config = config || {};
            var disX, disY;

            box.onmousedown = function(e) {

                var window_width = box.parentNode.offsetWidth;
                var window_height = box.parentNode.offsetHeight;
                var max_left = window_width - box.clientWidth;
                var max_top = window_height - box.clientHeight;
            
                disX = e.clientX - box.offsetLeft;
                disY = e.clientY - box.offsetTop;

                // 单击
                if (e.button == 0) {
                    document.onmousemove = function(e) {
                        if (!disX) return false;
                        var obj = {
                            left: e.clientX - disX + "px",
                            top: e.clientY - disY + "px"
                        };

                        // 限制这个框内拖拽
                        var left = parseInt(obj.left);
                        if (left <= 0) {
                            // obj.left=0
                        } else if (left >= max_left) {
                            // obj.left = max_left + 'px'
                        }

                        var top = parseInt(obj.top);
                        if (top <= 0) {
                            // obj.top=0
                        } else if (top >= max_top) {
                            // obj.top = max_top + 'px'
                        }

                        box.style.left = obj.left;
                        box.style.top = obj.top;
                    };

                    document.onmouseup = function() {
                        document.onmousemove = document.onmouseup = null;
                    };

                    if (config.close)
                        document.onmousemove = document.onmouseup = null;

                    return false;
                } else if (e.button == 2) {
                }
            };
        },
        handleMousewheel(event) {
            let y = event.deltaY;
            if (
                !(
                    (this.scaleIdx == 0 && y < 0) ||
                    (this.scaleIdx == this.scaleData.length - 1 && y > 0)
                )
            ) {
                this.scaleIdx += y / 100;
            }
            this.scale = this.scaleData[this.scaleIdx];
            this.isShowTip = true;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.isShowTip = false;
            }, 1000);
        },
        handleRecovery() {
            let ele=this.$refs.img;
            this.scale = 100;
            this.scaleIdx = 16;
            ele.style.left="50%";
            ele.style.top="50%";
        }
    }
};
</script>
<style scoped>
.fullImagContainer {
    height: 100%;
    background: #ebeff2;
}
.imageWinHeader{height: 30px;line-height: 28px;text-align: center;cursor: pointer;}
.imgContainer {
    height: calc(100% - 90px);
    position: relative;
    overflow: hidden;
    /* height: calc(100% -60px); */
}
.tip,
.image {
    position: absolute;
    top: 50%;
    left: 50%;
    bottom: 0;
    transform-origin:center;
    /* right: 50%; */
    /* margin: auto; */
    z-index: 6;
}
.tip {
    z-index: 9;
    width: 80px;
    height: 40px;
    line-height: 40px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 16px;
    text-align: center;
    display: none;
}
.showTip {
    display: inline-block;
}
.toolBtns {
    height: 60px;
    line-height: 60px;
    font-size: 24px;
    text-align: center;
    color: #666;
}
i{ font-style:normal;font-size:20px;padding:0 12px;box-sizing: border-box;}
i:hover{background: #ddd}
.quit:hover{background: #ff6c60;color:#fff;}
.unmaximize{font-size:14px;}
</style>
