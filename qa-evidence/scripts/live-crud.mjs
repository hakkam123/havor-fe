import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const apiBase = process.env.QA_API_BASE || 'https://tplnext.com/havor/api'
const email = process.env.QA_ADMIN_EMAIL
const password = process.env.QA_ADMIN_PASSWORD
const phase = process.argv[2] || 'setup'
const rootDir = path.resolve('qa-evidence')
const assetDir = path.join(rootDir, 'assets')
const statePath = path.join(rootDir, 'state.json')

if (!email || !password) {
  throw new Error('Set QA_ADMIN_EMAIL and QA_ADMIN_PASSWORD before running this script.')
}

const moduleDirs = [
  'banners',
  'categories',
  'clients',
  'services',
  'works',
  'news',
  'products',
  'careers',
  'contact',
  'profile'
]

const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
const results = {
  phase,
  apiBase,
  timestamp,
  modules: {},
  validation: {},
  cleanup: {},
  notes: []
}

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const stripHtml = (value = '') => String(value).replace(/<[^>]*>?/gm, '').trim()

const ensureEvidenceDirs = async () => {
  await mkdir(rootDir, { recursive: true })
  await mkdir(path.join(rootDir, 'scripts'), { recursive: true })
  await Promise.all(moduleDirs.map((dir) => mkdir(path.join(rootDir, dir), { recursive: true })))
}

const login = async () => {
  const response = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const body = await parseBody(response)
  if (!response.ok || !body.accessToken) {
    throw new Error(`Login failed: ${response.status} ${JSON.stringify(body)}`)
  }
  return body
}

const parseBody = async (response) => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const request = async (url, options = {}) => {
  const {
    method = 'GET',
    token,
    json,
    form,
    auth = true,
    ok = [200, 201]
  } = options

  const headers = {}
  let body
  if (auth && token) headers.authorization = `Bearer ${token}`
  if (json !== undefined) {
    headers['content-type'] = 'application/json'
    body = JSON.stringify(json)
  }
  if (form) body = form

  const response = await fetch(`${apiBase}${url}`, { method, headers, body })
  const data = await parseBody(response)
  const accepted = Array.isArray(ok) ? ok.includes(response.status) : response.status === ok

  if (!accepted) {
    const error = new Error(`${method} ${url} failed: ${response.status} ${JSON.stringify(data)}`)
    error.status = response.status
    error.data = data
    throw error
  }

  return { status: response.status, data }
}

const formData = async (fields, fileField, fileName, mimeType = 'image/png') => {
  const form = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) form.set(key, String(value))
  }
  if (fileField && fileName) {
    const filePath = path.join(assetDir, fileName)
    const bytes = await readFile(filePath)
    form.set(fileField, new Blob([bytes], { type: mimeType }), fileName)
  }
  return form
}

const expectFailure = async (key, fn) => {
  try {
    const result = await fn()
    results.validation[key] = {
      status: result.status,
      result: 'FAIL',
      note: 'Request unexpectedly succeeded.'
    }
  } catch (error) {
    results.validation[key] = {
      status: error.status || 'ERR',
      result: error.status && error.status < 500 ? 'PASS' : 'FAIL',
      note: error.data?.message || error.message
    }
  }
}

const findBy = async (url, predicate) => {
  const { data } = await request(url, { auth: false })
  return Array.isArray(data) ? data.find(predicate) || null : null
}

const writeState = async (state) => {
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
}

const readState = async () => JSON.parse(await readFile(statePath, 'utf8'))

const setup = async () => {
  await ensureEvidenceDirs()
  const auth = await login()
  const token = auth.accessToken

  const state = {
    apiBase,
    frontendBase: process.env.QA_FRONTEND_BASE || 'http://localhost:3000',
    timestamp,
    created: {},
    updated: {},
    slugs: {},
    publicExpectations: {}
  }

  await expectFailure('auth.protectedCategoryWithoutToken', () =>
    request('/categories', {
      method: 'POST',
      auth: false,
      json: { name: `QA Test - Unauthorized - ${timestamp}` },
      ok: [200, 201]
    })
  )
  await expectFailure('categories.emptyName', () =>
    request('/categories', { method: 'POST', token, json: { name: '' } })
  )
  await expectFailure('banners.missingMedia', () =>
    request('/banners', {
      method: 'POST',
      token,
      form: new FormData()
    })
  )
  await expectFailure('clients.missingDescription', async () =>
    request('/clients', {
      method: 'POST',
      token,
      form: await formData({ name: `QA Test - Client Invalid - ${timestamp}` }, 'client_icon', 'qa-test-client-logo.png')
    })
  )
  await expectFailure('services.missingDescription', async () =>
    request('/expertise', {
      method: 'POST',
      token,
      form: await formData({ name: `QA Test - Service Invalid - ${timestamp}` }, 'icon_url', 'qa-test-service-icon.png')
    })
  )
  await expectFailure('works.invalidYear', async () =>
    request('/works', {
      method: 'POST',
      token,
      form: await formData(
        { title: `QA Test - Work Invalid - ${timestamp}`, year: 1800 },
        'image_url',
        'qa-test-project-cover.png'
      )
    })
  )
  await expectFailure('news.emptyTitle', async () =>
    request('/news', {
      method: 'POST',
      token,
      form: await formData(
        { title: '', content: '<p>Invalid content</p>', category: 'Technology', is_published: 'true' },
        'image_url',
        'qa-test-news-cover.png'
      )
    })
  )
  await expectFailure('products.invalidUrl', async () =>
    request('/products', {
      method: 'POST',
      token,
      form: await formData(
        { name: `QA Test - Product Invalid - ${timestamp}`, description: '<p>Invalid</p>', external_link: 'not-a-url' },
        'image_url',
        'qa-test-product-image.png'
      )
    })
  )
  await expectFailure('careers.emptyTitle', async () =>
    request('/careers', {
      method: 'POST',
      token,
      form: await formData(
        { job_title: '', job_description: '<p>Invalid career</p>' },
        'thumbnail',
        'qa-test-career-image.png'
      )
    })
  )
  await expectFailure('contact.invalidInput', () =>
    request('/contact', {
      method: 'POST',
      auth: false,
      json: { name: '', email: 'bad-email', message: '' }
    })
  )
  await expectFailure('upload.invalidFileType', async () =>
    request('/expertise', {
      method: 'POST',
      token,
      form: await formData(
        { name: `QA Test - Invalid Upload - ${timestamp}`, description: '<p>Invalid upload</p>' },
        'icon_url',
        'qa-invalid-file.txt',
        'text/plain'
      )
    })
  )

  const relationCategory = await request('/categories', {
    method: 'POST',
    token,
    json: { name: `QA Test - Category - ${timestamp}` }
  })
  state.created.category = relationCategory.data

  const updatedCategoryName = `QA Updated - Category - ${timestamp}`
  await request(`/categories/${relationCategory.data.id}`, {
    method: 'PUT',
    token,
    json: { name: updatedCategoryName }
  })
  state.updated.category = await findBy('/categories', (item) => item.id === relationCategory.data.id)

  const secondaryCategory = await request('/categories', {
    method: 'POST',
    token,
    json: { name: `QA Test - Secondary Category - ${timestamp}` }
  })
  state.created.secondaryCategory = secondaryCategory.data

  const bannerPage = `qa-test-banner-${timestamp}`
  const banner = await request('/banners', {
    method: 'POST',
    token,
    form: await formData(
      {
        page_name: bannerPage,
        title: `QA Test - Banner - ${timestamp}`,
        subtitle: 'QA banner subtitle before update',
        media_type: 'image'
      },
      'media_url',
      'qa-test-banner.png'
    )
  })
  state.created.banner = banner.data

  await request(`/banners/${banner.data.id}`, {
    method: 'PUT',
    token,
    form: await formData(
      {
        page_name: bannerPage,
        title: `QA Updated - Banner - ${timestamp}`,
        subtitle: 'QA banner subtitle after update',
        media_type: 'image'
      },
      'media_url',
      'qa-test-updated-banner.png'
    )
  })
  state.updated.banner = (await request(`/banners/${bannerPage}`, { auth: false })).data

  const client = await request('/clients', {
    method: 'POST',
    token,
    form: await formData(
      {
        name: `QA Test - Client - ${timestamp}`,
        description: 'QA client description before update'
      },
      'client_icon',
      'qa-test-client-logo.png'
    )
  })
  state.created.client = client.data

  await request(`/clients/${client.data.id}`, {
    method: 'PUT',
    token,
    form: await formData(
      {
        name: `QA Updated - Client - ${timestamp}`,
        description: 'QA client description after update'
      },
      'client_icon',
      'qa-test-updated-client-logo.png'
    )
  })
  state.updated.client = await findBy('/clients', (item) => item.id === client.data.id)

  const serviceName = `QA Test - Service - ${timestamp}`
  const service = await request('/expertise', {
    method: 'POST',
    token,
    form: await formData(
      {
        name: serviceName,
        description: '<p>QA service description before update</p>'
      },
      'icon_url',
      'qa-test-service-icon.png'
    )
  })
  state.created.service = service.data

  const updatedServiceName = `QA Updated - Service - ${timestamp}`
  await request(`/expertise/${service.data.id}`, {
    method: 'PUT',
    token,
    form: await formData(
      {
        name: updatedServiceName,
        description: '<p>QA service description after update</p>'
      },
      'icon_url',
      'qa-test-updated-service-icon.png'
    )
  })
  state.updated.service = await findBy('/expertise', (item) => item.id === service.data.id)
  state.slugs.service = slugify(updatedServiceName)

  const workTitle = `QA Test - Work - ${timestamp}`
  const work = await request('/works', {
    method: 'POST',
    token,
    form: await formData(
      {
        title: workTitle,
        description: '<p>QA work description before update</p>',
        client: 'QA Client Before',
        year: '2026',
        categoryId: state.updated.category.id
      },
      'image_url',
      'qa-test-project-cover.png'
    )
  })
  state.created.work = work.data

  const updatedWorkTitle = `QA Updated - Work - ${timestamp}`
  await request(`/works/${work.data.id}`, {
    method: 'PUT',
    token,
    form: await formData(
      {
        title: updatedWorkTitle,
        description: '<p>QA work description after update</p>',
        client: 'QA Client After',
        year: '2027',
        categoryId: secondaryCategory.data.id
      },
      'image_url',
      'qa-test-updated-project-cover.png'
    )
  })
  state.updated.work = await findBy('/works', (item) => item.id === work.data.id)
  state.slugs.work = slugify(updatedWorkTitle)

  const newsTitle = `QA Test - News - ${timestamp}`
  const news = await request('/news', {
    method: 'POST',
    token,
    form: await formData(
      {
        title: newsTitle,
        content: '<p>QA news content before update</p>',
        category: 'Technology',
        is_published: 'true'
      },
      'image_url',
      'qa-test-news-cover.png'
    )
  })
  state.created.news = news.data

  const updatedNewsTitle = `QA Updated - News - ${timestamp}`
  await request(`/news/${news.data.id}`, {
    method: 'PUT',
    token,
    form: await formData(
      {
        title: updatedNewsTitle,
        content: '<p>QA news content after update</p>',
        category: 'Company',
        is_published: 'true'
      },
      'image_url',
      'qa-test-updated-news-cover.png'
    )
  })
  state.updated.news = await findBy('/news', (item) => item.id === news.data.id)
  state.slugs.news = slugify(updatedNewsTitle)

  const product = await request('/products', {
    method: 'POST',
    token,
    form: await formData(
      {
        name: `QA Test - Product - ${timestamp}`,
        description: '<p>QA product description before update</p>',
        external_link: 'https://example.com/qa-product-before',
        categoryId: state.updated.category.id
      },
      'image_url',
      'qa-test-product-image.png'
    )
  })
  state.created.product = product.data

  await request(`/products/${product.data.id}`, {
    method: 'PUT',
    token,
    form: await formData(
      {
        name: `QA Updated - Product - ${timestamp}`,
        description: '<p>QA product description after update</p>',
        external_link: 'https://example.com/qa-product-after',
        categoryId: secondaryCategory.data.id
      },
      'image_url',
      'qa-test-updated-product-image.png'
    )
  })
  state.updated.product = await findBy('/products', (item) => item.id === product.data.id)

  const careerTitle = `QA Test - Career - ${timestamp}`
  const career = await request('/careers', {
    method: 'POST',
    token,
    form: await formData(
      {
        job_title: careerTitle,
        job_description: '<p>QA career description before update</p>'
      },
      'thumbnail',
      'qa-test-career-image.png'
    )
  })
  state.created.career = career.data

  const updatedCareerTitle = `QA Updated - Career - ${timestamp}`
  await request(`/careers/${career.data.id}`, {
    method: 'PUT',
    token,
    form: await formData(
      {
        job_title: updatedCareerTitle,
        job_description: '<p>QA career description after update</p>'
      },
      'thumbnail',
      'qa-test-updated-career-image.png'
    )
  })
  state.updated.career = await findBy('/careers', (item) => item.id === career.data.id)
  state.slugs.career = slugify(updatedCareerTitle)

  const contact = await request('/contact', {
    method: 'POST',
    auth: false,
    json: {
      name: `QA Test - Contact - ${timestamp}`,
      email: `qa-${timestamp}@example.com`,
      subject: `QA Test - Subject - ${timestamp}`,
      message: 'QA contact message before mark as read.'
    }
  })
  state.created.contact = contact.data
  const messages = (await request('/contact', { token })).data
  state.updated.contact = messages.find((item) => item.id === contact.data.id) || contact.data
  await request(`/contact/${contact.data.id}/read`, { method: 'PUT', token })
  state.updated.contactAfterRead = ((await request('/contact', { token })).data)
    .find((item) => item.id === contact.data.id)

  const publishedNewsDetail = await request(`/news/${state.slugs.news}`, { auth: false })
  state.publicExpectations.newsDetail = {
    status: publishedNewsDetail.status,
    title: publishedNewsDetail.data.title
  }
  state.publicExpectations.service = await findBy('/expertise', (item) => item.id === service.data.id)
  state.publicExpectations.work = await findBy('/works', (item) => item.id === work.data.id)
  state.publicExpectations.career = await findBy('/careers', (item) => item.id === career.data.id)

  results.modules = {
    categories: {
      create: 'PASS',
      update: state.updated.category?.name === updatedCategoryName ? 'PASS' : 'FAIL',
      read: state.updated.category ? 'PASS' : 'FAIL',
      delete: 'PENDING_CLEANUP'
    },
    banners: {
      create: 'PASS',
      update: state.updated.banner?.title?.includes('QA Updated') ? 'PASS' : 'FAIL',
      read: state.updated.banner ? 'PASS' : 'FAIL',
      delete: 'PENDING_CLEANUP',
      imageUpload: state.updated.banner?.media_url ? 'PASS' : 'FAIL'
    },
    clients: {
      create: 'PASS',
      update: state.updated.client?.name?.includes('QA Updated') ? 'PASS' : 'FAIL',
      read: state.updated.client ? 'PASS' : 'FAIL',
      delete: 'PENDING_CLEANUP',
      imageUpload: state.updated.client?.client_icon ? 'PASS' : 'FAIL'
    },
    services: {
      create: 'PASS',
      update: state.updated.service?.name?.includes('QA Updated') ? 'PASS' : 'FAIL',
      read: state.updated.service ? 'PASS' : 'FAIL',
      delete: 'PENDING_CLEANUP',
      imageUpload: state.updated.service?.icon_url ? 'PASS' : 'FAIL',
      slug: state.slugs.service
    },
    works: {
      create: 'PASS',
      update: state.updated.work?.title?.includes('QA Updated') ? 'PASS' : 'FAIL',
      read: state.updated.work ? 'PASS' : 'FAIL',
      delete: 'PENDING_CLEANUP',
      imageUpload: state.updated.work?.image_url ? 'PASS' : 'FAIL',
      slug: state.slugs.work
    },
    news: {
      create: 'PASS',
      update: state.updated.news?.title?.includes('QA Updated') ? 'PASS' : 'FAIL',
      read: state.updated.news ? 'PASS' : 'FAIL',
      delete: 'PENDING_CLEANUP',
      imageUpload: state.updated.news?.image_url ? 'PASS' : 'FAIL',
      slug: state.slugs.news
    },
    products: {
      create: 'PASS',
      update: state.updated.product?.name?.includes('QA Updated') ? 'PASS' : 'FAIL',
      read: state.updated.product ? 'PASS' : 'FAIL',
      delete: 'PENDING_CLEANUP',
      imageUpload: state.updated.product?.image_url ? 'PASS' : 'FAIL'
    },
    careers: {
      create: 'PASS',
      update: state.updated.career?.job_title?.includes('QA Updated') ? 'PASS' : 'FAIL',
      read: state.updated.career ? 'PASS' : 'FAIL',
      delete: 'PENDING_CLEANUP',
      imageUpload: state.updated.career?.thumbnail ? 'PASS' : 'FAIL',
      slug: state.slugs.career
    },
    contact: {
      create: 'PASS',
      read: state.updated.contact ? 'PASS' : 'FAIL',
      update: state.updated.contactAfterRead ? 'PASS' : 'FAIL',
      delete: 'PENDING_CLEANUP'
    },
    profile: {
      create: 'NOT_FOUND',
      update: 'NOT_FOUND',
      read: 'PARTIAL',
      delete: 'NOT_FOUND',
      note: 'Frontend profile form is static; no profile API found.'
    }
  }

  await writeState(state)
  await writeFile(path.join(rootDir, 'results-setup.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify({ ok: true, phase, timestamp, statePath, results: results.modules }, null, 2))
}

const deleteIf = async (label, fn) => {
  try {
    const result = await fn()
    results.cleanup[label] = { result: 'PASS', status: result.status }
  } catch (error) {
    results.cleanup[label] = {
      result: error.status === 404 ? 'PASS' : 'FAIL',
      status: error.status || 'ERR',
      note: error.data?.message || error.message
    }
  }
}

const cleanup = async () => {
  await ensureEvidenceDirs()
  const state = await readState()
  const auth = await login()
  const token = auth.accessToken

  if (state.created.contact?.id) {
    await deleteIf('contact', () => request(`/contact/${state.created.contact.id}`, { method: 'DELETE', token }))
  }
  if (state.created.news?.id) {
    await deleteIf('news', () => request(`/news/${state.created.news.id}`, { method: 'DELETE', token }))
  }
  if (state.created.career?.id) {
    await deleteIf('career', () => request(`/careers/${state.created.career.id}`, { method: 'DELETE', token }))
  }
  if (state.created.product?.id) {
    await deleteIf('product', () => request(`/products/${state.created.product.id}`, { method: 'DELETE', token }))
  }
  if (state.created.work?.id) {
    await deleteIf('work', () => request(`/works/${state.created.work.id}`, { method: 'DELETE', token }))
  }
  if (state.created.service?.id) {
    await deleteIf('service', () => request(`/expertise/${state.created.service.id}`, { method: 'DELETE', token }))
  }
  if (state.created.client?.id) {
    await deleteIf('client', () => request(`/clients/${state.created.client.id}`, { method: 'DELETE', token }))
  }
  if (state.created.banner?.id) {
    await deleteIf('banner', () => request(`/banners/${state.created.banner.id}`, { method: 'DELETE', token }))
  }
  if (state.created.secondaryCategory?.id) {
    await deleteIf('secondaryCategory', () => request(`/categories/${state.created.secondaryCategory.id}`, { method: 'DELETE', token }))
  }
  if (state.created.category?.id) {
    await deleteIf('category', () => request(`/categories/${state.created.category.id}`, { method: 'DELETE', token }))
  }

  const after = {
    service: await findBy('/expertise', (item) => item.id === state.created.service?.id),
    work: await findBy('/works', (item) => item.id === state.created.work?.id),
    news: await findBy('/news', (item) => item.id === state.created.news?.id),
    career: await findBy('/careers', (item) => item.id === state.created.career?.id),
    product: await findBy('/products', (item) => item.id === state.created.product?.id),
    client: await findBy('/clients', (item) => item.id === state.created.client?.id),
    category: await findBy('/categories', (item) => item.id === state.created.category?.id)
  }

  results.cleanup.publicAbsence = Object.fromEntries(
    Object.entries(after).map(([key, value]) => [key, value === null ? 'PASS' : 'FAIL'])
  )
  await writeFile(path.join(rootDir, 'results-cleanup.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify({ ok: true, phase, cleanup: results.cleanup }, null, 2))
}

if (phase === 'setup') {
  await setup()
} else if (phase === 'cleanup') {
  await cleanup()
} else {
  throw new Error(`Unknown phase: ${phase}`)
}
