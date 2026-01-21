<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import SessionExpiredModal from '@/components/SessionExpiredModal.vue'

const authStore = useAuthStore()

// Restaurar sessão ao iniciar o app
onMounted(() => {
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
