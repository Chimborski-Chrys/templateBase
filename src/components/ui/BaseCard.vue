<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div v-if="title || subtitle || $slots.header" class="flex flex-col space-y-1.5 p-6">
      <slot name="header">
        <h3 v-if="title" class="text-2xl font-semibold leading-none tracking-tight">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-sm text-muted-foreground">
          {{ subtitle }}
        </p>
      </slot>
    </div>
    <div class="p-6 pt-0">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="flex items-center p-6 pt-0">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
