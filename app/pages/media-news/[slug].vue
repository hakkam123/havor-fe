<template>
  <div class="overflow-hidden bg-white">
    <PublicDetailHero
      :image="article?.image_url || fallbackImage"
      :image-alt="article?.title || 'Media and news hero image'"
      label="Media & News"
    />

    <section class="bg-white py-12 sm:py-14">
      <div class="marketing-container">
        <div v-if="article" class="mx-auto max-w-4xl text-center">
          <p class="text-[0.72rem] font-semibold uppercase tracking-normal text-[#1f5dcc]">
            {{ article.category }}
          </p>
          <h1 class="mt-4 text-[clamp(2rem,4.2vw,3.65rem)] font-semibold leading-tight tracking-normal text-[#0e2344]">
            {{ article.title }}
          </h1>
          <div class="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.82rem] font-medium text-slate-500">
            <span v-if="article.createdAt">{{ formatDate(article.createdAt) }}</span>
            <span>{{ article.readTime }} min read</span>
          </div>
        </div>

        <div v-else class="brand-panel p-6 text-center">
          <h1 class="text-3xl font-semibold tracking-normal text-[#0e2344]">Article not found</h1>
          <p class="mt-3 text-sm leading-7 text-slate-600">The article you requested is not available in the current media library.</p>
          <NuxtLink to="/media-news" class="btn-primary mt-6 inline-flex">Back to Media & News</NuxtLink>
        </div>
      </div>
    </section>

    <section v-if="article" class="border-t border-[#dbe6f4] bg-white py-12">
      <div class="marketing-container">
        <div class="grid gap-10 lg:grid-cols-[4rem_minmax(0,1fr)_18rem]">
          <aside class="hidden lg:block" v-motion-fade-up>
            <div class="sticky top-28">
              <p class="brand-meta">Share</p>
              <div class="mt-4 flex flex-col gap-3">
                <a
                  v-for="item in shareLinks"
                  :key="item.label"
                  :href="item.href"
                  class="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe6f4] text-[#0e2344] transition hover:border-[#1f5dcc] hover:text-[#1f5dcc]"
                  :aria-label="item.label"
                >
                  <component :is="item.icon" class="h-4 w-4" />
                </a>
              </div>
            </div>
          </aside>

          <article class="min-w-0" v-motion-fade-up>
            <div class="detail-content" v-html="sanitizeHtml(article.content)"></div>
          </article>

          <aside class="space-y-8" v-motion-fade-up>
            <div>
              <h2 class="text-[1.3rem] font-semibold text-[#0e2344]">Category</h2>
              <div class="mt-3 h-0.5 w-8 bg-[#1f5dcc]"></div>
              <div class="mt-6 space-y-4">
                <NuxtLink
                  v-for="item in categoryCards"
                  :key="item.category"
                  :to="`/media-news/${item.slug}`"
                  class="group relative block min-h-28 overflow-hidden rounded-lg bg-[#071529]"
                >
                  <img :src="item.image_url" :alt="item.category" class="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-[1.04]">
                  <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,21,41,0.22)_0%,rgba(7,21,41,0.86)_100%)]"></div>
                  <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white">
                    <span class="text-[0.74rem] font-semibold uppercase tracking-normal">{{ item.category }}</span>
                    <ArrowUpRight class="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </NuxtLink>
              </div>
            </div>

            <div class="rounded-lg bg-[#0d3b91] p-5 text-white">
              <p class="text-[0.75rem] font-medium uppercase tracking-normal text-white/70">Havor Insight</p>
              <h3 class="mt-3 text-lg font-semibold leading-tight">Explore digital delivery perspectives from Havor.</h3>
              <NuxtLink to="/media-news" class="mt-5 inline-flex text-sm font-medium text-white/88 hover:text-white">
                View all updates
              </NuxtLink>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section v-if="article && relatedArticles.length" class="border-t border-[#dbe6f4] bg-white py-12 sm:py-14">
      <div class="marketing-container">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 class="border-l-2 border-[#1f5dcc] pl-5 text-[clamp(1.65rem,3vw,2.4rem)] font-semibold text-[#0e2344]">
            Related News
          </h2>
          <NuxtLink to="/media-news" class="btn-outline">View All</NuxtLink>
        </div>

        <div class="mt-8 grid gap-5 md:grid-cols-3">
          <NuxtLink
            v-for="item in relatedArticles"
            :key="item.slug"
            :to="`/media-news/${item.slug}`"
            class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(18,56,122,0.1)]"
            v-motion-fade-up
          >
            <img :src="item.image_url" :alt="item.title" class="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]">
            <div class="p-4">
              <p class="brand-meta text-[#1f5dcc]">{{ item.category }}</p>
              <h3 class="mt-2 line-clamp-2 text-[1.02rem] font-semibold leading-snug text-[#0e2344]">{{ item.title }}</h3>
              <p v-if="item.createdAt" class="mt-3 text-xs font-medium text-slate-500">{{ formatDate(item.createdAt) }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ArrowUpRight, Link as LinkIcon, Mail, Share2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const defaultFallbackImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80'

const { news, fetchNews, error } = useNews()
const { fetchBannerPage, useBannerPage } = useBanners()
const mediaBanner = useBannerPage('media-news', 'news')
const fallbackImage = computed(() => mediaBanner.value.media_url || defaultFallbackImage)

onMounted(async () => {
  await Promise.allSettled([fetchNews(), fetchBannerPage('media-news')])

  if (!error.value && !article.value) {
    showError({
      statusCode: 404,
      statusMessage: 'Article not found'
    })
  }
})

const article = computed(() => news.value.find((item) => item.slug === slug.value) || null)
const relatedArticles = computed(() => news.value.filter((item) => item.slug !== slug.value).slice(0, 3))
const categoryCards = computed(() => {
  const categoryMap = new Map<string, typeof news.value[number]>()

  news.value.forEach((item) => {
    if (!categoryMap.has(item.category)) categoryMap.set(item.category, item)
  })

  return [...categoryMap.values()].slice(0, 4)
})
const currentUrl = computed(() => `/media-news/${slug.value}`)
const shareLinks = computed(() => [
  { label: 'Share page', href: currentUrl.value, icon: Share2 },
  { label: 'Copy article link', href: currentUrl.value, icon: LinkIcon },
  { label: 'Share by email', href: `mailto:?subject=${encodeURIComponent(article.value?.title || 'Havor article')}&body=${encodeURIComponent(currentUrl.value)}`, icon: Mail }
])
const formatDate = (value: string) => new Date(value).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
})

usePageSeo({
  title: computed(() => article.value ? `${article.value.title} | Media & News | PT Havor SMART Digital` : 'Media & News Detail | PT Havor SMART Digital'),
  description: computed(() => article.value?.excerpt || 'Read updates and insight articles from PT Havor SMART Digital.'),
  path: computed(() => `/media-news/${slug.value}`),
  image: computed(() => article.value?.image_url || fallbackImage.value),
  type: 'article'
})
</script>
