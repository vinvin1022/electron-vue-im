<template>
   <div class="informationCon">
        <p class="card_title">{{data.postName}}</p>
        <div>
            <div><span class="card_label card_logo"><i class="iconfont sidebar-i">&#xe6bd;</i></span><span class="card_content">{{data.userName}}</span></div>
            <div><span class="card_label">电话：</span><span class="card_content">{{data.phone}}</span></div>
            <div><span class="card_label">职位：</span><span class="card_content">{{data.postName}}</span></div>
            <div><span class="card_label">部门：</span><span class="card_content">{{data.parentDetpName+'-'+data.deptName}}</span></div>
        </div>
    </div>
         
</template>
<script>
    export default{
        props:{
            data:{
               default:{},
               type:Object,
            }
        }
    }
</script>
<style scoped>
.informationCon{
    display: inline-block;
    width: 360px;
    height: 160px;
    background-color: #ffffff;
    border: solid 1px #f3f3f4;
    line-height:28px;
    padding-left: 26px;
    padding-top:30px;
    box-sizing: border-box;
    position: relative;
    font-size:14px;
    margin:14px 10px;

}
.card_title{
    position: absolute;
    top:0;
    left:50%;
    transform: translate(-50%,-50%);
    padding:0 16px;
	height: 28px;
	background-color: #f9f9f9;
	border: solid 1px #f3f3f4;

    }
.card_label{
    display: inline-block;
    color: #999;
    width: 42px;
}
.card_content{
    color: #333333;
}
.card_logo i{
    font-size:24px;
}
</style>
