export const delay = function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
