<template>
    <div class="flex flex_center padding10 studentItem" >
        <img :src="item.avator" class="userAvator" />
        <span class="grow1"> {{item.xyname}} </span>
        <i class="el-icon-close closeBtn" @click="handleDelSeleted(index)"></i>
    </div>
</template>
<style  scoped>

.studentItem:hover {
    background-color: #f0f3f5;
}
</style>


