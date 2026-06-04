<template>
  <section>
    <div class="relative isolate overflow-hidden py-16 text-white sm:py-20">
      <img
        :src="imageSrc(image)"
        :alt="imageAlt || title"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover"
        @error="handleImageError"
      >
      <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,12,24,0.9)_0%,rgba(5,12,24,0.72)_52%,rgba(5,12,24,0.38)_100%)]"></div>
      <div class="marketing-container relative">
        <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2
              :id="anchorId"
              class="max-w-3xl scroll-mt-24 text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-tight"
            >
              {{ title }}
            </h2>
            <p class="mt-4 max-w-2xl text-[0.94rem] leading-7 text-white/78">
              {{ copy }}
            </p>

            <div v-if="$slots.meta" class="mt-5">
              <slot name="meta" />
            </div>
          </div>

          <slot name="actions">
            <NuxtLink
              v-if="to"
              :to="to"
              class="inline-flex w-fit items-center justify-center rounded-full bg-white px-5 py-2.5 text-[0.84rem] font-semibold text-[#0e2344] transition hover:bg-[#edf4ff]"
            >
              {{ actionLabel }}
            </NuxtLink>
            <a
              v-else-if="href"
              :href="href"
              class="inline-flex w-fit items-center justify-center rounded-full bg-white px-5 py-2.5 text-[0.84rem] font-semibold text-[#0e2344] transition hover:bg-[#edf4ff]"
            >
              {{ actionLabel }}
            </a>
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  copy: string
  image: string
  imageAlt?: string
  actionLabel?: string
  to?: string
  href?: string
  anchorId?: string
}>()

const { imageSrc, handleImageError } = useImageFallback()
</script>
