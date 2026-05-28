<template>
  <div class="space-y-16 pb-8">
    <HeroSection
      :title="careerRole?.job_title || 'Career Detail'"
      :description="careerRole?.excerpt || 'Explore this opportunity and learn more about the role.'"
      :image="careerRole?.thumbnail || heroImage"
      image-alt="Career detail hero banner"
    >
      <template #actions>
        <NuxtLink to="/careers" class="btn-primary">Back to Careers</NuxtLink>
        <a :href="applyLink" class="btn-outline text-white border-white/20 hover:bg-white/10">Apply Now</a>
      </template>
    </HeroSection>

    <section class="marketing-section pt-0">
      <div class="marketing-container">
        <div v-if="isLoading" class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="marketing-card animate-pulse p-8">
            <div class="h-5 w-24 rounded bg-slate-100"></div>
            <div class="mt-4 h-10 w-3/4 rounded bg-slate-100"></div>
            <div class="mt-4 h-4 w-full rounded bg-slate-100"></div>
            <div class="mt-2 h-4 w-5/6 rounded bg-slate-100"></div>
          </div>
          <div class="marketing-card animate-pulse p-8">
            <div class="h-56 rounded bg-slate-100"></div>
          </div>
        </div>

        <div v-else-if="!careerRole" class="marketing-card p-8 text-center">
          <h2 class="font-display text-2xl font-semibold text-slate-900">Position not found</h2>
          <p class="mt-3 text-sm text-slate-500">{{ error || 'The requested career opportunity is not available.' }}</p>
          <NuxtLink to="/careers" class="btn-primary mt-6 inline-flex">Back to Careers</NuxtLink>
        </div>

        <div v-else class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <article class="space-y-8" v-motion-fade-up>
            <div class="border-l-2 border-[#1f5dcc] pl-5">
              <p class="marketing-kicker">Position Details</p>
              <h2 class="mt-4 font-display text-3xl font-semibold text-slate-900">{{ careerRole.job_title }}</h2>
              <p class="mt-4 text-sm leading-7 text-slate-500">{{ careerRole.excerpt }}</p>

              <div class="mt-6 border-t border-slate-200 pt-6">
                <div class="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-a:text-[var(--marketing-primary)]" v-html="sanitizeHtml(careerRole.job_description)"></div>
              </div>
            </div>

            <div id="apply" class="relative isolate overflow-hidden rounded-lg p-8 text-white">
              <img
                :src="careerRole.thumbnail || heroImage"
                :alt="`${careerRole.job_title} application`"
                class="absolute inset-0 h-full w-full object-cover"
              >
              <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,12,24,0.9)_0%,rgba(5,12,24,0.68)_100%)]"></div>
              <div class="relative">
                <h3 class="font-display text-2xl font-semibold text-white">Ready to apply?</h3>
                <p class="mt-2 text-white/78">We&apos;d love to hear from you. Send us your resume and a short note about why this role fits you.</p>
                <a :href="applyLink" class="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0e2344] transition hover:bg-[#edf4ff]">Apply Now</a>
              </div>
            </div>
          </article>

          <aside class="space-y-6" v-motion-fade-up>
            <img :src="careerRole.thumbnail || heroImage" :alt="careerRole.job_title" class="h-72 w-full rounded-lg object-cover">

            <div>
              <p class="marketing-kicker">Quick Facts</p>
              <div class="mt-4 space-y-4">
                <div class="border-b border-slate-200 pb-4 last:border-0">
                  <p class="text-xs font-medium uppercase tracking-normal text-slate-400">Role</p>
                  <p class="mt-1 font-medium text-slate-900">{{ careerRole.job_title }}</p>
                </div>
                <div class="border-b border-slate-200 pb-4 last:border-0">
                  <p class="text-xs font-medium uppercase tracking-normal text-slate-400">Slug</p>
                  <p class="mt-1 font-medium text-slate-900">/{{ careerRole.slug }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium uppercase tracking-normal text-slate-400">Contact</p>
                  <p class="mt-1 font-medium text-slate-900">careers@havor.com</p>
                </div>
              </div>
            </div>

            <div>
              <p class="marketing-kicker">Other Roles</p>
              <div class="mt-4 space-y-0 border-t border-slate-200">
                <NuxtLink
                  v-for="role in relatedRoles"
                  :key="role.slug"
                  :to="`/careers/${role.slug}`"
                  class="flex items-center justify-between border-b border-slate-200 py-4 transition hover:bg-slate-50"
                >
                  <span class="font-medium text-slate-800">{{ role.job_title }}</span>
                  <ArrowRight class="h-4 w-4 text-[var(--marketing-primary)]" />
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const { careers, error, fetchCareers, getCareerBySlug, isLoading } = useCareers()
const slug = computed(() => String(route.params.slug || ''))
const heroImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80'

onMounted(async () => {
  await fetchCareers()

  if (!error.value && !careerRole.value) {
    showError({
      statusCode: 404,
      statusMessage: 'Position not found'
    })
  }
})

const careerRole = computed(() => getCareerBySlug(slug.value))

const relatedRoles = computed(() => {
  if (!careerRole.value) return []
  return careers.value
    .filter((role) => role.slug !== slug.value)
    .slice(0, 3)
})

const applyLink = computed(() => `mailto:careers@havor.com?subject=${encodeURIComponent(`Application for ${careerRole.value?.job_title || 'this role'}`)}`)

usePageSeo({
  title: computed(() => careerRole.value ? `${careerRole.value.job_title} | Havor Smarta Digital` : 'Career | Havor Smarta Digital'),
  description: computed(() => careerRole.value ? careerRole.value.excerpt : 'Explore career opportunities at Havor Smarta Digital.'),
  path: computed(() => `/careers/${slug.value}`)
})
</script>
