<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRouter } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { LayoutDashboard, Users, Lock, LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const userName = computed(() => authStore.userName)
const userEmail = computed(() => authStore.userEmail)
const userRole = computed(() => authStore.userRole)
const isAdmin = computed(() => authStore.isAdmin)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const quickActions = computed(() => [
  {
    title: 'Gerenciar Usuários',
    description: 'Criar, editar e remover usuários do sistema',
    icon: Users,
    route: '/admin/users',
    visible: isAdmin.value,
    color: 'from-primary to-secondary'
  },
  {
    title: 'Alterar Senha',
    description: 'Trocar sua senha de acesso',
    icon: Lock,
    route: '/change-password',
    visible: true,
    color: 'from-accent to-success'
  }
])
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b bg-card">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <LayoutDashboard class="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold">Dashboard</h1>
              <p class="text-sm text-muted-foreground">SaaS Boilerplate</p>
            </div>
          </div>
          <BaseButton @click="handleLogout" variant="outline" size="sm">
            <LogOut class="h-4 w-4 mr-2" />
            Sair
          </BaseButton>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Welcome Section -->
      <BaseCard class="mb-8">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-2">Olá, {{ userName }}!</h2>
            <p class="text-muted-foreground mb-1">{{ userEmail }}</p>
            <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {{ userRole?.toUpperCase() }}
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Quick Actions -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Ações Rápidas</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RouterLink
            v-for="action in quickActions.filter(a => a.visible)"
            :key="action.route"
            :to="action.route"
            class="block group"
          >
            <BaseCard class="h-full transition-all hover:shadow-md hover:border-primary/50">
              <div class="flex items-start space-x-4">
                <div :class="['h-12 w-12 rounded-lg bg-gradient-to-r flex items-center justify-center', action.color]">
                  <component :is="action.icon" class="h-6 w-6 text-white" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {{ action.title }}
                  </h4>
                  <p class="text-sm text-muted-foreground">{{ action.description }}</p>
                </div>
              </div>
            </BaseCard>
          </RouterLink>
        </div>
      </div>

      <!-- Demo: Gradient Button -->
      <div class="mt-8">
        <BaseCard title="Exemplo de Botão com Gradiente">
          <div class="flex gap-4 flex-wrap">
            <BaseButton variant="gradient">
              Botão com Gradiente
            </BaseButton>
            <BaseButton variant="primary">
              Botão Primary
            </BaseButton>
            <BaseButton variant="secondary">
              Botão Secondary
            </BaseButton>
            <BaseButton variant="outline">
              Botão Outline
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </main>
  </div>
</template>
