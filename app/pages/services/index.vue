<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      :title="servicesBanner.title || servicesPage.hero.title"
      :subtitle="servicesBanner.subtitle || servicesPage.hero.subtitle"
      :image="servicesHeroImage"
      hero-size="half"
      image-label="Digital Expertise"
      image-title="Technology implementation shaped for enterprise clarity, scale, and operational fit."
      side-label="How We Help"
      side-title="Connected consulting, design, engineering, integration, and support."
      :side-copy="servicesPage.overview.intro"
      :highlights="[
        { label: 'Delivery Style', value: 'Tailored' },
        { label: 'Support Scope', value: 'End-to-End' }
      ]"
    >

      <template #aside>
        <p class="text-[0.7rem] font-medium uppercase tracking-normal text-[#5374a8]">Service Philosophy</p>
        <p class="mt-3 text-lg font-semibold text-[#0e2344]">Every service is designed around real organizational needs, not a one-size-fits-all package.</p>
        <p class="mt-3 text-sm leading-7 text-slate-600">
          Havor helps clients define the right digital scope, then supports implementation with structure, responsiveness, and long-term thinking.
        </p>
      </template>
    </CorporatePageHero>

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <article class="border-l-2 border-[#1f5dcc] pl-5">
            <SectionHeading
              :title="servicesPage.overview.title"
              :description="servicesPage.overview.intro"
            />
          </article>

          <div class="grid gap-x-8 gap-y-6 md:grid-cols-3">
            <article
              v-for="point in servicesPage.overview.points"
              :key="point"
              class="border-t border-[#dbe6f4] pt-5"
              v-motion-fade-up
            >
              <p class="text-[1.05rem] font-semibold leading-7 text-[#0e2344]">{{ point }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <SectionHeading
          title="Major service areas designed for structured digital delivery."
          description="Each service combines implementation depth with supporting deliverables so clients can move from direction to execution with confidence."
        />

        <div v-if="expertise.length" class="mt-8 grid gap-5 border-y border-[#dbe6f4] py-5 lg:grid-cols-[0.42fr_0.58fr]" v-motion-fade-up>
          <div>
            <label for="service-category" class="brand-meta">Service Category</label>
            <select
              id="service-category"
              v-model="selectedCategory"
              class="mt-3 w-full rounded-lg border border-[#d6e5fb] bg-white px-4 py-3 text-[0.95rem] font-medium text-[#0e2344] outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
            >
              <option v-for="option in categoryOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>

          <div>
            <label for="service-search" class="brand-meta">Search Service</label>
            <input
              id="service-search"
              v-model="searchQuery"
              type="text"
              placeholder="Search service name, capability, or keyword"
              class="mt-3 w-full rounded-lg border border-[#d6e5fb] bg-white px-4 py-3 text-[0.95rem] font-medium text-[#0e2344] outline-none transition placeholder:text-slate-400 focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
            >
          </div>
        </div>

        <div v-if="expertise.length && filteredExpertise.length" class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <NuxtLink
            v-for="service in filteredExpertise"
            :key="service.id"
            :to="`/services/${service.slug}`"
            class="group brand-service-card"
            :aria-label="`Open ${service.name} service detail`"
            v-motion-fade-up
          >
            <img :src="service.icon_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'" :alt="service.name" class="brand-service-card-media">
            <div class="brand-service-card-overlay"></div>
            <div class="brand-service-card-body">
              <h3 class="brand-service-card-title">{{ service.name }}</h3>
            </div>
          </NuxtLink>
        </div>
        <div v-else-if="expertise.length" class="mt-8 brand-soft-panel p-8 text-center">
          <p class="text-[1rem] font-semibold text-[#0e2344]">No services match your filter.</p>
          <p class="mt-2 text-[0.92rem] leading-6 text-slate-600">
            Try another service category or broaden your search keyword.
          </p>
          <button @click="selectedCategory = 'All categories'; searchQuery = ''" class="btn-outline mt-6 inline-flex">
            Clear All Filters
          </button>
        </div>
        <div v-else class="mt-8 brand-soft-panel p-10 text-center">
          <h3 class="text-2xl font-semibold text-[#0e2344]">Our services are being finalized</h3>
          <p class="mt-4 text-slate-600">We are currently updating our service offerings. Please contact us directly for inquiries regarding our technology solutions.</p>
          <NuxtLink to="/#contact" class="btn-primary mt-8 inline-flex">Get in touch</NuxtLink>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <div class="grid gap-7 lg:grid-cols-[0.82fr_1.18fr]">
          <article class="relative isolate overflow-hidden rounded-lg px-6 py-7 text-white shadow-[0_24px_70px_rgba(18,56,122,0.18)] sm:px-8 sm:py-8">
            <img
              :src="servicesHeroImage"
              alt="Havor service capability"
              class="absolute inset-0 h-full w-full object-cover"
            >
            <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,12,24,0.9)_0%,rgba(5,12,24,0.68)_100%)]"></div>
            <div class="relative">
              <h2 class="mt-5 text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-tight tracking-normal">
                Depth across platforms, operations, and long-term digital support.
              </h2>
              <p class="mt-4 text-[0.92rem] leading-7 text-white/80">
                Havor's capabilities extend beyond implementation into the practical details that make digital systems usable, maintainable, and aligned with organizational reality.
              </p>
            </div>
          </article>

          <div class="grid gap-x-7 gap-y-6 md:grid-cols-2">
            <article
              v-for="capability in servicesPage.capabilities.groups"
              :key="capability.title"
              class="border-t border-[#dbe6f4] pt-5"
              v-motion-fade-up
            >
              <h3 class="brand-card-title">{{ capability.title }}</h3>
              <p class="mt-2.5 brand-card-copy">{{ capability.description }}</p>
              <div class="mt-5 flex flex-wrap gap-2">
                <span
                  v-for="tag in capability.tags"
                  :key="tag"
                  class="rounded-full border border-[#d6e5fb] bg-[#f7fbff] px-3 py-2 text-xs font-medium uppercase tracking-normal text-[#31527d]"
                >
                  {{ tag }}
                </span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <PublicImageCta
      :title="servicesPage.cta.title"
      :copy="servicesPage.cta.copy"
      :image="servicesHeroImage"
      image-alt="Service consultation"
      :action-label="servicesPage.cta.button"
      to="/#contact"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'Services | PT Havor Smarta Digital',
  description: 'Explore PT Havor Smarta Digital services across web development, mobile apps, custom software, system integration, UI/UX, IT consulting, and maintenance support.',
  path: '/services'
})

const { servicesPage } = useCorporateContent()
const { expertise, fetchExpertise } = useExpertise()
const { fetchBannerPage, useBannerPage } = useBanners()
const servicesBanner = useBannerPage('services')
const servicesHeroImage = computed(() => servicesBanner.value.media_url || servicesPage.hero.image)
const selectedCategory = ref('All categories')
const searchQuery = ref('')

onMounted(() => {
  fetchExpertise()
  fetchBannerPage('services')
})

const serviceCategoryFor = (service) => {
  const text = `${service.name} ${service.description}`.toLowerCase()

  if (text.includes('mobile') || text.includes('android') || text.includes('ios')) return 'Mobile Apps'
  if (text.includes('ai') || text.includes('intelligent') || text.includes('automation') || text.includes('data')) return 'AI & Data'
  if (text.includes('website') || text.includes('web') || text.includes('cms')) return 'Website & CMS'
  if (text.includes('api') || text.includes('backend') || text.includes('integration') || text.includes('dashboard') || text.includes('enterprise')) return 'Enterprise Systems'

  return 'Digital Solution'
}

const categoryOptions = computed(() => [
  'All categories',
  ...new Set(expertise.value.map(serviceCategoryFor))
])

const filteredExpertise = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return expertise.value.filter((service) => {
    const serviceCategory = serviceCategoryFor(service)
    const matchesCategory = selectedCategory.value === 'All categories' || serviceCategory === selectedCategory.value
    const matchesKeyword =
      !keyword ||
      service.name.toLowerCase().includes(keyword) ||
      service.description.toLowerCase().includes(keyword) ||
      serviceCategory.toLowerCase().includes(keyword)

    return matchesCategory && matchesKeyword
  })
})
</script>
