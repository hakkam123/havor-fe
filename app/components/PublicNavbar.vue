<template>
  <header
    ref="headerRef"
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out"
    :class="isPastHero ? 'bg-white/96 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl' : 'bg-transparent'"
  >
    <div class="marketing-container">
      <div class="flex min-h-[76px] items-center justify-between gap-5">
        <NuxtLink to="/" class="flex items-center gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-full border p-1 transition-all duration-300 ease-out"
            :class="isPastHero ? 'border-slate-200 bg-white' : 'border-white/25 bg-white/[0.92]'"
          >
            <img src="/logo-havor.svg" alt="PT Havor SMART Digital" width="32" height="32" class="h-8 w-8 rounded-full object-cover">
          </span>
          <div class="hidden sm:block">
            <p class="text-[0.82rem] font-semibold tracking-normal transition-colors duration-300 ease-out" :class="isPastHero ? 'text-slate-950' : 'text-white'">Havor</p>
            <p class="text-xs font-normal transition-colors duration-300 ease-out" :class="isPastHero ? 'text-slate-500' : 'text-white/80'">Smarta Digital</p>
          </div>
        </NuxtLink>

        <nav class="hidden items-center gap-2 lg:flex">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-full px-3 py-2 text-[0.86rem] transition-all duration-300 ease-out"
            :class="navLinkClass(item.to)"
          >
            {{ t(item.labelKey) }}
          </NuxtLink>
        </nav>

        <div class="hidden items-center gap-3 lg:flex">
          <NuxtLink
            to="/contact"
            class="inline-flex items-center justify-center px-1 py-2 text-[0.86rem] font-medium transition-all duration-300 ease-out hover:font-semibold"
            :class="isPastHero ? 'text-slate-700 hover:text-slate-950' : 'text-white/90 hover:text-white'"
          >
            {{ t('nav.contact') }}
          </NuxtLink>
        </div>

        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ease-out lg:hidden"
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
          class="rounded-lg border p-4 shadow-[0_18px_50px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out"
          :class="isPastHero ? 'border-slate-200 bg-white' : 'border-white/14 bg-[#0a1a33]/88 backdrop-blur-xl'"
        >
          <nav class="space-y-2">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="block rounded-lg px-4 py-3 text-sm transition-all duration-300 ease-out"
              :class="mobileNavLinkClass(item.to)"
              @click="isOpen = false"
            >
              {{ t(item.labelKey) }}
            </NuxtLink>
          </nav>
          <NuxtLink
            to="/contact"
            class="mt-3 inline-flex w-full items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-300 ease-out"
            :class="isPastHero ? 'border-slate-950 bg-slate-950 text-white hover:border-slate-800 hover:bg-slate-800' : 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/15'"
            @click="isOpen = false"
          >
            {{ t('nav.discuss') }}
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
const { t } = usePublicI18n()

const navItems = [
  { labelKey: 'nav.about', to: '/about-us' },
  { labelKey: 'nav.services', to: '/services' },
  { labelKey: 'nav.products', to: '/products' },
  { labelKey: 'nav.works', to: '/projects' },
  { labelKey: 'nav.careers', to: '/careers' },
  { labelKey: 'nav.media', to: '/media-news' }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

const navLinkClass = (path) => {
  if (isPastHero.value) {
    return isActive(path)
      ? 'font-semibold text-slate-950'
      : 'font-normal text-slate-700 hover:font-semibold hover:text-slate-950'
  }

  return isActive(path)
    ? 'font-semibold text-white'
    : 'font-normal text-white/80 hover:font-semibold hover:text-white'
}

const mobileNavLinkClass = (path) => {
  if (isPastHero.value) {
    return isActive(path)
      ? 'font-semibold text-slate-950'
      : 'font-normal text-slate-700 hover:font-semibold hover:text-slate-950'
  }

  return isActive(path)
    ? 'font-semibold text-white'
    : 'font-normal text-white/80 hover:font-semibold hover:text-white'
}

const handleScroll = () => {
  const heroSection = document.querySelector('[data-public-hero="true"]')

  if (!(heroSection instanceof HTMLElement)) {
    isPastHero.value = true
    return
  }

  const headerHeight = headerRef.value?.offsetHeight ?? 76
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
