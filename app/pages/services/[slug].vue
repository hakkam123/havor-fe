<template>
  <div class="overflow-hidden bg-white">
    <PublicDetailHero
      :image="heroImage"
      :image-alt="service?.name || 'Service hero image'"
      label="Service Detail"
    />

    <section class="bg-white py-12 sm:py-14">
      <div class="marketing-container">
        <div v-if="service" class="mx-auto max-w-4xl text-center">
          <p class="text-[0.72rem] font-semibold uppercase tracking-normal text-[#1f5dcc]">
            {{ serviceCategory }}
          </p>
          <h1 class="mt-4 text-[clamp(2rem,4.2vw,3.65rem)] font-semibold leading-tight tracking-normal text-[#0e2344]">
            {{ service.name }}
          </h1>
          <p class="mx-auto mt-5 max-w-2xl text-[0.94rem] leading-7 text-slate-600">
            {{ pageDescription }}
          </p>
        </div>

        <div v-else class="brand-panel p-6 text-center">
          <h1 class="text-3xl font-semibold tracking-normal text-[#0e2344]">Service not found</h1>
          <p class="mt-3 text-sm leading-7 text-slate-600">{{ error || 'The requested service is not available.' }}</p>
          <NuxtLink to="/services" class="btn-primary mt-6 inline-flex">Back to Services</NuxtLink>
        </div>
      </div>
    </section>

    <section v-if="service" class="border-t border-[#dbe6f4] bg-white py-12">
      <div class="marketing-container">
        <div class="grid gap-10 lg:grid-cols-[4rem_minmax(0,1fr)_18rem]">
          <aside class="hidden lg:block" v-motion-fade-up>
            <div class="sticky top-28">
              <p class="brand-meta">Share</p>
              <div class="mt-4 flex flex-col gap-3">
                <NuxtLink to="/services" class="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe6f4] text-[#0e2344] transition hover:border-[#1f5dcc] hover:text-[#1f5dcc]" aria-label="Back to services">
                  <ArrowLeft class="h-4 w-4" />
                </NuxtLink>
                <NuxtLink to="/#contact" class="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe6f4] text-[#0e2344] transition hover:border-[#1f5dcc] hover:text-[#1f5dcc]" aria-label="Discuss service">
                  <Mail class="h-4 w-4" />
                </NuxtLink>
              </div>
            </div>
          </aside>

          <article class="min-w-0" v-motion-fade-up>
            <div class="detail-content">
              <p>{{ pageDescription }}</p>
              <h2>How Havor Delivers This Service</h2>
              <p>
                Havor structures this capability through discovery, planning, implementation, validation, and post-launch support so the solution can fit real business operations.
              </p>
              <h2>Expected Outcome</h2>
              <p>
                The service is designed to help organizations launch cleaner digital platforms, improve operational visibility, and create systems that are easier to maintain over time.
              </p>
            </div>
          </article>

          <aside class="space-y-8" v-motion-fade-up>
            <div>
              <h2 class="text-[1.3rem] font-semibold text-[#0e2344]">Category</h2>
              <div class="mt-3 h-0.5 w-8 bg-[#1f5dcc]"></div>
              <div class="mt-6 space-y-4">
                <NuxtLink
                  v-for="item in categoryCards"
                  :key="item.slug"
                  :to="`/services/${item.slug}`"
                  class="group relative block min-h-28 overflow-hidden rounded-lg bg-[#071529]"
                >
                  <img :src="item.icon_url || defaultHeroImage" :alt="item.name" class="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-[1.04]">
                  <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,21,41,0.22)_0%,rgba(7,21,41,0.86)_100%)]"></div>
                  <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white">
                    <span class="text-[0.74rem] font-semibold uppercase tracking-normal">{{ serviceCategoryFor(item) }}</span>
                    <ArrowUpRight class="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </NuxtLink>
              </div>
            </div>

            <div class="rounded-lg bg-[#0d3b91] p-5 text-white">
              <p class="text-[0.75rem] font-medium uppercase tracking-normal text-white/70">Need This Capability?</p>
              <h3 class="mt-3 text-lg font-semibold leading-tight">Talk with Havor about the right implementation scope.</h3>
              <NuxtLink to="/#contact" class="mt-5 inline-flex text-sm font-medium text-white/88 hover:text-white">
                Contact us
              </NuxtLink>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section v-if="service && relatedServices.length" class="border-t border-[#dbe6f4] bg-white py-12 sm:py-14">
      <div class="marketing-container">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 class="border-l-2 border-[#1f5dcc] pl-5 text-[clamp(1.65rem,3vw,2.4rem)] font-semibold text-[#0e2344]">
            Related Services
          </h2>
          <NuxtLink to="/services" class="btn-outline">View All</NuxtLink>
        </div>

        <div class="mt-8 grid gap-5 md:grid-cols-3">
          <NuxtLink
            v-for="item in relatedServices"
            :key="item.slug"
            :to="`/services/${item.slug}`"
            class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(18,56,122,0.1)]"
            v-motion-fade-up
          >
            <img :src="item.icon_url || defaultHeroImage" :alt="item.name" class="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]">
            <div class="p-4">
              <p class="brand-meta text-[#1f5dcc]">{{ serviceCategoryFor(item) }}</p>
              <h3 class="mt-2 line-clamp-2 text-[1.02rem] font-semibold leading-snug text-[#0e2344]">{{ item.name }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ArrowLeft, ArrowUpRight, Mail } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const { expertise, error, fetchExpertise } = useExpertise()
const { fetchBannerPage, useBannerPage } = useBanners()
const slug = computed(() => String(route.params.slug || ''))
const defaultHeroImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80'
const toPlainText = (value = '') => String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

onMounted(async () => {
  await Promise.allSettled([fetchExpertise(), fetchBannerPage('services')])

  if (!error.value && !service.value) {
    showError({
      statusCode: 404,
      statusMessage: 'Service not found'
    })
  }
})

const service = computed(() => expertise.value.find((item) => item.slug === slug.value) || null)
const pageBanner = useBannerPage('services', 'service')
const heroImage = computed(() => service.value?.icon_url || pageBanner.value.media_url || defaultHeroImage)
const seoTitle = computed(() => service.value?.name ? `${service.value.name} | Services | Havor Smarta Digital` : 'Service Details | Havor Smarta Digital')
const pageDescription = computed(() => toPlainText(service.value?.description) || 'Explore Havor Smarta Digital service details and capability information.')
const relatedServices = computed(() => expertise.value.filter((item) => item.slug !== slug.value).slice(0, 3))
const serviceCategoryFor = (item: { name: string, description: string }) => {
  const text = `${item.name} ${item.description}`.toLowerCase()

  if (text.includes('mobile') || text.includes('android') || text.includes('ios')) return 'Mobile Apps'
  if (text.includes('ai') || text.includes('intelligent') || text.includes('automation') || text.includes('data')) return 'AI & Data'
  if (text.includes('website') || text.includes('web') || text.includes('cms')) return 'Website & CMS'
  if (text.includes('api') || text.includes('backend') || text.includes('integration') || text.includes('dashboard') || text.includes('enterprise')) return 'Enterprise Systems'

  return 'Digital Solution'
}
const serviceCategory = computed(() => service.value ? serviceCategoryFor(service.value) : 'Service')
const categoryCards = computed(() => {
  const categoryMap = new Map<string, typeof expertise.value[number]>()

  expertise.value.forEach((item) => {
    const key = serviceCategoryFor(item)
    if (!categoryMap.has(key)) categoryMap.set(key, item)
  })

  return [...categoryMap.values()].slice(0, 4)
})

usePageSeo({
  title: seoTitle,
  description: pageDescription,
  path: computed(() => `/services/${slug.value}`),
  image: computed(() => heroImage.value),
  type: 'article'
})
</script>
