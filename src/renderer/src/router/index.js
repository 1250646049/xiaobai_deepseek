import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/index',
      name: 'index',
      component: () => import('@renderer/views/index/IndexView.vue'),
      children: [
        {
          path: 'local',
          name: 'local',
          component: () => import('@renderer/views/local/IndexView.vue')
        },
        {
          path: '/index',
          redirect: '/index/local'
        }
      ]
    },

    {
      path: '/',
      redirect: '/index'
    }
  ]
})

export default router
