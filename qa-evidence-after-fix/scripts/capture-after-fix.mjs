import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000'
const apiBase = process.env.E2E_API_BASE || 'https://tplnext.com/havor/api'
const email = process.env.E2E_ADMIN_EMAIL || 'admin@havor.com'
const password = process.env.E2E_ADMIN_PASSWORD || 'admin123admin'
const outputRoot = path.join('qa-evidence-after-fix')

const ensure = (folder) => fs.mkdirSync(path.join(outputRoot, folder), { recursive: true })

const slugify = (value) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

const login = async () => {
  const response = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!response.ok) throw new Error(`Login failed: ${response.status}`)
  return response.json()
}

const apiGet = async (url, token) => {
  const response = await fetch(`${apiBase}${url}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  })
  if (!response.ok) return null
  return response.json()
}

const screenshot = async (page, folder, name) => {
  ensure(folder)
  await page.screenshot({
    path: path.join(outputRoot, folder, name),
    fullPage: true
  })
}

const main = async () => {
  const tokens = await login()
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  await context.addCookies([
    { name: 'auth_token', value: tokens.accessToken, url: baseURL },
    { name: 'refresh_token', value: tokens.refreshToken, url: baseURL }
  ])

  const page = await context.newPage()
  const adminPages = [
    ['banners', '/admin/banners'],
    ['categories', '/admin/categories'],
    ['clients', '/admin/clients'],
    ['services', '/admin/expertises'],
    ['works', '/admin/works'],
    ['news', '/admin/news'],
    ['products', '/admin/products'],
    ['careers', '/admin/careers'],
    ['contact', '/admin/inbox'],
    ['profile', '/admin/profile']
  ]

  for (const [folder, url] of adminPages) {
    await page.goto(`${baseURL}${url}`, { waitUntil: 'networkidle' })
    await screenshot(page, folder, '01-dashboard-list.png')
  }

  await page.goto(`${baseURL}/admin/categories`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /Create Category/i }).click()
  await page.getByRole('button', { name: /Save Category/i }).click()
  await screenshot(page, 'validation', '01-category-required-error.png')

  const publicPages = [
    ['home', '/'],
    ['services', '/services'],
    ['projects', '/projects'],
    ['media-news', '/media-news'],
    ['careers', '/careers'],
    ['products', '/products']
  ]

  for (const [name, url] of publicPages) {
    await page.goto(`${baseURL}${url}`, { waitUntil: 'networkidle' })
    await screenshot(page, 'public-pages', `${name}.png`)
  }

  const services = await apiGet('/expertise')
  const works = await apiGet('/works')
  const news = await apiGet('/news')
  const careers = await apiGet('/careers')

  const slugPages = [
    ['service-detail', `/services/${slugify(services?.find((item) => item.name === 'Full-stack Web Development')?.name || services?.[0]?.name || '')}`],
    ['work-detail', `/projects/${slugify(works?.find((item) => item.title === 'SIJALA Real-time Marine Report Portal')?.title || works?.[0]?.title || '')}`],
    ['news-detail', `/media-news/${slugify(news?.find((item) => item.title === 'How a CMS Helps Companies Manage Digital Content More Efficiently')?.title || news?.[0]?.title || '')}`],
    ['career-detail', `/careers/${slugify(careers?.find((item) => item.job_title === 'Frontend Developer Intern')?.job_title || careers?.[0]?.job_title || '')}`]
  ].filter(([, url]) => !url.endsWith('/'))

  for (const [name, url] of slugPages) {
    await page.goto(`${baseURL}${url}`, { waitUntil: 'networkidle' })
    await screenshot(page, 'slug-pages', `${name}.png`)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
  await screenshot(page, 'public-pages', 'home-mobile-390.png')

  await browser.close()
  fs.writeFileSync(path.join(outputRoot, 'screenshot-index.json'), JSON.stringify({
    adminPages,
    publicPages,
    slugPages
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
