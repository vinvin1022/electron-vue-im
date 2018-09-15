<template>
  <div>
    <el-dialog title="联系学员" :visible.sync="dialogConStudent" class="telStudentModel" width="740px" :close-on-click-modal="false">
      <el-form :model="conStudentForm" :rules="conSturules" ref="dlStudentForm">
        <el-form-item class="telContainer" prop="recordUrl">
          <justCall :phone="phone" @handleAddCallId="handleAddCallId" :memberId="memberUid" />
        </el-form-item>
        <el-form-item label="服务类型:" :label-width="formLabelWidth" prop="cate">
          <el-radio-group v-model="conStudentForm.cate">
            <el-radio v-for="(type, index) in radioType" :key="index" :label="type">
              {{type.cateName}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="服务详情:" :label-width="formLabelWidth" prop="cateOption">
          <el-radio-group v-model="conStudentForm.cateOption" v-show="this.radioDet">
            <el-radio v-for="(itemRadio, index) in conStudentForm.cate.settingList" :key="index" :label="itemRadio">
              {{itemRadio.opName}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="反馈记录:" :label-width="formLabelWidth" prop="feedback">
          <el-input type="textarea" v-model="conStudentForm.feedback" :autosize="{ minRows: 4, maxRows: 6}" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="isDeal">
          <el-radio-group v-model="conStudentForm.isDeal">
            <el-radio label="1">已解决</el-radio>
            <el-radio label="0">未解决</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogConStudent=false">取 消</el-button>
        <el-button type="primary" @click="dialogStuSubmit('dlStudentForm')" :loading="loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchData2 } from "@/service/service";
import justCall from "@/components/justCall/index.vue";
export default {
    props: ["phone", "memberUid", "orderBizSn", "historyRecord"],
    components: {
        justCall
    },
    data() {
        return {
            radioType: [],
            radioDet: [],
            formLabelWidth: "120px",
            dialogConStudent: false, // 联系学员弹窗
            loading: false,
            conStudentForm: {
                cate: {
                    categoryUid: "",
                    cateName: ""
                }, // 服务类别
                cateOption: {
                    settingUid: "",
                    opName: ""
                }, // 服务选项
                feedback: "", // 反馈记录
                isDeal: "", // 是否解决 1解决,0未解决
                // orderBizSn: "", // 售后商品单号
                recordUrl: "" // 电话录音
            },
            conSturules: {
                cate: [
                    {
                        required: true,
                        message: "请选择服务类型",
                        trigger: "change"
                    }
                ],
                cateOption: [
                    {
                        required: true,
                        message: "请选择服务详情",
                        trigger: "change"
                    }
                ],
                feedback: [
                    {
                        required: true,
                        message: "请输入反馈信息",
                        trigger: "blur"
                    }
                ],
                isDeal: [
                    {
                        required: true,
                        message: "请选择是否解决",
                        trigger: "change"
                    }
                ]
            },
            init: false
        };
    },
    created() {

    },
    methods: {
        initFormData() {
          if(this.historyRecord){
             let {radioType}=this;
             if(!this.historyRecord.categoryUid) return;
             for(let i=0;i< radioType.length;i++){
                if(this.historyRecord.categoryUid==radioType[i].categoryUid){
                  this.conStudentForm.cate=radioType[i];
                  if(!this.historyRecord.settingUid) return;
                  for(let j=0;j<radioType[i].settingList.length;j++){
                    if(radioType[i].settingList[j].settingUid==this.historyRecord.settingUid){
                        this.conStudentForm.cateOption=radioType[i].settingList[j];
                        break;
                    }
                  }
                  break;
                }
             }
          }
        },
        handleAddCallId(callId) {
            if (this.conStudentForm.recordUrl) {
                this.conStudentForm.recordUrl += "," + callId;
            } else {
                this.conStudentForm.recordUrl = callId;
            }
        },
        //获取服务类型
        fetchRadioType: function() {
            this.$http("qryCategorySetting")
                .then(result => {
                    // debugge
                    if (result && result.data) {
                        this.radioType = result.data || [];
                        this.initFormData();
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        },

        // 确定提交联系学员
        dialogStuSubmit: function(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.fetchOpiList();
                } else {
                    return false;
                }
            });
        },
        fetchOpiList() {
            let data = this.conStudentForm;
            data.cateName = this.conStudentForm.cate.cateName;
            data.cateOptionName = this.conStudentForm.cateOption.opName;
            data.cateUid = this.conStudentForm.cate.categoryUid;
            data.cateOptionUid = this.conStudentForm.cateOption.settingUid;
            data.memberUid = this.memberUid;
            data.orderBizSn = this.orderBizSn;
            data.uid=this.historyRecord&&this.historyRecord.uid;
            this.loading = true;
            this.$http("feedback", {data:data})
            .then(result => {
                // debugger
                if (result.code && result.code === 200) {
                    this.$message({
                        type: "success",
                        message: "提交成功"
                    });
                }
                // this.$store.commit('setRefreshFollowUp');
                this.loading = false;
                this.dialogConStudent = false;
            })
            .catch(err => {
                this.loading = false;
            });
        },

        changeVisible(val) {
            if (this.$refs.dlStudentForm) {
                this.$refs.dlStudentForm.resetFields();
            }
            this.dialogConStudent = val;
            if(this.init){
               this.initFormData();
            }
            this.init = true;

        }
    },
    watch: {
        init: function() {
            this.fetchRadioType();
        }
    }
};
</script>

<style scoped>
.telContainer {
    margin-left: 44px;
    margin-bottom: 20px;
}
.telStudent {
    cursor: pointer;
}
.telStudent i {
    font-size: 24px;
    color: #58c9f3;
    line-height: 40px;
    padding-right: 10px;
    vertical-align: middle;
}
.telMark {
    border: solid 1px #d3d6dc;
    color: #333333;
    line-height: 40px;
    background-color: #f9f9f9;
    border-radius: 2px;
    display: inline-block;
    margin-left: 54px;
    margin-bottom: 16px;
}
.telMark > span {
    padding: 0 20px;
    vertical-align: middle;
}
.telMark .telStudent {
    background: #fff;
    border-left: solid 1px #d3d6dc;
    display: inline-block;
    padding: 0 10px;
    vertical-align: middle;
}
</style>


