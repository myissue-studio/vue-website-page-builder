const DEFAULT_API_URL = 'https://api.temp.md'

export interface TemporaryPreview {
  tempId: string
  canonicalUrl: string
  updateToken: string
  expiresAt?: string | null
}

export interface TemporaryPreviewOptions {
  apiUrl?: string
  fetcher?: typeof fetch
}

export class TemporaryPreviewError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'TemporaryPreviewError'
  }
}

async function readResponse(response: Response): Promise<Record<string, unknown>> {
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
  if (!response.ok) {
    const message =
      typeof body.error === 'string'
        ? body.error
        : typeof body.message === 'string'
          ? body.message
          : `Temporary preview request failed (${response.status})`
    throw new TemporaryPreviewError(message, response.status)
  }
  return body
}

function parsePreview(
  body: Record<string, unknown>,
  previous?: TemporaryPreview,
): TemporaryPreview {
  const tempId = typeof body.tempId === 'string' ? body.tempId : previous?.tempId
  const canonicalUrl =
    typeof body.canonicalUrl === 'string' ? body.canonicalUrl : previous?.canonicalUrl
  const updateToken =
    typeof body.updateToken === 'string' ? body.updateToken : previous?.updateToken

  if (!tempId || !canonicalUrl || !updateToken) {
    throw new TemporaryPreviewError('Temporary preview returned an invalid response', 502)
  }

  return {
    tempId,
    canonicalUrl,
    updateToken,
    expiresAt:
      typeof body.expiresAt === 'string' || body.expiresAt === null
        ? body.expiresAt
        : previous?.expiresAt,
  }
}

export async function publishTemporaryPreview(
  html: string,
  previous?: TemporaryPreview,
  options: TemporaryPreviewOptions = {},
): Promise<TemporaryPreview> {
  const fetcher = options.fetcher ?? fetch
  const apiUrl = (options.apiUrl ?? DEFAULT_API_URL).replace(/\/$/, '')
  const body = new FormData()
  body.append('file', new Blob([html], { type: 'text/html' }), 'index.html')

  const response = await fetcher(
    previous ? `${apiUrl}/temps/${encodeURIComponent(previous.tempId)}` : `${apiUrl}/temps`,
    {
      method: previous ? 'PUT' : 'POST',
      headers: previous ? { Authorization: `Bearer ${previous.updateToken}` } : undefined,
      body,
    },
  )

  return parsePreview(await readResponse(response), previous)
}

export async function removeTemporaryPreview(
  preview: TemporaryPreview,
  options: TemporaryPreviewOptions = {},
): Promise<void> {
  const fetcher = options.fetcher ?? fetch
  const apiUrl = (options.apiUrl ?? DEFAULT_API_URL).replace(/\/$/, '')
  const response = await fetcher(`${apiUrl}/temps/${encodeURIComponent(preview.tempId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${preview.updateToken}` },
  })

  if (response.status === 404 || response.status === 410) return
  await readResponse(response)
}

export function isExpiredPreviewCredential(error: unknown): boolean {
  return error instanceof TemporaryPreviewError && [401, 403, 404, 410].includes(error.status)
}

function getBrowserStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

export function loadTemporaryPreview(
  storageKey: string,
  storage: Storage | null = getBrowserStorage(),
): TemporaryPreview | null {
  try {
    const value = storage?.getItem(storageKey)
    if (!value) return null
    return parsePreview(JSON.parse(value) as Record<string, unknown>)
  } catch {
    return null
  }
}

export function saveTemporaryPreview(
  storageKey: string,
  preview: TemporaryPreview | null,
  storage: Storage | null = getBrowserStorage(),
): void {
  try {
    if (preview) storage?.setItem(storageKey, JSON.stringify(preview))
    else storage?.removeItem(storageKey)
  } catch {
    // Storage can be unavailable in embedded or privacy-restricted contexts.
  }
}
