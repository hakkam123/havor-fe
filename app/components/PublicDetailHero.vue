<template>
  <section data-public-hero="true" class="relative isolate min-h-screen overflow-hidden bg-[#071529] text-white">
    <img
      :src="image"
      :alt="imageAlt"
      class="absolute inset-0 h-full w-full object-cover"
    >
    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,22,0.5)_0%,rgba(3,10,22,0.08)_40%,rgba(3,10,22,0.36)_100%)]"></div>
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,22,0.3)_0%,rgba(3,10,22,0.06)_46%,rgba(3,10,22,0.22)_100%)]"></div>

    <div class="marketing-container relative flex min-h-screen items-end py-14 sm:py-16 lg:py-20">
      <p v-if="label" class="max-w-xl text-[0.75rem] font-medium uppercase tracking-normal text-white/76">
        {{ label }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  image: string
  imageAlt: string
  label?: string
}>()
</script>
