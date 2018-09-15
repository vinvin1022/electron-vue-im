<template>
<div class="groupSend" v-loading="loading">
    <div class="title">群发消息</div>
    <div class="choiceStudent">
        <groupMember ref="groupMember" style="height:100%" :key="counter" />
    </div>
    <div class="contents ">
        <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="contents">
        </el-input>
        <div class="btns">
            <el-button type="primary" size="medium" @click="submitForm">发送</el-button>
            <el-button size="medium" @click="resetForm">重置</el-button>
        </div>
    </div>
</div>
</template>
<script>
import groupMember from '@/components/StudentList/groupMember';
import { mapGetters, mapMutations } from "vuex";
    export default{
        data(){
            return {
                contents:"",
                counter:1,
                loading:false
            }
        },
        components:{
            groupMember
        },
        methods:{
            submitForm(){
                if(!this.contents){
                    this.$message({
                        message: '请输入群发信息',
                        type: 'warning'
                    });
                    return;
                }
                let accounts =this.$refs.groupMember.selected.map((item)=>{
                    return {accid:item.accid,id:item.userid}
                });
                if(!accounts.length){
                    this.$message({
                        message: '请选择群发人员',
                        type: 'warning'
                    });
                    return;
                }
                if(this.contents.length>800){
                    this.$message({
                        message: '请不要超过800个字',
                        type: 'warning'
                    });
                    return;
                }
                if(accounts.length>500){
                    this.$message({
                        message: '最多发送500人',
                        type: 'warning'
                    });
                    return;
                }
                let data={
                    "contents": this.contents,
                    "ctid": this.tearcherInfo.id,
                    "from": this.tearcherInfo.accid,
                    to:accounts
                }
                this.loading=true;
                this.$http("sendGroupMessage", {
                    data: data 
                })
                .then(res => {
                    this.$message({
                        message: '发送成功',
                        type: 'success'
                    });
                    this.loading=false;
                    this.resetForm();
                    this.$store.commit('setRefreshGroupSend')
                })
                .catch(err => {
                    this.loading=false;
                });
            },
            resetForm(){
                this.counter++;
                this.contents='';
            }
        },
        computed:{
            ...mapGetters({
                tearcherInfo: "getTearcherInfo"
            }),
        }
    }
</script>
<style scoped>
.groupSend{
    height: 100%;
    background: #fff;
}
.groupSend .title{
    height: 40px;
    line-height:40px;
    border-bottom:1px solid #e5e5e5;
    padding:0 20px;
    box-sizing: border-box;
    font-size: 18px;
}
.btns{text-align: center;padding-top:20px;}
.contents{padding:0 20px;}
.choiceStudent{
     height: calc(100% - 220px);
     box-sizing: border-box;
     padding:20px;
}
</style>

