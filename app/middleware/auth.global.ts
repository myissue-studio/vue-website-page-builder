export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('rb_auth_token')

  if (!token.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (token.value && to.path === '/login') {
    return navigateTo('/')
  }
})
