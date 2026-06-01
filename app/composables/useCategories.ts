import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiCategory, Category } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

const CATEGORIES_QUERY_KEY = ['categories'] as const

export const useCategories = () => {
  const { apiFetch } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)

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

  const loadCategories = async () => {
    const res = await apiFetch<ApiCategory[]>('/categories')
    return (res || []).map(normalizeCategory)
  }

  const categoriesQuery = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: loadCategories
  })

  const categories = computed(() => categoriesQuery.data.value || [])
  const isLoading = computed(() => categoriesQuery.isLoading.value || categoriesQuery.isFetching.value)
  const error = computed(() => mutationError.value || (categoriesQuery.error.value ? 'Unable to load categories right now.' : null))

  const invalidateCategories = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ['works'] }),
      queryClient.invalidateQueries({ queryKey: ['products'] })
    ])
  }

  const fetchCategories = async () => {
    mutationError.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: CATEGORIES_QUERY_KEY,
        queryFn: loadCategories
      })
    } catch (fetchError) {
      console.error(fetchError)
      mutationError.value = 'Unable to load categories right now.'
      return []
    }
  }

  const createCategoryMutation = useMutation({
    mutationFn: (payload: string | { name: string }) =>
      apiFetch<ApiCategory>('/categories', { method: 'POST', body: toCategoryPayload(payload) }),
    onSuccess: () => invalidateCategories()
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: string | { name: string } }) =>
      apiFetch(`/categories/${id}`, { method: 'PUT', body: toCategoryPayload(payload) }),
    onSuccess: () => invalidateCategories()
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/categories/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CATEGORIES_QUERY_KEY })
      const previousCategories = queryClient.getQueryData<Category[]>(CATEGORIES_QUERY_KEY)
      queryClient.setQueryData<Category[]>(CATEGORIES_QUERY_KEY, (current = []) => current.filter((item) => item.id !== id))
      return { previousCategories }
    },
    onError: (_error, _id, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(CATEGORIES_QUERY_KEY, context.previousCategories)
      }
    },
    onSettled: () => invalidateCategories()
  })

  const createCategory = async (payload: string | { name: string }) => {
    const res = await createCategoryMutation.mutateAsync(payload)
    return res ? normalizeCategory(res) : null
  }

  const updateCategory = async (id: number, payload: string | { name: string }) => {
    await updateCategoryMutation.mutateAsync({ id, payload })
    return categories.value.find((item) => item.id === id) || null
  }

  const deleteCategory = async (id: number) => {
    return deleteCategoryMutation.mutateAsync(id)
  }

  return { categories, isLoading, error, fetchCategories, createCategory, updateCategory, deleteCategory }
}
