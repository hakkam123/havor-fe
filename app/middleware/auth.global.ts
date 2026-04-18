export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return

  const token = useCookie('auth_token')
  const legacyRedirectMap: Record<string, string> = {
    '/login': '/admin/login',
    '/news': '/admin/news',
    '/products': '/admin/products',
    '/works': '/admin/works',
    '/careers': '/admin/careers',
    '/banners': '/admin/banners',
    '/expertises': '/admin/expertises',
    '/categories': '/admin/categories',
    '/inbox': '/admin/inbox',
    '/profile': '/admin/profile'
  }

  const legacyTarget = legacyRedirectMap[to.path]
  if (legacyTarget) {
    return navigateTo(legacyTarget)
  }

  const isAdminRoute = to.path.startsWith('/admin')
  const isLoginPage = to.path === '/admin/login'

  // Public routes stay open; only /admin/* is protected except admin login.
  if (isAdminRoute && !token.value && !isLoginPage) {
    return navigateTo('/admin/login')
  }

  // If authenticated, keep user out of admin login form.
  if (token.value && isLoginPage) {
    return navigateTo('/admin')
  }
})
