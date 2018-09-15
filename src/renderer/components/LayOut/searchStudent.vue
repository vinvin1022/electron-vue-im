<template>
   <div class="asideBarTitle" >
        <el-input   placeholder="搜索学员，支持模糊搜索" 
                    v-model.trim="searchKey" 
                    @keyup.native="filterStudent($event)" 
                    prefix-icon="el-icon-search" 
                    size="medium" 
                    @blur="handleBlur" 
                    @focus="handleFocus">
        </el-input>
        <transition name="modal">
            <ul class="searchStudent"  v-show="isShowList">
                <li v-for="item in searchStudentList" :key="item.accid" class="flex flex_center padding10" @click="enterChart(item)">
                    <Avator :accid="item.accid" :name="item.xyname" />
                    <!--  <img :src="item.avator" class="userAvator" />
                    <span> {{item.xyname}} </span> -->
                </li>
            </ul>
        </transition>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import Avator from '@/components/Avator';
import { clearTimeout } from 'timers';
export default{
    components:{
        Avator
    },
    data(){
        return {
            searchKey:"",
            searchStudentList:[],
            isShowList:false,
            timer:null,
            searchTimer:null,
            modalShow:false
        }
    },
    computed:{
        ...mapGetters({
            studentList: "getStudentList"
        }),
        filterStudentList: function () {//获取所有学生返回新数组
          return Array.prototype.concat.apply([], this.studentList.map(item => {
                    if (item.students&&item.students.length>0) {
                        item = item.students
                    }
                    return item
                }))
        },
    },
    methods:{
        enterChart(student){
            if (student && student.accid){
                this.sessionId=student.accid;
                this.$emit("handleIsShowWebPage",false)
                this.$router.push(`/chat/p2p-${student.accid}`);
            }
        },
        handleBlur(){
           clearTimeout(this.timer);
           this.timer = setTimeout(() => {
               this.isShowList=false;
           }, 300);
        },
        handleFocus(){
           clearTimeout(this.timer);
           this.timer = setTimeout(() => {
               this.isShowList=true;
           }, 300);
        },
        filterStudent(event){
            // 用户快速输入不触发搜索
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(()=>{
                // 返回搜索结果
                if (event.target.value) {
                    this.searchStudentList = this.filterStudentList.filter(item => item.xyname.indexOf(event.target.value) > -1)
                } else {
                    this.searchStudentList=[]
                }
            }, 300);
        }
    },
    // watch:{
    //     searchKey:function(newValue,oldValue){
    //         if(newValue===''){
    //             this.searchStudentList=[]
    //         }else{
    //             let arr=[];
    //             this.studentList.map(item=>{
    //                 item.students&&item.students.map(item=>{
    //                     if(item.xyname&&item.xyname.indexOf(newValue)>-1){
    //                         arr.push(item);
    //                     }
    //                 })
    //             })
    //             this.searchStudentList=arr;
    //         }
    //     }
    // }
}
</script>
<style scoped>
.asideBarTitle{
  padding:0 14px;
  height:48px;
  line-height: 48px;
  box-sizing: border-box;
  position: relative;
}
.searchStudent{
    position: absolute;
    top:48px;
    left:0;
    background: #fff;
    z-index: 999;
    width:100%;
    max-height: 300px;
    overflow: auto;
}
.leave{display: none;}
.modal-enter {
  opacity: 0.1;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

