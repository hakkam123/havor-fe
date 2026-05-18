<template>
  <section>
    <div class="relative isolate overflow-hidden pb-20 pt-32 text-white sm:pb-24 sm:pt-36">
      <img
        :src="image"
        :alt="imageAlt || title"
        class="absolute inset-0 h-full w-full object-cover"
      >
      <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,12,24,0.9)_0%,rgba(5,12,24,0.72)_52%,rgba(5,12,24,0.38)_100%)]"></div>
      <div class="marketing-container relative">
        <div class="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2
              :id="anchorId"
              class="max-w-4xl scroll-mt-32 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
            >
              {{ title }}
            </h2>
            <p class="mt-5 max-w-2xl text-base leading-8 text-white/78">
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
              class="inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0e2344] transition hover:bg-[#edf4ff]"
            >
              {{ actionLabel }}
            </NuxtLink>
            <a
              v-else-if="href"
              :href="href"
              class="inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0e2344] transition hover:bg-[#edf4ff]"
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
</script>
