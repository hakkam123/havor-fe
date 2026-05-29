<template>
  <section
    data-public-hero="true"
    class="relative isolate min-h-screen overflow-hidden text-white"
  >
    <img
      :src="image"
      :alt="imageAlt || title"
      class="absolute inset-0 h-full w-full object-cover"
    >
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,12,26,0.8)_0%,rgba(4,12,26,0.44)_42%,rgba(4,12,26,0.28)_100%)]"></div>
    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,16,0.52)_0%,rgba(2,7,16,0.08)_24%,rgba(2,7,16,0.46)_100%)]"></div>

    <div
      class="marketing-container relative flex items-end"
      :class="heroSize === 'half' ? 'min-h-screen py-12 sm:py-14 lg:py-16' : 'min-h-screen py-14 sm:py-16 lg:py-20'"
    >
      <div class="w-full pb-6 sm:pb-10 lg:pb-12">
        <div class="max-w-3xl" :class="heroSize === 'half' ? 'pt-28 sm:pt-32' : 'pt-32'">
          <p v-if="kicker" class="inline-flex rounded-lg border border-white/18 bg-white/10 px-3 py-1.5 text-[0.7rem] font-medium uppercase tracking-normal text-white/82">
            {{ kicker }}
          </p>
          <h1
            class="mt-6 font-semibold leading-tight tracking-normal text-white"
            :class="heroSize === 'half' ? 'text-[clamp(2.35rem,4vw,3.5rem)]' : 'text-[clamp(2.75rem,4.8vw,4.25rem)]'"
          >
            {{ title }}
          </h1>
          <p
            class="mt-5 max-w-2xl text-white/82"
            :class="heroSize === 'half' ? 'text-[0.9rem] leading-6 sm:text-[0.96rem]' : 'text-[0.98rem] leading-7 sm:text-base'"
          >
            {{ subtitle }}
          </p>

          <div v-if="$slots.meta" class="mt-7">
            <slot name="meta" />
          </div>

          <div v-if="$slots.actions" class="mt-8 flex flex-wrap gap-3">
            <slot name="actions" />
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  kicker?: string
  title: string
  subtitle: string
  image: string
  imageAlt?: string
  imageLabel?: string
  imageTitle?: string
  sideLabel?: string
  sideTitle?: string
  sideCopy?: string
  heroSize?: 'screen' | 'half'
  highlights?: Array<{
    label: string
    value: string
  }>
}>(), {
  imageAlt: '',
  imageLabel: 'Hero Visual',
  imageTitle: 'Premium imagery tailored to the page narrative.',
  sideLabel: 'Overview',
  sideTitle: 'Enterprise-ready digital delivery.',
  sideCopy: 'Professional, structured, and designed to support modern organizations.',
  heroSize: 'screen'
})
</script>
