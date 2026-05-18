<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      :title="servicesPage.hero.title"
      :subtitle="servicesPage.hero.subtitle"
      :image="servicesPage.hero.image"
      hero-size="half"
      image-label="Digital Expertise"
      image-title="Technology implementation shaped for enterprise clarity, scale, and operational fit."
      side-label="How We Help"
      side-title="Connected consulting, design, engineering, integration, and support."
      :side-copy="servicesPage.overview.intro"
      :highlights="[
        { label: 'Delivery Style', value: 'Tailored' },
        { label: 'Support Scope', value: 'End-to-End' }
      ]"
    >

      <template #aside>
        <p class="text-[0.7rem] font-bold uppercase tracking-normal text-[#5374a8]">Service Philosophy</p>
        <p class="mt-3 text-lg font-bold text-[#0e2344]">Every service is designed around real organizational needs, not a one-size-fits-all package.</p>
        <p class="mt-3 text-sm leading-7 text-slate-600">
          Havor helps clients define the right digital scope, then supports implementation with structure, responsiveness, and long-term thinking.
        </p>
      </template>
    </CorporatePageHero>

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article class="brand-panel p-7 sm:p-8">
            <SectionHeading
              :title="servicesPage.overview.title"
              :description="servicesPage.overview.intro"
            />
          </article>

          <div class="grid gap-4 md:grid-cols-3">
            <article
              v-for="point in servicesPage.overview.points"
              :key="point"
              class="brand-soft-panel flex min-h-[220px] items-center p-5"
              v-motion-fade-up
            >
              <p class="text-[1.2rem] leading-7 text-[#0e2344]">{{ point }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <SectionHeading
          title="Major service areas designed for structured digital delivery."
          description="Each service combines implementation depth with supporting deliverables so clients can move from direction to execution with confidence."
        />

        <div v-if="expertise.length" class="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <NuxtLink
            v-for="(service) in expertise"
            :key="service.id"
            :to="`/services/${service.slug}`"
            class="group brand-service-card"
            :aria-label="`Open ${service.name} service detail`"
            v-motion-fade-up
          >
            <img :src="service.icon_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'" :alt="service.name" class="brand-service-card-media">
            <div class="brand-service-card-overlay"></div>
            <div class="brand-service-card-body">
              <h3 class="brand-service-card-title">{{ service.name }}</h3>
            </div>
          </NuxtLink>
        </div>
        <div v-else class="mt-10 brand-soft-panel p-20 text-center">
          <h3 class="text-2xl font-bold text-[#0e2344]">Our services are being finalized</h3>
          <p class="mt-4 text-slate-600">We are currently updating our service offerings. Please contact us directly for inquiries regarding our technology solutions.</p>
          <NuxtLink to="/#contact" class="btn-primary mt-8 inline-flex">Get in touch</NuxtLink>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <article class="relative isolate overflow-hidden rounded-lg px-8 py-8 text-white shadow-[0_30px_90px_rgba(18,56,122,0.2)] sm:px-10 sm:py-10">
            <img
              :src="servicesPage.hero.image"
              alt="Havor service capability"
              class="absolute inset-0 h-full w-full object-cover"
            >
            <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,12,24,0.9)_0%,rgba(5,12,24,0.68)_100%)]"></div>
            <div class="relative">

            <h2 class="mt-6 text-[clamp(2.15rem,4vw,3.8rem)] font-bold leading-tight tracking-normal">
              Depth across platforms, operations, and long-term digital support.
            </h2>
            <p class="mt-6 text-base leading-8 text-white/80">
              Havor's capabilities extend beyond implementation into the practical details that make digital systems usable, maintainable, and aligned with organizational reality.
            </p>
            </div>
          </article>

          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="capability in servicesPage.capabilities.groups"
              :key="capability.title"
            class="brand-panel p-5"
            v-motion-fade-up
          >
              <h3 class="mt-2.5 brand-card-title">{{ capability.title }}</h3>
              <p class="mt-2.5 brand-card-copy">{{ capability.description }}</p>
              <div class="mt-5 flex flex-wrap gap-2">
                <span
                  v-for="tag in capability.tags"
                  :key="tag"
                  class="rounded-full border border-[#d6e5fb] bg-[#f7fbff] px-3 py-2 text-xs font-bold uppercase tracking-normal text-[#31527d]"
                >
                  {{ tag }}
                </span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <PublicImageCta
      :title="servicesPage.cta.title"
      :copy="servicesPage.cta.copy"
      :image="servicesPage.hero.image"
      image-alt="Service consultation"
      :action-label="servicesPage.cta.button"
      to="/#contact"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'Services | PT Havor Smarta Digital',
  description: 'Explore PT Havor Smarta Digital services across web development, mobile apps, custom software, system integration, UI/UX, IT consulting, and maintenance support.',
  path: '/services'
})

const { servicesPage } = useCorporateContent()
const { expertise, fetchExpertise } = useExpertise()

onMounted(() => {
  fetchExpertise()
})
</script>
