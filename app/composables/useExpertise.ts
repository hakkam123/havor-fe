import type { ApiExpertise, Expertise } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

export const useExpertise = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const expertise = ref<Expertise[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const normalizeExpertise = (item: ApiExpertise): Expertise => ({
    id: Number(item.id),
    name: String(item.name || ''),
    description: String(item.description || ''),
    slug: String(item.slug || toSlug(item.name)),
    icon_url: resolveAssetUrl(item.icon_url)
  })

  const fetchExpertise = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<ApiExpertise[]>('/expertise')
      expertise.value = (res || []).map(normalizeExpertise)
    } catch (fetchError) {
      console.error('Failed to fetch expertise', fetchError)
      expertise.value = []
      error.value = 'Unable to load expertise right now.'
    } finally {
      isLoading.value = false
    }
  }

  const toExpertiseFormData = (payload: any) => toFormData({
    name: payload.name,
    description: payload.description,
    icon_url: payload.iconFile ?? payload.icon_url
  })

  const createExpertise = async (payload: any) => {
    const res = await apiFetch<ApiExpertise>('/expertise', {
      method: 'POST',
      body: toExpertiseFormData(payload)
    })

    await fetchExpertise()
    return res ? normalizeExpertise(res) : null
  }

  const updateExpertise = async (id: number, payload: any) => {
    await apiFetch(`/expertise/${id}`, {
      method: 'PUT',
      body: toExpertiseFormData(payload)
    })

    await fetchExpertise()
    return expertise.value.find((item) => item.id === id) || null
  }

  const deleteExpertise = async (id: number) => {
    const res = await apiFetch(`/expertise/${id}`, { method: 'DELETE' })
    await fetchExpertise()
    return res
  }

  return {
    expertise,
    isLoading,
    error,
    fetchExpertise,
    createExpertise,
    updateExpertise,
    deleteExpertise
  }
}
