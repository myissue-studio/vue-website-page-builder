/**
 * @file This file manages the singleton instance of the PageBuilderService.
 * This pattern ensures that there is only one instance of the service throughout the application,
 * providing a single source of truth for the page builder's state and logic.
 */

import { PageBuilderService } from '../services/PageBuilderService'

/**
 * The singleton instance of the PageBuilderService.
 * It is initialized to null and will be set by the `setBuilderInstance` function.
 * @type {PageBuilderService | null}
 */
let instance: PageBuilderService | null = null

/**
 * Sets the singleton instance of the PageBuilderService.
 * This function is called by the Vue plugin to initialize the service.
 * It ensures that the instance is only set once.
 *
 * @param {PageBuilderService} newInstance - The new instance of the PageBuilderService to set.
 * @returns {void}
 */
export function setBuilderInstance(newInstance: PageBuilderService): void {
  if (!instance) {
    instance = newInstance
  }
}

/**
 * Retrieves the singleton instance of the PageBuilderService.
 * This function is used throughout the application to access the service.
 * It throws an error if the service has not been initialized, ensuring that
 * the plugin has been correctly installed.
 *
 * @throws {Error} If the PageBuilderService has not been initialized.
 * @returns {PageBuilderService} The singleton instance of the PageBuilderService.
 */
export function getPageBuilder(): PageBuilderService {
  if (!instance) {
    throw new Error(
      'PageBuilder has not been initialized. Please call app.use(pageBuilder) in your main application file.',
    )
  }
  return instance
}
