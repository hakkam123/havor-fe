<template>
  <div class="overflow-hidden bg-white">
    <PublicDetailHero
      :image="project?.image_url || fallbackImage"
      :image-alt="project?.title || 'Project hero image'"
      label="Project Experience"
    />

    <section class="bg-white py-12 sm:py-14">
      <div class="marketing-container">
        <div v-if="project" class="mx-auto max-w-4xl text-center">
          <p class="text-[0.72rem] font-semibold uppercase tracking-normal text-[#1f5dcc]">
            {{ project.categoryName || 'Project' }}
          </p>
          <h1 class="mt-4 text-[clamp(2rem,4.2vw,3.65rem)] font-semibold leading-tight tracking-normal text-[#0e2344]">
            {{ project.title }}
          </h1>
          <div class="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.82rem] font-medium text-slate-500">
            <span v-if="project.client">{{ project.client }}</span>
            <span v-if="project.year">{{ project.year }}</span>
          </div>
        </div>

        <div v-else class="brand-panel p-6 text-center">
          <h1 class="text-3xl font-semibold tracking-normal text-[#0e2344]">Project not found</h1>
          <p class="mt-3 text-sm leading-7 text-slate-600">The project you requested is not available in the current showcase.</p>
          <NuxtLink to="/projects" class="btn-primary mt-6 inline-flex">Back to Projects</NuxtLink>
        </div>
      </div>
    </section>

    <section v-if="project" class="border-t border-[#dbe6f4] bg-white py-12">
      <div class="marketing-container">
        <div class="grid gap-10 lg:grid-cols-[4rem_minmax(0,1fr)_18rem]">
          <aside class="hidden lg:block" v-motion-fade-up>
            <div class="sticky top-28">
              <p class="brand-meta">Share</p>
              <div class="mt-4 flex flex-col gap-3">
                <NuxtLink to="/projects" class="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe6f4] text-[#0e2344] transition hover:border-[#1f5dcc] hover:text-[#1f5dcc]" aria-label="Back to projects">
                  <ArrowLeft class="h-4 w-4" />
                </NuxtLink>
                <NuxtLink to="/#contact" class="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe6f4] text-[#0e2344] transition hover:border-[#1f5dcc] hover:text-[#1f5dcc]" aria-label="Discuss project">
                  <Mail class="h-4 w-4" />
                </NuxtLink>
              </div>
            </div>
          </aside>

          <article class="min-w-0" v-motion-fade-up>
            <div class="detail-content">
              <p
                v-for="paragraph in projectParagraphs"
                :key="paragraph"
              >
                {{ paragraph }}
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
                  :to="`/projects/${item.slug}`"
                  class="group relative block min-h-28 overflow-hidden rounded-lg bg-[#071529]"
                >
                  <img :src="item.image_url" :alt="item.categoryName || item.title" class="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-[1.04]">
                  <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,21,41,0.22)_0%,rgba(7,21,41,0.86)_100%)]"></div>
                  <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white">
                    <span class="text-[0.74rem] font-semibold uppercase tracking-normal">{{ item.categoryName || 'Project' }}</span>
                    <ArrowUpRight class="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </NuxtLink>
              </div>
            </div>

            <div class="rounded-lg bg-[#0d3b91] p-5 text-white">
              <p class="text-[0.75rem] font-medium uppercase tracking-normal text-white/70">Project Snapshot</p>
              <h3 class="mt-3 text-lg font-semibold leading-tight">{{ project.client || 'Havor implementation' }}</h3>
              <p v-if="project.year" class="mt-3 text-sm text-white/76">Delivered in {{ project.year }}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section v-if="project && relatedProjects.length" class="border-t border-[#dbe6f4] bg-white py-12 sm:py-14">
      <div class="marketing-container">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 class="border-l-2 border-[#1f5dcc] pl-5 text-[clamp(1.65rem,3vw,2.4rem)] font-semibold text-[#0e2344]">
            Related Projects
          </h2>
          <NuxtLink to="/projects" class="btn-outline">View All</NuxtLink>
        </div>

        <div class="mt-8 grid gap-5 md:grid-cols-3">
          <NuxtLink
            v-for="item in relatedProjects"
            :key="item.slug"
            :to="`/projects/${item.slug}`"
            class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(18,56,122,0.1)]"
            v-motion-fade-up
          >
            <img :src="item.image_url" :alt="item.title" class="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]">
            <div class="p-4">
              <p class="brand-meta text-[#1f5dcc]">{{ item.categoryName || 'Project' }}</p>
              <h3 class="mt-2 line-clamp-2 text-[1.02rem] font-semibold leading-snug text-[#0e2344]">{{ item.title }}</h3>
              <p v-if="item.client" class="mt-3 text-xs font-medium text-slate-500">{{ item.client }}</p>
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
const slug = computed(() => String(route.params.slug || ''))
const defaultFallbackImage = 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80'
const toPlainText = (value = '') => String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

const { works, fetchWorks, error } = useWorks()
const { fetchBannerPage, useBannerPage } = useBanners()
const projectsBanner = useBannerPage('projects')
const fallbackImage = computed(() => projectsBanner.value.media_url || defaultFallbackImage)

onMounted(async () => {
  await Promise.allSettled([fetchWorks(), fetchBannerPage('projects')])

  if (!error.value && !project.value) {
    showError({
      statusCode: 404,
      statusMessage: 'Project not found'
    })
  }
})

const project = computed(() => works.value.find((item) => item.slug === slug.value) || null)
const relatedProjects = computed(() => works.value.filter((item) => item.slug !== slug.value).slice(0, 3))
const projectParagraphs = computed(() => {
  const text = toPlainText(project.value?.description)
  if (!text) return ['This project showcases Havor Smarta Digital delivery experience across planning, design, development, and implementation support.']

  return text.split(/(?<=\.)\s+/).filter(Boolean)
})
const categoryCards = computed(() => {
  const categoryMap = new Map<string, typeof works.value[number]>()

  works.value.forEach((item) => {
    const key = item.categoryName || item.title
    if (!categoryMap.has(key)) categoryMap.set(key, item)
  })

  return [...categoryMap.values()].slice(0, 4)
})

usePageSeo({
  title: computed(() => project.value ? `${project.value.title} | Projects | PT Havor SMART Digital` : 'Project Detail | PT Havor SMART Digital'),
  description: computed(() => toPlainText(project.value?.description) || 'Explore PT Havor SMART Digital project details and delivery outcomes.'),
  path: computed(() => `/projects/${slug.value}`),
  image: computed(() => project.value?.image_url || fallbackImage.value),
  type: 'article'
})
</script>
