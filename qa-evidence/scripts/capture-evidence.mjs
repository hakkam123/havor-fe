import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const rootDir = path.resolve('qa-evidence')
const state = JSON.parse(await readFile(path.join(rootDir, 'state.json'), 'utf8'))
const phase = process.argv[2] || 'before-delete'
const frontendBase = process.env.QA_FRONTEND_BASE || state.frontendBase || 'http://localhost:3000'
const email = process.env.QA_ADMIN_EMAIL
const password = process.env.QA_ADMIN_PASSWORD
const apiBase = process.env.QA_API_BASE || state.apiBase || 'https://tplnext.com/havor/api'

if (!email || !password) {
  throw new Error('Set QA_ADMIN_EMAIL and QA_ADMIN_PASSWORD before capturing dashboard evidence.')
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const login = async () => {
  const response = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const body = await response.json()
  if (!response.ok || !body.accessToken) throw new Error(`Login failed: ${response.status}`)
  return body
}

const connectChrome = async () => {
  const target = await (await fetch('http://127.0.0.1:9223/json/new?about:blank', { method: 'PUT' })).json()
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message)
      pending.delete(message.id)
    }
  }
  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })
  const send = (method, params = {}) => new Promise((resolve) => {
    const messageId = ++id
    pending.set(messageId, resolve)
    ws.send(JSON.stringify({ id: messageId, method, params }))
  })
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  return { send, ws }
}

const browser = await connectChrome()
const auth = await login()

await browser.send('Network.setCookie', {
  name: 'auth_token',
  value: auth.accessToken,
  url: frontendBase,
  path: '/'
})
await browser.send('Network.setCookie', {
  name: 'refresh_token',
  value: auth.refreshToken,
  url: frontendBase,
  path: '/'
})

const ensureDir = async (moduleName) => mkdir(path.join(rootDir, moduleName), { recursive: true })

const evaluate = async (expression) => {
  const result = await browser.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  })
  if (result.result?.exceptionDetails) {
    throw new Error(result.result.exceptionDetails.text)
  }
  return result.result?.result?.value
}

const navigate = async (route, width = 1440) => {
  await browser.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 980,
    deviceScaleFactor: 1,
    mobile: width < 768
  })
  await browser.send('Page.navigate', { url: `${frontendBase}${route}` })
  await wait(4800)
}

const screenshot = async (moduleName, fileName) => {
  await ensureDir(moduleName)
  const captured = await browser.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  })
  const outPath = path.join(rootDir, moduleName, fileName)
  await writeFile(outPath, Buffer.from(captured.result.data, 'base64'))
  return outPath
}

const filterList = async (text) => {
  const safeText = JSON.stringify(text || '')
  await evaluate(`
    (() => {
      const input = document.querySelector('input[placeholder*="Search"], input[type="text"]')
      if (!input) return false
      input.value = ${safeText}
      input.dispatchEvent(new Event('input', { bubbles: true }))
      return true
    })()
  `)
  await wait(1000)
}

const openCreateForm = async (route, moduleName) => {
  await navigate(route)
  await evaluate(`
    (() => {
      const button = [...document.querySelectorAll('button')]
        .find((item) => /Create|Add|Upload New/i.test(item.innerText || ''))
      if (button) button.click()
    })()
  `)
  await wait(900)
  await evaluate(`
    (() => {
      const values = ['QA Test create form evidence', 'QA Test subtitle', 'QA Test description']
      const inputs = [...document.querySelectorAll('input:not([type="file"]):not([readonly]), textarea')]
      inputs.forEach((input, index) => {
        input.value = values[index] || 'QA Test form value'
        input.dispatchEvent(new Event('input', { bubbles: true }))
      })
      const selects = [...document.querySelectorAll('select')]
      selects.forEach((select) => {
        if (select.options.length > 1) select.selectedIndex = 1
        select.dispatchEvent(new Event('change', { bubbles: true }))
      })
    })()
  `)
  return screenshot(moduleName, '01-create-form.png')
}

const openEditForm = async (route, moduleName, searchText) => {
  await navigate(route)
  await filterList(searchText)
  await evaluate(`
    (() => {
      const rowButton = document.querySelector('tbody tr button')
      const cardButton = document.querySelector('article button')
      const button = rowButton || cardButton
      if (button) button.click()
    })()
  `)
  await wait(1000)
  return screenshot(moduleName, '05-update-form.png')
}

const captureValidation = async (route, moduleName) => {
  await navigate(route)
  await evaluate(`
    (() => {
      const button = [...document.querySelectorAll('button')]
        .find((item) => /Create|Add|Upload New/i.test(item.innerText || ''))
      if (button) button.click()
    })()
  `)
  await wait(800)
  await evaluate(`
    (() => {
      const saveButton = [...document.querySelectorAll('button')]
        .reverse()
        .find((item) => /Save|Create|Submit/i.test(item.innerText || ''))
      if (saveButton) saveButton.click()
    })()
  `)
  await wait(1200)
  return screenshot(moduleName, '07-validation-error.png')
}

const captureDashboard = async (route, moduleName, searchText) => {
  await navigate(route)
  await filterList(searchText)
  return screenshot(moduleName, '02-dashboard-list-after-create.png')
}

const capturePublic = async (route, moduleName, fileName = '03-public-display.png') => {
  await navigate(route)
  return screenshot(moduleName, fileName)
}

const textCheck = async (route, expectedText) => {
  await navigate(route)
  return evaluate(`
    (() => {
      const body = document.body.innerText || ''
      return {
        title: document.title,
        hasExpectedText: body.includes(${JSON.stringify(expectedText)}),
        has404: /404|not found/i.test(body),
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        sample: body.replace(/\\s+/g, ' ').slice(0, 240)
      }
    })()
  `)
}

const routes = {
  banners: '/admin/banners',
  categories: '/admin/categories',
  clients: '/admin/clients',
  services: '/admin/expertises',
  works: '/admin/works',
  news: '/admin/news',
  products: '/admin/products',
  careers: '/admin/careers',
  contact: '/admin/inbox',
  profile: '/admin/profile'
}

const names = {
  banners: state.updated.banner?.title,
  categories: state.updated.category?.name,
  clients: state.updated.client?.name,
  services: state.updated.service?.name,
  works: state.updated.work?.title,
  news: state.updated.news?.title,
  products: state.updated.product?.name,
  careers: state.updated.career?.job_title,
  contact: state.created.contact?.subject,
  profile: 'Admin Profile'
}

const publicRoutes = {
  services: { list: '/services', detail: `/services/${state.slugs.service}`, expected: names.services },
  works: { list: '/projects', detail: `/projects/${state.slugs.work}`, expected: names.works },
  news: { list: '/media-news', detail: `/media-news/${state.slugs.news}`, expected: names.news },
  careers: { list: '/careers', detail: `/careers/${state.slugs.career}`, expected: names.careers }
}

const evidence = { phase, dashboard: {}, public: {}, checks: {} }

if (phase === 'before-delete') {
  for (const moduleName of Object.keys(routes)) {
    await openCreateForm(routes[moduleName], moduleName)
    await captureDashboard(routes[moduleName], moduleName, names[moduleName])
    await openEditForm(routes[moduleName], moduleName, names[moduleName])
    await captureValidation(routes[moduleName], moduleName)
    evidence.dashboard[moduleName] = {
      createForm: path.join(rootDir, moduleName, '01-create-form.png'),
      list: path.join(rootDir, moduleName, '02-dashboard-list-after-create.png'),
      updateForm: path.join(rootDir, moduleName, '05-update-form.png'),
      validation: path.join(rootDir, moduleName, '07-validation-error.png')
    }
  }

  for (const [moduleName, config] of Object.entries(publicRoutes)) {
    await capturePublic(config.list, moduleName, '03-public-display.png')
    await capturePublic(config.detail, moduleName, '04-detail-slug.png')
    evidence.public[moduleName] = {
      list: path.join(rootDir, moduleName, '03-public-display.png'),
      detail: path.join(rootDir, moduleName, '04-detail-slug.png')
    }
    evidence.checks[moduleName] = {
      list: await textCheck(config.list, config.expected),
      detail: await textCheck(config.detail, config.expected)
    }
  }
} else if (phase === 'after-delete') {
  for (const [moduleName, config] of Object.entries(publicRoutes)) {
    await capturePublic(config.detail, moduleName, '08-after-delete.png')
    evidence.public[moduleName] = {
      afterDelete: path.join(rootDir, moduleName, '08-after-delete.png')
    }
    evidence.checks[moduleName] = {
      afterDelete: await textCheck(config.detail, config.expected)
    }
  }
  for (const moduleName of Object.keys(routes)) {
    await captureDashboard(routes[moduleName], moduleName, names[moduleName])
    const target = path.join(rootDir, moduleName, '08-after-delete.png')
    const captured = await browser.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    })
    await writeFile(target, Buffer.from(captured.result.data, 'base64'))
    evidence.dashboard[moduleName] = { afterDelete: target }
  }
} else {
  throw new Error(`Unknown phase: ${phase}`)
}

await writeFile(
  path.join(rootDir, `screenshots-${phase}.json`),
  `${JSON.stringify(evidence, null, 2)}\n`,
  'utf8'
)

browser.ws.close()
console.log(JSON.stringify(evidence, null, 2))
