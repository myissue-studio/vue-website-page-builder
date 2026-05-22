export default defineNuxtConfig({
  compatibilityDate: '2025-05-21',

  ssr: true,

  app: {
    head: {
      viewport: 'minimum-scale=1, initial-scale=1, width=device-width',
      title: 'RubikX Builder',
      htmlAttrs: { lang: 'en' },
    },
  },

  modules: ['@nuxtjs/tailwindcss'],

  css: ['@myissue/vue-website-page-builder/style.css', '~/assets/css/main.css'],

  typescript: {
    strict: true,
  },

  components: {
    dirs: [{ path: '~/components', isAsync: true }],
  },

  imports: {
    dirs: ['composables', 'stores'],
    autoImport: true,
  },

  sourcemap: {
    server: true,
    client: false,
  },

  devtools: { enabled: true },

  experimental: {
    payloadExtraction: true,
  },

  runtimeConfig: {
    // Server-only secrets — never sent to the browser
    unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY,
    apiBaseUrl: process.env.API_BASE_URL,
    apiSecretKey: process.env.API_SECRET_KEY,
    odooBaseUrl: process.env.ODOO_BASE_URL,
    odooApiKey: process.env.ODOO_API_KEY,
    odooSessionId: process.env.ODOO_SESSION_ID,
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'RubikX Builder',
      env: process.env.NUXT_PUBLIC_ENV || 'development',
    },
  },

  nitro: {
    preset: process.env.NITRO_PRESET || 'node-server',
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-DNS-Prefetch-Control': 'off',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        },
      },
    },
  },
})
