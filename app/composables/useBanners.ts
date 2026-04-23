import type { ApiBanner, Banner } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

export const useBanners = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const banners = ref<Banner[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
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

  const findBannerByPage = (...pageNames: string[]) => {
    const normalizedNames = pageNames.map(normalizePageName).filter(Boolean)
    if (!normalizedNames.length) return {}

    return normalizedNames
      .map((pageName) => pageBanners.value[pageName] || banners.value.find((item) => item.page_name === pageName))
      .find(Boolean) || {}
  }

  const useBannerPage = (...pageNames: string[]) => computed(() => findBannerByPage(...pageNames))

  const fetchBanners = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<ApiBanner[]>('/banners')
      banners.value = (res || []).map(normalizeBanner)
      banners.value.forEach(setPageBanner)
    } catch (fetchError) {
      console.error('Failed to fetch banners', fetchError)
      banners.value = []
      error.value = 'Unable to load banners right now.'
    } finally {
      isLoading.value = false
    }
  }

  const fetchBannerPage = async (pageName: string) => {
    const normalizedPageName = normalizePageName(pageName)
    if (!normalizedPageName) return null

    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<ApiBanner | ApiBanner[]>(`/banners/${normalizedPageName}`)
      const banner = Array.isArray(res) ? res[0] : res
      if (!banner) {
        delete pageBanners.value[normalizedPageName]
        return null
      }

      const normalizedBanner = normalizeBanner(banner)
      setPageBanner(normalizedBanner)
      return normalizedBanner
    } catch (fetchError) {
      console.error(`Failed to fetch banner for page "${normalizedPageName}"`, fetchError)
      delete pageBanners.value[normalizedPageName]
      error.value = 'Unable to load banner content right now.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createBanner = async (payload: any) => {
    const res = await apiFetch<ApiBanner>('/banners', {
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
    return res ? normalizeBanner(res) : null
  }

  const updateBanner = async (id: number, payload: any) => {
    await apiFetch(`/banners/${id}`, {
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
    return banners.value.find((item) => item.id === id) || null
  }

  const deleteBanner = async (id: number) => {
    const res = await apiFetch(`/banners/${id}`, { method: 'DELETE' })
    await fetchBanners()
    return res
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
