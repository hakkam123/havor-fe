import type { ApiProduct, Product } from '~/types/api'

export const useProducts = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const normalizeProduct = (item: ApiProduct): Product => ({
    id: Number(item.id),
    name: String(item.name || ''),
    description: String(item.description || ''),
    image_url: resolveAssetUrl(item.image_url),
    external_link: String(item.external_link || ''),
    categoryId: item.categoryId === null || item.categoryId === undefined || item.categoryId === '' ? null : Number(item.categoryId),
    categoryName: String(item.categoryName ?? item.category_name ?? '')
  })

  const fetchProducts = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<ApiProduct[]>('/products')
      products.value = (res || []).map(normalizeProduct)
    } catch (fetchError) {
      console.error(fetchError)
      products.value = []
      error.value = 'Unable to load products right now.'
    } finally {
      isLoading.value = false
    }
  }

  const toProductFormData = (payload: any) => toFormData({
    name: payload.name,
    description: payload.description,
    external_link: payload.external_link,
    categoryId: payload.categoryId,
    image_url: payload.imageFile ?? payload.image_url
  })

  const createProduct = async (payload: any) => {
    const res = await apiFetch<ApiProduct>('/products', { method: 'POST', body: toProductFormData(payload) })
    await fetchProducts()
    return res ? normalizeProduct(res) : null
  }

  const updateProduct = async (id: number, payload: any) => {
    await apiFetch(`/products/${id}`, { method: 'PUT', body: toProductFormData(payload) })
    await fetchProducts()
    return products.value.find((item) => item.id === id) || null
  }

  const deleteProduct = async (id: number) => {
    const res = await apiFetch(`/products/${id}`, { method: 'DELETE' })
    await fetchProducts()
    return res
  }

  return { products, isLoading, error, fetchProducts, createProduct, updateProduct, deleteProduct }
}
