export default defineNuxtConfig({
  compatibilityDate: '2025-05-21',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  css: ['@myissue/vue-website-page-builder/style.css', '~/assets/css/main.css'],

  // Server-side secrets (never exposed to browser)
  runtimeConfig: {
    unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY,
    apiBaseUrl: process.env.API_BASE_URL,
    apiSecretKey: process.env.API_SECRET_KEY,
    // Odoo
    odooBaseUrl: process.env.ODOO_BASE_URL,
    odooApiKey: process.env.ODOO_API_KEY,
    odooSessionId: process.env.ODOO_SESSION_ID,
    // Public keys are accessible on both client and server
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'RubikX Builder',
    },
  },

  nitro: {
    // Swap preset via env: NITRO_PRESET=aws-lambda for Amplify Lambda,
    // NITRO_PRESET=static for S3/CDN-only static hosting.
    // Defaults to node-server for local preview / EC2-style deploys.
    preset: (process.env.NITRO_PRESET as 'node-server') || 'node-server',
  },
})
