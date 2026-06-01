import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export const useCollection = (collectionPath: string) => {
  const { apiFetch } = useApi()
  const queryClient = useQueryClient()
  const activeQuery = ref('')
  const error = ref<string | null>(null)
  const collectionQueryKey = computed(() => ['collection', collectionPath, activeQuery.value])

  const loadItems = async () => {
    return await apiFetch<any[]>(`/${collectionPath}${activeQuery.value}`)
  }

  const collectionQuery = useQuery({
    queryKey: collectionQueryKey,
    queryFn: loadItems
  })

  const items = computed(() => collectionQuery.data.value || [])
  const isLoading = computed(() => collectionQuery.isLoading.value || collectionQuery.isFetching.value)

  const invalidateCollection = () => queryClient.invalidateQueries({ queryKey: ['collection', collectionPath] })

  const fetchItems = async (query = '') => {
    activeQuery.value = query
    error.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: collectionQueryKey.value,
        queryFn: loadItems
      })
    } catch (fetchError) {
      console.error(`Failed to fetch ${collectionPath}`, fetchError)
      error.value = `Unable to load ${collectionPath} right now.`
      return []
    }
  }

  const createItemMutation = useMutation({
    mutationFn: (payload: any) => apiFetch(`/${collectionPath}`, { method: 'POST', body: payload }),
    onSuccess: () => invalidateCollection()
  })

  const updateItemMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: any }) =>
      apiFetch(`/${collectionPath}/${id}`, { method: 'PUT', body: payload }),
    onSuccess: () => invalidateCollection()
  })

  const deleteItemMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/${collectionPath}/${id}`, { method: 'DELETE' }),
    onSettled: () => invalidateCollection()
  })

  const createItem = async (payload: any) => {
    return createItemMutation.mutateAsync(payload)
  }

  const updateItem = async (id: number, payload: any) => {
    return updateItemMutation.mutateAsync({ id, payload })
  }

  const deleteItem = async (id: number) => {
    return deleteItemMutation.mutateAsync(id)
  }

  return { items, isLoading, error, fetchItems, createItem, updateItem, deleteItem }
}
