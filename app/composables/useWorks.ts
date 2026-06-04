import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiWork, Work } from '~/types/api'
import { toSlug } from '~/composables/useSlug'
import { toApiArray } from '~/utils/apiData'

const WORKS_QUERY_KEY = ['works'] as const

export const useWorks = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)

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

  const loadWorks = async () => {
    const res = await apiFetch<unknown>('/works')
    return toApiArray<ApiWork>(res).map(normalizeWork)
  }

  const worksQuery = useQuery({
    queryKey: WORKS_QUERY_KEY,
    queryFn: loadWorks
  })

  const works = computed(() => worksQuery.data.value || [])
  const isLoading = computed(() => worksQuery.isLoading.value || worksQuery.isFetching.value)
  const error = computed(() => mutationError.value || (worksQuery.error.value ? 'Unable to load works right now.' : null))

  const toWorkFormData = (payload: any) => toFormData({
    title: payload.title,
    description: payload.description,
    client: payload.client,
    year: payload.year,
    categoryId: payload.categoryId,
    image_url: payload.imageFile ?? payload.image_url
  })

  const fetchWorks = async () => {
    mutationError.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: WORKS_QUERY_KEY,
        queryFn: loadWorks
      })
    } catch (fetchError) {
      console.error('Failed to fetch works', fetchError)
      mutationError.value = 'Unable to load works right now.'
      return []
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
    fetchWorks,
    createWork,
    updateWork,
    deleteWork
  }
}
