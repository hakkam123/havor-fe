<template>
  <NuxtLink
    :to="to"
    class="group block overflow-hidden rounded-[28px] border border-[var(--marketing-border)] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.12)]"
  >
    <div class="relative overflow-hidden">
      <img
        :src="image"
        :alt="imageAlt || title"
        class="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100"></div>
    </div>

    <div class="space-y-3 p-6">
      <div class="flex flex-wrap items-center gap-2 editorial-meta">
        <span v-if="category" class="text-[var(--marketing-primary)]">{{ category }}</span>
        <span v-if="category && meta">•</span>
        <span v-if="meta">{{ meta }}</span>
      </div>
      <h3 class="font-display text-xl font-semibold leading-snug text-slate-900 line-clamp-2">
        {{ title }}
      </h3>
      <p class="text-sm leading-7 text-slate-500 line-clamp-3">
        {{ summary }}
      </p>
      <div class="flex items-center gap-2 text-sm font-semibold text-[var(--marketing-primary)]">
        <span>{{ ctaLabel }}</span>
        <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

defineProps<{
  to: string
  title: string
  summary: string
  image: string
  imageAlt?: string
  category?: string
  meta?: string
  ctaLabel?: string
}>()
</script>
