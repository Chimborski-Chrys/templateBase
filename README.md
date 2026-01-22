# Base Template - Vue 3 + Vite

Template front-end completo com autenticação JWT, RBAC, sistema White-Label e gestão hierárquica de usuários.

## Stack Tecnológica

- **Vue 3** (Composition API + `<script setup>`)
- **Vite** (Build tool)
- **TailwindCSS** (Estilização + Temas Dinâmicos)
- **Pinia** (Gerenciamento de Estado)
- **Vue Router** (Roteamento com Guards)
- **Axios** (HTTP Client com Interceptors)
- **Lucide Vue Next** (Ícones)

## Features Principais

### 🎨 Sistema White-Label Completo
- **Cores dinâmicas** - 3 cores principais que geram todas as variações automaticamente
- **Logo personalizável** - Upload de logo via URL (aparece no login e dashboard)
- **Nome da marca** - Personalização do nome exibido em toda aplicação
- **Painel de configurações** - Interface visual para ajustar cores, logo e marca em tempo real
- **Preview em tempo real** - Visualize botões, badges, alertas e gradientes antes de salvar
- **Sem rebuild** - Todas as mudanças aplicadas dinamicamente via CSS variables

### 🔐 Autenticação JWT + RBAC
- **JWT com expiração** - Tokens válidos por 8 horas
- **Logout automático** - Sistema detecta expiração e desloga automaticamente
- **Modal de sessão expirada** - Notificação amigável ao usuário
- **Persistência de sessão** - Sessões restauradas do localStorage
- **Role-based access** - Controle de acesso baseado em roles (Admin, User, Moderator)
- **Navigation guards** - Proteção automática de rotas

### 👥 Hierarquia de Administradores
- **Admin raiz** - Primeiro admin criado (acesso total)
- **Admins secundários** - Criados por outros admins
- **Isolamento de gestão** - Admins só veem/editam usuários que criaram
- **Proteção de criador** - Não é possível editar/excluir quem te criou
- **Configurações restritas** - Apenas admin raiz altera configurações do sistema

### 📦 Componentes UI Reutilizáveis
- **BaseButton** - 6 variantes (primary, secondary, destructive, outline, ghost, gradient)
- **BaseInput** - Validação e estados de erro integrados
- **BaseSelect** - Select customizado com label e erro
- **BaseModal** - Modal com header, body, footer e overlay
- **BaseCard** - Card com header opcional e slots
- **BaseTable** - Tabela com loading, empty states e custom cells

## Estrutura de Pastas

```
src/
├── assets/
│   └── base.css                    # CSS variables + Tailwind base
├── components/
│   └── ui/                         # Componentes UI reutilizáveis
│       ├── BaseButton.vue
│       ├── BaseCard.vue
│       ├── BaseInput.vue
│       ├── BaseModal.vue
│       ├── BaseSelect.vue
│       ├── BaseTable.vue
│       └── SessionExpiredModal.vue # Modal de sessão expirada
├── router/
│   └── index.js                    # Router + Guards (auth + roles + rootAdmin)
├── services/
│   ├── api.js                      # Axios + Interceptors (401 handler)
│   └── themeService.js             # Sistema de cores dinâmicas
├── stores/
│   ├── auth.js                     # Auth + RBAC + Session expiration
│   └── settings.js                 # White-label settings
├── views/
│   ├── LoginView.vue               # Login com logo white-label
│   ├── DashboardView.vue           # Dashboard com logo no header
│   ├── AdminUserView.vue           # CRUD usuários (com hierarquia)
│   ├── AdminSettingsView.vue       # Configurações white-label (admin raiz)
│   ├── ChangePasswordView.vue      # Troca de senha
│   ├── AccessDeniedView.vue        # 403 Forbidden
│   └── NotFoundView.vue            # 404 Not Found
├── App.vue
└── main.js
```

## Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env e configure VITE_API_BASE_URL

# 3. Rodar em desenvolvimento
npm run dev

# 4. Build para produção
npm run build
```

## Configuração da API

Edite `.env`:
```env
VITE_API_BASE_URL=https://localhost:7000/api
```

## Como Funciona o Sistema White-Label

### 1. Cores Dinâmicas
O sistema usa **CSS Custom Properties** com valores RGB separados, permitindo opacidade e gradientes:

```css
/* base.css */
:root {
  --primary: 59 130 246;        /* RGB sem formato */
  --secondary: 139 92 246;
}

/* Uso no Tailwind */
<div class="bg-primary/50">            <!-- 50% opacidade -->
<div class="bg-gradient-to-r from-primary to-secondary">  <!-- Gradiente -->
```

### 2. Theme Service
O `themeService.js` converte cores HEX (do backend) para RGB e aplica dinamicamente:

```js
applyTheme({
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  accentColor: '#22C55E'
})
// Atualiza --primary, --secondary, --accent, --success automaticamente
```

### 3. Logo Personalizada
Configurada em `/admin/settings` (apenas admin raiz), aparece:
- Login (h-16, centralizada)
- Dashboard header (h-10, ao lado do título)
- Se não houver logo, exibe ícone padrão

## Hierarquia de Administradores

### Admin Raiz (primeiro admin)
- ✅ Vê todos os usuários
- ✅ Cria novos admins/usuários
- ✅ Acessa configurações do sistema
- ✅ Edita/exclui qualquer usuário criado por ele

### Admin Secundário (criado por outro admin)
- ✅ Vê apenas usuários que ele criou
- ✅ Cria novos usuários (que ficarão vinculados a ele)
- ❌ Não vê quem o criou
- ❌ Não edita/exclui quem o criou
- ❌ Não acessa configurações do sistema

### Implementação Técnica
```js
// User.cs (backend)
CreatedById: Guid?  // null = admin raiz

// auth.js (frontend)
isRootAdmin: computed(() => hasRole('admin') && user.value?.createdById === null)

// Router guard
if (to.meta.requiresRootAdmin && !authStore.isRootAdmin) {
  return next({ name: 'AccessDenied' })
}
```

## Expiração de Sessão JWT

- **Duração do token**: 8 horas (configurável no backend)
- **Verificação automática**: A cada 1 minuto
- **Interceptor 401**: Detecta token expirado em requisições
- **Modal amigável**: Notifica usuário e redireciona para login
- **Proteção de rotas**: Verifica expiração antes de cada navegação

## Rotas e Permissões

| Rota | Auth | Role | Restrição Especial |
|------|------|------|--------------------|
| `/login` | ❌ | - | - |
| `/dashboard` | ✅ | - | - |
| `/change-password` | ✅ | - | - |
| `/admin/users` | ✅ | admin | Vê apenas usuários criados por ele |
| `/admin/settings` | ✅ | admin | **Apenas admin raiz** |

## Componentes Principais

### BaseTable
```vue
<BaseTable
  :columns="[
    { key: 'name', label: 'Nome', width: '40%' },
    { key: 'actions', label: 'Ações', align: 'right' }
  ]"
  :data="users"
  :loading="isLoading"
>
  <template #cell-actions="{ row }">
    <BaseButton @click="edit(row)">Editar</BaseButton>
  </template>
</BaseTable>
```

### BaseModal
```vue
<BaseModal :is-open="showModal" title="Criar Usuário" @close="showModal = false">
  <form @submit.prevent="handleSubmit">
    <BaseInput v-model="name" label="Nome" required />
  </form>
  <template #footer>
    <BaseButton variant="outline" @click="showModal = false">Cancelar</BaseButton>
    <BaseButton variant="gradient" @click="handleSubmit">Salvar</BaseButton>
  </template>
</BaseModal>
```

## Integração com Backend

### Endpoints Utilizados
```
POST   /api/auth/login              # Login JWT
GET    /api/users                   # Lista usuários (filtrado por hierarquia)
POST   /api/users                   # Cria usuário (salva CreatedById)
PUT    /api/users/{id}              # Edita usuário (valida hierarquia)
DELETE /api/users/{id}              # Exclui usuário (valida hierarquia)
GET    /api/AppSettings             # Obtém configurações white-label
PUT    /api/AppSettings             # Atualiza configurações (apenas admin raiz)
```

## Licença

MIT
