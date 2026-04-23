<template>
  <aside class="admin-panel custom-scrollbar hidden h-[calc(100vh-2rem)] w-[268px] flex-shrink-0 overflow-y-auto lg:fixed lg:left-4 lg:top-4 lg:z-30 lg:flex lg:flex-col">
    <div class="border-b border-[var(--admin-border)] px-5 pb-5 pt-6">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <img src="/logo-havor.svg" alt="Havor" class="h-11 w-11 rounded-2xl object-cover" >
          <div>
            <p class="text-sm font-semibold text-[var(--admin-text)]">Havor CMS</p>
          </div>
        </div>
        <button class="admin-icon-btn h-8 w-8 rounded-xl">
          <PanelLeftClose class="h-4 w-4" />
        </button>
      </div>

      <div class="relative mt-5">
        <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Search" class="admin-input pl-11" >
      </div>
    </div>

    <div class="flex-1 space-y-6 px-4 py-5">
      <section v-for="section in menuSections" :key="section.label">
        <p class="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--admin-muted)]">
          {{ section.label }}
        </p>

        <nav class="mt-3 space-y-1.5">
          <NuxtLink
            v-for="item in section.items"
            :key="item.path"
            :to="item.path"
            class="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition"
            :class="isActive(item.path) ? 'bg-[var(--admin-surface-soft)] text-[var(--admin-text)]' : 'text-slate-500 hover:bg-slate-50 hover:text-[var(--admin-text)]'"
          >
            <div class="flex min-w-0 items-center gap-3">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-xl border text-sm transition"
                :class="isActive(item.path) ? 'border-transparent bg-[var(--admin-accent)] text-white' : 'border-[var(--admin-border)] bg-white text-slate-500'"
              >
                <component :is="item.icon" class="h-4 w-4" />
              </div>
              <span class="truncate text-sm font-medium">{{ item.label }}</span>
            </div>

            <span
              v-if="item.badge"
              class="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>
        </nav>
      </section>
    </div>

    <div class="border-t border-[var(--admin-border)] px-4 py-4">

      <button
        @click="logout"
        class="mt-3 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-rose-600 transition hover:bg-rose-50"
      >
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50">
          <LogOut class="h-4 w-4" />
        </div>
        <span class="text-sm font-semibold">Log Out</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import {
  BellRing,
  Briefcase,
  Building2,
  ChevronRight,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  PackageSearch,
  PanelLeftClose,
  Search,
  Settings,
  Sparkles,
  Star,
  Tags,
  Users
} from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menuSections = [
  {
    label: 'Main Menu',
    items: [
      { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { label: 'Product', path: '/admin/products', icon: PackageSearch },
      { label: 'Works', path: '/admin/works', icon: Briefcase },
      { label: 'Career', path: '/admin/careers', icon: Users },
      { label: 'Message', path: '/admin/inbox', icon: Inbox }
    ]
  },
  {
    label: 'Other Menu',
    items: [
      { label: 'Clients', path: '/admin/clients', icon: Building2 },
      { label: 'News', path: '/admin/news', icon: Newspaper },
      { label: 'Banners', path: '/admin/banners', icon: ImageIcon },
      { label: 'Expertise', path: '/admin/expertises', icon: Star },
      { label: 'Categories', path: '/admin/categories', icon: Tags }
    ]
  },
  {
    label: 'Workspace',
    items: [
      { label: 'Campaign', path: '/admin/profile', icon: BellRing },
      { label: 'Settings', path: '/admin/profile', icon: Settings }
    ]
  }
]

const isActive = (path) => route.path === path || route.path.startsWith(`${path}/`)

const logout = () => {
  const token = useCookie('auth_token')
  token.value = null
  router.push('/admin/login')
}
</script>
