const legacyApiBase = process.env.VITE_API_BASE_URL?.replace(/\/+$/, '')
const legacyApiEndpoint = legacyApiBase
  ? legacyApiBase.endsWith('/api') ? legacyApiBase : `${legacyApiBase}/api`
  : ''
const defaultApiBase = '/havor/api'
const tinymceApiKey =
  process.env.NUXT_PUBLIC_TINYMCE_API_KEY
  || process.env.TINYMCE_API_KEY
  || process.env.VITE_TINYMCE_API_KEY
  || ''

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    pageTransition: {
      name: 'page-flow',
      mode: 'out-in'
    },
    layoutTransition: {
      name: 'layout-flow',
      mode: 'out-in'
    },
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0e2344' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo-havor.svg' },
        { rel: 'preload', href: '/fonts/PlusJakartaSans-Regular.ttf', as: 'font', type: 'font/ttf', crossorigin: '' },
        { rel: 'preload', href: '/fonts/PlusJakartaSans-SemiBold.ttf', as: 'font', type: 'font/ttf', crossorigin: '' },
        { rel: 'stylesheet', href: '/fonts/plus-jakarta-sans.css' }
      ]
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt'
  ],
  css: ['~/assets/css/tailwind.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || legacyApiEndpoint || defaultApiBase,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
      tinymceApiKey
    }
  }
})
