import { useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiCareer, Career } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

const CAREERS_QUERY_KEY = ['careers'] as const

export const useCareers = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const fetchErrorMessage = ref<string | null>(null)

  const normalizeCareer = (item: ApiCareer): Career => ({
    id: Number(item.id),
    job_title: String(item.job_title || ''),
    job_description: String(item.job_description || ''),
    excerpt: String(item.job_description || '').replace(/<[^>]*>?/gm, '').trim().slice(0, 180),
    thumbnail: resolveAssetUrl(item.thumbnail),
    slug: toSlug(item.job_title)
  })

  const loadCareers = async () => {
    const res = await apiFetch<ApiCareer[]>('/careers')
    return (res || []).map(normalizeCareer)
  }

  const careersQuery = useQuery({
    queryKey: CAREERS_QUERY_KEY,
    queryFn: loadCareers
  })

  const careers = computed(() => careersQuery.data.value || [])
  const isLoading = computed(() => careersQuery.isLoading.value || careersQuery.isFetching.value)
  const error = computed(() => fetchErrorMessage.value || (careersQuery.error.value ? 'Unable to load careers right now.' : null))

  const fetchCareers = async () => {
    fetchErrorMessage.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: CAREERS_QUERY_KEY,
        queryFn: loadCareers
      })
    } catch (fetchError) {
      console.error('Failed to fetch public careers', fetchError)
      fetchErrorMessage.value = 'Unable to load careers right now.'
      return []
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
