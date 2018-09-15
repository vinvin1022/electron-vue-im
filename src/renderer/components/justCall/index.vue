<template>
<div class="justCall">
    <span class="labelCon">联系学员</span>
    <span class="telStudent">{{phone|showCallId}}&nbsp;
        <i class="iconfont pointer" @click="makeCall">&#xe6ab;</i>
    </span>
</div>
       
</template>
<script>
import baseCall from "./call.js";

export default {
    props:{
        phone:String,
        memberId:String,
        service:{    
            type:String,
            default:"campus"
        },
        url:{
            type:String,
            default:"post_campus_saveStudent"
        }
    },
    created() {

    },
    methods: {
        //拨打电话
        makeCall() {
             let device=localStorage.device,
                 exten=localStorage.exten;
            if(!device){
                this.$message({
                    message: '当前无分机号，无法使用通话功能',
                    type: 'warning'
                });
                return;
            };
            if(!exten){
                 this.$message({
                    message: '当前无坐席号，无法使用通话功能',
                    type: 'warning'
                });
                return;
            }
            if(!this.phone){
                this.$message({
                    message: '当前无被叫号码',
                    type: 'warning'
                });
                return;
            };
            let phone=this.phone.toString().trim();
            this.$http('isBinding',{
                data:{
                    "device": device,
                    "exten": exten,
                }
            })
            .then(result => {
                if (result.data.device==device) {
                    this.handleMakeCall(phone,device);
                }else if(!result.data.exten&&!result.data.device){
                    baseCall({
                        exten: exten||localStorage.exten, //座席
                        password:exten||localStorage.exten, // 分机
                        device: device||localStorage.device
                    },"DynamicLogin",()=>this.handleMakeCall(phone,device),true);
                }else{
                    this.$message({
                        message: '当前分机和坐席绑定关系不对，无法使用话务功能，请重新登陆系统',
                        type: 'warning'
                    });
                    return;
                }
            })
          
        },
        handleMakeCall(phone,exten){
            let _this=this;
           
            baseCall(
                {
                    exten:exten,
                    "tel-num": phone,
                    choice:"true",
                },
                "MakeCall",
                res => {
                    if(res["call-id"]){
                       _this.memberId&&_this.saveCallHistory(res["call-id"]);
                       _this.$emit('handleAddCallId',res["call-id"]);
                    }
                }
            );
        },
        saveCallHistory(recordId){
            this.$http('saveStudent',{
                data:{
                    "memberId": this.memberId,
                    "phone": this.phone,
                    "recordId": recordId
                }
            })
            .then(result => {
                
            })
          
        },
        
        
    },
    filters: {
        showCallId(val){
            if(val){
                val=val+'';
                return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
            }
        }
    }
};
</script>
<style scoped>
 .justCall i{font-size:24px;color:#4598ff;line-height:40px;padding-right:10px;vertical-align: middle;}
.justCall{border: solid 1px #d3d6dc;color: #333333;line-height: 40px;background-color: #f9f9f9;border-radius: 2px;display: inline-block;}
.justCall>span{padding:0 20px;vertical-align: middle;}
.justCall .telStudent{background: #fff;border-left: solid 1px #d3d6dc;display: inline-block;padding: 0 10px;vertical-align: middle;}
</style>
