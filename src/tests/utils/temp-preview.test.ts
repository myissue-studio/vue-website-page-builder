// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  isExpiredPreviewCredential,
  loadTemporaryPreview,
  publishTemporaryPreview,
  removeTemporaryPreview,
  saveTemporaryPreview,
  TemporaryPreviewError,
} from '../../utils/builder/temp-preview'
import type { TemporaryPreview } from '../../utils/builder/temp-preview'

const preview: TemporaryPreview = {
  tempId: 'temp_123',
  canonicalUrl: 'https://example.temp.md',
  updateToken: 'tempmd_secret',
  expiresAt: '2026-08-31T12:00:00.000Z',
}

describe('temporary previews', () => {
  const values = new Map<string, string>()
  const storage = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    removeItem: vi.fn((key: string) => values.delete(key)),
    clear: vi.fn(() => values.clear()),
    key: vi.fn(() => null),
    get length() {
      return values.size
    },
  } satisfies Storage

  beforeEach(() => {
    values.clear()
    vi.clearAllMocks()
  })

  it('publishes standalone HTML as a multipart file', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(preview), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(
      publishTemporaryPreview('<html>Hello</html>', undefined, { fetcher }),
    ).resolves.toEqual(preview)

    expect(fetcher).toHaveBeenCalledOnce()
    const [url, request] = fetcher.mock.calls[0]
    expect(url).toBe('https://api.temp.md/temps')
    expect(request.method).toBe('POST')
    expect(request.body).toBeInstanceOf(FormData)
    expect((request.body as FormData).get('file')).toBeInstanceOf(Blob)
  })

  it('updates the same URL with its scoped token', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ canonicalUrl: preview.canonicalUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(
      publishTemporaryPreview('<html>Updated</html>', preview, { fetcher }),
    ).resolves.toEqual(preview)

    const [url, request] = fetcher.mock.calls[0]
    expect(url).toBe('https://api.temp.md/temps/temp_123')
    expect(request.method).toBe('PUT')
    expect(request.headers).toEqual({ Authorization: 'Bearer tempmd_secret' })
  })

  it('removes an existing preview and accepts an already-gone response', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 404 }))
    await removeTemporaryPreview(preview, { fetcher })

    expect(fetcher).toHaveBeenCalledWith('https://api.temp.md/temps/temp_123', {
      method: 'DELETE',
      headers: { Authorization: 'Bearer tempmd_secret' },
    })
  })

  it('identifies credentials that should fall back to a fresh preview', () => {
    expect(isExpiredPreviewCredential(new TemporaryPreviewError('Gone', 410))).toBe(true)
    expect(isExpiredPreviewCredential(new TemporaryPreviewError('Server error', 500))).toBe(false)
  })

  it('persists the scoped update capability locally', () => {
    saveTemporaryPreview('preview-key', preview, storage)
    expect(loadTemporaryPreview('preview-key', storage)).toEqual(preview)
    saveTemporaryPreview('preview-key', null, storage)
    expect(loadTemporaryPreview('preview-key', storage)).toBeNull()
  })
})
