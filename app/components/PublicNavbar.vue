<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="isPastHero ? 'bg-white shadow-[0_18px_60px_rgba(15,23,42,0.12)]' : 'bg-transparent'"
  >
    <div class="marketing-container">
      <div class="flex min-h-[92px] items-center justify-between gap-6">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img src="/logo-havor.svg" alt="PT Havor SMART Digital" class="h-11 w-11 rounded-full object-cover">
          <div class="hidden sm:block">
            <p class="text-sm uppercase tracking-[0.22em]" :class="isPastHero ? 'font-black text-slate-950' : 'font-extrabold text-white'">Havor</p>
            <p class="text-xs font-semibold" :class="isPastHero ? 'text-slate-500' : 'text-white/72'">Smarta Digital</p>
          </div>
        </NuxtLink>

        <nav class="hidden items-center gap-2 lg:flex">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-2 py-3 text-sm transition"
            :class="navLinkClass(item.to)"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="hidden items-center gap-3 lg:flex">
          <NuxtLink
            to="/#contact"
            class="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition"
            :class="isPastHero ? 'border border-slate-300 text-slate-950 hover:bg-slate-50' : 'border border-white/40 text-white hover:bg-white/10'"
          >
            Discuss Your Project
          </NuxtLink>
        </div>

        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full border lg:hidden"
          :class="isPastHero ? 'border-slate-300 text-slate-950' : 'border-white/30 text-white'"
          @click="isOpen = !isOpen"
        >
          <Menu v-if="!isOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </button>
      </div>

      <div v-if="isOpen" class="pb-4 lg:hidden">
        <div
          class="rounded-[1.75rem] border p-4 shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
          :class="isPastHero ? 'border-slate-200 bg-white' : 'border-white/14 bg-[#0a1a33]/88 backdrop-blur-xl'"
        >
          <nav class="space-y-2">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="block rounded-[1.25rem] px-4 py-3 text-sm transition"
              :class="mobileNavLinkClass(item.to)"
              @click="isOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
          <NuxtLink
            to="/#contact"
            class="mt-3 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition"
            :class="isPastHero ? 'border border-slate-300 text-slate-950 hover:bg-slate-50' : 'border border-white/30 text-white hover:bg-white/10'"
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
const isOpen = ref(false)
const isPastHero = ref(false)

const navItems = [
  { label: 'About Us', to: '/about-us' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
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
      ? 'font-extrabold text-slate-950'
      : 'font-semibold text-slate-700 hover:text-slate-950'
  }

  return isActive(path)
    ? 'font-extrabold text-white'
    : 'font-semibold text-white/84 hover:text-white'
}

const mobileNavLinkClass = (path) => {
  if (isPastHero.value) {
    return isActive(path)
      ? 'font-extrabold text-slate-950'
      : 'font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950'
  }

  return isActive(path)
    ? 'font-extrabold text-white'
    : 'font-semibold text-white/82 hover:bg-white/8 hover:text-white'
}

const handleScroll = () => {
  const heroSection = document.querySelector('main section.min-h-screen')
  const heroThreshold = heroSection instanceof HTMLElement
    ? Math.max(heroSection.offsetHeight - 140, 220)
    : Math.max(window.innerHeight - 140, 220)
  isPastHero.value = window.scrollY > heroThreshold
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
