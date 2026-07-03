// src/plugin.ts
import type { App } from 'vue'
import { PageBuilderService } from './services/PageBuilderService'
import { sharedPageBuilderStore } from './stores/shared-store'
import { setBuilderInstance } from './composables/usePageBuilder'

export const pageBuilder = {
  install: (app: App): void => {
    const pageBuilderStateStore = sharedPageBuilderStore
    const instance = new PageBuilderService(pageBuilderStateStore)
    setBuilderInstance(instance)
    app.config.globalProperties.$pageBuilder = instance
  },
}
