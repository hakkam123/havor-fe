import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000'
const apiBase = process.env.E2E_API_BASE
const adminEmail = process.env.E2E_ADMIN_EMAIL || process.env.QA_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD || process.env.QA_ADMIN_PASSWORD

const testImage = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAA+gAAAIwCAIAAACzj5qXAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH6gUcBzUqFEnvmwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCBmb3IgUUEgdGVzdHNAc3RycG4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAANRSURBVHic7cEBDQAAAMKg909tDwcUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwG4UAAAFvXM+vAAAAAElFTkSuQmCC',
  'base64'
)

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

async function login(request: APIRequestContext) {
  expect(apiBase, 'E2E_API_BASE is required').toBeTruthy()
  expect(adminEmail, 'E2E_ADMIN_EMAIL or QA_ADMIN_EMAIL is required').toBeTruthy()
  expect(adminPassword, 'E2E_ADMIN_PASSWORD or QA_ADMIN_PASSWORD is required').toBeTruthy()

  const response = await request.post(`${apiBase}/auth/login`, {
    data: {
      email: adminEmail,
      password: adminPassword
    }
  })

  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.accessToken).toBeTruthy()
  return body as { accessToken: string; refreshToken: string }
}

async function setAuthCookies(page: Page, tokens: { accessToken: string; refreshToken: string }) {
  await page.context().addCookies([
    { name: 'auth_token', value: tokens.accessToken, url: baseURL },
    { name: 'refresh_token', value: tokens.refreshToken, url: baseURL }
  ])
}

async function authHeaders(request: APIRequestContext) {
  const tokens = await login(request)
  return {
    tokens,
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`
    }
  }
}

test.describe('admin CRUD to public sync', () => {
  test('login protects dashboard and accepts valid admin credential', async ({ page, request }) => {
    await page.goto(`${baseURL}/admin`)
    await expect(page).toHaveURL(/\/admin\/login/)

    const tokens = await login(request)
    await setAuthCookies(page, tokens)
    await page.goto(`${baseURL}/admin`)
    await expect(page.getByRole('heading', { name: 'Dashboard' }).first()).toBeVisible()

    const protectedResponse = await request.post(`${apiBase}/categories`, {
      data: { name: 'QA Test - Unauthorized Category' }
    })
    expect(protectedResponse.status()).toBe(401)
  })

  test('services CRUD syncs dashboard list, public list, and detail slug', async ({ page, request }) => {
    const { tokens, headers } = await authHeaders(request)
    await setAuthCookies(page, tokens)
    const timestamp = Date.now()
    const createdName = `QA Test - Service - ${timestamp}`
    const updatedName = `QA Updated - Service - ${timestamp}`
    let createdId: number | undefined

    try {
      const createResponse = await request.post(`${apiBase}/expertise`, {
        headers,
        multipart: {
          name: createdName,
          description: '<p>QA service content before update</p>',
          icon_url: {
            name: 'qa-test-service.png',
            mimeType: 'image/png',
            buffer: testImage
          }
        }
      })
      expect(createResponse.status()).toBe(201)
      createdId = (await createResponse.json()).id

      const updateResponse = await request.put(`${apiBase}/expertise/${createdId}`, {
        headers,
        multipart: {
          name: updatedName,
          description: '<p>QA service content after update</p>',
          icon_url: {
            name: 'qa-updated-service.png',
            mimeType: 'image/png',
            buffer: testImage
          }
        }
      })
      expect(updateResponse.status()).toBe(200)

      await page.goto(`${baseURL}/admin/expertises`)
      await page.getByPlaceholder(/Search expertise/i).fill(updatedName)
      await expect(page.getByText(updatedName)).toBeVisible()

      await page.goto(`${baseURL}/services`)
      await expect(page.getByText(updatedName)).toBeVisible()

      await page.goto(`${baseURL}/services/${slugify(updatedName)}`)
      await expect(page.locator('h1').filter({ hasText: updatedName })).toBeVisible()
    } finally {
      if (createdId) {
        await request.delete(`${apiBase}/expertise/${createdId}`, { headers })
        await page.goto(`${baseURL}/services/${slugify(updatedName)}`)
        await expect(page.getByText('404')).toBeVisible()
      }
    }
  })

  test('works CRUD syncs dashboard, project listing, and detail slug', async ({ page, request }) => {
    const { tokens, headers } = await authHeaders(request)
    await setAuthCookies(page, tokens)
    const timestamp = Date.now()
    const category = await request.post(`${apiBase}/categories`, {
      headers,
      data: { name: `QA Test - Work Category - ${timestamp}` }
    })
    expect(category.status()).toBe(201)
    const categoryId = (await category.json()).id
    const updatedTitle = `QA Updated - Work - ${timestamp}`
    let workId: number | undefined

    try {
      const createResponse = await request.post(`${apiBase}/works`, {
        headers,
        multipart: {
          title: `QA Test - Work - ${timestamp}`,
          description: '<p>QA work before update</p>',
          client: 'QA Client',
          year: '2026',
          categoryId,
          image_url: {
            name: 'qa-test-work.png',
            mimeType: 'image/png',
            buffer: testImage
          }
        }
      })
      expect(createResponse.status()).toBe(201)
      workId = (await createResponse.json()).id

      const updateResponse = await request.put(`${apiBase}/works/${workId}`, {
        headers,
        multipart: {
          title: updatedTitle,
          description: '<p>QA work after update</p>',
          client: 'QA Client Updated',
          year: '2027',
          categoryId,
          image_url: {
            name: 'qa-updated-work.png',
            mimeType: 'image/png',
            buffer: testImage
          }
        }
      })
      expect(updateResponse.status()).toBe(200)

      await page.goto(`${baseURL}/admin/works`)
      await page.getByPlaceholder(/Search works/i).fill(updatedTitle)
      await expect(page.getByText(updatedTitle)).toBeVisible()

      await page.goto(`${baseURL}/projects`)
      await expect(page.getByText(updatedTitle)).toBeVisible()

      await page.goto(`${baseURL}/projects/${slugify(updatedTitle)}`)
      await expect(page.locator('h1').filter({ hasText: updatedTitle })).toBeVisible()
    } finally {
      if (workId) await request.delete(`${apiBase}/works/${workId}`, { headers })
      await request.delete(`${apiBase}/categories/${categoryId}`, { headers })
      await page.goto(`${baseURL}/projects/${slugify(updatedTitle)}`)
      await expect(page.getByText('404')).toBeVisible()
    }
  })

  test('news supports published display, draft hiding, and deleted slug 404', async ({ page, request }) => {
    const { tokens, headers } = await authHeaders(request)
    await setAuthCookies(page, tokens)
    const timestamp = Date.now()
    const updatedTitle = `QA Updated - News - ${timestamp}`
    let newsId: number | undefined

    try {
      const createResponse = await request.post(`${apiBase}/news`, {
        headers,
        multipart: {
          title: `QA Test - News - ${timestamp}`,
          content: '<p>QA news before update</p>',
          category: 'Technology',
          is_published: 'true',
          image_url: {
            name: 'qa-test-news.png',
            mimeType: 'image/png',
            buffer: testImage
          }
        }
      })
      expect(createResponse.status()).toBe(201)
      newsId = (await createResponse.json()).id

      const updateResponse = await request.put(`${apiBase}/news/${newsId}`, {
        headers,
        multipart: {
          title: updatedTitle,
          content: '<p>QA news after update</p>',
          category: 'Company',
          is_published: 'true',
          image_url: {
            name: 'qa-updated-news.png',
            mimeType: 'image/png',
            buffer: testImage
          }
        }
      })
      expect(updateResponse.status()).toBe(200)

      await page.goto(`${baseURL}/media-news`)
      await expect(page.getByRole('heading', { name: updatedTitle }).first()).toBeVisible()

      await page.goto(`${baseURL}/media-news/${slugify(updatedTitle)}`)
      await expect(page.locator('h1').filter({ hasText: updatedTitle })).toBeVisible()

      const draftResponse = await request.put(`${apiBase}/news/${newsId}`, {
        headers,
        multipart: {
          title: updatedTitle,
          content: '<p>QA news draft</p>',
          category: 'Company',
          is_published: 'false'
        }
      })
      expect(draftResponse.status()).toBe(200)

      await page.goto(`${baseURL}/media-news`)
      await expect(page.getByText(updatedTitle)).toHaveCount(0)
      await page.goto(`${baseURL}/media-news/${slugify(updatedTitle)}`)
      await expect(page.getByText('404')).toBeVisible()
    } finally {
      if (newsId) {
        await request.delete(`${apiBase}/news/${newsId}`, { headers })
        await page.goto(`${baseURL}/media-news/${slugify(updatedTitle)}`)
        await expect(page.getByText('404')).toBeVisible()
      }
    }
  })
})
