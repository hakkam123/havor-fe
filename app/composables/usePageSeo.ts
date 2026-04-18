import { toValue } from 'vue'
import type { Ref } from 'vue'

type PageSeoOptions = {
  title: string | Ref<string>
  description: string | Ref<string>
  path?: string | Ref<string>
  image?: string | Ref<string>
  type?: 'website' | 'article'
  noindex?: boolean
}

export const usePageSeo = (options: PageSeoOptions) => {
  const route = useRoute()
  const config = useRuntimeConfig()

  const baseUrl = computed(() => {
    const siteUrl = config.public.siteUrl || 'http://localhost:3000'
    return siteUrl.replace(/\/$/, '')
  })

  const canonicalUrl = computed(() => `${baseUrl.value}${toValue(options.path) || route.path}`)
  const imageUrl = computed(() => {
    const image = toValue(options.image)
    if (!image) return ''
    if (/^(https?:|data:|blob:)/i.test(image)) return image
    if (image.startsWith('/')) return `${baseUrl.value}${image}`
    return `${baseUrl.value}/${image}`
  })

  useSeoMeta({
    title: () => toValue(options.title),
    description: () => toValue(options.description),
    ogTitle: () => toValue(options.title),
    ogDescription: () => toValue(options.description),
    ogType: options.type || 'website',
    ogUrl: canonicalUrl,
    ogImage: imageUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: () => toValue(options.title),
    twitterDescription: () => toValue(options.description),
    twitterImage: imageUrl,
    robots: options.noindex ? 'noindex,nofollow' : 'index,follow'
  })

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }]
  })
}
