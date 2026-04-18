export const useCategories = () => {
  const { apiFetch } = useApi()
  const categories = ref<any[]>([])
  const isLoading = ref(false)

  const fetchCategories = async () => {
    isLoading.value = true
    try {
      const res = await apiFetch<any[]>('/categories')
      categories.value = res
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const createCategory = async (name: string) => {
    const res = await apiFetch('/categories', { method: 'POST', body: { name } })
    await fetchCategories()
    return res
  }

  const updateCategory = async (id: number, name: string) => {
    const res = await apiFetch(`/categories/${id}`, { method: 'PUT', body: { name } })
    await fetchCategories()
    return res
  }

  const deleteCategory = async (id: number) => {
    const res = await apiFetch(`/categories/${id}`, { method: 'DELETE' })
    await fetchCategories()
    return res
  }

  return { categories, isLoading, fetchCategories, createCategory, updateCategory, deleteCategory }
}
