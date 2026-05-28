<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      :title="projectsPage.hero.title"
      :subtitle="projectsPage.hero.subtitle"
      :image="projectsPage.hero.image"
      hero-size="half"
    >
      
    </CorporatePageHero>

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <SectionHeading
          :title="projectsPage.categories.title"
          description="A curated breakdown of the kinds of work Havor supports across sectors and operational needs."
        />

        <div class="mt-10 grid gap-5 border-y border-[#dbe6f4] py-6 lg:grid-cols-[0.42fr_0.58fr]" v-motion-fade-up>
          <div>
            <label for="project-category" class="brand-meta">Project Category</label>
            <select
              id="project-category"
              v-model="selectedCategory"
              class="mt-3 w-full rounded-lg border border-[#d6e5fb] bg-white px-4 py-3 text-[0.95rem] font-medium text-[#0e2344] outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
            >
              <option v-for="option in categoryOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>

          <div>
            <label for="project-search" class="brand-meta">Search Project</label>
            <input
              id="project-search"
              v-model="searchQuery"
              type="text"
              placeholder="Search project name, industry, or keyword"
              class="mt-3 w-full rounded-lg border border-[#d6e5fb] bg-white px-4 py-3 text-[0.95rem] font-medium text-[#0e2344] outline-none transition placeholder:text-slate-400 focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
            >
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <SectionHeading
          title="Selected implementations across enterprise platforms, mobile delivery, and transformation programs."
          description="Each project combines a real organizational challenge, a structured delivery response, and a clear digital outcome."
        />

        <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="project in filteredProjects"
            :key="project.title"
            :to="`/projects/${project.slug}`"
            class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-[0_14px_40px_rgba(18,56,122,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(18,56,122,0.12)]"
            aria-label="Open project detail"
            v-motion-fade-up
          >
            <img
              :src="project.image_url"
              :alt="project.title"
              class="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            >
            <div class="px-5 py-5 sm:px-5 sm:py-5">
              <div class="flex flex-wrap gap-2">
                <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-medium uppercase tracking-normal text-[#1f5dcc]">{{ project.categoryName }}</span>
                <span v-if="project.client" class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-medium uppercase tracking-normal text-[#1f5dcc]">{{ project.client }}</span>
              </div>
              <h3 class="mt-4 text-[1.28rem] font-semibold leading-[1.22] tracking-normal text-[#0e2344]">{{ project.title }}</h3>
              <p class="mt-3 text-[0.92rem] leading-6 text-slate-600">{{ stripHtml(project.description) }}</p>

              <div class="mt-5 inline-flex items-center gap-2 text-[0.82rem] font-medium uppercase tracking-normal text-[#1f5dcc]">
                View Project Detail
              </div>
            </div>
          </NuxtLink>

          <div
            v-if="!works.length"
            class="brand-panel px-6 py-12 text-center md:col-span-2 xl:col-span-3"
          >
            <h3 class="text-xl font-semibold text-[#0e2344]">Showcase coming soon</h3>
            <p class="mt-3 text-[0.92rem] leading-6 text-slate-600">
              We are currently preparing our project portfolio for display. Check back shortly to see our latest implementations.
            </p>
          </div>
          <div
            v-else-if="!filteredProjects.length"
            class="brand-panel px-6 py-12 text-center md:col-span-2 xl:col-span-3"
          >
            <p class="text-[1rem] font-semibold text-[#0e2344]">No projects match your filter.</p>
            <p class="mt-2 text-[0.92rem] leading-6 text-slate-600">
              Try another category or broaden your search keyword.
            </p>
            <button @click="selectedCategory = 'All categories'; searchQuery = ''" class="btn-outline mt-6 inline-flex">
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </section>

    <PublicImageCta
      :title="projectsPage.cta.title"
      :copy="projectsPage.cta.copy"
      :image="projectsPage.hero.image"
      image-alt="Project consultation"
      action-label="Discuss Your Project Idea"
      to="/#contact"
    />
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
const { works, fetchWorks } = useWorks()

const selectedCategory = ref('All categories')
const searchQuery = ref('')
const stripHtml = (value = '') => String(value || '').replace(/<[^>]*>?/gm, '').trim()

onMounted(() => {
  fetchWorks()
})

const categoryOptions = computed(() => [
  'All categories',
  ...new Set(works.value.map((project) => project.categoryName).filter(Boolean))
])

const filteredProjects = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return works.value.filter((project) => {
    const matchesCategory = selectedCategory.value === 'All categories' || project.categoryName === selectedCategory.value
    const matchesKeyword =
      !keyword ||
      project.title.toLowerCase().includes(keyword) ||
      stripHtml(project.description).toLowerCase().includes(keyword) ||
      project.client?.toLowerCase().includes(keyword) ||
      project.categoryName?.toLowerCase().includes(keyword)

    return matchesCategory && matchesKeyword
  })
})
</script>
