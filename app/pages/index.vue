<template>
  <div class="overflow-hidden">
    <LandingHeroCarousel
      :title="homePage.hero.title"
      :subtitle="homePage.hero.subtitle"
      :slides="homePage.hero.slides"
    >
    </LandingHeroCarousel>

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <div class="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div class="lg:pr-8">
            <SectionHeading
              :title="homePage.approach.title"
              :description="homePage.approach.intro"
            />
          </div>

          <div class="space-y-4">
            <article
              v-for="pillar in homePage.approach.pillars"
              :key="pillar.step"
              class="brand-panel grid gap-4 p-5 sm:grid-cols-[5.5rem_1fr] sm:items-start"
              v-motion-fade-up
            >
              <div class="rounded-[1.25rem] bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] px-3.5 py-4 text-center">
                <p class="text-[0.75rem] font-extrabold uppercase tracking-[0.24em] text-[#5374a8]">{{ pillar.step }}</p>
                <p class="mt-2.5 text-[1.35rem] font-extrabold text-[#0e2344]">{{ pillar.title }}</p>
              </div>
              <div class="pt-1">
                <p class="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#6c86ad]">Client engagement pillar</p>
                <p class="mt-2.5 text-[1.2rem] font-extrabold text-[#0e2344]">{{ pillar.title }}</p>
                <p class="mt-2.5 text-[0.92rem] leading-6 text-slate-600">{{ pillar.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <div class="brand-soft-panel p-7 sm:p-8">
          <SectionHeading
            :title="homePage.trustedBy.title"
            :description="homePage.trustedBy.subtitle"
          />

          <div class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="logo in homePage.trustedBy.logos"
              :key="logo.name"
              class="rounded-[1.35rem] border border-[#dbe6f4] bg-white px-4 py-4"
              v-motion-fade-up
            >
              <p class="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#6c86ad]">{{ logo.note }}</p>
              <p class="mt-2.5 text-[1.1rem] font-extrabold tracking-[-0.03em] text-[#0e2344]">{{ logo.name }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article class="brand-panel overflow-hidden p-7 sm:p-8">
            <p class="brand-kicker">Why Havor</p>
            <h2 class="mt-5 text-[clamp(2rem,3.5vw,3.2rem)] font-extrabold leading-[1.04] tracking-[-0.04em] text-[#0e2344]">
              A corporate technology partner built around tailored delivery.
            </h2>
            <p class="mt-5 text-[0.95rem] leading-7 text-slate-600">
              {{ homePage.whyHavor.intro }}
            </p>

            <div class="mt-8 rounded-[1.55rem] bg-[linear-gradient(135deg,#1f5dcc_0%,#2f79f2_100%)] p-5 text-white">
              <p class="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-white/72">Institutional strength</p>
              <p class="mt-2.5 text-[1.3rem] font-extrabold leading-tight">
                Professional communication, structured implementation, and dependable long-term support.
              </p>
            </div>
          </article>

          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="point in homePage.whyHavor.points"
              :key="point.title"
              class="brand-panel p-5"
              v-motion-fade-up
            >
              <p class="brand-meta">Differentiator</p>
              <h3 class="mt-2.5 brand-card-title">{{ point.title }}</h3>
              <p class="mt-2.5 brand-card-copy">{{ point.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div class="lg:pr-10">
            <SectionHeading
              :title="homePage.services.title"
              :description="homePage.services.intro"
            >
              <template #actions>
                <NuxtLink to="/services" class="btn-outline">View All Services</NuxtLink>
              </template>
            </SectionHeading>
          </div>

          <div v-if="expertise.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <NuxtLink
              v-for="(service, index) in expertise.slice(0, 6)"
              :key="service.id"
              :to="`/services/${service.slug}`"
              class="group brand-service-card"
              :aria-label="`Open ${service.name} service detail`"
              v-motion-fade-up
            >
              <img :src="service.icon_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'" :alt="service.name" class="brand-service-card-media">
              <div class="brand-service-card-overlay"></div>
              <div class="brand-service-card-body">
                <p class="brand-service-card-label">Service {{ String(index + 1).padStart(2, '0') }}</p>
                <h3 class="brand-service-card-title">{{ service.name }}</h3>
                <span class="brand-service-card-link">Explore Service</span>
              </div>
            </NuxtLink>
          </div>
          <div v-else class="brand-soft-panel p-10 text-center">
            <p class="text-slate-500 font-medium">No services currently listed. Check back soon for our expertise updates.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <SectionHeading
          :title="homePage.projects.title"
          :description="homePage.projects.intro"
        >
          <template #actions>
            <NuxtLink to="/projects" class="btn-outline">See More Projects</NuxtLink>
          </template>
        </SectionHeading>

        <div v-if="works.length" class="mt-10 grid gap-6 lg:grid-cols-2">
          <article
            v-for="(project, index) in works.slice(0, 4)"
            :key="project.id"
            class="overflow-hidden rounded-[2rem] border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]"
            :class="index === 0 ? 'lg:col-span-2' : ''"
            v-motion-fade-up
          >
            <div class="grid gap-0" :class="index === 0 ? 'lg:grid-cols-[1.08fr_0.92fr]' : ''">
              <img
                :src="project.image_url"
                :alt="project.title"
                class="h-72 w-full object-cover"
                :class="index === 0 ? 'lg:h-full' : ''"
              >
              <div class="p-6 sm:p-7">
                <div class="flex flex-wrap gap-2">
                  <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ project.categoryName }}</span>
                  <span v-if="project.client" class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ project.client }}</span>
                </div>
                <h3 class="mt-4 text-[1.7rem] font-extrabold tracking-[-0.04em] text-[#0e2344]">{{ project.title }}</h3>
                <p class="mt-3 text-[0.92rem] leading-6 text-slate-600">{{ project.description }}</p>
                <div class="mt-5 flex flex-wrap items-center gap-3">
                  <NuxtLink :to="`/projects/${project.slug}`" class="rounded-full border border-[#d6e5fb] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#31527d] transition hover:bg-[#edf4ff]">
                    View Project Detail
                  </NuxtLink>
                </div>
              </div>
            </div>
          </article>
        </div>
        <div v-else class="mt-10 brand-soft-panel p-10 text-center">
          <p class="text-slate-500 font-medium">Our showcase is being updated. Explore our services to learn more about what we do.</p>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <SectionHeading
          :title="homePage.insights.title"
          :description="homePage.insights.intro"
        >
          <template #actions>
            <NuxtLink to="/media-news" class="btn-outline">Read More Insights</NuxtLink>
          </template>
        </SectionHeading>

        <div v-if="news.length" class="mt-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <article class="overflow-hidden rounded-[2rem] border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]" v-motion-fade-up>
            <img :src="news[0].image_url" :alt="news[0].title" class="h-80 w-full object-cover">
            <div class="p-6 sm:p-7">
              <p class="brand-meta">{{ news[0].category }}</p>
              <h3 class="mt-3 text-[1.75rem] font-extrabold tracking-[-0.04em] text-[#0e2344]">{{ news[0].title }}</h3>
              <p class="mt-3 text-[0.92rem] leading-6 text-slate-600">{{ news[0].excerpt }}</p>
            </div>
          </article>

          <div class="space-y-6">
            <article
              v-for="article in news.slice(1, 4)"
              :key="article.id"
              class="grid gap-0 overflow-hidden rounded-[2rem] border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)] sm:grid-cols-[0.82fr_1.18fr]"
              v-motion-fade-up
            >
              <img :src="article.image_url" :alt="article.title" class="h-56 w-full object-cover sm:h-full">
              <div class="p-5">
                <p class="brand-meta">{{ article.category }}</p>
                <h3 class="mt-2.5 text-[1.3rem] font-extrabold tracking-[-0.03em] text-[#0e2344]">{{ article.title }}</h3>
                <p class="mt-2.5 text-[0.92rem] leading-6 text-slate-600">{{ article.excerpt }}</p>
              </div>
            </article>
          </div>
        </div>
        <div v-else class="mt-10 brand-soft-panel p-10 text-center">
          <p class="text-slate-500 font-medium">Stay tuned for the latest industry insights and company updates.</p>
        </div>
      </div>
    </section>

    <section id="contact" class="brand-section pt-0 pb-24">
      <div class="marketing-container">
        <div class="overflow-hidden rounded-[2.4rem] bg-[linear-gradient(135deg,#0f2b57_0%,#1f5dcc_55%,#71a7ff_140%)] px-8 py-9 text-white shadow-[0_30px_90px_rgba(18,56,122,0.22)] sm:px-10 sm:py-10">
          <div class="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <h2 class="mt-6 max-w-3xl text-[clamp(2.2rem,4vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
                {{ homePage.cta.title }}
              </h2>
              <p class="mt-5 max-w-2xl text-base leading-8 text-white/80">
                {{ homePage.cta.copy }}
              </p>

              <div class="mt-8 flex flex-wrap gap-3">
                <a :href="`mailto:${company.email}?subject=${encodeURIComponent('Contact PT Havor SMART Digital')}`" class="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[#123771] transition hover:bg-[#eef4ff]">
                  Contact Us
                </a>
                <NuxtLink to="/services" class="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/16">
                  Discuss Your Project
                </NuxtLink>
              </div>
            </div>

            <div class="rounded-[2rem] border border-white/14 bg-white/10 p-6 backdrop-blur">
              <p class="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-white/72">Contact Summary</p>
              <div class="mt-5 grid gap-4">
                <div class="rounded-[1.4rem] border border-white/12 bg-white/10 px-4 py-4">
                  <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-white/68">Email</p>
                  <p class="mt-2 text-lg font-extrabold">{{ company.email }}</p>
                </div>
                <div class="rounded-[1.4rem] border border-white/12 bg-white/10 px-4 py-4">
                  <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-white/68">Phone</p>
                  <p class="mt-2 text-lg font-extrabold">{{ company.phone }}</p>
                </div>
                <div class="rounded-[1.4rem] border border-white/12 bg-white/10 px-4 py-4">
                  <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-white/68">Office</p>
                  <p class="mt-2 text-lg font-extrabold">{{ company.office }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'PT Havor SMART Digital | Bright Corporate Technology Solutions',
  description: 'PT Havor SMART Digital provides web development, mobile app development, custom software, system integration, UI/UX design, IT consulting, maintenance, and digital transformation support.',
  path: '/'
})

const { company, homePage } = useCorporateContent()
const { expertise, fetchExpertise } = useExpertise()
const { works, fetchWorks } = useWorks()
const { news, fetchNews } = useNews()

onMounted(() => {
  fetchExpertise()
  fetchWorks()
  fetchNews()
})
</script>
