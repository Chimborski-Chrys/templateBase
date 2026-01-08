# SaaS Boilerplate - Vue 3 + Vite

Template base completo para projetos SaaS com autenticação RBAC, gestão de usuários e sistema de temas dinâmicos.

## Stack Tecnológica

- **Vue 3** (Composition API + `<script setup>`)
- **Vite** (Build tool)
- **JavaScript** (ES6+)
- **TailwindCSS** (Estilização + Sistema de Cores Dinâmicas)
- **Pinia** (Gerenciamento de Estado/Auth)
- **Vue Router** (Roteamento com Guards)
- **Axios** (HTTP Client com Interceptors)
- **Lucide Vue Next** (Ícones)

## Estrutura de Pastas

```
src/
├── assets/
│   └── base.css                 # Variáveis CSS + Tailwind
├── components/
│   └── ui/                      # Componentes UI reutilizáveis
│       ├── BaseButton.vue
│       ├── BaseCard.vue
│       ├── BaseInput.vue
│       ├── BaseModal.vue
│       ├── BaseSelect.vue
│       └── BaseTable.vue        # Tabela com loading/empty states
├── router/
│   └── index.js                 # Vue Router + Navigation Guards
├── services/
│   └── api.js                   # Axios + Interceptors
├── stores/
│   └── auth.js                  # Pinia Store (Auth + RBAC)
├── views/                       # Views/Páginas
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── AdminUserView.vue        # CRUD de Usuários
│   ├── ChangePasswordView.vue
│   ├── AccessDeniedView.vue
│   └── NotFoundView.vue
├── App.vue
└── main.js
```

## Core Features

### 1. Sistema de Temas (Cores Dinâmicas)

O sistema suporta **cores sólidas**, **transparências** e **gradientes**.

**base.css** - Variáveis CSS usando canais RGB nus:
```css
:root {
  --primary: 59 130 246;        /* RGB sem formato */
  --secondary: 139 92 246;
}
```

**tailwind.config.js** - Configuração que permite opacidade e gradientes:
```js
colors: {
  primary: 'rgb(var(--primary) / <alpha-value>)',
  secondary: 'rgb(var(--secondary) / <alpha-value>)',
}
```

**Exemplos de Uso:**
```html
<!-- Opacidade -->
<div class="bg-primary/50">50% de opacidade</div>

<!-- Gradiente -->
<button class="bg-gradient-to-r from-primary to-secondary">
  Botão com Gradiente
</button>
```

### 2. Autenticação e RBAC

**Pinia Auth Store** (`src/stores/auth.js`):
- Gerencia `user`, `token`, `isAuthenticated`
- Funções: `login()`, `logout()`, `restoreSession()`, `hasRole()`
- Persiste sessão no `localStorage`

**Vue Router Guards** (`src/router/index.js`):
- Proteção de rotas com `meta: { requiresAuth: true }`
- RBAC com `meta: { roles: ['admin'] }`
- Redirect automático para `/login` ou `/access-denied`

**Exemplo de Rota Protegida:**
```js
{
  path: '/admin/users',
  name: 'AdminUsers',
  component: AdminUserView,
  meta: {
    requiresAuth: true,
    roles: ['admin']  // Apenas admins
  }
}
```

### 3. Axios Service (Interceptors)

**Request Interceptor:**
- Anexa automaticamente o Bearer Token em todas as requisições

**Response Interceptor:**
- Intercepta erro `401` (Unauthorized)
- Força logout e redirect para `/login`

### 4. Telas Implementadas

- **LoginView** - Layout centralizado com validação
- **DashboardView** - Home com ações rápidas
- **AdminUserView** - CRUD completo de usuários (Create, Read, Update, Delete)
  - Listagem em tabela
  - Modal para criar/editar
  - Validação de formulário
  - Proteção: apenas role `admin`
- **ChangePasswordView** - Troca de senha com validação
- **AccessDeniedView** - Página de acesso negado
- **NotFoundView** - 404 personalizado

## Instalação e Uso

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` e configure a URL da API:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

### 4. Build para produção

```bash
npm run build
```

## Componentes UI Reutilizáveis

### BaseButton
```vue
<BaseButton variant="gradient" @click="handleClick">
  Clique Aqui
</BaseButton>
```
**Variantes:** `primary`, `secondary`, `destructive`, `outline`, `ghost`, `gradient`

### BaseInput
```vue
<BaseInput
  v-model="email"
  label="Email"
  type="email"
  :error="errors.email"
  required
/>
```

### BaseSelect
```vue
<BaseSelect
  v-model="role"
  label="Role"
  :options="[
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuário' }
  ]"
  required
/>
```

### BaseModal
```vue
<BaseModal :is-open="showModal" title="Criar Usuário" @close="showModal = false">
  <p>Conteúdo do modal</p>
  <template #footer>
    <BaseButton @click="showModal = false">Fechar</BaseButton>
  </template>
</BaseModal>
```

### BaseCard
```vue
<BaseCard title="Título" subtitle="Subtítulo">
  <p>Conteúdo do card</p>
</BaseCard>
```

### BaseTable
```vue
<BaseTable
  :columns="[
    { key: 'name', label: 'Nome', width: '40%' },
    { key: 'email', label: 'Email', width: '40%' },
    { key: 'actions', label: 'Ações', width: '20%', align: 'right' }
  ]"
  :data="users"
  :loading="isLoading"
  empty-message="Nenhum usuário encontrado"
>
  <!-- Customizar células via slots -->
  <template #cell-actions="{ row }">
    <BaseButton @click="edit(row)" size="sm">Editar</BaseButton>
  </template>
</BaseTable>
```
**Props:** `columns`, `data`, `loading`, `emptyMessage`, `striped`, `hoverable`

## Personalização de Cores

Edite `src/assets/base.css` e altere os valores RGB:

```css
:root {
  --primary: 59 130 246;      /* Azul */
  --secondary: 139 92 246;    /* Roxo */
  --accent: 34 197 94;        /* Verde */
  --destructive: 239 68 68;   /* Vermelho */
}
```

## Licença

MIT
