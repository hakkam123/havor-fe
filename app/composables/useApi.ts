export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const resolveAssetUrl = (path?: string | null) => {
    if (!path) return ''
    if (/^(https?:|data:|blob:)/i.test(path)) return path

    const origin = new URL(config.public.apiBase).origin
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    return `${origin}${normalizedPath}`
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
    baseURL: config.public.apiBase
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
