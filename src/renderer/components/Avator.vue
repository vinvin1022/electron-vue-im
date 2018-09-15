<template>
<span class="flex flex_center">
    <img :src="info.avatar" class="userAvator" />
    <span> {{info.name}} </span>
</span>
</template>
<script>
import configs from '@/configs/index';
// import { ESRCH } from 'constants';
    export default{
        props:{
            accid:String,
            name:String,
        },
        state(){
            return{

            }
        },
        computed:{
            myInfo () {
                return this.$store.state.myInfo
            },
            userInfos () {
                return this.$store.state.userInfos
            }, 
            info(){
                if(this.myInfo.account==this.accid){
                    return {avatar:this.myInfo.avatar,name:this.myInfo.nick}
                }
                let urser=this.userInfos[this.accid];
                if(urser){
                    return {avatar:urser.avatar,name:urser.nick||urser.account}
                }else{
                    return {avatar:configs.defaultUserIcon,name:this.name||this.accid}
                }
            }
        }
    }
</script>