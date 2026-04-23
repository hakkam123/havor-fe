import type { ApiCareer, Career } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

export const useAdminCareers = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const careers = ref<Career[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const normalizeCareerItem = (item: ApiCareer): Career => ({
    id: Number(item.id),
    job_title: String(item.job_title || ''),
    job_description: String(item.job_description || ''),
    excerpt: String(item.job_description || '').replace(/<[^>]*>?/gm, '').trim().slice(0, 180),
    thumbnail: resolveAssetUrl(item.thumbnail),
    slug: toSlug(item.job_title)
  })

  const fetchCareers = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<ApiCareer[]>('/careers')
      careers.value = (res || []).map(normalizeCareerItem)
    } catch (fetchError) {
      console.error('Failed to fetch careers', fetchError)
      careers.value = []
      error.value = 'Unable to load careers right now.'
    } finally {
      isLoading.value = false
    }
  }

  const toCareerFormData = (payload: any) => toFormData({
    job_title: payload.job_title,
    job_description: payload.job_description,
    thumbnail: payload.thumbnailFile ?? payload.thumbnail
  })

  const createCareer = async (payload: any) => {
    const res = await apiFetch<ApiCareer>('/careers', {
      method: 'POST',
      body: toCareerFormData(payload)
    })

    await fetchCareers()
    return res ? normalizeCareerItem(res) : null
  }

  const updateCareer = async (id: number, payload: any) => {
    await apiFetch(`/careers/${id}`, {
      method: 'PUT',
      body: toCareerFormData(payload)
    })

    await fetchCareers()
    return careers.value.find((item) => item.id === id) || null
  }

  const deleteCareer = async (id: number) => {
    const res = await apiFetch(`/careers/${id}`, { method: 'DELETE' })
    await fetchCareers()
    return res
  }

  return {
    careers,
    isLoading,
    error,
    fetchCareers,
    createCareer,
    updateCareer,
    deleteCareer
  }
}
