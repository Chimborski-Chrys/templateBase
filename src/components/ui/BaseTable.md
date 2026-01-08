# BaseTable Component

Componente de tabela reutilizável com suporte a loading, estado vazio e customização de células via slots.

## Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `columns` | Array | **required** | Configuração das colunas |
| `data` | Array | **required** | Dados a serem exibidos |
| `loading` | Boolean | `false` | Mostra estado de loading |
| `emptyMessage` | String | `'Nenhum registro encontrado'` | Mensagem quando não há dados |
| `rowKey` | String | `'id'` | Chave única para cada linha |
| `striped` | Boolean | `false` | Linhas zebradas |
| `hoverable` | Boolean | `true` | Efeito hover nas linhas |

## Columns Configuration

Cada coluna deve ter o seguinte formato:

```javascript
{
  key: 'name',        // Chave do dado (suporta nested: 'user.name')
  label: 'Nome',      // Label do header
  width: '30%',       // Largura (opcional)
  align: 'left',      // Alinhamento: 'left' | 'center' | 'right' (opcional)
  class: 'text-sm'    // Classes CSS customizadas (opcional)
}
```

## Uso Básico

```vue
<script setup>
import BaseTable from '@/components/ui/BaseTable.vue'

const columns = [
  { key: 'name', label: 'Nome', width: '40%' },
  { key: 'email', label: 'Email', width: '40%' },
  { key: 'status', label: 'Status', width: '20%', align: 'center' }
]

const data = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', status: 'active' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', status: 'inactive' }
]

const isLoading = ref(false)
</script>

<template>
  <BaseTable
    :columns="columns"
    :data="data"
    :loading="isLoading"
  />
</template>
```

## Customização com Slots

Use slots nomeados `cell-{columnKey}` para customizar células específicas:

```vue
<BaseTable :columns="columns" :data="data">
  <!-- Customizar coluna 'status' -->
  <template #cell-status="{ value, row, index }">
    <span :class="value === 'active' ? 'text-success' : 'text-muted'">
      {{ value }}
    </span>
  </template>

  <!-- Customizar coluna 'actions' -->
  <template #cell-actions="{ row }">
    <div class="flex gap-2">
      <BaseButton @click="edit(row)" size="sm">Editar</BaseButton>
      <BaseButton @click="remove(row.id)" size="sm" variant="destructive">Deletar</BaseButton>
    </div>
  </template>
</BaseTable>
```

## Slot Props

Cada slot de célula recebe:

- `value` - Valor da célula
- `row` - Objeto completo da linha
- `index` - Índice da linha

## Nested Keys

Suporta chaves aninhadas usando notação de ponto:

```javascript
const columns = [
  { key: 'user.name', label: 'Nome do Usuário' },
  { key: 'user.profile.email', label: 'Email' }
]
```

## Estados

### Loading
```vue
<BaseTable :columns="columns" :data="data" :loading="true" />
```

### Empty State
```vue
<BaseTable
  :columns="columns"
  :data="[]"
  empty-message="Nenhum item encontrado"
/>
```

## Eventos

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `rowClick` | `(row, index)` | Emitido quando uma linha é clicada |

```vue
<BaseTable
  :columns="columns"
  :data="data"
  @rowClick="handleRowClick"
/>
```

## Exemplo Completo (AdminUserView)

```vue
<script setup>
const tableColumns = [
  { key: 'name', label: 'Nome', width: '25%' },
  { key: 'email', label: 'Email', width: '30%' },
  { key: 'role', label: 'Role', width: '20%' },
  { key: 'actions', label: 'Ações', width: '25%', align: 'right' }
]
</script>

<template>
  <BaseTable
    :columns="tableColumns"
    :data="users"
    :loading="isLoading"
    empty-message="Nenhum usuário encontrado"
  >
    <template #cell-email="{ value }">
      <span class="text-muted-foreground">{{ value }}</span>
    </template>

    <template #cell-role="{ value }">
      <span class="badge">{{ value }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex gap-2 justify-end">
        <BaseButton @click="edit(row)" size="sm">
          <Edit class="h-4 w-4" />
        </BaseButton>
        <BaseButton @click="remove(row.id)" size="sm">
          <Trash class="h-4 w-4" />
        </BaseButton>
      </div>
    </template>
  </BaseTable>
</template>
```

## Estilização

O componente usa as cores do sistema de temas:

- `border` - Bordas
- `muted` - Background do header
- `foreground` - Texto
- `muted-foreground` - Texto secundário

## Responsividade

A tabela possui `overflow-x-auto` para rolagem horizontal em telas pequenas.
