import { defineEventHandler, getRequestURL, setHeader } from 'h3'
import type { H3Event } from 'h3'

const getSiteUrl = (event: H3Event) => {
  const requestUrl = getRequestURL(event)
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || process.env.URL || `${requestUrl.protocol}//${requestUrl.host}`

  return siteUrl.replace(/\/$/, '')
}

export default defineEventHandler((event) => {
  const siteUrl = getSiteUrl(event)

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return [
    'User-Agent: *',
    'Disallow:',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`
  ].join('\n')
})
