<template>
  <div>
      <detailItem v-for="(item,index) in callIds" :key="index"  :callId="item" />
           
  </div>
</template>
<script>
    import baseCall from "./call.js";
    import detailItem from "./detailItem";
    export default{
        components:{detailItem},
        props:{
            callId:{
                default:"",
                type:String,
            }
        },
        computed:{
            callIds:function(){
                if(this.callId){
                     return this.callId.split(',');
                }else{
                     return [];
                }
            }
        }
       
    }
</script>


