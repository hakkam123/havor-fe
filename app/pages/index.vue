<template>
  <div>
    <section class="relative overflow-hidden bg-[#05112b] text-white">
      <div class="absolute inset-0">
        <div class="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#1a4ea4]/20 blur-3xl"></div>
        <div class="absolute right-0 top-10 h-[300px] w-[300px] rounded-full bg-[#1f5fd0]/20 blur-2xl"></div>
        <div class="absolute left-0 bottom-0 h-44 w-full bg-gradient-to-t from-[#020a1d] to-transparent"></div>
      </div>

      <img
        v-if="heroBanner.media_url"
        :src="heroBanner.media_url"
        :alt="heroBanner.title || 'Hero banner'"
        class="absolute inset-0 h-full w-full object-cover opacity-25"
      >

      <div class="marketing-container relative py-20 sm:py-24 lg:py-28">
        <div class="max-w-2xl">
          <h1 class="font-display text-5xl font-semibold leading-[1.06] sm:text-6xl">
            {{ heroTitleLineA }}<br>
            {{ heroTitleLineB }}
          </h1>
          <p class="mt-7 max-w-xl text-base leading-8 text-slate-200/90">
            {{ heroSubtitle }}
          </p>
          <div class="mt-9 flex flex-wrap gap-3">
            <NuxtLink to="/projects" class="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#1846a3]">
              Start Your Project
            </NuxtLink>
            <NuxtLink to="/projects" class="inline-flex items-center rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              View Case Studies
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="marketing-section">
      <div class="marketing-container grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p class="marketing-kicker">Who We Are</p>
          <h2 class="marketing-title max-w-lg">
            Engineering the future
            of digital business.
          </h2>
          <p class="marketing-copy max-w-xl">
            At Havor Smarta Digital, we combine technical expertise with strategic insight to deliver software that drives
            real business value. From enterprise platforms to mobile applications, our work is defined by precision and
            performance.
          </p>

          <NuxtLink to="/about-us" class="mt-7 inline-flex items-center rounded-xl border border-[#d8e1ee] px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white">
            Learn More About Us
          </NuxtLink>

          <div class="mt-10 grid grid-cols-3 gap-6">
            <div>
              <p class="font-display text-4xl font-semibold text-[#1846a3]">250+</p>
              <p class="mt-2 text-xs text-slate-500">Enterprise Clients</p>
            </div>
            <div>
              <p class="font-display text-4xl font-semibold text-[#1846a3]">98%</p>
              <p class="mt-2 text-xs text-slate-500">Retention Rate</p>
            </div>
            <div>
              <p class="font-display text-4xl font-semibold text-[#1846a3]">16+</p>
              <p class="mt-2 text-xs text-slate-500">Years of Experience</p>
            </div>
          </div>
        </div>

        <div class="marketing-card overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1573167243872-43c6433b9d40?auto=format&fit=crop&w=1200&q=80"
            alt="Team discussion"
            class="h-[520px] w-full object-cover"
          >
        </div>
      </div>
    </section>

    <section class="marketing-section bg-[#eef2f7]">
      <div class="marketing-container">
        <h2 class="font-display text-4xl font-semibold text-slate-900">Our Expertise</h2>
        <p class="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Comprehensive technology solutions tailored to your unique operational challenges.
        </p>

        <div v-if="expertiseLoading" class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="index in 3" :key="`exp-loading-${index}`" class="marketing-card animate-pulse p-6">
            <div class="h-11 w-11 rounded-xl bg-slate-100"></div>
            <div class="mt-5 h-6 w-2/3 rounded bg-slate-100"></div>
            <div class="mt-3 h-4 w-full rounded bg-slate-100"></div>
            <div class="mt-2 h-4 w-4/5 rounded bg-slate-100"></div>
          </article>
        </div>

        <div v-else class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="item in expertiseItems" :key="item.title" class="marketing-card p-6">
            <div class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              <img v-if="item.iconUrl" :src="item.iconUrl" :alt="item.title" class="h-6 w-6 object-contain">
              <component v-else :is="item.icon" class="h-5 w-5 text-[#1846a3]" />
            </div>
            <h3 class="mt-5 font-display text-xl font-semibold text-slate-900">{{ item.title }}</h3>
            <p class="mt-3 text-sm leading-7 text-slate-500">{{ item.description }}</p>
            <NuxtLink to="/services" class="mt-5 inline-flex items-center text-sm font-semibold text-[#1846a3]">
              Learn more
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <section class="marketing-section">
      <div class="marketing-container">
        <h2 class="font-display text-4xl font-semibold text-slate-900">Trusted by</h2>
        <div v-if="clientsLoading" class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div v-for="index in 5" :key="`client-loading-${index}`" class="marketing-card flex h-16 animate-pulse items-center justify-center bg-slate-50">
            <div class="h-5 w-24 rounded bg-slate-100"></div>
          </div>
        </div>
        <div v-else class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <component
            :is="logo.external_link ? 'a' : 'div'"
            v-for="logo in trustedClients"
            :key="logo.name"
            :href="logo.external_link || undefined"
            :target="logo.external_link ? '_blank' : undefined"
            :rel="logo.external_link ? 'noreferrer' : undefined"
            class="marketing-card flex h-16 items-center justify-center px-4 text-sm font-semibold text-slate-500 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
          >
            <img v-if="logo.logo_url" :src="logo.logo_url" :alt="logo.name" class="max-h-8 max-w-full object-contain">
            <span v-else>{{ logo.name }}</span>
          </component>
        </div>
      </div>
    </section>

    <section class="marketing-section bg-white">
      <div class="marketing-container">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="font-display text-4xl font-semibold text-slate-900">Latest Projects</h2>
            <p class="mt-3 text-sm text-slate-500">Showcasing innovation across industries.</p>
          </div>
          <NuxtLink to="/projects" class="btn-outline">View All Work</NuxtLink>
        </div>

        <div v-if="worksLoading" class="mt-10 grid gap-8 lg:grid-cols-2">
          <div v-for="index in 2" :key="`work-loading-${index}`" class="animate-pulse space-y-4">
            <div class="h-[280px] w-full rounded-2xl bg-slate-100"></div>
            <div class="h-7 w-3/4 rounded bg-slate-100"></div>
            <div class="h-4 w-full rounded bg-slate-100"></div>
          </div>
        </div>

        <div v-else class="mt-10 grid gap-8 lg:grid-cols-2">
          <NuxtLink v-for="project in featuredProjects" :key="project.title" :to="`/projects/${project.slug}`" class="group space-y-4" v-motion-fade-up>
            <img :src="project.image" :alt="project.title" class="h-[280px] w-full rounded-2xl border border-[#d8e1ee] object-cover">
            <div class="flex gap-2">
              <span class="rounded bg-[#edf2ff] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1846a3]">{{ project.tagA }}</span>
              <span class="rounded bg-[#edf2ff] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1846a3]">{{ project.tagB }}</span>
            </div>
            <h3 class="font-display text-2xl font-semibold text-slate-900">{{ project.title }}</h3>
            <p class="text-sm leading-7 text-slate-500">{{ project.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="marketing-section bg-[#eef2f7]">
      <div class="marketing-container">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="font-display text-4xl font-semibold text-slate-900">Insights & News</h2>
            <p class="mt-3 text-sm text-slate-500">Latest stories from our engineering and product teams.</p>
          </div>
          <NuxtLink to="/media-news" class="btn-outline">View All News</NuxtLink>
        </div>

        <div v-if="newsLoading" class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="index in 3" :key="`news-loading-${index}`" class="marketing-card animate-pulse overflow-hidden">
            <div class="h-52 w-full bg-slate-100"></div>
            <div class="p-6">
              <div class="h-4 w-1/3 rounded bg-slate-100"></div>
              <div class="mt-3 h-6 w-4/5 rounded bg-slate-100"></div>
              <div class="mt-3 h-4 w-full rounded bg-slate-100"></div>
            </div>
          </article>
        </div>

        <div v-else class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NuxtLink v-for="item in latestNews" :key="item.title" :to="`/media-news/${item.slug}`" class="marketing-card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.1)]" v-motion-fade-up>
            <div class="relative overflow-hidden">
              <img :src="item.image" :alt="item.title" class="h-52 w-full object-cover transition duration-500 group-hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-t from-[#07142e]/50 via-transparent to-transparent"></div>
            </div>
            <div class="p-6">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[#1846a3]">{{ item.category }}</p>
              <h3 class="mt-3 font-display text-xl font-semibold text-slate-900">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-slate-500">{{ item.summary }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Monitor, Smartphone, Cloud } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'Havor Smarta Digital | Enterprise Web, Mobile, and Cloud Solutions',
  description: 'Havor Smarta Digital builds scalable web platforms, mobile products, cloud infrastructure, and digital experiences for enterprises.',
  path: '/'
})

const { fetchBanners, isLoading: bannersLoading, useBannerPage } = useBanners()
const { expertise, fetchExpertise, isLoading: expertiseLoading } = useExpertise()
const { works, fetchWorks, isLoading: worksLoading } = useWorks()
const { news, fetchNews, isLoading: newsLoading } = useNews()
const { clients, fetchClients, isLoading: clientsLoading } = useClients()

onMounted(async () => {
  await Promise.allSettled([fetchBanners(), fetchExpertise(), fetchWorks(), fetchNews(), fetchClients()])
})

const fallbackExpertiseItems = [
  {
    title: 'Web Development',
    description: 'Robust, scalable web applications built with modern frameworks like React, Vue, and Next.js.',
    icon: Monitor,
    iconUrl: ''
  },
  {
    title: 'Mobile Solutions',
    description: 'Native and cross-platform mobile apps designed for optimal performance on iOS and Android.',
    icon: Smartphone,
    iconUrl: ''
  },
  {
    title: 'Cloud Infrastructure',
    description: 'Secure cloud migration, architecture design, and DevOps automation for AWS and Azure.',
    icon: Cloud,
    iconUrl: ''
  }
]

const fallbackClients = [
  { name: 'StarkCorp', logo_url: '', external_link: '' },
  { name: 'Vortex Systems', logo_url: '', external_link: '' },
  { name: 'Nucleus', logo_url: '', external_link: '' },
  { name: 'Apex Digital', logo_url: '', external_link: '' },
  { name: 'GlobalTech', logo_url: '', external_link: '' }
]

const fallbackProjects = [
  {
    title: 'Novus Financial Dashboard',
    description: 'A comprehensive wealth management platform for high-net-worth individuals.',
    tagA: 'Fintech',
    tagB: 'Web App',
    image: 'https://images.unsplash.com/photo-1551281044-8b0d665d4fd4?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'FleetTrack Pro',
    description: 'Real-time fleet monitoring solution reducing operational costs by 30%.',
    tagA: 'Logistics',
    tagB: 'Mobile',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  }
]

const fallbackNews = [
  {
    category: 'Technology',
    title: 'Designing resilient cloud architecture for regulated sectors',
    summary: 'How to improve deployment speed while preserving compliance, observability, and reliability.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'Company',
    title: 'Havor launches enterprise modernization studio',
    summary: 'A dedicated unit helping legacy-heavy organizations modernize in incremental, low-risk phases.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'Engineering',
    title: 'From monolith to modular platforms: a practical migration playbook',
    summary: 'A proven path for decomposing systems while keeping product delivery and business continuity stable.',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80'
  }
]

const heroBanner = useBannerPage('home')

const heroTitleLineA = computed(() => {
  const source = heroBanner.value.title || 'Speed, Quality, and Trust.'
  const [lineA] = source.split(', and')
  return lineA || 'Speed, Quality,'
})

const heroTitleLineB = computed(() => {
  const source = heroBanner.value.title || 'Speed, Quality, and Trust.'
  const split = source.split(', and')
  if (split[1]) return split[1].trim()
  return 'and Trust.'
})

const heroSubtitle = computed(() => {
  return heroBanner.value.subtitle || 'Empowering enterprises with cutting-edge digital transformation. We build scalable, secure, and future-ready IT solutions.'
})

const expertiseItems = computed(() => {
  if (!expertise.value.length) return fallbackExpertiseItems

  return expertise.value.slice(0, 3).map((item, index) => ({
    title: item.name,
    description: item.description || 'Specialized services tailored for business growth and technical excellence.',
    icon: fallbackExpertiseItems[index]?.icon || Monitor,
    iconUrl: item.icon_url || ''
  }))
})

const featuredProjects = computed(() => {
  if (!works.value.length) return fallbackProjects

  return works.value.slice(0, 2).map((item, index) => ({
    title: item.title,
    description: item.description || 'Project details will be available soon.',
    tagA: item.categoryName || 'Project',
    tagB: item.year ? `${item.year}` : 'Case Study',
    slug: item.slug || toSlug(item.title),
    image: item.image_url || fallbackProjects[index]?.image || fallbackProjects[0].image
  }))
})

const latestNews = computed(() => {
  if (!news.value.length) return fallbackNews

  return news.value.slice(0, 3).map((item, index) => ({
    category: item.category || 'News',
    title: item.title,
    summary: (item.content || '').replace(/<[^>]*>?/gm, '').slice(0, 120) || 'Read the latest update from our team.',
    slug: item.slug || toSlug(item.title),
    image: item.image_url || fallbackNews[index % fallbackNews.length].image
  }))
})

const trustedClients = computed(() => {
  if (!clients.value.length) return fallbackClients
  return clients.value.slice(0, 5)
})
</script>
