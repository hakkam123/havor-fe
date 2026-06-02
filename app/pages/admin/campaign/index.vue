<template>
  <div class="space-y-6" v-motion-fade-up>
    <section class="admin-hero">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p class="admin-kicker">Campaign</p>
          <h1 class="admin-title">Campaign Workspace</h1>
          <p class="admin-copy">Review company campaign content and keep campaign-related public calls to action aligned with current business priorities.</p>
        </div>

        <NuxtLink to="/" target="_blank" class="admin-secondary-btn">
          View Landing Page
        </NuxtLink>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <article v-for="item in campaignItems" :key="item.title" class="admin-panel p-5">
        <p class="admin-kicker">{{ item.kicker }}</p>
        <h2 class="mt-3 text-lg font-semibold leading-snug text-slate-900">{{ item.title }}</h2>
        <p class="mt-3 text-sm leading-6 text-slate-500">{{ item.copy }}</p>
      </article>
    </section>
  </div>
</template>

<script setup>
const campaignItems = [
  {
    kicker: 'Digital Readiness',
    title: 'Operational Assessment for Growing Teams',
    copy: 'Maps workflow gaps, priority systems, and practical implementation steps for teams preparing digital improvement.'
  },
  {
    kicker: 'Implementation Support',
    title: 'Build, Improve, and Maintain Core Systems',
    copy: 'Keeps website, internal tools, integrations, and reporting initiatives connected to delivery outcomes.'
  },
  {
    kicker: 'Long-Term Partnership',
    title: 'Technology Care for Business Continuity',
    copy: 'Supports monitoring, iteration, and follow-up improvements after the first launch.'
  }
]
</script>
