<template>
  <nav
    class="flex justify-end border-t border-[var(--admin-border)] bg-white px-4 py-4 sm:px-5"
    aria-label="Table pagination"
  >
    <div class="flex flex-wrap items-center justify-end gap-3 text-xs font-medium text-slate-500">
      <div class="flex items-center gap-2">
        <span>Rows</span>
        <select
          :value="normalizedPageSize"
          class="rounded-[10px] border border-[var(--admin-border)] bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-[var(--admin-accent)] focus:ring-4 focus:ring-[var(--admin-accent-soft)]"
          aria-label="Rows per page"
          @change="updatePageSize"
        >
          <option v-for="option in pageSizeOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>

      <p class="min-w-[9rem] text-right">
        <span v-if="normalizedTotal">Showing {{ startItem }}-{{ endItem }} of {{ normalizedTotal }} {{ label }}</span>
        <span v-else>Showing 0 of 0 {{ label }}</span>
      </p>

      <button
        type="button"
        class="inline-flex h-9 items-center justify-center gap-2 rounded-[10px] border border-[var(--admin-border)] bg-white px-3 font-semibold text-slate-600 transition hover:border-[var(--admin-accent)] hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="safePage === 1"
        @click="goToPage(safePage - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
        Previous
      </button>

      <span class="inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] border border-[var(--admin-accent)] bg-[var(--admin-accent)] px-3 font-semibold text-white">
        {{ safePage }}
      </span>

      <button
        type="button"
        class="inline-flex h-9 items-center justify-center gap-2 rounded-[10px] border border-[var(--admin-border)] bg-white px-3 font-semibold text-slate-600 transition hover:border-[var(--admin-accent)] hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="safePage === pageCount"
        @click="goToPage(safePage + 1)"
      >
        Next
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  total: number
  page: number
  pageSize?: number
  label?: string
  pageSizeOptions?: number[]
}>(), {
  pageSize: 10,
  label: 'entries',
  pageSizeOptions: () => [1, 5, 10, 25, 100]
})

const emit = defineEmits<{
  'update:page': [value: number]
  'update:pageSize': [value: number]
}>()

const normalizedTotal = computed(() => Math.max(0, Number(props.total) || 0))
const normalizedPageSize = computed(() => Math.max(1, Number(props.pageSize) || 10))
const pageCount = computed(() => Math.max(1, Math.ceil(normalizedTotal.value / normalizedPageSize.value)))
const safePage = computed(() => clampPage(props.page))
const startItem = computed(() => normalizedTotal.value ? ((safePage.value - 1) * normalizedPageSize.value) + 1 : 0)
const endItem = computed(() => Math.min(safePage.value * normalizedPageSize.value, normalizedTotal.value))

function clampPage(value: number) {
  return Math.min(Math.max(1, Number(value) || 1), pageCount.value)
}

function goToPage(pageNumber: number) {
  emit('update:page', clampPage(pageNumber))
}

function updatePageSize(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value) || 10
  emit('update:pageSize', value)
}

watch(safePage, (pageNumber) => {
  if (pageNumber !== props.page) emit('update:page', pageNumber)
})
</script>
