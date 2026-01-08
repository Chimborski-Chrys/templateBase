<script setup>
import { useRouter } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { FileQuestion, Home } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <BaseCard class="w-full max-w-md text-center">
      <div class="flex flex-col items-center space-y-4">
        <div class="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <FileQuestion class="h-10 w-10 text-muted-foreground" />
        </div>

        <div>
          <h1 class="text-6xl font-bold text-primary mb-2">404</h1>
          <h2 class="text-2xl font-semibold mb-2">Página não encontrada</h2>
          <p class="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div class="pt-4">
          <BaseButton
            @click="router.push('/dashboard')"
            variant="gradient"
          >
            <Home class="h-4 w-4 mr-2" />
            Voltar para Home
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
