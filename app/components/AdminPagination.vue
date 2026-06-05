<template>
  <nav
    v-if="pageCount > 1"
    class="flex flex-col gap-3 border-t border-[var(--admin-border)] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
    aria-label="Table pagination"
  >
    <p class="text-xs font-medium text-slate-500">
      Showing
      <span class="font-semibold text-slate-700">{{ startItem }}</span>-<span class="font-semibold text-slate-700">{{ endItem }}</span>
      of <span class="font-semibold text-slate-700">{{ normalizedTotal }}</span>
      {{ label }}
    </p>

    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="admin-icon-btn h-9 w-9"
        :disabled="safePage === 1"
        aria-label="Previous page"
        @click="goToPage(safePage - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>

      <button
        v-for="pageNumber in visiblePages"
        :key="pageNumber"
        type="button"
        class="inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] border px-3 text-xs font-semibold transition disabled:cursor-not-allowed"
        :class="pageNumber === safePage
          ? 'border-[var(--admin-accent)] bg-[var(--admin-accent)] text-white shadow-sm'
          : 'border-[var(--admin-border)] bg-white text-slate-600 hover:border-[var(--admin-accent)] hover:text-slate-900'"
        :aria-current="pageNumber === safePage ? 'page' : undefined"
        @click="goToPage(pageNumber)"
      >
        {{ pageNumber }}
      </button>

      <button
        type="button"
        class="admin-icon-btn h-9 w-9"
        :disabled="safePage === pageCount"
        aria-label="Next page"
        @click="goToPage(safePage + 1)"
      >
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
}>(), {
  pageSize: 10,
  label: 'entries'
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()

const normalizedTotal = computed(() => Math.max(0, Number(props.total) || 0))
const normalizedPageSize = computed(() => Math.max(1, Number(props.pageSize) || 10))
const pageCount = computed(() => Math.max(1, Math.ceil(normalizedTotal.value / normalizedPageSize.value)))
const safePage = computed(() => clampPage(props.page))
const startItem = computed(() => normalizedTotal.value ? ((safePage.value - 1) * normalizedPageSize.value) + 1 : 0)
const endItem = computed(() => Math.min(safePage.value * normalizedPageSize.value, normalizedTotal.value))

const visiblePages = computed(() => {
  const windowSize = 5
  const firstPage = Math.max(1, Math.min(safePage.value - 2, pageCount.value - windowSize + 1))
  const lastPage = Math.min(pageCount.value, firstPage + windowSize - 1)

  return Array.from({ length: lastPage - firstPage + 1 }, (_, index) => firstPage + index)
})

function clampPage(value: number) {
  return Math.min(Math.max(1, Number(value) || 1), pageCount.value)
}

function goToPage(pageNumber: number) {
  emit('update:page', clampPage(pageNumber))
}

watch(safePage, (pageNumber) => {
  if (pageNumber !== props.page) emit('update:page', pageNumber)
})
</script>
