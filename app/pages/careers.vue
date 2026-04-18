<template>
  <div class="space-y-16 pb-8">
    <HeroSection
      kicker="Join The Team"
      title="Build meaningful products with a high-trust engineering culture."
      description="We are always looking for curious builders who care about quality, collaboration, and measurable customer impact."
      :image="heroImage"
      image-alt="Careers hero banner"
    >
      <template #actions>
        <NuxtLink to="#open-roles" class="btn-primary">Open Roles</NuxtLink>
        <NuxtLink to="/about-us" class="btn-outline text-white border-white/20 hover:bg-white/10">Our Story</NuxtLink>
      </template>
    </HeroSection>

    <section id="open-roles" class="marketing-section pt-0">
      <div class="marketing-container">
        <div class="flex flex-col gap-8">
          <div>
            <p class="marketing-kicker">Opportunities</p>
            <h2 class="marketing-title max-w-2xl">Find the role that matches your expertise and growth goals.</h2>
          </div>

          <ListingToolbar
            :search-value="searchQuery"
            @update:search="searchQuery = $event"
            @reset="resetFilters"
            :result-count="filteredRoles.length"
          />
        </div>

        <div class="space-y-4">
          <NuxtLink
            v-for="role in filteredRoles"
            :key="role.slug"
            :to="`/careers/${role.slug}`"
            class="marketing-card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between transition duration-300 hover:shadow-[0_20px_45px_rgba(15,23,42,0.1)] hover:bg-slate-50"
            v-motion-fade-up
          >
            <div class="flex-1">
              <h2 class="font-display text-2xl font-semibold text-slate-900">{{ role.title }}</h2>
              <div class="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{{ role.location }}</span>
                <span>·</span>
                <span>{{ role.type }}</span>
                <span>·</span>
                <span class="font-semibold text-[var(--marketing-primary)]">{{ role.level }}</span>
              </div>
              <p class="mt-3 text-sm leading-6 text-slate-600">{{ role.summary }}</p>
            </div>
            <div class="flex items-center gap-2 font-semibold text-[var(--marketing-primary)] whitespace-nowrap">
              <span>View details</span>
              <ArrowRight class="h-4 w-4" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

usePageSeo({
  title: 'Careers | Havor Smarta Digital',
  description: 'Explore open roles at Havor Smarta Digital and join a high-trust team building meaningful products.',
  path: '/careers'
})

const { careers } = useCareers()
const heroImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80'

const searchQuery = ref('')

const filteredRoles = computed(() => {
  if (!searchQuery.value) return careers.value

  const query = searchQuery.value.toLowerCase()
  return careers.value.filter(
    (role) =>
      role.title.toLowerCase().includes(query) ||
      role.summary.toLowerCase().includes(query) ||
      role.location.toLowerCase().includes(query) ||
      role.team.toLowerCase().includes(query) ||
      role.level.toLowerCase().includes(query)
  )
})

const resetFilters = () => {
  searchQuery.value = ''
}
</script>
