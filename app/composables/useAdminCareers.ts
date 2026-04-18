export const useAdminCareers = () => {
  const { apiFetch } = useApi()
  const careers = ref<any[]>([])
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

  const toTextArray = (value: any) => {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)

    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) return []

      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
        try {
          const parsed = JSON.parse(trimmed)
          if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item).trim()).filter(Boolean)
          }
        } catch {
          // Fall back to line-based splitting when plain text is provided.
        }
      }

      return trimmed
        .split(/\r?\n|•|;|\|/)
        .map((item) => item.trim())
        .filter(Boolean)
    }

    return []
  }

  const normalizeCareerItem = (item: any) => ({
    ...item,
    slug: item.slug || toSlug(item.title),
    team: item.team || 'Engineering',
    level: item.level || 'Mid',
    location: item.location || 'Jakarta / Hybrid',
    type: item.type || 'Full-Time',
    summary: item.summary || '',
    description: item.description || '',
    responsibilities: toTextArray(item.responsibilities),
    requirements: toTextArray(item.requirements),
    postedAt: item.postedAt || item.createdAt || null,
    is_published: Number(item.is_published ?? 1)
  })

  const fetchCareers = async () => {
    isLoading.value = true
    try {
      const res = await apiFetch<any[]>('/careers')
      careers.value = (res || []).map(normalizeCareerItem)
    } catch (error) {
      console.error('Failed to fetch careers', error)
      careers.value = []
    } finally {
      isLoading.value = false
    }
  }

  const toCareerFormData = (payload: any) => toFormData({
    title: payload.title,
    slug: payload.slug,
    team: payload.team,
    level: payload.level,
    location: payload.location,
    type: payload.type,
    summary: payload.summary,
    description: payload.description,
    responsibilities: JSON.stringify(payload.responsibilities || []),
    requirements: JSON.stringify(payload.requirements || []),
    postedAt: payload.postedAt,
    is_published: payload.is_published
  })

  const createCareer = async (payload: any) => {
    const res = await apiFetch('/careers', {
      method: 'POST',
      body: toCareerFormData(payload)
    })

    await fetchCareers()
    return normalizeCareerItem(res)
  }

  const updateCareer = async (id: number, payload: any) => {
    const res = await apiFetch(`/careers/${id}`, {
      method: 'PUT',
      body: toCareerFormData(payload)
    })

    await fetchCareers()
    return normalizeCareerItem(res)
  }

  const deleteCareer = async (id: number) => {
    const res = await apiFetch(`/careers/${id}`, { method: 'DELETE' })
    await fetchCareers()
    return res
  }

  return {
    careers,
    isLoading,
    fetchCareers,
    createCareer,
    updateCareer,
    deleteCareer
  }
}
