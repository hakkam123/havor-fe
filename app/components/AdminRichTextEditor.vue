<template>
  <ClientOnly>
    <Editor
      v-if="useTinymce"
      :api-key="tinymceApiKey"
      cloud-channel="8"
      :model-value="modelValue"
      :init="tinymceConfig"
      @update:model-value="emit('update:modelValue', $event)"
      @on-init="handleTinymceInit"
    />

    <div v-else class="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-white">
      <div class="flex flex-wrap gap-2 border-b border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-3 py-2">
        <button v-for="action in actions" :key="action.label" type="button" class="admin-secondary-btn px-3 py-1.5 text-xs" @click="runCommand(action.command)">
          {{ action.label }}
        </button>
      </div>

      <div
        ref="editorRef"
        class="custom-scrollbar min-h-[240px] max-h-[420px] overflow-y-auto px-4 py-3 text-sm leading-7 text-slate-700 outline-none"
        contenteditable="true"
        role="textbox"
        aria-multiline="true"
        :aria-label="ariaLabel"
        @input="syncFromEditor"
        @blur="syncFromEditor"
        @paste.prevent="handlePaste"
      ></div>
    </div>

    <template #fallback>
      <div class="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-white">
        <div class="flex flex-wrap gap-2 border-b border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-3 py-2">
          <span class="admin-secondary-btn px-3 py-1.5 text-xs">B</span>
          <span class="admin-secondary-btn px-3 py-1.5 text-xs">I</span>
          <span class="admin-secondary-btn px-3 py-1.5 text-xs">UL</span>
          <span class="admin-secondary-btn px-3 py-1.5 text-xs">OL</span>
        </div>
        <div class="min-h-[240px] px-4 py-3 text-sm leading-7 text-slate-400">
          Loading editor...
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  ariaLabel?: string
}>(), {
  ariaLabel: 'Rich text editor'
})

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const editorRef = ref<HTMLElement | null>(null)
const config = useRuntimeConfig()
const tinymceApiKey = String(config.public.tinymceApiKey || '').trim()
const isClient = ref(false)
const tinymceLoaded = ref(false)
const tinymceLoadFailed = ref(false)
let tinymceLoadTimer: ReturnType<typeof window.setTimeout> | null = null

const useTinymce = computed(() => isClient.value && Boolean(tinymceApiKey) && !tinymceLoadFailed.value)
const tinymceConfig = {
  height: 320,
  menubar: false,
  branding: false,
  promotion: false,
  plugins: [
    'advlist',
    'autolink',
    'lists',
    'link',
    'charmap',
    'preview',
    'anchor',
    'searchreplace',
    'visualblocks',
    'code',
    'fullscreen',
    'insertdatetime',
    'media',
    'table',
    'help',
    'wordcount'
  ],
  toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist | link | removeformat | code',
  content_style: 'body { font-family: Plus Jakarta Sans, Arial, sans-serif; font-size: 14px; color: #0f172a; line-height: 1.7; }'
}
const actions = [
  { label: 'B', command: 'bold' },
  { label: 'I', command: 'italic' },
  { label: 'UL', command: 'insertUnorderedList' },
  { label: 'OL', command: 'insertOrderedList' }
]

const setEditorHtml = async (value: string) => {
  await nextTick()
  if (!editorRef.value || editorRef.value.innerHTML === value) return
  editorRef.value.innerHTML = value || ''
}

const syncFromEditor = () => {
  emit('update:modelValue', editorRef.value?.innerHTML || '')
}

const runCommand = (command: string) => {
  editorRef.value?.focus()
  document.execCommand(command, false)
  syncFromEditor()
}

const handlePaste = (event: ClipboardEvent) => {
  const text = event.clipboardData?.getData('text/plain') || ''
  document.execCommand('insertText', false, text)
  syncFromEditor()
}

const handleTinymceInit = () => {
  tinymceLoaded.value = true

  if (!tinymceLoadTimer) return
  window.clearTimeout(tinymceLoadTimer)
  tinymceLoadTimer = null
}

onMounted(() => {
  isClient.value = true
  setEditorHtml(props.modelValue || '')

  if (!tinymceApiKey) return

  tinymceLoadTimer = window.setTimeout(() => {
    const tinymce = (window as Window & { tinymce?: unknown }).tinymce
    if (tinymceLoaded.value || tinymce) return
    tinymceLoadFailed.value = true
  }, 8000)
})

onBeforeUnmount(() => {
  if (!tinymceLoadTimer) return
  window.clearTimeout(tinymceLoadTimer)
  tinymceLoadTimer = null
})

watch(() => props.modelValue, (value) => {
  if (editorRef.value?.innerHTML === value) return
  setEditorHtml(value || '')
})

watch(useTinymce, (enabled) => {
  if (enabled) return
  setEditorHtml(props.modelValue || '')
})
</script>
