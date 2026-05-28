<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-[120]">
      <div class="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" @click="handleBackdropClick"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <section
          ref="dialogRef"
          :aria-labelledby="titleId"
          aria-modal="true"
          class="admin-modal-card w-full"
          :class="maxWidthClass"
          role="dialog"
          tabindex="-1"
          @click.stop
        >
          <div class="flex items-center justify-between border-b border-[var(--admin-border)] px-6 py-4">
            <div>
              <p v-if="kicker" class="admin-kicker">{{ kicker }}</p>
              <h2 :id="titleId" class="mt-1 text-xl font-semibold text-slate-900">{{ title }}</h2>
            </div>

            <button
              class="admin-icon-btn"
              :disabled="!canClose"
              aria-label="Close modal"
              @click="close"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <div class="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
            <slot />
          </div>

          <div v-if="$slots.footer" class="flex justify-end gap-3 border-t border-[var(--admin-border)] px-6 py-4">
            <slot name="footer" />
          </div>
        </section>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  kicker?: string
  maxWidthClass?: string
  canClose?: boolean
}>(), {
  kicker: '',
  maxWidthClass: 'max-w-3xl',
  canClose: true
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
  close: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
const titleId = computed(() => `admin-modal-title-${props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)
let previousOverflow = ''

const close = () => {
  if (!props.canClose) return
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  close()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

watch(() => props.modelValue, async (isOpen) => {
  if (!import.meta.client) return

  if (isOpen) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeydown)
    await nextTick()
    dialogRef.value?.focus()
    return
  }

  document.body.style.overflow = previousOverflow
  document.removeEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = previousOverflow
  document.removeEventListener('keydown', handleKeydown)
})
</script>
