export class LocalStorageManager {
  private static readonly HISTORY_KEY_SUFFIX = '-history'
  private static readonly MAX_HISTORY_SIZE = 10

  public static getHistory(baseKey: string): unknown[] {
    const historyKey = baseKey + this.HISTORY_KEY_SUFFIX
    const historyJson = localStorage.getItem(historyKey)
    return historyJson ? JSON.parse(historyJson) : []
  }

  public static addToHistory(baseKey: string, data: unknown) {
    const historyKey = baseKey + this.HISTORY_KEY_SUFFIX
    let history = this.getHistory(baseKey)
    history.push(data)
    if (history.length > this.MAX_HISTORY_SIZE) {
      history = history.slice(history.length - this.MAX_HISTORY_SIZE)
    }
    localStorage.setItem(historyKey, JSON.stringify(history))
  }

  public static clearHistory(baseKey: string) {
    const historyKey = baseKey + this.HISTORY_KEY_SUFFIX
    localStorage.removeItem(historyKey)
  }
}
