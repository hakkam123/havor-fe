<template>
  <section data-public-hero="true" class="relative isolate min-h-screen overflow-hidden bg-[#06152b] text-white">
    <img
      :src="imageSrc(activeSlide.image, defaultImageFallback)"
      :alt="activeSlide.title"
      loading="eager"
      decoding="async"
      fetchpriority="high"
      class="absolute inset-0 h-full w-full object-cover"
      @error="handleImageError($event, defaultImageFallback)"
    >
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,11,24,0.84)_0%,rgba(3,11,24,0.56)_46%,rgba(3,11,24,0.3)_100%)]"></div>
    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,11,24,0.38)_0%,rgba(3,11,24,0.12)_30%,rgba(3,11,24,0.72)_100%)]"></div>

    <div class="marketing-container relative flex min-h-screen items-end py-14 sm:py-16 lg:py-20">
      <div class="max-w-3xl pb-8 pt-32 sm:pb-10 lg:pb-12">
        <h1 class="text-[clamp(2.65rem,4.7vw,4rem)] font-semibold leading-[1.04] text-white">
          {{ title }}
        </h1>
        <p class="mt-5 max-w-[40rem] text-[0.98rem] leading-7 text-white/82 sm:text-base">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  title: string
  subtitle: string
  slides: Array<{
    title: string
    description: string
    image: string
  }>
  autoPlayMs?: number
}>()

const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const { defaultImageFallback, imageSrc, handleImageError } = useImageFallback()
const fallbackSlide = computed(() => ({
  title: props.title,
  description: props.subtitle,
  image: defaultImageFallback
}))
const safeSlides = computed(() => {
  const slides = props.slides
    .filter((slide) => slide && slide.title)
    .map((slide) => ({
      ...slide,
      image: imageSrc(slide.image, defaultImageFallback)
    }))

  return slides.length ? slides : [fallbackSlide.value]
})
const activeSlide = computed(() => safeSlides.value[activeIndex.value] ?? safeSlides.value[0])

const next = () => {
  if (safeSlides.value.length <= 1) return
  activeIndex.value = (activeIndex.value + 1) % safeSlides.value.length
}

onMounted(() => {
  if (safeSlides.value.length <= 1) return
  timer = setInterval(next, props.autoPlayMs ?? 5000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>
