import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { applyTheme } from '@/services/themeService'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const loadSettings = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/AppSettings')
      settings.value = response.data

      // Aplicar tema
      applyTheme(settings.value)

      // Atualizar título
      document.title = settings.value.brandName || 'Base API'

      // Salvar no cache
      localStorage.setItem('app_settings', JSON.stringify(settings.value))

      return settings.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar configurações'

      // Tentar usar cache
      const cached = localStorage.getItem('app_settings')
      if (cached) {
        settings.value = JSON.parse(cached)
        applyTheme(settings.value)
        document.title = settings.value.brandName || 'Base API'
      }

      return settings.value
    } finally {
      loading.value = false
    }
  }

  const updateSettings = async (data) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put('/AppSettings', data)
      settings.value = response.data

      // Aplicar tema atualizado
      applyTheme(settings.value)

      // Atualizar título
      document.title = settings.value.brandName || 'Base API'

      // Atualizar cache
      localStorage.setItem('app_settings', JSON.stringify(settings.value))

      return settings.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar configurações'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    settings,
    loading,
    error,
    // Actions
    loadSettings,
    updateSettings,
  }
})
