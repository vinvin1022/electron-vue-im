import Vue from 'vue'
import $http from './severConfig'

import App from './App'
import router from './router'
import store from './store'
import './assets/font/iconfont.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/main.css'
// import db from '@/datastore'
// import ToastPlugin from './plugins/toastPlugin'
// Vue.prototype.$db = db
Vue.use(ElementUI)
// Vue.use(ToastPlugin)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = $http
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
