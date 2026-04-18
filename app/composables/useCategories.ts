export const useCategories = () => {
  const { apiFetch } = useApi()
  const categories = ref<any[]>([])
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

  const normalizeCategory = (item: any) => ({
    ...item,
    slug: item.slug || toSlug(item.name),
    description: item.description || ''
  })

  const toCategoryPayload = (payload: string | { name: string; description?: string }) => {
    if (typeof payload === 'string') {
      return { name: payload }
    }

    return {
      name: payload.name,
      description: payload.description || ''
    }
  }

  const fetchCategories = async () => {
    isLoading.value = true
    try {
      const res = await apiFetch<any[]>('/categories')
      categories.value = (res || []).map(normalizeCategory)
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const createCategory = async (payload: string | { name: string; description?: string }) => {
    const res = await apiFetch('/categories', { method: 'POST', body: toCategoryPayload(payload) })
    await fetchCategories()
    return normalizeCategory(res)
  }

  const updateCategory = async (id: number, payload: string | { name: string; description?: string }) => {
    const res = await apiFetch(`/categories/${id}`, { method: 'PUT', body: toCategoryPayload(payload) })
    await fetchCategories()
    return normalizeCategory(res)
  }

  const deleteCategory = async (id: number) => {
    const res = await apiFetch(`/categories/${id}`, { method: 'DELETE' })
    await fetchCategories()
    return res
  }

  return { categories, isLoading, fetchCategories, createCategory, updateCategory, deleteCategory }
}
