<template>
   <el-dialog title="人员信息" :visible.sync="visible" width="800px">
       <noData  v-show="!data||!data.length" />
      <informationItem  v-for="(item,index) in data" :key="index" :data="item" />
  </el-dialog>
</template>
<script>
import informationItem from './informationItem';
// import {fetchData2} from "@/service/service";
import noData from '@/components/noData'
export default{
    components:{informationItem,noData},
    props:{
        orderItemId:Number|String,
        url:{
            type:Object,
            default:()=>{
                return {
                    service:"campus",
                    url:"post_campus_queryUserListByUserIds"
                };
            }
        }
    },
    data(){
        return {
            data: [],
            visible:false
        }
    },
    created(){
        // if(this.orderItemId){
            this.getData();
        // }
    },
    watch:{
        orderItemId:function(){
            if(this.orderItemId){
                this.getData();
            }
        }
    },
    methods:{
        changeVisible(val) {
            this.visible = val;
        },
        getData(){
            if(!this.orderItemId){
                this.data=[];
                return;
            }
            this.$http("queryUserListByUserIds", {
                data: { "orderItemId":this.orderItemId }
            }).then(result => {
                this.data=result.data||[];
            }).catch(()=>{
                this.data=[];
            })
        }
    },
    watch:{
        orderItemId:function(){
             this.getData();
        }
    }

}
</script>
