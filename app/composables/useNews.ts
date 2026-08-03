import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiNewsItem, NewsItem } from '~/types/api'
import { toSlug } from '~/composables/useSlug'
import { toApiArray, toApiPaginationMeta, toQueryString, type ApiPaginationMeta } from '~/utils/apiData'

type UseNewsOptions = {
  includeDrafts?: boolean
  immediate?: boolean
}

type NewsListParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
  category?: string
}

export const useNews = (options: UseNewsOptions = {}) => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)
  const manualLoading = ref(false)
  const manualNews = ref<NewsItem[] | null>(null)
  const paginationMeta = ref<ApiPaginationMeta>(toApiPaginationMeta(null))
  const includeDrafts = Boolean(options.includeDrafts)
  const newsQueryKey = ['news', { includeDrafts }] as const

  const stripHtml = (value?: string | null) => (value || '').replace(/<[^>]*>?/gm, '').trim()

  const toPublishedFlag = (value: ApiNewsItem['is_published']) => {
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value === 1
    if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true'
    return false
  }

  const normalizeNewsItem = (item: ApiNewsItem): NewsItem => ({
    id: Number(item.id),
    title: String(item.title || ''),
    slug: String(item.slug || toSlug(item.title)),
    content: String(item.content || ''),
    category: String(item.category || 'News'),
    is_published: toPublishedFlag(item.is_published),
    image_url: resolveAssetUrl(item.image_url),
    excerpt: stripHtml(item.content).slice(0, 160),
    readTime: Math.max(1, Math.ceil(stripHtml(item.content).split(/\s+/).filter(Boolean).length / 180)),
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null
  })

  const loadNews = async (params: NewsListParams = {}) => {
    const res = await apiFetch<unknown>(`/news${toQueryString(params)}`)
    paginationMeta.value = toApiPaginationMeta(res, Number(params.limit) || 10)
    const normalizedItems = toApiArray<ApiNewsItem>(res).map(normalizeNewsItem)
    return includeDrafts ? normalizedItems : normalizedItems.filter((item) => item.is_published)
  }

  const newsQuery = useQuery({
    queryKey: newsQueryKey,
    queryFn: () => loadNews(),
    enabled: options.immediate !== false
  })

  const news = computed(() => manualNews.value || newsQuery.data.value || [])
  const isLoading = computed(() => manualLoading.value || newsQuery.isLoading.value || newsQuery.isFetching.value)
  const error = computed(() => mutationError.value || (newsQuery.error.value ? 'Unable to load news right now.' : null))

  const fetchNews = async (params: NewsListParams = {}) => {
    mutationError.value = null
    manualLoading.value = true
    try {
      const items = await loadNews(params)
      manualNews.value = items
      queryClient.setQueryData(newsQueryKey, items)
      return items
    } catch (fetchError) {
      console.error('Failed to fetch news', fetchError)
      mutationError.value = 'Unable to load news right now.'
      return []
    } finally {
      manualLoading.value = false
    }
  }

  const toNewsFormData = (payload: any) => toFormData({
    title: payload.title,
    slug: payload.slug,
    content: payload.content,
    category: payload.category,
    is_published: payload.is_published,
    image_url: payload.imageFile ?? payload.image_url
  })

  const fetchNewsBySlug = async (slug: string) => {
    const normalizedSlug = String(slug || '').trim()
    if (!normalizedSlug) return null

    mutationError.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: ['news', 'slug', normalizedSlug, { includeDrafts }],
        queryFn: async () => {
          const res = await apiFetch<ApiNewsItem>(`/news/${normalizedSlug}`)
          const item = normalizeNewsItem(res)
          return !includeDrafts && !item.is_published ? null : item
        }
      })
    } catch (fetchError) {
      console.error(`Failed to fetch news article "${normalizedSlug}"`, fetchError)
      mutationError.value = 'Unable to load the selected article right now.'
      return null
    }
  }

  const invalidateNews = () => queryClient.invalidateQueries({ queryKey: ['news'] })

  const createNewsMutation = useMutation({
    mutationFn: (payload: any) => apiFetch<ApiNewsItem>('/news', {
      method: 'POST',
      body: toNewsFormData(payload)
    }),
    onSuccess: () => invalidateNews()
  })

  const updateNewsMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: any }) => apiFetch(`/news/${id}`, {
      method: 'PUT',
      body: toNewsFormData(payload)
    }),
    onSuccess: () => invalidateNews()
  })

  const deleteNewsMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/news/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['news'] })
      const previousNews = queryClient.getQueriesData<NewsItem[]>({ queryKey: ['news'] })

      previousNews.forEach(([queryKey, current]) => {
        if (Array.isArray(current)) {
          queryClient.setQueryData<NewsItem[]>(queryKey, current.filter((item) => item.id !== id))
        }
      })

      return { previousNews }
    },
    onError: (_error, _id, context) => {
      context?.previousNews?.forEach(([queryKey, value]) => {
        queryClient.setQueryData(queryKey, value)
      })
    },
    onSettled: () => invalidateNews()
  })

  const createNews = async (payload: any) => {
    const res = await createNewsMutation.mutateAsync(payload)
    return res ? normalizeNewsItem(res) : null
  }

  const updateNews = async (id: number, payload: any) => {
    await updateNewsMutation.mutateAsync({ id, payload })
    return news.value.find((item) => item.id === id) || null
  }

  const deleteNews = async (id: number) => {
    return deleteNewsMutation.mutateAsync(id)
  }

  return {
    news,
    isLoading,
    error,
    paginationMeta,
    fetchNews,
    fetchNewsBySlug,
    createNews,
    updateNews,
    deleteNews
  }
}
