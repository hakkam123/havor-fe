<template>
  <section class="relative isolate min-h-screen overflow-hidden text-white">
    <img
      :src="activeSlide.image"
      :alt="activeSlide.title"
      class="absolute inset-0 h-full w-full object-cover"
    >
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,12,26,0.82)_0%,rgba(4,12,26,0.48)_42%,rgba(4,12,26,0.34)_100%)]"></div>
    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,16,0.56)_0%,rgba(2,7,16,0.12)_24%,rgba(2,7,16,0.54)_100%)]"></div>

    <div class="marketing-container relative flex min-h-screen items-end py-14">
      <div class="w-full pb-8 sm:pb-10 lg:pb-12">
        <div class="max-w-4xl pt-32">
          <h1 class="mt-6 text-[clamp(3.35rem,7vw,6.2rem)] font-extrabold leading-[0.92] tracking-[-0.055em] text-white">
            {{ title }}
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
            {{ subtitle }}
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <slot name="actions" />
          </div>

        </div>


        <!-- <div class="mt-5 flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/10 text-white transition hover:bg-white/16"
            @click="previous"
          >
            <ChevronLeft class="h-5 w-5" />
          </button>
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/10 text-white transition hover:bg-white/16"
            @click="next"
          >
            <ChevronRight class="h-5 w-5" />
          </button>
        </div> -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  subtitle: string
  slides: Array<{
    label: string
    title: string
    description: string
    image: string
  }>
  autoPlayMs?: number
}>()

const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const activeSlide = computed(() => props.slides[activeIndex.value] ?? props.slides[0])

const setActive = (index: number) => {
  activeIndex.value = index
}

const next = () => {
  activeIndex.value = (activeIndex.value + 1) % props.slides.length
}

const previous = () => {
  activeIndex.value = (activeIndex.value - 1 + props.slides.length) % props.slides.length
}

onMounted(() => {
  if (props.slides.length <= 1) return
  timer = setInterval(next, props.autoPlayMs ?? 5000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>
