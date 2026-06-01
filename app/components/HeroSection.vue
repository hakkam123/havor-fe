<template>
  <section data-public-hero="true" class="relative isolate min-h-screen overflow-hidden text-white">
    <img
      v-if="image"
      :src="image"
      :alt="imageAlt || title"
      :style="styleFor(0.05, -16, 1.08)"
      loading="eager"
      decoding="async"
      fetchpriority="high"
      class="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
    >
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,12,26,0.82)_0%,rgba(4,12,26,0.48)_42%,rgba(4,12,26,0.34)_100%)]"></div>
    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,16,0.54)_0%,rgba(2,7,16,0.1)_24%,rgba(2,7,16,0.5)_100%)]"></div>

    <div class="marketing-container relative flex min-h-screen items-end py-14 sm:py-16 lg:py-20">
      <div class="max-w-3xl pb-7 pt-28">
        <p v-if="kicker" class="inline-flex rounded-lg border border-white/18 bg-white/10 px-3 py-1.5 text-[0.7rem] font-medium uppercase tracking-normal text-white/82">
          {{ kicker }}
        </p>
        <h1 class="mt-5 text-[clamp(2.5rem,4.6vw,4.15rem)] font-semibold leading-tight tracking-normal text-white">
          {{ title }}
        </h1>
        <p class="mt-4 max-w-2xl text-[0.96rem] leading-7 text-white/82 sm:text-base">
          {{ description }}
        </p>

        <div v-if="$slots.actions" class="mt-7 flex flex-wrap gap-3">
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
