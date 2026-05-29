<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      :title="careersBanner.title || careersPage.hero.title"
      :subtitle="careersBanner.subtitle || careersPage.hero.subtitle"
      :image="careersHeroImage"
      hero-size="half"
      image-label="Team Culture"
      image-title="A collaborative environment for people who want to build meaningful digital work."
      side-label="Career Experience"
      side-title="Professional growth through serious projects, supportive teamwork, and structured delivery."
      :side-copy="careersPage.culture.narrative"
      :highlights="[
        { label: 'Open Roles', value: String(careersPage.roles.length) },
        { label: 'Work Style', value: 'Collaborative' },
        { label: 'Growth', value: 'Continuous' }
      ]"
    >

      <template #aside>
        <p class="text-[0.7rem] font-medium uppercase tracking-normal text-[#5374a8]">Why Careers Matter</p>
        <p class="mt-3 text-lg font-semibold text-[#0e2344]">We build a team that can think clearly, collaborate well, and create meaningful impact.</p>
        <p class="mt-3 text-sm leading-7 text-slate-600">
          Havor values ownership, curiosity, and respect. The team environment is structured, supportive, and focused on quality.
        </p>
      </template>
    </CorporatePageHero>

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
          <article class="border-l-2 border-[#1f5dcc] pl-5">
            <SectionHeading
              :title="careersPage.culture.title"
              :description="careersPage.culture.narrative"
            />
          </article>

          <div class="grid gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="value in careersPage.culture.values"
              :key="value.title"
              class="border-t border-[#dbe6f4] pt-5"
              v-motion-fade-up
            >
              <p class="brand-meta">Culture Value</p>
              <h3 class="mt-2.5 brand-card-title">{{ value.title }}</h3>
              <p class="mt-2.5 brand-card-copy">{{ value.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <div class="grid gap-7 lg:grid-cols-[0.82fr_1.18fr]">
          <article class="relative isolate overflow-hidden rounded-lg px-6 py-7 text-white shadow-[0_24px_70px_rgba(18,56,122,0.18)] sm:px-8 sm:py-8">
            <img
              :src="careersHeroImage"
              alt="Havor team culture"
              class="absolute inset-0 h-full w-full object-cover"
            >
            <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,12,24,0.9)_0%,rgba(5,12,24,0.68)_100%)]"></div>
            <div class="relative">
              <p class="inline-flex rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-normal text-white/78">
                Why Work With Us
              </p>
              <h2 class="mt-5 text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-tight tracking-normal">
                Join a team where growth, meaningful work, and support move together.
              </h2>
              <p class="mt-4 text-[0.92rem] leading-7 text-white/80">
                Havor offers a professional environment that values steady development, thoughtful collaboration, and digital work that matters to real clients.
              </p>
            </div>
          </article>

          <div class="grid gap-x-7 gap-y-6 md:grid-cols-2">
            <article
              v-for="item in careersPage.whyWorkHere.items"
              :key="item.title"
              class="border-t border-[#dbe6f4] pt-5"
              v-motion-fade-up
            >
              <p class="brand-meta">Benefit</p>
              <h3 class="mt-2.5 brand-card-title">{{ item.title }}</h3>
              <p class="mt-2.5 brand-card-copy">{{ item.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="open-roles" class="brand-section pt-0">
      <div class="marketing-container">
        <SectionHeading
          title="Current opportunities to build with PT Havor SMART Digital."
          description="Each role is presented as a polished corporate listing with clear team, type, location, and role summary."
        />

        <div v-if="careers.length" class="mt-8 grid gap-5 border-y border-[#dbe6f4] py-5 lg:grid-cols-[0.42fr_0.58fr]" v-motion-fade-up>
          <div>
            <label for="career-category" class="brand-meta">Role Category</label>
            <select
              id="career-category"
              v-model="selectedCategory"
              class="mt-3 w-full rounded-lg border border-[#d6e5fb] bg-white px-4 py-3 text-[0.95rem] font-medium text-[#0e2344] outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
            >
              <option v-for="option in categoryOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>

          <div>
            <label for="career-search" class="brand-meta">Search Role</label>
            <input
              id="career-search"
              v-model="searchQuery"
              type="text"
              placeholder="Search role title, category, or description"
              class="mt-3 w-full rounded-lg border border-[#d6e5fb] bg-white px-4 py-3 text-[0.95rem] font-medium text-[#0e2344] outline-none transition placeholder:text-slate-400 focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
            >
          </div>
        </div>

        <div v-if="careers.length && filteredCareers.length" class="mt-8 grid gap-4 lg:grid-cols-2">
          <article
            v-for="role in filteredCareers"
            :key="role.id"
            class="brand-panel p-5"
            v-motion-fade-up
          >
            <p class="brand-meta">{{ roleCategoryFor(role) }}</p>
            <h3 class="mt-3 text-[1.25rem] font-semibold tracking-normal text-[#0e2344]">{{ role.job_title }}</h3>
            <p class="mt-2 line-clamp-3 text-[0.86rem] leading-6 text-slate-600">{{ role.excerpt }}</p>
            <div class="mt-5 flex flex-wrap gap-3">
              <NuxtLink :to="`/careers/${role.slug}`" class="btn-outline">
                View Role
              </NuxtLink>
              <a :href="`mailto:${company.email}?subject=${encodeURIComponent(`Application - ${role.job_title}`)}`" class="btn-primary">
                Apply Now
              </a>
            </div>
          </article>
        </div>
        <div v-else-if="careers.length" class="mt-8 brand-soft-panel p-8 text-center">
          <p class="text-[1rem] font-semibold text-[#0e2344]">No roles match your filter.</p>
          <p class="mt-2 text-[0.92rem] leading-6 text-slate-600">
            Try another role category or broaden your search keyword.
          </p>
          <button @click="selectedCategory = 'All categories'; searchQuery = ''" class="btn-outline mt-6 inline-flex">
            Clear All Filters
          </button>
        </div>
        <div v-else class="mt-8 brand-soft-panel p-10 text-center">
          <h3 class="text-xl font-semibold text-[#0e2344]">No open positions at the moment</h3>
          <p class="mt-4 text-slate-600">While we don't have active roles listed right now, we are always looking for great talent. Send us your CV for future opportunities.</p>
          <a :href="`mailto:${company.email}?subject=${encodeURIComponent('General Career Inquiry')}`" class="btn-outline mt-8 inline-flex">Send your CV</a>
        </div>
      </div>
    </section>

    <PublicImageCta
      :title="careersPage.cta.title"
      :copy="careersPage.cta.copy"
      :image="careersHeroImage"
      image-alt="Career inquiry"
      action-label="Connect With Us"
      :href="`mailto:${company.email}?subject=${encodeURIComponent('Career Inquiry')}`"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'Careers | PT Havor SMART Digital',
  description: 'Explore career opportunities at PT Havor SMART Digital and join a collaborative team building meaningful digital solutions.',
  path: '/careers'
})

const { company, careersPage } = useCorporateContent()
const { careers, fetchCareers } = useCareers()
const { fetchBannerPage, useBannerPage } = useBanners()
const careersBanner = useBannerPage('careers')
const careersHeroImage = computed(() => careersBanner.value.media_url || careersPage.hero.image)
const selectedCategory = ref('All categories')
const searchQuery = ref('')

onMounted(() => {
  fetchCareers()
  fetchBannerPage('careers')
})

const roleCategoryFor = (role) => {
  const text = `${role.job_title} ${role.job_description}`.toLowerCase()

  if (text.includes('qa') || text.includes('quality')) return 'Quality Assurance'
  if (text.includes('ui') || text.includes('ux') || text.includes('design')) return 'Design'
  if (text.includes('frontend') || text.includes('backend') || text.includes('full-stack') || text.includes('developer')) return 'Engineering'
  if (text.includes('intern')) return 'Internship'

  return 'Business & Operations'
}

const categoryOptions = computed(() => [
  'All categories',
  ...new Set(careers.value.map(roleCategoryFor))
])

const filteredCareers = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return careers.value.filter((role) => {
    const roleCategory = roleCategoryFor(role)
    const matchesCategory = selectedCategory.value === 'All categories' || roleCategory === selectedCategory.value
    const matchesKeyword =
      !keyword ||
      role.job_title.toLowerCase().includes(keyword) ||
      role.job_description.toLowerCase().includes(keyword) ||
      roleCategory.toLowerCase().includes(keyword)

    return matchesCategory && matchesKeyword
  })
})
</script>
