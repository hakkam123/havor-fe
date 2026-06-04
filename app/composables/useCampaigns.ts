import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiCampaignItem, CampaignItem } from '~/types/api'
import { toSlug } from '~/composables/useSlug'
import { toApiArray } from '~/utils/apiData'

type UseCampaignOptions = {
  includeDrafts?: boolean
}

export const useCampaigns = (options: UseCampaignOptions = {}) => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)
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

  const loadCampaigns = async () => {
    const res = await apiFetch<unknown>('/campaigns')
    const normalizedItems = toApiArray<ApiCampaignItem>(res).map(normalizeCampaignItem)
    return includeDrafts ? normalizedItems : normalizedItems.filter((item) => item.is_published)
  }

  const campaignsQuery = useQuery({
    queryKey: campaignQueryKey,
    queryFn: loadCampaigns
  })

  const campaigns = computed(() => campaignsQuery.data.value || [])
  const isLoading = computed(() => campaignsQuery.isLoading.value || campaignsQuery.isFetching.value)
  const error = computed(() => mutationError.value || (campaignsQuery.error.value ? 'Unable to load campaigns right now.' : null))

  const fetchCampaigns = async () => {
    mutationError.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: campaignQueryKey,
        queryFn: loadCampaigns
      })
    } catch (fetchError) {
      console.error('Failed to fetch campaigns', fetchError)
      mutationError.value = 'Unable to load campaigns right now.'
      return []
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
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign
  }
}
