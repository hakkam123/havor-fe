<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      :title="mediaPage.hero.title"
      :subtitle="mediaPage.hero.subtitle"
      :image="mediaPage.hero.image"
    >
      <template #actions>
        <NuxtLink to="/projects" class="btn-primary">View Projects</NuxtLink>
        <a :href="`mailto:${company.email}?subject=${encodeURIComponent('Media Inquiry')}`" class="btn-outline">Contact The Team</a>
      </template>
    </CorporatePageHero>

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="border-l-2 border-[#ff4d4f] pl-5">
            <h2 class="text-[clamp(2rem,3vw,3rem)] font-extrabold tracking-[-0.04em] text-[#0e2344]">Press Release</h2>
            <p class="mt-2 max-w-3xl text-base leading-8 text-slate-600">
              Official announcements, company initiatives, and institutional updates from PT Havor SMART Digital.
            </p>
          </div>
          <NuxtLink to="/media-news" class="btn-outline">Learn More</NuxtLink>
        </div>

        <div v-if="featuredPressRelease" class="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <NuxtLink
            :to="`/media-news/${featuredPressRelease.slug}`"
            class="group overflow-hidden rounded-[2rem] border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]"
            v-motion-fade-up
          >
            <img
              :src="featuredPressRelease.image"
              :alt="featuredPressRelease.title"
              class="h-[24rem] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            >
            <div class="p-7 sm:p-8">
              <p class="text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[#ff4d4f]">Press Release</p>
              <h3 class="mt-4 text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0e2344]">
                {{ featuredPressRelease.title }}
              </h3>
              <p class="mt-4 text-sm leading-8 text-slate-600">{{ featuredPressRelease.summary }}</p>
              <p class="mt-5 text-sm font-semibold text-slate-500">{{ featuredPressRelease.date }}</p>
              <span class="btn-outline mt-6 inline-flex">Read More</span>
            </div>
          </NuxtLink>

          <div class="space-y-4">
            <NuxtLink
              v-for="article in pressSidebar"
              :key="article.slug"
              :to="`/media-news/${article.slug}`"
              class="grid gap-4 rounded-[1.75rem] border border-[#dbe6f4] bg-white p-4 shadow-[0_14px_40px_rgba(18,56,122,0.08)] sm:grid-cols-[11rem_1fr]"
              v-motion-fade-up
            >
              <img :src="article.image" :alt="article.title" class="h-32 w-full rounded-[1.25rem] object-cover sm:h-full">
              <div class="py-1">
                <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#ff4d4f]">Press Release</p>
                <h4 class="mt-3 text-xl font-extrabold leading-tight tracking-[-0.03em] text-[#0e2344]">{{ article.title }}</h4>
                <p class="mt-3 text-sm leading-7 text-slate-600">{{ article.summary }}</p>
                <p class="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#7b8faa]">{{ article.date }}</p>
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
            <h2 class="text-[clamp(2rem,3vw,3rem)] font-extrabold tracking-[-0.04em] text-[#0e2344]">News</h2>
            <p class="mt-2 max-w-3xl text-base leading-8 text-slate-600">
              Updates, industry perspectives, and operational insights that reflect how digital delivery evolves in practice.
            </p>
          </div>
          <NuxtLink to="/media-news" class="btn-outline">Browse News</NuxtLink>
        </div>

        <div class="mt-10 grid gap-8 lg:grid-cols-2">
          <div
            v-for="(column, columnIndex) in newsColumns"
            :key="`news-column-${columnIndex}`"
            class="space-y-6"
          >
            <NuxtLink
              :to="`/media-news/${column[0].slug}`"
              class="group overflow-hidden rounded-[2rem] border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]"
              v-motion-fade-up
            >
              <img
                :src="column[0].image"
                :alt="column[0].title"
                class="h-80 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              >
              <div class="p-7 sm:p-8">
                <p class="brand-meta">{{ column[0].category }}</p>
                <h3 class="mt-4 text-[clamp(1.9rem,3vw,3rem)] font-extrabold leading-[1.04] tracking-[-0.04em] text-[#0e2344]">
                  {{ column[0].title }}
                </h3>
                <p class="mt-4 text-sm leading-8 text-slate-600">{{ column[0].summary }}</p>
                <p class="mt-4 text-sm font-semibold text-slate-500">{{ column[0].date }}</p>
                <span
                  class="mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-extrabold"
                  :class="columnIndex === 0 ? 'bg-[#1f5dcc] text-white shadow-[0_16px_32px_rgba(31,93,204,0.24)]' : 'border border-[#dbe6f4] bg-white text-[#123771]'"
                >
                  Read More
                </span>
              </div>
            </NuxtLink>

            <div class="space-y-4">
              <NuxtLink
                v-for="item in column.slice(1)"
                :key="item.slug"
                :to="`/media-news/${item.slug}`"
                class="grid gap-4 rounded-[1.5rem] border border-[#dbe6f4] bg-white p-4 shadow-[0_14px_40px_rgba(18,56,122,0.06)] sm:grid-cols-[9rem_1fr]"
                v-motion-fade-up
              >
                <img :src="item.image" :alt="item.title" class="h-28 w-full rounded-[1rem] object-cover sm:h-full">
                <div>
                  <p class="brand-meta">{{ item.category }}</p>
                  <h4 class="mt-3 text-lg font-extrabold leading-tight tracking-[-0.03em] text-[#0e2344]">{{ item.title }}</h4>
                  <p class="mt-3 text-sm leading-7 text-slate-600">{{ item.date }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0 pb-24">
      <div class="marketing-container">
        <div class="brand-soft-panel px-8 py-8 sm:px-10 sm:py-10">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="max-w-3xl">
              <h2 class="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0e2344]">
                {{ mediaPage.cta.title }}
              </h2>
              <p class="mt-4 text-base leading-8 text-slate-600">
                {{ mediaPage.cta.copy }}
              </p>
            </div>
            <a :href="`mailto:${company.email}?subject=${encodeURIComponent('Stay Updated With Havor')}`" class="btn-primary">
              Stay Updated
            </a>
          </div>
        </div>
      </div>
    </section>
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
const { pressReleaseEntries, newsEntries } = useCorporateRoutes()

const featuredPressRelease = computed(() => pressReleaseEntries.value[0] || null)
const pressSidebar = computed(() => pressReleaseEntries.value.slice(1, 5))
const newsColumns = computed(() => [
  newsEntries.value.slice(0, 3),
  newsEntries.value.slice(3, 6)
].filter((column) => column.length))
</script>
