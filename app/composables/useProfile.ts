import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiCompanyProfile, CompanyProfile } from '~/types/api'

const PROFILE_QUERY_KEY = ['profile'] as const

export const useProfile = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)

  const normalizeProfile = (item: ApiCompanyProfile): CompanyProfile => ({
    id: Number(item.id || 0),
    company_name: String(item.company_name || ''),
    tagline: String(item.tagline || ''),
    short_description: String(item.short_description || ''),
    long_description: String(item.long_description || ''),
    email: String(item.email || ''),
    phone: String(item.phone || ''),
    website: String(item.website || ''),
    address: String(item.address || ''),
    linkedin_url: String(item.linkedin_url || ''),
    instagram_url: String(item.instagram_url || ''),
    logo_url: resolveAssetUrl(item.logo_url),
    seo_title: String(item.seo_title || ''),
    seo_description: String(item.seo_description || '')
  })

  const loadProfile = async () => {
    const res = await apiFetch<ApiCompanyProfile>('/profile')
    return normalizeProfile(res || {})
  }

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: loadProfile
  })

  const profile = computed(() => profileQuery.data.value || null)
  const isLoading = computed(() => profileQuery.isLoading.value || profileQuery.isFetching.value)
  const error = computed(() => mutationError.value || (profileQuery.error.value ? 'Unable to load profile right now.' : null))

  const fetchProfile = async () => {
    mutationError.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: loadProfile
      })
    } catch (fetchError) {
      console.error('Failed to fetch profile', fetchError)
      mutationError.value = 'Unable to load profile right now.'
      return null
    }
  }

  const updateProfileMutation = useMutation({
    mutationFn: (payload: any) => apiFetch<ApiCompanyProfile>('/profile', {
      method: 'PUT',
      body: toFormData({
        ...payload,
        logo_url: payload.logoFile ?? payload.logo_url
      })
    }),
    onSuccess: (res) => {
      const normalizedProfile = normalizeProfile(res || {})
      queryClient.setQueryData(PROFILE_QUERY_KEY, normalizedProfile)
      return queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    }
  })

  const updateProfile = async (payload: any) => {
    const res = await updateProfileMutation.mutateAsync(payload)
    return normalizeProfile(res || {})
  }

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile
  }
}
