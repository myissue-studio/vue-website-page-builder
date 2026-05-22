interface LoginBody {
  email: string
  password: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)

  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  // TODO: replace with real auth API call
  // const config = useRuntimeConfig(event)
  // const response = await $fetch(`${config.apiBaseUrl}/auth/login`, {
  //   method: 'POST',
  //   body: { email: body.email, password: body.password },
  // })

  return {
    token: `stub_${Date.now()}`,
    user: {
      name: body.email.split('@')[0],
      email: body.email,
    },
  }
})
