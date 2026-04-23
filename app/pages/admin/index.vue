<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Overview</p>
          <h1 class="admin-title">Dashboard</h1>
          <p class="admin-copy">
            A simplified control room for public-site activity and the latest incoming contact messages.
          </p>
        </div>

        <button class="admin-secondary-btn" @click="refreshDashboard">
          <RefreshCw class="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div class="admin-stat-grid mt-6">
        <article v-for="stat in stats" :key="stat.label" class="admin-stat-card">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="admin-stat-label">{{ stat.label }}</p>
              <div class="admin-stat-value">{{ stat.value }}</div>
              <p class="admin-stat-meta">{{ stat.meta }}</p>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl" :class="stat.iconWrapClass">
              <component :is="stat.icon" class="h-5 w-5" :class="stat.iconClass" />
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
      <div class="admin-table-shell">
        <div class="admin-toolbar">
          <div>
            <p class="text-sm font-semibold text-slate-900">Live Incoming Messages</p>
            <p class="mt-1 text-xs text-[var(--admin-muted)]">
              Auto-refreshes every 30 seconds from the public contact endpoint.
            </p>
          </div>
          <div class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {{ lastSyncedLabel }}
          </div>
        </div>

        <div v-if="isLoading" class="space-y-3 p-5">
          <div v-for="index in 4" :key="`msg-loading-${index}`" class="animate-pulse rounded-2xl border border-[var(--admin-border)] p-4">
            <div class="h-4 w-1/3 rounded bg-slate-100"></div>
            <div class="mt-3 h-4 w-full rounded bg-slate-100"></div>
            <div class="mt-2 h-4 w-4/5 rounded bg-slate-100"></div>
          </div>
        </div>

        <div v-else-if="sortedMessages.length" class="divide-y divide-[var(--admin-border)]">
          <article
            v-for="message in sortedMessages"
            :key="message.id"
            class="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50/70 md:flex-row md:items-start md:justify-between"
          >
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-3">
                <p class="font-semibold text-slate-900">{{ message.name }}</p>
                <span class="admin-badge">{{ message.subject || 'No subject' }}</span>
                <span class="admin-status" :class="message.is_read ? 'admin-status-neutral' : 'admin-status-success'">
                  {{ message.is_read ? 'Read' : 'New' }}
                </span>
              </div>
              <p class="mt-2 text-sm text-slate-500">{{ message.email }}</p>
              <p class="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{{ message.body }}</p>
            </div>

            <div class="flex shrink-0 items-center gap-2">
              <div class="text-right">
                <p class="text-sm font-semibold text-slate-700">{{ message.dateLabel || 'Latest' }}</p>
                <p class="mt-1 text-xs text-slate-400">ID {{ message.id }}</p>
              </div>
              <button
                v-if="!message.is_read"
                class="admin-icon-btn"
                @click="handleMarkAsRead(message.id)"
                title="Mark as read"
              >
                <Eye class="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>

        <div v-else class="admin-empty-state">
          {{ error || 'No incoming messages yet.' }}
        </div>
      </div>

      <div class="space-y-6">
        <section class="admin-panel p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-900">Landing Page Activity</p>
              <p class="mt-1 text-xs text-[var(--admin-muted)]">Tracked locally from public homepage visits on this browser.</p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
              <Globe class="h-5 w-5 text-blue-500" />
            </div>
          </div>

          <div class="mt-5 space-y-4">
            <div class="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Today</p>
              <p class="mt-2 text-3xl font-semibold text-slate-900">{{ analytics.todayVisits }}</p>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Total</p>
                <p class="mt-2 text-xl font-semibold text-slate-900">{{ analytics.totalVisits }}</p>
              </div>
              <div class="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Last Visit</p>
                <p class="mt-2 text-sm font-semibold text-slate-900">{{ lastVisitLabel }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="admin-panel p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-900">Unread Queue</p>
              <p class="mt-1 text-xs text-[var(--admin-muted)]">Latest messages waiting for follow-up.</p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
              <Inbox class="h-5 w-5 text-emerald-500" />
            </div>
          </div>

          <div v-if="unreadMessages.length" class="mt-5 space-y-3">
            <article
              v-for="message in unreadMessages"
              :key="message.id"
              class="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="font-semibold text-slate-900">{{ message.name }}</p>
                  <p class="mt-1 text-sm text-slate-500">{{ message.subject || 'No subject' }}</p>
                </div>
                <span class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{{ message.dateLabel || 'Latest' }}</span>
              </div>
              <p class="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{{ message.summary }}</p>
            </article>
          </div>

          <div v-else class="mt-5 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-4 text-sm text-slate-500">
            No unread messages right now.
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Eye, Globe, Inbox, RefreshCw } from 'lucide-vue-next'

const { analytics, readAnalytics } = useLandingAnalytics()
const { messages, error, isLoading, fetchMessages, markAsRead } = useContact()

const lastSyncedAt = ref<Date | null>(null)
let refreshTimer: ReturnType<typeof setInterval> | null = null

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return 'Not yet'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value))
}

const refreshDashboard = async () => {
  readAnalytics()
  await fetchMessages()
  lastSyncedAt.value = new Date()
}

const handleMarkAsRead = async (id: number) => {
  await markAsRead(id)
  lastSyncedAt.value = new Date()
}

const sortedMessages = computed(() => {
  return [...messages.value].sort((a, b) => {
    const left = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const right = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return right - left
  })
})

const unreadMessages = computed(() => sortedMessages.value.filter((message) => !message.is_read).slice(0, 4))

const lastVisitLabel = computed(() => formatDateTime(analytics.value.lastVisitedAt))
const lastSyncedLabel = computed(() => lastSyncedAt.value ? `Synced ${formatDateTime(lastSyncedAt.value)}` : 'Waiting for first sync')

const stats = computed(() => [
  {
    label: 'Landing Page Visits',
    value: analytics.value.todayVisits,
    meta: 'Tracked locally for today on this browser',
    icon: Globe,
    iconWrapClass: 'bg-blue-50',
    iconClass: 'text-blue-500'
  },
  {
    label: 'Total Messages',
    value: messages.value.length,
    meta: 'Fetched from the public contact inbox',
    icon: Inbox,
    iconWrapClass: 'bg-slate-100',
    iconClass: 'text-slate-600'
  },
  {
    label: 'Unread Messages',
    value: messages.value.filter((message) => !message.is_read).length,
    meta: 'Need follow-up from the admin team',
    icon: Eye,
    iconWrapClass: 'bg-emerald-50',
    iconClass: 'text-emerald-500'
  }
])

onMounted(async () => {
  await refreshDashboard()
  refreshTimer = setInterval(refreshDashboard, 30000)
})

onBeforeUnmount(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})
</script>
