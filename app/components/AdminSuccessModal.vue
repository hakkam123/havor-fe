<template>
  <AdminModal
    :model-value="modelValue"
    :title="title"
    :can-close="true"
    kicker="Success"
    max-width-class="max-w-md"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col items-center text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-[12px] bg-emerald-50 text-emerald-600">
        <CheckCircle2 class="h-7 w-7" />
      </div>
      <p class="mt-4 text-sm leading-7 text-slate-600">{{ message }}</p>
    </div>

    <template #footer>
      <button class="admin-primary-btn min-w-[120px]" @click="emit('update:modelValue', false)">
        {{ buttonLabel }}
      </button>
    </template>
  </AdminModal>
</template>

<script setup lang="ts">
import { CheckCircle2 } from 'lucide-vue-next'

withDefaults(defineProps<{
  modelValue: boolean
  title: string
  message: string
  buttonLabel?: string
}>(), {
  buttonLabel: 'Close'
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()
</script>
