<template>
  <ul id="chat-list" class="chat-list">
    
    <li class="center lightColor" v-if="canLoadMore" v-loading="loading" @click="getMore">
      ---- 加载更多 ----
    </li>
    <li class="center lightColor" v-else>
      ---- 已无更多记录 ----
    </li>
    <chat-item
      v-for="(msg,index) in msglist"
      :type="type"
      :rawMsg="msg"
      :isRobot="isRobot"
      :userInfos="userInfos"
      :myInfo="myInfo"
      :key="index"
      :isHistory='isHistory'
      @msg-loaded="msgLoaded"
      @rightClick="rightClick"
    ></chat-item>
    <li>
        <rightMenu ref="rightMenu">
              <li class="el-dropdown-menu__item" @click="handleCopy"  v-if="currItem.type=='image'">复制图片 </li>
              <li class="el-dropdown-menu__item" @click="revocateMsg"  v-if="isCanRevocate">撤销 <i class="iconfont">&#xe633;</i></li>
              <li class="el-dropdown-menu__item" @click="abortMsg" v-if="currItem.isSending">取消 <i class="iconfont">&#xe633;</i></li>
        </rightMenu>
    </li>
  </ul>
</template>
<script >

  import ChatItem from './ChatItem'
  import rightMenu from '@/components/rightMenu'
  import {toMain,fromMain} from '@/renderProcess/createNewWindow';

  export default {
    components: {
      ChatItem,rightMenu
    },
    computed:{
      isCanRevocate(){
        if(this.currItem.flow=='out'&&this.currItem.status=='success'){
          return true
        }
        return false;
      }
    },
    props: {
      type: String, // 类型，chatroom, session
      canLoadMore: [String, Boolean],
      isRobot: {
        type: Boolean,
        default () {
          return false
        }
      },
      msglist: {
        type: Array,
        default () {
          return []
        }
      },
      userInfos: {
        type: Object,
        default () {
          return {}
        }
      },
      myInfo: {
        type: Object,
        default () {
          return {}
        }
      },
      isHistory: {
        type: Boolean,
        default() {
          return false
        }
      },
      loading:Boolean
      // robotInfos: {
      //   type: Object,
      //   default () {
      //     return {}
      //   }
      // }
    },
    data () {
      return {
        isFullImgShow: false,
        msgLoadedTimer: null,
        currItem:{},
      }
    },
    methods: {
       handleCopy(){
          toMain('copy',{windowsName:'mainWindow',...this.currItem.file})
       },
       getMore(){
         this.$emit('getHistoryMsgs');
       },
       abortMsg(){
         this.$store.dispatch('onMsgAbort',this.currItem,this.currItem.idClient)
        //  this.currItem.abortMsg();
       },
       revocateMsg(vNode) {
            // 在会话聊天页
            if (this.$store.state.currSessionId) {
              let attrs=this.currItem;
/*                 if (vNode && vNode.data && vNode.data.attrs) {
                    let attrs = vNode.data.attrs; */
                    if (attrs.type === "robot") {
                        return;
                    }
                    // 自己发的消息
                    if (attrs.flow === "out") {
                        let that = this;
                        if(new Date().getTime() - attrs.time > 2*60*1000){
                            this.$message({
                                message: '超过两分钟的消息不能撤回!',
                                type: 'warning'
                            }); 
                            return;
                        }
                        that.$store.dispatch("revocateMsg",attrs);
                    }
                
            }
        },
      msgLoaded () {
        clearTimeout(this.msgLoadedTimer)
        this.msgLoadedTimer = setTimeout(() => {
          this.$emit('msgs-loaded')
        }, 20)
      },
      rightClick(e,msg){
        this.currItem=msg;
        this.$refs.rightMenu&&this.$refs.rightMenu.treeMenuClick(e);
      }
    }
  }
</script>

<style scoped >
.chat-list{padding: 10px 20px; }
/*  .p-chat-list  .u-icon {
      width: 1.4rem;
      height: 1.6rem;
      margin-right: 0.2rem;
      vertical-align: bottom;
  } */
</style>