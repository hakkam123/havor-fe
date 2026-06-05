import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiExpertise, Expertise } from '~/types/api'
import { toSlug } from '~/composables/useSlug'
import { toApiArray, toApiPaginationMeta, toQueryString, type ApiPaginationMeta } from '~/utils/apiData'

const EXPERTISE_QUERY_KEY = ['expertise'] as const

type UseExpertiseOptions = {
  immediate?: boolean
}

type ExpertiseListParams = {
  page?: number
  limit?: number
  search?: string
}

export const useExpertise = (options: UseExpertiseOptions = {}) => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)
  const manualLoading = ref(false)
  const paginationMeta = ref<ApiPaginationMeta>(toApiPaginationMeta(null))

  const normalizeExpertise = (item: ApiExpertise): Expertise => ({
    id: Number(item.id),
    name: String(item.name || ''),
    description: String(item.description || ''),
    slug: String(item.slug || toSlug(item.name)),
    icon_url: resolveAssetUrl(item.icon_url)
  })

  const loadExpertise = async (params: ExpertiseListParams = {}) => {
    const res = await apiFetch<unknown>(`/expertise${toQueryString(params)}`)
    paginationMeta.value = toApiPaginationMeta(res, Number(params.limit) || 10)
    return toApiArray<ApiExpertise>(res).map(normalizeExpertise)
  }

  const expertiseQuery = useQuery({
    queryKey: EXPERTISE_QUERY_KEY,
    queryFn: () => loadExpertise(),
    enabled: options.immediate !== false
  })

  const expertise = computed(() => expertiseQuery.data.value || [])
  const isLoading = computed(() => manualLoading.value || expertiseQuery.isLoading.value || expertiseQuery.isFetching.value)
  const error = computed(() => mutationError.value || (expertiseQuery.error.value ? 'Unable to load expertise right now.' : null))

  const toExpertiseFormData = (payload: any) => toFormData({
    name: payload.name,
    description: payload.description,
    icon_url: payload.iconFile ?? payload.icon_url
  })

  const fetchExpertise = async (params: ExpertiseListParams = {}) => {
    mutationError.value = null
    manualLoading.value = true
    try {
      const items = await loadExpertise(params)
      queryClient.setQueryData(EXPERTISE_QUERY_KEY, items)
      return items
    } catch (fetchError) {
      console.error('Failed to fetch expertise', fetchError)
      mutationError.value = 'Unable to load expertise right now.'
      return []
    } finally {
      manualLoading.value = false
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
    paginationMeta,
    fetchExpertise,
    createExpertise,
    updateExpertise,
    deleteExpertise
  }
}
