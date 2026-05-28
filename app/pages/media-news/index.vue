<template>
  <div class="overflow-hidden">
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
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="border-l-2 border-[#1f5dcc] pl-5">
              <h2 class="text-[clamp(2rem,3vw,3rem)] font-semibold tracking-normal text-[#0e2344]">Press Release</h2>
              <p class="mt-2 max-w-3xl text-base leading-8 text-slate-600">
                Official announcements, company initiatives, and institutional updates from PT Havor SMART Digital.
              </p>
            </div>
          </div>

          <div v-if="featuredPressRelease" class="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <NuxtLink
              :to="`/media-news/${featuredPressRelease.slug}`"
              class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]"
              v-motion-fade-up
            >
              <img
                :src="featuredPressRelease.image_url"
                :alt="featuredPressRelease.title"
                class="h-[24rem] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              >
              <div class="p-6 sm:p-7">
                <p class="text-[0.72rem] font-medium uppercase tracking-normal text-[#1f5dcc]">{{ featuredPressRelease.category }}</p>
                <h3 class="mt-3 text-[clamp(1.75rem,3vw,2.8rem)] font-semibold leading-[1.06] tracking-normal text-[#0e2344]">
                  {{ featuredPressRelease.title }}
                </h3>
                <p class="mt-3 text-[0.92rem] leading-7 text-slate-600">{{ featuredPressRelease.excerpt }}</p>
                <p v-if="featuredPressRelease.createdAt" class="mt-4 text-sm font-normal text-slate-500">{{ new Date(featuredPressRelease.createdAt).toLocaleDateString() }}</p>
                <span class="btn-outline mt-5 inline-flex">Read More</span>
              </div>
            </NuxtLink>

            <div class="space-y-0 border-t border-[#dbe6f4]">
              <NuxtLink
                v-for="article in pressSidebar"
                :key="article.slug"
                :to="`/media-news/${article.slug}`"
                class="grid gap-4 border-b border-[#dbe6f4] py-5 transition hover:bg-[#f7fbff] sm:grid-cols-[10rem_1fr]"
                v-motion-fade-up
              >
                <img :src="article.image_url" :alt="article.title" class="h-32 w-full rounded-lg object-cover sm:h-full">
                <div class="py-1">
                  <p class="text-[0.68rem] font-medium uppercase tracking-normal text-[#1f5dcc]">{{ article.category }}</p>
                  <h4 class="mt-2.5 text-[1.2rem] font-semibold leading-tight tracking-normal text-[#0e2344]">{{ article.title }}</h4>
                  <p class="mt-2.5 text-[0.9rem] leading-6 text-slate-600">{{ article.excerpt }}</p>
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

          <div class="mt-10 grid gap-8 lg:grid-cols-2">
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
                  class="h-80 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                >
                <div class="p-6 sm:p-7">
                  <p class="brand-meta">{{ column[0].category }}</p>
                  <h3 class="mt-3 text-[clamp(1.55rem,2.6vw,2.35rem)] font-semibold leading-[1.08] tracking-normal text-[#0e2344]">
                    {{ column[0].title }}
                  </h3>
                  <p class="mt-3 text-[0.92rem] leading-7 text-slate-600">{{ column[0].excerpt }}</p>
                  <p v-if="column[0].createdAt" class="mt-4 text-sm font-normal text-slate-500">{{ new Date(column[0].createdAt).toLocaleDateString() }}</p>
                  <span
                    class="mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
                    :class="columnIndex === 0 ? 'bg-[#1f5dcc] text-white shadow-[0_16px_32px_rgba(31,93,204,0.24)]' : 'border border-[#dbe6f4] bg-white text-[#123771]'"
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
                  class="grid gap-4 border-b border-[#dbe6f4] py-5 transition hover:bg-[#f7fbff] sm:grid-cols-[8rem_1fr]"
                  v-motion-fade-up
                >
                  <img :src="item.image_url" :alt="item.title" class="h-28 w-full rounded-lg object-cover sm:h-full">
                  <div>
                    <p class="brand-meta">{{ item.category }}</p>
                    <h4 class="mt-2.5 text-[1.05rem] font-semibold leading-tight tracking-normal text-[#0e2344]">{{ item.title }}</h4>
                    <p v-if="item.createdAt" class="mt-2.5 text-[0.88rem] leading-6 text-slate-600">{{ new Date(item.createdAt).toLocaleDateString() }}</p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div v-else class="brand-section py-24">
      <div class="marketing-container">
        <div class="brand-soft-panel p-20 text-center">
          <h3 class="text-2xl font-semibold text-[#0e2344]">No news or media updates found</h3>
          <p class="mt-4 text-slate-600">We are currently gathering our latest stories and press releases. Please check back later for updates from PT Havor SMART Digital.</p>
        </div>
      </div>
    </div>

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
const { fetchBannerPage, useBannerPage } = useBanners()
const mediaBanner = useBannerPage('media-news', 'news')
const mediaHeroImage = computed(() => mediaBanner.value.media_url || mediaPage.hero.image)

onMounted(() => {
  fetchNews()
  fetchBannerPage('media-news')
})

const featuredPressRelease = computed(() => {
  const press = news.value.filter(item => item.category.toLowerCase().includes('press') || item.category.toLowerCase().includes('release'))
  return press.length ? press[0] : news.value[0] || null
})
const pressSidebar = computed(() => {
  const press = news.value.filter(item => item.category.toLowerCase().includes('press') || item.category.toLowerCase().includes('release'))
  return press.length ? press.slice(1, 5) : news.value.slice(1, 5)
})
const newsColumns = computed(() => {
  const other = news.value.filter(item => !item.category.toLowerCase().includes('press') && !item.category.toLowerCase().includes('release'))
  const source = other.length ? other : news.value.slice(5)
  return [
    source.slice(0, 3),
    source.slice(3, 6)
  ].filter((column) => column.length)
})
</script>
