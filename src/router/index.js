import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from "@/stores/useAuthStore.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        auth: false
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        auth: false
      },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/ProductsView.vue'),
      meta: {
        auth: true
      },
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/CategoriesView.vue'),
      meta: {
        auth: true
      },
    },
    {
      path: '/brands',
      name: 'brands',
      component: () => import('@/views/BrandsView.vue'),
      meta: {
        auth: true
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: {
        auth: false
      },
    },
  ],
})

export default router

router.beforeEach((to) => {
  const { user } = useAuthStore();
  const authRequired = to.meta.auth;

  if (to.name === "login" && user)
    router.push('/products');

  if (authRequired && !user)
    router.push('/login');

});
