<template>
  <header class="h-[72px] flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20">
    <div class="flex items-center gap-5">
      <div>
        <p class="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Overview</p>
        <h2 class="text-[22px] font-semibold text-slate-900">Management Dashboard</h2>
      </div>

      <div class="hidden xl:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
        <CalendarDays class="w-4 h-4 text-slate-400" />
        {{ currentDate }}
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="hidden lg:block relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="w-4 h-4 text-slate-400 transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search tasks, pages, and content..." 
          class="w-[330px] pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
        >
      </div>

      <button class="relative p-2.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors">
        <Bell class="w-5 h-5" />
        <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-slate-900 rounded-full border-2 border-white"></span>
      </button>

      <NuxtLink to="/admin/profile" class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 cursor-pointer hover:bg-white transition-colors">
        <div class="text-right hidden md:block">
          <p class="text-sm font-semibold text-slate-900 leading-tight">Admin User</p>
          <p class="text-xs text-slate-500">Superadmin</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden">
          <User class="w-5 h-5 text-white" />
        </div>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { Search, Bell, User, CalendarDays } from 'lucide-vue-next'

const currentDate = computed(() =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric'
  }).format(new Date())
)
</script>
