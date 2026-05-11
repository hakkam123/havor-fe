import { defineStore } from 'pinia'
import { ref } from 'vue'

type AuthUser = {
  id: number
  username: string
  email: string
}

type LoginResponse = AuthUser & {
  accessToken: string
  refreshToken: string
}

type RefreshResponse = {
  accessToken: string
  refreshToken: string
}

let refreshRequest: Promise<RefreshResponse> | null = null
let sessionVersion = 0

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = useCookie<string | null>('auth_token')
  const refreshToken = useCookie<string | null>('refresh_token')
  const config = useRuntimeConfig()

  const redirectToLogin = () => {
    if (!import.meta.client || window.location.pathname === '/admin/login') {
      return
    }

    window.location.href = '/admin/login'
  }

  const setTokens = (session: RefreshResponse) => {
    token.value = session.accessToken
    refreshToken.value = session.refreshToken
  }

  const clearAuthState = () => {
    token.value = null
    refreshToken.value = null
    user.value = null
  }

  const clearSession = ({ redirect = false } = {}) => {
    sessionVersion += 1
    clearAuthState()

    if (redirect) {
      redirectToLogin()
    }
  }

  const login = async (credentials: { email: string, password: string }) => {
    const res = await $fetch<LoginResponse>(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: credentials
    })

    sessionVersion += 1
    setTokens(res)
    user.value = {
      id: res.id,
      username: res.username,
      email: res.email
    }
  }

  const fetchUser = async () => {
    return user.value
  }

  const refreshSession = async () => {
    if (!refreshToken.value) {
      clearSession({ redirect: true })
      throw new Error('Missing refresh token')
    }

    if (!refreshRequest) {
      const activeRefreshToken = refreshToken.value
      const refreshVersion = sessionVersion

      refreshRequest = $fetch<RefreshResponse>(`${config.public.apiBase}/auth/refresh`, {
        method: 'POST',
        body: { refreshToken: activeRefreshToken }
      })
        .then((res) => {
          if (refreshVersion !== sessionVersion) {
            throw new Error('Session changed during refresh')
          }

          setTokens(res)
          return res
        })
        .catch((error: any) => {
          if (error?.response?.status === 401) {
            clearSession({ redirect: true })
          }

          throw error
        })
        .finally(() => {
          refreshRequest = null
        })
    }

    return refreshRequest
  }

  const logout = async () => {
    const activeRefreshToken = refreshToken.value

    try {
      if (activeRefreshToken) {
        await $fetch(`${config.public.apiBase}/auth/logout`, {
          method: 'POST',
          body: { refreshToken: activeRefreshToken }
        })
      }
    } finally {
      clearSession({ redirect: true })
    }
  }

  return {
    user,
    token,
    refreshToken,
    login,
    fetchUser,
    refreshSession,
    clearSession,
    logout
  }
})
