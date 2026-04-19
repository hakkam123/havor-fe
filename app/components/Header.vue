<template>
  <header class="border-b border-[var(--admin-border)] bg-white/90 px-4 py-4 backdrop-blur-sm sm:px-5 lg:px-6">
    <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div class="min-w-0">
        <div class="mt-1 flex flex-wrap items-center gap-3">
          <h2 class="truncate text-[24px] font-semibold tracking-tight text-[var(--admin-text)]">{{ pageTitle }}</h2>
        </div>
      </div>

      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div class="relative min-w-0 lg:w-[320px] xl:w-[360px]">
          <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, pages, messages..."
            class="admin-input w-full pl-11"
          >
        </div>

        <div class="flex items-center justify-between gap-3">
          <NuxtLink
            to="/admin/profile"
            class="flex items-center gap-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-3 py-2 transition hover:bg-white"
          >
            <div class="hidden text-right sm:block">
              <p class="text-sm font-semibold text-[var(--admin-text)] leading-tight">Admin Havor</p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--admin-accent)] text-white">
              <User class="h-5 w-5" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { Bell, Search, Settings2, User } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitleMap = {
  '/admin': 'Dashboard',
  '/admin/news': 'News',
  '/admin/products': 'Product',
  '/admin/works': 'Works',
  '/admin/careers': 'Careers',
  '/admin/clients': 'Clients',
  '/admin/banners': 'Banners',
  '/admin/expertises': 'Expertise',
  '/admin/categories': 'Categories',
  '/admin/inbox': 'Inbox',
  '/admin/profile': 'Profile'
}

const pageTitle = computed(() => pageTitleMap[route.path] || 'Dashboard')
</script>
