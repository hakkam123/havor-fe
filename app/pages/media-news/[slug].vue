<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      :title="article?.title || 'Media & News Detail'"
      :subtitle="article?.summary || 'Read the full story, context, and perspective from PT Havor SMART Digital.'"
      :image="article?.image || fallbackImage"
    >
      <template #actions>
        <NuxtLink to="/media-news" class="btn-primary">Back to Media & News</NuxtLink>
        <NuxtLink to="/projects" class="btn-outline">See Projects</NuxtLink>
      </template>
    </CorporatePageHero>

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <div v-if="article" class="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <article class="overflow-hidden rounded-[2rem] border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]" v-motion-fade-up>
            <img :src="article.image" :alt="article.title" class="h-80 w-full object-cover">
            <div class="p-7 sm:p-8">
              <div class="flex flex-wrap items-center gap-3">
                <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ article.category }}</span>
                <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ article.date }}</span>
                <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ article.readTime }} min read</span>
              </div>

              <h2 class="mt-6 text-[clamp(2.2rem,4vw,3.7rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0e2344]">
                {{ article.title }}
              </h2>
              <p class="mt-5 text-base leading-8 text-slate-600">
                {{ article.overview }}
              </p>

              <div class="mt-8 space-y-5">
                <p
                  v-for="paragraph in article.body"
                  :key="paragraph"
                  class="text-sm leading-8 text-slate-600"
                >
                  {{ paragraph }}
                </p>
              </div>
            </div>
          </article>

          <aside class="space-y-6" v-motion-fade-up>
            <div class="brand-soft-panel p-6">
              <p class="brand-meta">Article Tags</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in article.tags"
                  :key="tag"
                  class="rounded-full border border-[#d6e5fb] bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#31527d]"
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
                  class="flex items-center justify-between rounded-[1.2rem] border border-[#dbe6f4] px-4 py-3 transition hover:bg-[#f7fbff]"
                >
                  <span class="font-bold text-[#0e2344]">{{ item.title }}</span>
                  <span class="text-sm font-extrabold text-[#1f5dcc]">Open</span>
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>

        <div v-else class="brand-panel p-8 text-center">
          <h2 class="text-3xl font-extrabold tracking-[-0.04em] text-[#0e2344]">Article not found</h2>
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

const { mediaArticles, getMediaArticleBySlug } = useCorporateRoutes()

const article = computed(() => getMediaArticleBySlug(slug.value))
const relatedArticles = computed(() => mediaArticles.value.filter((item) => item.slug !== slug.value).slice(0, 3))

usePageSeo({
  title: computed(() => article.value ? `${article.value.title} | Media & News | PT Havor SMART Digital` : 'Media & News Detail | PT Havor SMART Digital'),
  description: computed(() => article.value?.summary || 'Read updates and insight articles from PT Havor SMART Digital.'),
  path: computed(() => `/media-news/${slug.value}`),
  image: computed(() => article.value?.image || fallbackImage),
  type: 'article'
})
</script>
