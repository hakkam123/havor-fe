import type { ApiCompanyProfile, CompanyProfile } from '~/types/api'

export const useProfile = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const profile = ref<CompanyProfile | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

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

  const fetchProfile = async () => {
    isLoading.value = true
    error.value = null

    try {
      const res = await apiFetch<ApiCompanyProfile>('/profile')
      profile.value = normalizeProfile(res || {})
      return profile.value
    } catch (fetchError) {
      console.error('Failed to fetch profile', fetchError)
      error.value = 'Unable to load profile right now.'
      profile.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (payload: any) => {
    const res = await apiFetch<ApiCompanyProfile>('/profile', {
      method: 'PUT',
      body: toFormData({
        ...payload,
        logo_url: payload.logoFile ?? payload.logo_url
      })
    })

    profile.value = normalizeProfile(res || {})
    return profile.value
  }

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile
  }
}
