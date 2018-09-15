<template>
  <ul>
    <li class="groupTitle asideTitle flex justify_content">
        <template  v-if="!isEdit">
            <span>群成员（{{membersInDisplay.length}}）</span>
            <p v-if="hasInvitePermission" class="grow0">
                <i class="el-icon-plus pointer" titie="添加群成员" @click.stop="addDiaClick"></i>
                <i class="el-icon-edit pointer" title="修改群名称" @click.stop="updataTeamMessage"></i>
                <i class="el-icon-delete pointer" titie="解散群" @click.stop="dismissTeam"></i>
            </p>
        </template>
      <template v-else>
          <el-input v-model="groupName" placeholder="请输入内容" size="small"></el-input> <el-button size="small" type="text" @click="subUpdataMessage">&nbsp;&nbsp;完成</el-button>
      </template>
      
    </li>
   <!--  <li>
        <el-input placeholder="搜索学员，支持模糊搜索" v-model="searchStudent" prefix-icon="el-icon-search" size="small" >
        </el-input>
    </li> -->
    <li class="flex flex_center  studentItem" v-for="item in membersInDisplay" :key="item.account">
      <img :src="item.avatar" class="userAvator" />
      <span class="grow1 ellipsis"> {{item.alias||item.account}} </span>
      <i v-if='item.type!="owner"&&hasInvitePermission' class="el-icon-close closeBtn" @click='remove($event, item)' title="移除"></i>
    </li>
    <li v-if="hasInvitePermission">
      <el-dialog title="添加群成员" :visible.sync="groupMemberDia" width="740px">
        <!-- <div class="asideBarTitle padding10 flex flex_center">
          <span class="grow0 ">群组名称：</span>
          <el-input placeholder="请输入群组名称" v-model="groupName"></el-input>
        </div> -->
        <groupMember ref="groupMember" v-if="groupMemberDia" :defaultSeletedAccid="defaultSeletedAccid"/>
        <span slot="footer" class="dialog-footer">
          <el-button @click="groupMemberDia = false">取 消</el-button>
          <el-button type="primary" @click="addMembers">创 建</el-button>
        </span>
      </el-dialog>
    </li>
  </ul>
</template>
<script>
import groupMember from "@/components/StudentList/groupMember";
import turnPage from '@/router/turnPage';
export default {
    props: {
        teamId: {
            type: String
        },
        // 是否为高级群
        advanced: {
            type: Boolean,
            default: true
        },
        // 显示全部群成员模式
        showAllMode: {
            type: Boolean,
            default: true
        },
        invalid:{
            type: Boolean,
            default: false
        },
        invalidHint: {
            type: String,
            default: "您无权限发送消息"
        }
    },
    components: { groupMember },
    data() {
        return {
            isEdit:false,
            removeMode: false,
            hasManagePermission: false,
            hasSearched: false,
            groupMemberDia: false,
            searchStudent:'',
            defaultSeletedAccid:[],
            groupName:''
        };
    },
    created() {
        // 防止在此页面直接刷新，此时需要获取群成员
        this.ishadGetTeamMembers();
    },
    watch:{
        teamId:function(){
             this.ishadGetTeamMembers();
             this.isEdit=false;
             this.groupName='';
             this.hasSearched=false;
        }
    },
    computed: {
        nimState:function(){
            return this.$store.state.nimState;
        },
        teamInfo() {
            var teamList = this.$store.state.teamlist;
            var team =
                teamList &&
                teamList.find(team => {
                    return team.teamId === this.teamId;
                });
            if (!team) {
                return undefined;
            }
            return team;
        },
        members() {
            var members = this.$store.state.teamMembers[this.teamId];
            var userInfos = this.$store.state.userInfos;
            var needSearchAccounts = [];
            if (members) {
                members = members.map(item => {
                    var member = Object.assign({}, item); //重新创建一个对象，用于存储展示数据，避免对vuex数据源的修改
                    member.valid = true; //被管理员移除后，标记为false
                    if (member.account === this.$store.state.userUID) {
                        member.alias = "我";
                        member.avatar = this.$store.state.myInfo.avatar;
                        this.isOwner = member.type === "owner";
                        this.hasManagePermission = member.type !== "normal";
                    } else if (userInfos[member.account] === undefined) {
                        needSearchAccounts.push(member.account);
                        member.avatar = member.avatar || this.avatar;
                        member.alias = member.nickInTeam || member.account;
                    } else {
                        member.avatar = userInfos[member.account].avatar;
                        member.alias = userInfos[member.account].nick;
                    }
                    return member;
                });
                if (needSearchAccounts.length > 0 && !this.hasSearched) {
                    this.hasSearched = true;
                    while (needSearchAccounts.length > 0) {
                        this.searchUsers(needSearchAccounts.splice(0, 150));
                    }
                }
                return members;
            }
            return [];
        },
        membersInDisplay() {
            if (this.advanced || this.showAllMode) {
                return this.members;
            } else {
                return this.members.slice(0, this.hasInvitePermission ? 3 : 4);
            }
        },
        hasInvitePermission() {
            return (
                this.advanced &&
                (this.hasManagePermission ||
                    (this.teamInfo && this.teamInfo.inviteMode === "all"))
            );
        }
    },
    methods: {
        subUpdataMessage(){
            
            if(this.groupName===''){
                this.isEdit=false;
                return;
            }else{
                this.$store.dispatch("delegateTeamFunction", {
                    functionName: "updateTeam",
                    options: {
                        name: this.groupName,
                        teamId: this.teamId,
                        done: (error, obj) => {
                            if (error) {
                                this.$message({
                                    message: '更新失败',
                                    type: 'error'
                                });
                                return;
                            }
                            if(!error) {
                                this.groupName='';
                                this.isEdit=false;
                            }
                        }
                    }
                });
                this.isEdit=false;
            }
        },
        updataTeamMessage(){
            this.isEdit=true;
        },
        addDiaClick(){
            if(this.nimState!='line'){
                this.$message({
                    message: '当前处于离线状态不能进行操作',
                    type: 'warning'
                });
                return;
            }
            if (this.invalid) {
                turnPage(this.invalidHint);
                return;
            }
            this.groupMemberDia = true;
            this.defaultSeletedAccid=this.members.map(item=>{
                return item.account;
            })
        },
        ishadGetTeamMembers(){
            let teamMembers = this.$store.state.teamMembers[this.teamId];
            if (teamMembers === undefined) {
                this.$store.dispatch("getTeamMembers", this.teamId);
            }
        },
        addMembers() {
            let accounts =this.$refs.groupMember.selected.map((item)=>{
                return item.accid
            });
            this.$store.dispatch("delegateTeamFunction", {
                functionName: "addTeamMembers",
                options: {
                    teamId: this.teamId,
                    accounts: accounts,
                    done: (error, obj) => {
                        if (error) {
                            this.$message({
                                message: '添加失败',
                                type: 'error'
                            });
                            return;
                        }
                        if(!error) {
                          this.groupMemberDia=false;
                        }
                    }
                }
            });
        },
        dismissTeam() {
            if(this.nimState!='line'){
                this.$message({
                    message: '当前处于离线状态不能进行操作',
                    type: 'warning'
                });
                return;
            }
            if (this.invalid) {
                turnPage(this.invalidHint);
                return;
            }
            this.$confirm(`确定要解散该群吗？`, 
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch("delegateTeamFunction", {
                    functionName: "dismissTeam",
                    options: {
                        teamId: this.teamId,
                        done: (error, obj) => {
                            
                        }
                    }
                });
            })
            
        },
        searchUsers(Accounts) {
            this.$store.dispatch("searchUsers", {
                accounts: Accounts,
                done: users => {
                    this.updateTeamMember(users);
                }
            });
        },
        updateTeamMember(users) {
            users.forEach(user => {
                var member = this.members.find(member => {
                    return member.account === user.account;
                });
                if (member) {
                    member.avatar = user.avatar;
                    member.alias = member.nickInTeam || user.nick;
                }
            });
        },
        triggerRemove(e, show) {
            this.removeMode = !this.removeMode;
        },
        remove(e, member) {
            if(this.nimState!='line'){
                this.$message({
                    message: '当前处于离线状态不能进行操作',
                    type: 'warning'
                });
                return;
            }
            if (this.invalid) {
                turnPage(this.invalidHint);
                return;
            }
            this.$store.dispatch("showLoading");
            this.$store.dispatch("delegateTeamFunction", {
                functionName: "removeTeamMembers",
                options: {
                    teamId: this.teamId,
                    accounts: [member.account],
                    done: (error, obj) => {
                        if (error) {
                            this.$message({
                                message: '移除失败',
                                type: 'error'
                            });
                            return;
                        }
                        
                    }
                }
            });
            //   e.cancelBubble = true
            //   e.preventDefault()
        },
        onMemberClick(member) {
            location.href = this.advanced
                ? `#/teammembercard/${member.id}`
                : `#/namecard/${member.account}`;
        }
    }
};
</script>
<style scoped>
.studentItem{
    padding:6px 10px ;
}
.studentItem:hover {
    background-color: #f0f3f5;
    
}
.closeBtn{display: none;}
.studentItem:hover .closeBtn{
    display: inline-block
}
.userAvator{
    width:26px;height: 26px;
}
.groupTitle i {
    font-size: 18px;
    color: #5aa2fa;
}

</style>


