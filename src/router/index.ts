import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/views/DashboardView.vue') },
    { path: '/investigate', component: () => import('@/views/InvestigateView.vue') },
    { path: '/events/new', component: () => import('@/views/RegisterEventView.vue') },
    { path: '/intelligence', component: () => import('@/views/IntelligenceView.vue') },
  ],
})

export default router
