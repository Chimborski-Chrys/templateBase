<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import { LogIn } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formData = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: '',
  general: ''
})

const isLoading = ref(false)
const sessionExpiredMessage = ref('')

// Verificar se o usuário foi redirecionado por expiração do token
if (route.query.expired === 'true') {
  sessionExpiredMessage.value = 'Sua sessão expirou. Por favor, faça login novamente.'
}

const validateForm = () => {
  let isValid = true
  errors.value = { email: '', password: '', general: '' }

  if (!formData.value.email) {
    errors.value.email = 'Email é obrigatório'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    errors.value.email = 'Email inválido'
    isValid = false
  }

  if (!formData.value.password) {
    errors.value.password = 'Senha é obrigatória'
    isValid = false
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Senha deve ter no mínimo 6 caracteres'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errors.value.general = ''

  try {
    await authStore.login(formData.value)
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (error) {
    errors.value.general = authStore.error || 'Erro ao realizar login'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
    <BaseCard class="w-full max-w-md">
      <template #header>
        <div class="flex flex-col items-center space-y-2 text-center">
          <div class="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <LogIn class="h-6 w-6 text-white" />
          </div>
          <h1 class="text-2xl font-bold">Bem-vindo</h1>
          <p class="text-sm text-muted-foreground">Entre com suas credenciais para acessar</p>
        </div>
      </template>

      <div v-if="sessionExpiredMessage" class="mb-4 p-3 rounded-md bg-amber-500/10 border border-amber-500">
        <p class="text-sm text-amber-600 dark:text-amber-400">{{ sessionExpiredMessage }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <BaseInput
          v-model="formData.email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          :error="errors.email"
          :disabled="isLoading"
          required
        />

        <BaseInput
          v-model="formData.password"
          type="password"
          label="Senha"
          placeholder="••••••••"
          :error="errors.password"
          :disabled="isLoading"
          required
        />

        <div v-if="errors.general" class="p-3 rounded-md bg-destructive/10 border border-destructive">
          <p class="text-sm text-destructive">{{ errors.general }}</p>
        </div>

        <BaseButton
          type="submit"
          variant="gradient"
          class="w-full"
          :loading="isLoading"
          :disabled="isLoading"
        >
          Entrar
        </BaseButton>
      </form>

      <template #footer>
        <p class="text-xs text-muted-foreground text-center w-full">
          Sistema de autenticação com RBAC
        </p>
      </template>
    </BaseCard>
  </div>
</template>
