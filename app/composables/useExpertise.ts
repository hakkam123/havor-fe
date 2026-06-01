import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiExpertise, Expertise } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

const EXPERTISE_QUERY_KEY = ['expertise'] as const

export const useExpertise = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)

  const normalizeExpertise = (item: ApiExpertise): Expertise => ({
    id: Number(item.id),
    name: String(item.name || ''),
    description: String(item.description || ''),
    slug: String(item.slug || toSlug(item.name)),
    icon_url: resolveAssetUrl(item.icon_url)
  })

  const loadExpertise = async () => {
    const res = await apiFetch<ApiExpertise[]>('/expertise')
    return (res || []).map(normalizeExpertise)
  }

  const expertiseQuery = useQuery({
    queryKey: EXPERTISE_QUERY_KEY,
    queryFn: loadExpertise
  })

  const expertise = computed(() => expertiseQuery.data.value || [])
  const isLoading = computed(() => expertiseQuery.isLoading.value || expertiseQuery.isFetching.value)
  const error = computed(() => mutationError.value || (expertiseQuery.error.value ? 'Unable to load expertise right now.' : null))

  const toExpertiseFormData = (payload: any) => toFormData({
    name: payload.name,
    description: payload.description,
    icon_url: payload.iconFile ?? payload.icon_url
  })

  const fetchExpertise = async () => {
    mutationError.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: EXPERTISE_QUERY_KEY,
        queryFn: loadExpertise
      })
    } catch (fetchError) {
      console.error('Failed to fetch expertise', fetchError)
      mutationError.value = 'Unable to load expertise right now.'
      return []
    }
  }

  const invalidateExpertise = () => queryClient.invalidateQueries({ queryKey: EXPERTISE_QUERY_KEY })

  const createExpertiseMutation = useMutation({
    mutationFn: (payload: any) => apiFetch<ApiExpertise>('/expertise', {
      method: 'POST',
      body: toExpertiseFormData(payload)
    }),
    onSuccess: () => invalidateExpertise()
  })

  const updateExpertiseMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: any }) => apiFetch(`/expertise/${id}`, {
      method: 'PUT',
      body: toExpertiseFormData(payload)
    }),
    onSuccess: () => invalidateExpertise()
  })

  const deleteExpertiseMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/expertise/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: EXPERTISE_QUERY_KEY })
      const previousExpertise = queryClient.getQueryData<Expertise[]>(EXPERTISE_QUERY_KEY)
      queryClient.setQueryData<Expertise[]>(EXPERTISE_QUERY_KEY, (current = []) => current.filter((item) => item.id !== id))
      return { previousExpertise }
    },
    onError: (_error, _id, context) => {
      if (context?.previousExpertise) {
        queryClient.setQueryData(EXPERTISE_QUERY_KEY, context.previousExpertise)
      }
    },
    onSettled: () => invalidateExpertise()
  })

  const createExpertise = async (payload: any) => {
    const res = await createExpertiseMutation.mutateAsync(payload)
    return res ? normalizeExpertise(res) : null
  }

  const updateExpertise = async (id: number, payload: any) => {
    await updateExpertiseMutation.mutateAsync({ id, payload })
    return expertise.value.find((item) => item.id === id) || null
  }

  const deleteExpertise = async (id: number) => {
    return deleteExpertiseMutation.mutateAsync(id)
  }

  return {
    expertise,
    isLoading,
    error,
    fetchExpertise,
    createExpertise,
    updateExpertise,
    deleteExpertise
  }
}
