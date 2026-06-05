import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'

type PaginatedSource<T> = ComputedRef<T[]> | Ref<T[]>

export const useAdminPagination = <T>(items: PaginatedSource<T>, pageSize = 10) => {
  const currentPage = ref(1)
  const normalizedPageSize = Math.max(1, pageSize)

  const totalItems = computed(() => items.value.length)
  const pageCount = computed(() => Math.max(1, Math.ceil(totalItems.value / normalizedPageSize)))
  const paginatedItems = computed(() => {
    const safePage = Math.min(Math.max(currentPage.value, 1), pageCount.value)
    const startIndex = (safePage - 1) * normalizedPageSize

    return items.value.slice(startIndex, startIndex + normalizedPageSize)
  })

  watch(pageCount, (count) => {
    if (currentPage.value > count) currentPage.value = count
    if (currentPage.value < 1) currentPage.value = 1
  }, { immediate: true })

  return {
    currentPage,
    pageSize: normalizedPageSize,
    totalItems,
    pageCount,
    paginatedItems
  }
}
