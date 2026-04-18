<template>
  <div class="space-y-16 pb-8">
    <HeroSection
      kicker="Media Room"
      title="Latest insights, announcements, and product stories."
      description="Follow our latest updates on technology trends, delivery practices, and company milestones."
      :image="pageBanner.media_url || defaultHeroImage"
      image-alt="Media news hero banner"
    >
      <template #actions>
        <NuxtLink to="/projects" class="btn-primary">See Projects</NuxtLink>
        <NuxtLink to="/about-us" class="btn-outline text-white border-white/20 hover:bg-white/10">About Havor</NuxtLink>
      </template>
    </HeroSection>

    <section class="marketing-section pt-0">
      <div class="marketing-container">
        <div class="flex flex-col gap-8">
          <div>
            <p class="marketing-kicker">News Feed</p>
            <h2 class="marketing-title max-w-2xl">Thought leadership and announcements from the team.</h2>
          </div>

          <ListingToolbar
            :search-value="searchQuery"
            @update:search="searchQuery = $event"
            @reset="searchQuery = ''"
            :result-count="filteredArticles.length"
          />
        </div>

        <div class="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <MediaCard
            v-for="item in filteredArticles"
            :key="item.slug"
            :to="`/media-news/${item.slug}`"
            :title="item.title"
            :summary="item.summary"
            :image="item.image"
            :image-alt="item.title"
            :category="item.category"
            :meta="`${item.dateLabel} · ${item.readTime} min read`"
            cta-label="Read article"
            v-motion-fade-up
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'Media & News | Havor Smarta Digital',
  description: 'Read the latest Havor Smarta Digital updates, industry insights, and product stories from our team.',
  path: '/media-news'
})

const { news, fetchNews } = useNews()
const { banners, fetchBanners } = useBanners()
const searchQuery = ref('')

const defaultHeroImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80'

onMounted(async () => {
  await Promise.allSettled([fetchNews(), fetchBanners()])
})

const fallbackArticles = [
  {
    category: 'Company',
    title: 'Havor launches enterprise modernization studio',
    summary: 'A dedicated unit helping legacy-heavy organizations modernize in incremental, low-risk phases.',
    slug: 'havor-launches-enterprise-modernization-studio',
    dateLabel: 'Apr 18, 2026',
    readTime: 4,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'Technology',
    title: 'Designing resilient cloud architecture for regulated sectors',
    summary: 'How to improve deployment speed while preserving compliance, observability, and reliability.',
    slug: 'designing-resilient-cloud-architecture-for-regulated-sectors',
    dateLabel: 'Apr 14, 2026',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'Engineering',
    title: 'From monolith to modular platforms: a practical migration playbook',
    summary: 'A proven path for decomposing systems while keeping product delivery and business continuity stable.',
    slug: 'from-monolith-to-modular-platforms-a-practical-migration-playbook',
    dateLabel: 'Apr 09, 2026',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80'
  }
]

const pageBanner = computed(() => {
  return banners.value.find((item) => (item.page_name || '').toLowerCase().includes('media')) || banners.value[0] || {}
})

const articlesData = computed(() => {
  if (!news.value.length) return fallbackArticles

  return news.value.map((item, index) => ({
    category: item.category || 'News',
    title: item.title,
    summary: item.excerpt || (item.content || '').replace(/<[^>]*>?/gm, '').slice(0, 120) || 'Read the latest update from our team.',
    slug: item.slug || toSlug(item.title),
    readTime: item.readTime || 3,
    dateLabel: item.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(item.createdAt)) : 'Latest',
    image: item.image_url || fallbackArticles[index % fallbackArticles.length].image
  }))
})

const filteredArticles = computed(() => {
  if (!searchQuery.value) return articlesData.value

  const query = searchQuery.value.toLowerCase()
  return articlesData.value.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
  )
})
</script>
