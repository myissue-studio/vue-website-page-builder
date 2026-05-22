// Generic reverse proxy: forwards /api/proxy/<path> → API_BASE_URL/<path>
// Useful for proxying your own backend API so the client never calls it directly.
//
// Example: GET /api/proxy/products → API_BASE_URL/products
//          POST /api/proxy/orders  → API_BASE_URL/orders
export default defineEventHandler(async (event) => {
  const { apiBaseUrl, apiSecretKey } = useRuntimeConfig(event)

  if (!apiBaseUrl) {
    throw createError({ statusCode: 500, message: 'API_BASE_URL is not configured' })
  }

  const path = getRouterParam(event, 'path')
  const query = getQuery(event)
  const method = getMethod(event)

  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const targetUrl = `${apiBaseUrl}/${path}${queryString ? `?${queryString}` : ''}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (apiSecretKey) headers['X-Api-Key'] = apiSecretKey

  const hasBody = !['GET', 'HEAD'].includes(method)
  const body = hasBody ? await readBody(event) : undefined

  const response = await fetch(targetUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  setResponseStatus(event, response.status)

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
})
