<template>
  <div class="overflow-hidden bg-white">
    <CorporatePageHero
      :title="aboutBanner.title || aboutPage.hero.title"
      :subtitle="aboutBanner.subtitle || aboutPage.hero.subtitle"
      :image="aboutHeroImage"
      hero-size="half"
      image-label="Company Identity"
      image-title="A technology partner shaped by disciplined collaboration and long-term commitment."
      :side-copy="company.tagline"
    />

    <section class="brand-section bg-white pt-12">
      <div class="marketing-container">
        <SectionHeading
          title="Company Sections"
          description="Navigate the company story through Havor's journey, vision, mission, and delivery focus."
        />

        <div class="mt-8 flex flex-wrap gap-3 border-y border-[#dbe6f4] py-5" v-motion-fade-up>
          <a
            v-for="item in aboutSectionLinks"
            :key="item.href"
            :href="item.href"
            class="brand-chip transition hover:border-[#1f5dcc] hover:text-[#1f5dcc]"
          >
            {{ item.label }}
          </a>
        </div>
      </div>
    </section>

    <section id="journey" class="brand-section bg-white pt-0">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
          <article class="border-l-2 border-[#1f5dcc] pl-5">
            <SectionHeading
              :title="aboutPage.journey.title"
              :description="aboutPage.journey.intro"
            />
            <p class="mt-7 text-[0.95rem] leading-7 text-slate-600">
              {{ aboutPage.journey.narrative }}
            </p>
          </article>

          <div class="space-y-0 border-t border-[#dbe6f4]">
            <article
              v-for="item in aboutPage.journey.milestones"
              :key="item.phase"
              class="grid gap-4 border-b border-[#dbe6f4] py-6 sm:grid-cols-[7.25rem_1fr] sm:items-start"
              v-motion-fade-up
            >
              <div>
                <p class="text-[0.72rem] font-medium uppercase tracking-normal text-[#6c86ad]">Phase</p>
                <p class="mt-2.5 text-[1.15rem] font-semibold text-[#1f5dcc]">{{ item.phase }}</p>
              </div>
              <div>
                <h3 class="brand-card-title">{{ item.title }}</h3>
                <p class="mt-2.5 brand-card-copy">{{ item.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="vision-mission" class="brand-section bg-[#f5f8fc] pt-0 pb-16">
      <div class="marketing-container">
        <div class="grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
          <article class="relative isolate overflow-hidden rounded-lg px-6 py-7 text-white shadow-[0_24px_70px_rgba(18,56,122,0.18)] sm:px-8 sm:py-8">
            <img
              :src="aboutHeroImage"
              alt="Havor vision"
              class="absolute inset-0 h-full w-full object-cover"
            >
            <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,12,24,0.9)_0%,rgba(5,12,24,0.68)_100%)]"></div>
            <div class="relative">
              <h2 class="mt-5 text-[clamp(1.85rem,3.4vw,3rem)] font-semibold leading-tight tracking-normal">
                A long-term vision for dependable digital transformation.
              </h2>
              <div class="mt-6 border-l border-white/24 pl-5">
                <p class="text-[0.72rem] font-medium uppercase tracking-normal text-white/70">Vision Statement</p>
                <p class="mt-3 text-[1rem] leading-7 text-white/88">
                  {{ aboutPage.visionMission.vision }}
                </p>
              </div>
              <p class="mt-4 text-[0.86rem] leading-6 text-white/78">
                {{ aboutPage.visionMission.supportNote }}
              </p>
            </div>
          </article>

          <div class="space-y-0 border-t border-[#dbe6f4]">
            <article
              v-for="mission in aboutPage.visionMission.missions"
              :key="mission.title"
              class="border-b border-[#dbe6f4] py-6"
              v-motion-fade-up
            >
              <h3 class="brand-card-title">{{ mission.title }}</h3>
              <p class="mt-2.5 brand-card-copy">{{ mission.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'About Us | PT Havor SMART Digital',
  description: 'Learn about PT Havor SMART Digital, our company journey, vision, mission, and commitment to serious digital delivery.',
  path: '/about-us'
})

const { company, aboutPage } = useCorporateContent()
const { fetchBannerPage, useBannerPage } = useBanners()
const aboutBanner = useBannerPage('about-us', 'about')
const aboutHeroImage = computed(() => aboutBanner.value.media_url || aboutPage.hero.image)
const aboutSectionLinks = [
  { label: 'Company Journey', href: '#journey' },
  { label: 'Vision & Mission', href: '#vision-mission' },
  { label: 'Digital Delivery Focus', href: '/services' },
  { label: 'Project Experience', href: '/projects' }
]

onMounted(() => {
  fetchBannerPage('about-us')
})
</script>
