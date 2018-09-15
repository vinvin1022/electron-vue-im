<template>
  <div class="chat-fullscreen" :class="{active:showImg}" @click.stop="hideFullscreenImg">
    <div class="chat-mask"></div>
    <div class="chat-image flex flex_center justify_center" >
        <span ref="chatImg"></span>
    </div>
  </div>
</template>

<script type="text/javascript">

export default {
  // 兼容性处理，图片加载时间可能比较慢
  watch: {
    isFullscreenImgShow (val, oldVal) {
      var self = this
      let chatImg = this.$refs.chatImg
      if (val === true) {
        chatImg.innerHTML = ''
        let img = new Image()
        img.src = this.$store.state.fullscreenImgSrc
        img.alt = '图片尺寸较大，正在加载中...'
        img.onload = function () {
          chatImg.appendChild(img)
          self.showImg = val
        }
      } else {
        self.showImg = false
        chatImg.innerHTML = ''
      }
    }
  },
  data () {
    return {
      showImg: false
    }
  },
  computed: {
    isFullscreenImgShow () {
      return this.$store.state.isFullscreenImgShow
    }
  },
  methods: {
    hideFullscreenImg () {
      this.$store.dispatch('hideFullscreenImg')
    }
  }
}
</script>

<style scoped>
/*   .chat-fullscreen, .chat-image img {
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  } */
  .chat-fullscreen {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      overflow: hidden;
      visibility: hidden;
      z-index: 98;
      background: rgba(0,0,0,0.4);
    }
  .chat-fullscreen.active {
      visibility: visible;
  }
  .chat-image {
    height: 100%;
    width: 100%;
    text-align: center;
    overflow: auto;
  }

</style>