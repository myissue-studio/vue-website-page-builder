// POST /api/proxy/odoo/cms
// Proxies to Odoo CMS webhook — keeps API key and session server-side.
//
// Body:
// {
//   "updatedOn": "2026-05-21T00:00:00.000Z",
//   "updatedBy": "user@example.com",
//   "key": "homepage",
//   "value": "<html>...</html>",
//   "version": "v1",
//   "state": "published" | "draft"
// }

interface CmsPayload {
  updatedOn: string
  updatedBy: string
  key: string
  value: string
  version: string
  state: 'published' | 'draft'
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (!config.odooBaseUrl) {
    throw createError({ statusCode: 500, message: 'ODOO_BASE_URL is not configured' })
  }
  if (!config.odooApiKey) {
    throw createError({ statusCode: 500, message: 'ODOO_API_KEY is not configured' })
  }

  const body = await readBody<CmsPayload>(event)

  if (!body?.key || !body?.value) {
    throw createError({ statusCode: 400, message: 'key and value are required' })
  }

  const url = `${config.odooBaseUrl}/webhooks/cms`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': config.odooApiKey,
    Authorization: `Bearer ${config.odooApiKey}`,
  }

  // Session cookie is optional — include it only when configured
  if (config.odooSessionId) {
    headers['Cookie'] = `session_id=${config.odooSessionId}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  const responseText = await response.text()

  // Forward the exact status code Odoo returned
  setResponseStatus(event, response.status)

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      message: `Odoo error: ${response.statusText}`,
      data: responseText,
    })
  }

  try {
    return JSON.parse(responseText)
  } catch {
    return { success: true, raw: responseText }
  }
})
