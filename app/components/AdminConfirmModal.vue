<template>
  <AdminModal
    :model-value="modelValue"
    :title="title"
    :can-close="!isLoading"
    kicker="Warning"
    max-width-class="max-w-md"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex gap-4">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-rose-50 text-rose-600">
        <AlertTriangle class="h-6 w-6" />
      </div>
      <div>
        <p class="text-sm leading-7 text-slate-600">{{ message }}</p>
        <p v-if="detail" class="mt-2 text-xs font-medium leading-5 text-slate-400">{{ detail }}</p>
      </div>
    </div>

    <template #footer>
      <button class="admin-secondary-btn" :disabled="isLoading" @click="emit('update:modelValue', false)">
        Cancel
      </button>
      <button class="inline-flex items-center justify-center gap-2 rounded-[10px] bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60" :disabled="isLoading" @click="emit('confirm')">
        {{ isLoading ? loadingLabel : confirmLabel }}
      </button>
    </template>
  </AdminModal>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'

withDefaults(defineProps<{
  modelValue: boolean
  title: string
  message: string
  detail?: string
  confirmLabel?: string
  loadingLabel?: string
  isLoading?: boolean
}>(), {
  detail: '',
  confirmLabel: 'Delete',
  loadingLabel: 'Deleting...',
  isLoading: false
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
  confirm: []
}>()
</script>
