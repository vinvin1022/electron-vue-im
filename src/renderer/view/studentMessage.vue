<template>
    <div class="studentsDetail" >
        <div class="flex">
            <span class="item-title grow0 lightColor">姓名：</span>
            <div class="item-val grow1">{{studentDetail.name}} &nbsp;&nbsp;<span class="blue_color" @click="informationClick">隶属信息</span></div>
        </div>
         <div class="flex">
            <span class="item-title grow0 lightColor">项目：</span>
            <div class="item-val grow1">学历</div>
        </div>
         <div class="flex">
            <span class="item-title grow0 lightColor">级别：</span>
            <div class="item-val grow1">{{studentDetail.level}}</div>
        </div>
         <div class="flex">
            <span class="item-title grow0 lightColor">学校：</span>
            <div class="item-val grow1">{{studentDetail.teacher}}</div>
        </div>
         <div class="flex">
            <span class="item-title grow0 lightColor">专业：</span>
            <div class="item-val grow1">{{studentDetail.family}}</div>
        </div>
         <div class="flex">
            <span class="item-title grow0 lightColor">班型：</span>
            <div class="item-val grow1">{{studentDetail.class_type}}</div>
        </div>
        <div class="flex">
            <span class="item-title grow0 lightColor">状态：</span>
            <div class="item-val grow1">{{studentDetail.status}}</div>
        </div>
        <div class="flex">
            <span class="item-title grow0 lightColor">证件号码:</span>
            <div class="item-val grow1">{{studentDetail.card_id}}</div>
        </div>
        <div class="flex">
            <span class="item-title grow0 lightColor">报名时间:</span>
            <div class="item-val grow1">{{studentDetail.bm_time}}</div>
        </div>
        <div class="flex">
            <span class="item-title grow0 lightColor">分组：</span>
            <div class="item-val grow1">{{studentDetail.groupName}}</div>
        </div>
        <subordinationInformation  ref="information" :orderItemId="orderItemId" />
    </div>
</template>
<script>
import subordinationInformation from '@/components/subordinationInformation/index';
    export default{
        props:{
            studentDetail:{
                type:Object,
                default:()=>{
                    return {}
                }
            }
        },
        data(){
            return {
                orderItemId:""
            }
        },
        components:{subordinationInformation},
        methods:{
             // 隶属信息
            informationClick(){
                this.orderItemId=this.studentDetail.itemOrderId;
                this.$refs.information.changeVisible(true);
            },
        }

    }
</script>
<style scoped>
.item-title{
    width:60px;
}
.item-val{
    word-break: break-all;
}
.studentsDetail{font-size:12px;line-height:20px;margin-bottom:20px;}
</style>

