import fs from 'node:fs/promises'
import path from 'node:path'

const API_BASE = process.env.HAVOR_API_BASE || 'https://tplnext.com/havor/api'
const EMAIL = process.env.HAVOR_ADMIN_EMAIL
const PASSWORD = process.env.HAVOR_ADMIN_PASSWORD
const outputDir = path.resolve('qa-evidence-after-fix/banner-downloads')

const banners = [
  {
    page_name: 'home',
    title: 'Your Digital IT Partner Solution',
    subtitle: 'Integrated technology solutions, custom applications, websites, mobile apps, and intelligent systems to support business growth and digital transformation.',
    source: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=85'
  },
  {
    page_name: 'about-us',
    title: 'About Havor Smarta Digital',
    subtitle: 'A technology partner focused on scalable digital solutions and long-term business transformation.',
    source: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=85'
  },
  {
    page_name: 'services',
    title: 'Digital Solutions Built for Business Operations',
    subtitle: 'Explore enterprise IT solutions, websites, mobile apps, dashboards, and intelligent systems for modern organizations.',
    source: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=85'
  },
  {
    page_name: 'projects',
    title: 'Project Experience',
    subtitle: 'Selected implementations across enterprise platforms, web applications, dashboards, mobile apps, and digital business systems.',
    source: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=85'
  },
  {
    page_name: 'media-news',
    title: 'Media & News',
    subtitle: 'Company updates, practical technology insights, and perspectives from Havor Smarta Digital.',
    source: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=85'
  },
  {
    page_name: 'careers',
    title: 'Careers at Havor',
    subtitle: 'Build meaningful digital products with a collaborative technology team.',
    source: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=85'
  },
  {
    page_name: 'products',
    title: 'Digital Products',
    subtitle: 'Ready-to-adapt product packages and implementation starters managed from the Havor dashboard.',
    source: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=85'
  }
]

const api = async (url, options = {}) => {
  const response = await fetch(`${API_BASE}${url}`, options)
  const bodyText = await response.text()
  const body = bodyText ? JSON.parse(bodyText) : null

  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${url} failed (${response.status}): ${bodyText}`)
  }

  return body
}

const login = async () => {
  if (!EMAIL || !PASSWORD) {
    throw new Error('Set HAVOR_ADMIN_EMAIL and HAVOR_ADMIN_PASSWORD before running this script.')
  }

  const result = await api('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  })

  const token = result?.token || result?.accessToken || result?.access_token || result?.data?.token || result?.data?.accessToken
  if (!token) throw new Error('Login succeeded but no access token was returned.')

  return token
}

const downloadImage = async (banner) => {
  await fs.mkdir(outputDir, { recursive: true })
  const response = await fetch(banner.source)

  if (!response.ok) {
    throw new Error(`Image download failed for ${banner.page_name}: ${response.status}`)
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const extension = contentType.includes('png') ? 'png' : 'jpg'
  const filePath = path.join(outputDir, `${banner.page_name}.${extension}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  await fs.writeFile(filePath, buffer)

  return { filePath, buffer, contentType, fileName: `${banner.page_name}.${extension}` }
}

const uploadBanner = async (token, existing, banner, image) => {
  const formData = new FormData()
  formData.set('page_name', banner.page_name)
  formData.set('title', banner.title)
  formData.set('subtitle', banner.subtitle)
  formData.set('media_type', 'image')
  formData.set('media_url', new File([image.buffer], image.fileName, { type: image.contentType }))

  const endpoint = existing ? `/banners/${existing.id}` : '/banners'
  const method = existing ? 'PUT' : 'POST'

  return api(endpoint, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  })
}

const normalizePageName = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')

const main = async () => {
  const token = await login()
  const existingBanners = await api('/banners', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const report = []

  for (const banner of banners) {
    const image = await downloadImage(banner)
    const existing = existingBanners.find((item) => normalizePageName(item.page_name) === banner.page_name)
    const result = await uploadBanner(token, existing, banner, image)

    report.push({
      page_name: banner.page_name,
      action: existing ? 'updated' : 'created',
      id: result?.id || existing?.id,
      local_file: image.filePath,
      media_url: result?.media_url || existing?.media_url
    })
  }

  await fs.writeFile(
    path.join(outputDir, 'upload-report.json'),
    JSON.stringify({
      apiBase: API_BASE,
      uploadedAt: new Date().toISOString(),
      banners: report
    }, null, 2)
  )

  console.table(report)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
