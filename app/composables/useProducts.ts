export const useProducts = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const products = ref<any[]>([])
  const isLoading = ref(false)

  const normalizeProduct = (item: any) => ({
    ...item,
    image_url: resolveAssetUrl(item.image_url),
    categoryName: item.categoryName ?? item.category_name ?? ''
  })

  const fetchProducts = async () => {
    isLoading.value = true
    try {
      const res = await apiFetch<any[]>('/products')
      products.value = res.map(normalizeProduct)
    } catch (e) {
      console.error(e)
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
    const res = await apiFetch('/products', { method: 'POST', body: toProductFormData(payload) })
    await fetchProducts()
    return normalizeProduct(res)
  }

  const updateProduct = async (id: number, payload: any) => {
    const res = await apiFetch(`/products/${id}`, { method: 'PUT', body: toProductFormData(payload) })
    await fetchProducts()
    return normalizeProduct(res)
  }

  const deleteProduct = async (id: number) => {
    const res = await apiFetch(`/products/${id}`, { method: 'DELETE' })
    await fetchProducts()
    return res
  }

  return { products, isLoading, fetchProducts, createProduct, updateProduct, deleteProduct }
}
