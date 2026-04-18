<template>
  <aside class="w-[220px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
    <div class="px-5 pt-5 pb-4 border-b border-slate-100">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
          <span class="text-white text-sm font-semibold tracking-[0.18em] ml-[2px]">HV</span>
        </div>
        <div>
          <h1 class="text-[16px] font-semibold text-slate-900 leading-none mt-1">Havor CMS</h1>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar space-y-6">
      <section>
        <p class="px-3 mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Main</p>
        <nav class="space-y-1.5">
          <NuxtLink
            v-for="item in mainMenuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-all"
            :class="isActive(item.path) ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="h-9 w-9 rounded-lg flex items-center justify-center transition-colors"
                :class="isActive(item.path) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'"
              >
                <component :is="item.icon" class="h-4 w-4" />
              </div>
              <span class="truncate text-sm font-medium">{{ item.label }}</span>
            </div>
            <span v-if="item.badge" class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
              {{ item.badge }}
            </span>
          </NuxtLink>
        </nav>
      </section>

      
    </div>

    <div class="px-4 py-4 border-t border-slate-100 space-y-1.5">

      <button class="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
        <div class="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
          <Settings class="h-4 w-4" />
        </div>
        <span class="text-sm font-medium">Settings</span>
      </button>

      <button
        @click="logout"
        class="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors"
      >
        <div class="h-9 w-9 rounded-lg bg-rose-50 flex items-center justify-center">
          <LogOutIcon class="h-4 w-4" />
        </div>
        <span class="text-sm font-medium">Log Out</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import {
  LayoutDashboard,
  Newspaper,
  PackageSearch,
  Briefcase,
  Users,
  Image as ImageIcon,
  Star,
  Tags,
  Inbox,
  Settings,
  LifeBuoy,
  LogOut as LogOutIcon
} from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const mainMenuItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'News', path: '/admin/news', icon: Newspaper, badge: '4' },
  { label: 'Products', path: '/admin/products', icon: PackageSearch },
  { label: 'Works', path: '/admin/works', icon: Briefcase },
  { label: 'Careers', path: '/admin/careers', icon: Users },
  { label: 'Banners', path: '/admin/banners', icon: ImageIcon },
  { label: 'Expertise', path: '/admin/expertises', icon: Star },
  { label: 'Categories', path: '/admin/categories', icon: Tags },
  { label: 'Inbox', path: '/admin/inbox', icon: Inbox, badge: '12' },
]

const teamMembers = [
  { name: 'Warren Daniel', role: 'Creative Lead', initials: 'WD', avatarClass: 'bg-slate-900' },
  { name: 'Selma Knight', role: 'Content Manager', initials: 'SK', avatarClass: 'bg-slate-600' },
  { name: 'Richard Joseph', role: 'Product Ops', initials: 'RJ', avatarClass: 'bg-slate-500' },
]

const isActive = (path) => route.path === path || route.path.startsWith(`${path}/`)

const logout = () => {
  const token = useCookie('auth_token')
  token.value = null
  router.push('/admin/login')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d6dbe7;
  border-radius: 999px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #b7c0d4;
}
</style>
