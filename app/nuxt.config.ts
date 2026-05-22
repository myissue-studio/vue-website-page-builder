export default defineNuxtConfig({
  compatibilityDate: '2025-05-21',
  ssr: false,

  modules: ['@nuxtjs/tailwindcss'],

  css: ['@myissue/vue-website-page-builder/style.css', '~/assets/css/main.css'],

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
    },
  },

  nitro: {
    preset: process.env.NITRO_PRESET || 'node-server',
  },
})
