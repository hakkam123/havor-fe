<template>
  <header
    ref="headerRef"
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out"
    :class="isPastHero ? 'bg-white/96 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl' : 'bg-transparent'"
  >
    <div class="marketing-container">
      <div class="flex min-h-[92px] items-center justify-between gap-6">
        <NuxtLink to="/" class="flex items-center gap-3">
          <span
            class="flex h-12 w-12 items-center justify-center rounded-full border p-1 transition-all duration-300 ease-out"
            :class="isPastHero ? 'border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)]' : 'border-white/25 bg-white/[0.92] shadow-[0_12px_32px_rgba(2,6,23,0.28)]'"
          >
            <img src="/logo-havor.svg" alt="PT Havor SMART Digital" class="h-10 w-10 rounded-full object-cover">
          </span>
          <div class="hidden sm:block">
            <p class="text-sm uppercase tracking-[0.22em] transition-colors duration-300 ease-out" :class="isPastHero ? 'font-black text-slate-950' : 'font-extrabold text-white'">Havor</p>
            <p class="text-xs font-semibold transition-colors duration-300 ease-out" :class="isPastHero ? 'text-slate-500' : 'text-white/80'">Smarta Digital</p>
          </div>
        </NuxtLink>

        <nav class="hidden items-center gap-2 lg:flex">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-full px-4 py-2.5 text-sm transition-all duration-300 ease-out"
            :class="navLinkClass(item.to)"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="hidden items-center gap-3 lg:flex">
          <NuxtLink
            to="/#contact"
            class="inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-bold transition-all duration-300 ease-out"
            :class="isPastHero ? 'border-slate-950 bg-slate-950 text-white hover:border-slate-800 hover:bg-slate-800' : 'border-white/30 bg-white/10 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/20'"
          >
            Contact
          </NuxtLink>
        </div>

        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ease-out lg:hidden"
          :class="isPastHero ? 'border-slate-200 bg-white text-slate-950 hover:bg-slate-50' : 'border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15'"
          :aria-expanded="isOpen"
          aria-label="Toggle navigation menu"
          @click="isOpen = !isOpen"
        >
          <Menu v-if="!isOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </button>
      </div>

      <div v-if="isOpen" class="pb-4 lg:hidden">
        <div
          class="rounded-[1.75rem] border p-4 shadow-[0_18px_50px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out"
          :class="isPastHero ? 'border-slate-200 bg-white' : 'border-white/14 bg-[#0a1a33]/88 backdrop-blur-xl'"
        >
          <nav class="space-y-2">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="block rounded-[1.25rem] px-4 py-3 text-sm transition-all duration-300 ease-out"
              :class="mobileNavLinkClass(item.to)"
              @click="isOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
          <NuxtLink
            to="/#contact"
            class="mt-3 inline-flex w-full items-center justify-center rounded-full border px-5 py-3 text-sm font-bold transition-all duration-300 ease-out"
            :class="isPastHero ? 'border-slate-950 bg-slate-950 text-white hover:border-slate-800 hover:bg-slate-800' : 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/15'"
            @click="isOpen = false"
          >
            Discuss Your Project
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const route = useRoute()
const headerRef = ref(null)
const isOpen = ref(false)
const isPastHero = ref(false)

const navItems = [
  { label: 'About Us', to: '/about-us' },
  { label: 'Services', to: '/services' },
  { label: 'Works', to: '/projects' },
  { label: 'Careers', to: '/careers' },
  { label: 'Media & News', to: '/media-news' }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

const navLinkClass = (path) => {
  if (isPastHero.value) {
    return isActive(path)
      ? 'bg-slate-950 font-extrabold text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)]'
      : 'font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950'
  }

  return isActive(path)
    ? 'bg-white/15 font-extrabold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]'
    : 'font-semibold text-white/80 hover:bg-white/10 hover:text-white'
}

const mobileNavLinkClass = (path) => {
  if (isPastHero.value) {
    return isActive(path)
      ? 'bg-slate-950 font-extrabold text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)]'
      : 'font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950'
  }

  return isActive(path)
    ? 'bg-white/15 font-extrabold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]'
    : 'font-semibold text-white/80 hover:bg-white/10 hover:text-white'
}

const handleScroll = () => {
  const heroSection = document.querySelector('[data-public-hero="true"]')

  if (!(heroSection instanceof HTMLElement)) {
    isPastHero.value = true
    return
  }

  const headerHeight = headerRef.value?.offsetHeight ?? 92
  isPastHero.value = heroSection.getBoundingClientRect().bottom <= headerHeight + 16
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
})

watch(() => route.fullPath, async () => {
  isOpen.value = false
  await nextTick()
  handleScroll()
})
</script>
