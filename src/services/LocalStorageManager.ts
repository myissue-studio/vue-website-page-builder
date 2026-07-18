export class LocalStorageManager {
  private static readonly HISTORY_KEY_SUFFIX = '-history'
  public static readonly MAX_HISTORY_SIZE = 20

  public static getHistory(baseKey: string): unknown[] {
    const historyKey = baseKey + this.HISTORY_KEY_SUFFIX
    const historyJson = localStorage.getItem(historyKey)
    return historyJson ? JSON.parse(historyJson) : []
  }

  private static stableStringify(value: unknown): string {
    return JSON.stringify(value, (_key, currentValue) => {
      if (currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue)) {
        return Object.keys(currentValue as Record<string, unknown>)
          .sort()
          .reduce<Record<string, unknown>>((result, key) => {
            result[key] = (currentValue as Record<string, unknown>)[key]
            return result
          }, {})
      }

      return currentValue
    })
  }

  private static getUndoPayload(data: unknown): unknown {
    const snapshot = data as
      | {
          components?: unknown
          pageSettings?: unknown
        }
      | null
      | undefined

    return {
      components: snapshot?.components ?? [],
      pageSettings: this.normalizePageSettingsForUndo(snapshot?.pageSettings),
    }
  }

  private static normalizePageSettingsForUndo(pageSettings: unknown): unknown {
    if (!pageSettings || typeof pageSettings !== 'object') {
      return pageSettings ?? null
    }

    const settings = pageSettings as {
      classes?: unknown
      style?: unknown
      meta?: unknown
    }

    const classes =
      typeof settings.classes === 'string'
        ? Array.from(
            new Set(
              settings.classes
                .split(/\s+/)
                .map((token) => token.trim())
                .filter(Boolean),
            ),
          )
            .sort()
            .join(' ')
        : settings.classes

    const style =
      typeof settings.style === 'string' ? settings.style.trim() : (settings.style ?? '')

    const meta =
      settings.meta && typeof settings.meta === 'object'
        ? {
            title:
              typeof (settings.meta as { title?: unknown }).title === 'string'
                ? (settings.meta as { title: string }).title.trim()
                : '',
            description:
              typeof (settings.meta as { description?: unknown }).description === 'string'
                ? (settings.meta as { description: string }).description.trim()
                : '',
          }
        : { title: '', description: '' }

    // Treat missing/empty meta the same so older drafts without meta do not
    // create history entries when a save adds empty title/description fields.
    const normalizedMeta =
      meta.title || meta.description ? meta : { title: '', description: '' }

    return {
      classes: classes ?? '',
      style,
      meta: normalizedMeta,
    }
  }

  public static hasSameUndoPayload(left: unknown, right: unknown): boolean {
    return (
      this.stableStringify(this.getUndoPayload(left)) ===
      this.stableStringify(this.getUndoPayload(right))
    )
  }

  public static addToHistory(baseKey: string, data: unknown, currentIndex?: number): unknown[] {
    const historyKey = baseKey + this.HISTORY_KEY_SUFFIX
    let history = this.getHistory(baseKey)

    if (
      typeof currentIndex === 'number' &&
      currentIndex >= 0 &&
      currentIndex < history.length - 1
    ) {
      history = history.slice(0, currentIndex + 1)
    }

    const lastState = history[history.length - 1]
    if (lastState && this.hasSameUndoPayload(lastState, data)) {
      return history
    }

    history.push(data)
    if (history.length > this.MAX_HISTORY_SIZE) {
      history = history.slice(history.length - this.MAX_HISTORY_SIZE)
    }
    localStorage.setItem(historyKey, JSON.stringify(history))

    return history
  }

  public static clearHistory(baseKey: string) {
    const historyKey = baseKey + this.HISTORY_KEY_SUFFIX
    localStorage.removeItem(historyKey)
  }
}
