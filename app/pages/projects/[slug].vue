<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      :title="project?.title || 'Project Detail'"
      :subtitle="project?.summary || 'Explore the objectives, delivery structure, and outcomes behind this implementation.'"
      :image="project?.image || fallbackImage"
    >
      <template #actions>
        <NuxtLink to="/projects" class="btn-primary">Back to Projects</NuxtLink>
        <NuxtLink to="/#contact" class="btn-outline">Discuss a Similar Project</NuxtLink>
      </template>
    </CorporatePageHero>

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <div v-if="project" class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article class="brand-panel p-8 sm:p-10" v-motion-fade-up>
            <div class="flex flex-wrap gap-2">
              <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ project.category }}</span>
              <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ project.industry }}</span>
            </div>

            <h2 class="mt-6 text-[clamp(2.2rem,4vw,3.8rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0e2344]">
              {{ project.deliveryTitle }}
            </h2>
            <p class="mt-5 text-base leading-8 text-slate-600">
              {{ project.deliverySummary }}
            </p>

            <div class="mt-8 grid gap-4 md:grid-cols-2">
              <div class="rounded-[1.6rem] bg-[#f7fbff] px-5 py-5">
                <p class="brand-meta">Challenge</p>
                <p class="mt-3 text-sm leading-7 text-slate-600">{{ project.challenge }}</p>
              </div>
              <div class="rounded-[1.6rem] bg-[#f7fbff] px-5 py-5">
                <p class="brand-meta">Solution</p>
                <p class="mt-3 text-sm leading-7 text-slate-600">{{ project.solution }}</p>
              </div>
            </div>

            <div class="mt-6 rounded-[1.6rem] border border-[#dbe6f4] px-5 py-5">
              <p class="brand-meta">Business Outcome</p>
              <p class="mt-3 text-sm leading-7 text-slate-600">{{ project.businessOutcome }}</p>
            </div>
          </article>

          <aside class="space-y-6" v-motion-fade-up>
            <div class="overflow-hidden rounded-[2rem] border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]">
              <img :src="project.image" :alt="project.title" class="h-72 w-full object-cover">
              <div class="p-6">
                <p class="brand-meta">Project Snapshot</p>
                <div class="mt-4 space-y-4">
                  <div class="border-b border-[#dbe6f4] pb-4">
                    <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#6c86ad]">Client Type</p>
                    <p class="mt-2 text-base font-extrabold text-[#0e2344]">{{ project.client }}</p>
                  </div>
                  <div class="border-b border-[#dbe6f4] pb-4">
                    <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#6c86ad]">Impact Note</p>
                    <p class="mt-2 text-base font-extrabold text-[#0e2344]">{{ project.metric }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#6c86ad]">Technologies</p>
                    <div class="mt-3 flex flex-wrap gap-2">
                      <span
                        v-for="tech in project.technologies"
                        :key="tech"
                        class="rounded-full border border-[#d6e5fb] bg-[#f7fbff] px-3 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#31527d]"
                      >
                        {{ tech }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="brand-soft-panel p-6">
              <p class="brand-meta">Related Projects</p>
              <div class="mt-4 space-y-3">
                <NuxtLink
                  v-for="item in relatedProjects"
                  :key="item.slug"
                  :to="`/projects/${item.slug}`"
                  class="flex items-center justify-between rounded-[1.2rem] border border-[#dbe6f4] bg-white px-4 py-3 transition hover:bg-[#f7fbff]"
                >
                  <span class="font-bold text-[#0e2344]">{{ item.title }}</span>
                  <span class="text-sm font-extrabold text-[#1f5dcc]">Open</span>
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>

        <div v-else class="brand-panel p-8 text-center">
          <h2 class="text-3xl font-extrabold tracking-[-0.04em] text-[#0e2344]">Project not found</h2>
          <p class="mt-3 text-sm leading-7 text-slate-600">The project you requested is not available in the current showcase.</p>
          <NuxtLink to="/projects" class="btn-primary mt-6 inline-flex">Back to Projects</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const fallbackImage = 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80'

const { projectEntries, getProjectBySlug } = useCorporateRoutes()

const project = computed(() => getProjectBySlug(slug.value))
const relatedProjects = computed(() => projectEntries.value.filter((item) => item.slug !== slug.value).slice(0, 3))

usePageSeo({
  title: computed(() => project.value ? `${project.value.title} | Projects | PT Havor SMART Digital` : 'Project Detail | PT Havor SMART Digital'),
  description: computed(() => project.value?.summary || 'Explore PT Havor SMART Digital project details and delivery outcomes.'),
  path: computed(() => `/projects/${slug.value}`),
  image: computed(() => project.value?.image || fallbackImage),
  type: 'article'
})
</script>
