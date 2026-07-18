import { differenceInMinutes, format, formatDistance, isSameDay, subDays } from 'date-fns'
import { LocalStorageManager } from '../../services/LocalStorageManager'

export type HistorySnapshotLike = {
  pageBuilderContentSavedAt?: string
  components?: { title?: string; html_code?: string }[]
  pageSettings?: {
    classes?: string
    style?: string | Record<string, unknown>
    meta?: { title?: string; description?: string }
  }
}

type TranslateFn = (key: string) => string

const PREVIEW_MAX_LENGTH = 40

export function getHistoryPageTitle(snapshot: HistorySnapshotLike): string {
  const title = snapshot.pageSettings?.meta?.title
  return typeof title === 'string' ? title.trim() : ''
}

export function getHistorySectionCount(snapshot: HistorySnapshotLike): number {
  return Array.isArray(snapshot.components) ? snapshot.components.length : 0
}

export function formatHistorySectionCount(count: number, translate: TranslateFn): string {
  if (count === 1) return translate('1 section')
  return translate('{count} sections').replace('{count}', String(count))
}

/**
 * Relative time for history rows:
 * - under 1 hour → "2 minutes ago"
 * - earlier today → "Today · 16:28"
 * - yesterday → "Yesterday · 16:28"
 * - older → "16 Jul · 16:28"
 */
export function formatHistoryRelativeTime(
  savedAt: string | undefined,
  translate: TranslateFn,
  now: Date = new Date(),
): string {
  if (!savedAt) return translate('Unsaved snapshot')

  const date = new Date(savedAt)
  if (Number.isNaN(date.getTime())) return translate('Saved snapshot')

  const minutesAgo = Math.abs(differenceInMinutes(now, date))
  if (minutesAgo < 60) {
    return formatDistance(date, now, { addSuffix: true })
  }

  const clock = format(date, 'HH:mm')
  if (isSameDay(date, now)) {
    return `${translate('Today')} · ${clock}`
  }
  if (isSameDay(date, subDays(now, 1))) {
    return `${translate('Yesterday')} · ${clock}`
  }

  return format(date, 'd MMM · HH:mm')
}

function extractPlainText(html: string): string {
  if (!html) return ''

  if (typeof document !== 'undefined') {
    const template = document.createElement('template')
    template.innerHTML = html
    return (template.content.textContent || '').replace(/\s+/g, ' ').trim()
  }

  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function collectImageSrcs(html: string): string[] {
  if (!html) return []

  if (typeof document !== 'undefined') {
    const template = document.createElement('template')
    template.innerHTML = html
    return Array.from(template.content.querySelectorAll('img'))
      .map((image) => image.getAttribute('src') || '')
      .filter(Boolean)
  }

  return Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)).map((match) => match[1])
}

function snapshotImageSrcKey(snapshot: HistorySnapshotLike, endExclusive?: number): string {
  const components = snapshot.components ?? []
  const slice =
    typeof endExclusive === 'number' ? components.slice(0, endExclusive) : components
  return slice.flatMap((component) => collectImageSrcs(component.html_code ?? '')).join('\n')
}

function snapshotPlainTextKey(snapshot: HistorySnapshotLike, endExclusive?: number): string {
  const components = snapshot.components ?? []
  const slice =
    typeof endExclusive === 'number' ? components.slice(0, endExclusive) : components
  return slice.map((component) => extractPlainText(component.html_code ?? '')).join('\n')
}

function componentsMarkupChanged(
  current: HistorySnapshotLike,
  previous: HistorySnapshotLike,
): boolean {
  const currentComponents = current.components ?? []
  const previousComponents = previous.components ?? []
  if (currentComponents.length !== previousComponents.length) return true

  return currentComponents.some((component, index) => {
    const previousComponent = previousComponents[index]
    return (
      (component?.html_code ?? '') !== (previousComponent?.html_code ?? '') ||
      (component?.title ?? '') !== (previousComponent?.title ?? '')
    )
  })
}

function pageSettingsChanged(current: HistorySnapshotLike, previous: HistorySnapshotLike): boolean {
  return !LocalStorageManager.hasSameUndoPayload(
    { components: [], pageSettings: previous.pageSettings ?? null },
    { components: [], pageSettings: current.pageSettings ?? null },
  )
}

/** Short quote from the first section that changed vs previous. */
export function getHistoryChangePreview(
  current: HistorySnapshotLike,
  previous: HistorySnapshotLike | null | undefined,
  maxLength = PREVIEW_MAX_LENGTH,
): string {
  if (!previous) return ''

  const currentComponents = current.components ?? []
  const previousComponents = previous.components ?? []

  for (let index = 0; index < currentComponents.length; index += 1) {
    const html = currentComponents[index]?.html_code ?? ''
    const previousHtml = previousComponents[index]?.html_code ?? ''
    if (html === previousHtml) continue

    const text = extractPlainText(html)
    if (!text) continue

    return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text
  }

  return ''
}

/**
 * Multi-label summary of what changed. Several reasons can appear in one save
 * (e.g. text + image + section add before autosave).
 */
export function describeHistoryChange(
  current: HistorySnapshotLike,
  previous: HistorySnapshotLike | null | undefined,
  translate: TranslateFn,
): string {
  if (!previous) return translate('Starting point')

  const parts: string[] = []
  const delta = getHistorySectionCount(current) - getHistorySectionCount(previous)

  if (delta === 1) {
    parts.push(translate('+1 section'))
  } else if (delta > 1) {
    parts.push(translate('+{count} sections').replace('{count}', String(delta)))
  } else if (delta === -1) {
    parts.push(translate('-1 section'))
  } else if (delta < -1) {
    parts.push(translate('-{count} sections').replace('{count}', String(Math.abs(delta))))
  }

  const overlap = Math.min(getHistorySectionCount(current), getHistorySectionCount(previous))
  const imagesChanged =
    snapshotImageSrcKey(current, overlap) !== snapshotImageSrcKey(previous, overlap)
  const textChanged =
    snapshotPlainTextKey(current, overlap) !== snapshotPlainTextKey(previous, overlap)

  if (imagesChanged) {
    parts.push(translate('Image updated'))
  }
  if (textChanged) {
    parts.push(translate('Text updated'))
  } else if (delta === 0 && componentsMarkupChanged(current, previous) && !imagesChanged) {
    // Class/style markup without text or image src changes.
    parts.push(translate('Content updated'))
  }

  if (pageSettingsChanged(current, previous)) {
    parts.push(translate('Page styles'))
  }

  if (parts.length === 0) return translate('Content updated')
  return parts.join(' · ')
}

export type HistoryHintParts = {
  /** e.g. "20 minutes ago · 12 sections" */
  meta: string
  /** e.g. "+1 section · Image updated · Text updated" */
  change: string
  /** Plain preview text without quotes; empty when none */
  preview: string
}

/** Structured hint for multi-line history rows. */
export function buildHistoryHintParts(
  snapshot: HistorySnapshotLike,
  previous: HistorySnapshotLike | null | undefined,
  translate: TranslateFn,
  now: Date = new Date(),
): HistoryHintParts {
  const time = formatHistoryRelativeTime(snapshot.pageBuilderContentSavedAt, translate, now)
  const sections = formatHistorySectionCount(getHistorySectionCount(snapshot), translate)

  return {
    meta: `${time} · ${sections}`,
    change: describeHistoryChange(snapshot, previous, translate),
    preview: getHistoryChangePreview(snapshot, previous),
  }
}

/** Flat string for labels / tests; UI prefers {@link buildHistoryHintParts}. */
export function buildHistoryHint(
  snapshot: HistorySnapshotLike,
  previous: HistorySnapshotLike | null | undefined,
  translate: TranslateFn,
  now: Date = new Date(),
): string {
  const { meta, change, preview } = buildHistoryHintParts(snapshot, previous, translate, now)
  return preview ? `${meta} · ${change} · “${preview}”` : `${meta} · ${change}`
}
