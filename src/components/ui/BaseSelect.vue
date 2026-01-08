<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Selecione...'
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const selectClasses = computed(() => {
  const base = 'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  const errorClass = props.error ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
  return `${base} ${errorClass}`
})

const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block"
    >
      {{ label }}
      <span v-if="required" class="text-destructive ml-1">*</span>
    </label>
    <select
      :value="modelValue"
      :disabled="disabled"
      :class="selectClasses"
      @change="handleChange"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="text-sm text-destructive mt-1">{{ error }}</p>
  </div>
</template>
