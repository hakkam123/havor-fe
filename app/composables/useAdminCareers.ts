import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiCareer, Career } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

const CAREERS_QUERY_KEY = ['careers'] as const

export const useAdminCareers = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)

  const normalizeCareerItem = (item: ApiCareer): Career => ({
    id: Number(item.id),
    job_title: String(item.job_title || ''),
    job_description: String(item.job_description || ''),
    excerpt: String(item.job_description || '').replace(/<[^>]*>?/gm, '').trim().slice(0, 180),
    thumbnail: resolveAssetUrl(item.thumbnail),
    categoryId: item.categoryId === null || item.categoryId === undefined || item.categoryId === '' ? null : Number(item.categoryId),
    categoryName: String(item.categoryName ?? item.category_name ?? ''),
    slug: toSlug(item.job_title)
  })

  const loadCareers = async () => {
    const res = await apiFetch<ApiCareer[]>('/careers')
    return (res || []).map(normalizeCareerItem)
  }

  const careersQuery = useQuery({
    queryKey: CAREERS_QUERY_KEY,
    queryFn: loadCareers
  })

  const careers = computed(() => careersQuery.data.value || [])
  const isLoading = computed(() => careersQuery.isLoading.value || careersQuery.isFetching.value)
  const error = computed(() => mutationError.value || (careersQuery.error.value ? 'Unable to load careers right now.' : null))

  const toCareerFormData = (payload: any) => toFormData({
    job_title: payload.job_title,
    job_description: payload.job_description,
    categoryId: payload.categoryId,
    thumbnail: payload.thumbnailFile ?? payload.thumbnail
  })

  const fetchCareers = async () => {
    mutationError.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: CAREERS_QUERY_KEY,
        queryFn: loadCareers
      })
    } catch (fetchError) {
      console.error('Failed to fetch careers', fetchError)
      mutationError.value = 'Unable to load careers right now.'
      return []
    }
  }

  const invalidateCareers = () => queryClient.invalidateQueries({ queryKey: CAREERS_QUERY_KEY })

  const createCareerMutation = useMutation({
    mutationFn: (payload: any) => apiFetch<ApiCareer>('/careers', {
      method: 'POST',
      body: toCareerFormData(payload)
    }),
    onSuccess: () => invalidateCareers()
  })

  const updateCareerMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: any }) => apiFetch(`/careers/${id}`, {
      method: 'PUT',
      body: toCareerFormData(payload)
    }),
    onSuccess: () => invalidateCareers()
  })

  const deleteCareerMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/careers/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CAREERS_QUERY_KEY })
      const previousCareers = queryClient.getQueryData<Career[]>(CAREERS_QUERY_KEY)
      queryClient.setQueryData<Career[]>(CAREERS_QUERY_KEY, (current = []) => current.filter((item) => item.id !== id))
      return { previousCareers }
    },
    onError: (_error, _id, context) => {
      if (context?.previousCareers) {
        queryClient.setQueryData(CAREERS_QUERY_KEY, context.previousCareers)
      }
    },
    onSettled: () => invalidateCareers()
  })

  const createCareer = async (payload: any) => {
    const res = await createCareerMutation.mutateAsync(payload)
    return res ? normalizeCareerItem(res) : null
  }

  const updateCareer = async (id: number, payload: any) => {
    await updateCareerMutation.mutateAsync({ id, payload })
    return careers.value.find((item) => item.id === id) || null
  }

  const deleteCareer = async (id: number) => {
    return deleteCareerMutation.mutateAsync(id)
  }

  return {
    careers,
    isLoading,
    error,
    fetchCareers,
    createCareer,
    updateCareer,
    deleteCareer
  }
}
