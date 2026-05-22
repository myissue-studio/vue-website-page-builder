import { defineEventHandler, getQuery, createError } from 'h3'

// Proxies Unsplash search so the API key stays server-side.
// Usage: GET /api/proxy/unsplash?query=mountains&page=1&per_page=20
export default defineEventHandler(async (event) => {
  const { query, page = '1', per_page = '20' } = getQuery(event)

  if (!query) throw createError({ statusCode: 400, message: 'query param is required' })

  const apiKey = process.env.VITE_UNSPLASH_ACCESS_KEY
  if (!apiKey) throw createError({ statusCode: 500, message: 'VITE_UNSPLASH_ACCESS_KEY is not set' })

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(String(query))}&page=${page}&per_page=${per_page}`

  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${apiKey}` },
  })

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: `Unsplash error: ${response.statusText}` })
  }

  return response.json()
})
