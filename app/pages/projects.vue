<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      :title="projectsPage.hero.title"
      :subtitle="projectsPage.hero.subtitle"
      :image="projectsPage.hero.image"
    >
      <template #actions>
        <NuxtLink to="/services" class="btn-primary">Explore Services</NuxtLink>
        <NuxtLink to="/#contact" class="btn-outline">Discuss a Project</NuxtLink>
      </template>
    </CorporatePageHero>

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <SectionHeading
          :title="projectsPage.categories.title"
          description="A curated breakdown of the kinds of work Havor supports across sectors and operational needs."
        />

        <div class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="category in projectsPage.categories.items"
            :key="category.title"
            class="brand-soft-panel p-6"
            v-motion-fade-up
          >
            <p class="brand-meta">Category</p>
            <h3 class="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-[#0e2344]">{{ category.title }}</h3>
            <p class="mt-3 text-sm leading-7 text-slate-600">{{ category.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <SectionHeading
          title="Selected implementations across enterprise platforms, mobile delivery, and transformation programs."
          description="Each project combines a real organizational challenge, a structured delivery response, and a clear digital outcome."
        />

        <div class="mt-10 grid gap-6 lg:grid-cols-2">
          <NuxtLink
            v-for="project in projectEntries"
            :key="project.title"
            :to="`/projects/${project.slug}`"
            class="overflow-hidden rounded-[2rem] border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]"
            aria-label="Open project detail"
            v-motion-fade-up
          >
            <img
              :src="project.image"
              :alt="project.title"
              class="h-72 w-full object-cover"
            >
            <div class="px-7 py-7 sm:px-8 sm:py-8">
              <div class="flex flex-wrap gap-2">
                <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ project.category }}</span>
                <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ project.industry }}</span>
              </div>
              <h3 class="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-[#0e2344]">{{ project.title }}</h3>
              <p class="mt-4 text-sm leading-7 text-slate-600">{{ project.summary }}</p>

              <div class="mt-6 grid gap-4 md:grid-cols-2">
                <div class="rounded-[1.4rem] bg-[#f7fbff] px-4 py-4">
                  <p class="brand-meta">Challenge</p>
                  <p class="mt-3 text-sm leading-7 text-slate-600">{{ project.challenge }}</p>
                </div>
                <div class="rounded-[1.4rem] bg-[#f7fbff] px-4 py-4">
                  <p class="brand-meta">Solution</p>
                  <p class="mt-3 text-sm leading-7 text-slate-600">{{ project.solution }}</p>
                </div>
              </div>

              <div class="mt-5 rounded-[1.4rem] border border-[#dbe6f4] px-4 py-4">
                <p class="brand-meta">Project Note</p>
                <p class="mt-3 text-sm leading-7 text-slate-600">{{ project.metric }}</p>
              </div>

              <div class="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#1f5dcc]">
                View Project Detail
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0 pb-24">
      <div class="marketing-container">
        <div class="brand-soft-panel px-8 py-8 sm:px-10 sm:py-10">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="max-w-3xl">
              <h2 class="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0e2344]">
                {{ projectsPage.cta.title }}
              </h2>
              <p class="mt-4 text-base leading-8 text-slate-600">
                {{ projectsPage.cta.copy }}
              </p>
            </div>
            <NuxtLink to="/#contact" class="btn-primary">
              Discuss Your Project Idea
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'Projects | PT Havor SMART Digital',
  description: 'Explore selected PT Havor SMART Digital projects across corporate websites, business platforms, mobile apps, and digital transformation programs.',
  path: '/projects'
})

const { projectsPage } = useCorporateContent()
const { projectEntries } = useCorporateRoutes()
</script>
