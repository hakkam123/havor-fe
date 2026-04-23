import { computed } from 'vue'

export type ProjectEntry = {
  slug: string
  title: string
  category: string
  industry: string
  summary: string
  challenge: string
  solution: string
  impact: string
  metric: string
  technologies: string[]
  image: string
  client: string
  deliveryTitle: string
  deliverySummary: string
  businessOutcome: string
}

export type MediaArticleEntry = {
  slug: string
  kind: 'press-release' | 'news'
  category: string
  title: string
  summary: string
  date: string
  tags: string[]
  image: string
  readTime: string
  overview: string
  body: string[]
}

export const useCorporateRoutes = () => {
  const { company } = useCorporateContent()

  const { data: projectsData } = useFetch<ProjectEntry[]>('/data/projects.json', {
    key: 'public-projects',
    default: () => []
  })

  const { data: mediaData } = useFetch<MediaArticleEntry[]>('/data/media-news.json', {
    key: 'public-media-news',
    default: () => []
  })

  const projectEntries = computed(() => projectsData.value ?? [])
  const mediaArticles = computed(() => mediaData.value ?? [])
  const pressReleaseEntries = computed(() => mediaArticles.value.filter((item) => item.kind === 'press-release'))
  const newsEntries = computed(() => mediaArticles.value.filter((item) => item.kind === 'news'))

  const getProjectBySlug = (slug: string) => projectEntries.value.find((project) => project.slug === slug) || null
  const getMediaArticleBySlug = (slug: string) => mediaArticles.value.find((article) => article.slug === slug) || null

  return {
    company,
    projectEntries,
    mediaArticles,
    pressReleaseEntries,
    newsEntries,
    getProjectBySlug,
    getMediaArticleBySlug
  }
}
