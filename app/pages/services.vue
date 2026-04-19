<template>
  <div class="space-y-16 pb-8">
    <HeroSection
      kicker="What We Do"
      title="Services engineered for modern enterprise operations."
      description="From strategy to deployment, we help organizations modernize platforms, improve reliability, and unlock measurable growth."
      :image="pageBanner.media_url || defaultHeroImage"
      image-alt="Services hero banner"
    >
      <template #actions>
        <NuxtLink to="/projects" class="btn-primary">View Projects</NuxtLink>
        <NuxtLink to="/media-news" class="btn-outline text-white border-white/20 hover:bg-white/10">Read Insights</NuxtLink>
      </template>
    </HeroSection>

    <section class="marketing-section pt-0">
      <div class="marketing-container">
        <div class="flex flex-col gap-8">
          <div>
            <p class="marketing-kicker">Capabilities</p>
            <h2 class="marketing-title max-w-2xl">Explore the services we tailor around your operating model.</h2>
          </div>

          <ListingToolbar
            :search-value="searchQuery"
            @update:search="searchQuery = $event"
            @reset="searchQuery = ''"
            :result-count="filteredServices.length"
          />
        </div>

        <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="item in filteredServices"
            :key="item.slug"
            :to="`/services/${item.slug}`"
            class="marketing-card group block p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.1)]"
            v-motion-fade-up
          >
            <div class="flex items-center justify-between gap-3">
              <span class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--marketing-primary-soft)] text-[var(--marketing-primary)]">
                <component :is="item.icon" class="h-5 w-5" />
              </span>
              <span class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Service</span>
            </div>

            <h3 class="mt-5 font-display text-xl font-semibold text-slate-900">{{ item.title }}</h3>
            <p class="mt-3 text-sm leading-7 text-slate-500">{{ item.description }}</p>

            <div class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--marketing-primary)]">
              <span>View details</span>
              <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowRight, Monitor, Smartphone, Cloud, LayoutGrid } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'Services | Havor Smarta Digital',
  description: 'Discover Havor Smarta Digital services for strategy, web platforms, mobile apps, cloud, data, and long-term product support.',
  path: '/services'
})

const { expertise, fetchExpertise } = useExpertise()
const { fetchBanners, useBannerPage } = useBanners()
const searchQuery = ref('')

const defaultHeroImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80'

onMounted(async () => {
  await Promise.allSettled([fetchExpertise(), fetchBanners()])
})

const fallbackServices = [
  {
    title: 'Digital Strategy & Consulting',
    description: 'Roadmaps, architecture reviews, and product direction aligned with your business outcomes.',
    slug: 'digital-strategy-consulting',
    icon: LayoutGrid
  },
  {
    title: 'Enterprise Web Platforms',
    description: 'Scalable web applications with resilient APIs and maintainable front-end architecture.',
    slug: 'enterprise-web-platforms',
    icon: Monitor
  },
  {
    title: 'Mobile App Engineering',
    description: 'Cross-platform and native mobile products designed for speed, reliability, and conversion.',
    slug: 'mobile-app-engineering',
    icon: Smartphone
  },
  {
    title: 'Cloud & DevOps',
    description: 'Automated delivery pipelines, cloud optimization, observability, and incident readiness.',
    slug: 'cloud-devops',
    icon: Cloud
  },
  {
    title: 'Data & AI Enablement',
    description: 'Data platform implementation and practical AI workflows for smarter decisions.',
    slug: 'data-ai-enablement',
    icon: LayoutGrid
  },
  {
    title: 'Long-Term Product Support',
    description: 'Performance audits, security hardening, feature delivery, and technical governance.',
    slug: 'long-term-product-support',
    icon: Monitor
  }
]

const pageBanner = useBannerPage('services', 'service')

const servicesData = computed(() => {
  if (!expertise.value.length) return fallbackServices

  return expertise.value.map((item, index) => ({
    title: item.name,
    description: item.description || 'Specialized expertise designed for enterprise modernization.',
    slug: item.slug || toSlug(item.name),
    icon: [LayoutGrid, Monitor, Smartphone, Cloud][index % 4]
  }))
})

const filteredServices = computed(() => {
  if (!searchQuery.value) return servicesData.value

  const query = searchQuery.value.toLowerCase()
  return servicesData.value.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
  )
})
</script>
