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
      pageSettings: snapshot?.pageSettings ?? null,
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
