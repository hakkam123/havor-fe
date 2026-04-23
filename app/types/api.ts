export type ApiId = number | string

export type ApiBanner = {
  id: ApiId
  page_name?: string | null
  title?: string | null
  subtitle?: string | null
  media_url?: string | null
  media_type?: string | null
  slug?: string | null
}

export type Banner = {
  id: number
  page_name: string
  title: string
  subtitle: string
  media_url: string
  media_type: string
  slug: string
}

export type ApiCategory = {
  id: ApiId
  name?: string | null
}

export type Category = {
  id: number
  name: string
  slug: string
}

export type ApiClient = {
  id: ApiId
  name?: string | null
  description?: string | null
  client_icon?: string | null
}

export type Client = {
  id: number
  name: string
  description: string
  excerpt: string
  client_icon: string
}

export type ApiCareer = {
  id: ApiId
  job_title?: string | null
  job_description?: string | null
  thumbnail?: string | null
}

export type Career = {
  id: number
  job_title: string
  job_description: string
  excerpt: string
  thumbnail: string
  slug: string
}

export type ApiExpertise = {
  id: ApiId
  name?: string | null
  description?: string | null
  icon_url?: string | null
  slug?: string | null
}

export type Expertise = {
  id: number
  name: string
  description: string
  icon_url: string
  slug: string
}

export type ApiNewsItem = {
  id: ApiId
  title?: string | null
  slug?: string | null
  content?: string | null
  category?: string | null
  is_published?: boolean | number | string | null
  image_url?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type NewsItem = {
  id: number
  title: string
  slug: string
  content: string
  category: string
  is_published: boolean
  image_url: string
  excerpt: string
  readTime: number
  createdAt: string | null
  updatedAt: string | null
}

export type ApiProduct = {
  id: ApiId
  name?: string | null
  description?: string | null
  image_url?: string | null
  external_link?: string | null
  categoryId?: ApiId | null
  category_name?: string | null
  categoryName?: string | null
}

export type Product = {
  id: number
  name: string
  description: string
  image_url: string
  external_link: string
  categoryId: number | null
  categoryName: string
}

export type ApiWork = {
  id: ApiId
  title?: string | null
  description?: string | null
  client?: string | null
  year?: number | string | null
  image_url?: string | null
  categoryId?: ApiId | null
  category_name?: string | null
  categoryName?: string | null
  slug?: string | null
}

export type Work = {
  id: number
  title: string
  description: string
  client: string
  year: number | null
  image_url: string
  categoryId: number | null
  categoryName: string
  slug: string
}

export type ApiContactMessage = {
  id: ApiId
  name?: string | null
  email?: string | null
  subject?: string | null
  message?: string | null
  is_read?: boolean | number | string | null
  createdAt?: string | null
}

export type ContactMessage = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  body: string
  summary: string
  is_read: boolean
  createdAt: string | null
  dateLabel: string
}
