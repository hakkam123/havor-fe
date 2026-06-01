<template>
  <footer class="border-t border-[#dbe6f4] bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)]">
    <div class="marketing-container py-12">
      <div class="grid gap-8 lg:grid-cols-[1.2fr_0.85fr_0.85fr_0.9fr]">
        <div>
          <div class="mb-4 inline-flex items-center gap-3">
            <img src="/logo-havor.svg" alt="Havor Smarta Digital" width="36" height="36" loading="lazy" decoding="async" class="h-9 w-9 rounded-full object-cover">
            <div>
              <p class="text-sm font-semibold text-[#0e2344]">Havor Smarta Digital</p>
            </div>
          </div>
          <p class="max-w-md text-[0.86rem] leading-6 text-slate-600">
            {{ t('footer.description') }}
          </p>
        </div>

        <div>
          <p class="text-sm font-semibold uppercase tracking-normal text-[#5374a8]">{{ t('footer.company') }}</p>
          <ul class="mt-4 space-y-2.5 text-[0.86rem] font-normal text-slate-600">
            <li><NuxtLink to="/about-us" class="hover:text-[#1f5dcc]">{{ t('nav.about') }}</NuxtLink></li>
            <li><NuxtLink to="/services" class="hover:text-[#1f5dcc]">{{ t('nav.services') }}</NuxtLink></li>
            <li><NuxtLink to="/projects" class="hover:text-[#1f5dcc]">{{ t('nav.works') }}</NuxtLink></li>
            <li><NuxtLink to="/media-news" class="hover:text-[#1f5dcc]">{{ t('nav.media') }}</NuxtLink></li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-semibold uppercase tracking-normal text-[#5374a8]">{{ t('footer.capabilities') }}</p>
          <ul class="mt-4 space-y-2.5 text-[0.86rem] font-normal text-slate-600">
            <li v-for="item in capabilityItems" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-semibold uppercase tracking-normal text-[#5374a8]">{{ t('footer.contact') }}</p>
          <ul class="mt-4 space-y-2.5 text-[0.86rem] font-normal text-slate-600">
            <li>{{ company.email }}</li>
            <li>{{ company.phone }}</li>
            <li>{{ company.office }}</li>
          </ul>
          <NuxtLink to="/#contact" class="mt-5 inline-flex text-sm font-medium text-[#0e2344] transition hover:text-[#1f5dcc]">
            {{ t('footer.start') }}
          </NuxtLink>
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-3 border-t border-[#dbe6f4] pt-5 text-xs font-normal text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{{ t('footer.copyright') }}</p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/about-us" class="hover:text-[#1f5dcc]">{{ t('footer.privacy') }}</NuxtLink>
          <NuxtLink to="/about-us" class="hover:text-[#1f5dcc]">{{ t('footer.terms') }}</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { company } = useCorporateContent()
const { t, tm } = usePublicI18n()
const capabilityItems = computed(() => tm<string[]>('footer.capabilityItems') || [])
</script>
