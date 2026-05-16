<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      :title="article?.title || 'Media & News Detail'"
      :subtitle="article?.excerpt || 'Read the full story, context, and perspective from PT Havor SMART Digital.'"
      :image="article?.image_url || fallbackImage"
    >
      <template #actions>
        <NuxtLink to="/media-news" class="btn-primary">Back to Media & News</NuxtLink>
        <NuxtLink to="/projects" class="btn-outline">See Projects</NuxtLink>
      </template>
    </CorporatePageHero>

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <div v-if="article" class="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <article class="overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]" v-motion-fade-up>
            <img :src="article.image_url" :alt="article.title" class="h-80 w-full object-cover">
            <div class="p-7 sm:p-8">
              <div class="flex flex-wrap items-center gap-3">
                <span class="brand-chip">{{ article.category }}</span>
                <span v-if="article.createdAt" class="brand-chip">{{ new Date(article.createdAt).toLocaleDateString() }}</span>
                <span class="brand-chip">{{ article.readTime }} min read</span>
              </div>

              <h2 class="mt-6 text-[clamp(2.2rem,4vw,3.7rem)] font-bold leading-tight tracking-normal text-[#0e2344]">
                {{ article.title }}
              </h2>
              <div class="mt-8 prose max-w-none text-sm leading-8 text-slate-600" v-html="article.content"></div>
            </div>
          </article>

          <aside class="space-y-6" v-motion-fade-up>
            <div class="brand-soft-panel p-6">
              <p class="brand-meta">Article Tags</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in article.tags"
                  :key="tag"
                  class="rounded-lg border border-[#d6e5fb] bg-white px-3 py-2 text-xs font-bold uppercase tracking-normal text-[#31527d]"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="brand-panel p-6">
              <p class="brand-meta">More Stories</p>
              <div class="mt-4 space-y-3">
                <NuxtLink
                  v-for="item in relatedArticles"
                  :key="item.slug"
                  :to="`/media-news/${item.slug}`"
                  class="flex items-center justify-between rounded-lg border border-[#dbe6f4] px-4 py-3 transition hover:bg-[#f7fbff]"
                >
                  <span class="font-bold text-[#0e2344]">{{ item.title }}</span>
                  <span class="text-sm font-bold text-[#1f5dcc]">Open</span>
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>

        <div v-else class="brand-panel p-8 text-center">
          <h2 class="text-3xl font-bold tracking-normal text-[#0e2344]">Article not found</h2>
          <p class="mt-3 text-sm leading-7 text-slate-600">The article you requested is not available in the current media library.</p>
          <NuxtLink to="/media-news" class="btn-primary mt-6 inline-flex">Back to Media & News</NuxtLink>
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
const fallbackImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80'

const { news, fetchNews } = useNews()
onMounted(() => {
  fetchNews()
})

const article = computed(() => news.value.find((item) => item.slug === slug.value) || null)
const relatedArticles = computed(() => news.value.filter((item) => item.slug !== slug.value).slice(0, 3))

usePageSeo({
  title: computed(() => article.value ? `${article.value.title} | Media & News | PT Havor SMART Digital` : 'Media & News Detail | PT Havor SMART Digital'),
  description: computed(() => article.value?.excerpt || 'Read updates and insight articles from PT Havor SMART Digital.'),
  path: computed(() => `/media-news/${slug.value}`),
  image: computed(() => article.value?.image_url || fallbackImage),
  type: 'article'
})
</script>
