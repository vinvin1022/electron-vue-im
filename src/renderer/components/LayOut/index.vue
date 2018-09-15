<template>
  <div class="layoutCon" v-loading="!issyncdone">
    <div class="headerCon flex">
      <div class="personMessage grow0 flex flex_center" >
            <img :src="myInfo.avatar" class="userAvator grow0" />
            <span class="userName  ellipsis" :title="tearcherInfo.name">{{tearcherInfo.name}}</span>
            <div class="grow0">
                <el-dropdown trigger="click" @command="handleChangeState">
                <span class="lightColor pointer">
                    {{isLeave?'离开':nimStates[nimState]}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="line">在线</el-dropdown-item>
                    <el-dropdown-item command="unline">离线</el-dropdown-item>
                    <el-dropdown-item command="leave">离开</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
                <el-dialog
                    title="离开自动回复设置"
                    :visible.sync="dialogVisible"
                    width="500px"
                >
                    <el-input v-model="leaveMessage" auto-complete="off" type="textarea" :rows="3"></el-input>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitLeave">确 定</el-button>
                    </span>
                </el-dialog>
            </div> 
            
      </div>
      <div class="headerTitle grow1 ">
        <div class="layoutBtn" @click="handLayout">注销</div>
        <ul class="flex">
            <li v-for="(item,index) in iframeData" :key="index" @click="handleWbeBar(item)" :class="'headerItem '+ (tabkey==item.name?'active':'')" >{{item.name}}</li>
            
        </ul>
       </div>
    </div>
    <div class="wrap flex" v-if="issyncdone">
     <asideBar :handleIsShowWebPage="handleIsShowWebPage" />
      <div class="contentCon grow1" :class="{'hideChartView':isShowWebPage}">
          <div class="webPageContainer" v-if="isInitWebPage" v-show="isShowWebPage">
              <iframe :src="iframeSrc+userMessage" class="iframe"></iframe>
          </div>
          <div class="routerView">
              <router-view></router-view>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import {config } from '@/severConfig.js';
import asideBar from './asideBar';
import { mapGetters, mapMutations } from "vuex";
import {toMain,fromMain} from '@/renderProcess/createNewWindow';
import turnPage from '@/router/turnPage';
let webHost=config.webHost;
export default {
    data(){
        return {
            dialogVisible:false,
            isShowWebPage:false,
            isInitWebPage:false,
            iframeSrc:"",
            tabkey:"",
            iframeData:[
                {
                    name:"工作台",
                    url:`${webHost}workbench/index?`
                },
                {
                    name:"学员信息",
                    url:`${webHost}operation/student?`
                },
                 {
                    name:"学习管理",
                    url:`${webHost}operation/study?`
                },
                 {
                    name:"任务列表",
                    url:`${webHost}operation/taskList?`
                },
                 {
                    name:"工单",
                    url:`${webHost}workOrder/workOrderHome?`
                },
                {
                    name:"成绩导入",
                    url:`${webHost}operation/achievementTyping?`
                },
            ],
            nimStates:{
                line:'在线',
                unline:'离线',
                leave:'离开'
            },
            leaveMessage:""
        }
    },
    components:{asideBar},
    created(){
        this.initSDK();
        fromMain("line",(event,arg) =>{
            if(arg=='unline'){
                this.handLayout();
            }
		})
        // this.$store.dispatch("connect");
    },
    methods: {
        handLayout(){
            this.$store.dispatch('logOut')
        },
        handleChangeState(val){
            if(val=='unline'){
                this.$store.dispatch("disconnect");
                this.$store.dispatch("leaveSetting",{isLeave:false});
            }else if(val=='line'){
                this.$store.dispatch("relogin");
                this.$store.dispatch("leaveSetting",{isLeave:false});
            }else{
                this.dialogVisible=true;
            }
        },
        submitLeave(){
            if(!this.leaveMessage){
                  this.$message({
                        message: '请先设置自动回复消息',
                        type: 'warning'
                  });
                  return;
            }
            if(this.leaveMessage.length > 800){
                this.$message({
                    message: '请不要超过800个字',
                    type: 'warning'
                }); 
                return;
            }
            this.$store.dispatch("leaveSetting",{isLeave:true,message:this.leaveMessage});
            this.dialogVisible=false;
        },
        handleIsShowWebPage(val){
            this.isShowWebPage=val;
            this.tabkey='';
        },
        handleWbeBar(data){
            this.isInitWebPage=true;
            this.isShowWebPage=true;
            this.iframeSrc=data.url;
            this.tabkey=data.name;
            this.$store.dispatch('resetCurrSession', {
                type: 'destroy'
            });
        },
        initSDK() {
            // this.$store.dispatch("connect",{force:true});
        }
    },
    computed:{
        issyncdone(){
            return this.$store.state.issyncdone
        },
        isLeave(){
            return this.$store.state.isLeave
        },
        nimState:function(){
            return this.$store.state.nimState;
        },
        myInfo:function(){
            return this.$store.state.myInfo;
        },
        ...mapGetters({
            tearcherInfo: "getTearcherInfo"
        }),
        userMessage(){
            let time=Date.parse(new Date()),
                callPhone=localStorage.callPhone,
                deviceUrl=localStorage.deviceUrl
            return `channel=im&token=${btoa(this.tearcherInfo.acc_sys_token)}&exten=${this.tearcherInfo.seat_name}&device=${localStorage.fjh}&callPhone=${btoa(callPhone)}&deviceUrl=${btoa(deviceUrl)}&time=${time}`
        }
    }
};
</script>
<style scoped>
.aside,.contentCon,.layoutCon {
    position: relative;
    height: 100%;
} 
.webPageContainer{width: 100%;height: 100%;position: absolute;top:0;left:0;overflow: hidden;box-sizing: border-box;background: #fff;}
.webPageContainer .iframe{width:100%;height:100%;border:none;}
.headerItem{
     font-size:16px;
     margin-right:20px;
     cursor: pointer;
     color: #999999;
}
.headerItem.active{
   
    color:#4598ff;
    box-shadow:0px -2px 0px #4598ff inset;

}
.headerCon {
    height: 54px;
}
.personMessage{
    width: 240px;
    padding:0 16px;
    background: #ebeff2;
    box-sizing: border-box;
}

.wrap {
    background: #fafafa;
    height: calc(100% - 54px);
}
.personMessage {
    background: #ebeff2;
}

.headerTitle{
    background-color: #fafafa;
    padding:0 30px;
    line-height:54px;
    border-bottom:1px solid #eaeaea;
    box-sizing: border-box;
}
.userName{padding-right:14px;font-size:16px;}
.routerView{height: 100%;}
.layoutBtn{float: right;cursor: pointer;color: #666;font-size:15px;}
</style>
<style>
.hideChartView .routerView{
    display: none;
}
</style>


