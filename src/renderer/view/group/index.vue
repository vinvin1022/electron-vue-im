<template>
<div>
 <ul class="sessionList">
      <li 
        class="sessionListItem flex flex_center"
        v-for="(session) in teamList"
        :class="{'active':sessionId===session.teamId}"
        :key="session.teamId"
        @click="enterChat(session)"
      >
            <!-- <el-badge :value="session.unread" :max="99" class="item" :hidden="session.unread==0"> -->
            <!-- <i class="iconfont">&#xe606;</i> -->
            <img :src="session.avatar||defaultGroupIcon" class="userAvator" />

            <span class="name grow1 ellipsis" >{{session.name}}</span>
            <!-- </el-badge> -->
            <!-- <div class="content grow1">
                <p class="name flex justify_content ">
                    <span class="grow1 ellipsis" >{{session.name}}</span>
                    <span class="grow0 lightColor smallText">{{session.updateTimeShow}}</span>
                </p>
                <p class="ellipsis lightColor lastMessage">{{session.lastMsgShow}}</p>
            </div> -->
      </li>
      <li class="addGroup"><i class="el-icon-circle-plus" @click="handleAddClick"></i></li>
  </ul>
   <el-dialog
        title="创建群"
        :visible.sync="groupMemberDia"
        width="740px"
    >
        <div class="asideBarTitle padding10 flex flex_center">
            <span class="grow0 ">群组名称：</span>
            <el-input placeholder="请输入群组名称" v-model="groupName"></el-input>
        </div>
        <groupMember  ref="groupMember"  v-if="groupMemberDia"  />
        <span slot="footer" class="dialog-footer">
            <el-button @click="groupMemberDia = false">取 消</el-button>
            <el-button type="primary" @click="onActionClick('menu2')" :loading="loading">创 建</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import groupMember from '@/components/StudentList/groupMember';
import config from '@/configs/index';
export default {
  components:{groupMember},
  data () {
    return {
      sessionId:"",
      teamType: 'advanced', // normal or advanced
      groupMemberDia:false,
      groupName:"新建群",
      loading:false,
      defaultGroupIcon:config.defaultGroupIcon
    }
  },
  computed: {
    nimState:function(){
        return this.$store.state.nimState;
    },
    teamList: function () {
      return this.$store.state.teamlist && this.$store.state.teamlist.filter(team => {
        return team.type === this.teamType && team.validToCurrentUser
      })
    },
  },
  methods:{
      handleAddClick(){
           if(this.nimState!='line'){
                this.$message({
                    message: '当前处于离线状态不能进行操作',
                    type: 'warning'
                });
                return;
            }
            this.groupMemberDia = true
      },
     enterChat(session){
      if (session && session.teamId)
        this.sessionId=session.teamId;
        this.$emit("handleIsShowWebPage",false)
        this.$router.push(`/chat/team-${session.teamId}`);
      },
    onActionClick(key) {
       
      let type, name, accounts =this.$refs.groupMember.selected.map((item)=>{
                return item.accid
            });

      if(!accounts.length){
          this.$message({
              message: '请选择群成员',
              type: 'warning'
          });
          return;
      }
      if(!this.groupName){
          this.$message({
              message: '请设置群名称',
              type: 'warning'
          });
          return;
      }
      switch(key) {
        case "menu1":
          type = 'normal'
          name = '讨论组'
          break
        case "menu2":
          type = 'advanced'  
          name = '新建群'
        break
        default:
          // cancle
          return
      }
      this.loading=true;
    //   this.$store.dispatch('showLoading')
      this.$store.dispatch('delegateTeamFunction',{
        functionName: 'createTeam', 
        options: {
          type: type,
          name: this.groupName,
          avatar: 'http://static.sxmaps.com/icon/group.png',
          accounts: accounts,
          joinMode: 'noVerify', //群加入方式
          beInviteMode: 'noVerify',//群被邀请模式
          inviteMode: 'manager',//群邀请模式
          updateTeamMode: 'manager',//群信息修改权限
          updateCustomMode: 'manager',//群信息自定义字段修改权限
          done: (error, obj)=>{
            this.loading=false;
            if (error) {
                this.$message({
                    message: error.message||'创建失败',
                    type: 'error'
                });
                return;
            }
            if(!error) {
               this.groupMemberDia=false;
            }
          }
        }
      })
    },
     handleChangeStuGroup(){
            this.isLoading=true;
            let students=this.$refs.groupMember.selected.map((item)=>{
                return {
                    user_id:item.xyno,
                    xy_no:item.xyno,
                    type:"1"
                }
            });
            let data={
                groupId: this.currentNode.id,
                teacherId: this.tearcherInfo.id,
                students:students
            }
            this.$http("changeStuGroup", {
                data: data
            })
            .then(res => {
                this.fetchStudentList();
                this.groupMemberDia = false;
            })
            .catch(err => {
                this.isLoading=false
            });
        },
  }
}
</script>

<style scoped>
.sessionListItem{padding:0 10px;}
.iconfont{font-size:20px;width:40px;margin-right:14px;height: 40px;text-align: center;line-height: 40px;background: #5aa2fa;color: #fff;border-radius: 50%;}
.name{font-size:16px;padding:16px 10px 16px 0;}
.active{background: #e1e5e8;}
.addGroup{position: absolute;bottom:10px;right: 10px;color:#4598ff;font-size:30px;}
</style>

