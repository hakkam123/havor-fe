<template>
  <header class="border-b border-[var(--admin-border)] bg-white/90 px-4 py-4 backdrop-blur-sm sm:px-5 lg:px-6">
    <div class="flex items-center justify-end">
      <NuxtLink
        to="/admin/profile"
        class="flex items-center gap-3 rounded-[12px] border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-3 py-2 transition hover:bg-white"
      >
        <div class="hidden text-right sm:block">
          <p class="text-sm font-semibold leading-tight text-[var(--admin-text)]">Admin Havor</p>
        </div>
        <div class="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--admin-accent)] text-white">
          <User class="h-5 w-5" />
        </div>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
import { User } from 'lucide-vue-next'
</script>
