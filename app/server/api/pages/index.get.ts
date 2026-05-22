export default defineEventHandler(async (event) => {
  const { websiteId } = getQuery(event)

  if (!websiteId) {
    throw createError({ statusCode: 400, message: 'websiteId is required' })
  }

  // TODO: replace with real API call
  // const config = useRuntimeConfig(event)
  // return await $fetch(`${config.apiBaseUrl}/pages?websiteId=${websiteId}`, {
  //   headers: { 'X-Api-Key': config.apiSecretKey },
  // })

  return [
    {
      id: 1,
      name: 'Home',
      slug: '/',
      version: 3,
      updatedAt: new Date('2026-05-22').toISOString(),
      status: 'published',
    },
    {
      id: 2,
      name: 'About',
      slug: '/about',
      version: 1,
      updatedAt: new Date('2026-05-20').toISOString(),
      status: 'draft',
    },
    {
      id: 3,
      name: 'Contact',
      slug: '/contact',
      version: 2,
      updatedAt: new Date('2026-05-18').toISOString(),
      status: 'published',
    },
  ]
})
