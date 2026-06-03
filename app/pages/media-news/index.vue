<template>
  <div class="overflow-hidden bg-white">
    <CorporatePageHero
      :title="mediaBanner.title || mediaPage.hero.title"
      :subtitle="mediaBanner.subtitle || mediaPage.hero.subtitle"
      :image="mediaHeroImage"
      hero-size="half"
    >
    </CorporatePageHero>

    <div v-if="news.length">
      <section class="brand-section pt-12">
        <div class="marketing-container">
          <SectionHeading
            title="Information Categories"
            description="Browse Havor updates by category or search specific topics from the media and news archive."
          />

          <div class="mt-8 grid gap-5 border-y border-[#dbe6f4] py-5 lg:grid-cols-[0.42fr_0.58fr]" v-motion-fade-up>
            <div>
              <label for="news-category" class="brand-meta">News Category</label>
              <select
                id="news-category"
                v-model="selectedCategory"
                class="mt-3 w-full rounded-lg border border-[#d6e5fb] bg-white px-4 py-3 text-[0.95rem] font-medium text-[#0e2344] outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
              >
                <option v-for="option in categoryOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>

            <div>
              <label for="news-search" class="brand-meta">Search Information</label>
              <input
                id="news-search"
                v-model="searchQuery"
                type="text"
                placeholder="Search title, category, or article summary"
                class="mt-3 w-full rounded-lg border border-[#d6e5fb] bg-white px-4 py-3 text-[0.95rem] font-medium text-[#0e2344] outline-none transition placeholder:text-slate-400 focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
              >
            </div>
          </div>
        </div>
      </section>

      <template v-if="filteredNews.length">
        <section class="brand-section pt-0">
          <div class="marketing-container">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="border-l-2 border-[#1f5dcc] pl-5">
              <h2 class="text-[clamp(2rem,3vw,3rem)] font-semibold tracking-normal text-[#0e2344]">Press Release</h2>
              <p class="mt-2 max-w-3xl text-base leading-8 text-slate-600">
                Official announcements, company initiatives, and institutional updates from PT Havor SMART Digital.
              </p>
            </div>
          </div>

          <div v-if="featuredPressRelease" class="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <NuxtLink
              :to="`/media-news/${featuredPressRelease.slug}`"
              class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]"
              v-motion-fade-up
            >
              <img
                :src="featuredPressRelease.image_url"
                :alt="featuredPressRelease.title"
                class="h-[18rem] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              >
              <div class="p-5">
                <p class="text-[0.72rem] font-medium uppercase tracking-normal text-[#1f5dcc]">{{ featuredPressRelease.category }}</p>
                <h3 class="mt-3 text-[clamp(1.35rem,2.5vw,2.1rem)] font-semibold leading-tight tracking-normal text-[#0e2344]">
                  {{ featuredPressRelease.title }}
                </h3>
                <p class="mt-3 line-clamp-3 text-[0.86rem] leading-6 text-slate-600">{{ featuredPressRelease.excerpt }}</p>
                <p v-if="featuredPressRelease.createdAt" class="mt-4 text-sm font-normal text-slate-500">{{ new Date(featuredPressRelease.createdAt).toLocaleDateString() }}</p>
                <span class="btn-outline mt-5 inline-flex">Read More</span>
              </div>
            </NuxtLink>

            <div class="space-y-0 border-t border-[#dbe6f4]">
              <NuxtLink
                v-for="article in pressSidebar"
                :key="article.slug"
                :to="`/media-news/${article.slug}`"
                class="grid gap-4 border-b border-[#dbe6f4] py-4 transition hover:bg-[#f7fbff] sm:grid-cols-[8.5rem_1fr]"
                v-motion-fade-up
              >
                <img :src="article.image_url" :alt="article.title" class="h-28 w-full rounded-lg object-cover sm:h-full">
                <div class="py-1">
                  <p class="text-[0.68rem] font-medium uppercase tracking-normal text-[#1f5dcc]">{{ article.category }}</p>
                  <h4 class="mt-2 line-clamp-2 text-[1rem] font-semibold leading-tight tracking-normal text-[#0e2344]">{{ article.title }}</h4>
                  <p class="mt-2 line-clamp-2 text-[0.84rem] leading-6 text-slate-600">{{ article.excerpt }}</p>
                  <p v-if="article.createdAt" class="mt-3 text-xs font-normal uppercase tracking-normal text-[#7b8faa]">{{ new Date(article.createdAt).toLocaleDateString() }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>
          </div>
        </section>

        <section class="brand-section pt-0">
          <div class="marketing-container">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="border-l-2 border-[#1f5dcc] pl-5">
              <h2 class="text-[clamp(2rem,3vw,3rem)] font-semibold tracking-normal text-[#0e2344]">News</h2>
              <p class="mt-2 max-w-3xl text-base leading-8 text-slate-600">
                Updates, industry perspectives, and operational insights that reflect how digital delivery evolves in practice.
              </p>
            </div>
          </div>

          <div class="mt-8 grid gap-6 lg:grid-cols-2">
            <div
              v-for="(column, columnIndex) in newsColumns"
              :key="`news-column-${columnIndex}`"
              class="space-y-6"
            >
              <NuxtLink
                :to="`/media-news/${column[0].slug}`"
                class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]"
                v-motion-fade-up
              >
                <img
                  :src="column[0].image_url"
                  :alt="column[0].title"
                  class="h-60 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                >
                <div class="p-5">
                  <p class="brand-meta">{{ column[0].category }}</p>
                  <h3 class="mt-3 line-clamp-2 text-[clamp(1.25rem,2.2vw,1.85rem)] font-semibold leading-tight tracking-normal text-[#0e2344]">
                    {{ column[0].title }}
                  </h3>
                  <p class="mt-3 line-clamp-3 text-[0.86rem] leading-6 text-slate-600">{{ column[0].excerpt }}</p>
                  <p v-if="column[0].createdAt" class="mt-4 text-sm font-normal text-slate-500">{{ new Date(column[0].createdAt).toLocaleDateString() }}</p>
                  <span
                    class="btn-outline mt-5 inline-flex"
                  >
                    Read More
                  </span>
                </div>
              </NuxtLink>

              <div class="space-y-0 border-t border-[#dbe6f4]">
                <NuxtLink
                  v-for="item in column.slice(1)"
                  :key="item.slug"
                  :to="`/media-news/${item.slug}`"
                  class="grid gap-4 border-b border-[#dbe6f4] py-4 transition hover:bg-[#f7fbff] sm:grid-cols-[7.5rem_1fr]"
                  v-motion-fade-up
                >
                  <img :src="item.image_url" :alt="item.title" class="h-24 w-full rounded-lg object-cover sm:h-full">
                  <div>
                    <p class="brand-meta">{{ item.category }}</p>
                    <h4 class="mt-2 line-clamp-2 text-[0.96rem] font-semibold leading-tight tracking-normal text-[#0e2344]">{{ item.title }}</h4>
                    <p v-if="item.createdAt" class="mt-2.5 text-[0.88rem] leading-6 text-slate-600">{{ new Date(item.createdAt).toLocaleDateString() }}</p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
          <div v-if="canShowMoreNews" class="mt-6 flex justify-center">
            <button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe6f4] bg-white text-[#1f5dcc] shadow-sm transition hover:border-[#1f5dcc] hover:bg-[#edf4ff]" aria-label="Show more media updates" @click="showMoreNews">
              <ChevronDown class="h-5 w-5" />
            </button>
          </div>
          </div>
        </section>
      </template>

      <section v-else class="brand-section pt-0">
        <div class="marketing-container">
          <div class="brand-soft-panel p-8 text-center">
            <p class="text-[1rem] font-semibold text-[#0e2344]">No media updates match your filter.</p>
            <p class="mt-2 text-[0.92rem] leading-6 text-slate-600">
              Try another category or broaden your search keyword.
            </p>
            <button @click="selectedCategory = 'All categories'; searchQuery = ''" class="btn-outline mt-6 inline-flex">
              Clear All Filters
            </button>
          </div>
        </div>
      </section>
    </div>
    <div v-else class="brand-section py-16">
      <div class="marketing-container">
        <div class="brand-soft-panel p-10 text-center">
          <h3 class="text-2xl font-semibold text-[#0e2344]">No news or media updates found</h3>
          <p class="mt-4 text-slate-600">We are currently gathering our latest stories and press releases. Please check back later for updates from PT Havor SMART Digital.</p>
        </div>
      </div>
    </div>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="border-l-2 border-[#1f5dcc] pl-5">
            <h2 class="text-[clamp(2rem,3vw,3rem)] font-semibold tracking-normal text-[#0e2344]">Company Campaign</h2>
            <p class="mt-2 max-w-3xl text-base leading-8 text-slate-600">
              Featured initiatives and practical technology programs from PT Havor SMART Digital.
            </p>
          </div>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="campaign in campaignItems"
            :key="campaign.title"
            to="/contact"
            class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(18,56,122,0.1)]"
            :aria-label="`Discuss campaign: ${campaign.title}`"
            v-motion-fade-up
          >
            <img :src="campaign.image" :alt="campaign.title" class="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]">
            <div class="p-4">
              <p class="brand-meta">{{ campaign.category }}</p>
              <h3 class="mt-2 line-clamp-2 text-[1.02rem] font-semibold leading-snug text-[#0e2344]">{{ campaign.title }}</h3>
              <p class="mt-2 line-clamp-2 text-[0.84rem] leading-6 text-slate-600">{{ campaign.excerpt }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <PublicImageCta
      :title="mediaPage.cta.title"
      :copy="mediaPage.cta.copy"
      :image="mediaHeroImage"
      image-alt="Havor media updates"
      action-label="Stay Updated"
      :href="`mailto:${company.email}?subject=${encodeURIComponent('Stay Updated With Havor')}`"
    />
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'Media & News | PT Havor SMART Digital',
  description: 'Read PT Havor SMART Digital press releases, news updates, and industry perspectives in a structured editorial layout.',
  path: '/media-news'
})

const { company, mediaPage } = useCorporateContent()
const { news, fetchNews } = useNews()
const { campaigns, fetchCampaigns } = useCampaigns()
const { fetchBannerPage, useBannerPage } = useBanners()
const mediaBanner = useBannerPage('media-news', 'news')
const mediaHeroImage = computed(() => mediaBanner.value.media_url || mediaPage.hero.image)
const selectedCategory = ref('All categories')
const searchQuery = ref('')
const visibleNewsCount = ref(7)

onMounted(() => {
  fetchNews()
  fetchCampaigns()
  fetchBannerPage('media-news')
})

const featuredPressRelease = computed(() => {
  const press = visibleNews.value.filter(item => item.category.toLowerCase().includes('press') || item.category.toLowerCase().includes('release'))
  return press.length ? press[0] : visibleNews.value[0] || null
})
const pressSidebar = computed(() => {
  const press = visibleNews.value.filter(item => item.category.toLowerCase().includes('press') || item.category.toLowerCase().includes('release'))
  return press.length ? press.slice(1, 5) : visibleNews.value.slice(1, 5)
})
const newsColumns = computed(() => {
  const other = visibleNews.value.filter(item => !item.category.toLowerCase().includes('press') && !item.category.toLowerCase().includes('release'))
  const source = other.length ? other : visibleNews.value.slice(5)
  return [
    source.slice(0, 3),
    source.slice(3, 6)
  ].filter((column) => column.length)
})
const categoryOptions = computed(() => [
  'All categories',
  ...new Set(news.value.map((item) => item.category).filter(Boolean))
])
const filteredNews = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return news.value.filter((item) => {
    const matchesCategory = selectedCategory.value === 'All categories' || item.category === selectedCategory.value
    const matchesKeyword =
      !keyword ||
      item.title.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword) ||
      item.excerpt.toLowerCase().includes(keyword)

    return matchesCategory && matchesKeyword
  })
})
const visibleNews = computed(() => filteredNews.value.slice(0, visibleNewsCount.value))
const canShowMoreNews = computed(() => filteredNews.value.length > visibleNews.value.length)
const showMoreNews = () => {
  visibleNewsCount.value += 6
}
const fallbackCampaignItems = computed(() => [
  {
    category: 'Digital Readiness',
    title: 'Operational Assessment for Growing Teams',
    excerpt: 'A focused campaign to map workflow gaps, clarify priorities, and prepare practical implementation steps.',
    image: mediaHeroImage.value
  },
  {
    category: 'Implementation Support',
    title: 'Build, Improve, and Maintain Core Systems',
    excerpt: 'Support for companies that need dependable execution across web platforms, internal tools, and integrations.',
    image: mediaHeroImage.value
  },
  {
    category: 'Long-Term Partnership',
    title: 'Technology Care for Business Continuity',
    excerpt: 'A structured support model for monitoring, iteration, and ongoing improvement after launch.',
    image: mediaHeroImage.value
  }
])
const campaignItems = computed(() => {
  if (!campaigns.value.length) return fallbackCampaignItems.value

  return campaigns.value.slice(0, 3).map((campaign, index) => ({
    category: campaign.category,
    title: campaign.title,
    excerpt: campaign.excerpt,
    image: campaign.image_url || fallbackCampaignItems.value[index]?.image || mediaHeroImage.value
  }))
})

watch([selectedCategory, searchQuery], () => {
  visibleNewsCount.value = 7
})
</script>
