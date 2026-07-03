export function preloadImage(url: string) {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = resolve
    img.onerror = reject
    img.src = url
  })
}
