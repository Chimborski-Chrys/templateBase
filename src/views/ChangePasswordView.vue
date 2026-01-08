<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { Lock, ArrowLeft, CheckCircle } from 'lucide-vue-next'

const router = useRouter()

const formData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const successMessage = ref('')

const validateForm = () => {
  let isValid = true
  errors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  if (!formData.value.currentPassword) {
    errors.value.currentPassword = 'Senha atual é obrigatória'
    isValid = false
  }

  if (!formData.value.newPassword) {
    errors.value.newPassword = 'Nova senha é obrigatória'
    isValid = false
  } else if (formData.value.newPassword.length < 6) {
    errors.value.newPassword = 'Nova senha deve ter no mínimo 6 caracteres'
    isValid = false
  }

  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Confirmação de senha é obrigatória'
    isValid = false
  } else if (formData.value.newPassword !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Senhas não conferem'
    isValid = false
  }

  if (formData.value.currentPassword === formData.value.newPassword) {
    errors.value.newPassword = 'A nova senha deve ser diferente da atual'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  successMessage.value = ''

  try {
    await api.post('/auth/change-password', {
      currentPassword: formData.value.currentPassword,
      newPassword: formData.value.newPassword,
      confirmPassword: formData.value.confirmPassword
    })

    successMessage.value = 'Senha alterada com sucesso!'

    // Reset form
    formData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    if (error.response?.data?.field) {
      errors.value[error.response.data.field] = error.response.data.message
    } else {
      errors.value.currentPassword = error.response?.data?.message || 'Erro ao alterar senha'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b bg-card">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center space-x-3">
          <BaseButton @click="router.push('/dashboard')" variant="ghost" size="sm">
            <ArrowLeft class="h-4 w-4" />
          </BaseButton>
          <div class="h-10 w-10 rounded-full bg-gradient-to-r from-accent to-success flex items-center justify-center">
            <Lock class="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold">Alterar Senha</h1>
            <p class="text-sm text-muted-foreground">Atualize sua senha de acesso</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="container mx-auto px-4 py-8 max-w-md">
      <BaseCard>
        <div v-if="successMessage" class="mb-6 p-4 rounded-md bg-success/10 border border-success flex items-start gap-3">
          <CheckCircle class="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-success">{{ successMessage }}</p>
            <p class="text-sm text-success/80 mt-1">Redirecionando...</p>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <BaseInput
            v-model="formData.currentPassword"
            type="password"
            label="Senha Atual"
            placeholder="••••••••"
            :error="errors.currentPassword"
            :disabled="isLoading"
            required
          />

          <div class="pt-2 border-t">
            <BaseInput
              v-model="formData.newPassword"
              type="password"
              label="Nova Senha"
              placeholder="••••••••"
              :error="errors.newPassword"
              :disabled="isLoading"
              required
            />
          </div>

          <BaseInput
            v-model="formData.confirmPassword"
            type="password"
            label="Confirmar Nova Senha"
            placeholder="••••••••"
            :error="errors.confirmPassword"
            :disabled="isLoading"
            required
          />

          <div class="pt-4 flex gap-3">
            <BaseButton
              @click="router.push('/dashboard')"
              variant="outline"
              class="flex-1"
              :disabled="isLoading"
            >
              Cancelar
            </BaseButton>
            <BaseButton
              type="submit"
              variant="gradient"
              class="flex-1"
              :loading="isLoading"
              :disabled="isLoading || !!successMessage"
            >
              Alterar Senha
            </BaseButton>
          </div>
        </form>
      </BaseCard>

      <!-- Security Tips -->
      <BaseCard title="Dicas de Segurança" class="mt-6">
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li class="flex items-start gap-2">
            <span class="text-primary mt-0.5">•</span>
            <span>Use no mínimo 6 caracteres</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary mt-0.5">•</span>
            <span>Combine letras maiúsculas, minúsculas e números</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary mt-0.5">•</span>
            <span>Não reutilize senhas de outros serviços</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary mt-0.5">•</span>
            <span>Troque sua senha regularmente</span>
          </li>
        </ul>
      </BaseCard>
    </main>
  </div>
</template>
