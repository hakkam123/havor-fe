<template>
  <div class="space-y-16 pb-8">
    <HeroSection
      :title="heroTitle"
      :description="pageDescription"
      :image="pageBanner.media_url || heroImage"
      :image-alt="service?.name || 'Service detail hero banner'"
    >
      <template #actions>
        <NuxtLink to="/services" class="btn-primary">Back to Services</NuxtLink>
        <NuxtLink to="/projects" class="btn-outline text-white border-white/20 hover:bg-white/10">View Projects</NuxtLink>
      </template>
    </HeroSection>

    <section class="marketing-section pt-0">
      <div class="marketing-container">
        <div v-if="isLoading" class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="marketing-card animate-pulse p-8">
            <div class="h-5 w-24 rounded bg-slate-100"></div>
            <div class="mt-4 h-10 w-3/4 rounded bg-slate-100"></div>
            <div class="mt-4 h-4 w-full rounded bg-slate-100"></div>
            <div class="mt-2 h-4 w-5/6 rounded bg-slate-100"></div>
          </div>
          <div class="marketing-card animate-pulse p-8">
            <div class="h-5 w-28 rounded bg-slate-100"></div>
            <div class="mt-4 h-24 rounded bg-slate-100"></div>
          </div>
        </div>

        <div v-else-if="service" class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <article class="marketing-card p-8" v-motion-fade-up>
            <p class="marketing-kicker">Overview</p>
            <h2 class="mt-4 font-display text-3xl font-semibold text-slate-900">{{ service.name }}</h2>
            <p class="mt-4 text-sm leading-8 text-slate-500">{{ service.description }}</p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-[#d8e1ee] bg-slate-50 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Delivery Model</p>
                <p class="mt-2 font-display text-lg font-semibold text-slate-900">Discovery to launch</p>
                <p class="mt-2 text-sm leading-7 text-slate-500">Architecture, UX, build, QA, and release support tailored to your team.</p>
              </div>
              <div class="rounded-2xl border border-[#d8e1ee] bg-slate-50 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Outcome</p>
                <p class="mt-2 font-display text-lg font-semibold text-slate-900">Reliable growth</p>
                <p class="mt-2 text-sm leading-7 text-slate-500">A service designed to reduce delivery risk and improve business velocity.</p>
              </div>
            </div>
          </article>

          <aside class="space-y-6" v-motion-fade-up>
            <div class="marketing-card overflow-hidden">
              <img :src="pageBanner.media_url || heroImage" :alt="service.name" class="h-56 w-full object-cover">
            </div>
            <div class="marketing-card p-6">
              <p class="marketing-kicker">Related Services</p>
              <div class="mt-4 space-y-3">
                <NuxtLink
                  v-for="item in relatedServices"
                  :key="item.slug"
                  :to="`/services/${item.slug}`"
                  class="flex items-center justify-between rounded-xl border border-[#d8e1ee] px-4 py-3 transition hover:bg-slate-50"
                >
                  <span class="font-medium text-slate-800">{{ item.name }}</span>
                  <ArrowRight class="h-4 w-4 text-[#1846a3]" />
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>

        <div v-else class="marketing-card p-8 text-center">
          <h2 class="font-display text-2xl font-semibold text-slate-900">Service not found</h2>
          <p class="mt-3 text-sm text-slate-500">{{ error || 'The requested service is not available.' }}</p>
          <NuxtLink to="/services" class="btn-primary mt-6 inline-flex">Back to Services</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const { expertise, error, fetchExpertise, isLoading } = useExpertise()
const { fetchBannerPage, useBannerPage } = useBanners()
const slug = computed(() => String(route.params.slug || ''))
const heroImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80'

onMounted(async () => {
  await Promise.allSettled([fetchExpertise(), fetchBannerPage('services')])
})

const service = computed(() => expertise.value.find((item) => item.slug === slug.value) || null)
const pageBanner = useBannerPage('services', 'service')
const heroTitle = computed(() => service.value?.name || 'Service Details')
const seoTitle = computed(() => service.value?.name ? `${service.value.name} | Services | Havor Smarta Digital` : 'Service Details | Havor Smarta Digital')
const pageDescription = computed(() => service.value?.description || 'Explore Havor Smarta Digital service details and capability information.')

usePageSeo({
  title: seoTitle,
  description: pageDescription,
  path: computed(() => `/services/${slug.value}`),
  image: computed(() => pageBanner.value.media_url || heroImage),
  type: 'article'
})

const relatedServices = computed(() => expertise.value.filter((item) => item.slug !== slug.value).slice(0, 4))
</script>
