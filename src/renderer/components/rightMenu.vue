<template>
<ul v-show="isShowTreeMenu" class="showTreeMenu el-dropdown-menu el-popper "  :style="style" ref="menuList">
    <slot :treeMenuClick="treeMenuClick"/>
   <!--  <li class="el-dropdown-menu__item" >添加分组</li>
    <li class="el-dropdown-menu__item" >添加分组</li>
    <li class="el-dropdown-menu__item" >添加分组</li> -->
</ul>
</template>
<script>
    export default{
        data(){
            return{
                 isShowTreeMenu:false,
                 style:{},
            }
        },
        methods:{
            treeMenuClick(event){
                this.isShowTreeMenu=true;
                let  y =event.clientY+ 8,
                    x =event.clientX+ 6,
                    key='top',
                    docH=document.body.clientHeight;

                if(y>2*docH/3){
                    let eleHeight=this.$refs.menuList.clientHeight;
                    y=y-100;
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
        }
    }
</script>