export const useCollection = (collectionPath: string) => {
  const { apiFetch } = useApi()
  const items = ref<any[]>([])
  const isLoading = ref(false)

  const fetchItems = async (query = '') => {
    isLoading.value = true
    try {
      const res = await apiFetch<any[]>(`/${collectionPath}${query}`)
      items.value = res
    } catch (e) {
      console.error(`Failed to fetch ${collectionPath}`, e)
    } finally {
      isLoading.value = false
    }
  }

  const createItem = async (payload: any) => {
    const res = await apiFetch(`/${collectionPath}`, { method: 'POST', body: payload })
    await fetchItems()
    return res
  }

  const updateItem = async (id: number, payload: any) => {
    const res = await apiFetch(`/${collectionPath}/${id}`, { method: 'PUT', body: payload })
    await fetchItems()
    return res
  }

  const deleteItem = async (id: number) => {
    const res = await apiFetch(`/${collectionPath}/${id}`, { method: 'DELETE' })
    await fetchItems()
    return res
  }

  return { items, isLoading, fetchItems, createItem, updateItem, deleteItem }
}
