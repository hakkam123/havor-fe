import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiWork, Work } from '~/types/api'
import { toSlug } from '~/composables/useSlug'
import { toApiArray, toApiPaginationMeta, toQueryString, type ApiPaginationMeta } from '~/utils/apiData'

const WORKS_QUERY_KEY = ['works'] as const

type UseWorksOptions = {
  immediate?: boolean
}

type WorkListParams = {
  page?: number
  limit?: number
  search?: string
  categoryId?: string | number
  category?: string
}

export const useWorks = (options: UseWorksOptions = {}) => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)
  const manualLoading = ref(false)
  const paginationMeta = ref<ApiPaginationMeta>(toApiPaginationMeta(null))

  const normalizeWork = (item: ApiWork): Work => ({
    id: Number(item.id),
    title: String(item.title || ''),
    description: String(item.description || ''),
    client: String(item.client || ''),
    year: item.year === null || item.year === undefined || item.year === '' ? null : Number(item.year),
    slug: String(item.slug || toSlug(item.title)),
    image_url: resolveAssetUrl(item.image_url),
    categoryId: item.categoryId === null || item.categoryId === undefined || item.categoryId === '' ? null : Number(item.categoryId),
    categoryName: String(item.categoryName ?? item.category_name ?? '')
  })

  const loadWorks = async (params: WorkListParams = {}) => {
    const res = await apiFetch<unknown>(`/works${toQueryString(params)}`)
    paginationMeta.value = toApiPaginationMeta(res, Number(params.limit) || 10)
    return toApiArray<ApiWork>(res).map(normalizeWork)
  }

  const worksQuery = useQuery({
    queryKey: WORKS_QUERY_KEY,
    queryFn: () => loadWorks(),
    enabled: options.immediate !== false
  })

  const works = computed(() => worksQuery.data.value || [])
  const isLoading = computed(() => manualLoading.value || worksQuery.isLoading.value || worksQuery.isFetching.value)
  const error = computed(() => mutationError.value || (worksQuery.error.value ? 'Unable to load works right now.' : null))

  const toWorkFormData = (payload: any) => toFormData({
    title: payload.title,
    description: payload.description,
    client: payload.client,
    year: payload.year,
    categoryId: payload.categoryId,
    image_url: payload.imageFile ?? payload.image_url
  })

  const fetchWorks = async (params: WorkListParams = {}) => {
    mutationError.value = null
    manualLoading.value = true
    try {
      const items = await loadWorks(params)
      queryClient.setQueryData(WORKS_QUERY_KEY, items)
      return items
    } catch (fetchError) {
      console.error('Failed to fetch works', fetchError)
      mutationError.value = 'Unable to load works right now.'
      return []
    } finally {
      manualLoading.value = false
    }
  }

  const invalidateWorks = () => queryClient.invalidateQueries({ queryKey: WORKS_QUERY_KEY })

  const createWorkMutation = useMutation({
    mutationFn: (payload: any) => apiFetch<ApiWork>('/works', {
      method: 'POST',
      body: toWorkFormData(payload)
    }),
    onSuccess: () => invalidateWorks()
  })

  const updateWorkMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: any }) => apiFetch(`/works/${id}`, {
      method: 'PUT',
      body: toWorkFormData(payload)
    }),
    onSuccess: () => invalidateWorks()
  })

  const deleteWorkMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/works/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: WORKS_QUERY_KEY })
      const previousWorks = queryClient.getQueryData<Work[]>(WORKS_QUERY_KEY)
      queryClient.setQueryData<Work[]>(WORKS_QUERY_KEY, (current = []) => current.filter((item) => item.id !== id))
      return { previousWorks }
    },
    onError: (_error, _id, context) => {
      if (context?.previousWorks) {
        queryClient.setQueryData(WORKS_QUERY_KEY, context.previousWorks)
      }
    },
    onSettled: () => invalidateWorks()
  })

  const createWork = async (payload: any) => {
    const res = await createWorkMutation.mutateAsync(payload)
    return res ? normalizeWork(res) : null
  }

  const updateWork = async (id: number, payload: any) => {
    await updateWorkMutation.mutateAsync({ id, payload })
    return works.value.find((item) => item.id === id) || null
  }

  const deleteWork = async (id: number) => {
    return deleteWorkMutation.mutateAsync(id)
  }

  return {
    works,
    isLoading,
    error,
    paginationMeta,
    fetchWorks,
    createWork,
    updateWork,
    deleteWork
  }
}
