export interface AuthUser {
  name: string
  email: string
}

export const useAuth = () => {
  const token = useCookie<string | null>('rb_auth_token', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })

  const user = useState<AuthUser | null>('auth_user', () => null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    const data = await $fetch<{ token: string; user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    token.value = data.token
    user.value = data.user
    return data
  }

  const logout = async () => {
    token.value = null
    user.value = null
    await navigateTo('/login')
  }

  return { token, user, isAuthenticated, login, logout }
}
