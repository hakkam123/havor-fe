import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiContactMessage, ContactMessage } from '~/types/api'

const CONTACT_MESSAGES_QUERY_KEY = ['contact-messages'] as const

export const useContact = () => {
  const { apiFetch } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)

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

  const loadMessages = async () => {
    const res = await apiFetch<ApiContactMessage[]>('/contact')
    return (res || []).map(normalizeMessage)
  }

  const messagesQuery = useQuery({
    queryKey: CONTACT_MESSAGES_QUERY_KEY,
    queryFn: loadMessages,
    refetchInterval: 30_000
  })

  const messages = computed(() => messagesQuery.data.value || [])
  const isLoading = computed(() => messagesQuery.isLoading.value || messagesQuery.isFetching.value)
  const error = computed(() => mutationError.value || (messagesQuery.error.value ? 'Unable to load inbox messages right now.' : null))

  const fetchMessages = async () => {
    mutationError.value = null
    try {
      return await queryClient.ensureQueryData({
        queryKey: CONTACT_MESSAGES_QUERY_KEY,
        queryFn: loadMessages
      })
    } catch (fetchError) {
      console.error('Failed to fetch contact messages', fetchError)
      mutationError.value = 'Unable to load inbox messages right now.'
      return []
    }
  }

  const invalidateMessages = () => queryClient.invalidateQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY })

  const createMessageMutation = useMutation({
    mutationFn: (payload: { name: string; email: string; subject: string; message: string }) => apiFetch('/contact', {
      method: 'POST',
      body: payload
    }),
    onSuccess: () => invalidateMessages()
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/contact/${id}/read`, { method: 'PUT' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY })
      const previousMessages = queryClient.getQueryData<ContactMessage[]>(CONTACT_MESSAGES_QUERY_KEY)
      queryClient.setQueryData<ContactMessage[]>(CONTACT_MESSAGES_QUERY_KEY, (current = []) =>
        current.map((item) => item.id === id ? { ...item, is_read: true } : item)
      )
      return { previousMessages }
    },
    onError: (_error, _id, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(CONTACT_MESSAGES_QUERY_KEY, context.previousMessages)
      }
    },
    onSettled: () => invalidateMessages()
  })

  const deleteMessageMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/contact/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CONTACT_MESSAGES_QUERY_KEY })
      const previousMessages = queryClient.getQueryData<ContactMessage[]>(CONTACT_MESSAGES_QUERY_KEY)
      queryClient.setQueryData<ContactMessage[]>(CONTACT_MESSAGES_QUERY_KEY, (current = []) => current.filter((item) => item.id !== id))
      return { previousMessages }
    },
    onError: (_error, _id, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(CONTACT_MESSAGES_QUERY_KEY, context.previousMessages)
      }
    },
    onSettled: () => invalidateMessages()
  })

  const createMessage = async (payload: { name: string; email: string; subject: string; message: string }) => {
    return createMessageMutation.mutateAsync(payload)
  }

  const markAsRead = async (id: number) => {
    return markAsReadMutation.mutateAsync(id)
  }

  const deleteMessage = async (id: number) => {
    return deleteMessageMutation.mutateAsync(id)
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
