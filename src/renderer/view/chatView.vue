<template>
    <div class="chatContainer flex">
        <div class="grow1 flex flex_column content">
            <div class="grow0 userTitle flex flex_center" >
                <img :src="sessionInfo.avator" class="userAvator" />
                <span class="userName">{{sessionInfo.name}}</span>
                <i class="iconfont pointer callIcon" @click="handleContactStudent" v-if="phone">&#xe6ab;</i>
                <contactStudents  v-if="phone" ref="contactStu" :phone="phone" :memberUid="memberId" />
                <!-- <contactStudents :phone="phone"/> -->
            </div>
            <div class="chatHistory grow1 scroll_auto" ref="chatHistory" @scroll="handleScroll">
                
                <chatHistory :msglist="currSessionMsgs" :userInfos="userInfos" :canLoadMore="canLoadMore"  :myInfo="myInfo" type="session" :loading="loading" @getHistoryMsgs="getHistoryMsgs"/>
                <div class='invalidHint lightColor center' v-if='scene==="team" && teamInvalid'>
                    {{`您已退出该${teamInfo && teamInfo.type==='normal' ? '讨论组':'群'}`}}
                </div>
            </div>
            <div class="chatInputBox grow0">
                <ChatEditor type="session" :scene="scene" :to="to" :isRobot="isRobot" :invalid="teamInvalid || muteInTeam" :invalidHint="sendInvalidHint" />
                <!-- <el-input type="textarea"></el-input>
              <el-button type="primary" size="small" >发送</el-button> -->
            </div>
        </div>
        <div class="grow0 aside">
            <div class="sessionMessage" v-loading="isLoading">
                <template v-if="scene=='p2p'">
                    <p class="asideTitle">学员信息</p>
                    <studentMessage v-for="(item,index) in studentDetail" :key="index" :studentDetail="item" />
                </template>
                <template v-else>
                    <groupMemberList :teamId="to" :invalid="teamInvalid || muteInTeam" :invalidHint="sendInvalidHint"/>
                </template>
            </div>
            <div class="faqContainer elementTabStyleClear">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="FAQ" name="1">
                        <Faq/>
                        
                    </el-tab-pane>
                    <el-tab-pane label="快捷回复" name="2">
                        <QuickReply />
                    </el-tab-pane>
                </el-tabs>
                
            </div>
        </div>
    </div>
</template>
<script>
import chatHistory from "./chatHistory/index";
import ChatEditor from "@/components/ChatEditor";
import util from "../utils";
import contactStudents from '@/components/contactStudents.vue';
import studentMessage from './studentMessage';
import groupMemberList from './group/groupMemberList';
import Faq from '@/components/Faq/index';
import config from '@/configs/index';
import QuickReply from '@/components/QuickReply/index';
// import { mapGetters } from "vuex";
export default {
    data(){
       return{
            studentDetail:[],
            activeName:'1',
            isLoading:false,
            faqData:[],
            loading:false,
            currPagePos:0,
       }
    },
    created() {
        if(this.scene=='p2p'){
            this.getStudentDetail();
        }
        this.$store.dispatch("setCurrSession", this.sessionId);
    },
    mounted(){
        this.scrollToBottom();
    },
    components: {
        chatHistory,
        ChatEditor,
        contactStudents,
        studentMessage,
        groupMemberList,
        Faq,
        QuickReply
    },
    computed: {
        /*  ...mapGetters({
            tearcherInfo: "getTearcherInfo"
        }), */
        phone(){
            if(this.studentDetail.length){
                return this.studentDetail[0].xyphone
            }else{
                return ""
            }
        },
        memberId(){
           if(this.studentDetail.length){
                return this.studentDetail[0].memberId
            }else{
                return ""
            }
        },
        myInfo () {
            return this.$store.state.myInfo
        },
        sessionId: function() {
            return this.$route.params.id;
        },
        sessionInfo() {
            let sessionId = this.sessionId;
            let user = null;
            if (/^p2p-/.test(sessionId)) {
                user = sessionId.replace(/^p2p-/, "");
                if (user === this.$store.state.userUID) {
                    return {  
                                name:"我的手机",
                                avator:this.myInfo.avator
                            }
                } else if (this.isRobot) {
                    return  {  
                                name:this.robotInfos[user].nick,
                                avator:robotInfos[user].avatar||config.defaultUserIcon
                            }
                } else {
                    let userInfo = this.userInfos[user];
                    if(!userInfo){
                        this.$store.dispatch('searchUsers', {
                            accounts: user
                        })
                        return {}
                    }else{
                         return {
                                name:util.getFriendAlias(userInfo),
                                avator:userInfo.avatar
                            }
                    }
                   
                    //  util.getFriendAlias(userInfo);
                }
            } else if (/^team-/.test(sessionId)) {
                if (this.teamInfo) {
                    // teamInfo中的人数为初始获取的值，在人员增减后不会及时更新，而teamMembers在人员增减后同步维护的人员信息
                    let members =
                        this.$store.state.teamMembers &&
                        this.$store.state.teamMembers[this.teamInfo.teamId];
                    let memberCount = members && members.length;
                    let name=(
                        this.teamInfo.name +
                        (memberCount ? `(${memberCount})` : "")
                    );
                    return {
                                name:name,
                                avator:this.teamInfo.avator||config.defaultGroupIcon
                            }
                } else {

                    return {
                                name:'群',
                                avator:config.defaultGroupIcon
                            }
                }
            }
        },
        currSessionMsgs: function() {
            return this.$store.state.currSessionMsgs;
        },
        userInfos() {
            return this.$store.state.userInfos;
        },
        scene() {
            return util.parseSession(this.sessionId).scene;
        },
        to() {
            return util.parseSession(this.sessionId).to;
        },
        canLoadMore () {
            return !this.$store.state.noMoreHistoryMsgs
        },
        isRobot() {
            /*  let sessionId = this.sessionId
            let user = null
            if (/^p2p-/.test(sessionId)) {
                user = sessionId.replace(/^p2p-/, '')
                if (this.robotInfos[user]) {
                return true
                }
            } */
            return false;
        },
        teamInfo() {
            if (this.scene==='team') {
                var teamId =  this.sessionId.replace('team-','')
                return this.$store.state.teamlist.find(team=>{
                return team.teamId === teamId
                })
            } 
            return undefined
        },
        muteInTeam() {
            if (this.scene !== "team") return false;
            var teamMembers = this.$store.state.teamMembers;
            var Members = teamMembers && teamMembers[this.teamInfo.teamId];
            var selfInTeam =
                Members &&
                Members.find(item => {
                    return item.account === this.$store.state.userUID;
                });
            return (selfInTeam && selfInTeam.mute) || false;
        },
        teamInvalid() {
            if (this.scene === "team") {
                return !(this.teamInfo && this.teamInfo.validToCurrentUser);
            }
            return false;
        },
        sendInvalidHint() {
            if (this.scene === "team" && this.teamInvalid) {
                return `您已不在该${
                    this.teamInfo && this.teamInfo.type === "normal"
                        ? "讨论组"
                        : "群"
                }，无操作权限`;
            } else if (this.muteInTeam) {
                return "您已被禁言";
            }
            return "无操作权限";
        }
    },
    beforeDestroy() {
        this.$store.dispatch('resetCurrSession', {
            type: 'destroy'
        })
    },
    methods:{
        handleContactStudent(){
            this.$refs.contactStu.changeVisible(true)
        },
        getStudentDetail(){
            this.isLoading=true
            this.$http("getNewStudentInfo", {
                data: {"memberId": this.to}
            })
            .then(res => {
                this.isLoading=false
                this.studentDetail=res.data||[];
            })
            .catch(err => {
                this.studentDetail=[];
                this.isLoading=false
            });
        },
        handleScroll(e){
            if(e.target.scrollTop<=5){
                this.getHistoryMsgs();
            }
        },
        setLoadingFalse(){
            this.loading=false;
        },
        getHistoryMsgs (istoBottom) {
            if (this.canLoadMore&&!this.loading) {
                this.loading=true;
                if(!istoBottom){
                    this.currPagePos=this.$refs.chatHistory.scrollHeight;
                }
                this.$store.dispatch('getHistoryMsgs', {
                    scene: this.scene,
                    to: this.to,
                    done:this.setLoadingFalse
                })
            }
        },
        scrollToBottom(){
            if(this.$refs.chatHistory) {
                this.$refs.chatHistory.scrollTop=this.$refs.chatHistory.scrollHeight-this.currPagePos;
                if(this.currPagePos){
                    this.currPagePos=0;
                }
            }
        },
    },
    /* updated(){
       this.scrollToBottom();
    }, */
    watch: {
        /* canLoadMore(){
            if(!this.canLoadMore){
                this.currPagePos=0;
            }
        }, */
        currSessionMsgs(){
            if(this.currSessionMsgs.length<10&&this.canLoadMore){
                this.getHistoryMsgs(true);
            }
            this.$nextTick(this.scrollToBottom)
        },
        sessionId: function() {
            this.$store.dispatch("setCurrSession", this.sessionId);
            this.$store.dispatch("resetNoMoreHistoryMsgs", this.sessionId);
            this.currPagePos=0;
            if(this.scene=='p2p'){
                this.getStudentDetail();
            }else{
                this.studentDetail=[];
            }
        }
    }
};
</script>
<style scoped>
.content{border-right:1px solid #ebeff2;}
.userTitle{height: 40px;line-height: 40px;padding: 0 20px;border-bottom:1px solid #eaeaea;}
.userName{font-size: 16px;}
.userAvator{width: 30px;height: 30px;}
.chatContainer {
    height: 100%;
    box-sizing: border-box;
    border-left:1px solid #fafafa;
    border-right:1px solid #fafafa;
}
.aside {
    width: 260px;
}
.chatHistory {
    height: 100%;
}
.sessionMessage{
    height:280px;
    padding:0 10px;
    box-sizing: border-box;
    overflow: auto;
}
.faqContainer{
    height: calc(100% - 280px);
    box-sizing: border-box;
    overflow: auto;
    border-top:1px solid #e5e5e5;
    
}
.faqContainer{
   
}
/* .chatTool{
    border-top:1px solid #eaeefb;
    height:40px;
    padding:4px 16px;
} */
.chatInputBox {
    border-top: 1px solid #eaeefb;
    /* height:190px; */
    /* padding:4px 16px; */
}
.callIcon{padding-left:10px;color:#4598ff;font-size:20px;}
</style>
<style>
.elementTabStyleClear .el-tabs__header{margin:0;}
.elementTabStyleClear .el-collapse-item__arrow{float: left;}
.elementTabStyleClear .el-collapse-item__header,.elementTabStyleClear .el-collapse-item__wrap{
    background-color:transparent;
}
.elementTabStyleClear .el-collapse-item__content{
    padding-left:14px; padding-bottom:0px;
}
.elementTabStyleClear  .el-collapse-item__header{
    height:38px;line-height:38px;
}
.elementTabStyleClear .el-collapse-item__arrow{
    line-height:38px;
}
.elementTabStyleClear .el-collapse-item__wrap{
    border:none;
}
</style>

