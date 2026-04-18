export const useExpertise = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const expertise = ref<any[]>([])
  const isLoading = ref(false)

  const toSlug = (value?: string | null) => {
    if (!value) return ''

    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const normalizeExpertise = (item: any) => ({
    ...item,
    slug: item.slug || toSlug(item.name),
    icon_url: resolveAssetUrl(item.icon_url)
  })

  const fetchExpertise = async () => {
    isLoading.value = true
    try {
      const res = await apiFetch<any[]>('/expertise')
      expertise.value = res.map(normalizeExpertise)
    } catch (error) {
      console.error('Failed to fetch expertise', error)
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
    const res = await apiFetch('/expertise', {
      method: 'POST',
      body: toExpertiseFormData(payload)
    })

    await fetchExpertise()
    return normalizeExpertise(res)
  }

  const updateExpertise = async (id: number, payload: any) => {
    const res = await apiFetch(`/expertise/${id}`, {
      method: 'PUT',
      body: toExpertiseFormData(payload)
    })

    await fetchExpertise()
    return normalizeExpertise(res)
  }

  const deleteExpertise = async (id: number) => {
    const res = await apiFetch(`/expertise/${id}`, { method: 'DELETE' })
    await fetchExpertise()
    return res
  }

  return {
    expertise,
    isLoading,
    fetchExpertise,
    createExpertise,
    updateExpertise,
    deleteExpertise
  }
}
