<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import SessionExpiredModal from '@/components/SessionExpiredModal.vue'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()

// Carregar configurações e restaurar sessão ao iniciar o app
onMounted(async () => {
  // Carregar configurações de white-label
  await settingsStore.loadSettings()

  // Restaurar sessão do usuário
  authStore.restoreSession()
})
</script>

<template>
  <div id="app">
    <RouterView />
    <SessionExpiredModal />
  </div>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
</style>
