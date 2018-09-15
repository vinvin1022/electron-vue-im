<template>
    <el-collapse  accordion >
         
        <el-collapse-item  v-for="(item,index) in data" :key="index"  >
            <template slot="title">
                <div @contextmenu.prevent="rightClick('bigCategoryNo',item.bigCategoryNo,item)">{{item.bigCategoryName}}</div>
            </template>
            <el-collapse  accordion >
                <el-collapse-item v-for="(item1,index) in item.smallList" :key="index" >
                    <template slot="title">
                        <div @contextmenu.prevent="rightClick('smallCategoryNo',item1.smallCategoryNo,item1)">{{item1.smallCategoryName}}</div>
                    </template>
                    <div >
                        <el-collapse  accordion >
                            <el-collapse-item :title="item2.faqQuestion" v-for="(item2,index) in item1.answerList" :key="index">
                                <template slot="title">
                                    <div :title="item2.faqQuestion" class="ellipsis" @contextmenu.prevent="rightClick('questionNo',item2.faqQuestionNo,item2,{
                                        smallCategoryNo:item1.smallCategoryNo,
                                        bigCategoryNo:item.bigCategoryNo,
                                        smallCategoryList:item.smallList
                                        })" >{{item2.faqQuestion}}</div>
                                </template>
                                <div class="threeMenuAnswer"  @contextmenu.prevent="rightClick('questionNo',item2.faqQuestionNo,item2,{
                                        smallCategoryNo:item1.smallCategoryNo,
                                        bigCategoryNo:item.bigCategoryNo,
                                        smallCategoryList:item.smallList
                                        })" >A: <span @click="handleClick(item2.faqAnswer)" class="anwser">{{ item2.faqAnswer }}</span></div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-collapse-item>
             </el-collapse>
         </el-collapse-item>
    </el-collapse>
</template>
<script>
export default {
    props:{
        data:Array
    },
    methods:{
        handleClick(answer){
            this.$store.commit('setQuiteText',answer);
        },
        rightClick(type,no,item,updataData){
            this.$emit('treeMenuClick',type,no,item,updataData)
        }
    },
    
};
</script>
<style scoped>
.threeMenuAnswer{
    padding-bottom: 10px;
    word-break: break-all;
}
</style>


