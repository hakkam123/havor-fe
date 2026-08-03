export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const getApiBase = () => {
    const apiBase = String(config.public.apiBase || '').replace(/\/+$/, '')
    const serverApiBase = String(config.apiServerBase || '').replace(/\/+$/, '')
    const legacyApiBase = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
    const legacyApiEndpoint = legacyApiBase.endsWith('/api') ? legacyApiBase : `${legacyApiBase}/api`

    if (import.meta.server && apiBase.startsWith('/')) {
      return serverApiBase || legacyApiEndpoint
    }

    return apiBase
  }

  const resolveAssetUrl = (path?: string | null) => {
    const assetPath = String(path || '').trim()
    const normalizedAssetPath = assetPath.toLowerCase()
    if (!assetPath || normalizedAssetPath === 'null' || normalizedAssetPath === 'undefined') return ''
    if (/^(https?:|data:|blob:)/i.test(assetPath)) return assetPath

    const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`
    const apiBase = String(config.public.apiBase || '')

    if (/^https?:/i.test(apiBase)) {
      const apiUrl = new URL(apiBase)
      const assetBasePath = apiUrl.pathname.replace(/\/api\/?$/, '')

      return `${apiUrl.origin}${assetBasePath}${normalizedPath}`
    }

    const normalizedApiBase = apiBase.startsWith('/') ? apiBase : `/${apiBase}`
    const assetBasePath = normalizedApiBase.replace(/\/api\/?$/, '')

    return `${assetBasePath}${normalizedPath}`
  }

  const withAuthHeader = (headers?: HeadersInit, accessToken?: string | null) => {
    const nextHeaders = new Headers(headers)

    if (accessToken) {
      nextHeaders.set('Authorization', `Bearer ${accessToken}`)
    } else {
      nextHeaders.delete('Authorization')
    }

    return nextHeaders
  }

  const apiFetch = $fetch.create({
    baseURL: getApiBase()
  })

  const execute = async <T = any>(req: string, opts?: any, allowRefresh = true): Promise<T> => {
    const requestOptions = {
      ...opts,
      headers: withAuthHeader(opts?.headers, authStore.token)
    }

    try {
      return await apiFetch<T>(req, requestOptions)
    } catch (error: any) {
      const shouldRefresh = allowRefresh && error?.response?.status === 401 && !!authStore.refreshToken

      if (!shouldRefresh) {
        throw error
      }

      await authStore.refreshSession()

      return await execute<T>(req, opts, false)
    }
  }

  return {
    apiFetch: execute,
    resolveAssetUrl
  }
}
