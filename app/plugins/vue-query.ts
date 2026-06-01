import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 10 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false
      },
      mutations: {
        retry: 0
      }
    }
  })

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient
  })
})
