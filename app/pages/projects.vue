<template>
  <div class="space-y-16 pb-8">
    <HeroSection
      kicker="Case Studies"
      title="Projects built for impact and scale."
      description="Explore selected implementation stories across finance, logistics, healthcare, and enterprise operations."
      :image="pageBanner.media_url || defaultHeroImage"
      image-alt="Projects hero banner"
    >
      <template #actions>
        <NuxtLink to="/services" class="btn-primary">See Services</NuxtLink>
        <NuxtLink to="/media-news" class="btn-outline text-white border-white/20 hover:bg-white/10">Read Updates</NuxtLink>
      </template>
    </HeroSection>

    <section class="marketing-section pt-0">
      <div class="marketing-container">
        <div class="flex flex-col gap-8">
          <ListingToolbar
            :search-value="searchQuery"
            @update:search="searchQuery = $event"
            @reset="searchQuery = ''"
            :result-count="filteredProjects.length"
          />
        </div>

        <div class="grid gap-8 md:grid-cols-2">
          <NuxtLink
            v-for="project in filteredProjects"
            :key="project.slug"
            :to="`/projects/${project.slug}`"
            class="marketing-card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.1)]"
            v-motion-fade-up
          >
            <div class="relative overflow-hidden">
              <img :src="project.image" :alt="project.title" class="h-56 w-full object-cover transition duration-500 group-hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-t from-[#07142e]/50 via-transparent to-transparent"></div>
            </div>

            <div class="p-6">
              <div class="mb-3 flex flex-wrap gap-2">
                <span class="rounded-full bg-[var(--marketing-primary-soft)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--marketing-primary)]">{{ project.industry }}</span>
                <span class="rounded-full bg-[var(--marketing-primary-soft)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--marketing-primary)]">{{ project.platform }}</span>
              </div>
              <h3 class="font-display text-2xl font-semibold text-slate-900">{{ project.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-slate-500">{{ project.summary }}</p>
              <div class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--marketing-primary)]">
                <span>View case study</span>
                <ArrowRight class="h-4 w-4" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'Projects | Havor Smarta Digital',
  description: 'Browse selected Havor Smarta Digital projects and case studies across finance, logistics, healthcare, and enterprise platforms.',
  path: '/projects'
})

const { works, fetchWorks } = useWorks()
const { fetchBanners, useBannerPage } = useBanners()
const searchQuery = ref('')

const defaultHeroImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80'

onMounted(async () => {
  await Promise.allSettled([fetchWorks(), fetchBanners()])
})

const fallbackProjects = [
  {
    title: 'Novus Financial Dashboard',
    summary: 'Unified portfolio monitoring and reporting for private wealth advisors with 40% faster client reporting.',
    industry: 'Fintech',
    platform: 'Web',
    slug: 'novus-financial-dashboard',
    image: 'https://images.unsplash.com/photo-1551281044-8b0d665d4fd4?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'FleetTrack Pro',
    summary: 'Mobility suite and route intelligence stack that reduced idle operations and fuel waste.',
    industry: 'Logistics',
    platform: 'Mobile',
    slug: 'fleettrack-pro',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'MediCore Facility Ops',
    summary: 'Healthcare operations platform with live occupancy and service workflow automation.',
    industry: 'Healthcare',
    platform: 'Cloud',
    slug: 'medicore-facility-ops',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Astra Commerce Control Room',
    summary: 'Cross-channel commerce analytics and fulfillment orchestration for regional retail chains.',
    industry: 'Retail',
    platform: 'Web',
    slug: 'astra-commerce-control-room',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  }
]

const pageBanner = useBannerPage('projects', 'project')

const projectsData = computed(() => {
  if (!works.value.length) return fallbackProjects

  return works.value.map((item, index) => ({
    title: item.title,
    summary: item.description || 'Project details will be available soon.',
    industry: item.categoryName || 'Project',
    platform: item.year ? `${item.year}` : 'Case Study',
    slug: item.slug || toSlug(item.title),
    image: item.image_url || fallbackProjects[index % fallbackProjects.length].image
  }))
})

const filteredProjects = computed(() => {
  if (!searchQuery.value) return projectsData.value

  const query = searchQuery.value.toLowerCase()
  return projectsData.value.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.industry.toLowerCase().includes(query) ||
      item.platform.toLowerCase().includes(query)
  )
})
</script>
