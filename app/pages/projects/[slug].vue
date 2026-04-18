<template>
  <div class="space-y-16 pb-8">
    <HeroSection
      :kicker="project?.categoryName || 'Project detail'"
      :title="pageTitle"
      :description="pageDescription"
      :image="pageBanner.media_url || projectImage"
      :image-alt="project?.title || 'Project detail hero banner'"
    >
      <template #actions>
        <NuxtLink to="/projects" class="btn-primary">Back to Projects</NuxtLink>
        <NuxtLink to="/media-news" class="btn-outline text-white border-white/20 hover:bg-white/10">View News</NuxtLink>
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

        <div v-else-if="project" class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <article class="marketing-card p-8" v-motion-fade-up>
            <p class="marketing-kicker">Case Study</p>
            <h2 class="mt-4 font-display text-3xl font-semibold text-slate-900">{{ project.title }}</h2>
            <p class="mt-4 text-sm leading-8 text-slate-500">{{ project.description || 'Project details will be available soon.' }}</p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-[#d8e1ee] bg-slate-50 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Client</p>
                <p class="mt-2 font-display text-lg font-semibold text-slate-900">{{ project.client || 'Enterprise Client' }}</p>
                <p class="mt-2 text-sm leading-7 text-slate-500">Trusted engagement delivered with cross-functional collaboration and quality control.</p>
              </div>
              <div class="rounded-2xl border border-[#d8e1ee] bg-slate-50 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Timeline</p>
                <p class="mt-2 font-display text-lg font-semibold text-slate-900">{{ project.year || 'Recent' }}</p>
                <p class="mt-2 text-sm leading-7 text-slate-500">Built for speed, maintainability, and long-term support.
                </p>
              </div>
            </div>
          </article>

          <aside class="space-y-6" v-motion-fade-up>
            <div class="marketing-card overflow-hidden">
              <img :src="project.image_url || pageBanner.media_url || projectImage" :alt="project.title" class="h-56 w-full object-cover">
            </div>
            <div class="marketing-card p-6">
              <p class="marketing-kicker">More Projects</p>
              <div class="mt-4 space-y-3">
                <NuxtLink
                  v-for="item in relatedProjects"
                  :key="item.slug"
                  :to="`/projects/${item.slug}`"
                  class="flex items-center justify-between rounded-xl border border-[#d8e1ee] px-4 py-3 transition hover:bg-slate-50"
                >
                  <span class="font-medium text-slate-800">{{ item.title }}</span>
                  <ArrowRight class="h-4 w-4 text-[#1846a3]" />
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>

        <div v-else class="marketing-card p-8 text-center">
          <h2 class="font-display text-2xl font-semibold text-slate-900">Project not found</h2>
          <p class="mt-3 text-sm text-slate-500">The requested project is not available.</p>
          <NuxtLink to="/projects" class="btn-primary mt-6 inline-flex">Back to Projects</NuxtLink>
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
const { works, fetchWorks, isLoading } = useWorks()
const { banners, fetchBanners } = useBanners()
const slug = computed(() => String(route.params.slug || ''))
const projectImage = 'https://images.unsplash.com/photo-1551281044-8b0d665d4fd4?auto=format&fit=crop&w=1600&q=80'

onMounted(async () => {
  await Promise.allSettled([fetchWorks(), fetchBanners()])
})

const project = computed(() => works.value.find((item) => item.slug === slug.value) || null)
const pageBanner = computed(() => banners.value.find((item) => (item.page_name || '').toLowerCase().includes('projects')) || banners.value[0] || {})
const pageTitle = computed(() => project.value?.title ? `${project.value.title} | Projects | Havor Smarta Digital` : 'Project Details | Havor Smarta Digital')
const pageDescription = computed(() => project.value?.description || 'Explore Havor Smarta Digital project details and case study information.')

usePageSeo({
  title: pageTitle,
  description: pageDescription,
  path: computed(() => `/projects/${slug.value}`),
  image: computed(() => pageBanner.value.media_url || projectImage),
  type: 'article'
})

const relatedProjects = computed(() => works.value.filter((item) => item.slug !== slug.value).slice(0, 4))
</script>
