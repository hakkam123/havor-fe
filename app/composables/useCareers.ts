type CareerItem = {
  id: number
  title: string
  slug: string
  team: string
  level: string
  location: string
  type: string
  summary: string
  description: string
  responsibilities: string[]
  requirements: string[]
  postedAt: string | null
  is_published?: number
}

export const useCareers = () => {
  const { apiFetch } = useApi()
  const careers = ref<CareerItem[]>([])
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

  const toTextArray = (value: unknown) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean)
    }

    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) return []

      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean)
        }
      } catch {
        // Fall back to line and separator parsing.
      }

      return trimmed
        .split(/\r?\n|•|;|\|/)
        .map((item) => item.trim())
        .filter(Boolean)
    }

    return []
  }

  const normalizeCareer = (item: any): CareerItem => ({
    ...item,
    id: Number(item.id),
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
      careers.value = (res || [])
        .map(normalizeCareer)
        .filter((item) => item.is_published !== 0)
    } catch (error) {
      console.error('Failed to fetch public careers', error)
      careers.value = []
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
    fetchCareers,
    getCareerBySlug
  }
}
