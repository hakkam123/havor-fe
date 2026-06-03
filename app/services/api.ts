type ApiBody = BodyInit | Record<string, unknown> | null | undefined

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: ApiBody
}

export class PublicApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'PublicApiError'
    this.status = status
  }
}

const getApiBaseUrl = () => {
  const config = useRuntimeConfig()
  const legacyApiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const legacyApiEndpoint = legacyApiBaseUrl.endsWith('/api') ? legacyApiBaseUrl : `${legacyApiBaseUrl}/api`
  const apiBaseUrl = String(config.public.apiBase || (legacyApiBaseUrl ? legacyApiEndpoint : '/havor/api')).replace(/\/+$/, '')

  if (!apiBaseUrl) {
    throw new PublicApiError('API endpoint is not configured. Please contact the administrator.', 0)
  }

  return apiBaseUrl
}

const buildUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiBaseUrl()}${normalizedPath}`
}

const parseResponse = async (response: Response) => {
  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

const getApiErrorMessage = (responseBody: unknown) => {
  if (!responseBody || typeof responseBody !== 'object') {
    return 'We could not submit your data. Please try again in a moment.'
  }

  if ('errors' in responseBody && responseBody.errors && typeof responseBody.errors === 'object') {
    const firstError = Object.values(responseBody.errors).find(Boolean)
    if (firstError) return String(firstError)
  }

  if ('message' in responseBody && responseBody.message) {
    return String(responseBody.message)
  }

  return 'We could not submit your data. Please try again in a moment.'
}

export const publicApiFetch = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
  const headers = new Headers(options.headers)
  const isFormData = options.body instanceof FormData

  if (options.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const body = options.body && !isFormData ? JSON.stringify(options.body) : options.body
  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    body: body as BodyInit | null | undefined
  })

  const responseBody = await parseResponse(response)

  if (!response.ok) {
    throw new PublicApiError(getApiErrorMessage(responseBody), response.status)
  }

  return responseBody as T
}
