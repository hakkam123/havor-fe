import fs from 'node:fs'
import path from 'node:path'

const apiBase = process.env.E2E_API_BASE || 'https://tplnext.com/havor/api'
const email = process.env.E2E_ADMIN_EMAIL || 'admin@havor.com'
const password = process.env.E2E_ADMIN_PASSWORD || 'admin123admin'
const backendRoot = process.env.HAVOR_BACKEND_ROOT || 'D:/Hakkam/Kuliah/Projects/havor-backend'
const assetRoot = path.join(backendRoot, 'seed-assets')

const file = (folder, name, type = 'image/png') => {
  const buffer = fs.readFileSync(path.join(assetRoot, folder, name))
  return new File([buffer], name, { type })
}

const login = async () => {
  const response = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!response.ok) throw new Error(`Login failed: ${response.status}`)
  return response.json()
}

const toFormData = (payload) => {
  const data = new FormData()
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null || value === '') continue
    data.append(key, value)
  }
  return data
}

const request = async (url, options = {}) => {
  const response = await fetch(`${apiBase}${url}`, options)
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${url} failed ${response.status}: ${JSON.stringify(body)}`)
  }
  return body
}

const authed = (token, options = {}) => ({
  ...options,
  headers: {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`
  }
})

const upsertMultipart = async ({ token, listUrl, createUrl, updateUrl, match, payload }) => {
  const list = await request(listUrl, authed(token))
  const existing = list.find(match)
  if (existing) {
    return request(updateUrl(existing), authed(token, { method: 'PUT', body: toFormData(payload) }))
  }
  return request(createUrl, authed(token, { method: 'POST', body: toFormData(payload) }))
}

const upsertJson = async ({ token, listUrl, createUrl, updateUrl, match, payload }) => {
  const list = await request(listUrl, authed(token))
  const existing = list.find(match)
  if (existing) {
    return request(updateUrl(existing), authed(token, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    }))
  }
  return request(createUrl, authed(token, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  }))
}

const article = (title, topic) => `
<h2>${title}</h2>
<p>${topic} is increasingly important for organizations that want digital channels to work as reliable business infrastructure. A company may already have websites, spreadsheets, forms, and separate dashboards, but the value of those tools is limited when information is fragmented. A structured platform helps teams publish content, monitor activity, and make decisions from consistent data.</p>
<p>Havor Smarta Digital approaches this kind of work by mapping the business process before deciding the interface and technology. The team studies roles, approval flows, content ownership, reporting needs, upload requirements, and long-term maintenance. This discovery process prevents a project from becoming a visual template only, and turns it into a practical system that can support daily operations.</p>
<p>Good implementation also depends on reliable API behavior. Validation must reject incomplete input, upload handling must protect the system from invalid files, and public endpoints must avoid exposing draft content. These details are not glamorous, but they are the difference between a dashboard that works during a demo and a system that remains trustworthy after many people use it every day.</p>
<p>Responsive design is part of the same quality standard. Users may open a public article from a phone, review dashboard content from a laptop, or present a project page on a wider screen. Typography, image ratios, spacing, and navigation must stay comfortable across those contexts. A clean corporate layout builds trust because visitors can understand the information quickly without visual noise.</p>
<p>The practical benefit of ${topic.toLowerCase()} appears when non-technical teams can update data confidently and public pages reflect those changes correctly. Services, works, news, clients, products, and career content should be manageable from the dashboard while remaining safe and polished on the public website. This connection between admin flow and public experience is one of the foundations of a maintainable digital platform.</p>
<p>For businesses planning a new website, CMS, dashboard, or application, the strongest result usually comes from combining design discipline with engineering discipline. The interface should feel professional, but the underlying data flow must also be predictable, secure, and easy to operate. That is the delivery standard Havor applies when helping companies build scalable digital solutions.</p>
`

const main = async () => {
  const { accessToken } = await login()

  const categories = [
    'Company Profile',
    'Information System',
    'Dashboard Analytics',
    'Web Application',
    'Digital Product'
  ]

  for (const name of categories) {
    await upsertJson({
      token: accessToken,
      listUrl: '/categories',
      createUrl: '/categories',
      updateUrl: (item) => `/categories/${item.id}`,
      match: (item) => item.name === name,
      payload: { name }
    })
  }

  const categoryList = await request('/categories', authed(accessToken))
  const categoryId = (name) => categoryList.find((item) => item.name === name)?.id || categoryList[0]?.id

  const banners = [
    ['home', 'Digital Transformation for Growing Businesses', 'Integrated websites, applications, dashboards, and intelligent systems.', 'digital-transformation.png'],
    ['services', 'Scalable Web Development Solutions', 'Modern platforms with clean UX, secure APIs, and maintainable CMS.', 'web-development.png'],
    ['projects', 'Project Delivery for Business Systems', 'From company profile websites to dashboards and internal applications.', 'project-delivery.png'],
    ['media-news', 'Technology Insights and Company Updates', 'Perspectives on digital delivery, CMS, dashboards, and application development.', 'technology-insights.png'],
    ['careers', 'Build Practical Digital Products with Havor', 'Join a team focused on clean implementation, collaboration, and business impact.', 'careers-team.png']
  ]
  for (const [page_name, title, subtitle, image] of banners) {
    await upsertMultipart({
      token: accessToken,
      listUrl: '/banners',
      createUrl: '/banners',
      updateUrl: (item) => `/banners/${item.id}`,
      match: (item) => item.page_name === page_name,
      payload: { page_name, title, subtitle, media_type: 'image', media_url: file('banners', image) }
    })
  }

  const clients = [
    ['PT Nusantara Digital Operasi', 'Operations-focused company improving internal service and reporting visibility.', 'nusantara-digital.png'],
    ['CV Arunika Kreatif Teknologi', 'Creative technology partner managing content and campaign microsites.', 'arunika-kreatif.png'],
    ['Raja Laut Regional Service Unit', 'Regional service organization with structured digital information needs.', 'raja-laut.png'],
    ['Bogor Public Information Center', 'Public information unit focused on accessible content publication.', 'bogor-info-center.png'],
    ['Smart Commerce Indonesia', 'Commerce operator improving catalog and transaction monitoring workflows.', 'smart-commerce.png']
  ]
  for (const [name, description, image] of clients) {
    await upsertMultipart({
      token: accessToken,
      listUrl: '/clients',
      createUrl: '/clients',
      updateUrl: (item) => `/clients/${item.id}`,
      match: (item) => item.name === name,
      payload: { name, description, client_icon: file('clients', image) }
    })
  }

  const services = [
    ['Full-stack Web Development', 'End-to-end web application development covering UI, backend APIs, dashboard modules, and deployment readiness.', 'fullstack-web.png'],
    ['Company Profile Website', 'Corporate website development with clear hierarchy, CMS-ready sections, SEO foundations, and responsive layouts.', 'company-profile.png'],
    ['Custom CMS Development', 'Content management systems for services, works, news, careers, banners, clients, and profile information.', 'custom-cms.png'],
    ['Dashboard and Data Visualization', 'Operational dashboards that transform business data into readable summaries, filters, and charts.', 'dashboard-data.png'],
    ['API Integration and Backend Development', 'Backend services, validation, upload handling, third-party integrations, and API contracts.', 'api-integration.png']
  ]
  for (const [name, description, image] of services) {
    await upsertMultipart({
      token: accessToken,
      listUrl: '/expertise',
      createUrl: '/expertise',
      updateUrl: (item) => `/expertise/${item.id}`,
      match: (item) => item.name === name,
      payload: { name, description, icon_url: file('expertise', image) }
    })
  }

  const works = [
    ['SIJALA Real-time Marine Report Portal', 'Raja Laut Regional Service Unit', 'Information System', 2026, 'sijala-marine-portal.png'],
    ['BPBD Disaster Information Landing Page', 'Bogor Public Information Center', 'Company Profile', 2026, 'bpbd-landing-page.png'],
    ['Company Profile CMS for Digital Agency', 'CV Arunika Kreatif Teknologi', 'Web Application', 2025, 'agency-cms.png'],
    ['QR Code Attendance Management System', 'PT Nusantara Digital Operasi', 'Information System', 2025, 'qr-attendance.png'],
    ['Marketplace Admin Management Dashboard', 'Smart Commerce Indonesia', 'Dashboard Analytics', 2026, 'marketplace-dashboard.png']
  ]
  for (const [title, client, category, year, image] of works) {
    await upsertMultipart({
      token: accessToken,
      listUrl: '/works',
      createUrl: '/works',
      updateUrl: (item) => `/works/${item.id}`,
      match: (item) => item.title === title,
      payload: {
        title,
        client,
        year,
        categoryId: categoryId(category),
        description: `<h3>Problem</h3><p>${client} needed a cleaner digital workflow and stronger public presentation.</p><h3>Solution</h3><p>Havor delivered a structured web platform with CMS-ready content, responsive layouts, and practical admin management.</p><h3>Result</h3><p>The team gained a maintainable system that is easier to update and easier for users to understand.</p>`,
        image_url: file('works', image)
      }
    })
  }

  const news = [
    ['How a CMS Helps Companies Manage Digital Content More Efficiently', 'A structured content management system', 'cms-efficiency.png', 'Technology'],
    ['Why Real-time Reporting Matters for Public Information Systems', 'Real-time reporting', 'realtime-reporting.png', 'Public Systems'],
    ['The Role of Dashboard Analytics in Operational Decision-Making', 'Dashboard analytics', 'dashboard-analytics.png', 'Data Insight'],
    ['Building Scalable Web Applications with API-First Architecture', 'API-first architecture', 'api-first.png', 'Engineering'],
    ['Improving User Experience Through Structured Content and Responsive Design', 'Structured content and responsive design', 'responsive-ux.png', 'UX Design']
  ]
  for (const [title, topic, image, category] of news) {
    await upsertMultipart({
      token: accessToken,
      listUrl: '/news',
      createUrl: '/news',
      updateUrl: (item) => `/news/${item.id}`,
      match: (item) => item.title === title,
      payload: {
        title,
        category,
        is_published: 'true',
        content: article(title, topic),
        image_url: file('news', image)
      }
    })
  }

  const products = [
    ['Havor CMS Starter', 'Digital Product', 'havor-cms-starter.png', 'https://www.havorsmartadigital.com/products/havor-cms-starter'],
    ['Attendance QR System', 'Information System', 'attendance-qr.png', 'https://www.havorsmartadigital.com/products/attendance-qr-system'],
    ['Reporting Dashboard Kit', 'Dashboard Analytics', 'reporting-dashboard-kit.png', 'https://www.havorsmartadigital.com/products/reporting-dashboard-kit'],
    ['Company Profile Website Package', 'Company Profile', 'company-profile-package.png', 'https://www.havorsmartadigital.com/products/company-profile-website-package'],
    ['API Integration Starter Pack', 'Web Application', 'api-integration-pack.png', 'https://www.havorsmartadigital.com/products/api-integration-starter-pack']
  ]
  for (const [name, category, image, external_link] of products) {
    await upsertMultipart({
      token: accessToken,
      listUrl: '/products',
      createUrl: '/products',
      updateUrl: (item) => `/products/${item.id}`,
      match: (item) => item.name === name,
      payload: {
        name,
        categoryId: categoryId(category),
        external_link,
        description: `${name} is a practical Havor digital product package designed for companies that need faster implementation, maintainable admin control, and professional public presentation.`,
        image_url: file('products', image)
      }
    })
  }

  const careers = [
    ['Frontend Developer Intern', 'frontend-intern.png'],
    ['Backend Developer Intern', 'backend-intern.png'],
    ['UI/UX Designer Intern', 'uiux-intern.png'],
    ['Quality Assurance Intern', 'qa-intern.png'],
    ['Full-stack Developer Intern', 'fullstack-intern.png']
  ]
  for (const [job_title, image] of careers) {
    await upsertMultipart({
      token: accessToken,
      listUrl: '/careers',
      createUrl: '/careers',
      updateUrl: (item) => `/careers/${item.id}`,
      match: (item) => item.job_title === job_title,
      payload: {
        job_title,
        job_description: `<h3>Role Summary</h3><p>${job_title} supports Havor projects across corporate websites, CMS platforms, dashboards, and digital product delivery.</p><h3>Responsibilities</h3><ul><li>Collaborate with the team on practical implementation tasks.</li><li>Keep work readable, documented, and tested.</li><li>Support responsive and maintainable digital experiences.</li></ul><h3>Requirements</h3><ul><li>Good learning attitude and communication.</li><li>Basic understanding of digital product workflow.</li></ul>`,
        thumbnail: file('careers', image)
      }
    })
  }

  const contacts = [
    ['Rani Pradipta', 'rani.pradipta@example.co.id', 'Inquiry about Company Profile Website', 'Kami ingin mendiskusikan pengembangan company profile website dengan CMS untuk layanan, portfolio, berita, dan karier.'],
    ['Andi Saputra', 'andi.saputra@example.co.id', 'Request for CMS Development', 'Perusahaan kami membutuhkan CMS internal untuk mengelola publikasi konten dan halaman landing page.'],
    ['Mira Hapsari', 'mira.hapsari@example.co.id', 'Consultation for Dashboard System', 'Kami ingin konsultasi pembuatan dashboard operasional dengan filter dan laporan performa.'],
    ['Yusuf Firmansyah', 'yusuf.firmansyah@example.co.id', 'Question about QR Attendance System', 'Apakah sistem QR attendance dapat disesuaikan untuk beberapa lokasi kantor dan export laporan bulanan?'],
    ['Dewi Lestari', 'dewi.lestari@example.co.id', 'Partnership Opportunity', 'Kami tertarik menjajaki partnership untuk proyek website, mobile app, dan integrasi API.']
  ]
  const inbox = await request('/contact', authed(accessToken))
  for (const [name, contactEmail, subject, message] of contacts) {
    if (inbox.some((item) => item.email === contactEmail && item.subject === subject)) continue
    await request('/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, email: contactEmail, subject, message })
    })
  }

  const counts = {
    banners: (await request('/banners')).length,
    categories: (await request('/categories')).length,
    clients: (await request('/clients')).length,
    services: (await request('/expertise')).length,
    works: (await request('/works')).length,
    news: (await request('/news')).length,
    products: (await request('/products')).length,
    careers: (await request('/careers')).length,
    contact: (await request('/contact', authed(accessToken))).length
  }

  fs.mkdirSync(path.join('qa-evidence-after-fix'), { recursive: true })
  fs.writeFileSync(path.join('qa-evidence-after-fix', 'live-seed-result.json'), JSON.stringify({ counts }, null, 2))
  console.log(JSON.stringify({ counts }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
