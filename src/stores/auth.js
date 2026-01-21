import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const showSessionExpiredModal = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')
  const isAdmin = computed(() => hasRole('admin'))

  // Helper: Check if user has specific role
  const hasRole = (roles) => {
    if (!user.value || !user.value.role) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]

    // Backend pode enviar role como string ou número (enum)
    // UserRole: User = 0, Admin = 1
    const userRole = typeof user.value.role === 'string'
      ? user.value.role.toLowerCase()
      : user.value.role

    return roleArray.some(role => {
      const checkRole = role.toLowerCase()
      // Comparar string com string ou número com número
      if (typeof userRole === 'string') {
        return checkRole === userRole
      } else {
        // Se é número: admin = 1, user = 0
        return (checkRole === 'admin' && userRole === 1) ||
               (checkRole === 'user' && userRole === 0)
      }
    })
  }

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/login', credentials)
      const data = response.data

      // Backend retorna: { token, email, name, role, expiresAt }
      token.value = data.token
      user.value = {
        email: data.email,
        name: data.name,
        role: data.role,
        expiresAt: data.expiresAt
      }

      // Persist to localStorage
      localStorage.setItem('auth_token', token.value)
      localStorage.setItem('auth_user', JSON.stringify(user.value))

      // Iniciar verificação de expiração
      startExpirationCheck()
    } catch (err) {
      error.value = err.response?.data?.message || 'Falha no login'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    // Parar verificação de expiração
    stopExpirationCheck()

    user.value = null
    token.value = null
    error.value = null

    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const restoreSession = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser)

        // Verificar se o token expirou
        if (userData.expiresAt) {
          const expirationDate = new Date(userData.expiresAt)
          const now = new Date()

          if (now >= expirationDate) {
            console.log('Token expirado, fazendo logout automático')
            logout()
            return
          }
        }

        token.value = storedToken
        user.value = userData

        // Iniciar verificação de expiração
        startExpirationCheck()
      } catch (err) {
        console.error('Failed to restore session:', err)
        logout()
      }
    }
  }

  const updateUser = (updatedUser) => {
    user.value = updatedUser
    localStorage.setItem('auth_user', JSON.stringify(updatedUser))
  }

  const checkTokenExpiration = () => {
    if (!user.value || !user.value.expiresAt) return

    const expirationDate = new Date(user.value.expiresAt)
    const now = new Date()

    if (now >= expirationDate) {
      console.log('Token expirado durante a sessão, fazendo logout automático')
      showSessionExpiredModal.value = true
      logout()
      return true
    }

    return false
  }

  const handleSessionExpired = () => {
    showSessionExpiredModal.value = true
  }

  const closeSessionExpiredModal = () => {
    showSessionExpiredModal.value = false
  }

  // Verificar expiração a cada 1 minuto (60000ms)
  let expirationCheckInterval = null

  const startExpirationCheck = () => {
    stopExpirationCheck()
    expirationCheckInterval = setInterval(() => {
      checkTokenExpiration()
    }, 60000) // Verifica a cada 1 minuto
  }

  const stopExpirationCheck = () => {
    if (expirationCheckInterval) {
      clearInterval(expirationCheckInterval)
      expirationCheckInterval = null
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    showSessionExpiredModal,
    // Getters
    isAuthenticated,
    userRole,
    userName,
    userEmail,
    isAdmin,
    // Actions
    login,
    logout,
    restoreSession,
    updateUser,
    hasRole,
    checkTokenExpiration,
    startExpirationCheck,
    stopExpirationCheck,
    handleSessionExpired,
    closeSessionExpiredModal,
  }
})
