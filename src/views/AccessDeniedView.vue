<script setup>
import { useRouter } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { ShieldOff, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <BaseCard class="w-full max-w-md text-center">
      <div class="flex flex-col items-center space-y-4">
        <div class="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldOff class="h-10 w-10 text-destructive" />
        </div>

        <div>
          <h1 class="text-3xl font-bold mb-2">Acesso Negado</h1>
          <p class="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </div>

        <div class="pt-4 flex gap-3 w-full">
          <BaseButton
            @click="router.back()"
            variant="outline"
            class="flex-1"
          >
            <ArrowLeft class="h-4 w-4 mr-2" />
            Voltar
          </BaseButton>
          <BaseButton
            @click="router.push('/dashboard')"
            variant="primary"
            class="flex-1"
          >
            Ir para Dashboard
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
