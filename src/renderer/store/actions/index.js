// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。
import cookie from '../../utils/cookie'
import turnPage from '@/router/turnPage';

/* 导出actions方法 */
import {showLoading, hideLoading, showFullscreenImg, hideFullscreenImg} from './widgetUi'
import {initNimSDK,destroyNimSDK,logOut,nimDataReadly} from './initNimSDK'

import {updateBlack} from './blacks'
import {updateFriend, addFriend, deleteFriend} from './friends'
import {resetSearchResult, searchUsers, searchTeam} from './search'
import {deleteSession, setCurrSession, resetCurrSession} from './session'
import {sendMsg, sendFileMsg, sendMsgReceipt, sendRobotMsg, revocateMsg, getHistoryMsgs, resetNoMoreHistoryMsgs, continueRobotMsg} from './msgs'
import {markSysMsgRead, resetSysMsgs, deleteSysMsgs, markCustomSysMsgRead} from './sysMsgs'
import {onMsgAbort} from './msgs'

import {delegateTeamFunction, onTeamNotificationMsg, enterSettingPage, getTeamMembers} from './team'
import datastore from '@/datastore'
function connectNim ({state, commit, dispatch}, obj) {
  let {force} = Object.assign({}, obj)
  // 操作为内容页刷新页面，此时无nim实例
  if (!state.nim || force) {
    let loginInfo = {
        uid:state.baseMessage.tearcherInfo.accid,//"f96139f3db454feda542874bd1802e0c",//"20bc3c64fda444489da5a38bc7354f28",// "cc9cd745ccfc4a0da8c48ec08cd09611",
        sdktoken:state.baseMessage.tearcherInfo.token//"e07569954ef23206f782f1d77087d72a",//"6a1a6abff6b0fb0260dc11c0adcb92a9",// "09c4b1221bb00aa598b9082ab35c66f0",
    }
    if (!loginInfo.uid) {
      // 无cookie，直接跳转登录页
      turnPage('无历史登录记录，请重新登录', '/login')
    } else {
      commit('upsyncdone', false)
      // 有cookie，重新登录
      if(state.nim){
        dispatch('destroyNimSDK', ()=>{dispatch('initNimSDK', loginInfo)})
      }else{
        dispatch('initNimSDK', loginInfo)
      }
      
    }
  }
}

export default {
  createdDB({state, commit, dispatch}, userAccid){
    state.db=datastore(userAccid);
  },
  updateRefreshState ({commit}) {
    commit('updateRefreshState')
  },

  // UI 及页面状态变更
  showLoading,
  hideLoading,
  showFullscreenImg,
  hideFullscreenImg,
  continueRobotMsg,

  // 连接sdk请求，false表示强制重连
  connect (store, obj) {
    let {type} = Object.assign({}, obj)
    connectNim(store, obj)
    // type 可为 nim chatroom
   /*  type = type || 'nim'
    switch (type) {
      case 'nim':
        connectNim(store, obj)
        break
      case 'chatroom':
        connectChatroom(store, obj)
        break
    } */
  },
  // 用户触发的登出逻辑
  disconnect ({ state, commit ,dispatch}) {
    if (state.nim) {
      // dispatch('destroyNimSDK')
      state.nim.disconnect()
    }
  },
  // 用户触发的登录逻辑
  relogin ({ state, commit }) {
    if (state.nim) {
      state.nim.connect()
    }
  },
  //离开
  leaveSetting({ state, commit },obj){
    if(obj.isLeave){
       state.nim.connect()
    } 
    commit('updateNimStateLeave',obj);
  },

  // 初始化 重新连接SDK
  initNimSDK,
  destroyNimSDK,
  nimDataReadly,
  logOut,
  // 清空所有搜索历史纪录
  resetSearchResult,
  // 搜索用户信息
  searchUsers,
  // 更新黑名单
  updateBlack,
  // 更新好友
  addFriend,
  deleteFriend,
  updateFriend,
  // 删除会话
  deleteSession,
  // 设置当前会话
  setCurrSession,
  // 重置当前会话
  resetCurrSession,
  // 发送消息
  sendMsg,
  sendFileMsg,
  sendRobotMsg,
  // 发送消息已读回执
  sendMsgReceipt,
  // 消息撤回
  revocateMsg,
  getHistoryMsgs,
  // 重置历史消息状态
  resetNoMoreHistoryMsgs,
  // 标记系统消息已读
  markSysMsgRead,
  markCustomSysMsgRead,
  resetSysMsgs,
  deleteSysMsgs,

 
  // 搜索群
  searchTeam,
  // 代理sdk中的群方法
  delegateTeamFunction,
  // 处理群消息回调
  onTeamNotificationMsg,
  // 进入群信息设置页
  enterSettingPage,
  // 获取群成员
  getTeamMembers,
  onMsgAbort

}
