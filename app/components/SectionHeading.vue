<template>
  <div
    class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
    :class="centered ? 'text-center lg:text-center' : ''"
  >
    <div :class="centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'">
      <p v-if="kicker" class="brand-kicker">{{ kicker }}</p>
      <h2 class="brand-heading">{{ title }}</h2>
      <p v-if="description" class="brand-copy">{{ description }}</p>
    </div>

    <div v-if="$slots.actions" :class="centered ? 'mx-auto' : ''">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  kicker?: string
  title: string
  description?: string
  centered?: boolean
}>()
</script>
