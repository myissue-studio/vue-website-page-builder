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

function componentsContentChanged(
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

  if (delta === 0 && componentsContentChanged(current, previous)) {
    parts.push(translate('Text updated'))
  }

  if (pageSettingsChanged(current, previous)) {
    parts.push(translate('Page styles'))
  }

  if (parts.length === 0) return translate('Content updated')
  return parts.join(' · ')
}

export function buildHistoryHint(
  snapshot: HistorySnapshotLike,
  previous: HistorySnapshotLike | null | undefined,
  translate: TranslateFn,
  now: Date = new Date(),
): string {
  const time = formatHistoryRelativeTime(snapshot.pageBuilderContentSavedAt, translate, now)
  const sections = formatHistorySectionCount(getHistorySectionCount(snapshot), translate)
  const change = describeHistoryChange(snapshot, previous, translate)
  return `${time} · ${sections} · ${change}`
}
