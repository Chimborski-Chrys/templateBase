<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { AlertCircle } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const handleOk = () => {
  authStore.closeSessionExpiredModal()
  router.push('/login')
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="authStore.showSessionExpiredModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="handleOk"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertCircle class="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div class="flex-1">
            <h3 id="modal-title" class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sessão Expirada
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Sua sessão expirou por inatividade ou tempo limite. Por favor, faça login novamente para continuar.
            </p>
            <button
              @click="handleOk"
              class="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              OK, Fazer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}
</style>
