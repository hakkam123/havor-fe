import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'

type PaginatedSource<T> = ComputedRef<T[]> | Ref<T[]>

export const ADMIN_PAGE_SIZE_OPTIONS = [1, 5, 10, 25, 100]

export function useAdminPagination<T>(items?: PaginatedSource<T>, initialPageSize = 10) {
  const currentPage = ref(1)
  const pageSize = ref(ADMIN_PAGE_SIZE_OPTIONS.includes(initialPageSize) ? initialPageSize : 10)

  const totalItems = computed(() => items?.value.length || 0)
  const pageCount = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))
  const paginatedItems = computed(() => items?.value || [])

  watch(pageCount, (count) => {
    if (currentPage.value > count) currentPage.value = count
    if (currentPage.value < 1) currentPage.value = 1
  }, { immediate: true })

  watch(pageSize, () => {
    currentPage.value = 1
  })

  return {
    currentPage,
    pageSize,
    pageSizeOptions: ADMIN_PAGE_SIZE_OPTIONS,
    totalItems,
    pageCount,
    paginatedItems
  }
}
