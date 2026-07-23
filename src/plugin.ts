// src/plugin.ts
import type { App, Plugin } from 'vue'
import { PageBuilderService } from './services/PageBuilderService'
import { sharedPageBuilderStore } from './stores/shared-store'
import { setBuilderInstance } from './composables/usePageBuilder'

export const pageBuilder: Plugin = {
  install: (app: App): void => {
    const pageBuilderStateStore = sharedPageBuilderStore
    const instance = new PageBuilderService(pageBuilderStateStore)
    setBuilderInstance(instance)
    app.config.globalProperties.$pageBuilder = instance
  },
}
