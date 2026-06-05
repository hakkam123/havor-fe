import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiProduct, Product } from '~/types/api'
import { toSlug } from '~/composables/useSlug'
import { toApiArray, toApiPaginationMeta, toQueryString, type ApiPaginationMeta } from '~/utils/apiData'

const PRODUCTS_QUERY_KEY = ['products'] as const

type UseProductsOptions = {
  immediate?: boolean
}

type ProductListParams = {
  page?: number
  limit?: number
  search?: string
  categoryId?: string | number
  category?: string
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)
  const manualLoading = ref(false)
  const paginationMeta = ref<ApiPaginationMeta>(toApiPaginationMeta(null))

  const normalizeProduct = (item: ApiProduct): Product => ({
    id: Number(item.id),
    name: String(item.name || ''),
    slug: String(item.slug || toSlug(item.name)),
    description: String(item.description || ''),
    image_url: resolveAssetUrl(item.image_url),
    external_link: String(item.external_link || ''),
    categoryId: item.categoryId === null || item.categoryId === undefined || item.categoryId === '' ? null : Number(item.categoryId),
    categoryName: String(item.categoryName ?? item.category_name ?? '')
  })

  const loadProducts = async (params: ProductListParams = {}) => {
    const res = await apiFetch<unknown>(`/products${toQueryString(params)}`)
    paginationMeta.value = toApiPaginationMeta(res, Number(params.limit) || 10)
    return toApiArray<ApiProduct>(res).map(normalizeProduct)
  }

  const productsQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => loadProducts(),
    enabled: options.immediate !== false
  })

  const products = computed(() => productsQuery.data.value || [])
  const isLoading = computed(() => manualLoading.value || productsQuery.isLoading.value || productsQuery.isFetching.value)
  const error = computed(() => mutationError.value || (productsQuery.error.value ? 'Unable to load products right now.' : null))

  const toProductFormData = (payload: any) => toFormData({
    name: payload.name,
    description: payload.description,
    external_link: payload.external_link,
    categoryId: payload.categoryId,
    image_url: payload.imageFile ?? payload.image_url
  })

  const fetchProducts = async (params: ProductListParams = {}) => {
    mutationError.value = null
    manualLoading.value = true
    try {
      const items = await loadProducts(params)
      queryClient.setQueryData(PRODUCTS_QUERY_KEY, items)
      return items
    } catch (fetchError) {
      console.error(fetchError)
      mutationError.value = 'Unable to load products right now.'
      return []
    } finally {
      manualLoading.value = false
    }
  }

  const invalidateProducts = () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })

  const createProductMutation = useMutation({
    mutationFn: (payload: any) => apiFetch<ApiProduct>('/products', { method: 'POST', body: toProductFormData(payload) }),
    onSuccess: () => invalidateProducts()
  })

  const updateProductMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: any }) =>
      apiFetch(`/products/${id}`, { method: 'PUT', body: toProductFormData(payload) }),
    onSuccess: () => invalidateProducts()
  })

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEY })
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY)
      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (current = []) => current.filter((item) => item.id !== id))
      return { previousProducts }
    },
    onError: (_error, _id, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts)
      }
    },
    onSettled: () => invalidateProducts()
  })

  const createProduct = async (payload: any) => {
    const res = await createProductMutation.mutateAsync(payload)
    return res ? normalizeProduct(res) : null
  }

  const updateProduct = async (id: number, payload: any) => {
    await updateProductMutation.mutateAsync({ id, payload })
    return products.value.find((item) => item.id === id) || null
  }

  const deleteProduct = async (id: number) => {
    return deleteProductMutation.mutateAsync(id)
  }

  return { products, isLoading, error, paginationMeta, fetchProducts, createProduct, updateProduct, deleteProduct }
}
