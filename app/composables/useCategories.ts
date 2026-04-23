import type { ApiCategory, Category } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

export const useCategories = () => {
  const { apiFetch } = useApi()
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const normalizeCategory = (item: ApiCategory): Category => ({
    id: Number(item.id),
    name: String(item.name || ''),
    slug: toSlug(item.name)
  })

  const toCategoryPayload = (payload: string | { name: string }) => {
    if (typeof payload === 'string') {
      return { name: payload }
    }

    return {
      name: payload.name
    }
  }

  const fetchCategories = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<ApiCategory[]>('/categories')
      categories.value = (res || []).map(normalizeCategory)
    } catch (fetchError) {
      console.error(fetchError)
      categories.value = []
      error.value = 'Unable to load categories right now.'
    } finally {
      isLoading.value = false
    }
  }

  const createCategory = async (payload: string | { name: string }) => {
    const res = await apiFetch<ApiCategory>('/categories', { method: 'POST', body: toCategoryPayload(payload) })
    await fetchCategories()
    return res ? normalizeCategory(res) : null
  }

  const updateCategory = async (id: number, payload: string | { name: string }) => {
    await apiFetch(`/categories/${id}`, { method: 'PUT', body: toCategoryPayload(payload) })
    await fetchCategories()
    return categories.value.find((item) => item.id === id) || null
  }

  const deleteCategory = async (id: number) => {
    const res = await apiFetch(`/categories/${id}`, { method: 'DELETE' })
    await fetchCategories()
    return res
  }

  return { categories, isLoading, error, fetchCategories, createCategory, updateCategory, deleteCategory }
}
