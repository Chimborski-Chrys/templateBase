import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor - Anexar Bearer Token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('auth_token')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor - Interceptar 401 e mostrar modal de sessão expirada
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()

      // Se estiver autenticado e receber 401, significa que o token expirou
      if (authStore.isAuthenticated) {
        authStore.handleSessionExpired()
        authStore.logout()
      } else {
        // Se não estava autenticado, apenas redireciona para login
        router.push('/login')
      }
    }

    return Promise.reject(error)
  }
)

export default api
