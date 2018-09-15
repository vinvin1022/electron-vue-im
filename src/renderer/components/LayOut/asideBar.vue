<template>
     <div class="aside grow0">
         <searchStudent @handleIsShowWebPage="handleIsShowWebPage"/>
        
        <div class="asideContent">
            <ul class="flex justify_content">
                <!-- <li>{{tabBarData}}</li> -->
                <li v-for="(item,index) in tabBarData" :key="index" @click="handleWbeBar(item)" :class="'headerItem '+ (tabkey==item.key?'active':'')" >
                     <el-badge :value="totalUnread" :max="99" class="item flex" v-if="item.key=='news'" :hidden="totalUnread==0" >
                       {{item.name}}
                    </el-badge>
                     <span v-else>{{item.name}}</span>
                </li>
            </ul>
            <div class="asideConList flex">
                <Session @handleIsShowWebPage="handleIsShowWebPage" key="news" v-show="tabkey==tabBarData[0].key" />
                <StudentList  @handleIsShowWebPage="handleIsShowWebPage" v-show="tabkey==tabBarData[1].key" :initShow="tabBarData[1].initShow" />
                <groupSend  v-show="tabkey==tabBarData[3].key" v-if="tabBarData[3].initShow" />
                <group @handleIsShowWebPage="handleIsShowWebPage" key="group" v-show="tabkey==tabBarData[2].key" v-if="tabBarData[2].initShow" />
            </div>
        </div>
      </div>
</template>
<script>
    import Session from '@/components/Session';
    import StudentList from '@/components/StudentList/index';
    import groupSend from '@/view/groupSend/index';
    import group from '@/view/group/index';
    import searchStudent from './searchStudent';
    export default{
        props:['handleIsShowWebPage'],
        data(){
            return{
                tabkey:"news",
                tabBarData:[
                    {
                        name:"消息",
                        key:"news",
                        initShow:true
                    },
                    {
                        name:"学员",
                        key:"student",
                        initShow:false
                    },
                    {
                        name:"群组",
                        key:"group",
                        initShow:false
                    },
                    {
                        name:"群发",
                        key:"groupSend",
                        initShow:false
                    }
                ]
            }
        },
        components:{Session,StudentList,groupSend,group,searchStudent},
        computed:{
            totalUnread:function(){
                let sessionList=this.$store.state.sessionlist;
                let total=0;
                for(let i=0,len=sessionList.length;i<len;i++){
                    if(sessionList[i].unread) total+=sessionList[i].unread;
                    if(total>99) break;
                }
                /* sessionList.map(item=>{
                    
                }) */
                return total
            },
            
        },
        methods:{
             handleWbeBar(item){
                 this.tabkey=item.key;
                 item.initShow=true;
                 if(item.key=='groupSend'){
                     this.handleIsShowWebPage(false);
                     this.$router.push('/groupSend');
                  }
             },
        }
    }
</script>
<style scoped>
.aside {
    height: 100%;
    width: 240px;
    background: #ebeff2;
}
.asideContent{
   height: calc(100% - 48px);
}
.asideConList{
   width:100%;
   height: calc(100% - 40px);
   /* overflow:auto; */
   /* position: relative; */
}
.asideConList>div,.asideConList>ul{
    width: 100%;
    height: 100%;
    overflow:auto;
    box-sizing: border-box;
}


.headerItem{
     font-size:16px;
     margin-right:20px;
     cursor: pointer;
     color: #999999;
     line-height: 40px;
     height: 40px;
}
.headerItem:first-child{margin-left:20px;}
.headerItem.active{
   
    color:#4598ff;
    box-shadow:0px -2px 0px #4598ff inset;

}
</style>
