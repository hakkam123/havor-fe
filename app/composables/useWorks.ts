import type { ApiWork, Work } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

export const useWorks = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const works = ref<Work[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const normalizeWork = (item: ApiWork): Work => ({
    id: Number(item.id),
    title: String(item.title || ''),
    description: String(item.description || ''),
    client: String(item.client || ''),
    year: item.year === null || item.year === undefined || item.year === '' ? null : Number(item.year),
    slug: String(item.slug || toSlug(item.title)),
    image_url: resolveAssetUrl(item.image_url),
    categoryId: item.categoryId === null || item.categoryId === undefined || item.categoryId === '' ? null : Number(item.categoryId),
    categoryName: String(item.categoryName ?? item.category_name ?? '')
  })

  const fetchWorks = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<ApiWork[]>('/works')
      works.value = (res || []).map(normalizeWork)
    } catch (fetchError) {
      console.error('Failed to fetch works', fetchError)
      works.value = []
      error.value = 'Unable to load works right now.'
    } finally {
      isLoading.value = false
    }
  }

  const toWorkFormData = (payload: any) => toFormData({
    title: payload.title,
    description: payload.description,
    client: payload.client,
    year: payload.year,
    categoryId: payload.categoryId,
    image_url: payload.imageFile ?? payload.image_url
  })

  const createWork = async (payload: any) => {
    const res = await apiFetch<ApiWork>('/works', {
      method: 'POST',
      body: toWorkFormData(payload)
    })

    await fetchWorks()
    return res ? normalizeWork(res) : null
  }

  const updateWork = async (id: number, payload: any) => {
    await apiFetch(`/works/${id}`, {
      method: 'PUT',
      body: toWorkFormData(payload)
    })

    await fetchWorks()
    return works.value.find((item) => item.id === id) || null
  }

  const deleteWork = async (id: number) => {
    const res = await apiFetch(`/works/${id}`, { method: 'DELETE' })
    await fetchWorks()
    return res
  }

  return {
    works,
    isLoading,
    error,
    fetchWorks,
    createWork,
    updateWork,
    deleteWork
  }
}
