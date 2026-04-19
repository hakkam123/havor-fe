export const useBanners = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const banners = ref<any[]>([])
  const isLoading = ref(false)

  const normalizePageName = (value?: string | null) =>
    String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, '-')

  const toSlug = (value?: string | null) => {
    if (!value) return ''

    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const normalizeBanner = (item: any) => ({
    ...item,
    slug: item.slug || toSlug(item.page_name || item.title),
    media_url: resolveAssetUrl(item.media_url),
    page_name: normalizePageName(item.page_name)
  })

  const findBannerByPage = (...pageNames: string[]) => {
    const normalizedNames = pageNames.map(normalizePageName).filter(Boolean)
    if (!normalizedNames.length) return {}

    return banners.value.find((item) => normalizedNames.includes(normalizePageName(item.page_name))) || {}
  }

  const useBannerPage = (...pageNames: string[]) => computed(() => findBannerByPage(...pageNames))

  const fetchBanners = async () => {
    isLoading.value = true
    try {
      const res = await apiFetch<any[]>('/banners')
      banners.value = res.map(normalizeBanner)
    } catch (error) {
      console.error('Failed to fetch banners', error)
    } finally {
      isLoading.value = false
    }
  }

  const createBanner = async (payload: any) => {
    const res = await apiFetch('/banners', {
      method: 'POST',
      body: toFormData({
        page_name: payload.page_name,
        title: payload.title,
        subtitle: payload.subtitle,
        media_type: payload.media_type,
        media_url: payload.mediaFile ?? payload.media_url
      })
    })

    await fetchBanners()
    return normalizeBanner(res)
  }

  const updateBanner = async (id: number, payload: any) => {
    const res = await apiFetch(`/banners/${id}`, {
      method: 'PUT',
      body: toFormData({
        page_name: payload.page_name,
        title: payload.title,
        subtitle: payload.subtitle,
        media_type: payload.media_type,
        media_url: payload.mediaFile ?? payload.media_url
      })
    })

    await fetchBanners()
    return normalizeBanner(res)
  }

  const deleteBanner = async (id: number) => {
    const res = await apiFetch(`/banners/${id}`, { method: 'DELETE' })
    await fetchBanners()
    return res
  }

  return {
    banners,
    isLoading,
    fetchBanners,
    findBannerByPage,
    useBannerPage,
    createBanner,
    updateBanner,
    deleteBanner
  }
}
