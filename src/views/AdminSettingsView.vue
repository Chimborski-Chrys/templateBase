<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { Palette, Save, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const settingsStore = useSettingsStore()

const formData = ref({
  brandName: '',
  logoUrl: '',
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  accentColor: '#22C55E'
})

const isLoading = ref(false)
const successMessage = ref('')
const errors = ref({
  brandName: '',
  logoUrl: '',
  general: ''
})

onMounted(async () => {
  if (!settingsStore.settings) {
    await settingsStore.loadSettings()
  }

  if (settingsStore.settings) {
    formData.value = {
      brandName: settingsStore.settings.brandName,
      logoUrl: settingsStore.settings.logoUrl || '',
      primaryColor: settingsStore.settings.primaryColor,
      secondaryColor: settingsStore.settings.secondaryColor,
      accentColor: settingsStore.settings.accentColor
    }
  }
})

const validateForm = () => {
  let isValid = true
  errors.value = { brandName: '', logoUrl: '', general: '' }

  if (!formData.value.brandName) {
    errors.value.brandName = 'Nome da marca é obrigatório'
    isValid = false
  }

  return isValid
}

const handleSave = async () => {
  if (!validateForm()) return

  isLoading.value = true
  successMessage.value = ''
  errors.value.general = ''

  try {
    await settingsStore.updateSettings(formData.value)
    successMessage.value = 'Configurações salvas com sucesso! O tema foi atualizado.'

    // Limpar mensagem após 5 segundos
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    errors.value.general = settingsStore.error || 'Erro ao salvar configurações'
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
          <div class="h-10 w-10 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
            <Palette class="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold">Configurações do Sistema</h1>
            <p class="text-sm text-muted-foreground">Personalize a marca, cores e identidade visual</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <BaseCard>
        <template #header>
          <div class="flex items-center space-x-2">                                                                                                                                     
               <Palette class="h-5 w-5 text-primary" />                                                                                                                                    
             <h2 class="text-xl font-semibold">White-Label</h2>                                                                                                                          
          </div>                                                                                                                                                                        
       </template> 
      <form @submit.prevent="handleSave" class="space-y-6">
        <!-- Nome da Marca -->
        <div>
          <BaseInput
            v-model="formData.brandName"
            label="Nome da Marca"
            placeholder="Ex: Minha Empresa"
            :error="errors.brandName"
            :disabled="isLoading"
            required
          />
          <p class="text-xs text-muted-foreground mt-1">
            Este nome aparecerá no título da página e em toda a aplicação
          </p>
        </div>

        <!-- URL da Logo -->
        <div>
          <BaseInput
            v-model="formData.logoUrl"
            label="URL da Logo"
            placeholder="https://exemplo.com/logo.png"
            :error="errors.logoUrl"
            :disabled="isLoading"
          />
          <p class="text-xs text-muted-foreground mt-1">
            Insira a URL pública da sua logo (PNG, JPG, SVG)
          </p>
        </div>

        <!-- Cores -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-foreground">Cores do Tema</h3>
          <p class="text-sm text-muted-foreground">
            Escolha 3 cores principais. O sistema gerará automaticamente todas as variações necessárias.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Cor Primária -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground block">
                Cor Primária
              </label>
              <div class="flex items-center space-x-3">
                <input
                  v-model="formData.primaryColor"
                  type="color"
                  class="h-12 w-16 rounded border-2 border-border cursor-pointer"
                  :disabled="isLoading"
                />
                <BaseInput
                  v-model="formData.primaryColor"
                  placeholder="#3B82F6"
                  :disabled="isLoading"
                  class="flex-1"
                />
              </div>
              <p class="text-xs text-muted-foreground">
                Cor principal da aplicação (botões, links)
              </p>
            </div>

            <!-- Cor Secundária -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground block">
                Cor Secundária
              </label>
              <div class="flex items-center space-x-3">
                <input
                  v-model="formData.secondaryColor"
                  type="color"
                  class="h-12 w-16 rounded border-2 border-border cursor-pointer"
                  :disabled="isLoading"
                />
                <BaseInput
                  v-model="formData.secondaryColor"
                  placeholder="#8B5CF6"
                  :disabled="isLoading"
                  class="flex-1"
                />
              </div>
              <p class="text-xs text-muted-foreground">
                Cor secundária (elementos de suporte)
              </p>
            </div>

            <!-- Cor de Destaque -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground block">
                Cor de Destaque
              </label>
              <div class="flex items-center space-x-3">
                <input
                  v-model="formData.accentColor"
                  type="color"
                  class="h-12 w-16 rounded border-2 border-border cursor-pointer"
                  :disabled="isLoading"
                />
                <BaseInput
                  v-model="formData.accentColor"
                  placeholder="#22C55E"
                  :disabled="isLoading"
                  class="flex-1"
                />
              </div>
              <p class="text-xs text-muted-foreground">
                Cor de destaque (badges, notificações)
              </p>
            </div>
          </div>
        </div>

        <!-- Preview das cores -->
        <div class="rounded-lg bg-muted p-4">
          <h4 class="text-sm font-medium text-foreground mb-3">Preview</h4>
          <div class="flex flex-wrap gap-3">
            <div class="flex items-center space-x-2">
              <div
                class="h-10 w-10 rounded-md shadow-md"
                :style="{ backgroundColor: formData.primaryColor }"
              ></div>
              <span class="text-sm text-muted-foreground">Primária</span>
            </div>
            <div class="flex items-center space-x-2">
              <div
                class="h-10 w-10 rounded-md shadow-md"
                :style="{ backgroundColor: formData.secondaryColor }"
              ></div>
              <span class="text-sm text-muted-foreground">Secundária</span>
            </div>
            <div class="flex items-center space-x-2">
              <div
                class="h-10 w-10 rounded-md shadow-md"
                :style="{ backgroundColor: formData.accentColor }"
              ></div>
              <span class="text-sm text-muted-foreground">Destaque</span>
            </div>
          </div>
        </div>

        <!-- Mensagens de sucesso/erro -->
        <div v-if="successMessage" class="p-3 rounded-md bg-success/10 border border-success">
          <p class="text-sm text-success">{{ successMessage }}</p>
        </div>

        <div v-if="errors.general" class="p-3 rounded-md bg-destructive/10 border border-destructive">
          <p class="text-sm text-destructive">{{ errors.general }}</p>
        </div>

        <!-- Botão Salvar -->
        <div class="flex justify-end">
          <BaseButton
            type="submit"
            variant="gradient"
            :loading="isLoading"
            :disabled="isLoading"
            class="min-w-[150px]"
          >
            <Save class="h-4 w-4 mr-2" />
            Salvar Configurações
          </BaseButton>
        </div>
      </form>
    </BaseCard>
    </main>
  </div>
</template>
