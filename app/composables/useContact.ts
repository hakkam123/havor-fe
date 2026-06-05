import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ApiContactMessage, ContactMessage } from '~/types/api'
import { toApiArray, toApiPaginationMeta, toQueryString, type ApiPaginationMeta } from '~/utils/apiData'

const CONTACT_MESSAGES_QUERY_KEY = ['contact-messages'] as const

type UseContactOptions = {
  immediate?: boolean
}

type ContactListParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export const useContact = (options: UseContactOptions = {}) => {
  const { apiFetch } = useApi()
  const queryClient = useQueryClient()
  const mutationError = ref<string | null>(null)
  const manualLoading = ref(false)
  const paginationMeta = ref<ApiPaginationMeta>(toApiPaginationMeta(null))

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

  const loadMessages = async (params: ContactListParams = {}) => {
    const res = await apiFetch<unknown>(`/contact${toQueryString(params)}`)
    paginationMeta.value = toApiPaginationMeta(res, Number(params.limit) || 10)
    return toApiArray<ApiContactMessage>(res).map(normalizeMessage)
  }

  const messagesQuery = useQuery({
    queryKey: CONTACT_MESSAGES_QUERY_KEY,
    queryFn: () => loadMessages(),
    refetchInterval: options.immediate === false ? false : 30_000,
    enabled: options.immediate !== false
  })

  const messages = computed(() => messagesQuery.data.value || [])
  const isLoading = computed(() => manualLoading.value || messagesQuery.isLoading.value || messagesQuery.isFetching.value)
  const error = computed(() => mutationError.value || (messagesQuery.error.value ? 'Unable to load inbox messages right now.' : null))

  const fetchMessages = async (params: ContactListParams = {}) => {
    mutationError.value = null
    manualLoading.value = true
    try {
      const items = await loadMessages(params)
      queryClient.setQueryData(CONTACT_MESSAGES_QUERY_KEY, items)
      return items
    } catch (fetchError) {
      console.error('Failed to fetch contact messages', fetchError)
      mutationError.value = 'Unable to load inbox messages right now.'
      return []
    } finally {
      manualLoading.value = false
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
    paginationMeta,
    fetchMessages,
    createMessage,
    markAsRead,
    deleteMessage
  }
}
