/*
 * SDK连接相关
 */

import config from "@/configs/index.js";
import turnPage from "@/router/turnPage";
import util from "@/utils";
import store from "../";
import { onFriends, onSyncFriendAction } from "./friends";
import { onRobots } from "./robots";
import { onBlacklist, onMarkInBlacklist } from "./blacks";
import { onMyInfo, onUserInfo } from "./userInfo";
import { onSessions, onUpdateSession } from "./session";
import { onRoamingMsgs, onOfflineMsgs, onMsg } from "./msgs";
import {
    onSysMsgs,
    onSysMsg,
    onSysMsgUnread,
    onCustomSysMsgs
} from "./sysMsgs";
import {
    onTeams,
    onSynCreateTeam,
    onCreateTeam,
    onUpdateTeam,
    onTeamMembers,
    onUpdateTeamMember,
    onAddTeamMembers,
    onRemoveTeamMembers,
    onUpdateTeamManagers,
    onDismissTeam,
    onUpdateTeamMembersMute
} from "./team";
const SDK = require("@/assets/sdk5/NIM_Web_SDK_v5.3.0.js");
// const SDK=require('@/assets/sdk/NIM_Web_SDK_v4.7.0.js');
import { dynamicLogout, dynamicLogin } from "@/components/justCall/call.js";
// 重新初始化 NIM SDK
export function initNimSDK({ state, commit, dispatch }, loginInfo) {
    if (state.nim) {
        state.nim.disconnect && state.nim.disconnect();
    }
    dispatch("showLoading");
    // 初始化SDK
    window.nim = state.nim = SDK.NIM.getInstance({
        //上线删除
        debug: false,
        // debug: true && { api: 'info', style: 'font-size:12px;color:blue;background-color:rgba(0,0,0,0.1)' },
        appKey: "4b024821f348f78566c75dea9b0b285e",
        account: loginInfo.uid,
        token: loginInfo.sdktoken,
        db: false,
        syncSessionUnread: true,
        syncRobots: true,
        autoMarkRead: true, // 默认为true
        needReconnect: true,
        onconnect: function onConnect(event) {
            if (loginInfo) {
                // 连接上以后更新uid
                commit("updateUserUID", loginInfo);
            }
        },
        onerror: function onError(event) {
            state.nimState = "unline";
            turnPage("网络连接状态异常", "/login");
        },
        onwillreconnect: function onWillReconnect() {
            state.nimState = "unline";
            turnPage("连接断开，正在重新建立连接");
        },
        ondisconnect: function onDisconnect(error) {
            state.nimState = "unline";
            switch (error.code) {
                case "logout":
                    turnPage("主动退出");
                    break;
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                    turnPage("nim帐号或密码错误", "/login");
                    break;
                // 被踢, 请提示错误后跳转到登录页面
                case "kicked":
                    let map = {
                        PC: "电脑版",
                        Web: "网页版",
                        Android: "手机版",
                        iOS: "手机版",
                        WindowsPhone: "手机版"
                    };
                    let str = error.from;
                    dispatch("destroyNimSDK");
                    let errorMsg = `你的帐号于${util.formatDate(
                        new Date()
                    )}被${map[str] || "其他端"}踢出下线，请确定帐号信息安全!`;
                    turnPage(errorMsg, "/login");
                    break;
                default:
                    turnPage("连接断开!");
                    break;
            }
        },
        // // 多端登录
        // onloginportschange: onLoginPortsChange,
        // 用户关系及好友关系
        onblacklist: onBlacklist,
        onsyncmarkinblacklist: onMarkInBlacklist,
        // onmutelist: onMutelist,
        // onsyncmarkinmutelist: onMarkInMutelist,
        onfriends: onFriends,
        onsyncfriendaction: onSyncFriendAction,
        // 机器人
        onrobots: onRobots,
        // 用户名片 - actions/userInfo
        onmyinfo: onMyInfo,
        onupdatemyinfo: onMyInfo,
        onusers: onUserInfo,
        onupdateuser: onUserInfo,
        // // 群组
        onteams: onTeams,
        onsynccreateteam: onSynCreateTeam,
        syncTeams: true,
        onteammembers: onTeamMembers,
        onCreateTeam: onCreateTeam,
        onDismissTeam: onDismissTeam,
        onUpdateTeam: onUpdateTeam,
        onAddTeamMembers: onAddTeamMembers,
        onRemoveTeamMembers: onRemoveTeamMembers,
        onUpdateTeamManagers: onUpdateTeamManagers,
        onupdateteammember: onUpdateTeamMember,
        onUpdateTeamMembersMute: onUpdateTeamMembersMute,
        // // 会话
        onsessions: onSessions,
        onupdatesession: onUpdateSession,
        // // 消息
        onroamingmsgs: onRoamingMsgs,
        onofflinemsgs: onOfflineMsgs,
        onmsg: onMsg,
        // // 系统通知
        onsysmsg: onSysMsg,
        onofflinesysmsgs: onSysMsgs,
        onupdatesysmsg: onSysMsg, // 通过、拒绝好友申请会收到此回调

        onsysmsgunread: onSysMsgUnread,
        onupdatesysmsgunread: onSysMsgUnread,

        onofflinecustomsysmsgs: onCustomSysMsgs,
        oncustomsysmsg: onCustomSysMsgs,
        // // 同步完成
        onsyncdone: function onSyncDone() {
            // debugger;
            store.dispatch("nimDataReadly");
            dispatch("hideLoading");
            // 说明在聊天列表页
            /* if (store.state.currSessionId) {
        dispatch('setCurrSession', store.state.currSessionId)
      } */
        }
    });
}

// 清除实例
export function destroyNimSDK({ state, commit, dispatch }, callBack) {
    if (state.nim) {
        state.nim.destroy({
            done: function(err) {
                window.nim = state.nim = null;
                state.userUID = null;
                state.isLeave = false;
                state.issyncdone = false;
                state.myInfo = {};
                state.userInfos = {};
                state.sessionlist = [];
                state.sessionMap = {};
                state.friendslist = [];
                state.robotslist = [];
                state.teamlist = [];
                state.msgs = {};
                state.msgsMap = {};
                state.teamMembers = {};
                state.noMoreHistoryMsgs = false;
                state.noMoreHistoryMsgs = false;
                state.currSessionId = null;
                state.currSessionMsgs = [];
                state.baseMessage.studentList = [];
                callBack && callBack();
            }
        });
    }
}
export function logOut({ state, commit, dispatch }, message) {
    dispatch("destroyNimSDK");
    // dynamicLogout('13805','7152');
    if (localStorage.device) {
        dynamicLogout();
    }
    turnPage(message, "/login");
}
export function nimDataReadly({ state, commit, dispatch }, message) {
    let accountsNeedSearch = [];
    state.sessionlist.forEach(item => {
        if (item.scene === "p2p") {
            // 如果不存在缓存资料
            if (!state.userInfos[item.to]) {
                accountsNeedSearch.push(item.to);
            }
        }
    });
    
    if (!state.issyncdone) {
        turnPage(null, "/layout");
        if (accountsNeedSearch.length > 0) {
            while (accountsNeedSearch.length > 0) {
                dispatch("searchUsers", {
                    accounts: accountsNeedSearch.splice(0, 150)
                });
            }
        }
        commit("upsyncdone", true);
        if (
            localStorage.device &&
            state.baseMessage.tearcherInfo.loginDevice != localStorage.device
        ) {
            dynamicLogin();
        }
    }
}
