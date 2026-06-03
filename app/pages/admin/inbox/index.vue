<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Conversations</p>
          <h1 class="admin-title">Inbox</h1>
          <p class="admin-copy">Review customer questions, track unread messages, and handle replies from one compact inbox surface.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button class="admin-secondary-btn" @click="refreshMessages">
            <RefreshCw class="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div class="admin-stat-grid mt-6">
        <component
          :is="stat.filter ? 'button' : 'article'"
          v-for="stat in stats"
          :key="stat.label"
          type="button"
          class="admin-stat-card text-left transition hover:border-[var(--admin-accent)] hover:bg-white"
          :class="[
            stat.filter ? 'cursor-pointer' : 'cursor-default hover:border-[var(--admin-border)] hover:bg-[var(--admin-surface-soft)]',
            stat.filter && messageFilter === stat.filter ? 'border-[var(--admin-accent)] bg-white ring-4 ring-[var(--admin-accent-soft)]' : ''
          ]"
          @click="setMessageFilter(stat.filter)"
        >
          <p class="admin-stat-label">{{ stat.label }}</p>
          <div class="admin-stat-value">{{ stat.value }}</div>
          <p class="admin-stat-meta">{{ stat.meta }}</p>
        </component>
      </div>
    </section>

    <section class="admin-panel overflow-hidden">
      <div class="grid min-h-[680px] grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div class="border-r border-[var(--admin-border)] bg-[var(--admin-surface-soft)]">
          <div class="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
            <div>
              <p class="text-sm font-semibold text-slate-900">Messages</p>
              <p class="mt-1 text-xs text-[var(--admin-muted)]">Latest customer inquiries</p>
            </div>
            <button class="admin-icon-btn" type="button" :title="`Current filter: ${messageFilterLabel}`" @click="cycleMessageFilter">
              <Filter class="h-4 w-4" />
            </button>
          </div>

          <div class="custom-scrollbar max-h-[620px] overflow-y-auto">
            <button
              v-for="msg in filteredMessages"
              :key="msg.id"
              type="button"
              @click="selectedMessage = msg"
              class="relative block w-full border-b border-[var(--admin-border)] px-5 py-4 text-left transition"
              :class="selectedMessage?.id === msg.id ? 'bg-white' : 'hover:bg-white/70'"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-sm text-slate-900" :class="!msg.is_read ? 'font-semibold' : 'font-medium'">{{ msg.name }}</p>
                  <p class="mt-1 truncate text-sm text-slate-600">{{ msg.subject }}</p>
                  <p class="mt-1 line-clamp-1 text-xs text-slate-400">{{ msg.summary }}</p>
                </div>
                <span class="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{{ msg.dateLabel || '-' }}</span>
              </div>
              <span v-if="!msg.is_read" class="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-[var(--admin-accent)]"></span>
            </button>

            <div v-if="!filteredMessages.length" class="admin-empty-state">No messages match this filter.</div>
          </div>
        </div>

        <div class="flex min-h-[680px] flex-col bg-white">
          <div v-if="selectedMessage" class="custom-scrollbar flex-1 overflow-y-auto px-6 py-6 lg:px-8">
            <div class="flex flex-col gap-6 border-b border-[var(--admin-border)] pb-6 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p class="admin-kicker">Message Detail</p>
                <h2 class="mt-2 text-2xl font-semibold text-slate-900">{{ selectedMessage.subject }}</h2>
                <div class="mt-4 flex items-center gap-3">
                  <div class="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--admin-accent)] text-sm font-semibold text-white">
                    {{ selectedMessage.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-slate-900">{{ selectedMessage.name }}</p>
                    <p class="text-xs text-slate-400">{{ selectedMessage.email }}</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  v-if="!selectedMessage.is_read"
                  @click="handleMarkAsRead(selectedMessage)"
                  class="admin-primary-btn"
                >
                  <Check class="h-4 w-4" />
                  Mark as Read
                </button>
                <button @click="handleDelete(selectedMessage.id)" class="admin-icon-btn hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="mt-6 rounded-[14px] border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-5">
              <p class="whitespace-pre-wrap text-sm leading-7 text-slate-600">{{ selectedMessage.body }}</p>
            </div>
          </div>

          <div v-else class="flex flex-1 flex-col items-center justify-center px-6 text-center text-slate-500">
            <Mail class="h-14 w-14 text-slate-300" />
            <p class="mt-4 text-base font-medium text-slate-600">Select a message to read</p>
            <p class="mt-2 max-w-sm text-sm text-slate-400">New customer messages and contact requests will appear here.</p>
          </div>
        </div>
      </div>
    </section>

    <AdminConfirmModal
      v-model="deleteState.open"
      title="Delete Message"
      message="This inbox message will be deleted permanently."
      :detail="deleteState.name"
      :is-loading="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Check, Filter, Mail, RefreshCw, Trash2 } from 'lucide-vue-next'

const { messages, fetchMessages, markAsRead, deleteMessage } = useContact()
const selectedMessage = ref(null)
const messageFilter = ref('all')
const isDeleting = ref(false)
const deleteState = ref({ open: false, id: null, name: '' })

const messagesForCurrentFilter = () => {
  if (messageFilter.value === 'unread') return messages.value.filter((msg) => !msg.is_read)
  if (messageFilter.value === 'read') return messages.value.filter((msg) => msg.is_read)
  return messages.value
}

const filteredMessages = computed(messagesForCurrentFilter)

const messageFilterLabel = computed(() => {
  if (messageFilter.value === 'unread') return 'Unread'
  if (messageFilter.value === 'read') return 'Read'
  return 'All'
})

const stats = computed(() => [
  { label: 'Total Messages', value: messages.value.length, meta: 'Customer inquiries in inbox', filter: 'all' },
  { label: 'Unread', value: messages.value.filter((msg) => !msg.is_read).length, meta: 'Need your attention', filter: 'unread' },
  { label: 'Read', value: messages.value.filter((msg) => msg.is_read).length, meta: 'Already reviewed', filter: 'read' },
  { label: 'Active Thread', value: selectedMessage.value ? 1 : 0, meta: selectedMessage.value ? selectedMessage.value.name : 'No message selected' }
])

const setMessageFilter = (filter) => {
  if (!filter) return
  messageFilter.value = filter
  syncSelectedMessage()
}

const cycleMessageFilter = () => {
  const filters = ['all', 'unread', 'read']
  const currentIndex = filters.indexOf(messageFilter.value)
  const nextFilter = filters[(currentIndex + 1) % filters.length]
  setMessageFilter(nextFilter)
}

const syncSelectedMessage = (preferredId = selectedMessage.value?.id) => {
  const availableMessages = messagesForCurrentFilter()

  if (!availableMessages.length) {
    selectedMessage.value = null
    return
  }

  selectedMessage.value = availableMessages.find((msg) => msg.id === preferredId) || availableMessages[0]
}

const refreshMessages = async () => {
  await fetchMessages()
  syncSelectedMessage()
}

const handleMarkAsRead = async (msg) => {
  await markAsRead(msg.id)
  syncSelectedMessage(msg.id)
}

const handleDelete = (id) => {
  const message = messages.value.find((msg) => msg.id === id)
  deleteState.value = { open: true, id, name: message?.subject || `Message ID ${id}` }
}

const confirmDelete = async () => {
  if (!deleteState.value.id || isDeleting.value) return

  isDeleting.value = true
  try {
    await deleteMessage(deleteState.value.id)
    deleteState.value = { open: false, id: null, name: '' }
    syncSelectedMessage()
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  refreshMessages()
})
</script>
