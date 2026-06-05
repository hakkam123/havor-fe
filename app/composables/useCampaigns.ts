import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiCampaignItem, CampaignItem } from '~/types/api'
import { toSlug } from '~/composables/useSlug'
import { toApiArray, toApiPaginationMeta, toQueryString, type ApiPaginationMeta } from '~/utils/apiData'

type UseCampaignOptions = {
  includeDrafts?: boolean
  immediate?: boolean
}

type CampaignListParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
  category?: string
}

export const useCampaigns = (options: UseCampaignOptions = {}) => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)
  const manualLoading = ref(false)
  const paginationMeta = ref<ApiPaginationMeta>(toApiPaginationMeta(null))
  const includeDrafts = Boolean(options.includeDrafts)
  const campaignQueryKey = ['campaigns', { includeDrafts }] as const

  const stripHtml = (value?: string | null) => (value || '').replace(/<[^>]*>?/gm, '').trim()

  const toPublishedFlag = (value: ApiCampaignItem['is_published']) => {
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value === 1
    if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true'
    return false
  }

  const normalizeCampaignItem = (item: ApiCampaignItem): CampaignItem => ({
    id: Number(item.id),
    title: String(item.title || ''),
    slug: String(item.slug || toSlug(item.title)),
    content: String(item.content || ''),
    category: String(item.category || 'Campaign'),
    is_published: toPublishedFlag(item.is_published),
    image_url: resolveAssetUrl(item.image_url),
    excerpt: stripHtml(item.content).slice(0, 160),
    readTime: Math.max(1, Math.ceil(stripHtml(item.content).split(/\s+/).filter(Boolean).length / 180)),
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null
  })

  const loadCampaigns = async (params: CampaignListParams = {}) => {
    const res = await apiFetch<unknown>(`/campaigns${toQueryString(params)}`)
    paginationMeta.value = toApiPaginationMeta(res, Number(params.limit) || 10)
    const normalizedItems = toApiArray<ApiCampaignItem>(res).map(normalizeCampaignItem)
    return includeDrafts ? normalizedItems : normalizedItems.filter((item) => item.is_published)
  }

  const campaignsQuery = useQuery({
    queryKey: campaignQueryKey,
    queryFn: () => loadCampaigns(),
    enabled: options.immediate !== false
  })

  const campaigns = computed(() => campaignsQuery.data.value || [])
  const isLoading = computed(() => manualLoading.value || campaignsQuery.isLoading.value || campaignsQuery.isFetching.value)
  const error = computed(() => mutationError.value || (campaignsQuery.error.value ? 'Unable to load campaigns right now.' : null))

  const fetchCampaigns = async (params: CampaignListParams = {}) => {
    mutationError.value = null
    manualLoading.value = true
    try {
      const items = await loadCampaigns(params)
      queryClient.setQueryData(campaignQueryKey.value, items)
      return items
    } catch (fetchError) {
      console.error('Failed to fetch campaigns', fetchError)
      mutationError.value = 'Unable to load campaigns right now.'
      return []
    } finally {
      manualLoading.value = false
    }
  }

  const fetchCampaignBySlug = async (slug: string) => {
    const normalizedSlug = String(slug || '').trim()
    if (!normalizedSlug) return null

    mutationError.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: ['campaigns', 'slug', normalizedSlug, { includeDrafts }],
        queryFn: async () => {
          const res = await apiFetch<ApiCampaignItem>(`/campaigns/${normalizedSlug}`)
          const item = normalizeCampaignItem(res)
          return !includeDrafts && !item.is_published ? null : item
        }
      })
    } catch (fetchError) {
      console.error(`Failed to fetch campaign "${normalizedSlug}"`, fetchError)
      mutationError.value = 'Unable to load the selected campaign right now.'
      return null
    }
  }

  const toCampaignFormData = (payload: any) => toFormData({
    title: payload.title,
    slug: payload.slug,
    content: payload.content,
    category: payload.category,
    is_published: payload.is_published,
    image_url: payload.imageFile ?? payload.image_url
  })

  const invalidateCampaigns = () => queryClient.invalidateQueries({ queryKey: ['campaigns'] })

  const createCampaignMutation = useMutation({
    mutationFn: (payload: any) => apiFetch<ApiCampaignItem>('/campaigns', {
      method: 'POST',
      body: toCampaignFormData(payload)
    }),
    onSuccess: () => invalidateCampaigns()
  })

  const updateCampaignMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: any }) => apiFetch(`/campaigns/${id}`, {
      method: 'PUT',
      body: toCampaignFormData(payload)
    }),
    onSuccess: () => invalidateCampaigns()
  })

  const deleteCampaignMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/campaigns/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['campaigns'] })
      const previousCampaigns = queryClient.getQueriesData<CampaignItem[]>({ queryKey: ['campaigns'] })

      previousCampaigns.forEach(([queryKey, current]) => {
        if (Array.isArray(current)) {
          queryClient.setQueryData<CampaignItem[]>(queryKey, current.filter((item) => item.id !== id))
        }
      })

      return { previousCampaigns }
    },
    onError: (_error, _id, context) => {
      context?.previousCampaigns?.forEach(([queryKey, value]) => {
        queryClient.setQueryData(queryKey, value)
      })
    },
    onSettled: () => invalidateCampaigns()
  })

  const createCampaign = async (payload: any) => {
    const res = await createCampaignMutation.mutateAsync(payload)
    return res ? normalizeCampaignItem(res) : null
  }

  const updateCampaign = async (id: number, payload: any) => {
    await updateCampaignMutation.mutateAsync({ id, payload })
    return campaigns.value.find((item) => item.id === id) || null
  }

  const deleteCampaign = async (id: number) => {
    return deleteCampaignMutation.mutateAsync(id)
  }

  return {
    campaigns,
    isLoading,
    error,
    paginationMeta,
    fetchCampaigns,
    fetchCampaignBySlug,
    createCampaign,
    updateCampaign,
    deleteCampaign
  }
}
