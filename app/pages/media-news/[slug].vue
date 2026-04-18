<template>
  <div class="space-y-16 pb-8">
    <HeroSection
      :kicker="article?.category || 'News detail'"
      :title="pageTitle"
      :description="pageDescription"
      :image="pageBanner.media_url || articleImage"
      :image-alt="article?.title || 'News detail hero banner'"
    >
      <template #actions>
        <NuxtLink to="/media-news" class="btn-primary">Back to News</NuxtLink>
        <NuxtLink to="/projects" class="btn-outline text-white border-white/20 hover:bg-white/10">See Projects</NuxtLink>
      </template>
    </HeroSection>

    <section class="marketing-section pt-0">
      <div class="marketing-container">
        <div v-if="isLoading" class="marketing-card animate-pulse p-8">
          <div class="h-5 w-24 rounded bg-slate-100"></div>
          <div class="mt-4 h-10 w-3/4 rounded bg-slate-100"></div>
          <div class="mt-4 h-72 rounded bg-slate-100"></div>
        </div>

        <article v-else-if="article" class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="marketing-card overflow-hidden" v-motion-fade-up>
            <img :src="article.image_url || pageBanner.media_url || articleImage" :alt="article.title" class="h-80 w-full object-cover">
            <div class="p-8">
              <div class="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#1846a3]">
                <span>{{ article.category || 'News' }}</span>
                <span>•</span>
                <span>{{ dateLabel }}</span>
                <span>•</span>
                <span>{{ article.readTime }} min read</span>
              </div>
              <h2 class="mt-5 font-display text-3xl font-semibold text-slate-900">{{ article.title }}</h2>
              <div class="prose prose-slate mt-6 max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-a:text-[#1846a3]" v-html="article.content"></div>
            </div>
          </div>

          <aside class="space-y-6" v-motion-fade-up>
            <div class="marketing-card p-6">
              <p class="marketing-kicker">About this story</p>
              <p class="mt-4 text-sm leading-7 text-slate-500">{{ article.excerpt || pageDescription }}</p>
            </div>

            <div class="marketing-card p-6">
              <p class="marketing-kicker">More stories</p>
              <div class="mt-4 space-y-3">
                <NuxtLink
                  v-for="item in relatedArticles"
                  :key="item.slug"
                  :to="`/media-news/${item.slug}`"
                  class="flex items-center justify-between rounded-xl border border-[#d8e1ee] px-4 py-3 transition hover:bg-slate-50"
                >
                  <span class="font-medium text-slate-800">{{ item.title }}</span>
                  <ArrowRight class="h-4 w-4 text-[#1846a3]" />
                </NuxtLink>
              </div>
            </div>
          </aside>
        </article>

        <div v-else class="marketing-card p-8 text-center">
          <h2 class="font-display text-2xl font-semibold text-slate-900">Article not found</h2>
          <p class="mt-3 text-sm text-slate-500">The requested news article is not available.</p>
          <NuxtLink to="/media-news" class="btn-primary mt-6 inline-flex">Back to News</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const { news, fetchNews } = useNews()
const { banners, fetchBanners } = useBanners()
const { apiFetch, resolveAssetUrl } = useApi()
const slug = computed(() => String(route.params.slug || ''))
const article = ref(null)
const isLoading = ref(true)
const articleImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80'

const formatDate = (value) => {
  if (!value) return 'Latest'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
}

const loadArticle = async () => {
  isLoading.value = true
  try {
    const response = await apiFetch(`/news/${slug.value}`)
    article.value = {
      ...response,
      image_url: resolveAssetUrl(response.image_url),
      excerpt: response.excerpt || (response.content || '').replace(/<[^>]*>?/gm, '').slice(0, 160),
      readTime: response.readTime || Math.max(1, Math.ceil(((response.content || '').replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length) / 180))
    }
  } catch {
    await Promise.allSettled([fetchNews(), fetchBanners()])
    article.value = news.value.find((item) => item.slug === slug.value) || null
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await Promise.allSettled([fetchBanners(), loadArticle()])
})

const pageBanner = computed(() => banners.value.find((item) => (item.page_name || '').toLowerCase().includes('media')) || banners.value[0] || {})
const pageTitle = computed(() => article.value?.title ? `${article.value.title} | Media & News | Havor Smarta Digital` : 'News Article | Havor Smarta Digital')
const pageDescription = computed(() => article.value?.excerpt || 'Read the latest Havor Smarta Digital news article and company update.')
const dateLabel = computed(() => formatDate(article.value?.createdAt))

usePageSeo({
  title: pageTitle,
  description: pageDescription,
  path: computed(() => `/media-news/${slug.value}`),
  image: computed(() => pageBanner.value.media_url || articleImage),
  type: 'article'
})

const relatedArticles = computed(() => news.value.filter((item) => item.slug !== slug.value).slice(0, 4))
</script>
