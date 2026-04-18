export const useContact = () => {
  const { apiFetch } = useApi()
  const messages = ref<any[]>([])
  const isLoading = ref(false)

  const formatDate = (value?: string | null) => {
    if (!value) return ''

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(value))
  }

  const normalizeMessage = (item: any) => ({
    ...item,
    summary: item.message?.slice(0, 64) || '',
    body: item.message || '',
    dateLabel: formatDate(item.createdAt)
  })

  const fetchMessages = async () => {
    isLoading.value = true
    try {
      const res = await apiFetch<any[]>('/contact')
      messages.value = res.map(normalizeMessage)
    } catch (error) {
      console.error('Failed to fetch contact messages', error)
    } finally {
      isLoading.value = false
    }
  }

  const markAsRead = async (id: number) => {
    const res = await apiFetch(`/contact/${id}/read`, { method: 'PUT' })
    await fetchMessages()
    return res
  }

  const deleteMessage = async (id: number) => {
    const res = await apiFetch(`/contact/${id}`, { method: 'DELETE' })
    await fetchMessages()
    return res
  }

  return {
    messages,
    isLoading,
    fetchMessages,
    markAsRead,
    deleteMessage
  }
}
