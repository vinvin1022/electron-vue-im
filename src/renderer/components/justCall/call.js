import SOAPClient from "./soap.js";
import { Message } from 'element-ui';
const responseStatus=(obj)=>{
    let arg = {
        status: "warning",
        text: ""
    }
    switch(obj.response){
        case 0:
            arg.text = "拨出成功"
            arg.status = "success"
            this.hangUpShow = true
            break;
        case 1003:
            arg.text = "分机不在空闲状态,该分机未注册、正在通话、振铃等"
            break;
        case 1010: //1010: 分机号处在话后状态，限制呼出
            arg.text = "分机号处在话后状态，限制呼出"
            break;
        case 1012:
            arg.text = "分机号不存在"
            break;
        case 1013:
            arg.text = "被叫分机不在空闲状态,如未注册、正在通话、振铃等"
            break;
        case 1014:
            arg.text = "被叫分机已示忙"
            break;
        case 1015:
            arg.text = "密码错误"
            break;
        case 1016:
            arg.text = "分机号已经被其他工号绑定"
            break;
        case 1017:
            arg.text = "工号已经被其他分机号绑定"
            break;
        case 1018:
            arg.text = "工号所在部门 id 为空"
            break;
        case 2001:
            arg.text = "通道不存在,被转接的电话已经挂机"
            break;
        case 2002:
            arg.text = "来电已被接听，无法抢接"
            break;
        case 2003:
            arg.text = "抢接失败,如发起抢接人的拒接、振铃超时等"
            break;
        case 2004:
            arg.text = "呼叫失败,发起人拒接、振铃超时等情况"
            break;
        case 2005:
            arg.text = "来电已被抢接"
            break;
        case 2006:
            arg.text = "未在静音状态,在正常状态下取消静音"
            break;
        case 2007:
            arg.text = "通话未建立"
            break;
        case 2008:
            arg.text = "通话已被静音,在已被静音的情况下重复静音"
            break;
        case 2009:
            arg.text = "话后状态，无法抢接"
            break;
        case 2021:
            arg.text = "话后功能未启用"
            break;
        case 3011:
            arg.text = "暂无空闲分机，请稍后再试"
            break;
        case 3015:
            arg.text = "该队列没有成员"
            break;
        case 3016:
            arg.text = "队列不存在"
            break;
        case 4017:
            arg.text = "加载多方通话模块失败"
            break;
        case 4018:
            arg.text = "对方未接听，邀请失败"
            break;
        case 4019:
            arg.text = "三方通话已创建，无法继续邀请"
            break;
        case 4020:
            arg.text = "三方通话资源不够"
            break;
        case 5001:
            arg.text = "参数错误或参数不全"
            break;
        case 6001:
            arg.text = "数据库连接失败"
            break;
        case 6002:
            arg.text = "数据库执行错误"
            break;
        case 6003:
            arg.text = "数据已存在"
            break;
        case 6004:
            arg.text = "数据不存在"
            break;
        case 6005:
            arg.text = "数据添加失败"
            break;
        case 6006:
            arg.text = "数据删除失败"
            break;
        case 7001:
            arg.text = "无呼叫数据"
            break;
        case 7003:
            arg.text = "录音不存在"
            break;
        case 8001:
            arg.text = "会议室不存在"
            break;
        case 8002:
            arg.text = "没有正在使用的会议室"
            break;
        case 8003:
            arg.text = "会议室中无此成员"
            break;
        case 9001:
            arg.text = "系统错误,编码不支持、缺少模块、拨号方案错误等"
            break;
        case 9002:
            arg.text = "无法连接软交换"
            break;
        case 9003:
            arg.text = "软交换鉴权失败"
            break;
    }
    return arg
}
const baseCall=(arg, method, callBack,isNotWaring)=> {
    let url=localStorage.callPhone;
    // let url="https://justcall.sxmaps.com:1480/webservice/JustcallWebService.wsdl";
    SOAPClient.invoke(
        url,
        method,
        arg,
        true,
        (res)=>{
            if(!res){
                Message.error("请求错误");
                return;
            }
            if(res.response){
                res.response=Number(res.response);
                let obj = responseStatus(res);
                 if(res.response==0){
                    !isNotWaring&&Message[obj.status](obj.text);
                    callBack&&callBack(res);
                }else{
                    Message[obj.status](obj.text);
                }
            }
            
        }
    );
}
export const getExtenCallStatus= function(exten,device){
    baseCall({
        exten: device||localStorage.device // 分机
    },"GetExtenCallStatus",undefined,true);
}
export const dynamicLogin= function(exten,device){
    baseCall({
        exten: exten||localStorage.exten, //座席
        password:exten||localStorage.exten, 
        device: device||localStorage.device// 分机
    },"DynamicLogin",undefined,true);
}
export const dynamicLogout= function(exten,device){
    baseCall({
        exten: exten||localStorage.exten,
        device:device|| localStorage.device
    },"DynamicLogout",undefined,true);
}  

export const makeCall=function(phone){
        let exten=localStorage.device;
        
        if(!exten){
            this.$message({
                message: '当前无分机号，无法使用通话功能',
                type: 'warning'
            });
            return;
        };
        if(!localStorage.exten){
             this.$message({
                message: '当前无坐席号，无法使用通话功能',
                type: 'warning'
            });
            return;
        }
        if(!phone){
            this.$message({
                message: '当前无被叫号码',
                type: 'warning'
            });
            return;
        };
        baseCall(
            {
                exten:exten,
                "tel-num": phone,
                choice:"true",
            },
            "MakeCall",
            res => {
                if(res["call-id"]){
                //    _this.memberId&&_this.saveCallHistory(res["call-id"]);
                //    _this.$emit('handleAddCallId',res["call-id"]);
                }
            }
        );

}

export default baseCall
/* //拨打电话
export const makeCall=()=>{
    this.baseCall(
        {
            exten: "6668",
            "tel-num": this.phone,
            choice:"true",
        },
        "MakeCall",
        res => {
            if(res&&res.response==0&&res["call-id"]){
               this.getRecordAddress(res["call-id"]);
            }

        }
    );
}, */