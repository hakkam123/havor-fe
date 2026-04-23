<template>
  <div class="overflow-hidden">
    <LandingHeroCarousel
      :title="homePage.hero.title"
      :subtitle="homePage.hero.subtitle"
      :slides="homePage.hero.slides"
    >
      <template #actions>
        <NuxtLink
          to="/services"
          class="inline-flex items-center justify-center rounded-full bg-[#1f5dcc] px-5 py-3 text-sm font-extrabold text-white shadow-[0_16px_30px_rgba(31,93,204,0.3)] transition hover:bg-[#164ca9]"
        >
          Explore Services
        </NuxtLink>
        <NuxtLink
          to="/#contact"
          class="inline-flex items-center justify-center rounded-full border border-white/32 bg-white/10 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/16"
        >
          Get In Touch
        </NuxtLink>
      </template>
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
              class="brand-panel grid gap-5 p-6 sm:grid-cols-[6.25rem_1fr] sm:items-start"
              v-motion-fade-up
            >
              <div class="rounded-[1.5rem] bg-[linear-gradient(180deg,#f7fbff_0%,#edf4ff_100%)] px-4 py-5 text-center">
                <p class="text-[0.75rem] font-extrabold uppercase tracking-[0.24em] text-[#5374a8]">{{ pillar.step }}</p>
                <p class="mt-3 text-2xl font-extrabold text-[#0e2344]">{{ pillar.title }}</p>
              </div>
              <div class="pt-1">
                <p class="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-[#6c86ad]">Client engagement pillar</p>
                <p class="mt-3 text-xl font-extrabold text-[#0e2344]">{{ pillar.title }}</p>
                <p class="mt-3 text-sm leading-7 text-slate-600">{{ pillar.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <div class="brand-soft-panel p-8 sm:p-10">
          <SectionHeading
            :title="homePage.trustedBy.title"
            :description="homePage.trustedBy.subtitle"
          />

          <div class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="logo in homePage.trustedBy.logos"
              :key="logo.name"
              class="rounded-[1.6rem] border border-[#dbe6f4] bg-white px-5 py-5"
              v-motion-fade-up
            >
              <p class="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-[#6c86ad]">{{ logo.note }}</p>
              <p class="mt-3 text-xl font-extrabold tracking-[-0.03em] text-[#0e2344]">{{ logo.name }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article class="brand-panel overflow-hidden p-8 sm:p-10">
            <p class="brand-kicker">Why Havor</p>
            <h2 class="mt-6 text-[clamp(2.4rem,4vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0e2344]">
              A corporate technology partner built around tailored delivery.
            </h2>
            <p class="mt-6 text-base leading-8 text-slate-600">
              {{ homePage.whyHavor.intro }}
            </p>

            <div class="mt-10 rounded-[1.8rem] bg-[linear-gradient(135deg,#1f5dcc_0%,#2f79f2_100%)] p-6 text-white">
              <p class="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-white/72">Institutional strength</p>
              <p class="mt-3 text-2xl font-extrabold leading-tight">
                Professional communication, structured implementation, and dependable long-term support.
              </p>
            </div>
          </article>

          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="point in homePage.whyHavor.points"
              :key="point.title"
              class="brand-panel p-6"
              v-motion-fade-up
            >
              <p class="brand-meta">Differentiator</p>
              <h3 class="mt-3 text-xl font-extrabold text-[#0e2344]">{{ point.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-slate-600">{{ point.description }}</p>
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

          <div class="space-y-4">
            <article
              v-for="(service, index) in homePage.services.items"
              :key="service.title"
              class="grid gap-5 rounded-[2rem] border border-[#dbe6f4] bg-white px-6 py-6 shadow-[0_18px_60px_rgba(18,56,122,0.08)] md:grid-cols-[1fr_0.9fr] md:items-center"
              v-motion-fade-up
            >
              <div>
                <p class="brand-meta">Service {{ String(index + 1).padStart(2, '0') }}</p>
                <h3 class="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-[#0e2344]">{{ service.title }}</h3>
                <p class="mt-3 text-sm leading-7 text-slate-600">{{ service.summary }}</p>
              </div>
              <div class="flex flex-wrap gap-2 md:justify-end">
                <span
                  v-for="deliverable in service.deliverables"
                  :key="deliverable"
                  class="rounded-full border border-[#d6e5fb] bg-[#f7fbff] px-3 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#31527d]"
                >
                  {{ deliverable }}
                </span>
              </div>
            </article>
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

        <div class="mt-10 grid gap-6 lg:grid-cols-2">
          <article
            v-for="(project, index) in homePage.projects.items"
            :key="project.title"
            class="overflow-hidden rounded-[2rem] border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]"
            :class="index === 0 ? 'lg:col-span-2' : ''"
            v-motion-fade-up
          >
            <div class="grid gap-0" :class="index === 0 ? 'lg:grid-cols-[1.08fr_0.92fr]' : ''">
              <img
                :src="project.image"
                :alt="project.title"
                class="h-72 w-full object-cover"
                :class="index === 0 ? 'lg:h-full' : ''"
              >
              <div class="p-7 sm:p-8">
                <div class="flex flex-wrap gap-2">
                  <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ project.category }}</span>
                  <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ project.industry }}</span>
                </div>
                <h3 class="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-[#0e2344]">{{ project.title }}</h3>
                <p class="mt-4 text-sm leading-7 text-slate-600">{{ project.summary }}</p>
                <p class="mt-4 rounded-[1.5rem] bg-[#f7fbff] px-4 py-4 text-sm leading-7 text-slate-600">
                  <span class="font-extrabold text-[#0e2344]">Challenge / Solution:</span>
                  {{ project.challenge }} {{ project.solution }}
                </p>
                <div class="mt-5 flex flex-wrap items-center gap-3">
                  <span class="rounded-full border border-[#d6e5fb] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#31527d]">
                    {{ project.metric }}
                  </span>
                </div>
              </div>
            </div>
          </article>
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

        <div class="mt-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <article class="overflow-hidden rounded-[2rem] border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)]" v-motion-fade-up>
            <img :src="homePage.insights.items[0].image" :alt="homePage.insights.items[0].title" class="h-80 w-full object-cover">
            <div class="p-7 sm:p-8">
              <p class="brand-meta">{{ homePage.insights.items[0].category }} · {{ homePage.insights.items[0].date }}</p>
              <h3 class="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-[#0e2344]">{{ homePage.insights.items[0].title }}</h3>
              <p class="mt-4 text-sm leading-7 text-slate-600">{{ homePage.insights.items[0].summary }}</p>
            </div>
          </article>

          <div class="space-y-6">
            <article
              v-for="article in homePage.insights.items.slice(1)"
              :key="article.title"
              class="grid gap-0 overflow-hidden rounded-[2rem] border border-[#dbe6f4] bg-white shadow-[0_18px_60px_rgba(18,56,122,0.08)] sm:grid-cols-[0.82fr_1.18fr]"
              v-motion-fade-up
            >
              <img :src="article.image" :alt="article.title" class="h-56 w-full object-cover sm:h-full">
              <div class="p-6">
                <p class="brand-meta">{{ article.category }} · {{ article.date }}</p>
                <h3 class="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-[#0e2344]">{{ article.title }}</h3>
                <p class="mt-3 text-sm leading-7 text-slate-600">{{ article.summary }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="brand-section pt-0 pb-24">
      <div class="marketing-container">
        <div class="overflow-hidden rounded-[2.4rem] bg-[linear-gradient(135deg,#0f2b57_0%,#1f5dcc_55%,#71a7ff_140%)] px-8 py-9 text-white shadow-[0_30px_90px_rgba(18,56,122,0.22)] sm:px-10 sm:py-10">
          <div class="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p class="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-white/78">
                Final CTA / Get In Touch
              </p>
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
definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'PT Havor SMART Digital | Bright Corporate Technology Solutions',
  description: 'PT Havor SMART Digital provides web development, mobile app development, custom software, system integration, UI/UX design, IT consulting, maintenance, and digital transformation support.',
  path: '/'
})

const { company, homePage } = useCorporateContent()
</script>
