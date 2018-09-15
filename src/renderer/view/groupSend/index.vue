<template>
    <ul v-loading="loading" ref="groupLog" @scroll="handleScroll">
        <li v-for="item in list" :key="item.id" class="groupItem" >
            <div class="flex justify_content">
                <span>{{item.pushtime}}</span>
                <span v-if="item.code==200">已发送</span>
                <span v-else class="red_color">发送中</span>
            </div>
            <div class="content" v-html="item. content"></div>
            <div>发送人数： {{item.total}}/<span class="lightColor">{{item.success_total}}</span></div>
            <div class="btns">
                <el-button size="small"  @click="handleDetail(item)">详情</el-button>
                <el-button size="small" @click="handleResend(item,'loading')">重发</el-button>
             </div>
        </li>
        <li>
            <el-dialog
            title="群发详情"
            :visible.sync="dialogVisible"
            width="650px"
            >
            <groupDetail :data="currenNode" :status="status" @removeStudent="removeStudent"/>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="medium" @click="handleResend()" v-if="status=='detail'" >重 发</el-button>
                <el-button type="primary" size="medium" @click="handleSend(currenNode,'resendLoading')" :loading="resendLoading" v-else>发 送</el-button>
                <el-button size="medium" @click="dialogVisible = false">关 闭</el-button>
            </span>
            </el-dialog>
        </li>
         <li class="refreshBtn pointer" title="刷新"><i class="el-icon-refresh" @click="handleRefreshGroupSend"></i></li>
    </ul>
</template>
<script>
import groupDetail from './groupDetail';
import { mapGetters, mapMutations } from "vuex";
    export default{
        components:{groupDetail},
        data(){
            return {
                data:[],
                pageSize:8,
                pageNo:1,
                list:[],
                loading:false,
                hasMore:true,
                dialogVisible:false,
                currenNode:{},
                resendLoading:false,
                status:'detail'
            }
        },
        created(){
            this.fetchDataList();
        },
        computed: {
            ...mapGetters({
                tearcherInfo: "getTearcherInfo",
                refreshGroupSend:'getRefreshGroupSend'
            })
        },
        methods:{
            removeStudent(index){
                if(this.currenNode.pushlist){
                    this.currenNode.pushlist.splice(index,1);
                }
                
            },
            handleRefreshGroupSend(){
                this.$store.commit('setRefreshGroupSend')
            },
            handleDetail(item){
                this.dialogVisible=true;
                this.status='detail';
                this.currenNode=JSON.parse(JSON.stringify(item))||{};
            },
            handleResend(item){
                this.dialogVisible=true;
                this.status='resend';
                if(item){
                     this.currenNode=JSON.parse(JSON.stringify(item))||{};
                }
            },
            handleSend(item,loadKey){
                let data={
                    "contents": item.content,
                    "ctid": this.tearcherInfo.id,
                    "from": this.tearcherInfo.accid,
                    to:item.pushlist
                }
                this[loadKey]=true;
                this.$http("sendGroupMessage", {
                    data: data 
                })
                .then(res => {
                    this.$message({
                        message: '发送成功',
                        type: 'success'
                    });
                    this.$store.commit('setRefreshGroupSend')
                     this[loadKey]=false;
                })
                .catch(err => {
                    this.isLoading=false
                     this[loadKey]=false;
                });
            },
            handleScroll(e){
                let el=e.target;
                if( el.scrollHeight-el.scrollTop-el.clientHeight===0){
                    this.fetchDataList();
                }
                
            },
            fetchDataList(){
                if(!this.hasMore) return;
                this.loading=true;
                this.$http("groupLog", {
                    data: {
                        page_no:this.pageNo,
                        page_size:this.pageSize,
                        ctid:this.tearcherInfo.id
                    }
                })
                .then(res => {
                    this.loading=false;
                    if(res.data.lastPage==this.pageNo) {
                        this.hasMore=false;
                    }
                    if(res.data.list){
                        
                        let len=res.data.list.length;
                        if(len){
                            if(this.pageNo===1){
                                this.list=res.data.list||[];
                            }else{
                                this.list=[...this.list,...res.data.list];
                            }
                        }  
                    }
                    this.pageNo++;
                    
                })
                .catch((err)=>{
                    this.loading=false;
                })
            }
        },
        watch:{
            refreshGroupSend(){
                this.pageNo=1;
                this.hasMore=true;
                this.fetchDataList();
            }
        }
    }
</script>
<style scoped>
ul{padding:10px 10px 0;width: 100%;font-size: 12px;line-height:16px;overflow: auto;}
.groupItem{margin-bottom: 10px;background:#fff;padding:10px; }
.content{
    color: #666;
    word-break: break-all;
    padding:8px 0;
}
.btns{padding-top:8px;}
</style>

