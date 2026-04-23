<template>
  <section class="relative isolate min-h-screen overflow-hidden text-white">
    <img
      v-if="image"
      :src="image"
      :alt="imageAlt || title"
      :style="styleFor(0.05, -16, 1.08)"
      class="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
    >
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,12,26,0.82)_0%,rgba(4,12,26,0.48)_42%,rgba(4,12,26,0.34)_100%)]"></div>
    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,16,0.54)_0%,rgba(2,7,16,0.1)_24%,rgba(2,7,16,0.5)_100%)]"></div>

    <div class="marketing-container relative flex min-h-screen items-end py-14">
      <div class="max-w-3xl pb-10 pt-32">
        <p v-if="kicker" class="inline-flex rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.24em] text-white/82">
          {{ kicker }}
        </p>
        <h1 class="mt-6 text-[clamp(3rem,7vw,5.8rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-white">
          {{ title }}
        </h1>
        <p class="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
          {{ description }}
        </p>

        <div v-if="$slots.actions" class="mt-8 flex flex-wrap gap-3">
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
