import type { App } from 'vue'
import { PageBuilderService } from './services/PageBuilderService'
import { sharedPageBuilderStore } from './stores/shared-store'
import { pageBuilderServiceKey } from './keys'

export const pageBuilder = {
  install: (app: App): void => {
    const instance = new PageBuilderService(sharedPageBuilderStore)
    app.provide(pageBuilderServiceKey, instance)
    app.config.globalProperties.$pageBuilder = instance
  },
}
