import { pageBuilder } from '@myissue/vue-website-page-builder'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(pageBuilder)
})
