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
        <div class="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div class="relative overflow-hidden rounded-lg" v-motion-fade-up>
            <img
              :src="aboutHeroImage"
              alt="Havor Smarta Digital team collaboration"
              class="h-[18rem] w-full object-cover sm:h-[24rem]"
            >
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,11,24,0)_32%,rgba(3,11,24,0.72)_100%)]"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p class="max-w-sm text-sm font-medium leading-6 text-white/84">
                {{ aboutPage.profile.caption }}
              </p>
            </div>
          </div>

          <article class="lg:pl-8">
            <p class="brand-meta">{{ aboutPage.profile.label }}</p>
            <h2 class="mt-4 max-w-3xl text-[clamp(1.9rem,3vw,2.65rem)] font-semibold leading-tight text-[#0e2344]">
              {{ aboutPage.profile.title }}
            </h2>
            <p class="mt-4 max-w-2xl text-[0.9rem] leading-7 text-slate-600">
              {{ aboutPage.profile.description }}
            </p>

            <div class="mt-6 space-y-3">
              <div
                v-for="item in aboutPage.profile.points"
                :key="item"
                class="flex gap-3 border-t border-[#e2eaf5] pt-3"
                v-motion-fade-up
              >
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1f5dcc]"></span>
                <p class="text-sm font-medium leading-6 text-[#24415f]">{{ item }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="brand-section bg-[#f5f8fc]">
      <div class="marketing-container">
        <SectionHeading
          :title="aboutPage.highlights.title"
          :description="aboutPage.highlights.description"
        />

        <div class="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="item in aboutPage.highlights.items"
            :key="item.label"
            class="border-t border-[#dbe6f4] pt-5"
            v-motion-fade-up
          >
            <p class="text-3xl font-semibold leading-none text-[#1f5dcc] sm:text-4xl">{{ item.value }}</p>
            <h3 class="mt-3 text-[1rem] font-semibold leading-tight text-[#0e2344]">{{ item.label }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-600">{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="journey" class="brand-section bg-white">
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

    <section id="vision-mission" class="brand-section bg-[#f5f8fc] pt-0">
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

    <section id="culture" class="brand-section bg-white pt-0 pb-16">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <article class="relative isolate overflow-hidden rounded-lg px-6 py-7 text-white shadow-[0_24px_70px_rgba(18,56,122,0.16)] sm:px-8 sm:py-8">
            <img
              :src="aboutHeroImage"
              alt="Havor company culture"
              class="absolute inset-0 h-full w-full object-cover"
            >
            <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,12,24,0.9)_0%,rgba(5,12,24,0.68)_100%)]"></div>
            <div class="relative">
              <h2 class="mt-5 text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-tight tracking-normal">
                {{ aboutPage.culture.title }}
              </h2>
              <p class="mt-4 text-[0.92rem] leading-7 text-white/80">
                {{ aboutPage.culture.narrative }}
              </p>
            </div>
          </article>

          <div class="grid gap-x-8 gap-y-6 md:grid-cols-2">
            <article
              v-for="value in aboutPage.culture.values"
              :key="value.title"
              class="border-t border-[#dbe6f4] pt-5"
              v-motion-fade-up
            >
              <h3 class="brand-card-title">{{ value.title }}</h3>
              <p class="mt-2.5 brand-card-copy">{{ value.description }}</p>
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
const { fetchBanners, useBannerPage } = useBanners()
const aboutBanner = useBannerPage('about-us', 'about')
const aboutHeroImage = computed(() => aboutBanner.value.media_url || aboutPage.hero.image)

onMounted(() => {
  fetchBanners()
})
</script>
