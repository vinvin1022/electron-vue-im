<template>
   <div v-loading="isLoading" class="container" >
       <div class="faqListContainer">
            <Faq :data="faqData||[]" @treeMenuClick="treeMenuClick"/>
       </div>
        <div class="addBtns">
            <i class="el-icon-plus" @click="handleAddClick"></i> 
        </div>
        <el-dialog  :title="`${menuType=='updata'?'修改':'添加'}FAQ`" :visible.sync="dialogFormVisible" width="450px">
            <el-form :model="form"  label-width="80px" ref="form" class="form" v-if="dialogFormVisible" >
                <el-form-item label="问题大类" prop="bigCategory" 
                    :rules="[
                        { required: true, message: '请选择问题大类', trigger: 'change' },
                        { validator: objSelete, trigger: 'change' }

                    ]"
                >
                    <el-select
                        v-model="form.bigCategory"
                        filterable
                        allow-create
                        :disabled="menuType=='updata'"
                        placeholder="请选择问题大类"
                        @change="handleBigChange"
                        value-key="bigCategoryNo"
                    >
                       <el-option v-for="(item,index) in faqData" :key="index"  :value="item" :label="item.bigCategoryName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题小类" prop="smallCategory"
                    :rules="[
                        { required: true, message: '请选择问题小类', trigger: 'change' },
                        { validator: objSelete, trigger: 'change' }

                    ]"
                >   
                    <el-select
                        v-model="form.smallCategory"
                        filterable
                        allow-create
                        :disabled="menuType=='updata'"
                        placeholder="请选择问题小类"
                        @change="handleSmallChange"
                        value-key="smallCategoryNo"
                    >
                       <el-option v-for="(item,index) in smallCategoryList" :key="index"  :value="item" :label="item.smallCategoryName"></el-option>
                    </el-select>
             <!--   <el-select v-model="form.smallCategoryNo" placeholder="请选择问题小类" @change="handleSmallChange">
                        <el-option v-for="item in smallCategoryList" :key="item.smallCategoryNo"  :value="item.smallCategoryNo" :label="item.smallCategoryName"> </el-option>
                    </el-select> -->
                </el-form-item>
                <span style="display:none">{{counter}}</span>
                <el-form-item label="问题名称" prop="faqQuestion" 
                    :rules="[
                        { required: true, message: '请输入问题名称', trigger: 'blur' },
                    ]"
                >
                    <el-input v-model="form.faqQuestion" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="问题回答" prop="faqAnswer"
                    :rules="[
                        { required: true, message: '请输入问题回答', trigger: 'blur' },
                    ]"
                 >
                    <el-input v-model="form.faqAnswer" auto-complete="off" type="textarea" :rows="4" maxlength="800"></el-input>
                </el-form-item>
            </el-form>
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddFaq">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改" :visible.sync="dialogFormVisible1" width="450px">
            <div class="flex flex_center">
                <span class="grow0 ">{{rightType|updataType}}：</span>
                <el-input v-model="updataValue"></el-input>
            </div>
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="handleUpdataSub">确 定</el-button>
            </div>
        </el-dialog>
        <ul v-show="isShowTreeMenu" class="showTreeMenu el-dropdown-menu el-popper "  :style="style">
            <li class="el-dropdown-menu__item rightTitle" @click="handleUpdataClick">修改</li>
            <li class="el-dropdown-menu__item rightTitle" @click="handleDelComfirm" >删除</li>
        </ul>
        <el-dialog title="提示" :visible.sync="dialogFormVisible2" width="450px">
            <p class="warningcon"><i class="messageWarn el-icon-warning"></i>确定要删除吗?</p>
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="handleDelFaq">确 定</el-button>
            </div>
        </el-dialog>
   </div>
</template>
<script>
let type={
    smallCategoryNo:"问题小类",
    bigCategoryNo:"问题大类"
}
import { mapGetters, mapMutations } from "vuex";
import Faq from './Faq';
    export default{
        components:{
            Faq
        },
        created(){
             this.getFQAMessage();
        },
        data(){
            return{
                isLoading:false,
                dialogFormVisible:false,
                dialogFormVisible1:false,
                dialogFormVisible2:false,
                form:{
                    bigCategory:{},
                    smallCategory:{}
                },
                smallCategoryList:[],
                counter:1,
                isShowTreeMenu:false,
                style:{},
                rightType:'',
                currentNode:{},
                currentNo:"",
                updataValue:"",
                menuType:"add",
                updataData:{}
            }
        },
        computed: {
            ...mapGetters({
                faqData: "getFaqData"
            })
        },
        filters:{
            updataType(value){
                return type[value];
            }
        },
        methods:{
            handleAddClick(){
                this.form={
                            bigCategory:{},
                            smallCategory:{}
                        };
                this.dialogFormVisible = true;
                this.menuType='add';
            },
            objSelete(rule, value, callback){
                if(typeof(value)=='object'){
                    if(Object.keys(value).length==0){
                        callback(new Error('请选择'));
                        return;
                    };
                    
                }
                callback();
            },
            handleUpdataClick(){
                this.menuType="updata";
                if(this.rightType=='questionNo'){
                    this.dialogFormVisible=true;
                    this.smallCategoryList=this.updataData.smallCategoryList||[];
                    this.form={
                        bigCategory:{
                            bigCategoryNo:this.updataData.bigCategoryNo
                        },
                        smallCategory:{
                            smallCategoryNo:this.updataData.smallCategoryNo
                        },
                        "faqAnswer": this.currentNode.faqAnswer,
                        "faqAnswerNo": this.currentNode.faqAnswerNo,
                        "faqQuestion": this.currentNode.faqQuestion,
                        "faqQuestionNo":this.currentNode.faqQuestionNo,
                    }
                 }else{
                    this.dialogFormVisible1=true;
                    let key=this.rightType.replace('No','Name')
                    this.updataValue=this.currentNode[key];
                }
                
            },
            treeMenuClick(type,currentNo,data,updataData){
                this.rightType=type;
                this.currentNo=currentNo;
                this.currentNode=data;
                if(updataData){this.updataData=updataData}
                this.isShowTreeMenu=true;
                let  y =event.clientY+ 8,
                    x =event.clientX-36,
                    key='top',
                    docH=document.body.clientHeight;

                if(y>5*docH/6){
                     y=y-120;
                }
                this.style={top:y+'px', left:x+'px'};
                document.body.addEventListener("mouseup", this.onBodyMouseDown);
            },
            onBodyMouseDown (event) {
                if( this.isShowTreeMenu){
                    this.isShowTreeMenu=false;
                }
                document.body.removeEventListener("mouseup", this.onBodyMouseDown);
            },
            handleBigChange(value){
                this.form.smallCategory='';
                if(typeof(value)=='string'){
                    this.smallCategoryList=[];
                }else{
                    this.smallCategoryList=value.smallList||[];
                }
            },
            handleSmallChange(){
                this.counter++;
            },
            setLoadingFalse(){
                this.isLoading=false;
            },  
            getFQAMessage(){
                this.isLoading=true;
                this.$store.commit('setFqaData',{
                    callBack:this.setLoadingFalse
                });
            },
            handleUpdataFaq(){

            },
            handleAddFaq(){
                this.$refs.form.validate((valid) => {
                    if (!valid) {return false;}
                    let {form}=this,
                        data={};
                    data.faqAnswer=form.faqAnswer;
                    data.faqQuestion=form.faqQuestion;
                    let url='saveFAQ';
                    if( this.menuType=="updata"){
                        data.faqAnswerNo=form.faqAnswerNo;
                        data.faqQuestionNo=form.faqQuestionNo;
                        url='updateFAQ';
                    }else{
                         if(form.bigCategory.bigCategoryNo){
                            data.bigCategoryName=undefined;
                            data.bigCategoryNo=form.bigCategory.bigCategoryNo;
                        }else{
                            data.bigCategoryName=form.bigCategory
                        };
                        if(form.smallCategory.smallCategoryNo){
                            data.smallCategoryName=undefined;
                            data.smallCategoryNo=form.smallCategory.smallCategoryNo;
                        }else{
                            data.smallCategoryName=form.smallCategory
                        };
                    }
                    this.isLoading=true;
    
                    this.$http(url,{data:data})
                    .then(res => {
                        this.form={
                            bigCategory:{},
                            smallCategory:{}
                        };
                        this.counter++;
                        this.getFQAMessage();
                        this.dialogFormVisible=false;
                        // this.studentDetail=res.data||[];
                    })
                    .catch(err => {
                        this.isLoading=false
                    });
                })
            },
            handleUpdataSub(){
                
                 let {rightType}=this,
                     data={};
                if(rightType=='questionNo'){

                }else{
                    if(!this.updataValue){
                        this.$message({
                            message: '请输入内容',
                            type: 'warning'
                        });
                        return;
                    }
                    let key=this.rightType.replace('No','Name')
                    data[rightType]=this.currentNo;
                    data[key]=this.updataValue;
                }
                this.isLoading=true;
 
                this.$http("updateFAQ",{data:data})
                .then(res => {
                   this.getFQAMessage();
                   this.dialogFormVisible1=false;
                })
                .catch(err => {
                    this.isLoading=false
                });
            },
            handleDelComfirm(){
                this.dialogFormVisible2=true;
                /* this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.handleDelFaq();
                }) */
            },
            handleDelFaq(){
                this.isLoading=true;
                this.dialogFormVisible2=false;
                this.$http("delFAQ",{
                    data:{
                         [this.rightType]:this.currentNo
                    }
                })
                .then(res => {
                   this.getFQAMessage();
                    // this.studentDetail=res.data||[];
                })
                .catch(err => {
                    this.isLoading=false
                });
            }

        }
    }
</script>
<style scoped>
.form{
    padding-top:20px;
}
.addBtns{height:40px;line-height: 40px;font-size:20px;padding:0 10px;}
.addBtns i:hover{
    color:#4598ff;
    cursor: pointer;
}
.faqListContainer{
    padding:0 10px;
    height: calc(100% - 40px);
    overflow: auto;
}
.container{
    height: 100%;
    
}
.messageWarn{
    color:#e6a23c;font-size:28px;margin-right:20px;line-height: 28px;vertical-align: middle;
}
.warningcon{
    line-height: 28px;font-size:14px;
}
</style>
<style>
.faqContainer .el-tabs,.faqContainer .el-tab-pane{
    height: 100%;
}
.faqContainer .el-tabs__content{
    height: calc(100% - 40px);
}
.showTreeMenu{position: fixed;max-height:210px;overflow: auto;}
</style>

