export const useNews = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const news = ref<any[]>([])
  const isLoading = ref(false)

  const toSlug = (value?: string | null) => {
    if (!value) return ''

    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const stripHtml = (value?: string | null) => (value || '').replace(/<[^>]*>?/gm, '').trim()

  const normalizeNewsItem = (item: any) => ({
    ...item,
    slug: item.slug || toSlug(item.title),
    excerpt: stripHtml(item.content).slice(0, 160),
    readTime: item.readTime || Math.max(1, Math.ceil(stripHtml(item.content).split(/\s+/).filter(Boolean).length / 180)),
    image_url: resolveAssetUrl(item.image_url)
  })

  const fetchNews = async () => {
    isLoading.value = true
    try {
      const res = await apiFetch<any[]>('/news')
      news.value = res.map(normalizeNewsItem)
    } catch (error) {
      console.error('Failed to fetch news', error)
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
    const res = await apiFetch('/news', {
      method: 'POST',
      body: toNewsFormData(payload)
    })

    await fetchNews()
    return normalizeNewsItem(res)
  }

  const updateNews = async (id: number, payload: any) => {
    const res = await apiFetch(`/news/${id}`, {
      method: 'PUT',
      body: toNewsFormData(payload)
    })

    await fetchNews()
    return normalizeNewsItem(res)
  }

  const deleteNews = async (id: number) => {
    const res = await apiFetch(`/news/${id}`, { method: 'DELETE' })
    await fetchNews()
    return res
  }

  return {
    news,
    isLoading,
    fetchNews,
    createNews,
    updateNews,
    deleteNews
  }
}
