<template>
  <div id="app">
    <router-view></router-view>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="40%"
      >
      <div v-html="message" class="warningUpdata"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
    <!-- <FullscreenImg /> -->
  </div>
</template>

<script>
import {config} from '@/severConfig.js'
  export default {
    name: 'my-project',
    components:{
      // FullscreenImg
    },
    data(){
      return{
        dialogVisible:false,
        message:""
      }
    },
    created() {
        document.title=`升学教师工作平台${config.version}`;
        this.$http("checkVersion", {
            data: {
                currentVersion:config.version
            }
        })
        .then(res => {
            if(res.data){
               this.dialogVisible=true;
               this.message=res.data
            }
        })
 
    },
   
  }
</script>

<style>
.warningUpdata{
  padding-top:20px;
  font-size:14px;
}
.warningUpdata a{
  color: #409eff;
}
</style>
