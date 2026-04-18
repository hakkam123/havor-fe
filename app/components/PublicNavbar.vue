<template>
  <header class="sticky top-0 z-40 border-b border-[var(--marketing-border)] bg-white/90 backdrop-blur-md">
    <div class="marketing-container flex h-[72px] items-center justify-between gap-5">
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <span class="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--marketing-primary)] text-[10px] font-bold text-[var(--marketing-primary)]">
          H
        </span>
        <span class="font-display text-lg font-semibold tracking-tight text-slate-900">HAVOR</span>
      </NuxtLink>

      <nav class="hidden items-center gap-8 lg:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="text-sm font-semibold transition-colors"
          :class="isActive(item.to) ? 'font-bold text-[var(--marketing-primary)]' : 'text-slate-500 hover:text-slate-900'"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hidden items-center gap-3 lg:flex">
        <NuxtLink to="/careers" class="btn-primary">Get a Quote</NuxtLink>
      </div>

      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--marketing-border)] text-slate-600 lg:hidden"
        @click="isOpen = !isOpen"
      >
        <Menu v-if="!isOpen" class="h-5 w-5" />
        <X v-else class="h-5 w-5" />
      </button>
    </div>

    <div v-if="isOpen" class="border-t border-[var(--marketing-border)] bg-white lg:hidden">
      <div class="marketing-container py-4">
        <nav class="space-y-2">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="block rounded-lg px-3 py-2 text-sm font-semibold transition"
            :class="isActive(item.to) ? 'bg-[var(--marketing-primary-soft)] font-bold text-[var(--marketing-primary)]' : 'text-slate-600 hover:bg-slate-50'"
            @click="isOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="mt-4 grid gap-2">
          <NuxtLink to="/admin/login" class="btn-outline text-center" @click="isOpen = false">Admin Login</NuxtLink>
          <NuxtLink to="/careers" class="btn-primary text-center" @click="isOpen = false">Get a Quote</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const route = useRoute()
const isOpen = ref(false)

const navItems = [
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'About Us', to: '/about-us' },
  { label: 'Careers', to: '/careers' },
  { label: 'Media & News', to: '/media-news' }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>
