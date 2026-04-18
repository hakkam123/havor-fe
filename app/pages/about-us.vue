<template>
  <div class="space-y-16 pb-8">
    <HeroSection
      kicker="About Havor"
      title="A technology partner built on precision, ownership, and trust."
      description="We help enterprises accelerate digital delivery without sacrificing reliability. Our teams combine product thinking, technical depth, and execution discipline to deliver outcomes that last."
      :image="heroImage"
      image-alt="About Havor hero banner"
    >
      <template #actions>
        <NuxtLink to="/projects" class="btn-primary">See Our Work</NuxtLink>
        <NuxtLink to="/careers" class="btn-outline text-white border-white/20 hover:bg-white/10">Join the Team</NuxtLink>
      </template>
    </HeroSection>

    <section class="marketing-section pt-0">
      <div class="marketing-container">
        <div class="grid gap-6 md:grid-cols-3">
          <article v-for="value in values" :key="value.title" class="marketing-card p-6" v-motion-fade-up>
            <h2 class="font-display text-xl font-semibold text-slate-900">{{ value.title }}</h2>
            <p class="mt-3 text-sm leading-7 text-slate-500">{{ value.description }}</p>
          </article>
        </div>

        <div class="mt-10 marketing-card p-7" v-motion-fade-up>
          <h2 class="font-display text-2xl font-semibold text-slate-900">Our Journey</h2>
          <div class="mt-6 grid gap-4 md:grid-cols-3">
            <div v-for="milestone in milestones" :key="milestone.year" class="rounded-xl border border-[#d8e1ee] bg-slate-50 p-4">
              <p class="font-display text-3xl font-semibold text-[#1846a3]">{{ milestone.year }}</p>
              <p class="mt-2 text-sm font-semibold text-slate-900">{{ milestone.title }}</p>
              <p class="mt-1 text-sm text-slate-500">{{ milestone.description }}</p>
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
  title: 'About Us | Havor Smarta Digital',
  description: 'Learn about Havor Smarta Digital, our mission, company journey, and how we build lasting digital products.',
  path: '/about-us'
})

const heroImage = 'https://images.unsplash.com/photo-1573167243872-43c6433b9d40?auto=format&fit=crop&w=1600&q=80'

const values = [
  {
    title: 'Craftsmanship',
    description: 'We build with technical rigor and attention to detail from architecture to release.'
  },
  {
    title: 'Partnership',
    description: 'We embed with your teams, communicate transparently, and stay accountable to outcomes.'
  },
  {
    title: 'Sustainability',
    description: 'We optimize for maintainability, security, and long-term business leverage.'
  }
]

const milestones = [
  {
    year: '2010',
    title: 'Company Founded',
    description: 'Started as a boutique engineering team focused on enterprise web delivery.'
  },
  {
    year: '2017',
    title: 'Regional Expansion',
    description: 'Scaled delivery hubs and launched mobile/cloud practice lines.'
  },
  {
    year: '2024',
    title: 'AI Enablement Era',
    description: 'Expanded into intelligent workflow platforms and data-driven modernization.'
  }
]
</script>
