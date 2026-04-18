export const useWorks = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const works = ref<any[]>([])
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

  const normalizeWork = (item: any) => ({
    ...item,
    slug: item.slug || toSlug(item.title),
    image_url: resolveAssetUrl(item.image_url),
    categoryName: item.categoryName ?? item.category_name ?? ''
  })

  const fetchWorks = async () => {
    isLoading.value = true
    try {
      const res = await apiFetch<any[]>('/works')
      works.value = res.map(normalizeWork)
    } catch (error) {
      console.error('Failed to fetch works', error)
    } finally {
      isLoading.value = false
    }
  }

  const toWorkFormData = (payload: any) => toFormData({
    title: payload.title,
    description: payload.description,
    client: payload.client,
    year: payload.year,
    categoryId: payload.categoryId,
    image_url: payload.imageFile ?? payload.image_url
  })

  const createWork = async (payload: any) => {
    const res = await apiFetch('/works', {
      method: 'POST',
      body: toWorkFormData(payload)
    })

    await fetchWorks()
    return normalizeWork(res)
  }

  const updateWork = async (id: number, payload: any) => {
    const res = await apiFetch(`/works/${id}`, {
      method: 'PUT',
      body: toWorkFormData(payload)
    })

    await fetchWorks()
    return normalizeWork(res)
  }

  const deleteWork = async (id: number) => {
    const res = await apiFetch(`/works/${id}`, { method: 'DELETE' })
    await fetchWorks()
    return res
  }

  return {
    works,
    isLoading,
    fetchWorks,
    createWork,
    updateWork,
    deleteWork
  }
}
