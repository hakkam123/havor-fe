import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiClient, Client } from '~/types/api'
import { toApiArray, toApiPaginationMeta, toQueryString, type ApiPaginationMeta } from '~/utils/apiData'

const CLIENTS_QUERY_KEY = ['clients'] as const

type UseClientsOptions = {
  immediate?: boolean
}

type ClientListParams = {
  page?: number
  limit?: number
  search?: string
}

export const useClients = (options: UseClientsOptions = {}) => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)
  const manualLoading = ref(false)
  const paginationMeta = ref<ApiPaginationMeta>(toApiPaginationMeta(null))

  const normalizeClient = (item: ApiClient): Client => ({
    id: Number(item.id),
    name: String(item.name || ''),
    description: String(item.description || ''),
    excerpt: String(item.description || '').slice(0, 96),
    client_icon: resolveAssetUrl(item.client_icon)
  })

  const toClientFormData = (payload: any) => toFormData({
    name: payload.name,
    description: payload.description,
    client_icon: payload.clientFile ?? payload.client_icon
  })

  const loadClients = async (params: ClientListParams = {}) => {
    const res = await apiFetch<unknown>(`/clients${toQueryString(params)}`)
    paginationMeta.value = toApiPaginationMeta(res, Number(params.limit) || 10)
    return toApiArray<ApiClient>(res).map(normalizeClient)
  }

  const clientsQuery = useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: () => loadClients(),
    enabled: options.immediate !== false
  })

  const clients = computed(() => clientsQuery.data.value || [])
  const isLoading = computed(() => manualLoading.value || clientsQuery.isLoading.value || clientsQuery.isFetching.value)
  const error = computed(() => mutationError.value || (clientsQuery.error.value ? 'Unable to load client data right now.' : null))

  const fetchClients = async (params: ClientListParams = {}) => {
    mutationError.value = null
    manualLoading.value = true
    try {
      const items = await loadClients(params)
      queryClient.setQueryData(CLIENTS_QUERY_KEY, items)
      return items
    } catch (fetchError) {
      console.error('Failed to fetch clients', fetchError)
      mutationError.value = 'Unable to load client data right now.'
      return []
    } finally {
      manualLoading.value = false
    }
  }

  const invalidateClients = () => queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY })

  const createClientMutation = useMutation({
    mutationFn: (payload: any) => apiFetch<ApiClient>('/clients', {
      method: 'POST',
      body: toClientFormData(payload)
    }),
    onSuccess: () => invalidateClients()
  })

  const updateClientMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: any }) => apiFetch(`/clients/${id}`, {
      method: 'PUT',
      body: toClientFormData(payload)
    }),
    onSuccess: () => invalidateClients()
  })

  const deleteClientMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/clients/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CLIENTS_QUERY_KEY })
      const previousClients = queryClient.getQueryData<Client[]>(CLIENTS_QUERY_KEY)
      queryClient.setQueryData<Client[]>(CLIENTS_QUERY_KEY, (current = []) => current.filter((item) => item.id !== id))
      return { previousClients }
    },
    onError: (_error, _id, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(CLIENTS_QUERY_KEY, context.previousClients)
      }
    },
    onSettled: () => invalidateClients()
  })

  const createClient = async (payload: any) => {
    const res = await createClientMutation.mutateAsync(payload)
    return res ? normalizeClient(res) : null
  }

  const updateClient = async (id: number, payload: any) => {
    await updateClientMutation.mutateAsync({ id, payload })
    return clients.value.find((item) => item.id === id) || null
  }

  const deleteClient = async (id: number) => {
    return deleteClientMutation.mutateAsync(id)
  }

  return {
    clients,
    isLoading,
    error,
    paginationMeta,
    fetchClients,
    createClient,
    updateClient,
    deleteClient
  }
}
