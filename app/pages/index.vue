<template>
  <div class="overflow-hidden bg-white">
    <LandingHeroCarousel
      :title="t('home.hero.title')"
      :subtitle="t('home.hero.subtitle')"
      :primary-cta="t('home.hero.primaryCta')"
      :secondary-cta="t('home.hero.secondaryCta')"
      :slides="heroSlides"
    />

    <section class="brand-section bg-white">
      <div class="marketing-container">
        <div class="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div class="relative overflow-hidden rounded-lg">
            <img
              :src="featuredImage"
              alt="Integrated digital platform"
              class="h-[22rem] w-full object-cover sm:h-[30rem]"
            >
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,11,24,0)_34%,rgba(3,11,24,0.72)_100%)]"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p class="max-w-sm text-sm font-semibold leading-6 text-white/82">
                {{ t('home.featured.caption') }}
              </p>
            </div>
          </div>

          <div class="lg:pl-8">
            <p class="brand-meta">{{ t('home.featured.label') }}</p>
            <h2 class="mt-4 max-w-3xl text-3xl font-bold leading-tight text-[#0e2344] sm:text-4xl lg:text-5xl">
              {{ t('home.featured.title') }}
            </h2>
            <p class="mt-5 max-w-2xl text-[0.98rem] leading-8 text-slate-600">
              {{ t('home.featured.description') }}
            </p>

            <div class="mt-8 space-y-4">
              <div
                v-for="item in aboutPoints"
                :key="item"
                class="flex gap-3 border-t border-[#e2eaf5] pt-4"
                v-motion-fade-up
              >
                <CheckCircle2 class="mt-0.5 h-5 w-5 shrink-0 text-[#1f5dcc]" />
                <p class="text-sm font-semibold leading-6 text-[#24415f]">{{ item }}</p>
              </div>
            </div>

            <NuxtLink to="/about-us" class="btn-outline mt-8">
              {{ t('home.featured.button') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="relative isolate overflow-hidden py-24 text-white sm:py-28">
      <img
        :src="aboutImage"
        alt="About Havor Smarta Digital"
        class="absolute inset-0 h-full w-full object-cover"
      >
      <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,14,31,0.88)_0%,rgba(4,14,31,0.62)_48%,rgba(4,14,31,0.18)_100%)]"></div>
      <div class="marketing-container">
        <div class="relative max-w-3xl">
          <p class="text-xs font-bold uppercase text-white/68">{{ t('home.about.kicker') }}</p>
          <h2 class="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {{ t('home.about.title') }}
          </h2>
          <p class="mt-5 max-w-2xl text-base leading-8 text-white/82">
            {{ t('home.about.intro') }}
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/services" class="inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0e2344] transition hover:bg-[#edf4ff]">
              {{ t('home.about.servicesCta') }}
            </NuxtLink>
            <NuxtLink to="/projects" class="inline-flex rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/18">
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

        <div class="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="item in highlightItems"
            :key="item.label"
            class="border-t border-[#dbe6f4] pt-5"
            v-motion-fade-up
          >
            <p class="text-4xl font-bold leading-none text-[#1f5dcc] sm:text-5xl">{{ item.value }}</p>
            <h3 class="mt-4 text-lg font-bold leading-tight text-[#0e2344]">{{ item.label }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-600">{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="brand-section bg-[#f5f8fc]">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p class="brand-meta">{{ t('home.clients.label') }}</p>
            <h2 class="mt-3 text-3xl font-bold leading-tight text-[#0e2344] sm:text-4xl">
              {{ t('home.clients.title') }}
            </h2>
            <p class="mt-4 text-[0.98rem] leading-8 text-slate-600">
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

          <div v-else class="brand-soft-panel p-8 text-center">
            <p class="font-medium text-slate-500">{{ t('home.clients.empty') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="services" class="brand-section bg-[#f5f8fc]">
      <div class="marketing-container">
        <SectionHeading
          :title="t('home.services.title')"
          :description="t('home.services.intro')"
        >
          <template #actions>
            <NuxtLink to="/services" class="btn-outline">{{ t('home.services.all') }}</NuxtLink>
          </template>
        </SectionHeading>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="item in serviceFocus"
            :key="item.title"
            class="group relative min-h-[20rem] overflow-hidden rounded-lg bg-[#08162e]"
            v-motion-fade-up
          >
            <img :src="item.image" :alt="item.title" class="absolute inset-0 h-full w-full object-cover opacity-74 transition duration-500 group-hover:scale-[1.04]">
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,14,31,0.08)_0%,rgba(4,14,31,0.9)_100%)]"></div>
            <div class="absolute inset-x-0 bottom-0 p-5 text-white">
              <component :is="item.icon" class="h-6 w-6 text-[#8dbdff]" />
              <h3 class="mt-4 text-xl font-bold leading-tight">{{ item.title }}</h3>
              <p class="mt-3 line-clamp-4 text-sm leading-6 text-white/76">{{ item.description }}</p>
              <span class="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase text-white/82">
                {{ t('home.services.explore') }}
                <ArrowRight class="h-4 w-4" />
              </span>
            </div>
          </article>
        </div>

        <div class="mt-12 border-t border-[#dbe6f4] pt-10">
          <div v-if="isLoadingExpertise && !expertise.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div v-for="item in 4" :key="item" class="brand-skeleton h-56"></div>
          </div>

          <div v-else-if="expertise.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <NuxtLink
              v-for="service in expertise.slice(0, 4)"
              :key="service.id"
              :to="`/services/${service.slug}`"
              class="group relative min-h-[18rem] overflow-hidden rounded-lg"
              :aria-label="`Open ${service.name} service detail`"
              v-motion-fade-up
            >
              <img :src="service.icon_url || defaultServiceImage" :alt="service.name" class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]">
              <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,14,31,0.12)_0%,rgba(4,14,31,0.88)_100%)]"></div>
              <div class="absolute inset-x-0 bottom-0 p-5">
                <h3 class="text-xl font-bold leading-tight text-white">{{ service.name }}</h3>
                <p v-if="service.description" class="mt-2 line-clamp-2 text-sm leading-6 text-white/76">{{ stripHtml(service.description) }}</p>
              </div>
            </NuxtLink>
          </div>

          <div v-else class="brand-soft-panel p-8 text-center">
            <p class="font-medium text-slate-500">{{ t('home.services.empty') }}</p>
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

        <div v-if="isLoadingWorks && !works.length" class="mt-10 grid gap-5 lg:grid-cols-2">
          <div v-for="item in 4" :key="item" class="brand-skeleton h-80"></div>
        </div>

        <div v-else-if="works.length" class="mt-10 grid gap-5 lg:grid-cols-2">
          <article
            v-for="(project, index) in works.slice(0, 4)"
            :key="project.id"
            class="group overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-[0_14px_42px_rgba(18,56,122,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(18,56,122,0.12)]"
            :class="index === 0 ? 'lg:col-span-2' : ''"
            v-motion-fade-up
          >
            <div class="grid gap-0" :class="index === 0 ? 'lg:grid-cols-[1.05fr_0.95fr]' : ''">
              <img
                :src="project.image_url || defaultProjectImage"
                :alt="project.title"
                class="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                :class="index === 0 ? 'lg:h-full' : ''"
              >
              <div class="p-6 sm:p-7">
                <div class="flex flex-wrap gap-2">
                  <span v-if="project.categoryName" class="brand-chip">{{ project.categoryName }}</span>
                  <span v-if="project.client" class="brand-chip">{{ project.client }}</span>
                </div>
                <h3 class="mt-5 text-2xl font-bold leading-tight text-[#0e2344]">{{ project.title }}</h3>
                <p class="mt-3 text-[0.94rem] leading-7 text-slate-600">{{ stripHtml(project.description) }}</p>
                <div class="mt-6">
                  <NuxtLink :to="`/projects/${project.slug}`" class="btn-outline px-4 py-2.5 text-xs">
                    {{ t('home.projects.detail') }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="mt-10 brand-soft-panel p-8 text-center">
          <p class="font-medium text-slate-500">{{ t('home.projects.empty') }}</p>
        </div>

        <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="project in projectExperience"
            :key="project.name"
            class="border-t border-[#dbe6f4] pt-4"
            v-motion-fade-up
          >
            <p class="brand-meta">{{ project.category }}</p>
            <p class="mt-2 text-[1.02rem] font-bold leading-6 text-[#0e2344]">{{ project.name }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="brand-section bg-[#f5f8fc]">
      <div class="marketing-container">
        <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <article>
            <h2 class="text-3xl font-bold leading-tight text-[#0e2344] sm:text-4xl">
              {{ t('home.whyHavor.title') }}
            </h2>
            <p class="mt-5 text-[0.98rem] leading-8 text-slate-600">
              {{ t('home.whyHavor.intro') }}
            </p>

            <div class="mt-8 border-l-4 border-[#1f5dcc] pl-5">
              <p class="text-[1.12rem] font-bold leading-8 text-[#0e2344]">
                {{ t('home.whyHavor.highlight') }}
              </p>
            </div>
          </article>

          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="point in whyPoints"
              :key="point.title"
              class="rounded-lg border border-[#dbe6f4] bg-white p-5 shadow-sm"
              v-motion-fade-up
            >
              <h3 class="brand-card-title">{{ point.title }}</h3>
              <p class="mt-3 brand-card-copy">{{ point.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section bg-white">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            :title="t('home.insights.title')"
            :description="t('home.insights.intro')"
          />

          <div class="lg:justify-self-end">
            <NuxtLink to="/media-news" class="btn-outline">{{ t('home.insights.all') }}</NuxtLink>
          </div>
        </div>

        <div v-if="isLoadingNews && !news.length" class="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="brand-skeleton h-[28rem]"></div>
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div v-for="item in 3" :key="item" class="brand-skeleton h-40"></div>
          </div>
        </div>

        <div v-else-if="displayNews.length" class="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article class="group relative min-h-[30rem] overflow-hidden rounded-lg" v-motion-fade-up>
            <img :src="displayNews[0].image_url" :alt="displayNews[0].title" class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]">
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,14,31,0.05)_0%,rgba(4,14,31,0.88)_100%)]"></div>
            <div class="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
              <p class="text-xs font-semibold uppercase text-white/70">{{ displayNews[0].category }}</p>
              <h3 class="mt-3 max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">{{ displayNews[0].title }}</h3>
              <p class="mt-3 max-w-xl text-sm leading-6 text-white/74">{{ displayNews[0].excerpt }}</p>
            </div>
          </article>

          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <article
              v-for="article in displayNews.slice(1, 5)"
              :key="article.id"
              class="grid overflow-hidden rounded-lg border border-[#dbe6f4] bg-white shadow-sm sm:grid-cols-[0.8fr_1.2fr] lg:min-h-[9.4rem]"
              v-motion-fade-up
            >
              <img :src="article.image_url" :alt="article.title" class="h-44 w-full object-cover sm:h-full">
              <div class="p-4">
                <p class="brand-meta">{{ article.category }}</p>
                <h3 class="mt-2 text-[1rem] font-bold leading-snug text-[#0e2344]">{{ article.title }}</h3>
                <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{{ article.excerpt }}</p>
              </div>
            </article>
          </div>
        </div>

        <div v-else class="mt-10 brand-soft-panel p-8 text-center">
          <p class="font-medium text-slate-500">{{ t('home.insights.empty') }}</p>
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
      :href="`mailto:${company.email}?subject=${encodeURIComponent('Contact PT Havor SMART Digital')}`"
    >
      <template #meta>
        <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/72">
          <span>{{ company.website }}</span>
          <span>{{ company.phone }}</span>
          <span>{{ company.email }}</span>
        </div>
      </template>
    </PublicImageCta>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, BrainCircuit, CheckCircle2, Globe2, MonitorSmartphone, ServerCog } from 'lucide-vue-next'
import { computed, onMounted } from 'vue'

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
const { clients, isLoading: isLoadingClients, fetchClients } = useClients()
const { fetchBanners, findBannerByPage } = useBanners()

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

const projectExperience = computed(() =>
  tm<Array<{ name: string, category: string }>>('home.projects.examples') || []
)

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
    image_url: item.image
  }))
})

onMounted(() => {
  fetchExpertise()
  fetchWorks()
  fetchNews()
  fetchClients()
  fetchBanners()
})
</script>
