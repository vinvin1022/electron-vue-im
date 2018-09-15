<template>
  <ul class="sessionList">
      <li 
        class="sessionListItem flex flex_center"
        v-for="(session) in sessionlist"
        :class="{'active':sessionId===session.id}"
        :key="session.id"
        @click="enterChat(session)"
      >
            <el-badge :value="session.unread" :max="99" class="item flex" :hidden="session.unread==0">
                <img class="avatar grow0" :src="session.avatar||'http://static.sxmaps.com/icon/group.png'"  /> 
            </el-badge>
            <div class="content grow1">
                <p class="name flex justify_content ">
                    <span class="grow1 ellipsis" >{{session.name}}</span>
                    <span class="grow0 lightColor smallText">{{session.updateTimeShow}}</span>
                </p>
                <p class="ellipsis lightColor lastMessage">{{session.lastMsgShow}}</p>
            </div>
      </li>
  </ul>
</template>

<script>
import util from '../utils'
import config from '../configs'

export default {
  data () {
    return {
      sessionId:"",
      delSessionId: null,
      stopBubble: false,

    }
  },
  computed: {
    /* sysMsgUnread () {
      let temp = this.$store.state.sysMsgUnread
      let sysMsgUnread = temp.addFriend || 0
      sysMsgUnread += temp.team || 0
      let customSysMsgUnread = this.$store.state.customSysMsgUnread
      return sysMsgUnread + customSysMsgUnread
    }, */
    userInfos () {
      return this.$store.state.userInfos
    },
    myInfo () {
      return this.$store.state.myInfo
    },
    myPhoneId () {
      return `${this.$store.state.userUID}`
    },
    sessionlist () {
      let sessionlist = this.$store.state.sessionlist.filter(item => {
        item.name = ''
        item.avatar = ''
        if (item.scene === 'p2p') {
          let userInfo = null
          if (item.to !== this.myPhoneId) {
            userInfo = this.userInfos[item.to]
          } else {
            userInfo = this.myInfo
            userInfo.alias = '我的手机'
            // userInfo.avatar = `${config.myPhoneIcon}`
            return false
          }

          if (userInfo) {
             item.name = util.getFriendAlias(userInfo)
            item.avatar = userInfo.avatar
          }else{
              item.name =''
              item.avatar = config.defaultUserIcon
          }
        } else if (item.scene === 'team') {
          let teamInfo = null
          teamInfo = this.$store.state.teamlist.find(team => {
            return team.teamId === item.to
          })
          if (teamInfo) {
            item.name = teamInfo.name
            item.avatar = teamInfo.avatar || (teamInfo.type === 'normal' ? this.myGroupIcon : this.myAdvancedIcon)
          } else {
            item.name = `群${item.to}`
            item.avatar = item.avatar || this.myGroupIcon
          }
        }
        let lastMsg = item.lastMsg || {}
        if (lastMsg.type === 'text') {
          item.lastMsgShow = lastMsg.text || ''
        } else if (lastMsg.type === 'custom') {
          item.lastMsgShow = util.parseCustomMsg(lastMsg)
        } else if (lastMsg.scene === 'team' && lastMsg.type === 'notification') {
          item.lastMsgShow = util.generateTeamSysmMsg(lastMsg)
        } else if (util.mapMsgType(lastMsg)) {
          item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`
        } else {
          item.lastMsgShow = ''
        }
        if (item.updateTime) {
          item.updateTimeShow = util.formatDate(item.updateTime, true)
        }
        return item
      })
      return sessionlist
    }
  },
  methods: {
    enterChat (session) {
      if (this.hideDelBtn())
        return
      if (session && session.id)
        this.sessionId=session.id;
        // location.href = `#/chat/${session.id}`
        this.$emit("handleIsShowWebPage",false)
        if (session.unread > 0) {
          const item = this.sessionlist.find(item => item.id === session.id)
          // item.unread = 0
          this.$store.commit("updateSessions",[item])
        } 
        this.$router.push(`/chat/${session.id}`);
    },
    enterMyChat () {
      // 我的手机页面
      location.href = `#/chat/p2p-${this.myPhoneId}`
    },
    deleteSession () {
      if (this.delSessionId !== null) {
        this.$store.dispatch('deleteSession', this.delSessionId)
      }
    },
    showDelBtn (vNode) {
      if (vNode && vNode.data && vNode.data.attrs) {
        this.delSessionId = vNode.data.attrs.sessionId
        this.stopBubble = true
        setTimeout(() => {
          this.stopBubble = false
        }, 20)
      }
    },
    hideDelBtn () {
      if (this.delSessionId !== null && !this.stopBubble) {
        // 用于判断是否前置状态是显示删除按钮
        this.delSessionId = null
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>
.sessionListItem{padding:10px;}
.active{background: #e1e5e8;}
/* sessionListItem:last-child{border-bottom:none;} */
.avatar{width: 40px;height: 40px;border-radius: 50%;vertical-align: middle;}
.content{padding-left:12px;overflow: hidden;}
.lastMessage{font-size:12px;line-height:20px;}
</style>
