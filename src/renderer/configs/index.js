import {imagesUrl} from '@/severConfig.js'
let config = {
  sdk: 'NIM_Web_SDK_v4.7.0.js',
  // 用户自定义的登录注册地址
  loginUrl: '/login',
  registUrl: '/login',
  homeUrl: '/',

  // 资源路径根目录，为了方便用户部署在二级以上URL路径上
  resourceUrl: 'http://yx-web.nos.netease.com/webdoc/h5',
  // 用户logo地址
  logo: 'http://yx-web.nos.netease.com/webdoc/h5/im/logo.png',
  // 默认用户头像
  defaultUserIcon: `${imagesUrl}/defaulticons/default-icon.png`,
  // 默认普通群头像
  defaultGroupIcon: `${imagesUrl}/defaulticons/group.png`,
  // 默认高级群头像
  defaultAdvancedIcon: `${imagesUrl}/defaulticons/group.png`,
  // 系统通知图标
  noticeIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/notice-icon.png',
  // 我的手机图标
  myPhoneIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/my-phone.png',
  // 本地消息显示数量，会影响性能
  localMsglimit: 20
}

const env = 'online'

let appConfig = {
  // 用户的appkey
  // 用于在web demo中注册账号异步请求demo 服务器中使用
  test: {
    appkey: '4b024821f348f78566c75dea9b0b285e',
    postUrl: 'https://apptest.netease.im'
  },
  online: {
    appkey: '45c6af3c98409b18a84451215d0bdd6e',
    postUrl: 'https://app.netease.im'
  }
}

config = Object.assign(config, appConfig[env])

export default config


