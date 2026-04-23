import type { ApiContactMessage, ContactMessage } from '~/types/api'

export const useContact = () => {
  const { apiFetch } = useApi()
  const messages = ref<ContactMessage[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const formatDate = (value?: string | null) => {
    if (!value) return ''

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(value))
  }

  const toReadFlag = (value: ApiContactMessage['is_read']) => {
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value === 1
    if (typeof value === 'string') return value === '1' || value.toLowerCase() === 'true'
    return false
  }

  const normalizeMessage = (item: ApiContactMessage): ContactMessage => ({
    id: Number(item.id),
    name: String(item.name || ''),
    email: String(item.email || ''),
    subject: String(item.subject || ''),
    message: String(item.message || ''),
    summary: String(item.message || '').slice(0, 64),
    body: String(item.message || ''),
    is_read: toReadFlag(item.is_read),
    createdAt: item.createdAt || null,
    dateLabel: formatDate(item.createdAt)
  })

  const fetchMessages = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await apiFetch<ApiContactMessage[]>('/contact')
      messages.value = (res || []).map(normalizeMessage)
    } catch (fetchError) {
      console.error('Failed to fetch contact messages', fetchError)
      messages.value = []
      error.value = 'Unable to load inbox messages right now.'
    } finally {
      isLoading.value = false
    }
  }

  const createMessage = async (payload: { name: string; email: string; subject: string; message: string }) => {
    return apiFetch('/contact', {
      method: 'POST',
      body: payload
    })
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
    error,
    fetchMessages,
    createMessage,
    markAsRead,
    deleteMessage
  }
}
