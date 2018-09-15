<template>
  <div class="bgNav flex flex_center justify_center">
    <div class="loginNav">
      <div class="titles">
        <div class="logoNav"></div>
        <div class="title">教师工作平台</div>
      </div>
      <div class="leftFrom">
        <div class="fromPadding">
          <el-form :model="fromDate" ref="fromDate" class="demo-ruleForm" @keydown.native.enter.prevent="submitForm('fromDate')">
            <el-form-item prop="username" :rules="[{ required: true, message: '请输登录帐号', trigger: 'blur' }]">
              <el-input v-model.trim="fromDate.username" placeholder="登录帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password" :rules="[{ required: true, message: '请输登录密码', trigger: 'blur' }]">
              <el-input type="password" v-model.trim="fromDate.password" placeholder="登录密码"></el-input>
            </el-form-item>
            <div class="showHigth">
              <el-form-item ref="ext" prop="fjh" style="height:40px" :rules="[{ required: false, message: '请输分机号', trigger: 'blur' }]">
                <el-input v-model.trim="fromDate.fjh" placeholder="分机号"></el-input>
              </el-form-item>
            </div>
            <div class="isOpen">
              <el-checkbox v-model="checked" >记住密码</el-checkbox>
            </div>
            <el-form-item>
              <el-button class="but" type="primary" @click="submitForm('fromDate')" :loading="loading">登 录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dynamicLogout, dynamicLogin } from "@/components/justCall/call.js";
import {config } from '@/severConfig.js';
export default {
    data() {
        return {
            loading: false,
            fromDate: {
                password: localStorage.password,
                username: localStorage.username,
                fjh: localStorage.fjh
            },
            checked: false
        };
    },
    created() {
        this.checked=localStorage.checked=='true'? true : false ;
    },
    methods: {
        justCallInvalid(data) {
            if (!data.seat_name) {
                this.$message({
                    type: "warning",
                    message: "暂无坐席无法使用通话功能"
                });
                return false;
            } else if (data.bindingZuoXi && data.bindingZuoXi != data.seat_name) {
                this.$message({
                    type: "warning",
                    message: `分机号被坐席号为${data.bindingZuoXi}的${
                        data.occupyName
                    }所占用`
                });
                return false;
            }
            if (data.loginDevice) {
                if (data.loginDevice != this.fromDate.fjh) {
                    dynamicLogout(data.seat_name, data.loginDevice);
                } else {
                    return true;
                }
            } /* else {
                dynamicLogin(data.seat_name, this.fromDate.fjh);
            } */
            return true;
        },
        saveLoginMessage(arg){
           localStorage.setItem("username",arg.username||'');
           localStorage.setItem("password",arg.password||'');
           localStorage.setItem("fjh",arg.fjh||'');
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.$http("login", {
                        data: this.fromDate
                    })
                        .then(res => {
                            if(config.protocol=='https'){
                                localStorage.setItem("callPhone",res.data.teacher.httpsCallPhone||'');
                                localStorage.setItem("deviceUrl", res.data.teacher.deviceHttps||'');
                            }else{
                                localStorage.setItem("callPhone",res.data.teacher.callPhone||'');
                                localStorage.setItem("deviceUrl",res.data.teacher.deviceUrl||'');
                            }
                            // this.loading = false;
                            if(!res.data.teacher.accid||!res.data.teacher.token){
                                this.$message({
                                    type: "warning",
                                    message: "暂无云信账号"
                                });
                                this.loading = false;
                                return;
                            }
                            if (this.fromDate.fjh) {
                                let invalid = this.justCallInvalid(res.data.teacher);
                                 this.loading = false;
                                if (!invalid) return;
                            }

                            this.$store.commit(
                                "setTearcherInfo",
                                res.data.teacher
                            );
                          
                            localStorage.setItem("checked", this.checked);
                            localStorage.setItem("token", res.data.teacher.acc_sys_token);
                            // localStorage.setItem("callPhone",res.data.teacher.callPhone||'');
                            // localStorage.setItem("deviceUrl",res.data.teacher.callPhone||'');
                           
                            localStorage.setItem(
                                "exten",
                                res.data.teacher.seat_name || ""
                            ); //座席
                            localStorage.setItem(
                                "device",
                                this.fromDate.fjh || ""
                            ); // 分机

                            if(this.checked){
                                this.saveLoginMessage(this.fromDate)
                            }else{ 
                                this.saveLoginMessage({})
                            }
                            this.$store.dispatch("connect",{force:true});
                            // this.$router.push("/layout");
                            this.$store.commit("createdDB", res.data.teacher);
                            this.$store.commit('initLocalData')
                            // this.$store.dispatch("createdDB",res.data.teacher.accid);
                            
                        })
                        .catch(res => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.bgNav {
    height: 100%;
    background: url("../../assets/img/authority/loginbag.png") no-repeat 50% 50% /
        cover;
}
.loginNav {
    width: 350px;
}
.titles {
    height: 40px;
    line-height: 40px;
    font-family: STKaiti;
    font-size: 30px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
    margin-bottom: 35px;
}
.title {
    border-left: 1px solid #ffffff;
    padding-left: 10px;
    margin-left: 10px;
}
.logoNav {
    float: left;
    width: 140px;
    background-image: url(../../assets/img/authority/logo.png);
    height: 100%;
}
.title {
    float: left;
}
.isOpen {
    color: #fff;
}
</style>
<style>
.bgNav .el-button {
    width: 100%;
    margin-top: 10px;
}
.isOpen .el-checkbox {
    color: #fff;
}
</style>
