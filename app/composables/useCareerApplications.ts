import { useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiCareerApplication, CareerApplication } from '~/types/api'
import { toApiArray, toApiPaginationMeta, toQueryString, type ApiPaginationMeta } from '~/utils/apiData'

const CAREER_APPLICATIONS_QUERY_KEY = ['career-applications'] as const

type UseCareerApplicationsOptions = {
  immediate?: boolean
}

type CareerApplicationListParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export const useCareerApplications = (options: UseCareerApplicationsOptions = {}) => {
  const { apiFetch } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)
  const manualLoading = ref(false)
  const paginationMeta = ref<ApiPaginationMeta>(toApiPaginationMeta(null))

  const formatDate = (value?: string | null) => {
    if (!value) return ''

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(value))
  }

  const normalizeApplication = (item: ApiCareerApplication): CareerApplication => ({
    id: Number(item.id),
    fullName: String(item.full_name || ''),
    email: String(item.email || ''),
    phone: String(item.phone || ''),
    address: String(item.address || ''),
    position: String(item.position || ''),
    latestEducation: String(item.latest_education || ''),
    experienceSummary: String(item.experience_summary || ''),
    portfolioUrl: String(item.portfolio_url || ''),
    message: String(item.message || ''),
    resumeName: String(item.cv_original_name || ''),
    resumeStorageKey: String(item.cv_storage_key || ''),
    resumeUrl: String(item.cv_signed_url || ''),
    status: String(item.status || 'new'),
    createdAt: item.createdAt || null,
    dateLabel: formatDate(item.createdAt)
  })

  const loadApplications = async (params: CareerApplicationListParams = {}) => {
    const res = await apiFetch<unknown>(`/careers/applications${toQueryString(params)}`)
    paginationMeta.value = toApiPaginationMeta(res, Number(params.limit) || 10)
    return toApiArray<ApiCareerApplication>(res).map(normalizeApplication)
  }

  const applicationsQuery = useQuery({
    queryKey: CAREER_APPLICATIONS_QUERY_KEY,
    queryFn: () => loadApplications(),
    refetchInterval: options.immediate === false ? false : 30_000,
    enabled: options.immediate !== false
  })

  const applications = computed(() => applicationsQuery.data.value || [])
  const isLoading = computed(() => manualLoading.value || applicationsQuery.isLoading.value || applicationsQuery.isFetching.value)
  const error = computed(() => mutationError.value || (applicationsQuery.error.value ? 'Unable to load career applications right now.' : null))

  const fetchApplications = async (params: CareerApplicationListParams = {}) => {
    mutationError.value = null
    manualLoading.value = true

    try {
      const items = await loadApplications(params)
      queryClient.setQueryData(CAREER_APPLICATIONS_QUERY_KEY, items)
      return items
    } catch (fetchError) {
      console.error('Failed to fetch career applications', fetchError)
      mutationError.value = 'Unable to load career applications right now.'
      return []
    } finally {
      manualLoading.value = false
    }
  }

  return {
    applications,
    isLoading,
    error,
    paginationMeta,
    fetchApplications
  }
}
