<template>
  <section class="relative overflow-hidden bg-[var(--marketing-navy)] text-white">
    <div class="absolute inset-0">
      <div class="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[var(--marketing-primary)]/25 blur-3xl"></div>
      <div class="absolute right-0 top-10 h-[300px] w-[300px] rounded-full bg-[var(--marketing-primary)]/20 blur-2xl"></div>
      <div class="absolute left-0 bottom-0 h-44 w-full bg-gradient-to-t from-[#1e293b] to-transparent"></div>
    </div>

    <img
      v-if="image"
      :src="image"
      :alt="imageAlt || title"
      :style="styleFor(0.05, -16, 1.12)"
      class="absolute inset-0 h-full w-full object-cover opacity-25 transition-transform duration-300"
    >

    <div class="marketing-container relative py-20 sm:py-24 lg:py-28">
      <div class="max-w-2xl" v-motion-fade-up>
        <p v-if="kicker" class="inline-flex rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
          {{ kicker }}
        </p>
        <h1 class="mt-5 font-display text-5xl font-semibold leading-[1.06] sm:text-6xl">
          {{ title }}
        </h1>
        <p class="mt-7 max-w-xl text-base leading-8 text-slate-200/90">
          {{ description }}
        </p>

        <div v-if="$slots.actions" class="mt-9 flex flex-wrap gap-3">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { styleFor } = useParallax()

defineProps<{
  title: string
  description: string
  kicker?: string
  image?: string
  imageAlt?: string
}>()
</script>
