export default defineEventHandler((event) => {
  // Allow same-origin iframes (page builder may be embedded)
  setResponseHeader(event, 'X-Frame-Options', 'SAMEORIGIN')
  setResponseHeader(event, 'Content-Security-Policy', "frame-ancestors 'self'")
})
