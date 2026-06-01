import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiProduct, Product } from '~/types/api'
import { toSlug } from '~/composables/useSlug'

const PRODUCTS_QUERY_KEY = ['products'] as const

export const useProducts = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)

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

  const loadProducts = async () => {
    const res = await apiFetch<ApiProduct[]>('/products')
    return (res || []).map(normalizeProduct)
  }

  const productsQuery = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: loadProducts
  })

  const products = computed(() => productsQuery.data.value || [])
  const isLoading = computed(() => productsQuery.isLoading.value || productsQuery.isFetching.value)
  const error = computed(() => mutationError.value || (productsQuery.error.value ? 'Unable to load products right now.' : null))

  const toProductFormData = (payload: any) => toFormData({
    name: payload.name,
    description: payload.description,
    external_link: payload.external_link,
    categoryId: payload.categoryId,
    image_url: payload.imageFile ?? payload.image_url
  })

  const fetchProducts = async () => {
    mutationError.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: PRODUCTS_QUERY_KEY,
        queryFn: loadProducts
      })
    } catch (fetchError) {
      console.error(fetchError)
      mutationError.value = 'Unable to load products right now.'
      return []
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

  return { products, isLoading, error, fetchProducts, createProduct, updateProduct, deleteProduct }
}
