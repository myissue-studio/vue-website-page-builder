import { inject } from 'vue'
import { pageBuilderServiceKey } from '../keys'
import type { PageBuilderService } from '../services/PageBuilderService'

export function getPageBuilder(): PageBuilderService {
  // Use Vue's inject to get the service instance
  const instance = inject(pageBuilderServiceKey)

  // If the instance doesn't exist, throw the same error as before
  if (!instance) {
    throw new Error(
      'PageBuilder has not been initialized. Please call app.use(pageBuilder) in your main application file.',
    )
  }
  return instance
}
