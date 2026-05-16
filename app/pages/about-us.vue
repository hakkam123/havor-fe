<template>
  <div class="overflow-hidden bg-white">
    <CorporatePageHero
      :title="aboutPage.hero.title"
      :subtitle="aboutPage.hero.subtitle"
      :image="aboutPage.hero.image"
      hero-size="half"
      image-label="Company Identity"
      image-title="A technology partner shaped by disciplined collaboration and long-term commitment."
      :side-copy="company.tagline"
    />

    <section class="brand-section bg-white pt-12">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.84fr_1.16fr]">
          <article class="brand-panel p-7 sm:p-8">
            <SectionHeading
              :title="aboutPage.journey.title"
              :description="aboutPage.journey.intro"
            />
            <p class="mt-7 text-[0.95rem] leading-7 text-slate-600">
              {{ aboutPage.journey.narrative }}
            </p>
          </article>

          <div class="space-y-4">
            <article
              v-for="item in aboutPage.journey.milestones"
              :key="item.phase"
              class="brand-soft-panel grid gap-4 p-5 sm:grid-cols-[7.25rem_1fr] sm:items-start"
              v-motion-fade-up
            >
              <div class="rounded-lg bg-white px-3.5 py-4 shadow-[0_12px_30px_rgba(18,56,122,0.06)]">
                <p class="text-[0.72rem] font-bold uppercase tracking-normal text-[#6c86ad]">Phase</p>
                <p class="mt-2.5 text-[1.15rem] font-bold text-[#0e2344]">{{ item.phase }}</p>
              </div>
              <div class="pt-1">
                <h3 class="brand-card-title">{{ item.title }}</h3>
                <p class="mt-2.5 brand-card-copy">{{ item.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section bg-[#f5f8fc] pt-0 pb-24">
      <div class="marketing-container">
        <div class="grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
          <article class="overflow-hidden rounded-lg bg-[linear-gradient(135deg,#0f2b57_0%,#1f5dcc_55%,#79adff_140%)] px-8 py-8 text-white shadow-[0_30px_90px_rgba(18,56,122,0.2)] sm:px-10 sm:py-10">
            <h2 class="mt-6 text-[clamp(2.2rem,4vw,3.8rem)] font-bold leading-tight tracking-normal">
              A long-term vision for dependable digital transformation.
            </h2>
            <div class="mt-8 rounded-lg border border-white/14 bg-white/10 p-6">
              <p class="text-[0.72rem] font-bold uppercase tracking-normal text-white/70">Vision Statement</p>
              <p class="mt-4 text-lg leading-8 text-white/88">
                {{ aboutPage.visionMission.vision }}
              </p>
            </div>
            <p class="mt-6 text-sm leading-7 text-white/78">
              {{ aboutPage.visionMission.supportNote }}
            </p>
          </article>

          <div class="space-y-4">
            <article
              v-for="mission in aboutPage.visionMission.missions"
              :key="mission.title"
              class="brand-panel p-5"
              v-motion-fade-up
            >
              <h3 class="mt-2.5 brand-card-title">{{ mission.title }}</h3>
              <p class="mt-2.5 brand-card-copy">{{ mission.description }}</p>
            </article>
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
  title: 'About Us | PT Havor SMART Digital',
  description: 'Learn about PT Havor SMART Digital, our company journey, vision, mission, and commitment to serious digital delivery.',
  path: '/about-us'
})

const { company, aboutPage } = useCorporateContent()
</script>
