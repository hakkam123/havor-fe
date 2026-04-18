<template>
  <div class="space-y-16 pb-8">
    <HeroSection
      kicker="Career Opportunity"
      :title="careerRole?.title || 'Career Detail'"
      :description="careerRole?.summary || 'Explore this opportunity and learn more about the role.'"
      :image="heroImage"
      image-alt="Career detail hero banner"
    >
      <template #actions>
        <NuxtLink to="/careers" class="btn-primary">Back to Careers</NuxtLink>
        <a href="#apply" class="btn-outline text-white border-white/20 hover:bg-white/10">Apply Now</a>
      </template>
    </HeroSection>

    <section class="marketing-section pt-0">
      <div class="marketing-container">
        <div v-if="!careerRole" class="marketing-card p-8 text-center">
          <h2 class="font-display text-2xl font-semibold text-slate-900">Position not found</h2>
          <p class="mt-3 text-sm text-slate-500">The requested career opportunity is not available.</p>
          <NuxtLink to="/careers" class="btn-primary mt-6 inline-flex">Back to Careers</NuxtLink>
        </div>

        <div v-else class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <!-- Main Content -->
          <article class="space-y-8" v-motion-fade-up>
            <!-- Role Header -->
            <div class="marketing-card p-8">
              <p class="marketing-kicker">Position Details</p>
              <h2 class="mt-4 font-display text-3xl font-semibold text-slate-900">{{ careerRole.title }}</h2>

              <div class="mt-6 flex flex-wrap gap-3">
                <span class="inline-flex items-center gap-2 rounded-full bg-[var(--marketing-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--marketing-primary)]">
                  {{ careerRole.level }}
                </span>
                <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  {{ careerRole.type }}
                </span>
                <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  {{ careerRole.location }}
                </span>
              </div>

              <div class="mt-6 border-t border-slate-200 pt-6">
                <p class="text-sm leading-8 text-slate-600">{{ careerRole.description }}</p>
              </div>
            </div>

            <!-- Responsibilities -->
            <div class="marketing-card p-8">
              <p class="marketing-kicker">What You'll Do</p>
              <h3 class="mt-4 font-display text-xl font-semibold text-slate-900">Responsibilities</h3>
              <ul class="mt-4 space-y-3">
                <li v-for="(responsibility, idx) in careerRole.responsibilities" :key="idx" class="flex gap-3">
                  <span class="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--marketing-primary-soft)]">
                    <span class="h-2 w-2 rounded-full bg-[var(--marketing-primary)]"></span>
                  </span>
                  <span class="text-sm leading-7 text-slate-600">{{ responsibility }}</span>
                </li>
              </ul>
            </div>

            <!-- Requirements -->
            <div class="marketing-card p-8">
              <p class="marketing-kicker">Who You Are</p>
              <h3 class="mt-4 font-display text-xl font-semibold text-slate-900">Requirements</h3>
              <ul class="mt-4 space-y-3">
                <li v-for="(requirement, idx) in careerRole.requirements" :key="idx" class="flex gap-3">
                  <span class="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--marketing-accent-gray)]/20">
                    <span class="h-2 w-2 rounded-full bg-[var(--marketing-accent-gray)]"></span>
                  </span>
                  <span class="text-sm leading-7 text-slate-600">{{ requirement }}</span>
                </li>
              </ul>
            </div>

            <!-- Application CTA -->
            <div id="apply" class="marketing-card flex flex-col gap-6 bg-gradient-to-br from-[var(--marketing-primary-soft)] to-[var(--marketing-primary-soft)]/50 p-8">
              <div>
                <h3 class="font-display text-2xl font-semibold text-slate-900">Ready to apply?</h3>
                <p class="mt-2 text-slate-600">We'd love to hear from you. Send us your resume and a note about why you're interested in this role.</p>
              </div>
              <a href="mailto:careers@havor.com?subject=Application for {{careerRole.title}}" class="btn-primary inline-flex w-fit">Apply Now</a>
            </div>
          </article>

          <!-- Sidebar -->
          <aside class="space-y-6" v-motion-fade-up>
            <!-- Quick Info -->
            <div class="marketing-card p-6">
              <p class="marketing-kicker">Quick Facts</p>
              <div class="mt-4 space-y-4">
                <div class="border-b border-slate-200 pb-4 last:border-0">
                  <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Team</p>
                  <p class="mt-1 font-medium text-slate-900">{{ careerRole.team }}</p>
                </div>
                <div class="border-b border-slate-200 pb-4 last:border-0">
                  <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Level</p>
                  <p class="mt-1 font-medium text-slate-900">{{ careerRole.level }}</p>
                </div>
                <div class="border-b border-slate-200 pb-4 last:border-0">
                  <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Type</p>
                  <p class="mt-1 font-medium text-slate-900">{{ careerRole.type }}</p>
                </div>
                <div class="border-b border-slate-200 pb-4 last:border-0">
                  <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Location</p>
                  <p class="mt-1 font-medium text-slate-900">{{ careerRole.location }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Posted</p>
                  <p class="mt-1 font-medium text-slate-900">
                    {{ formatDate(careerRole.postedAt) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Related Roles -->
            <div class="marketing-card p-6">
              <p class="marketing-kicker">Other Roles</p>
              <div class="mt-4 space-y-3">
                <NuxtLink
                  v-for="role in relatedRoles"
                  :key="role.slug"
                  :to="`/careers/${role.slug}`"
                  class="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition hover:bg-slate-50"
                >
                  <span class="font-medium text-slate-800">{{ role.title }}</span>
                  <ArrowRight class="h-4 w-4 text-[var(--marketing-primary)]" />
                </NuxtLink>
              </div>
            </div>

            <!-- Share -->
            <div class="marketing-card p-6">
              <p class="marketing-kicker">Share this role</p>
              <div class="mt-4 flex gap-2">
                <a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-[var(--marketing-primary)] hover:text-white transition" title="Share on Twitter">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-[var(--marketing-primary)] hover:text-white transition" title="Share on LinkedIn">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.292-1.194-2.292-1.195 0-1.38.932-1.38 1.893v4.577H8.265V9.359h2.47v.994h.034c.345-.517 1.188-1.305 2.446-1.305 2.612 0 3.095 1.718 3.095 3.958v4.332zM3.558 8.16a1.348 1.348 0 100 2.697 1.348 1.348 0 000-2.697zm1.143 13.518h-2.29V9.359h2.29v12.319zm12.137-24.657c1.455 0 2.633 1.174 2.633 2.623-.0 1.438-1.177 2.613-2.633 2.613-1.45 0-2.626-1.175-2.626-2.613.0-1.45 1.177-2.623 2.626-2.623" />
                  </svg>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const { careers, getCareerBySlug } = useCareers()
const slug = computed(() => String(route.params.slug || ''))

const heroImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80'

const careerRole = computed(() => getCareerBySlug(slug.value))

const relatedRoles = computed(() => {
  if (!careerRole.value) return []
  return careers.value
    .filter((role) => role.slug !== slug.value && role.team === careerRole.value.team)
    .slice(0, 3)
})

const formatDate = (dateStr) => {
  if (!dateStr) return 'Recently'
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateStr))
  } catch {
    return 'Recently'
  }
}

// Set SEO for career page
usePageSeo({
  title: careerRole.value ? `${careerRole.value.title} | Havor Smarta Digital` : 'Career | Havor Smarta Digital',
  description: careerRole.value ? careerRole.value.summary : 'Explore career opportunities at Havor Smarta Digital.',
  path: `/careers/${slug.value}`
})
</script>
