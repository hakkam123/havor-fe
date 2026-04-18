<template>
  <div class="glass-panel p-8 w-full relative" v-motion-fade-up>
    <div class="text-center mb-8">
      <div class="w-14 h-14 mx-auto bg-slate-900 rounded-2xl flex items-center justify-center mb-4">
        <span class="text-2xl font-semibold text-white">H</span>
      </div>
      <h1 class="text-2xl font-semibold text-slate-900 mb-2">Welcome Back</h1>
      <p class="text-slate-500 text-sm">Sign in to Havor CMS Dashboard</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-slate-600 mb-1">Email <span class="text-rose-500">*</span></label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail class="w-5 h-5 text-slate-500" />
          </div>
          <input 
            v-model="email" 
            type="email" 
            required
            class="input-field pl-10" 
            placeholder="admin@havorsmarta.com"
          >
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-600 mb-1">Password <span class="text-rose-500">*</span></label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock class="w-5 h-5 text-slate-500" />
          </div>
          <input 
            v-model="password" 
            :type="showPassword ? 'text' : 'password'" 
            required
            class="input-field pl-10 pr-10" 
            placeholder="••••••••"
          >
          <button 
            type="button" 
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Eye v-if="!showPassword" class="w-4 h-4" />
            <EyeOff v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-if="errorMsg" class="text-rose-600 text-sm bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
        {{ errorMsg }}
      </div>

      <button 
        type="submit" 
        :disabled="isLoading"
        class="w-full btn-primary py-2.5 flex items-center justify-center gap-2"
      >
        <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
        <span v-else>Sign In</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

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
