import type { ApiClient, Client } from '~/types/api'

export const useClients = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const clients = ref<Client[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const normalizeClient = (item: ApiClient): Client => ({
    id: Number(item.id),
    name: String(item.name || ''),
    description: String(item.description || ''),
    excerpt: String(item.description || '').slice(0, 96),
    client_icon: resolveAssetUrl(item.client_icon)
  })

  const fetchClients = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<ApiClient[]>('/clients')
      clients.value = (res || []).map(normalizeClient)
    } catch (fetchError) {
      console.error('Failed to fetch clients', fetchError)
      clients.value = []
      error.value = 'Unable to load client data right now.'
    } finally {
      isLoading.value = false
    }
  }

  const toClientFormData = (payload: any) => toFormData({
    name: payload.name,
    description: payload.description,
    client_icon: payload.clientFile ?? payload.client_icon
  })

  const createClient = async (payload: any) => {
    const res = await apiFetch<ApiClient>('/clients', {
      method: 'POST',
      body: toClientFormData(payload)
    })

    await fetchClients()
    return res ? normalizeClient(res) : null
  }

  const updateClient = async (id: number, payload: any) => {
    await apiFetch(`/clients/${id}`, {
      method: 'PUT',
      body: toClientFormData(payload)
    })

    await fetchClients()
    return clients.value.find((item) => item.id === id) || null
  }

  const deleteClient = async (id: number) => {
    const res = await apiFetch(`/clients/${id}`, { method: 'DELETE' })
    await fetchClients()
    return res
  }

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient
  }
}
