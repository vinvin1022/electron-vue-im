<template>
    <div>
        <p class="flex justify_content">
            <span>发送时间：{{data.pushtime}}</span>
            <span>状态：{{data.code==200?'已发送':'发送中'}}</span>
        </p>
        <p>消息详情:</p>
         <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="data.content" :readonly="status=='detail'">
        </el-input>
        <!-- <p class="content lightColor">{{data.content}}</p> -->
        <el-tabs   v-model="activeName" v-if="status=='detail'">
            <el-tab-pane :label="`发送人数（${data.total}）`" name="first">
                 <p class="users">
                    <span class="ellipsis" :title="item.name" v-for="(item,index) in data.pushlist" :key="index">{{item.name}}</span>
                </p>
            </el-tab-pane>
            <el-tab-pane :label="`发送成功（${data.success_total}）`" name="second" >
                <p class="users">
                    <span class="ellipsis" :title="item.name" v-for="(item,index) in data.pushlist" :key="index">{{item.name}}</span>
                </p>
            </el-tab-pane>
            <el-tab-pane :label="'发送失败（'+data.error_total+'）'" name="third" >
                <p class="users">
                    <span class="ellipsis" :title="item.name" v-for="(item,index) in (data.fail||[])" :key="index">{{item.name}}</span>
                </p>
            </el-tab-pane>
        </el-tabs>
        <template v-else>
            <p>发送学员:</p>
            <p class="users" >
                <span class="ellipsis" :title="item.name" v-for="(item,index) in data.pushlist" :key="index">{{item.name}} <i class="el-icon-close " @click="handleRemove(index)"></i></span>
            </p>
        </template>
       
    </div>
</template>
<script>
    export default{
        props:{
            data:Object,
            status:String
        },
        data(){
            return{
                activeName:"first"
            }
        },
        methods:{
            handleRemove(index){
                this.$emit('removeStudent',index)
            }
        },
    }
</script>
<style scoped>
p{padding:6px;}
.content{
    height: 100px;
    overflow: auto;
    box-sizing: border-box;
    border:1px solid #e5e5e5;
    border-radius: 2px; 
}
.users{
    max-height: 200px;
    overflow: auto;
    padding:10px 0;
    display: flex;
    flex-wrap: wrap;
}
.users span{
    width:120px;
    padding: 4px 10px;
    position: relative;
}
.sendBar span{
    display: inline-block;
    padding:10px 0; 
    vertical-align: middle;
    margin-right: 10px;
   
}
.sendBar{
    border-bottom: solid 1px #e5e5e5;
}
.active{
    color:#4598ff;
    box-shadow:0px 2px 0px #4598ff ;
}
.users .el-icon-close{
    position: absolute;
    right: 0;
    display: none;
    top: 6px;
    cursor: pointer;
}   
.users span:hover .el-icon-close{
    display: inline-block;
    color: #ff6c60;
}
</style>

