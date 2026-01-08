import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')
  const isAdmin = computed(() => hasRole('admin'))

  // Helper: Check if user has specific role
  const hasRole = (roles) => {
    if (!user.value) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.value.role)
  }

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/login', credentials)
      const { user: userData, token: authToken } = response.data

      user.value = userData
      token.value = authToken

      // Persist to localStorage
      localStorage.setItem('auth_token', authToken)
      localStorage.setItem('auth_user', JSON.stringify(userData))
    } catch (err) {
      error.value = err.response?.data?.message || 'Falha no login'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
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
        token.value = storedToken
        user.value = JSON.parse(storedUser)
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

  return {
    // State
    user,
    token,
    loading,
    error,
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
  }
})
