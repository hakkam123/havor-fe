import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ id: number, username: string, email: string } | null>(null)
  const token = useCookie('auth_token')
  const refreshToken = useCookie('refresh_token')
  const config = useRuntimeConfig()

  const login = async (credentials: { email: string, password: string }) => {
    // $fetch bypasses the interceptor intentionally here as it's the login
    const res = await $fetch<{ id: number, username: string, email: string, accessToken: string, refreshToken: string }>(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: credentials
    })
    
    token.value = res.accessToken
    refreshToken.value = res.refreshToken
    user.value = {
      id: res.id,
      username: res.username,
      email: res.email
    }
  }

  const fetchUser = async () => {
    return user.value
  }

  const logout = () => {
    token.value = null
    refreshToken.value = null
    user.value = null
    const router = useRouter()
    router.push('/admin/login')
  }

  return {
    user,
    token,
    refreshToken,
    login,
    fetchUser,
    logout
  }
})
