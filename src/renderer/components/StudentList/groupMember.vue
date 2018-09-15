<template>
    <div class="flex container flex_center" style="style">
        <div class="allStudentList grow1">
            <div class="asideBarTitle padding10">
            <el-input placeholder="输入关键字进行过滤" v-model.trim="filterText">
            </el-input>
            </div>
            <el-tree class="filter-tree" ref="tree2" :default-checked-keys="defaultSeleted" :data="studentList" show-checkbox node-key="accid" :props="defaultProps" :filter-node-method="filterNode">
                <div class="custom-tree-node flex flex_center " slot-scope="{ node, data }" >
                   <div  v-if="data.group_name" class="ellipsis" :title="data.group_name" >{{data.xyname}} <span v-if="data.students">({{data.students.length}})</span></div>
                   <template v-else>
                        <Avator :accid="data.accid" :name="data.xyname"/> 
                        <!-- <img :src="data.avator" class="userAvator" /> -->
                        <!-- <span> {{data.xyname}} </span> -->
                       
                   </template>
                </div>
            </el-tree>
        </div>
        <div class="transferBtn grow0">
            <i class="el-icon-d-arrow-right" @click="handleTransfer"></i>
        </div>
        <dl class="slectedStudent grow1">
            <dt class="padding10 seletedTitle">已选学员({{selected.length}})</dt>
            <dd class="flex flex_center padding10 studentItem justify_content" v-for="(item,index) in selected" :key="item.xyno">
                <Avator :accid="item.accid" :name="item.xyname" /> 
                
                <!-- <img :src="item.avator" class="userAvator" /> -->
                <!-- <span class="grow1"> {{item.xyname}} </span> -->
                <i class="el-icon-close closeBtn" @click="handleDelSeleted(index)" v-if="!item.isDefault"></i>
            </dd>
        </dl>
    </div>
</template>
<script>

import { mapGetters, mapMutations } from "vuex";
import Avator from '@/components/Avator';
export default {
    props: {
        currentNode:{
            default:()=>{
                return {}
            },
            type: Object
        },
        defaultSeletedAccid:Array
    },
    components:{
        Avator
    },
    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        },
        currentNode(){
            this.initSeleted()
        }
    },
    computed:{
       defaultSeleted(){
          if(!this.currentNode.students) return [];
          let arr= this.currentNode.students.map(item=>item.accid);
          arr.push(this.currentNode.id);
          return arr;
       },
       studentList(){
        //    let getStudentList=this.$store.getters.getStudentList;
           let data=JSON.parse(JSON.stringify(this.$store.getters.getStudentList));
           if(this.defaultSeletedAccid&&this.defaultSeletedAccid.length){
                data=data.map(item=>{
                   item.students=item.students.filter(item1=>{
                       return this.defaultSeletedAccid.indexOf(item1.accid)==-1
                   })
                   return item;
               })
               return data;
           }
           return data.map(item=>{
                if(item.id==this.currentNode.id){
                    item.isDefault=true;
                    item.students=item.students.map(student=>{
                        return{
                            ...student,
                            isDefault:true
                        }
                    })
                }
                return item;
            })
       }
    },
    data() {
        return {
            defaultProps: {
                children: "students",
                label: "xyname",
                disabled:"isDefault"
            },
            checkList: [],
            selected: this.initSeleted(),
            filterText: ""
        };
    },
    methods: {
        initSeleted(){
            if(!this.currentNode.students) return [];
            return this.currentNode.students.map(item=>{
                return {...item,isDefault:true}
            })
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.xyname.indexOf(value) !== -1;
        },
        handleTransfer() {
            let data=this.$refs.tree2.getCheckedNodes(true).filter(item=>{
                return !item.id
            });
            this.selected = data;
        },
        handleDelSeleted(index) {
            this.selected.splice(index, 1);
        },
    }

};
</script>
<style scoped>
.container{
    height: 400px;
}
/* .allStudentList {
    width: 320px;
    height: 400px;
    border: 1px solid #e5e5e5;
    overflow: auto;
} */
.allStudentList,.slectedStudent{
    height:100%;
    width: 50%;
    overflow: auto;
    border: 1px solid #e5e5e5;
    box-sizing: border-box;
}
/* .slectedStudent {
    width: 320px;
    height: 400px;
    overflow: auto;
    border: 1px solid #e5e5e5;
} */
.transferBtn {
    font-size: 28px;
    padding: 0 16px;
    color: #999;
    cursor: pointer;
}
.closeBtn {
    font-size: 18px;
    cursor: pointer;
    color: #999;
}
.closeBtn:hover {
    color: #ff6c60;
}
.studentItem:hover {
    background-color: #f0f3f5;
}
.custom-tree-node{padding:10px 0;}
.seletedTitle{color:#333;}
</style>
<style>

.allStudentList .el-tree-node__content{height: auto;}
</style>


