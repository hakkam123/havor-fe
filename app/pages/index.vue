<template>
  <div class="overflow-hidden bg-white">
    <LandingHeroCarousel
      :title="t('home.hero.title')"
      :subtitle="t('home.hero.subtitle')"
      :slides="heroSlides"
    />

    <section class="brand-section bg-white">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div class="relative overflow-hidden rounded-lg">
            <img
              :src="featuredImage"
              alt="Integrated digital platform"
              class="h-[18rem] w-full object-cover sm:h-[24rem]"
            >
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,11,24,0)_34%,rgba(3,11,24,0.72)_100%)]"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p class="max-w-sm text-sm font-semibold leading-6 text-white/82">
                {{ t('home.featured.caption') }}
              </p>
            </div>
          </div>

          <div class="lg:pl-8">
            <h2 class="max-w-3xl text-[clamp(1.9rem,3vw,2.65rem)] font-semibold leading-tight text-[#0e2344]">
              {{ t('home.featured.title') }}
            </h2>
            <p class="mt-4 max-w-2xl text-[0.9rem] leading-7 text-slate-600">
              {{ t('home.featured.description') }}
            </p>

            <div class="mt-6 space-y-3">
              <div
                v-for="item in aboutPoints"
                :key="item"
                class="flex gap-3 border-t border-[#e2eaf5] pt-3"
                v-motion-fade-up
              >
                <CheckCircle2 class="mt-0.5 h-5 w-5 shrink-0 text-[#1f5dcc]" />
                <p class="text-sm font-semibold leading-6 text-[#24415f]">{{ item }}</p>
              </div>
            </div>

            <NuxtLink to="/about-us" class="btn-outline mt-6">
              {{ t('home.featured.button') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="relative isolate overflow-hidden py-16 text-white sm:py-20">
      <img
        :src="aboutImage"
        alt="About Havor Smarta Digital"
        class="absolute inset-0 h-full w-full object-cover"
      >
      <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,14,31,0.88)_0%,rgba(4,14,31,0.62)_48%,rgba(4,14,31,0.18)_100%)]"></div>
      <div class="marketing-container">
        <div class="relative max-w-3xl">
          <h2 class="text-[clamp(1.9rem,3.2vw,2.8rem)] font-semibold leading-tight">
            {{ t('home.about.title') }}
          </h2>
          <p class="mt-4 max-w-2xl text-[0.94rem] leading-7 text-white/82">
            {{ t('home.about.intro') }}
          </p>
          <div class="mt-7 flex flex-wrap gap-3">
            <NuxtLink to="/services" class="inline-flex rounded-full bg-white px-5 py-2.5 text-[0.84rem] font-semibold text-[#0e2344] transition hover:bg-[#edf4ff]">
              {{ t('home.about.servicesCta') }}
            </NuxtLink>
            <NuxtLink to="/projects" class="inline-flex rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-[0.84rem] font-semibold text-white backdrop-blur-sm transition hover:bg-white/18">
              {{ t('home.about.projectsCta') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section bg-white">
      <div class="marketing-container">
        <SectionHeading
          :title="t('home.highlights.title')"
          :description="t('home.highlights.intro')"
        />

        <div class="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="item in highlightItems"
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

    <section class="brand-section bg-[#f5f8fc]">
      <div class="marketing-container">
        <div class="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p class="brand-meta">{{ t('home.clients.label') }}</p>
            <h2 class="mt-3 text-[clamp(1.85rem,3vw,2.4rem)] font-semibold leading-tight text-[#0e2344]">
              {{ t('home.clients.title') }}
            </h2>
            <p class="mt-3 text-[0.9rem] leading-7 text-slate-600">
              {{ t('home.clients.intro') }}
            </p>
          </div>

          <div v-if="isLoadingClients && !clients.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="item in 6" :key="item" class="brand-skeleton h-28"></div>
          </div>

          <div v-else-if="clients.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="client in clients.slice(0, 6)"
              :key="client.id"
              class="flex min-h-28 items-center gap-4 rounded-lg border border-[#dbe6f4] bg-white p-4 shadow-sm"
              v-motion-fade-up
            >
              <img
                :src="client.client_icon || '/logo-havor.svg'"
                :alt="`${client.name} logo`"
                class="h-12 w-12 shrink-0 rounded-md object-contain"
              >
              <div>
                <h3 class="text-sm font-semibold leading-6 text-[#0e2344]">{{ client.name }}</h3>
                <p class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{{ client.excerpt }}</p>
              </div>
            </article>
          </div>

          <div v-else class="brand-soft-panel p-6 text-center">
            <p class="font-medium text-slate-500">{{ t('home.clients.empty') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="services" class="bg-[#f5f8fc] pt-12 sm:pt-14 lg:pt-16">
      <div class="marketing-container">
        <SectionHeading
          :title="t('home.services.title')"
          :description="t('home.services.intro')"
        >
          <template #actions>
            <NuxtLink to="/services" class="btn-outline">{{ t('home.services.all') }}</NuxtLink>
          </template>
        </SectionHeading>
      </div>

      <div class="mt-8" v-motion-fade-up>
        <div class="marketing-container">
          <div v-if="isLoadingExpertise && !expertise.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div v-for="item in 4" :key="item" class="brand-skeleton h-[30rem]"></div>
          </div>
        </div>

        <div v-if="!isLoadingExpertise || expertise.length" class="relative">
          <template v-if="serviceCarouselItems.length">
            <div class="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 lg:right-8">
              <button
                type="button"
                class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-white/12 text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-[#0e2344] focus:outline-none focus:ring-4 focus:ring-white/30"
                aria-label="Previous service"
                @click="goToPreviousService"
              >
                <ArrowLeft class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-[#1f5dcc] text-white shadow-[0_14px_34px_rgba(31,93,204,0.28)] transition hover:bg-[#164ca9] focus:outline-none focus:ring-4 focus:ring-white/30"
                aria-label="Next service"
                @click="goToNextService"
              >
                <ArrowRight class="h-4 w-4" />
              </button>
            </div>

            <div
              ref="serviceCarouselRef"
              class="brand-carousel-scroll w-full overflow-x-auto scroll-smooth"
              @mouseenter="pauseServiceCarousel"
              @mouseleave="resumeServiceCarousel"
              @focusin="pauseServiceCarousel"
              @focusout="resumeServiceCarousel"
            >
              <div class="flex">
                <NuxtLink
                  v-for="service in serviceCarouselItems"
                  :key="service.key"
                  :to="service.href"
                  data-service-card
                  class="group relative h-[30rem] w-full shrink-0 overflow-hidden bg-[#08162e] sm:w-1/2 lg:w-1/4"
                  :aria-label="`Open service detail: ${service.title}`"
                >
                  <img :src="service.image" :alt="service.title" class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]">
                  <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,14,31,0.04)_0%,rgba(4,14,31,0.36)_43%,rgba(4,14,31,0.82)_100%)]"></div>
                  <div class="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                    <p class="mb-3 max-w-[15rem] truncate text-[0.72rem] font-medium uppercase tracking-normal text-white/78">
                      {{ service.shortLabel }}
                    </p>
                    <h3 class="line-clamp-2 max-w-[17rem] text-[1.28rem] font-semibold leading-tight">{{ service.title }}</h3>
                    <p class="mt-3 line-clamp-2 max-w-[17rem] text-[0.82rem] leading-5 text-white/76">{{ service.description }}</p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </template>

          <div v-else class="marketing-container pb-12">
            <div class="brand-soft-panel p-6 text-center">
              <p class="font-medium text-slate-500">{{ t('home.services.empty') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section bg-white">
      <div class="marketing-container">
        <SectionHeading
          :title="t('home.projects.title')"
          :description="t('home.projects.intro')"
        >
          <template #actions>
            <NuxtLink to="/projects" class="btn-outline">{{ t('home.projects.all') }}</NuxtLink>
          </template>
        </SectionHeading>

        <div v-if="isLoadingWorks && !works.length" class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div v-for="item in 4" :key="item" class="brand-skeleton h-72"></div>
        </div>

        <div v-else-if="works.length" class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <NuxtLink
            v-for="project in visibleHomeProjects"
              :key="project.id"
              :to="`/projects/${project.slug}`"
              class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-[0_12px_32px_rgba(18,56,122,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(18,56,122,0.11)]"
              :aria-label="`Open project detail: ${project.title}`"
              v-motion-fade-up
            >
              <img
                :src="project.image_url || defaultProjectImage"
                :alt="project.title"
                class="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              >
              <div class="p-4">
                <div class="flex flex-wrap gap-2">
                  <span v-if="project.categoryName" class="brand-chip">{{ project.categoryName }}</span>
                  <span v-if="project.client" class="brand-chip">{{ project.client }}</span>
                </div>
                <h3 class="mt-4 line-clamp-2 text-[1.08rem] font-semibold leading-tight text-[#0e2344]">{{ project.title }}</h3>
                <p class="mt-2 line-clamp-3 text-[0.84rem] leading-6 text-slate-600">{{ stripHtml(project.description) }}</p>
                <div class="mt-4">
                  <span class="btn-outline px-4 py-2 text-xs">
                    {{ t('home.projects.detail') }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>

        <div v-else class="mt-8 brand-soft-panel p-6 text-center">
          <p class="font-medium text-slate-500">{{ t('home.projects.empty') }}</p>
        </div>

        <div v-if="canShowMoreHomeProjects" class="mt-6 flex justify-center">
          <button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe6f4] bg-white text-[#1f5dcc] shadow-sm transition hover:border-[#1f5dcc] hover:bg-[#edf4ff]" aria-label="Show more projects" @click="showMoreHomeProjects">
            <ChevronDown class="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>

    <section class="brand-section bg-[#f5f8fc]">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <article>
            <h2 class="text-[clamp(1.85rem,3vw,2.45rem)] font-semibold leading-tight text-[#0e2344]">
              {{ t('home.whyHavor.title') }}
            </h2>
            <p class="mt-4 text-[0.9rem] leading-7 text-slate-600">
              {{ t('home.whyHavor.intro') }}
            </p>

            <div class="mt-6 border-l-4 border-[#1f5dcc] pl-5">
              <p class="text-[1rem] font-semibold leading-7 text-[#0e2344]">
                {{ t('home.whyHavor.highlight') }}
              </p>
            </div>
          </article>

          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="point in whyPoints"
              :key="point.title"
              class="rounded-lg border border-[#dbe6f4] bg-white p-4 shadow-sm"
              v-motion-fade-up
            >
              <h3 class="brand-card-title">{{ point.title }}</h3>
              <p class="mt-2.5 brand-card-copy">{{ point.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section bg-white">
      <div class="marketing-container">
        <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            :title="t('home.insights.title')"
            :description="t('home.insights.intro')"
          />

          <div class="lg:justify-self-end">
            <NuxtLink to="/media-news" class="btn-outline">{{ t('home.insights.all') }}</NuxtLink>
          </div>
        </div>

        <div v-if="isLoadingNews && !news.length" class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="item in 3" :key="item" class="brand-skeleton h-72"></div>
        </div>

        <div v-else-if="displayNews.length" class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="article in visibleHomeNews"
            :key="article.id"
            :to="article.slug ? `/media-news/${article.slug}` : '/media-news'"
            class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(18,56,122,0.1)]"
            :aria-label="`Open news detail: ${article.title}`"
            v-motion-fade-up
          >
            <img :src="article.image_url" :alt="article.title" class="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]">
            <div class="p-4">
              <p class="brand-meta">{{ article.category }}</p>
              <h3 class="mt-2 line-clamp-2 text-[1.02rem] font-semibold leading-snug text-[#0e2344]">{{ article.title }}</h3>
              <p class="mt-2 line-clamp-2 text-[0.84rem] leading-6 text-slate-600">{{ article.excerpt }}</p>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="mt-8 brand-soft-panel p-6 text-center">
          <p class="font-medium text-slate-500">{{ t('home.insights.empty') }}</p>
        </div>
        <div v-if="canShowMoreHomeNews" class="mt-6 flex justify-center">
          <button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe6f4] bg-white text-[#1f5dcc] shadow-sm transition hover:border-[#1f5dcc] hover:bg-[#edf4ff]" aria-label="Show more media updates" @click="showMoreHomeNews">
            <ChevronDown class="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>

    <section class="brand-section bg-white">
      <div class="marketing-container">
        <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            title="Company Campaign"
            description="Explore Havor initiatives for digital transformation, long-term support, and practical technology adoption across organizations that need dependable execution."
          />

          <div class="lg:justify-self-end">
            <NuxtLink to="/contact" class="btn-outline">Discuss a Campaign</NuxtLink>
          </div>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="campaign in campaignItems"
            :key="campaign.title"
            to="/contact"
            class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(18,56,122,0.1)]"
            :aria-label="`Discuss campaign: ${campaign.title}`"
            v-motion-fade-up
          >
            <img :src="campaign.image" :alt="campaign.title" class="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]">
            <div class="p-4">
              <p class="brand-meta">{{ campaign.category }}</p>
              <h3 class="mt-2 line-clamp-2 text-[1.02rem] font-semibold leading-snug text-[#0e2344]">{{ campaign.title }}</h3>
              <p class="mt-2 line-clamp-2 text-[0.84rem] leading-6 text-slate-600">{{ campaign.excerpt }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <PublicImageCta
      anchor-id="contact"
      :title="t('home.cta.title')"
      :copy="t('home.cta.copy')"
      :image="ctaImage"
      image-alt="Havor consultation"
      :action-label="t('home.cta.button')"
    >
      <template #meta>
        <div class="flex flex-wrap gap-x-5 gap-y-2 text-[0.84rem] font-semibold text-white/72">
          <span>{{ company.website }}</span>
          <span>{{ company.phone }}</span>
          <span>{{ company.email }}</span>
        </div>
      </template>
      <template #actions>
        <form
          id="contact-form"
          class="w-full rounded-lg border border-white/18 bg-white p-4 text-[#0e2344] shadow-[0_20px_54px_rgba(3,11,24,0.24)] sm:w-[30rem] sm:p-5"
          novalidate
          @submit.prevent="handleContactSubmit"
        >
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="text-sm font-semibold" for="contact-name">
              Name <span class="text-rose-600">*</span>
              <input
                id="contact-name"
                v-model="contactForm.name"
                class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
                type="text"
                autocomplete="name"
                :aria-invalid="Boolean(contactFieldErrors.name)"
              >
              <span v-if="contactFieldErrors.name" class="mt-1 block text-xs font-medium text-rose-600">{{ contactFieldErrors.name }}</span>
            </label>

            <label class="text-sm font-semibold" for="contact-email">
              Email <span class="text-rose-600">*</span>
              <input
                id="contact-email"
                v-model="contactForm.email"
                class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
                type="email"
                autocomplete="email"
                :aria-invalid="Boolean(contactFieldErrors.email)"
              >
              <span v-if="contactFieldErrors.email" class="mt-1 block text-xs font-medium text-rose-600">{{ contactFieldErrors.email }}</span>
            </label>
          </div>

          <label class="mt-3 block text-sm font-semibold" for="contact-subject">
            Subject <span class="text-rose-600">*</span>
            <input
              id="contact-subject"
              v-model="contactForm.subject"
              class="mt-2 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
              type="text"
              autocomplete="off"
              :aria-invalid="Boolean(contactFieldErrors.subject)"
            >
            <span v-if="contactFieldErrors.subject" class="mt-1 block text-xs font-medium text-rose-600">{{ contactFieldErrors.subject }}</span>
          </label>

          <label class="mt-3 block text-sm font-semibold" for="contact-message">
            Message <span class="text-rose-600">*</span>
            <textarea
              id="contact-message"
              v-model="contactForm.message"
              class="mt-2 min-h-28 w-full rounded-lg border border-[#d6e5fb] px-3 py-2.5 text-sm outline-none transition focus:border-[#9bbcf2] focus:ring-4 focus:ring-[#edf4ff]"
              :aria-invalid="Boolean(contactFieldErrors.message)"
            ></textarea>
            <span v-if="contactFieldErrors.message" class="mt-1 block text-xs font-medium text-rose-600">{{ contactFieldErrors.message }}</span>
          </label>

          <p
            v-if="contactMessage"
            class="mt-3 rounded-lg px-3 py-2 text-sm font-medium"
            :class="contactStatus === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
            role="status"
            aria-live="polite"
          >
            {{ contactMessage }}
          </p>

          <button
            type="submit"
            class="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="contactStatus === 'loading'"
          >
            {{ contactStatus === 'loading' ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </template>
    </PublicImageCta>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, ChevronDown, Globe2, MonitorSmartphone, ServerCog } from 'lucide-vue-next'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { submitContactMessage } from '~/services/contactService'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'PT Havor SMART Digital | Your Digital IT Partner Solution',
  description: 'Havor Smarta Digital provides enterprise IT solutions, website development, mobile apps development, and AI-powered intelligent solutions for business growth and digital transformation.',
  path: '/'
})

const { company, homePage } = useCorporateContent()
const { t, tm } = usePublicI18n()
const { expertise, isLoading: isLoadingExpertise, fetchExpertise } = useExpertise()
const { works, isLoading: isLoadingWorks, fetchWorks } = useWorks()
const { news, isLoading: isLoadingNews, fetchNews } = useNews()
const { campaigns, fetchCampaigns } = useCampaigns()
const { clients, isLoading: isLoadingClients, fetchClients } = useClients()
const { fetchBanners, findBannerByPage } = useBanners()
const contactStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const contactMessage = ref('')
const contactFieldErrors = ref<Record<string, string>>({})
const contactForm = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const homeProjectLimit = ref(4)
const homeNewsLimit = ref(6)

const defaultServiceImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
const defaultProjectImage = 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80'
const stripHtml = (value = '') => String(value || '').replace(/<[^>]*>?/gm, '').trim()
const homeHeroBannerPages = ['home', 'services', 'projects', 'media-news', 'careers']
const bannerImage = (pageName: string, fallback: string) => {
  const banner = findBannerByPage(pageName)
  return banner?.media_url || fallback
}

const heroSlides = computed(() =>
  homePage.hero.slides.map((slide, index) => ({
    ...slide,
    image: bannerImage(homeHeroBannerPages[index] || 'home', slide.image)
  }))
)
const featuredImage = computed(() => bannerImage('services', homePage.hero.slides[3].image))
const aboutImage = computed(() => bannerImage('about-us', homePage.hero.slides[1].image))
const ctaImage = computed(() => bannerImage('careers', homePage.hero.slides[4].image))

const aboutPoints = computed(() => [
  t('home.about.pointOne'),
  t('home.about.pointTwo'),
  t('home.about.pointThree')
])

const highlightItems = computed(() =>
  tm<Array<{ value: string, label: string, description: string }>>('home.highlights.items') || []
)

const serviceIcons = [ServerCog, Globe2, MonitorSmartphone, BrainCircuit]
const serviceImages = [
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80'
]
const serviceFocus = computed(() =>
  (tm<Array<{ title: string, description: string }>>('home.serviceFocus') || []).map((item, index) => ({
    ...item,
    icon: serviceIcons[index] || ServerCog,
    image: serviceImages[index] || defaultServiceImage
  }))
)

const serviceShortLabel = (title: string) => {
  const text = title.toLowerCase()

  if (text.includes('dashboard') || text.includes('data')) return 'Dashboard'
  if (text.includes('website') || text.includes('web')) return 'Website'
  if (text.includes('cms')) return 'CMS'
  if (text.includes('mobile')) return 'Mobile'
  if (text.includes('api') || text.includes('backend')) return 'Integration'
  if (text.includes('ai')) return 'AI'
  if (text.includes('enterprise')) return 'Enterprise'

  return 'Service'
}

const serviceCarouselRef = ref<HTMLElement | null>(null)
const activeServiceIndex = ref(0)
const isServiceCarouselPaused = ref(false)
let serviceCarouselTimer: ReturnType<typeof setInterval> | null = null

const serviceCarouselItems = computed(() => {
  if (expertise.value.length) {
    return expertise.value.map((service, index) => ({
      key: `api-${service.id}`,
      title: service.name,
      description: stripHtml(service.description),
      image: service.icon_url || serviceImages[index % serviceImages.length] || defaultServiceImage,
      href: `/services/${service.slug}`,
      icon: null,
      shortLabel: serviceShortLabel(service.name)
    }))
  }

  return serviceFocus.value.map((service, index) => ({
    key: `focus-${service.title}`,
    title: service.title,
    description: service.description,
    image: service.image,
    href: '/services',
    icon: service.icon || serviceIcons[index] || ServerCog,
    shortLabel: serviceShortLabel(service.title)
  }))
})

const stopServiceCarousel = () => {
  if (!serviceCarouselTimer) return
  clearInterval(serviceCarouselTimer)
  serviceCarouselTimer = null
}

const serviceCardStep = () => {
  const container = serviceCarouselRef.value
  if (!container) return 0

  const card = container.querySelector<HTMLElement>('[data-service-card]')
  if (!card) return container.clientWidth

  return card.offsetWidth
}

const currentServiceCarouselIndex = () => {
  const container = serviceCarouselRef.value
  const step = serviceCardStep()
  if (!container || !step) return activeServiceIndex.value

  return Math.round(container.scrollLeft / step)
}

const serviceCarouselMaxScroll = () => {
  const container = serviceCarouselRef.value
  if (!container) return 0

  return Math.max(container.scrollWidth - container.clientWidth, 0)
}

const scrollServiceCarousel = async (index: number) => {
  const itemCount = serviceCarouselItems.value.length
  if (!import.meta.client || !itemCount) return

  await nextTick()

  const container = serviceCarouselRef.value
  if (!container) return

  const normalizedIndex = ((index % itemCount) + itemCount) % itemCount
  const maxScroll = serviceCarouselMaxScroll()
  const targetScroll = Math.min(serviceCardStep() * normalizedIndex, maxScroll)

  activeServiceIndex.value = normalizedIndex
  container.scrollTo({ left: targetScroll, behavior: 'smooth' })
}

const startServiceCarousel = () => {
  stopServiceCarousel()
  if (!import.meta.client || serviceCarouselItems.value.length <= 1) return

  serviceCarouselTimer = setInterval(() => {
    if (isServiceCarouselPaused.value) return
    goToNextService()
  }, 4200)
}

const goToNextService = () => {
  const container = serviceCarouselRef.value
  if (container && container.scrollLeft >= serviceCarouselMaxScroll() - 2) {
    scrollServiceCarousel(0)
    return
  }

  scrollServiceCarousel(currentServiceCarouselIndex() + 1)
}

const goToPreviousService = () => {
  const container = serviceCarouselRef.value
  if (container && container.scrollLeft <= 2) {
    scrollServiceCarousel(serviceCarouselItems.value.length - 1)
    return
  }

  scrollServiceCarousel(currentServiceCarouselIndex() - 1)
}

const pauseServiceCarousel = () => {
  isServiceCarouselPaused.value = true
}

const resumeServiceCarousel = () => {
  isServiceCarouselPaused.value = false
}

const whyPoints = computed(() =>
  tm<Array<{ title: string, description: string }>>('home.whyHavor.points') || []
)

const displayNews = computed(() => {
  if (news.value.length) return news.value

  return homePage.insights.items.map((item, index) => ({
    id: -(index + 1),
    title: item.title,
    category: item.category,
    excerpt: item.summary,
    image_url: item.image,
    slug: ''
  }))
})
const fallbackCampaignItems = computed(() => [
  {
    category: 'Digital Readiness',
    title: 'Operational Assessment for Growing Teams',
    excerpt: 'A focused campaign to map workflow gaps, clarify priorities, and prepare practical implementation steps.',
    image: featuredImage.value
  },
  {
    category: 'Implementation Support',
    title: 'Build, Improve, and Maintain Core Systems',
    excerpt: 'Support for companies that need dependable execution across web platforms, internal tools, and integrations.',
    image: aboutImage.value
  },
  {
    category: 'Long-Term Partnership',
    title: 'Technology Care for Business Continuity',
    excerpt: 'A structured support model for monitoring, iteration, and ongoing improvement after launch.',
    image: ctaImage.value
  }
])
const campaignItems = computed(() => {
  if (!campaigns.value.length) return fallbackCampaignItems.value

  return campaigns.value.slice(0, 3).map((campaign, index) => ({
    category: campaign.category,
    title: campaign.title,
    excerpt: campaign.excerpt,
    image: campaign.image_url || fallbackCampaignItems.value[index]?.image || ctaImage.value
  }))
})
const visibleHomeProjects = computed(() => works.value.slice(0, homeProjectLimit.value))
const canShowMoreHomeProjects = computed(() => works.value.length > visibleHomeProjects.value.length)
const showMoreHomeProjects = () => {
  homeProjectLimit.value += 4
}
const visibleHomeNews = computed(() => displayNews.value.slice(0, homeNewsLimit.value))
const canShowMoreHomeNews = computed(() => displayNews.value.length > visibleHomeNews.value.length)
const showMoreHomeNews = () => {
  homeNewsLimit.value += 3
}

onMounted(() => {
  fetchExpertise()
  fetchWorks()
  fetchNews()
  fetchCampaigns()
  fetchClients()
  fetchBanners()
  startServiceCarousel()
})

onBeforeUnmount(stopServiceCarousel)

watch(() => serviceCarouselItems.value.length, async () => {
  activeServiceIndex.value = 0
  await scrollServiceCarousel(0)
  startServiceCarousel()
})

const validateContactForm = () => {
  const errors: Record<string, string> = {}

  if (!contactForm.name.trim()) errors.name = 'Name is required.'
  if (!contactForm.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(contactForm.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!contactForm.subject.trim()) errors.subject = 'Subject is required.'
  if (!contactForm.message.trim()) errors.message = 'Message is required.'

  contactFieldErrors.value = errors

  if (Object.keys(errors).length) {
    contactStatus.value = 'error'
    contactMessage.value = Object.values(errors)[0]
    return false
  }

  return true
}

const resetContactForm = () => {
  contactForm.name = ''
  contactForm.email = ''
  contactForm.subject = ''
  contactForm.message = ''
}

const handleContactSubmit = async () => {
  if (!validateContactForm()) return

  contactStatus.value = 'loading'
  contactMessage.value = ''

  try {
    await submitContactMessage({
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      subject: contactForm.subject.trim(),
      message: contactForm.message.trim()
    })

    resetContactForm()
    contactFieldErrors.value = {}
    contactStatus.value = 'success'
    contactMessage.value = 'Your message has been sent successfully. Please wait while our team reviews your submission. We will contact you by email.'
  } catch (_error) {
    contactStatus.value = 'error'
    contactMessage.value = 'We could not submit your message. Please try again in a moment.'
  }
}
</script>
