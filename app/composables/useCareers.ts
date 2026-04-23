import type { ApiCareer, Career } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

export const useCareers = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const careers = ref<Career[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const normalizeCareer = (item: ApiCareer): Career => ({
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
      careers.value = (res || []).map(normalizeCareer)
    } catch (fetchError) {
      console.error('Failed to fetch public careers', fetchError)
      careers.value = []
      error.value = 'Unable to load careers right now.'
    } finally {
      isLoading.value = false
    }
  }

  const getCareerBySlug = (slug: string) => {
    return careers.value.find((item) => item.slug === slug) || null
  }

  return {
    careers,
    isLoading,
    error,
    fetchCareers,
    getCareerBySlug
  }
}
