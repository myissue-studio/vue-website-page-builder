// GET /api/proxy/unsplash?query=mountains&page=1&per_page=20
export default defineEventHandler(async (event) => {
  const { query, page = '1', per_page = '20' } = getQuery(event)

  if (!query) {
    throw createError({ statusCode: 400, message: 'query param is required' })
  }

  const { unsplashAccessKey } = useRuntimeConfig(event)
  if (!unsplashAccessKey) {
    throw createError({ statusCode: 500, message: 'UNSPLASH_ACCESS_KEY is not configured' })
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(String(query))}&page=${page}&per_page=${per_page}`

  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${unsplashAccessKey}` },
  })

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: `Unsplash API error: ${response.statusText}` })
  }

  return response.json()
})
