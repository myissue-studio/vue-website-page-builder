/** Default gray “mountain” placeholder used by builder image blocks. */
export function getPlaceholderImageDataUrl(): string {
  const singleImageSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
      <defs>
        <style>
          .bg { fill: #384152; }
          .fg { fill: #718096; }
        </style>
      </defs>
      <rect class="bg" width="200" height="150"/>
      <polygon class="fg" points="65 90.01 90 60.01 115 90.01"/>
      <polygon class="fg" points="110 90.01 122.5 75.01 135 90.01"/>
      <circle class="fg" cx="122.5" cy="64.15" r="4.16"/>
    </svg>
  `

  const encodedSvg = encodeURIComponent(singleImageSvg.trim())
  return `data:image/svg+xml,${encodedSvg}`
}
