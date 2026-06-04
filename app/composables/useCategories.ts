import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiCategory, Category, CategoryType } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

type UseCategoriesOptions = {
  type?: CategoryType
}

export const CATEGORY_TYPES: CategoryType[] = ['News', 'Career', 'Campaign', 'Product']
const ALL_CATEGORIES_QUERY_KEY = ['categories'] as const

export const normalizeCategoryType = (value: unknown): CategoryType | null => {
  const normalizedValue = String(value || '').trim().toLowerCase()
  return CATEGORY_TYPES.find((type) => type.toLowerCase() === normalizedValue) || null
}

export const isCategoryType = (value: unknown): value is CategoryType => Boolean(normalizeCategoryType(value))

export const useCategories = (options: UseCategoriesOptions = {}) => {
  const { apiFetch } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)
  const selectedType = computed(() => normalizeCategoryType(options.type))
  const categoriesQueryKey = computed(() => ['categories', { type: selectedType.value }] as const)

  const normalizeCategory = (item: ApiCategory): Category => ({
    id: Number(item.id),
    name: String(item.name || ''),
    slug: toSlug(item.name),
    type: normalizeCategoryType(item.type) || 'Product'
  })

  const toCategoryPayload = (payload: string | { name: string, type?: CategoryType }) => {
    if (typeof payload === 'string') {
      return { name: payload, type: selectedType.value || 'Product' }
    }

    return {
      name: payload.name,
      type: normalizeCategoryType(payload.type) || selectedType.value || 'Product'
    }
  }

  const loadCategories = async () => {
    const query = selectedType.value ? `?type=${selectedType.value}` : ''
    const res = await apiFetch<ApiCategory[]>(`/categories${query}`)
    return (res || []).map(normalizeCategory)
  }

  const categoriesQuery = useQuery({
    queryKey: categoriesQueryKey.value,
    queryFn: loadCategories
  })

  const categories = computed(() => categoriesQuery.data.value || [])
  const isLoading = computed(() => categoriesQuery.isLoading.value || categoriesQuery.isFetching.value)
  const error = computed(() => mutationError.value || (categoriesQuery.error.value ? 'Unable to load categories right now.' : null))

  const invalidateCategories = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ALL_CATEGORIES_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ['news'] }),
      queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
      queryClient.invalidateQueries({ queryKey: ['careers'] }),
      queryClient.invalidateQueries({ queryKey: ['works'] }),
      queryClient.invalidateQueries({ queryKey: ['products'] })
    ])
  }

  const fetchCategories = async () => {
    mutationError.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: categoriesQueryKey.value,
        queryFn: loadCategories
      })
    } catch (fetchError) {
      console.error(fetchError)
      mutationError.value = 'Unable to load categories right now.'
      return []
    }
  }

  const createCategoryMutation = useMutation({
    mutationFn: (payload: string | { name: string, type?: CategoryType }) =>
      apiFetch<ApiCategory>('/categories', { method: 'POST', body: toCategoryPayload(payload) }),
    onSuccess: () => invalidateCategories()
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: string | { name: string, type?: CategoryType } }) =>
      apiFetch(`/categories/${id}`, { method: 'PUT', body: toCategoryPayload(payload) }),
    onSuccess: () => invalidateCategories()
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/categories/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ALL_CATEGORIES_QUERY_KEY })
      const previousCategories = queryClient.getQueryData<Category[]>(categoriesQueryKey.value)
      queryClient.setQueryData<Category[]>(categoriesQueryKey.value, (current = []) => current.filter((item) => item.id !== id))
      return { previousCategories }
    },
    onError: (_error, _id, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(categoriesQueryKey.value, context.previousCategories)
      }
    },
    onSettled: () => invalidateCategories()
  })

  const createCategory = async (payload: string | { name: string, type?: CategoryType }) => {
    const res = await createCategoryMutation.mutateAsync(payload)
    return res ? normalizeCategory(res) : null
  }

  const updateCategory = async (id: number, payload: string | { name: string, type?: CategoryType }) => {
    await updateCategoryMutation.mutateAsync({ id, payload })
    return categories.value.find((item) => item.id === id) || null
  }

  const deleteCategory = async (id: number) => {
    return deleteCategoryMutation.mutateAsync(id)
  }

  return { categories, isLoading, error, fetchCategories, createCategory, updateCategory, deleteCategory }
}
