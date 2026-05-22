export default defineEventHandler((event) => {
  const reqUrl = event.node.req.url || ''
  const decodedUrl = decodeURIComponent(reqUrl)

  const unsafePattern = /[<>"'`;(){}]/g
  if (unsafePattern.test(decodedUrl)) {
    throw createError({ statusCode: 400, message: 'Bad Request' })
  }

  const blacklistPatterns = [
    /\.php$/,
    /\.asp$/,
    /\.jsp$/,
    /\.aspx$/,
    /\.env$/,
    /\.git/,
    /\/api\/.*<script>/i,
  ]

  for (const pattern of blacklistPatterns) {
    if (pattern.test(decodedUrl)) {
      throw createError({ statusCode: 400, message: 'Bad Request' })
    }
  }
})
