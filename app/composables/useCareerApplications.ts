import { useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiCareerApplication, CareerApplication } from '~/types/api'

const CAREER_APPLICATIONS_QUERY_KEY = ['career-applications'] as const

export const useCareerApplications = () => {
  const { apiFetch } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)

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

  const loadApplications = async () => {
    const res = await apiFetch<ApiCareerApplication[]>('/careers/applications')
    return (res || []).map(normalizeApplication)
  }

  const applicationsQuery = useQuery({
    queryKey: CAREER_APPLICATIONS_QUERY_KEY,
    queryFn: loadApplications,
    refetchInterval: 30_000
  })

  const applications = computed(() => applicationsQuery.data.value || [])
  const isLoading = computed(() => applicationsQuery.isLoading.value || applicationsQuery.isFetching.value)
  const error = computed(() => mutationError.value || (applicationsQuery.error.value ? 'Unable to load career applications right now.' : null))

  const fetchApplications = async () => {
    mutationError.value = null

    try {
      return await queryClient.ensureQueryData({
        queryKey: CAREER_APPLICATIONS_QUERY_KEY,
        queryFn: loadApplications
      })
    } catch (fetchError) {
      console.error('Failed to fetch career applications', fetchError)
      mutationError.value = 'Unable to load career applications right now.'
      return []
    }
  }

  return {
    applications,
    isLoading,
    error,
    fetchApplications
  }
}
