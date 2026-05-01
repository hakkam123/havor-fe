<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      :title="project?.title || 'Project Detail'"
      :subtitle="project?.description || 'Explore the objectives, delivery structure, and outcomes behind this implementation.'"
      :image="project?.image_url || fallbackImage"
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
              <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ project.categoryName }}</span>
              <span v-if="project.client" class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ project.client }}</span>
            </div>

            <h2 class="mt-6 text-[clamp(2.2rem,4vw,3.8rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0e2344]">
              {{ project.title }}
            </h2>
            <p class="mt-5 text-base leading-8 text-slate-600">
              {{ project.description }}
            </p>
          </article>

          <aside class="space-y-6" v-motion-fade-up>
            <div class="overflow-hidden rounded-[2rem] border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]">
              <img :src="project.image_url" :alt="project.title" class="h-72 w-full object-cover">
              <div class="p-6">
                <p class="brand-meta">Project Snapshot</p>
                <div class="mt-4 space-y-4">
                  <div class="border-b border-[#dbe6f4] pb-4">
                    <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-[#6c86ad]">Client / Year</p>
                    <p class="mt-2 text-base font-extrabold text-[#0e2344]">{{ project.client }} {{ project.year ? `- ${project.year}` : '' }}</p>
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

const { works, fetchWorks } = useWorks()
onMounted(() => {
  fetchWorks()
})

const project = computed(() => works.value.find((item) => item.slug === slug.value) || null)
const relatedProjects = computed(() => works.value.filter((item) => item.slug !== slug.value).slice(0, 3))

usePageSeo({
  title: computed(() => project.value ? `${project.value.title} | Projects | PT Havor SMART Digital` : 'Project Detail | PT Havor SMART Digital'),
  description: computed(() => project.value?.description || 'Explore PT Havor SMART Digital project details and delivery outcomes.'),
  path: computed(() => `/projects/${slug.value}`),
  image: computed(() => project.value?.image_url || fallbackImage),
  type: 'article'
})
</script>
