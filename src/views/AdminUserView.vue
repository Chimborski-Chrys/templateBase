<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import { Users, Plus, Edit, Trash2, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const users = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)

const formData = ref({
  id: null,
  name: '',
  email: '',
  password: '',
  role: 'user'
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  role: ''
})

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuário' },
  { value: 'moderator', label: 'Moderador' }
]

// Table columns configuration
const tableColumns = [
  { key: 'name', label: 'Nome', width: '25%' },
  { key: 'email', label: 'Email', width: '30%' },
  { key: 'role', label: 'Role', width: '20%' },
  { key: 'actions', label: 'Ações', width: '25%', align: 'right' }
]

// Helper: Normalizar role do backend (Admin -> admin)
const normalizeRole = (role) => {
  if (typeof role === 'string') {
    return role.toLowerCase()
  }
  return role
}

// Helper: Capitalizar role para enum do backend (admin -> Admin)
const capitalizeRole = (role) => {
  const roleMap = {
    'admin': 'Admin',
    'user': 'User',
    'moderator': 'Moderator'
  }
  return roleMap[role] || role
}

// Fetch all users
const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/users')
    // Normalizar roles para minúsculo para exibição
    users.value = response.data.map(user => ({
      ...user,
      role: normalizeRole(user.role)
    }))
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  } finally {
    isLoading.value = false
  }
}

// Open modal for creating new user
const openCreateModal = () => {
  isEditing.value = false
  formData.value = {
    id: null,
    name: '',
    email: '',
    password: '',
    role: 'user'
  }
  errors.value = { name: '', email: '', password: '', role: '' }
  showModal.value = true
}

// Open modal for editing user
const openEditModal = (user) => {
  isEditing.value = true
  formData.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: '',
    role: normalizeRole(user.role)
  }
  errors.value = { name: '', email: '', password: '', role: '' }
  showModal.value = true
}

// Validate form
const validateForm = () => {
  let isValid = true
  errors.value = { name: '', email: '', password: '', role: '' }

  if (!formData.value.name) {
    errors.value.name = 'Nome é obrigatório'
    isValid = false
  }

  if (!formData.value.email) {
    errors.value.email = 'Email é obrigatório'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    errors.value.email = 'Email inválido'
    isValid = false
  }

  if (!isEditing.value && !formData.value.password) {
    errors.value.password = 'Senha é obrigatória'
    isValid = false
  } else if (formData.value.password && formData.value.password.length < 6) {
    errors.value.password = 'Senha deve ter no mínimo 6 caracteres'
    isValid = false
  }

  if (!formData.value.role) {
    errors.value.role = 'Role é obrigatória'
    isValid = false
  }

  return isValid
}

// Create or update user
const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    if (isEditing.value) {
      // Update user
      const payload = {
        name: formData.value.name,
        email: formData.value.email,
        role: capitalizeRole(formData.value.role)
      }
      if (formData.value.password) {
        payload.passwordHash = formData.value.password
      }
      await api.put(`/users/${formData.value.id}`, payload)
    } else {
      // Create user - remover campo id e capitalizar role
      const payload = {
        name: formData.value.name,
        email: formData.value.email,
        password: formData.value.password,
        role: capitalizeRole(formData.value.role)
      }
      await api.post('/users', payload)
    }
    showModal.value = false
    await fetchUsers()
  } catch (error) {
    console.error('Erro ao salvar usuário:', error)
    alert(error.response?.data?.message || 'Erro ao salvar usuário')
  } finally {
    isLoading.value = false
  }
}

// Delete user
const handleDelete = async (userId) => {
  if (!confirm('Tem certeza que deseja excluir este usuário?')) return

  isLoading.value = true
  try {
    await api.delete(`/users/${userId}`)
    await fetchUsers()
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    alert(error.response?.data?.message || 'Erro ao deletar usuário')
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b bg-card">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <BaseButton @click="router.push('/dashboard')" variant="ghost" size="sm">
              <ArrowLeft class="h-4 w-4" />
            </BaseButton>
            <div class="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Users class="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold">Gerenciamento de Usuários</h1>
              <p class="text-sm text-muted-foreground">Painel Administrativo</p>
            </div>
          </div>
          <BaseButton @click="openCreateModal" variant="gradient">
            <Plus class="h-4 w-4 mr-2" />
            Novo Usuário
          </BaseButton>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="container mx-auto px-4 py-8">
      <BaseCard>
        <BaseTable
          :columns="tableColumns"
          :data="users"
          :loading="isLoading"
          empty-message="Nenhum usuário encontrado"
          :hoverable="false"
        >
          <!-- Custom Cell: Email -->
          <template #cell-email="{ value }">
            <span class="text-sm text-muted-foreground">{{ value }}</span>
          </template>

          <!-- Custom Cell: Role -->
          <template #cell-role="{ value }">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                value === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              ]"
            >
              {{ value }}
            </span>
          </template>

          <!-- Custom Cell: Actions -->
          <template #cell-actions="{ row }">
            <div class="flex items-center justify-end gap-2">
              <BaseButton
                @click.stop="openEditModal(row)"
                variant="ghost"
                size="sm"
              >
                <Edit class="h-4 w-4" />
              </BaseButton>
              <BaseButton
                @click.stop="handleDelete(row.id)"
                variant="ghost"
                size="sm"
                :disabled="row.id === authStore.user?.id"
              >
                <Trash2 class="h-4 w-4 text-destructive" />
              </BaseButton>
            </div>
          </template>
        </BaseTable>
      </BaseCard>
    </main>

    <!-- Modal: Create/Edit User -->
    <BaseModal
      :is-open="showModal"
      :title="isEditing ? 'Editar Usuário' : 'Criar Novo Usuário'"
      @close="showModal = false"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="formData.name"
          label="Nome"
          placeholder="João Silva"
          :error="errors.name"
          :disabled="isLoading"
          required
        />

        <BaseInput
          v-model="formData.email"
          type="email"
          label="Email"
          placeholder="joao@exemplo.com"
          :error="errors.email"
          :disabled="isLoading"
          required
        />

        <BaseInput
          v-model="formData.password"
          type="password"
          label="Senha"
          :placeholder="isEditing ? 'Deixe em branco para manter a atual' : 'Mínimo 6 caracteres'"
          :error="errors.password"
          :disabled="isLoading"
          :required="!isEditing"
        />

        <BaseSelect
          v-model="formData.role"
          label="Role"
          :options="roleOptions"
          :error="errors.role"
          :disabled="isLoading"
          required
        />
      </form>

      <template #footer>
        <BaseButton
          @click="showModal = false"
          variant="outline"
          :disabled="isLoading"
        >
          Cancelar
        </BaseButton>
        <BaseButton
          @click="handleSubmit"
          variant="gradient"
          :loading="isLoading"
          :disabled="isLoading"
        >
          {{ isEditing ? 'Salvar Alterações' : 'Criar Usuário' }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
