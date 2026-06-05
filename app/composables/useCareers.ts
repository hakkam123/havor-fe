import { useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiCareer, Career } from '~/types/api'
import { toSlug } from '~/composables/useSlug'
import { toApiArray, toApiPaginationMeta, toQueryString, type ApiPaginationMeta } from '~/utils/apiData'

const CAREERS_QUERY_KEY = ['careers'] as const

type UseCareersOptions = {
  immediate?: boolean
}

type CareerListParams = {
  page?: number
  limit?: number
  search?: string
  categoryId?: string | number
  category?: string
}

export const useCareers = (options: UseCareersOptions = {}) => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const fetchErrorMessage = ref<string | null>(null)
  const manualLoading = ref(false)
  const paginationMeta = ref<ApiPaginationMeta>(toApiPaginationMeta(null))

  const toPlainText = (value?: string | null) => String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const normalizeCareer = (item: ApiCareer): Career => ({
    id: Number(item.id),
    job_title: String(item.job_title || ''),
    job_description: String(item.job_description || ''),
    excerpt: toPlainText(item.job_description).slice(0, 180),
    thumbnail: resolveAssetUrl(item.thumbnail),
    categoryId: item.categoryId === null || item.categoryId === undefined || item.categoryId === '' ? null : Number(item.categoryId),
    categoryName: String(item.categoryName ?? item.category_name ?? ''),
    slug: toSlug(item.job_title)
  })

  const loadCareers = async (params: CareerListParams = {}) => {
    const res = await apiFetch<unknown>(`/careers${toQueryString(params)}`)
    paginationMeta.value = toApiPaginationMeta(res, Number(params.limit) || 10)
    return toApiArray<ApiCareer>(res).map(normalizeCareer)
  }

  const careersQuery = useQuery({
    queryKey: CAREERS_QUERY_KEY,
    queryFn: () => loadCareers(),
    enabled: options.immediate !== false
  })

  const careers = computed(() => careersQuery.data.value || [])
  const isLoading = computed(() => manualLoading.value || careersQuery.isLoading.value || careersQuery.isFetching.value)
  const error = computed(() => fetchErrorMessage.value || (careersQuery.error.value ? 'Unable to load careers right now.' : null))

  const fetchCareers = async (params: CareerListParams = {}) => {
    fetchErrorMessage.value = null
    manualLoading.value = true
    try {
      const items = await loadCareers(params)
      queryClient.setQueryData(CAREERS_QUERY_KEY, items)
      return items
    } catch (fetchError) {
      console.error('Failed to fetch public careers', fetchError)
      fetchErrorMessage.value = 'Unable to load careers right now.'
      return []
    } finally {
      manualLoading.value = false
    }
  }

  const getCareerBySlug = (slug: string) => {
    return careers.value.find((item) => item.slug === slug) || null
  }

  return {
    careers,
    isLoading,
    error,
    paginationMeta,
    fetchCareers,
    getCareerBySlug
  }
}
