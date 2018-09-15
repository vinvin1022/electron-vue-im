<template>
  <div class="quickReply" v-loading="isLoading">

    <el-dialog :title="menuType=='add'?'新增':'修改'" :visible.sync="dialogFormVisible" width="450px">
      <el-form :model="form" label-width="80px" ref="form" class="form">
        <el-form-item label="标签" prop="faqQuestion" :rules="[
                        { required: true, message: '请输入标签名称', trigger: 'blur' },
                    ]">
          <el-input v-model="form.faqQuestion" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="faqAnswer" :rules="[
                        { required: true, message: '请输入内容', trigger: 'blur' },
                    ]">
          <el-input v-model="form.faqAnswer" auto-complete="off" type="textarea" :rows="4" maxlength="800"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSub">确 定</el-button>
      </div>
    </el-dialog>
    <div class="faqListContainer">
      <el-table class="quickreplyTable" :data="data||[]" border style="width: 100%" @row-dblclick="handleClick" @row-contextmenu="rightClick">
        <el-table-column  prop="faqQuestion" label="标签" width="90" show-overflow-tooltip >
          <template slot-scope="scope">
            <div :title="scope.row.faqQuestion" >{{scope.row.faqQuestion}}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="faqAnswer" label="内容" >
          <template slot-scope="scope">
            <div :title="scope.row.faqAnswer" >{{scope.row.faqAnswer}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <rightMenu ref="rightMenu" >
      <li class="el-dropdown-menu__item" @click="handleDelSub">删除</li>
      <li class="el-dropdown-menu__item" @click="updataClick">修改</li>
    </rightMenu>
    <div class="addBtns">
        <i class="el-icon-plus" @click="dialogFormVisible = true;menuType='add'"></i> 
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
  import rightMenu from '@/components/rightMenu';
  export default {
    components:{
        rightMenu
    },
    created(){
      this.getDataList();
    },
    data() {
      return {

        dialogFormVisible:false,
        menuType:'add',
        form:{},
        currNode:{},
        isLoading:false,
       }
    },
   /*  created(){
      if(!this.data){
        this.getDataList();
      }
    }, */
    computed: {
        ...mapGetters({
            data: "getQuickReplyData"
        })
    },
    methods:{
        handleClick(row,event){
            this.$store.commit('setQuiteText',row.faqAnswer);
        },
        rightClick(msg,e){
          this.currNode=msg||{};
          this.$refs.rightMenu&&this.$refs.rightMenu.treeMenuClick(e);
        },
        updataClick(){
          this.form={...this.currNode};
          this.dialogFormVisible=true;
          this.menuType="updata";
        },
        setLoadingFalse(){
          this.isLoading=false;
        },
        getDataList(){
            this.isLoading=true;
            this.$store.commit('setQuickReplyData',{
                callBack:this.setLoadingFalse
            });
            /* this.$http("getQuickReply")
            .then(res => {
                this.isLoading=false;
                this.data=res.data||[];
                // this.studentDetail=res.data||[];
            })
            .catch(err => {
                this.isLoading=false
            }); */
        },
        handleAddSub(){
           this.$refs.form.validate((valid) => {
              if (!valid) {return false;}
              this.isLoading=true;
              let url='addQuickReply';
              if(this.menuType=='updata'){
                url='updateQuickReply'
              }
              this.$http(url,{
                data:this.form
              })
              .then(res => {
                  this.dialogFormVisible=false;
                  this.getDataList();
              })
              .catch(err => {
                  this.isLoading=false
              });
           });
        },
        handleDelSub(){
              this.$confirm('确定要删除吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
              type: 'warning'
              }).then(() => {
                  this.isLoading=true;
                  this.$http("delQuickReply",{
                    data:{faqQuestionNo:this.currNode.faqQuestionNo}
                  })
                  .then(res => {
                      this.getDataList();
                  })
                  .catch(err => {
                      this.isLoading=false
                  });
              })
        }
    }
  }
</script>
<style scoped>
.faqListContainer{
    height: calc(100% - 40px);
    overflow: auto;
}
.quickReply{height: 100%;}
.addBtns{height:40px;line-height: 40px;font-size:20px;padding:0 10px;}
.addBtns i:hover{
    color:#4598ff;
    cursor: pointer;
}
</style>

<style>
.quickreplyTable.el-table td,
.quickreplyTable.el-table th {
    padding: 8px 0;
}
.quickreplyTable.el-table th {
    background: #f0f3f5;
}
.quickReply{position: relative;}

</style>
