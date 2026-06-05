import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'

type PaginatedSource<T> = ComputedRef<T[]> | Ref<T[]>
type MaybeRef<T> = ComputedRef<T> | Ref<T>

type AdminPaginationOptions = {
  totalItems?: MaybeRef<number>
  serverSide?: MaybeRef<boolean>
}

export const ADMIN_PAGE_SIZE_OPTIONS = [1, 5, 10, 25, 100]

export function useAdminPagination<T>(
  items?: PaginatedSource<T>,
  initialPageSize = 10,
  options: AdminPaginationOptions = {}
) {
  const currentPage = ref(1)
  const pageSize = ref(ADMIN_PAGE_SIZE_OPTIONS.includes(initialPageSize) ? initialPageSize : 10)

  const isServerSide = computed(() => Boolean(options.serverSide?.value))
  const totalItems = computed(() => Math.max(0, Number(options.totalItems?.value ?? items?.value.length ?? 0) || 0))
  const pageCount = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))
  const paginatedItems = computed(() => {
    const source = items?.value || []
    if (isServerSide.value) return source

    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return source.slice(startIndex, endIndex)
  })

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
