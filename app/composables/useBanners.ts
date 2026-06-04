import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiBanner, Banner } from '~/types/api'
import { toSlug } from '~/composables/useSlug'
import { toApiArray } from '~/utils/apiData'

const BANNERS_QUERY_KEY = ['banners'] as const

export const useBanners = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)
  const pageBanners = ref<Record<string, Banner>>({})

  const normalizePageName = (value?: string | null) =>
    String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, '-')

  const normalizeBanner = (item: ApiBanner): Banner => ({
    id: Number(item.id),
    title: String(item.title || ''),
    subtitle: String(item.subtitle || ''),
    media_type: String(item.media_type || 'image'),
    media_url: resolveAssetUrl(item.media_url),
    page_name: normalizePageName(item.page_name),
    slug: String(item.slug || toSlug(item.page_name || item.title))
  })

  const setPageBanner = (item?: Banner | null) => {
    if (!item?.page_name) return
    pageBanners.value[item.page_name] = item
  }

  const bannerPageQueryKey = (pageName: string) => ['banners', 'page', normalizePageName(pageName)] as const

  const loadBanners = async () => {
    const res = await apiFetch<unknown>('/banners')
    return toApiArray<ApiBanner>(res).map(normalizeBanner)
  }

  const bannersQuery = useQuery({
    queryKey: BANNERS_QUERY_KEY,
    queryFn: loadBanners
  })

  const banners = computed(() => bannersQuery.data.value || [])
  const isLoading = computed(() => bannersQuery.isLoading.value || bannersQuery.isFetching.value)
  const error = computed(() => mutationError.value || (bannersQuery.error.value ? 'Unable to load banners right now.' : null))

  watch(
    banners,
    (items) => {
      pageBanners.value = items.reduce<Record<string, Banner>>((acc, item) => {
        if (item.page_name) {
          acc[item.page_name] = item
        }

        return acc
      }, {})
    },
    { immediate: true }
  )

  const findBannerByPage = (...pageNames: string[]) => {
    const normalizedNames = pageNames.map(normalizePageName).filter(Boolean)
    if (!normalizedNames.length) return {}

    return normalizedNames
      .map((pageName) =>
        pageBanners.value[pageName]
        || queryClient.getQueryData<Banner>(bannerPageQueryKey(pageName))
        || banners.value.find((item) => item.page_name === pageName)
      )
      .find(Boolean) || {}
  }

  const useBannerPage = (...pageNames: string[]) => computed(() => findBannerByPage(...pageNames))

  const fetchBanners = async () => {
    mutationError.value = null
    try {
      const items = await queryClient.fetchQuery({
        queryKey: BANNERS_QUERY_KEY,
        queryFn: loadBanners
      })
      items.forEach(setPageBanner)
      return items
    } catch (fetchError) {
      console.error('Failed to fetch banners', fetchError)
      mutationError.value = 'Unable to load banners right now.'
      return []
    }
  }

  const fetchBannerPage = async (pageName: string) => {
    const normalizedPageName = normalizePageName(pageName)
    if (!normalizedPageName) return null

    mutationError.value = null
    try {
      const normalizedBanner = await queryClient.ensureQueryData({
        queryKey: bannerPageQueryKey(normalizedPageName),
        queryFn: async () => {
          const res = await apiFetch<unknown>(`/banners/${normalizedPageName}`)
          const banner = toApiArray<ApiBanner>(res)[0] || (res && typeof res === 'object' ? res as ApiBanner : null)
          return banner ? normalizeBanner(banner) : null
        }
      })

      if (!normalizedBanner) {
        delete pageBanners.value[normalizedPageName]
        return null
      }

      setPageBanner(normalizedBanner)
      return normalizedBanner
    } catch (fetchError) {
      delete pageBanners.value[normalizedPageName]

      if ((fetchError as any)?.response?.status === 404 || (fetchError as any)?.status === 404) {
        return null
      }

      console.error(`Failed to fetch banner for page "${normalizedPageName}"`, fetchError)
      mutationError.value = 'Unable to load banner content right now.'
      return null
    }
  }

  const toBannerFormData = (payload: any) => toFormData({
    page_name: payload.page_name,
    title: payload.title,
    subtitle: payload.subtitle,
    media_type: payload.media_type,
    media_url: payload.mediaFile ?? payload.media_url
  })

  const invalidateBanners = () => queryClient.invalidateQueries({ queryKey: BANNERS_QUERY_KEY })

  const createBannerMutation = useMutation({
    mutationFn: (payload: any) => apiFetch<ApiBanner>('/banners', {
      method: 'POST',
      body: toBannerFormData(payload)
    }),
    onSuccess: () => invalidateBanners()
  })

  const updateBannerMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: any }) => apiFetch(`/banners/${id}`, {
      method: 'PUT',
      body: toBannerFormData(payload)
    }),
    onSuccess: () => invalidateBanners()
  })

  const deleteBannerMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/banners/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: BANNERS_QUERY_KEY })
      const previousBanners = queryClient.getQueryData<Banner[]>(BANNERS_QUERY_KEY)
      queryClient.setQueryData<Banner[]>(BANNERS_QUERY_KEY, (current = []) => current.filter((item) => item.id !== id))
      return { previousBanners }
    },
    onError: (_error, _id, context) => {
      if (context?.previousBanners) {
        queryClient.setQueryData(BANNERS_QUERY_KEY, context.previousBanners)
      }
    },
    onSettled: () => invalidateBanners()
  })

  const createBanner = async (payload: any) => {
    const res = await createBannerMutation.mutateAsync(payload)
    return res ? normalizeBanner(res) : null
  }

  const updateBanner = async (id: number, payload: any) => {
    await updateBannerMutation.mutateAsync({ id, payload })
    return banners.value.find((item) => item.id === id) || null
  }

  const deleteBanner = async (id: number) => {
    return deleteBannerMutation.mutateAsync(id)
  }

  return {
    banners,
    isLoading,
    error,
    fetchBanners,
    fetchBannerPage,
    findBannerByPage,
    useBannerPage,
    createBanner,
    updateBanner,
    deleteBanner
  }
}
