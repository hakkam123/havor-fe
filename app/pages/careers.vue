<template>
  <div class="overflow-hidden">
    <CorporatePageHero
      :title="careersPage.hero.title"
      :subtitle="careersPage.hero.subtitle"
      :image="careersPage.hero.image"
      image-label="Team Culture"
      image-title="A collaborative environment for people who want to build meaningful digital work."
      side-label="Career Experience"
      side-title="Professional growth through serious projects, supportive teamwork, and structured delivery."
      :side-copy="careersPage.culture.narrative"
      :highlights="[
        { label: 'Open Roles', value: String(careersPage.roles.length) },
        { label: 'Work Style', value: 'Collaborative' },
        { label: 'Growth', value: 'Continuous' }
      ]"
    >
      <template #actions>
        <NuxtLink to="#open-roles" class="btn-primary">Open Roles</NuxtLink>
        <NuxtLink to="/about-us" class="btn-outline">About Our Company</NuxtLink>
      </template>

      <template #aside>
        <p class="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#5374a8]">Why Careers Matter</p>
        <p class="mt-3 text-lg font-extrabold text-[#0e2344]">We build a team that can think clearly, collaborate well, and create meaningful impact.</p>
        <p class="mt-3 text-sm leading-7 text-slate-600">
          Havor values ownership, curiosity, and respect. The team environment is structured, supportive, and focused on quality.
        </p>
      </template>
    </CorporatePageHero>

    <section class="brand-section pt-12">
      <div class="marketing-container">
        <div class="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
          <article class="brand-panel p-8 sm:p-10">
            <SectionHeading
              :title="careersPage.culture.title"
              :description="careersPage.culture.narrative"
            />
          </article>

          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="value in careersPage.culture.values"
              :key="value.title"
              class="brand-soft-panel p-6"
              v-motion-fade-up
            >
              <p class="brand-meta">Culture Value</p>
              <h3 class="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-[#0e2344]">{{ value.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-slate-600">{{ value.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0">
      <div class="marketing-container">
        <div class="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <article class="overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#0f2b57_0%,#1f5dcc_55%,#79adff_140%)] px-8 py-8 text-white shadow-[0_30px_90px_rgba(18,56,122,0.2)] sm:px-10 sm:py-10">
            <p class="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-white/78 inline-flex">
              Why Work With Us
            </p>
            <h2 class="mt-6 text-[clamp(2.15rem,4vw,3.8rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Join a team where growth, meaningful work, and support move together.
            </h2>
            <p class="mt-6 text-base leading-8 text-white/80">
              Havor offers a professional environment that values steady development, thoughtful collaboration, and digital work that matters to real clients.
            </p>
          </article>

          <div class="grid gap-4 md:grid-cols-2">
            <article
              v-for="item in careersPage.whyWorkHere.items"
              :key="item.title"
              class="brand-panel p-6"
              v-motion-fade-up
            >
              <p class="brand-meta">Benefit</p>
              <h3 class="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-[#0e2344]">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-slate-600">{{ item.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="open-roles" class="brand-section pt-0">
      <div class="marketing-container">
        <SectionHeading
          title="Current opportunities to build with PT Havor SMART Digital."
          description="Each role is presented as a polished corporate listing with clear team, type, location, and role summary."
        />

        <div class="mt-10 grid gap-6 lg:grid-cols-2">
          <article
            v-for="role in careersPage.roles"
            :key="role.title"
            class="brand-panel p-7"
            v-motion-fade-up
          >
            <div class="flex flex-wrap gap-2">
              <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ role.team }}</span>
              <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ role.type }}</span>
              <span class="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#1f5dcc]">{{ role.location }}</span>
            </div>
            <h3 class="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-[#0e2344]">{{ role.title }}</h3>
            <p class="mt-4 text-sm leading-7 text-slate-600">{{ role.summary }}</p>
            <a :href="`mailto:${company.email}?subject=${encodeURIComponent(`Application - ${role.title}`)}`" class="btn-outline mt-6">
              Apply Now
            </a>
          </article>
        </div>
      </div>
    </section>

    <section class="brand-section pt-0 pb-24">
      <div class="marketing-container">
        <div class="brand-soft-panel px-8 py-8 sm:px-10 sm:py-10">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="max-w-3xl">
              <p class="brand-kicker">Hiring CTA</p>
              <h2 class="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0e2344]">
                {{ careersPage.cta.title }}
              </h2>
              <p class="mt-4 text-base leading-8 text-slate-600">
                {{ careersPage.cta.copy }}
              </p>
            </div>
            <a :href="`mailto:${company.email}?subject=${encodeURIComponent('Career Inquiry')}`" class="btn-primary">
              Connect With Us
            </a>
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
  title: 'Careers | PT Havor SMART Digital',
  description: 'Explore career opportunities at PT Havor SMART Digital and join a collaborative team building meaningful digital solutions.',
  path: '/careers'
})

const { company, careersPage } = useCorporateContent()
</script>
