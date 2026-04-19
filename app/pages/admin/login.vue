<template>
  <div class="admin-panel relative overflow-hidden p-8 sm:p-9" v-motion-fade-up>
    <div class="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,106,61,0.12),transparent)]"></div>

    <div class="relative">
      <div class="mb-8 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-[var(--admin-accent)] text-2xl font-semibold text-white shadow-sm">H</div>
        <p class="admin-kicker mt-5">Admin Access</p>
        <h1 class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Welcome Back</h1>
        <p class="mt-2 text-sm text-slate-500">Sign in to continue managing the Havor dashboard workspace.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Email <span class="text-rose-500">*</span></label>
          <div class="relative">
            <Mail class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              v-model="email"
              type="email"
              required
              class="admin-input pl-12"
              placeholder="admin@havorsmarta.com"
            >
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-600">Password <span class="text-rose-500">*</span></label>
          <div class="relative">
            <Lock class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="admin-input pl-12 pr-12"
              placeholder="********"
            >
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-4 text-slate-400 transition hover:text-slate-700"
            >
              <Eye v-if="!showPassword" class="h-4 w-4" />
              <EyeOff v-else class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div v-if="errorMsg" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm text-rose-600">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="admin-primary-btn w-full py-3"
        >
          <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin" />
          <span v-else>Sign In</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth'
})

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  try {
    isLoading.value = true
    errorMsg.value = ''

    const authStore = useAuthStore()
    await authStore.login({ email: email.value, password: password.value })
    router.push('/admin')
  } catch (err) {
    if (err.response && err.response.status === 401) {
      errorMsg.value = 'Invalid email or password.'
    } else {
      errorMsg.value = 'An error occurred during login. Please try again later.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
