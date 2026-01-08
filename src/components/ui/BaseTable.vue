<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
    // Formato: [{ key: 'name', label: 'Nome', width: '30%' }]
  },
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'Nenhum registro encontrado'
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  striped: {
    type: Boolean,
    default: false
  },
  hoverable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['rowClick'])

const hasData = computed(() => props.data && props.data.length > 0)

const handleRowClick = (row, index) => {
  emit('rowClick', row, index)
}

const getCellValue = (row, column) => {
  const keys = column.key.split('.')
  let value = row

  for (const key of keys) {
    value = value?.[key]
    if (value === undefined) break
  }

  return value
}
</script>

<template>
  <div class="w-full overflow-x-auto rounded-lg border border-border">
    <table class="w-full">
      <!-- Header -->
      <thead class="bg-muted/50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{ width: column.width }"
            :class="[
              'py-3 px-4 text-left text-sm font-semibold text-foreground',
              column.align === 'center' ? 'text-center' : '',
              column.align === 'right' ? 'text-right' : ''
            ]"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody>
        <!-- Loading State -->
        <tr v-if="loading">
          <td :colspan="columns.length" class="py-12 text-center">
            <div class="flex flex-col items-center justify-center gap-3">
              <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p class="text-sm text-muted-foreground">Carregando dados...</p>
            </div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="!hasData">
          <td :colspan="columns.length" class="py-12 text-center">
            <div class="flex flex-col items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 text-muted-foreground/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p class="text-sm text-muted-foreground">{{ emptyMessage }}</p>
            </div>
          </td>
        </tr>

        <!-- Data Rows -->
        <tr
          v-else
          v-for="(row, index) in data"
          :key="row[rowKey] || index"
          :class="[
            'border-t border-border transition-colors',
            hoverable ? 'hover:bg-muted/50 cursor-pointer' : '',
            striped && index % 2 === 1 ? 'bg-muted/20' : ''
          ]"
          @click="handleRowClick(row, index)"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="[
              'py-3 px-4',
              column.align === 'center' ? 'text-center' : '',
              column.align === 'right' ? 'text-right' : ''
            ]"
          >
            <!-- Custom Slot for Column -->
            <slot
              :name="`cell-${column.key}`"
              :row="row"
              :value="getCellValue(row, column)"
              :index="index"
            >
              <!-- Default Cell Content -->
              <span :class="column.class || 'text-sm'">
                {{ getCellValue(row, column) }}
              </span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
