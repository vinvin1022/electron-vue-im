<template>
  <div class="chat_editor" @click="hideRobotList">
    <!-- <chat-emoji
      v-bind:type="type"
      v-bind:scene="scene"
      v-bind:to="to"
      v-show="isEmojiShown"
      v-on:add-emoji="addEmoji"
      v-on:hide-emoji="hideEmoji"
    ></chat-emoji> -->
    <!-- <group v-show="isRobotListShown" class="m-chat-emoji m-chat-robot">
      <cell v-for="robot in robotslist" :title="robot.nick" :key="robot.account" @click.native="chooseRobot(robot)">
        <img class="icon u-circle" slot="icon" width="20" height="20" :src="robot.avatar">
      </cell>
    </group> -->

    <div class="chat_tool">
      <div class="toolBtns">
        <span v-if="!isRobot" class="u-editor-icon" @click.stop="showEmoji">
          <i class="iconfont">&#xe614;</i>
        </span>
        <span v-if="!isRobot" class="u-editor-icon" >
          <i class="iconfont" @click="handleFileClick">&#xe65f;</i>
          <input type="file" ref="fileToSent" @change="sendFileMsg">
        </span>
      </div>

      <chat-emoji v-bind:type="type" v-bind:scene="scene" v-bind:to="to" v-show="isEmojiShown" v-on:add-emoji="addEmoji" v-on:hide-emoji="hideEmoji"></chat-emoji>
    </div>
    <div class="chat_editor_main " :class="{robot:isRobot}">

      <textarea class="chat_editor_input" v-model="msgToSent" @keyup.enter.exact="sendTextMsg" @paste="onPaste" ref="msgInput"></textarea>
      <span class="editor_icons">
        <!-- <span v-if="!isRobot" class="u-editor-icon" @click.stop="showEmoji">
          <i class="u-icon-img"></i>
        </span>
        <span v-if="!isRobot" class="u-editor-icon" @change="sendFileMsg">
          <i class="u-icon-img"></i>
          <input type="file" ref="fileToSent">
        </span>
        <span v-if="!isRobot" class="u-editor-icon" @click.stop="sendPlayMsg">
          <i class="u-icon-img"></i>
        </span> -->
        <span class="editor_send" @click="sendTextMsg">发 送</span>
      </span>
      <el-dialog
        title="发送图片"
        :visible.sync="dialogVisible"
        width="500px"
        v-loading="loading"
        >
        <img :src="paste.url" alt="" class="pasteImage">
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sendPasteMsg">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ChatEmoji from "./ChatEmoji";
import turnPage from '@/router/turnPage';
// import util from '../../utils'
// import config from '../../configs'
// import pageUtil from '../../utils/page'
import { mapGetters, mapMutations } from "vuex";
export default {
    components: {
        ChatEmoji
    },
    updated() {
        window.document.body.addEventListener("click", () => {
            this.isEmojiShown = false;
        });
    },
    props: {
        type: String,
        scene: String,
        to: String,
        isRobot: {
            type: Boolean,
            default() {
                return false;
            }
        },
        invalid: {
            type: Boolean,
            default: false
        },
        invalidHint: {
            type: String,
            default: "您无权限发送消息"
        }
    },
    watch: {
        to(){
            this.msgToSent="";
        },
        refreshSendText(){
            this.msgToSent=this.quiteText;
            this.$refs.msgInput.focus();
        },
        continueRobotAccid(curVal, oldVal) {
            if (curVal && this.robotInfos[curVal]) {
                this.msgToSent = `@${this.robotInfos[curVal].nick} `;
            }
            // 重置
            this.$store.dispatch("continueRobotMsg", "");
        }
    },
    data() {
        return {
            isEmojiShown: false,
            isRobotListShown: false,
            msgToSent: "",
            paste:{},
            dialogVisible:false,
            loading:false,
        };
    },
    computed: {
        ...mapGetters({
            quiteText: "getQuiteText",
            refreshSendText: "getRefreshSendText"
        }),
        continueRobotAccid() {
            return this.$store.state.continueRobotAccid;
        },
        robotslist() {
            return this.$store.state.robotslist;
        },
        robotInfos() {
            return this.$store.state.robotInfos;
        },
        robotInfosByNick() {
            return this.$store.state.robotInfosByNick;
        },
        
    },
    methods: {
        //粘贴图片的函数
        onPaste(e) {
            if (this.invalid) {
                turnPage(this.invalidHint);
                return;
            }
            var items = e.clipboardData.items,
                _this = this;
            // if (items.length > 1) e.preventDefault();
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === "file") {
                    this.dialogVisible = true;
                    this.loading = true;
                    let file = items[i].getAsFile();
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function() {
                        // console.log(file)
                        _this.paste = {
                            url: this.result,
                            file: file
                        };
                        _this.loading = false;
                    };
                }
            }
        },
        handleFileClick() {
            this.$refs.fileToSent.click();
        },
        sendTextMsg() {
            if (this.invalid) {
                turnPage(this.invalidHint);
                return;
            }
            if (/^\s*$/.test(this.msgToSent)) {
                turnPage( "请不要发送空消息");
                return;
            } else if (this.msgToSent.length > 800) {
                turnPage( "请不要超过800个字");
               
                return;
            }
            this.msgToSent = this.msgToSent.trim();
            if (this.type === "session") {
                // 如果是机器人
                if (this.isRobot) {
                    this.$store.dispatch("sendRobotMsg", {
                        type: "text",
                        scene: this.scene,
                        to: this.to,
                        robotAccid: this.to,
                        // 机器人后台消息
                        content: this.msgToSent,
                        // 显示的文本消息
                        body: this.msgToSent
                    });
                } else {
                    let robotAccid = "";
                    let robotText = "";

                    let atUsers = this.msgToSent.match(/@[^\s@$]+/g);
                    if (atUsers) {
                        for (let i = 0; i < atUsers.length; i++) {
                            let item = atUsers[i].replace("@", "");
                            if (this.robotInfosByNick[item]) {
                                robotAccid = this.robotInfosByNick[item]
                                    .account;
                                robotText = (this.msgToSent + "")
                                    .replace(atUsers[i], "")
                                    .trim();
                                break;
                            }
                        }
                    }
                    if (robotAccid) {
                        if (robotText) {
                            this.$store.dispatch("sendRobotMsg", {
                                type: "text",
                                scene: this.scene,
                                to: this.to,
                                robotAccid,
                                // 机器人后台消息
                                content: robotText,
                                // 显示的文本消息
                                body: this.msgToSent
                            });
                        } else {
                            this.$store.dispatch("sendRobotMsg", {
                                type: "welcome",
                                scene: this.scene,
                                to: this.to,
                                robotAccid,
                                // 显示的文本消息
                                body: this.msgToSent
                            });
                        }
                    } else {
                        this.$store.dispatch("sendMsg", {
                            type: "text",
                            scene: this.scene,
                            to: this.to,
                            text: this.msgToSent
                        });
                    }
                }
            } else if (this.type === "chatroom") {
                let robotAccid = "";
                let robotText = "";

                let atUsers = this.msgToSent.match(/@[^\s@$]+/g);
                if (atUsers) {
                    for (let i = 0; i < atUsers.length; i++) {
                        let item = atUsers[i].replace("@", "");
                        if (this.robotInfosByNick[item]) {
                            robotAccid = this.robotInfosByNick[item].account;
                            robotText = (this.msgToSent + "")
                                .replace(atUsers[i], "")
                                .trim();
                            break;
                        }
                    }
                }
                if (robotAccid) {
                    if (robotText) {
                        this.$store.dispatch("sendChatroomRobotMsg", {
                            type: "text",
                            robotAccid,
                            // 机器人后台消息
                            content: robotText,
                            // 显示的文本消息
                            body: this.msgToSent
                        });
                    } else {
                        this.$store.dispatch("sendChatroomRobotMsg", {
                            type: "welcome",
                            robotAccid,
                            // 显示的文本消息
                            body: this.msgToSent
                        });
                    }
                } else {
                    this.$store.dispatch("sendChatroomMsg", {
                        type: "text",
                        text: this.msgToSent
                    });
                }
            }
            this.msgToSent = "";
        },
        sendPlayMsg() {
            if (this.invalid) {
                turnPage(this.invalidHint);
                return;
            }
            // 发送猜拳消息
            if (this.type === "session") {
                this.$store.dispatch("sendMsg", {
                    type: "custom",
                    scene: this.scene,
                    to: this.to,
                    pushContent: "[猜拳]",
                    content: {
                        type: 1,
                        data: {
                            value: Math.ceil(Math.random() * 3)
                        }
                    }
                });
            } else if (this.type === "chatroom") {
                this.$store.dispatch("sendChatroomMsg", {
                    type: "custom",
                    pushContent: "[猜拳]",
                    content: {
                        type: 1,
                        data: {
                            value: Math.ceil(Math.random() * 3)
                        }
                    }
                });
            }
        },
        clearFile(){
            this.$refs.fileToSent.value='';
        },
        sendFileMsg() {
            if (this.invalid) {
               turnPage(this.invalidHint);
                return;
            }
            let ipt = this.$refs.fileToSent;
            if (ipt.value) {
                if (this.type === "session") {
                    this.$store.dispatch("sendFileMsg", {
                        scene: this.scene,
                        to: this.to,
                        fileInput: ipt,
                        clearFile:this.clearFile
                    });
                } else if (this.type === "chatroom") {
                    this.$store.dispatch("sendChatroomFileMsg", {
                        fileInput: ipt
                    });
                }
            }
        },
        sendPasteMsg() {
            if (this.invalid) {
               turnPage(this.invalidHint);
                return;
            }
            if (this.type === "session") {
                this.$store.dispatch("sendFileMsg",{
                  scene: this.scene,
                  to: this.to,
                  dataURL:this.paste.url,
                  type: "image",
                  files:this.paste.file
              })
            } 
            this.dialogVisible=false;
        },
        showEmoji() {
            this.isEmojiShown = true;
        },
        hideEmoji() {
            this.isEmojiShown = false;
        },
        addEmoji(emojiName) {
            this.msgToSent += emojiName;
            this.$refs.msgInput.focus();
            this.hideEmoji();
        },
        chooseRobot(robot) {
            if (robot && robot.account) {
                let len = this.msgToSent.length;
                if (len === 0 || this.msgToSent[len - 1] !== "@") {
                    this.msgToSent += "@" + robot.nick + " ";
                }
                {
                    this.msgToSent += robot.nick + " ";
                }
            }
        },
        hideRobotList() {
            this.isRobotListShown = false;
        },
        onInputFocus(e) {
            setTimeout(() => {
                // todo fixme 解决iOS输入框被遮挡问题，但会存在空白缝隙
                e.target.scrollIntoView();
                // pageUtil.scrollChatListDown()
            }, 200);
        }
    }
};
</script>

<style >
.chat_tool {
    height: 40px;
    line-height: 40px;
    padding: 0px 16px;
    font-size: 24px;
    position: relative;
}
.chat_editor_main {
    border-top: 1px solid #eaeefb;
}
.chat_editor_input {
    border: none;
    width: 100%;
    padding: 8px 16px;
    height: 130px;
    overflow: auto;
    background: transparent;
    box-sizing: border-box;
    font-size:14px;
    word-break: break-all;
    color:#333;
    font:14px/26px 'Microsoft YaHei'
}
.chat_editor_input:focus {
    outline: none;
    border-color: none;
}
.editor_icons {
    display: block;
    text-align: right;
    padding: 0 20px;
}
.editor_send {
    cursor: pointer;
}
.editor_send:hover {
    color: #4598ff;
}
.u-editor-icon input {
    display: none;
}
.toolBtns i {
    font-size: 20px;
}
.pasteImage{max-width: 100%;}
</style>