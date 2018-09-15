<template>
    <div class="studentList" v-loading="isLoading">

        <el-collapse v-model="activeName" accordion v-if="initShow">
            <el-collapse-item v-for="item in studentList" :key="item.id"  :name="item.id">
                <template slot="title"><p @contextmenu.prevent="treeMenuClick(item,'group')" class="ellipsis" :title="item.group_name">{{item.group_name}}({{item.students?item.students.length:0}})</p></template>
                <ul>
                    <li v-for="(student,index) in item.students" :key="index" @contextmenu.prevent="treeMenuClick(student,'student')" class="flex flex_center padding10" :class="{'active':sessionId===student.accid}" @click="enterChart(student)">
                        <!-- <img :src="student.avator" class="userAvator" /> -->
                        <Avator :accid="student.accid" :name="student.xyname" />
                        <!-- <span> {{student.xyname}} </span> -->
                    </li>
                </ul>
            </el-collapse-item>
        </el-collapse>

        <ul v-show="isShowTreeMenu" class="showTreeMenu el-dropdown-menu el-popper "  :style="style">
            <template v-if="rightType=='student'">
                <li class="el-dropdown-menu__item rightTitle" >转移分组到：</li>
                <li class="el-dropdown-menu__item" 
                     v-for="(item,index) in studentList"
                    :key="index"
                     @click="oneStudentChange(item.id)" 
                    >{{item.group_name}}</li>
            </template>
            <template v-else> 
                <li class="el-dropdown-menu__item" @click="openDialog('dialogVisible','添加分组')">添加分组</li>
                <li class="el-dropdown-menu__item" @click="renameGropOpen(currentNode.group_name)">分组重命名</li>
                <li class="el-dropdown-menu__item" @click="openDialog('groupMemberDia','分组成员管理')">分组成员管理</li>
                <li class="el-dropdown-menu__item" @click="delDialog">删除分组</li>
            </template>
        </ul>

        <el-dialog
            :title="type"
            :visible.sync="dialogVisible"
            width="400px"
            >
            <el-input placeholder="请输入内容" v-model.trim="currentName">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="分组成员管理"
            :visible.sync="groupMemberDia"
            width="740px"
        >
            <groupMember :studentList="studentList" ref="groupMember" :currentNode="currentNode" v-if="groupMemberDia" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="groupMemberDia = false">取 消</el-button>
                <el-button type="primary" @click="handleChangeStuGroup">确 定</el-button>
            </span>
        </el-dialog>
         <div class="refreshBtn pointer" title="刷新"><i class="el-icon-refresh" @click="fetchStudentList"></i></div>
    </div>
</template>
<script>

import { mapGetters, mapMutations } from "vuex";
// import helper from '../../utils/helper.js'
import groupMember from './groupMember';
import Avator from '@/components/Avator';
export default {
    components:{groupMember,Avator},
    props:{
        initShow:Boolean,
    },
    data() {
        return {
            studentList:[],//学员列表
            activeName: '',//当前展开组名
            currentNode:{},//当前节点
            isShowTreeMenu:false,
            style:{},
            dialogVisible:false,
            groupMemberDia:false,
            currentName:'',
            type:"",
            isLoading:false,
            sessionId:'',
            rightType:''
        };
    },
    created() {
        this.fetchStudentList();
    },
    computed: {
        ...mapGetters({
            tearcherInfo: "getTearcherInfo"
        }),
        userInfos () {
            return this.$store.state.userInfos
        }, 
    },
    methods: {
        enterChart(student){
            if (student && student.accid){
                this.sessionId=student.accid;
                this.$emit("handleIsShowWebPage",false)
                this.$router.push(`/chat/p2p-${student.accid}`);
            }
            
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
            this.fetchChangeGroup(data);
        },
        oneStudentChange(groupId){
            let data={
                groupId: groupId,
                teacherId: this.tearcherInfo.id,
                students:[{
                    user_id:this.currentNode.xyno,
                    xy_no:this.currentNode.xyno,
                    type:"1"
                }]
            }
            this.fetchChangeGroup(data);
        },
        fetchChangeGroup(data){
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
        handleSubmit(){
            this.dialogVisible=false;
            if(!this.currentName){
                this.$message({
                    message: '请输入内容',
                    type: 'warning'
                });
                return;
            }
           if(this.type=="添加分组"){
               this.addGrop();
           }else if(this.type=="分组重命名"){
               this.renameGrop();
           }
        },
        addGrop(){
            this.isLoading=true;
            this.$http("addStuGroup", {
                data: { adid: this.tearcherInfo.id, groupName: this.currentName } 
            })
            .then(res => {
                this.fetchStudentList();
            })
            .catch(err => {
                this.isLoading=false
            });
        },
        delDialog(){
            if( this.currentNode.group_type=="default"){
                this.$message({
                    message: '默认分组不能删除',
                    type: 'warning'
                });
                return;
            }
            this.$confirm(`确定要删除 '${ this.currentNode.group_name }' 分组吗？删除之后所有学员将添加到默认分组中。`, 
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delGrop();
            })
        },
        delGrop(){
            this.isLoading=true;
            this.$http("delStuGroup", {
                data: { groupId: this.currentNode.id, teacherId: this.tearcherInfo.id }  
            })
            .then(res => {
                this.fetchStudentList();
            })
            .catch(err => {
                this.isLoading=false
            });
        },
        renameGropOpen(group_name){
            if( this.currentNode.group_type=="default"){
                this.$message({
                    message: '默认分组不能修改',
                    type: 'warning'
                });
                return;
            }
            this.openDialog('dialogVisible','分组重命名',group_name)
        },
        renameGrop(){
            this.isLoading=true;
            this.$http("renameGroup", {
                data: {
                    groupId: this.currentNode.id, 
                    newGroupName: this.currentName, 
                    teacherId: this.tearcherInfo.id
                }
            })
            .then(res => {
                this.fetchStudentList();
            })
            .catch(err => {
                this.isLoading=false
            });
        },
        openDialog(visible,type,currentName){
            this[visible]=true;
            this.type=type;
            this.currentName=currentName||'';
        },
        treeMenuClick(data,type){
            this.rightType=type;
            this.currentNode=data;
            this.isShowTreeMenu=true;
            let  y =event.clientY+ 8,
                 x =event.clientX+ 6,
                 key='top',
                 docH=document.body.clientHeight;

            if(y>2*docH/3){
               y=y-190;
            }
            this.style={top:y+'px', left:x+'px'};
            document.body.addEventListener("mouseup", this.onBodyMouseDown);
        },
        onBodyMouseDown (event) {
            if( this.isShowTreeMenu){
                this.isShowTreeMenu=false;
            }
            document.body.removeEventListener("mouseup", this.onBodyMouseDown);
        },
        searchUsers(accids){
            this.$store.dispatch('searchUsers', {
                    accounts: accids
            })
        },
        fetchStudentList() {
            this.isLoading=true;
            this.$http("getGroupStuInfo", {
                data: { adid: this.tearcherInfo.id }
            })
            .then(res => {
                // 生成测试数据
                // const array = [];
                // for (let index = 0; index < 1000; index++) {
                // const student = {
                //             accid:helper.genRandom(31).toString(),
                //             add:'',
                //             falseavator:"",
                //             ctid:120,
                //             selected:'',
                //             falsetoken:helper.genRandom(31).toString(),
                //             userid:"10118071154045",
                //             xyname:helper.genRandom(10).toString(),
                //             xyno:"10118071154045",
                //             xyphone:"13590107645"
                //     }
                //     array.push(student)
                // }
                // res.data[0].students=array
                this.studentList=res.data||[];
                this.isLoading=false;
                let accids=[],
                userInfos=this.userInfos;
                let list=this.studentList.map(item=>{
                    item.students.map(item1=>{
                        if(userInfos[item1.accid]){

                        }else{
                            accids.push(item1.accid);
                        }
                        
                    })
                    return {...item,userid:item.id,accid:item.id,xyname:item.group_name}
                });
                this.$store.commit("setStudentList",list);
                if(accids.length>0){
                    while (accids.length > 0) {
                        this.searchUsers(accids.splice(0, 150));
                    }
                }
            })
            .catch(err => {this.isLoading=false;});
        },

    }
};
</script>
<style scoped>
.active{background: #e1e5e8;}
.rightTitle{
    background: #ecf5ff;
}
</style>

<style>

.studentList  .el-collapse-item__header{padding:0 10px; }

</style>