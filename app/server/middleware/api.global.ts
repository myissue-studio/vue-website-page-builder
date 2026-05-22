export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api')) return

  setResponseHeader(event, 'X-Cache', 'BYPASS')
})
