export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')
  const refreshToken = useCookie('refresh_token')

  const resolveAssetUrl = (path?: string | null) => {
    if (!path) return ''
    if (/^(https?:|data:|blob:)/i.test(path)) return path

    const origin = new URL(config.public.apiBase).origin
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    return `${origin}${normalizedPath}`
  }
  
  // Shared fetcher
  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      if (token.value) {
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${token.value}`)
        options.headers = headers
      }
    },
    async onResponseError({ request, response, options }) {
      if (response.status === 401 && refreshToken.value) {
        // Attempt to refresh
        try {
          const authRes = await $fetch<{ accessToken: string }>(`${config.public.apiBase}/auth/refresh`, {
            method: 'POST',
            body: { refreshToken: refreshToken.value }
          })
          
          if (authRes && authRes.accessToken) {
            token.value = authRes.accessToken
            
            // Retry original request (naive retry, note $fetch isn't natively built for easy replay, 
            // but we can call it again by cloning the original params)
            const headers = new Headers(options.headers as HeadersInit)
            headers.set('Authorization', `Bearer ${authRes.accessToken}`)
            options.headers = headers
            // The ofetch interceptor doc suggests returning a new execution. 
            // Unfortunately in onResponseError it doesn't automatically return the new promise to the caller,
            // but we can throw a specific error or rely on the caller to retry.
            // Better approach for Nuxt 3 `$fetch` retry:
          }
        } catch (refreshErr) {
          // If refresh fails, clear tokens and redirect
          token.value = null
          refreshToken.value = null
          if (import.meta.client) {
            window.location.href = '/admin/login'
          }
        }
      }
    }
  })

  // Since ofetch doesn't elegantly support returning retried responses from `onResponseError` directly 
  // back to the original caller without wrappers, we provide a unified wrapper.
  const execute = async <T = any>(req: string, opts?: any): Promise<T> => {
    try {
      return await apiFetch<T>(req, opts)
    } catch (error: any) {
      if (error.response?.status === 401 && refreshToken.value) {
        // Try refresh & retry one time inline
        try {
          const ref = await $fetch<{ accessToken: string }>(`${config.public.apiBase}/auth/refresh`, {
            method: 'POST',
            body: { refreshToken: refreshToken.value }
          })
          token.value = ref.accessToken
          
        
          const newOpts = { ...opts, headers: { ...opts?.headers, Authorization: `Bearer ${token.value}` } }
          return await apiFetch<T>(req, newOpts)
        } catch (e) {
             token.value = null
             refreshToken.value = null
             if (import.meta.client) window.location.href = '/admin/login'
             throw e
        }
      }
      throw error
    }
  }

  return {
    apiFetch: execute,
    resolveAssetUrl
  }
}
