import type { ApiNewsItem, NewsItem } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

type UseNewsOptions = {
  includeDrafts?: boolean
}

export const useNews = (options: UseNewsOptions = {}) => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const news = ref<NewsItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const includeDrafts = Boolean(options.includeDrafts)

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

  const fetchNews = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<ApiNewsItem[]>('/news')
      const normalizedItems = (res || []).map(normalizeNewsItem)
      news.value = includeDrafts ? normalizedItems : normalizedItems.filter((item) => item.is_published)
    } catch (fetchError) {
      console.error('Failed to fetch news', fetchError)
      news.value = []
      error.value = 'Unable to load news right now.'
    } finally {
      isLoading.value = false
    }
  }

  const fetchNewsBySlug = async (slug: string) => {
    const normalizedSlug = String(slug || '').trim()
    if (!normalizedSlug) return null

    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<ApiNewsItem>(`/news/${normalizedSlug}`)
      const item = normalizeNewsItem(res)
      if (!includeDrafts && !item.is_published) return null
      return item
    } catch (fetchError) {
      console.error(`Failed to fetch news article "${normalizedSlug}"`, fetchError)
      error.value = 'Unable to load the selected article right now.'
      return null
    } finally {
      isLoading.value = false
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

  const createNews = async (payload: any) => {
    const res = await apiFetch<ApiNewsItem>('/news', {
      method: 'POST',
      body: toNewsFormData(payload)
    })

    await fetchNews()
    return res ? normalizeNewsItem(res) : null
  }

  const updateNews = async (id: number, payload: any) => {
    await apiFetch(`/news/${id}`, {
      method: 'PUT',
      body: toNewsFormData(payload)
    })

    await fetchNews()
    return news.value.find((item) => item.id === id) || null
  }

  const deleteNews = async (id: number) => {
    const res = await apiFetch(`/news/${id}`, { method: 'DELETE' })
    await fetchNews()
    return res
  }

  return {
    news,
    isLoading,
    error,
    fetchNews,
    fetchNewsBySlug,
    createNews,
    updateNews,
    deleteNews
  }
}
