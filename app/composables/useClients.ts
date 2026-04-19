export const useClients = () => {
  const { apiFetch, resolveAssetUrl } = useApi()
  const clients = ref<any[]>([])
  const isLoading = ref(false)

  const normalizeClient = (item: any) => ({
    ...item,
    logo_url: resolveAssetUrl(item.logo_url)
  })

  const fetchClients = async () => {
    isLoading.value = true
    try {
      const res = await apiFetch<any[]>('/clients')
      clients.value = res.map(normalizeClient)
    } catch (error) {
      console.error('Failed to fetch clients', error)
    } finally {
      isLoading.value = false
    }
  }

  const toClientFormData = (payload: any) => toFormData({
    name: payload.name,
    external_link: payload.external_link,
    logo_url: payload.logoFile ?? payload.logo_url
  })

  const createClient = async (payload: any) => {
    const res = await apiFetch('/clients', {
      method: 'POST',
      body: toClientFormData(payload)
    })

    await fetchClients()
    return normalizeClient(res)
  }

  const updateClient = async (id: number, payload: any) => {
    const res = await apiFetch(`/clients/${id}`, {
      method: 'PUT',
      body: toClientFormData(payload)
    })

    await fetchClients()
    return normalizeClient(res)
  }

  const deleteClient = async (id: number) => {
    const res = await apiFetch(`/clients/${id}`, { method: 'DELETE' })
    await fetchClients()
    return res
  }

  return {
    clients,
    isLoading,
    fetchClients,
    createClient,
    updateClient,
    deleteClient
  }
}
