<template>
    <li class="u-msg" :class="{
      'item-me': msg.flow==='out',
      'item-you': msg.flow==='in',
      'item-time': msg.type==='timeTag',
      'item-tip': msg.type==='tip',
      'session-chat': type==='session'
    }">
        <div v-if="msg.type==='timeTag'" class="timeTag center">---- {{msg.showText}} ----</div>
        <div v-else-if="msg.type==='tip'" class="tip center timeTag">{{msg.showText}}</div>
        <div v-else-if="msg.type==='notification' && msg.scene==='team'" class="notification center lightColor">{{msg.showText}}</div>
        <div v-else-if="msg.flow==='in' || msg.flow==='out'" :idClient="msg.idClient" :time="msg.time" :flow="msg.flow" :type="msg.type" class="flex chart" @contextmenu.prevent="(e)=>handleRightClick(msg,e)">
            <!--  <a class="msg-head" v-if="msg.avatar" :href="msg.link">
                <img class="icon u-circle" :src="msg.avatar">
            </a>
            <p class="msg-user" v-else-if="msg.type!=='notification'">
                <em>{{msg.showTime}}</em>{{msg.from}}</p> -->
            <img class="userAvator" :src="msg.avatar" :title="msg.fromNick" />
            <div class="chartContent grow1">
                <p class="fromNick">{{msg.flow==='out'?'我':(msg.fromNick||msg.from)}}</p>
                <span v-if="msg.isSending" class="loadingFile">
                    <i class="el-icon-loading"></i>
                </span>
                <span v-if="msg.status==='fail'" class="msg-failed">
                    <i class="el-icon-warning"></i>
                </span>
                <span v-if="msg.type==='text'" class="msg-text" v-html="msg.showText"></span>
                <span v-else-if="msg.type==='custom-type1'" class="msg-image width70" ref="mediaMsg">
                     <img :src="msg.imgUrl" />
                </span>
                <span v-else-if="msg.type==='custom-type3'" class="msg-image width70" ref="mediaMsg">
                     <img :src="msg.imgUrl" />
                </span>
                <span v-else-if="msg.type==='image'" class="msg-image width70" ref="mediaMsg" >
                    <span v-if="msg.isSending" class="sendingImg">
                        <img :src="msg.file.url" />
                        <el-progress :percentage="msg.percentage"></el-progress>
                    </span>
                    <img :src="msg.file.url + '?imageView&thumbnail=180x0&quality=85'" v-else @click="handleImgClick(msg.file)"/>
                </span>
                <span v-else-if="msg.type==='video'" class="msg-video width70" ref="mediaMsg">
                    <span v-if="msg.isSending" class="sendingImg" >
                        <el-progress :percentage="msg.percentage"></el-progress>
                    </span>
                    <video controls="controls" v-else>
                        <source :src="msg.file.url">
                        您的浏览器不支持视频文件 
                    </video>
                </span>
                <span v-else-if="msg.type==='audio'" class="msg-audio width70" @click="playAudio(msg.audioSrc)">
                     <span v-if="msg.isSending" class="sendingImg" >
                        <el-progress :percentage="msg.percentage"></el-progress>
                    </span>
                     <audio  controls>
                        <!-- <source src="/i/horse.ogg" type="audio/ogg"> -->
                        <source :src="msg.file.url" type="audio/mpeg">
                        您的浏览器不支持音频
                    </audio>
                </span>
                <span v-else-if="msg.type==='file'" class="msg-text">
                    <span v-if="msg.isSending" class="sendingFile"><i class="iconfont">&#xe65f;</i>{{msg.showText}} <el-progress :percentage="msg.percentage"></el-progress></span>
                    <a :href="msg.fileLink +'?download='+ msg.showText " v-else class="blue_color">
                        <i class="iconfont">&#xe65f;</i>{{msg.showText}}</a>
                </span>
                <span v-else-if="msg.type==='robot'" class="msg-text" :class="{'msg-robot': msg.robotFlow!=='out' && !isRobot}">
                    <div v-if="msg.robotFlow==='out'">{{msg.showText}}</div>
                    <div v-else-if="msg.subType==='bot'">
                        <!-- 多次下发的机器人消息 -->
                        <div v-for="(tmsgs,index) in msg.message" :key="index">
                            <!-- 多个机器人模板 -->
                            <div v-for="(tmsg, index) in tmsgs" :key="index">
                                <div v-if="tmsg.type==='text'">
                                    <p>{{tmsg.text}}</p>
                                </div>
                                <div v-else-if="tmsg.type==='image'">
                                    <p>
                                        <img :src="tmsg.url">
                                    </p>
                                </div>
                                <div v-else-if="tmsg.type==='url'">
                                    <a :class="tmsg.style" :href="tmsg.target" target="_blank">
                                        <div v-if="tmsg.image">
                                            <p v-for="(tmsg2, index) in tmsg.image" :key="index">
                                                <img :src="tmsg2.url">
                                            </p>
                                        </div>
                                        <div v-if="tmsg.text">
                                            <p v-for="(tmsg2, index) in tmsg.text" :key="index">{{tmsg2.text}}</p>
                                        </div>
                                    </a>
                                </div>
                                <div v-else-if="tmsg.type==='block'">
                                    <a :class="tmsg.style" :params="tmsg.params" :target="tmsg.target" @click="sendRobotBlockMsg(tmsg, msg)">
                                        <div v-if="tmsg.image">
                                            <p v-for="(tmsg2, index) in tmsg.image" :key="index">
                                                <img :src="tmsg2.url">
                                            </p>
                                        </div>
                                        <div v-if="tmsg.text">
                                            <p v-for="(tmsg2, index) in tmsg.text" :key="index">{{tmsg2.text}}</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="msg.subType==='faq'">
                        <!--p>{{msg.message.question}}</p-->
                        <p>{{msg.message.answer}}</p>
                    </div>
                    <!-- <span v-if="msg.robotFlow!=='out' && !isRobot" class="msg-link">
                        <a class="link-right blue_color" @click="continueRobotMsg(msg.content.robotAccid)">继续对话</a>
                    </span> -->
                </span>
                <span v-else-if="msg.type==='notification'" class="msg-text notify">{{msg.showText}}</span>
                <span v-else class="msg-text" v-html="msg.showText"></span>
               
            </div>
        </div>
    </li>
</template>

<script >
import util from "@/utils";
import config from "@/configs";
import emojiObj from "@/configs/emoji";
import createNewImageWindow from "@/renderProcess/createNewWindow.js";

export default {
    props: {
        type: String, // 类型，chatroom, session
        rawMsg: {
            type: Object,
            default() {
                return {};
            }
        },
        userInfos: {
            type: Object,
            default() {
                return {};
            }
        },
        myInfo: {
            type: Object,
            default() {
                return {};
            }
        },
        isRobot: {
            type: Boolean,
            default() {
                return false;
            }
        },
        isHistory: {
            type: Boolean,
            default() {
                return false;
            }
        }
        // robotInfos: {
        //   type: Object,
        //   default () {
        //     return {}
        //   }
        // }
    },
    data() {
        return {
         
            isFullImgShow: false,
            currentAudio: null
        };
    },
    computed: {
        robotInfos() {
            return this.$store.state.robotInfos;
        },
        msg() {
            let item = Object.assign({}, this.rawMsg);
            // 标记用户，区分聊天室、普通消息
            if (this.type === "session") {
                if (item.flow === "in") {
                    if (
                        item.type === "robot" &&
                        item.content &&
                        item.content.msgOut
                    ) {
                        // 机器人下行消息
                        let robotAccid = item.content.robotAccid;
                        item.avatar = this.robotInfos[robotAccid].avatar;
                        item.isRobot = true;
                        item.link = `#/namecard/${robotAccid}`;
                    } else if (item.from !== this.$store.state.userUID) {
                        item.avatar =
                            (this.userInfos[item.from] &&
                                this.userInfos[item.from].avatar) ||
                            config.defaultUserIcon;
                        item.link = `#/namecard/${item.from}`;
                        //todo  如果是未加好友的人发了消息，是否能看到名片
                    } else {
                        item.avatar = this.myInfo.avatar;
                    }
                } else if (item.flow === "out") {
                    item.avatar = this.myInfo.avatar;
                }
            } else {
                // 标记时间，聊天室中
                item.showTime = util.formatDate(item.time);
            }
            if (item.type === "timeTag") {
                // 标记发送的时间
                item.showText = item.text;
            } else if (item.type === "text") {
                // 文本消息
                item.showText = util.escape(item.text);
                if (/\[[^\]]+\]/.test(item.showText)) {
                    let emojiItems = item.showText.match(/\[[^\]]+\]/g);
                    emojiItems.forEach(text => {
                        let emojiCnt = emojiObj.emojiList.emoji;
                        if (emojiCnt[text]) {
                            item.showText = item.showText.replace(
                                text,
                                `<img class="emoji-small" src="${
                                    emojiCnt[text].img
                                }">`
                            );
                        }
                    });
                }
            } else if (item.type === "custom") {
                let content = JSON.parse(item.content);
                // type 1 为猜拳消息
                if (content.type === 1) {
                    let data = content.data;
                    let resourceUrl = config.resourceUrl;
                    // item.showText = `<img class="emoji-middle" src="${resourceUrl}/im/play-${data.value}.png">`
                    item.type = "custom-type1";
                    item.imgUrl = `${resourceUrl}/im/play-${data.value}.png`;
                    // type 3 为贴图表情
                } else if (content.type === 3) {
                    let data = content.data;
                    let emojiCnt = "";
                    if (emojiObj.pinupList[data.catalog]) {
                        emojiCnt =
                            emojiObj.pinupList[data.catalog][data.chartlet];
                        // item.showText = `<img class="emoji-big" src="${emojiCnt.img}">`
                        item.type = "custom-type3";
                        item.imgUrl = `${emojiCnt.img}`;
                    }
                } else {
                    item.showText = util.parseCustomMsg(item);
                    if (item.showText !== "[自定义消息]") {
                        item.showText += ",请到手机或电脑客户端查看";
                    }
                }
            } else if (item.type === "image") {
                // 原始图片全屏显示
                item.originLink = item.file.url;
            } else if (item.type === "video") {
                // ...
            } else if (item.type === "audio") {
                item.audioSrc = item.file.mp3Url;
                item.showText = Math.round(item.file.dur / 1000) + '" 点击播放';
            } else if (item.type === "file") {
                item.fileLink = item.file.url;
                item.showText = item.file.name;
            } else if (item.type === "notification") {
                if (item.scene === "team") {
                    item.showText = util.generateTeamSysmMsg(item);
                } else {
                    //对于系统通知，更新下用户信息的状态
                    item.showText = util.generateChatroomSysMsg(item);
                }
            } else if (item.type === "tip") {
                //对于系统通知，更新下用户信息的状态
                item.showText = item.tip;
            } else if (item.type === "robot") {
                let content = item.content || {};
                let message = content.message || [];
                if (!content.msgOut) {
                    // 机器人上行消息
                    item.robotFlow = "out";
                    item.showText = item.text;
                } else if (content.flag === "bot") {
                    item.subType = "bot";
                    message = message.map(item => {
                        if (item.type === "template") {
                            // 在vuex(store/actions/msgs.js)中已调用sdk方法做了转换
                            return item.content.json;
                        } else if (
                            item.type === "text" ||
                            item.type === "answer"
                        ) {
                            // 保持跟template结构一致
                            return [
                                {
                                    type: "text",
                                    text: item.content
                                }
                            ];
                        } else if (item.type === "image") {
                            // 保持跟template结构一致
                            return [
                                {
                                    type: "image",
                                    url: item.content
                                }
                            ];
                        }
                    });
                    item.message = message;
                } else if (item.content.flag === "faq") {
                    item.subType = "faq";
                    item.query = message.query;
                    let match = message.match.sort((a, b) => {
                        // 返回最匹配的答案
                        return b.score - a.score;
                    });
                    item.message = match[0];
                }
            } else {
                item.showText = `[${util.mapMsgType(
                    item
                )}],请到手机或电脑客户端查看`;
            }
            // this.msg = item;
            return item;
        }
    },
    beforeMount() {
        
    },
    mounted() {
        let item = this.msg;
        // 有时序问题的操作
        /* this.$nextTick(() => {
            let media = null;
            if (item.type === "image") {
                // 图片消息缩略图
                media = new Image();
                media.src =
                    item.file.url + "?imageView&thumbnail=180x0&quality=85";
            } else if (item.type === "custom-type1") {
                // 猜拳消息
                media = new Image();
                media.className = "emoji-middle";
                media.src = item.imgUrl;
            } else if (item.type === "custom-type3") {
                // 贴图表情
                media = new Image();
                media.className = "emoji-big";
                media.src = item.imgUrl;
            } else if (item.type === "video") {
                if (/(mov|mp4|ogg|webm)/i.test(item.file.ext)) {
                    media = document.createElement("video");
                    media.src = item.file.url;
                    media.autoStart = false;
                    media.preload = "metadata";
                    media.controls = "controls";
                } else {
                    let aLink = document.createElement("a");
                    aLink.href = item.file.url;
                    aLink.target = "_blank";
                    aLink.innerHTML = `<i class="u-icon icon-file"></i>${
                        video.name
                    }`;
                    this.$refs.mediaMsg.appendChild(aLink);
                }
            }
            if (media) {
                if (this.$refs.mediaMsg) {
                    this.$refs.mediaMsg.appendChild(media);
                }
                media.onload = () => {
                    this.$emit("msg-loaded");
                };
                media.onerror = () => {
                    this.$emit("msg-loaded");
                };
            } else {
                this.$emit("msg-loaded");
            }
        }); */ // end this.nextTick
    },
    methods: {
        handleImgClick(file){
            createNewImageWindow(file)  ;
        },
        handleRightClick(msg, e) {
            this.$emit("rightClick", e, msg);
        },
        revocateMsg(vNode) {
            // 在会话聊天页
            if (this.$store.state.currSessionId) {
                if (vNode && vNode.data && vNode.data.attrs) {
                    let attrs = vNode.data.attrs;
                    if (attrs.type === "robot") {
                        return;
                    }
                    // 自己发的消息
                    if (attrs.flow === "out") {
                        let that = this;
                        this.$vux.confirm.show({
                            title: "确定需要撤回消息",
                            onCancel() {},
                            onConfirm() {
                                that.$store.dispatch("revocateMsg", {
                                    idClient: attrs.idClient
                                });
                            }
                        });
                    }
                }
            }
        },
        sendRobotBlockMsg(msg, originMsg) {
            if (this.isHistory) {
                // 在历史消息中，不进行机器人交互
                return;
            }
            let body = "[复杂按钮模板触发消息]";
            if (msg.text && msg.text.length === 1) {
                body = msg.text[0].text;
            }
            let robotAccid = originMsg.content.robotAccid;
            if (!this.isRobot) {
                body = `@${this.robotInfos[robotAccid].nick} ${body}`;
            }
            if (this.type === "session") {
                this.$store.dispatch("sendRobotMsg", {
                    type: "link",
                    scene: originMsg.scene,
                    to: originMsg.to,
                    robotAccid,
                    // 机器人后台消息
                    params: msg.params,
                    target: msg.target,
                    // 显示的文本消息
                    body
                });
            } else if (this.type === "chatroom") {
                this.$store.dispatch("sendChatroomRobotMsg", {
                    type: "link",
                    robotAccid,
                    // 机器人后台消息
                    params: msg.params,
                    target: msg.target,
                    // 显示的文本消息
                    body
                });
            }
        },
        continueRobotMsg(robotAccid) {
            this.$store.dispatch("continueRobotMsg", robotAccid);
        },
        showFullImg(src) {
            this.$store.dispatch("showFullscreenImg", {
                src
            });
        },
        playAudio(src) {
            if (!this.currentAudio) {
                this.currentAudio = new Audio(src);
                this.currentAudio.play();
                this.currentAudio.onended = () => {
                    this.currentAudio = null;
                };
            }
        }
    }
};
</script>

<style scoped>
/* .p-chat-history .msg-link {
    display: none;
}
.p-room-chat-list .msg-text {
   
}
.p-room-chat-list .msg-link {
    bottom: 0;
    right: -4rem;
    font-size: 0.9rem;
} */
.msg-text {
    max-width: 80%;
    text-align: left;
}
.msg-text {
    border-radius: 4px;
    background: #fff;
    padding: 10px;
    word-break:break-all;
}
.item-you .msg-text {
    background: #eeeeee;
}
.item-me .msg-text {
    background: #c8e2fc;
}
.u-msg {
    padding-bottom: 20px;
}
.timeTag {
    color: #999;
}
.chart img {
    vertical-align: middle;
    line-height: 0;
}

.item-me .chart {
    flex-direction: row-reverse;
}
.item-me .chart .userAvator {
    margin-right: 0;
    margin-left: 14px;
}
.msg-failed {
    padding: 10px 10px;
    color: #f56c6c;
    font-size: 18px;
}
.loadingFile{
    padding: 10px 10px;
    color: #4598ff;
    font-size: 18px;
}
.item-me .chartContent {
    text-align: right;
    justify-content: flex-end;
}
.chartContent .fromNick {
    color: #999;
    margin-bottom: 10px;
}
.chart .userAvator {
    margin-top: 10px;
}
.chartContent > span {
    display: inline-block;
    vertical-align: middle;
}
.sendingImg{width:180px;display: inline-block;}
.iconfont{margin-right:10px;}
.sendingFile{min-width: 200px}
</style>
<style>
.width70 {
    max-width: 70%;
}
.width70 video,
.width70 audio,
.width70 img {
    max-width: 100%;
}
.msg-text .emoji-small {
    vertical-align: middle;
}

</style>
