import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: require('@/components/LayOut/home').default,
      redirect: '/login',
      children: [
        {
          path: 'layout',
          component: require('@/components/LayOut/index').default,
          children: [
            {
              path: '/chat/:id',
              name: 'chat',
              component: require('@/view/chatView').default
            },
            {
              path: '/groupSend',
              name: 'groupSend',
              component: require('@/view/groupSend/groupSendView').default
            }
          ]
        },

        {
          path: '/login',
          name: 'login',
          component: require('@/view/login/index').default
        },
        {
          path: '/imageView',
          name: 'imageView',
          component: require('@/view/imageView').default
        },
      ]
    },

    /* {
      path: '/index',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    }, */
    {
      path: '*',
      redirect: '/login'
    },
    
  ]
})
