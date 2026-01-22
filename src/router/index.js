import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Views
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import AdminUserView from '@/views/AdminUserView.vue'
import AdminSettingsView from '@/views/AdminSettingsView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'
import AccessDeniedView from '@/views/AccessDeniedView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: ChangePasswordView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUserView,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
    },
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: AdminSettingsView,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      requiresRootAdmin: true,  // Apenas admin raiz (sem CreatedById)
    },
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView,
    meta: { requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const requiredRoles = to.meta.roles

  // Verificar expiração do token antes de cada navegação
  if (authStore.isAuthenticated) {
    const isExpired = authStore.checkTokenExpiration()
    if (isExpired && to.name !== 'Login') {
      return next({
        name: 'Login',
        query: { redirect: to.fullPath, expired: 'true' },
      })
    }
  }

  // Check if route requires authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    return next({
      name: 'Login',
      query: { redirect: to.fullPath },
    })
  }

  // Check if user has required role
  if (requiredRoles && requiredRoles.length > 0) {
    if (!authStore.hasRole(requiredRoles)) {
      return next({ name: 'AccessDenied' })
    }
  }

  // Check if route requires root admin (only first admin without CreatedById)
  if (to.meta.requiresRootAdmin && !authStore.isRootAdmin) {
    return next({ name: 'AccessDenied' })
  }

  // Redirect authenticated users away from login
  if (to.name === 'Login' && authStore.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router
