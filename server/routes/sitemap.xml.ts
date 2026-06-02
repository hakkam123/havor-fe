import { defineEventHandler, getRequestURL, setHeader } from 'h3'
import type { H3Event } from 'h3'

const publicRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about-us', changefreq: 'monthly', priority: '0.8' },
  { path: '/services', changefreq: 'weekly', priority: '0.9' },
  { path: '/projects', changefreq: 'weekly', priority: '0.8' },
  { path: '/products', changefreq: 'weekly', priority: '0.7' },
  { path: '/media-news', changefreq: 'weekly', priority: '0.7' },
  { path: '/careers', changefreq: 'weekly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' }
]

const getSiteUrl = (event: H3Event) => {
  const requestUrl = getRequestURL(event)
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || process.env.URL || `${requestUrl.protocol}//${requestUrl.host}`

  return siteUrl.replace(/\/$/, '')
}

export default defineEventHandler((event) => {
  const siteUrl = getSiteUrl(event)
  const urls = publicRoutes.map((route) => `
  <url>
    <loc>${siteUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`
})
