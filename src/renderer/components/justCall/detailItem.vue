<template>
  <div>
        <span  v-if="!this.url" class="blue_color pointer" @click="getRecordAddress">点击查看</span>
        <audio controls v-if="this.url" class="audioDetail">
                <source :src="this.url" type="audio/ogg">
                <source :src="this.url" type="audio/mpeg">
                <source :src="this.url" type="audio/wav">
                您的浏览器不支持音频播放
        </audio>
  </div>
</template>
<script>
    import baseCall from "./call.js";
    export default{
        props:{
            callId:{
                default:"",
                type:String,
            }
        },
        data(){
            return{
                url:""
            }
        },

        methods:{
            //获取录音地址
            getRecordAddress(){
                if(!this.callId) return;
                baseCall(
                    {
                    "call-id":this.callId
                    },
                    "GetRecordAddress",
                    res => {
                        if(res&&res.response==0){
                            if(res.url){
                                let url=res.url.split("/monitor")[1];
                                this.url="http://sxmaps.6655.la:9000/record"+url;
                            }
                        }
                    },true
                );
            },
        }
    }
</script>
<style scoped>
.audioDetail{width: 98%;}
</style>

