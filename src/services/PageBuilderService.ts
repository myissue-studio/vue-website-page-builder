import { LocalStorageManager } from './LocalStorageManager'
import type {
  BuilderResourceData,
  ComponentObject,
  ImageObject,
  PageBuilderConfig,
  PageSettings,
  SEOCheck,
  SEOSummary,
  StartBuilderResult,
} from '../types'
import type { usePageBuilderStateStore } from '../stores/page-builder-state'

import tailwindFontSizes from '../utils/builder/tailwind-font-sizes'
import tailwindColors from '../utils/builder/tailwaind-colors'
import tailwindOpacities from '../utils/builder/tailwind-opacities'
import tailwindFontStyles from '../utils/builder/tailwind-font-styles'
import tailwindPaddingAndMargin from '../utils/builder/tailwind-padding-margin'
import tailwindBorderRadius from '../utils/builder/tailwind-border-radius'
import tailwindBorderStyleWidthPlusColor from '../utils/builder/tailwind-border-style-width-color'
import { computed, ref, nextTick } from 'vue'
import type { ComputedRef } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { delay } from '../composables/delay'
import { isEmptyObject } from '../helpers/isEmptyObject'
import { extractCleanHTMLFromPageBuilder } from '../composables/extractCleanHTMLFromPageBuilder'

// Define available languages as a type and an array for easy iteration and type safety
export type AvailableLanguage =
  | 'en'
  | 'zh-Hans'
  | 'fr'
  | 'ja'
  | 'ru'
  | 'es'
  | 'pt'
  | 'de'
  | 'ar'
  | 'hi'
  | 'da'
  | 'it'

export const AVAILABLE_LANGUAGES: AvailableLanguage[] = [
  'en',
  'zh-Hans',
  'fr',
  'ja',
  'ru',
  'es',
  'pt',
  'de',
  'ar',
  'hi',
  'da',
  'it',
]

export class PageBuilderService {
  // Class properties with types
  private fontSizeRegex =
    /^(sm:|md:|lg:|xl:|2xl:)?pbx-text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/

  protected pageBuilderStateStore: ReturnType<typeof usePageBuilderStateStore>
  private getLocalStorageItemName: ComputedRef<string | null>
  private getApplyImageToSelection: ComputedRef<ImageObject>
  private getHyberlinkEnable: ComputedRef<boolean>
  private getComponents: ComputedRef<ComponentObject[] | null>
  private getComponent: ComputedRef<ComponentObject | null>
  private getElement: ComputedRef<HTMLElement | null>
  private getComponentArrayAddMethod: ComputedRef<string | null>
  private NoneListernesTags: string[]
  private hasStartedEditing: boolean = false
  // Hold data from Database or Backend for updated post
  private originalComponents: BuilderResourceData | undefined = undefined
  // Holds data to be mounted when pagebuilder is not yet present in the DOM
  private savedMountComponents: BuilderResourceData | null = null
  private pendingMountComponents: BuilderResourceData | null = null
  private isPageBuilderMissingOnStart: boolean = false

  // Add a class-level WeakMap to track elements and their listeners
  // Use class-level WeakMap from being a local variable inside addListenersToEditableElements to a private class-level property.
  // This ensures that the map persists across multiple calls to the method and retains knowledge of
  // which elements already have listeners.
  // This prevents multiple event listeners being attached to the same HTML elements
  private elementsWithListeners = new WeakMap<
    Element,
    { click: EventListener; mouseover: EventListener; mouseleave: EventListener }
  >()

  constructor(pageBuilderStateStore: ReturnType<typeof usePageBuilderStateStore>) {
    this.hasStartedEditing = false
    this.pageBuilderStateStore = pageBuilderStateStore
    this.getApplyImageToSelection = computed(
      () => this.pageBuilderStateStore.getApplyImageToSelection,
    )
    this.getLocalStorageItemName = computed(
      () => this.pageBuilderStateStore.getLocalStorageItemName,
    )
    this.getHyberlinkEnable = computed(() => this.pageBuilderStateStore.getHyberlinkEnable)
    this.getComponents = computed(() => this.pageBuilderStateStore.getComponents)

    this.getComponent = computed(() => this.pageBuilderStateStore.getComponent)

    this.getElement = computed(() => this.pageBuilderStateStore.getElement)

    this.getComponentArrayAddMethod = computed(
      () => this.pageBuilderStateStore.getComponentArrayAddMethod,
    )

    this.NoneListernesTags = [
      'P',
      'H1',
      'H2',
      'H3',
      'H4',
      'H5',
      'H6',
      'IFRAME',
      'UL',
      'OL',
      'LI',
      'EM',
      'STRONG',
      'B',
      'A',
      'SPAN',
      'BLOCKQUOTE',
      'BR',
      'PRE',
      'CODE',
      'MARK',
      'DEL',
      'INS',
      'U',
      'FIGURE',
      'FIGCAPTION',
    ]
  }

  /**
   * Returns an array of available languages.
   * @returns {AvailableLanguage[]} An array of available language codes.
   */
  public availableLanguage(): AvailableLanguage[] {
    return AVAILABLE_LANGUAGES
  }

  /**
   * Sets the current language in the page builder state.
   * @param {string} lang - The language code to set.
   */
  public changeLanguage(lang: string) {
    this.pageBuilderStateStore.setCurrentLanguage(lang)
  }
  /**
   * Deselects any selected or hovered elements in the builder UI.
   * @returns {Promise<void>}
   */
  async clearHtmlSelection(): Promise<void> {
    this.pageBuilderStateStore.setComponent(null)
    this.pageBuilderStateStore.setElement(null)
    await this.removeHoveredAndSelected()
  }

  /**
   * Ensures that the `updateOrCreate` configuration is valid and sets default values if necessary.
   * @param {PageBuilderConfig} config - The page builder configuration.
   * @private
   */
  private ensureUpdateOrCreateConfig(config: PageBuilderConfig): void {
    // Case A: updateOrCreate is missing or an empty object
    if (!config.updateOrCreate || (config.updateOrCreate && isEmptyObject(config.updateOrCreate))) {
      const updatedConfig = {
        ...config,
        updateOrCreate: {
          formType: 'create',
          formName: 'post',
        },
      } as const

      this.pageBuilderStateStore.setPageBuilderConfig(updatedConfig)
      return
    }

    // Case B: formType is valid ('create' or 'update'), but formName is missing or an empty string
    if (
      (config.updateOrCreate &&
        typeof config.updateOrCreate.formType === 'string' &&
        (config.updateOrCreate.formType === 'create' ||
          config.updateOrCreate.formType === 'update') &&
        typeof config.updateOrCreate.formName !== 'string') ||
      (typeof config.updateOrCreate.formName === 'string' &&
        config.updateOrCreate.formName.length === 0)
    ) {
      const updatedConfig = {
        ...config,
        updateOrCreate: {
          formType: config.updateOrCreate.formType,
          formName: 'post',
        },
      } as const
      this.pageBuilderStateStore.setPageBuilderConfig(updatedConfig)
    }

    // Case C: formType is missing or not a valid string like ('create' or 'update') but formName is valid string
    if (
      (config.updateOrCreate && typeof config.updateOrCreate.formType !== 'string') ||
      (typeof config.updateOrCreate.formType === 'string' &&
        config.updateOrCreate.formType !== 'create' &&
        config.updateOrCreate.formType !== 'update' &&
        typeof config.updateOrCreate.formName === 'string' &&
        config.updateOrCreate.formName.length !== 0)
    ) {
      const updatedConfig = {
        ...config,
        updateOrCreate: {
          formType: 'create',
          formName: config.updateOrCreate.formName,
        },
      } as const

      this.pageBuilderStateStore.setPageBuilderConfig(updatedConfig)
      return
    }

    // Case D: formType exists but is not 'create' or 'update', and formName is missing or invalid
    if (
      config.updateOrCreate &&
      typeof config.updateOrCreate.formType === 'string' &&
      config.updateOrCreate.formType !== 'create' &&
      config.updateOrCreate.formType !== 'update' &&
      typeof config.formName !== 'string'
    ) {
      const updatedConfig = {
        ...config,
        updateOrCreate: {
          formType: 'create',
          formName: 'post',
        },
      } as const

      this.pageBuilderStateStore.setPageBuilderConfig(updatedConfig)
    }
  }

  /**
   * Validates the user-provided components array.
   * @param {unknown} components - The components data to validate.
   * @returns {{error: true, warning: string, status: string} | {error: true, reason: string} | undefined} An error object if validation fails, otherwise undefined.
   * @private
   */
  private validateUserProvidedComponents(components: unknown) {
    const formType =
      this.pageBuilderStateStore.getPageBuilderConfig &&
      this.pageBuilderStateStore.getPageBuilderConfig.updateOrCreate &&
      this.pageBuilderStateStore.getPageBuilderConfig.updateOrCreate.formType

    if (
      Array.isArray(components) &&
      components.length >= 1 &&
      formType === 'create' &&
      components
    ) {
      return {
        error: true as const,
        warning:
          'You cannot set formType to create in your configuration while also passing a components data array to the Page Builder. Please set formType to update.',
        status: 'validation_failed',
      }
    }

    // Must be an array
    if (!Array.isArray(components)) {
      return {
        error: true as const,
        reason: 'Components data must be an array.',
      }
    }

    // Check that the first item looks like a component
    const first = components[0]

    if (first && 'html_code' in first && typeof first.html_code !== 'string') {
      return {
        error: true as const,
        reason: "The 'html_code' property in the first object must be a string.",
      }
    }

    // Check that the first item has an 'html_code' key
    if (Array.isArray(components) && components.length >= 1) {
      if (!first || !('html_code' in first)) {
        return {
          error: true as const,
          reason: "The first object in the array must include an 'html_code' key.",
        }
      }
    }

    // No errors found
    return
  }

  /**
   * Ensures that the language configuration is valid and sets default values if necessary.
   * @param {PageBuilderConfig} config - The page builder configuration.
   * @private
   */
  private ensureLanguage(config: PageBuilderConfig): void {
    // Set default language config if missing, empty, or language missing/empty
    const defaultLang = 'en'
    const defaultEnable = [
      'en',
      'zh-Hans',
      'fr',
      'ja',
      'ru',
      'es',
      'pt',
      'de',
      'ar',
      'hi',
      'da',
    ] as const

    let needsDefault = false
    const userSettings = config.userSettings
    const language = userSettings && userSettings.language

    if (!userSettings || isEmptyObject(userSettings)) {
      needsDefault = true
    } else if (!language || isEmptyObject(language)) {
      needsDefault = true
    }

    if (needsDefault) {
      const updatedLanguage = {
        ...config,
        userSettings: {
          ...userSettings,
          language: {
            default: defaultLang,
            enable: defaultEnable as typeof defaultEnable,
          },
        },
      } as const
      this.pageBuilderStateStore.setPageBuilderConfig(updatedLanguage)
      return
    }

    // Ensure default is in enable array
    if (language && Array.isArray(language.enable) && language.default) {
      if (!language.enable.includes(language.default)) {
        const updatedEnable = [...language.enable, language.default]
        const updatedLanguage = {
          ...config,
          userSettings: {
            ...userSettings,
            language: {
              ...language,
              enable: updatedEnable,
            },
          },
        } as const
        this.pageBuilderStateStore.setPageBuilderConfig(updatedLanguage)
      }
    }
  }

  /**
   * Validates the entire page builder configuration.
   * @param {PageBuilderConfig} config - The page builder configuration.
   * @private
   */
  private validateConfig(config: PageBuilderConfig): void {
    const defaultConfigValues = {
      updateOrCreate: {
        formType: 'create',
        formName: 'post',
      },
    } as const

    // Set config for page builder if not set by user
    if (!config || (config && Object.keys(config).length === 0 && config.constructor === Object)) {
      this.pageBuilderStateStore.setPageBuilderConfig(defaultConfigValues)
    }

    if (config && Object.keys(config).length !== 0 && config.constructor === Object) {
      this.ensureUpdateOrCreateConfig(config)

      // Ensure resourceData.title is a non-empty string
      if (
        !config.resourceData ||
        typeof config.resourceData.title !== 'string' ||
        !config.resourceData.title.trim()
      ) {
        if (!config.resourceData || typeof config.resourceData !== 'object') {
          config.resourceData = { title: 'Default Post' }
        } else {
          config.resourceData.title = 'Default Post'
        }
      }
    }

    // Ensure autoSave is true if not provided (but do not override false)
    if (
      !config.userSettings ||
      typeof config.userSettings !== 'object' ||
      !('autoSave' in config.userSettings)
    ) {
      const updatedConfig = {
        ...config,
        userSettings: {
          ...(typeof config.userSettings === 'object' ? config.userSettings : {}),
          autoSave: config.userSettings?.autoSave === false ? false : true,
        },
      }

      this.pageBuilderStateStore.setPageBuilderConfig(updatedConfig)
    }

    this.ensureLanguage(config)
  }

  /**
   * Saves user settings to local storage.
   * @param {string} newLang - The new language to save.
   */
  public saveUserSettingsStorage(newLang: string) {
    localStorage.setItem(
      'userSettingsPageBuilder',
      JSON.stringify({ userSettings: { lang: newLang } }),
    )
  }

  /**
   * Initializes the Page Builder.
   * @param {PageBuilderConfig} config - The configuration object for the Page Builder.
   * @param {BuilderResourceData} [passedComponentsArray] - Optional array of components to load.
   * @returns {Promise<StartBuilderResult>} A result object indicating success or failure.
   */
  async startBuilder(
    config: PageBuilderConfig,
    passedComponentsArray?: BuilderResourceData,
  ): Promise<StartBuilderResult> {
    // Reactive flag signals to the UI that the builder has been successfully initialized
    // Prevents builder actions to prevent errors caused by missing DOM .
    this.pageBuilderStateStore.setBuilderStarted(true)
    const pagebuilder = document.querySelector('#pagebuilder')

    let validation
    try {
      this.originalComponents = passedComponentsArray
      this.pageBuilderStateStore.setPageBuilderConfig(config)
      // Validate and normalize the config (ensure required fields are present)
      this.validateConfig(config)

      validation = this.validateUserProvidedComponents(passedComponentsArray)

      // Update the localStorage key name based on the config/resource
      this.updateLocalStorageItemName()
      this.initializeHistory()

      if (passedComponentsArray) {
        this.savedMountComponents = passedComponentsArray
      }
      // Page Builder is not Present in the DOM but Components have been passed to the Builder
      if (!pagebuilder) {
        this.isPageBuilderMissingOnStart = true
      }
      if (passedComponentsArray && !pagebuilder) {
        this.pendingMountComponents = passedComponentsArray
      }
      // Page Builder is Present in the DOM & Components have been passed to the Builder
      if (pagebuilder) {
        this.completeBuilderInitialization(passedComponentsArray)
      }

      // result to end user
      const result: StartBuilderResult = {
        message: 'Page builder started successfully.',
      }

      if (validation) {
        result.validation = validation
      }

      // PassedComponentsArray
      if (Array.isArray(passedComponentsArray) && passedComponentsArray.length >= 0) {
        result.passedComponentsArray = passedComponentsArray
      }

      // Return messages, validation info if present etc.
      return result
    } catch (err) {
      console.error('Not able to start the Page Builder', err)
      return {
        error: true as const,
        reason: 'Failed to start the Page Builder due to an unexpected error.',
      }
    }
  }

  /**
   * Completes the builder initialization process once the DOM is ready.
   * @param {BuilderResourceData} [passedComponentsArray] - Optional array of components to load.
   * @returns {Promise<void>}
   */
  async completeBuilderInitialization(passedComponentsArray?: BuilderResourceData): Promise<void> {
    this.pageBuilderStateStore.setIsLoadingGlobal(true)
    await delay(400)

    // Always clear DOM and store before mounting new resource
    this.deleteAllComponentsFromDOM()

    const config = this.pageBuilderStateStore.getPageBuilderConfig
    const formType = config && config.updateOrCreate && config.updateOrCreate.formType

    const localStorageData = this.getSavedPageHtml()

    // Deselect any selected or hovered elements in the builder UI
    await this.clearHtmlSelection()

    if (formType === 'update' || formType === 'create') {
      // Page Builder is initially present in the DOM
      if (!this.pendingMountComponents) {
        if (!passedComponentsArray && this.isPageBuilderMissingOnStart && localStorageData) {
          await this.completeMountProcess(localStorageData)
          return
        }
        if (passedComponentsArray && !localStorageData) {
          const htmlString = this.renderComponentsToHtml(passedComponentsArray)
          await this.completeMountProcess(htmlString, true)
          this.saveDomComponentsToLocalStorage()
          return
        }

        if (passedComponentsArray && localStorageData) {
          const htmlString = this.renderComponentsToHtml(passedComponentsArray)
          await this.completeMountProcess(htmlString, true)
          await delay(500)
          this.pageBuilderStateStore.setHasLocalDraftForUpdate(true)
          return
        }

        if (!passedComponentsArray && localStorageData && !this.savedMountComponents) {
          await this.completeMountProcess(localStorageData)
          return
        }
        if (!passedComponentsArray && this.savedMountComponents && localStorageData) {
          const htmlString = this.renderComponentsToHtml(this.savedMountComponents)
          await this.completeMountProcess(htmlString)
          return
        }

        if (!passedComponentsArray && !localStorageData && this.isPageBuilderMissingOnStart) {
          const htmlString = this.renderComponentsToHtml([])
          await this.completeMountProcess(htmlString)

          return
        }

        if (!this.isPageBuilderMissingOnStart && !localStorageData && !passedComponentsArray) {
          const htmlString = this.renderComponentsToHtml([])
          await this.completeMountProcess(htmlString)
          return
        }
      }

      // Page Builder is not initially present in the DOM
      if (this.pendingMountComponents) {
        if (localStorageData && this.isPageBuilderMissingOnStart) {
          const htmlString = this.renderComponentsToHtml(this.pendingMountComponents)
          await this.completeMountProcess(htmlString, true)
          await delay(500)
          this.pageBuilderStateStore.setHasLocalDraftForUpdate(true)
          this.pendingMountComponents = null
          return
        }
        if (!localStorageData && passedComponentsArray && this.isPageBuilderMissingOnStart) {
          const htmlString = this.renderComponentsToHtml(this.pendingMountComponents)
          await this.completeMountProcess(htmlString, true)
          this.saveDomComponentsToLocalStorage()
          return
        }

        if (!passedComponentsArray && !localStorageData && this.isPageBuilderMissingOnStart) {
          const htmlString = this.renderComponentsToHtml(this.pendingMountComponents)
          await this.completeMountProcess(htmlString, true)
          this.saveDomComponentsToLocalStorage()
          return
        }
      }
    }
  }

  /**
   * Converts an array of ComponentObject into a single HTML string.
   *
   * @returns {string} A single HTML string containing all components.
   */
  private renderComponentsToHtml(componentsArray: BuilderResourceData): string {
    // If the componentsArray is empty or invalid, return a default HTML structure
    if (!componentsArray || (Array.isArray(componentsArray) && componentsArray.length === 0)) {
      return `<div id="pagebuilder" class="pbx-text-black pbx-font-sans"></div>`
    }

    const sectionsHtml = componentsArray
      .map((component) => {
        return component.html_code // Fallback in case section is not found
      })
      .join('\n')

    // Return the combined HTML string
    return sectionsHtml
  }

  /**
   * Completes the mounting process by loading components into the DOM and setting up listeners.
   * @param {string} html - The HTML string of components to mount.
   * @param {boolean} [useConfigPageSettings] - Whether to use page settings from the passed data.
   * @private
   */
  private async completeMountProcess(html: string, useConfigPageSettings?: boolean) {
    await this.mountComponentsToDOM(html, useConfigPageSettings)

    // Clean up any old localStorage items related to previous builder sessions
    this.deleteOldPageBuilderLocalStorage()
    this.pageBuilderStateStore.setIsRestoring(false)
    this.pageBuilderStateStore.setIsLoadingGlobal(false)
  }

  /**
   * Applies CSS class changes to the currently selected element.
   * @param {string | undefined} cssUserSelection - The user's CSS class selection.
   * @param {string[]} CSSArray - The array of possible CSS classes for this property.
   * @param {string} mutationName - The name of the store mutation to call.
   * @returns {string | undefined} The previously applied CSS class.
   * @private
   */
  private applyElementClassChanges(
    cssUserSelection: string | undefined,
    CSSArray: string[],
    mutationName: string,
  ): string | undefined {
    const currentHTMLElement = this.getElement.value

    if (!currentHTMLElement) return

    const currentCSS = CSSArray.find((CSS) => {
      return currentHTMLElement.classList.contains(CSS)
    })

    // set to 'none' if undefined
    let elementClass = currentCSS || 'none'

    // If cssUserSelection is undefined, just set the current state and return
    if (cssUserSelection === undefined) {
      if (typeof mutationName === 'string' && mutationName.length > 2) {
        // Use a type-safe approach to handle mutationName
        if (
          mutationName in this.pageBuilderStateStore &&
          typeof this.pageBuilderStateStore[
            mutationName as keyof typeof this.pageBuilderStateStore
          ] === 'function'
        ) {
          const mutationFunction = this.pageBuilderStateStore[
            mutationName as keyof typeof this.pageBuilderStateStore
          ] as (arg: string) => void
          mutationFunction(elementClass)
        }
      }
      return currentCSS
    }

    // cssUserSelection examples: bg-zinc-200, px-10, rounded-full etc.
    if (typeof cssUserSelection === 'string' && cssUserSelection !== 'none') {
      if (elementClass && currentHTMLElement.classList.contains(elementClass)) {
        currentHTMLElement.classList.remove(elementClass)
      }

      currentHTMLElement.classList.add(cssUserSelection)
      elementClass = cssUserSelection
    } else if (
      typeof cssUserSelection === 'string' &&
      cssUserSelection === 'none' &&
      elementClass
    ) {
      currentHTMLElement.classList.remove(elementClass)
      elementClass = cssUserSelection
    }

    // Only call store mutations after all DOM manipulation is complete
    if (typeof mutationName === 'string' && mutationName.length > 2) {
      // Use a type-safe approach to handle mutationName
      if (
        mutationName in this.pageBuilderStateStore &&
        typeof this.pageBuilderStateStore[
          mutationName as keyof typeof this.pageBuilderStateStore
        ] === 'function'
      ) {
        const mutationFunction = this.pageBuilderStateStore[
          mutationName as keyof typeof this.pageBuilderStateStore
        ] as (arg: string) => void
        mutationFunction(elementClass)
        this.pageBuilderStateStore.setElement(currentHTMLElement)
      }
    }

    return currentCSS
  }

  /**
   * Removes all CSS classes from the main page builder container.
   * @returns {Promise<void>}
   */
  public async clearClassesFromPage() {
    const pagebuilder = document.querySelector('#pagebuilder')
    if (!pagebuilder) return

    pagebuilder.removeAttribute('class')

    this.initializeElementStyles()
    await nextTick()
  }
  /**
   * Removes all inline styles from the main page builder container.
   * @returns {Promise<void>}
   */
  public async clearInlineStylesFromPage() {
    const pagebuilder = document.querySelector('#pagebuilder')
    if (!pagebuilder) return

    pagebuilder.removeAttribute('style')

    this.initializeElementStyles()
    await nextTick()
  }

  /**
   * Selects the main page builder container for global styling.
   * @returns {Promise<void>}
   */
  public async globalPageStyles() {
    const pagebuilder = document.querySelector('#pagebuilder')
    if (!pagebuilder) return

    // Deselect any selected or hovered elements in the builder UI
    await this.clearHtmlSelection()
    //
    // Set the element in the store
    this.pageBuilderStateStore.setElement(pagebuilder as HTMLElement)

    // Add the data attribute for styling
    pagebuilder.setAttribute('data-global-selected', 'true')

    await nextTick()
  }

  /**
   * Handles changes to the font weight of the selected element.
   * @param {string} [userSelectedFontWeight] - The selected font weight class.
   */
  public handleFontWeight(userSelectedFontWeight?: string): void {
    this.applyElementClassChanges(
      userSelectedFontWeight,
      tailwindFontStyles.fontWeight,
      'setFontWeight',
    )
  }

  /**
   * Handles changes to the base font size of the selected element.
   * @param {string} [userSelectedFontSize] - The selected font size class.
   */
  public handleFontSizeBase(userSelectedFontSize?: string): void {
    this.applyElementClassChanges(userSelectedFontSize, tailwindFontSizes.fontBase, 'setFontBase')
  }

  /**
   * Handles changes to the desktop font size of the selected element.
   * @param {string} [userSelectedFontSize] - The selected font size class for desktop.
   */
  public handleFontSizeDesktop(userSelectedFontSize?: string): void {
    const currentHTMLElement = this.getElement.value
    if (!currentHTMLElement) return

    // Hardcoded mapping: selected => base
    const fontSizeBaseMap: Record<string, string> = {
      'pbx-text-9xl': 'pbx-text-6xl',
      'pbx-text-8xl': 'pbx-text-5xl',
      'pbx-text-7xl': 'pbx-text-4xl',
      'pbx-text-6xl': 'pbx-text-3xl',
      'pbx-text-5xl': 'pbx-text-3xl',
      'pbx-text-4xl': 'pbx-text-2xl',
      'pbx-text-3xl': 'pbx-text-xl',
      'pbx-text-2xl': 'pbx-text-lg',
      'pbx-text-xl': 'pbx-text-base',
      'pbx-text-lg': 'pbx-text-sm',
      'pbx-text-base': 'pbx-text-xs',
      'pbx-text-sm': 'pbx-text-xs',
      'pbx-text-xs': 'pbx-text-xs',
    }

    if (userSelectedFontSize) {
      // Remove all existing font size classes first
      Array.from(currentHTMLElement.classList).forEach((cls) => {
        if (this.fontSizeRegex.test(cls)) {
          currentHTMLElement.classList.remove(cls)
        }
      })

      // Extract the font size class (remove 'lg:' if present)
      const fontSizeClass = userSelectedFontSize.replace(/^lg:/, '')

      const baseClass = fontSizeBaseMap[fontSizeClass] || fontSizeClass
      const lgClass = `lg:${fontSizeClass}`

      if (baseClass !== fontSizeClass) {
        currentHTMLElement.classList.add(baseClass, lgClass)
      } else {
        currentHTMLElement.classList.add(baseClass)
      }
    }

    const currentCSS = tailwindFontSizes.fontDesktop.find((CSS) => {
      return currentHTMLElement.classList.contains(CSS)
    })

    if (!userSelectedFontSize) {
      this.pageBuilderStateStore.setFontDesktop('none')
    }

    if (currentCSS && !userSelectedFontSize) {
      this.pageBuilderStateStore.setFontDesktop(currentCSS)
    }
  }

  /**
   * Applies helper CSS classes to elements, such as wrapping them or adding responsive text classes.
   * @param {HTMLElement} element - The element to process.
   * @private
   */
  private applyHelperCSSToElements(element: HTMLElement): void {
    this.wrapElementInDivIfExcluded(element)

    // If this is a DIV and its only/main child is a heading, apply font size classes to the DIV
    if (
      element.tagName === 'DIV' &&
      element.children.length === 1 &&
      ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.children[0].tagName)
    ) {
      const heading = element.children[0] as HTMLElement

      // Only add default font size classes if none exist
      const hasFontSizeClass = Array.from(element.classList).some((cls) =>
        this.fontSizeRegex.test(cls),
      )

      if (!hasFontSizeClass) {
        // Apply responsive font size classes based on heading type
        if (heading.tagName === 'H2') {
          element.classList.add('pbx-text-3xl', 'lg:pbx-text-4xl', 'pbx-font-medium')
        }
        if (heading.tagName === 'H3') {
          element.classList.add('pbx-text-2xl', 'lg:pbx-text-3xl', 'pbx-font-medium')
        }
        if (heading.tagName === 'H4') {
          element.classList.add('pbx-text-xl', 'lg:pbx-text-2xl', 'pbx-font-medium')
        }
        if (heading.tagName === 'H5') {
          element.classList.add('pbx-text-lg', 'lg:pbx-text-xl', 'pbx-font-medium')
        }
        if (heading.tagName === 'H6') {
          element.classList.add('pbx-text-base', 'lg:pbx-text-base', 'pbx-font-medium')
        }
      }
    }
  }

  /**
   * Toggles the visibility of the TipTap modal for rich text editing.
   * @param {boolean} status - Whether to show or hide the modal.
   * @returns {Promise<void>}
   */
  public async toggleTipTapModal(status: boolean): Promise<void> {
    this.pageBuilderStateStore.setShowModalTipTap(status)

    // Wait for Vue to finish DOM updates before attaching event listeners. This ensure elements exist in the DOM.
    await nextTick()
    // Attach event listeners to all editable elements in the Builder
    await this.addListenersToEditableElements()

    if (!status) {
      await this.handleAutoSave()
    }
  }

  /**
   * Wraps an element in a div if it's an excluded tag and adjacent to an image.
   * @param {HTMLElement} element - The element to potentially wrap.
   * @private
   */
  private wrapElementInDivIfExcluded(element: HTMLElement): void {
    if (!element) return

    if (
      this.NoneListernesTags.includes(element.tagName) &&
      ((element.previousElementSibling && element.previousElementSibling.tagName === 'IMG') ||
        (element.nextElementSibling && element.nextElementSibling.tagName === 'IMG'))
    ) {
      const divWrapper = document.createElement('div')
      element.parentNode?.insertBefore(divWrapper, element)
      divWrapper.appendChild(element)
    }
  }

  /**
   * Handles the mouseover event for editable elements, showing a hover state.
   * @param {Event} e - The mouse event.
   * @param {HTMLElement} element - The element being hovered over.
   * @private
   */
  private handleMouseOver = (e: Event, element: HTMLElement): void => {
    e.preventDefault()
    e.stopPropagation()

    const pagebuilder = document.querySelector('#pagebuilder')

    if (!pagebuilder) return

    const hoveredElement = pagebuilder.querySelector('[hovered]')
    if (hoveredElement) {
      hoveredElement.removeAttribute('hovered')
    }

    if (!element.hasAttribute('selected')) {
      element.setAttribute('hovered', '')
    }
  }

  /**
   * Handles the mouseleave event for editable elements, removing the hover state.
   * @param {Event} e - The mouse event.
   * @private
   */
  private handleMouseLeave = (e: Event): void => {
    e.preventDefault()
    e.stopPropagation()

    const pagebuilder = document.querySelector('#pagebuilder')
    if (!pagebuilder) return

    const hoveredElement = pagebuilder.querySelector('[hovered]')
    if (hoveredElement) {
      hoveredElement.removeAttribute('hovered')
    }
  }

  /**
   * Checks if an element is editable based on its tag name.
   * @param {Element | null} el - The element to check.
   * @returns {boolean} True if the element is editable, false otherwise.
   */
  public isEditableElement(el: Element | null): boolean {
    if (!el) return false
    return !this.NoneListernesTags.includes(el.tagName)
  }

  /**
   * Attaches click, mouseover, and mouseleave event listeners to all editable elements in the page builder.
   * @private
   */
  private addListenersToEditableElements = async () => {
    const pagebuilder = document.querySelector('#pagebuilder')
    if (!pagebuilder) return

    // Wait for the next DOM update cycle to ensure all elements are rendered.
    await nextTick()

    pagebuilder.querySelectorAll('section *').forEach((element) => {
      if (this.isEditableElement(element)) {
        const htmlElement = element as HTMLElement

        // If the element already has listeners, remove them to avoid duplicates.
        if (this.elementsWithListeners.has(htmlElement)) {
          const listeners = this.elementsWithListeners.get(htmlElement)
          if (listeners) {
            htmlElement.removeEventListener('click', listeners.click)
            htmlElement.removeEventListener('mouseover', listeners.mouseover)
            htmlElement.removeEventListener('mouseleave', listeners.mouseleave)
          }
        }

        // Define new listener functions.
        const clickListener = (e: Event) => this.handleElementClick(e, htmlElement)
        const mouseoverListener = (e: Event) => this.handleMouseOver(e, htmlElement)
        const mouseleaveListener = (e: Event) => this.handleMouseLeave(e)

        // Add the new event listeners.
        htmlElement.addEventListener('click', clickListener)
        htmlElement.addEventListener('mouseover', mouseoverListener)
        htmlElement.addEventListener('mouseleave', mouseleaveListener)

        // Store the new listeners in the WeakMap to track them.
        this.elementsWithListeners.set(htmlElement, {
          click: clickListener,
          mouseover: mouseoverListener,
          mouseleave: mouseleaveListener,
        })
      }
    })
  }

  /**
   * Handles the click event for editable elements, setting the element as selected.
   * @param {Event} e - The click event.
   * @param {HTMLElement} element - The clicked element.
   * @private
   */
  private handleElementClick = async (e: Event, element: HTMLElement): Promise<void> => {
    e.preventDefault()
    e.stopPropagation()

    const pagebuilder = document.querySelector('#pagebuilder')

    if (!pagebuilder) return

    this.pageBuilderStateStore.setMenuRight(true)

    const selectedElement = pagebuilder.querySelector('[selected]')
    if (selectedElement) {
      selectedElement.removeAttribute('selected')
    }

    element.removeAttribute('hovered')

    element.setAttribute('selected', '')

    this.pageBuilderStateStore.setElement(element)

    await this.handleAutoSave()
  }

  private getHistoryBaseKey(): string | null {
    return this.getLocalStorageItemName.value
  }

  private initializeHistory() {
    const baseKey = this.getHistoryBaseKey()
    if (baseKey) {
      const history = LocalStorageManager.getHistory(baseKey)
      this.pageBuilderStateStore.setHistoryIndex(history.length - 1)
      this.pageBuilderStateStore.setHistoryLength(history.length)
    }
  }

  /**
   * Triggers an auto-save of the current page builder content to local storage if enabled.
   */
  public handleAutoSave = async () => {
    this.startEditing()
    const passedConfig = this.pageBuilderStateStore.getPageBuilderConfig

    // Check if config is set
    if (passedConfig && passedConfig.userSettings) {
      //
      // Enabled auto save
      if (
        typeof passedConfig.userSettings.autoSave === 'boolean' &&
        passedConfig.userSettings.autoSave !== false
      ) {
        if (this.pageBuilderStateStore.getIsSaving) return

        try {
          this.pageBuilderStateStore.setIsSaving(true)
          // Deselect any selected or hovered elements in the builder UI
          //
          this.saveDomComponentsToLocalStorage()
          await delay(400)
        } catch (err) {
          console.error('Error trying auto save.', err)
        } finally {
          this.pageBuilderStateStore.setIsSaving(false)
        }
      }
    }
    if (passedConfig && !passedConfig.userSettings) {
      try {
        this.pageBuilderStateStore.setIsSaving(true)
        this.saveDomComponentsToLocalStorage()
        await delay(400)
      } catch (err) {
        console.error('Error trying saving.', err)
      } finally {
        this.pageBuilderStateStore.setIsSaving(false)
      }
    }
  }

  /**
   * Manually saves the current page builder content to local storage.
   */
  public handleManualSave = async (doNoClearHTML?: boolean) => {
    this.pageBuilderStateStore.setIsSaving(true)
    if (!doNoClearHTML) {
      this.clearHtmlSelection()
    }
    this.startEditing()
    this.saveDomComponentsToLocalStorage()
    await delay(300)
    this.pageBuilderStateStore.setIsSaving(false)
  }

  /**
   * Clones a component object and prepares it for insertion into the DOM by adding unique IDs and prefixes.
   * @param {ComponentObject} componentObject - The component object to clone.
   * @returns {ComponentObject} The cloned and prepared component object.
   */
  public cloneCompObjForDOMInsertion(componentObject: ComponentObject): ComponentObject {
    // Deep clone clone component
    const clonedComponent = { ...componentObject }

    const pageBuilderWrapper = document.querySelector('#page-builder-wrapper')
    //  scoll to top or bottom
    if (pageBuilderWrapper) {
      // push to top
      if (this.getComponentArrayAddMethod.value === 'unshift') {
        pageBuilderWrapper.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    }

    // Create a DOMParser instance
    const parser = new DOMParser()

    // Parse the HTML content of the clonedComponent using the DOMParser
    const doc = parser.parseFromString(clonedComponent.html_code || '', 'text/html')

    // Selects all elements within the HTML document, including elements like:
    const elements = doc.querySelectorAll('*')

    elements.forEach((element) => {
      this.applyHelperCSSToElements(element as HTMLElement)
    })

    // Add the component id to the section element
    const section = doc.querySelector('section')
    if (section) {
      // Prefix all classes inside the section
      section.querySelectorAll('[class]').forEach((el) => {
        el.setAttribute(
          'class',
          this.addTailwindPrefixToClasses(el.getAttribute('class') || '', 'pbx-'),
        )
      })

      // Generate a unique ID using uuidv4() and assign it to the section
      section.dataset.componentid = uuidv4()

      // Set the title attribute if present
      if (clonedComponent.title) {
        section.setAttribute('data-component-title', clonedComponent.title)
      }

      // Update the clonedComponent id with the newly generated unique ID
      clonedComponent.id = section.dataset.componentid

      // Update the HTML content of the clonedComponent with the modified HTML
      clonedComponent.html_code = section.outerHTML
    }

    // return to the cloned element to be dropped
    return clonedComponent
  }

  /**
   * Removes the 'hovered' and 'selected' attributes from all elements in the page builder.
   * @private
   */
  private async removeHoveredAndSelected() {
    const pagebuilder = document.querySelector('#pagebuilder')
    if (!pagebuilder) return

    const hoveredElement = pagebuilder.querySelector('[hovered]')
    if (hoveredElement) {
      hoveredElement.removeAttribute('hovered')
    }

    const selectedElement = pagebuilder.querySelector('[selected]')

    if (selectedElement) {
      selectedElement.removeAttribute('selected')
    }
  }

  /**
   * Syncs the CSS classes of the currently selected element to the state store.
   * @private
   */
  private async syncCurrentClasses() {
    // convert classList to array
    const classListArray = Array.from(this.getElement.value?.classList || [])

    // commit array to store
    this.pageBuilderStateStore.setCurrentClasses(classListArray)
  }

  /**
   * Syncs the inline styles of the currently selected element to the state store.
   * @private
   */
  private async syncCurrentStyles() {
    const style = this.getElement.value?.getAttribute('style')
    if (style) {
      const stylesObject = this.parseStyleString(style)
      this.pageBuilderStateStore.setCurrentStyles(stylesObject)
    } else {
      this.pageBuilderStateStore.setCurrentStyles({})
    }
  }

  /**
   * Adds a CSS class to the currently selected element.
   * @param {string} userSelectedClass - The class to add.
   */
  public handleAddClasses(userSelectedClass: string): void {
    if (
      typeof userSelectedClass === 'string' &&
      userSelectedClass.trim() !== '' &&
      !userSelectedClass.includes(' ') &&
      // Check if class (with prefix) already exists
      !this.getElement.value?.classList.contains('pbx-' + userSelectedClass.trim())
    ) {
      const cleanedClass = userSelectedClass.trim()

      // Add prefix if missing
      const prefixedClass = cleanedClass.startsWith('pbx-') ? cleanedClass : 'pbx-' + cleanedClass

      this.getElement.value?.classList.add(prefixedClass)

      this.pageBuilderStateStore.setElement(this.getElement.value)
      this.pageBuilderStateStore.setClass(prefixedClass)
    }
  }

  /**
   * Adds or updates an inline style property on the currently selected element.
   * @param {string} property - The CSS property to add/update.
   * @param {string} value - The value of the CSS property.
   */
  public handleAddStyle(property: string, value: string): void {
    const element = this.getElement.value
    if (!element || !property || !value) return

    element.style.setProperty(property, value)
    this.pageBuilderStateStore.setElement(element)
  }

  /**
   * Removes an inline style property from the currently selected element.
   * @param {string} property - The CSS property to remove.
   */
  public handleRemoveStyle(property: string): void {
    const element = this.getElement.value
    if (!element || !property) return

    element.style.removeProperty(property)
    this.pageBuilderStateStore.setElement(element)
  }

  /**
   * Handles changes to the font family of the selected element.
   * @param {string} [userSelectedFontFamily] - The selected font family class.
   */
  public handleFontFamily(userSelectedFontFamily?: string): void {
    this.applyElementClassChanges(
      userSelectedFontFamily,
      tailwindFontStyles.fontFamily,
      'setFontFamily',
    )
  }
  /**
   * Handles changes to the font style of the selected element.
   * @param {string} [userSelectedFontStyle] - The selected font style class.
   */
  public handleFontStyle(userSelectedFontStyle?: string): void {
    this.applyElementClassChanges(
      userSelectedFontStyle,
      tailwindFontStyles.fontStyle,
      'setFontStyle',
    )
  }
  /**
   * Handles changes to the vertical padding of the selected element.
   * @param {string} [userSelectedVerticalPadding] - The selected vertical padding class.
   */
  public handleVerticalPadding(userSelectedVerticalPadding?: string): void {
    this.applyElementClassChanges(
      userSelectedVerticalPadding,
      tailwindPaddingAndMargin.verticalPadding,
      'setFontVerticalPadding',
    )
  }
  /**
   * Handles changes to the horizontal padding of the selected element.
   * @param {string} [userSelectedHorizontalPadding] - The selected horizontal padding class.
   */
  public handleHorizontalPadding(userSelectedHorizontalPadding?: string): void {
    this.applyElementClassChanges(
      userSelectedHorizontalPadding,
      tailwindPaddingAndMargin.horizontalPadding,
      'setFontHorizontalPadding',
    )
  }

  /**
   * Handles changes to the vertical margin of the selected element.
   * @param {string} [userSelectedVerticalMargin] - The selected vertical margin class.
   */
  public handleVerticalMargin(userSelectedVerticalMargin?: string): void {
    this.applyElementClassChanges(
      userSelectedVerticalMargin,
      tailwindPaddingAndMargin.verticalMargin,
      'setFontVerticalMargin',
    )
  }
  /**
   * Handles changes to the horizontal margin of the selected element.
   * @param {string} [userSelectedHorizontalMargin] - The selected horizontal margin class.
   */
  public handleHorizontalMargin(userSelectedHorizontalMargin?: string): void {
    this.applyElementClassChanges(
      userSelectedHorizontalMargin,
      tailwindPaddingAndMargin.horizontalMargin,
      'setFontHorizontalMargin',
    )
  }

  /**
   * Handles changes to the border style of the selected element.
   * @param {string} [borderStyle] - The selected border style class.
   */
  public handleBorderStyle(borderStyle?: string): void {
    this.applyElementClassChanges(
      borderStyle,
      tailwindBorderStyleWidthPlusColor.borderStyle,
      'setBorderStyle',
    )
  }
  /**
   * Handles changes to the border width of the selected element.
   * @param {string} [borderWidth] - The selected border width class.
   */
  public handleBorderWidth(borderWidth?: string): void {
    this.applyElementClassChanges(
      borderWidth,
      tailwindBorderStyleWidthPlusColor.borderWidth,
      'setBorderWidth',
    )
  }
  /**
   * Handles changes to the border color of the selected element.
   * @param {string} [borderColor] - The selected border color class.
   */
  public handleBorderColor(borderColor?: string): void {
    this.applyElementClassChanges(
      borderColor,
      tailwindBorderStyleWidthPlusColor.borderColor,
      'setBorderColor',
    )
  }
  // border color, style & width / end

  /**
   * Handles changes to the background color of the selected element.
   * @param {string} [color] - The selected background color class.
   */
  public handleBackgroundColor(color?: string): void {
    this.applyElementClassChanges(
      color,
      tailwindColors.backgroundColorVariables,
      'setBackgroundColor',
    )
  }

  /**
   * Handles changes to the text color of the selected element.
   * @param {string} [color] - The selected text color class.
   */
  public handleTextColor(color?: string): void {
    this.applyElementClassChanges(color, tailwindColors.textColorVariables, 'setTextColor')
  }

  /**
   * Handles changes to the global border radius of the selected element.
   * @param {string} [borderRadiusGlobal] - The selected global border radius class.
   */
  handleBorderRadiusGlobal(borderRadiusGlobal?: string): void {
    this.applyElementClassChanges(
      borderRadiusGlobal,
      tailwindBorderRadius.roundedGlobal,
      'setBorderRadiusGlobal',
    )
  }
  /**
   * Handles changes to the top-left border radius of the selected element.
   * @param {string} [borderRadiusTopLeft] - The selected top-left border radius class.
   */
  handleBorderRadiusTopLeft(borderRadiusTopLeft?: string): void {
    this.applyElementClassChanges(
      borderRadiusTopLeft,
      tailwindBorderRadius.roundedTopLeft,
      'setBorderRadiusTopLeft',
    )
  }
  /**
   * Handles changes to the top-right border radius of the selected element.
   * @param {string} [borderRadiusTopRight] - The selected top-right border radius class.
   */
  handleBorderRadiusTopRight(borderRadiusTopRight?: string): void {
    this.applyElementClassChanges(
      borderRadiusTopRight,
      tailwindBorderRadius.roundedTopRight,
      'setBorderRadiusTopRight',
    )
  }
  /**
   * Handles changes to the bottom-left border radius of the selected element.
   * @param {string} [borderRadiusBottomleft] - The selected bottom-left border radius class.
   */
  handleBorderRadiusBottomleft(borderRadiusBottomleft?: string): void {
    this.applyElementClassChanges(
      borderRadiusBottomleft,
      tailwindBorderRadius.roundedBottomLeft,
      'setBorderRadiusBottomleft',
    )
  }
  /**
   * Handles changes to the bottom-right border radius of the selected element.
   * @param {string} [borderRadiusBottomRight] - The selected bottom-right border radius class.
   */
  handleBorderRadiusBottomRight(borderRadiusBottomRight?: string): void {
    this.applyElementClassChanges(
      borderRadiusBottomRight,
      tailwindBorderRadius.roundedBottomRight,
      'setBorderRadiusBottomRight',
    )
  }
  // border radius / end

  /**
   * Handles changes to the tablet font size of the selected element.
   * @param {string} [userSelectedFontSize] - The selected font size class for tablet.
   */
  handleFontSizeTablet(userSelectedFontSize?: string): void {
    this.applyElementClassChanges(
      userSelectedFontSize,
      tailwindFontSizes.fontTablet,
      'setFontTablet',
    )
  }
  /**
   * Handles changes to the mobile font size of the selected element.
   * @param {string} [userSelectedFontSize] - The selected font size class for mobile.
   */
  handleFontSizeMobile(userSelectedFontSize?: string): void {
    this.applyElementClassChanges(
      userSelectedFontSize,
      tailwindFontSizes.fontMobile,
      'setFontMobile',
    )
  }

  /**
   * Handles changes to the background opacity of the selected element.
   * @param {string} [opacity] - The selected background opacity class.
   */
  handleBackgroundOpacity(opacity?: string): void {
    this.applyElementClassChanges(
      opacity,
      tailwindOpacities.backgroundOpacities,
      'setBackgroundOpacity',
    )
  }
  /**
   * Handles changes to the opacity of the selected element.
   * @param {string} [opacity] - The selected opacity class.
   */
  handleOpacity(opacity?: string): void {
    this.applyElementClassChanges(opacity, tailwindOpacities.opacities, 'setOpacity')
  }

  /**
   * Removes all components from both the builder state and the DOM.
   * @private
   */
  private deleteAllComponentsFromDOM() {
    // Clear the store
    this.pageBuilderStateStore.setComponents([])

    // Also clear the DOM
    const pagebuilder = document.querySelector('#pagebuilder')
    if (pagebuilder) {
      // Remove all section elements (assuming each component is a <section>)
      pagebuilder
        .querySelectorAll('section[data-componentid]')
        .forEach((section) => section.remove())
    }
  }

  public async undo() {
    this.pageBuilderStateStore.setIsLoadingGlobal(true)
    await delay(300)
    const baseKey = this.getHistoryBaseKey()
    if (!baseKey) return

    const history = LocalStorageManager.getHistory(baseKey)
    if (history.length > 1 && this.pageBuilderStateStore.getHistoryIndex > 0) {
      this.pageBuilderStateStore.setHistoryIndex(this.pageBuilderStateStore.getHistoryIndex - 1)
      const data = history[this.pageBuilderStateStore.getHistoryIndex]
      const htmlString = this.renderComponentsToHtml(data.components)
      await this.mountComponentsToDOM(htmlString, false, data.pageSettings)
    }
    this.pageBuilderStateStore.setIsLoadingGlobal(false)
  }

  public async redo() {
    this.pageBuilderStateStore.setIsLoadingGlobal(true)
    await delay(300)
    const baseKey = this.getHistoryBaseKey()
    if (!baseKey) return

    const history = LocalStorageManager.getHistory(baseKey)
    if (history.length > 0 && this.pageBuilderStateStore.getHistoryIndex < history.length - 1) {
      this.pageBuilderStateStore.setHistoryIndex(this.pageBuilderStateStore.getHistoryIndex + 1)
      const data = history[this.pageBuilderStateStore.getHistoryIndex]
      const htmlString = this.renderComponentsToHtml(data.components)
      await this.mountComponentsToDOM(htmlString, false, data.pageSettings)
    }
    this.pageBuilderStateStore.setIsLoadingGlobal(false)
  }

  private hasVisibleContent(element: HTMLElement): boolean {
    if (!element) return false

    // Check for meaningful elements
    const meaningfulContentSelector =
      'img, video, iframe, input, button, a, h1, h2, h3, h4, h5, h6, p, li, blockquote, pre, code, table'
    if (element.querySelector(meaningfulContentSelector)) return true

    // Check for non-empty text nodes
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null)
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue && walker.currentNode.nodeValue.trim() !== '') {
        return true
      }
    }

    return false
  }

  private isSectionEmpty(section: HTMLElement): boolean {
    return !this.hasVisibleContent(section)
  }

  /**
   * Duplicate the currently selected component from the DOM and the state.
   * @returns {Promise<void>}
   */
  public async duplicateComponent() {
    // Sync latest DOM changes to the store
    this.syncDomToStoreOnly()
    await nextTick()

    const components = this.pageBuilderStateStore.getComponents
    const selectedComponent = this.getComponent.value

    if (!components || !selectedComponent) return

    // Find the index of the selected component
    const index = components.findIndex(
      (component: ComponentObject) => component.id === selectedComponent.id,
    )
    if (index === -1) return

    // Clone the component and generate a new id
    const clonedComponent = this.cloneCompObjForDOMInsertion(components[index])

    // Insert the cloned component right after the selected one
    const newComponents = [
      ...components.slice(0, index + 1),
      clonedComponent,
      ...components.slice(index + 1),
    ]

    this.pageBuilderStateStore.setComponents(newComponents)

    // Wait for DOM update and re-attach listeners
    await nextTick()
    await this.addListenersToEditableElements()

    // Optionally, select the new duplicated component
    this.pageBuilderStateStore.setComponent(clonedComponent)
    this.pageBuilderStateStore.setElement(null)

    // Auto-save after duplication
    await this.handleAutoSave()
  }
  /**
   * Deletes the currently selected component from the DOM and the state.
   * @returns {Promise<void>}
   */
  public async deleteComponentFromDOM() {
    this.syncDomToStoreOnly()
    await nextTick()

    const components = this.pageBuilderStateStore.getComponents

    if (!components) return

    // Find the index of the component to be deleted.
    const indexToDelete = components.findIndex((component: ComponentObject) =>
      this.getComponent.value ? component.id === this.getComponent.value.id : false,
    )

    if (indexToDelete === -1) {
      // If the component is not found, do nothing.
      return
    }

    // Create a new array excluding the component to be deleted.
    const newComponents = [
      ...components.slice(0, indexToDelete),
      ...components.slice(indexToDelete + 1),
    ]

    this.pageBuilderStateStore.setComponents(newComponents)

    // Wait for the DOM to update before re-attaching event listeners.
    await nextTick()
    await this.addListenersToEditableElements()

    this.pageBuilderStateStore.setComponent(null)
    this.pageBuilderStateStore.setElement(null)

    // Trigger an auto-save after deletion.
    await this.handleAutoSave()
  }

  /**
   * Deletes the currently selected element from the DOM and stores it for potential restoration.
   * @returns {Promise<void>}
   */
  public async deleteElementFromDOM() {
    const element = this.getElement.value
    if (!element) return

    // Remove the 'selected' attribute before deletion to avoid visual artifacts.
    element.removeAttribute('selected')

    if (!element.parentNode) {
      this.pageBuilderStateStore.setComponent(null)
      this.pageBuilderStateStore.setElement(null)
      return
    }

    const parentSection = element.closest('section')

    // If the element to be deleted is the section itself
    if (element.tagName === 'SECTION') {
      await this.deleteComponentFromDOM()
    } else {
      // If the element is inside a section
      element.remove()
      // --- Sync DOM to store after DOM mutation ---
      this.syncDomToStoreOnly()

      if (parentSection && this.isSectionEmpty(parentSection)) {
        const componentId = parentSection.getAttribute('data-componentid')
        if (componentId) {
          const components = this.pageBuilderStateStore.getComponents
          if (components) {
            const indexToDelete = components.findIndex((c: ComponentObject) => c.id === componentId)
            if (indexToDelete !== -1) {
              const newComponents = [
                ...components.slice(0, indexToDelete),
                ...components.slice(indexToDelete + 1),
              ]
              this.pageBuilderStateStore.setComponents(newComponents)
              parentSection.remove() // Directly remove from DOM
              // --- Sync DOM to store again after removing section ---
              this.syncDomToStoreOnly()
              // Save after removing the section
              this.saveDomComponentsToLocalStorage()
            }
          }
        }
      } else if (parentSection) {
        // If the section is not empty, update its HTML content in the store
        const componentId = parentSection.getAttribute('data-componentid')
        if (componentId) {
          const components = this.pageBuilderStateStore.getComponents
          if (components) {
            const componentIndex = components.findIndex(
              (c: ComponentObject) => c.id === componentId,
            )
            if (componentIndex !== -1) {
              const updatedComponent = {
                ...components[componentIndex],
                html_code: parentSection.outerHTML,
              }
              const newComponents = [
                ...components.slice(0, componentIndex),
                updatedComponent,
                ...components.slice(componentIndex + 1),
              ]
              this.pageBuilderStateStore.setComponents(newComponents)
              // --- Sync DOM to store after updating section ---
              this.syncDomToStoreOnly()
              // Save after updating the section
              this.saveDomComponentsToLocalStorage()
            }
          }
        }
      } else {
        // If no parentSection, still sync and save
        this.syncDomToStoreOnly()
        this.saveDomComponentsToLocalStorage()
      }
    }

    // Clear the selection state.
    this.pageBuilderStateStore.setComponent(null)
    this.pageBuilderStateStore.setElement(null)

    // Deselect any selected or hovered elements in the builder UI.
    await this.clearHtmlSelection()
    // Wait for the DOM to update before re-attaching event listeners.
    await nextTick()
    // Re-attach event listeners to all editable elements.
    await this.addListenersToEditableElements()
  }

  /**
   * Removes a CSS class from the currently selected element.
   * @param {string} userSelectedClass - The class to remove.
   */
  public handleRemoveClasses(userSelectedClass: string): void {
    // remove selected class from element
    if (this.getElement.value?.classList.contains(userSelectedClass)) {
      this.getElement.value?.classList.remove(userSelectedClass)

      this.pageBuilderStateStore.setElement(this.getElement.value)
      this.pageBuilderStateStore.removeClass(userSelectedClass)
    }
  }

  /**
   * Reorders the currently selected component up or down in the component list.
   * @param {number} direction - The direction to move the component (-1 for up, 1 for down).
   */
  public async reorderComponent(direction: number): Promise<void> {
    if (!this.getComponents.value || !this.getComponent.value) return

    if (this.getComponents.value.length <= 1) return

    // Find the component to move.
    const componentToMove = this.getComponent.value

    // Determine the current index of the component.
    const currentIndex = this.getComponents.value.findIndex(
      (component) => component.id === componentToMove.id,
    )

    if (currentIndex === -1) {
      // Component not found in the array.
      return
    }

    const newIndex = currentIndex + direction

    // Ensure the new index is within the bounds of the array.
    if (newIndex < 0 || newIndex >= this.getComponents.value.length) {
      return
    }

    // Move the component to the new position in the array.
    this.getComponents.value.splice(currentIndex, 1)
    this.getComponents.value.splice(newIndex, 0, componentToMove)

    // Wait for the DOM to update after reordering
    await nextTick()

    // Scroll to the moved component
    const pageBuilderWrapper = document.querySelector('#page-builder-wrapper') as HTMLElement | null
    const movedComponentElement = pageBuilderWrapper?.querySelector(
      `section[data-componentid="${componentToMove.id}"]`,
    ) as HTMLElement

    if (movedComponentElement) {
      // Apply highlight to the moved element
      movedComponentElement.classList.add('pbx-reorder-highlight')

      // Highlight its new neighbors (if they exist)
      const prevSibling = movedComponentElement.previousElementSibling as HTMLElement
      const nextSibling = movedComponentElement.nextElementSibling as HTMLElement

      if (prevSibling && prevSibling.tagName === 'SECTION') {
        prevSibling.classList.add('pbx-sibling-highlight')
      }
      if (nextSibling && nextSibling.tagName === 'SECTION') {
        nextSibling.classList.add('pbx-sibling-highlight')
      }

      if (pageBuilderWrapper) {
        // Scroll to the moved component
        const topPos = movedComponentElement.offsetTop - pageBuilderWrapper.offsetTop
        pageBuilderWrapper.scrollTop = topPos - pageBuilderWrapper.clientHeight / 2

        // Remove highlights after a delay
        setTimeout(() => {
          movedComponentElement.classList.remove('pbx-reorder-highlight')
          if (prevSibling && prevSibling.tagName === 'SECTION') {
            prevSibling.classList.remove('pbx-sibling-highlight')
          }
          if (nextSibling && nextSibling.tagName === 'SECTION') {
            nextSibling.classList.remove('pbx-sibling-highlight')
          }
        }, 200)
      }
    }
  }

  /**
   * Checks if the currently selected component can be moved up.
   * @returns {boolean} True if the component can be moved up, false otherwise.
   */
  public canMoveUp(): boolean {
    if (!this.getComponents.value || !this.getComponent.value) return false
    const currentIndex = this.getComponents.value.findIndex(
      (component) => component.id === this.getComponent.value?.id,
    )
    return currentIndex > 0
  }

  /**
   * Checks if the currently selected component can be moved down.
   * @returns {boolean} True if the component can be moved down, false otherwise.
   */
  public canMoveDown(): boolean {
    if (!this.getComponents.value || !this.getComponent.value) return false
    const currentIndex = this.getComponents.value.findIndex(
      (component) => component.id === this.getComponent.value?.id,
    )
    return currentIndex < this.getComponents.value.length - 1
  }

  /**
   * Ensures that a text area element has content, adding a visual indicator if it's empty.
   */
  public ensureTextAreaHasContent = () => {
    if (!this.getElement.value) return

    // text content
    if (typeof this.getElement.value.innerHTML !== 'string') {
      return
    }
    const element = this.getElement.value
    const elementTag = element.tagName

    if (
      ['DIV'].includes(elementTag) &&
      element.tagName.toLowerCase() !== 'img' &&
      element.textContent &&
      Number(element.textContent.length) === 0
    ) {
      element.classList.add('h-6')
      element.classList.add('bg-red-50')
    } else {
      element.classList.remove('h-6')
      element.classList.remove('bg-red-50')
    }
  }

  /**
   * Handles text input for an element, updating its content.
   * @param {string} textContentVueModel - The new text content from the Vue model.
   * @returns {Promise<void>}
   */
  public handleTextInput = async (textContentVueModel: string): Promise<void> => {
    if (typeof this.getElement.value?.innerHTML !== 'string') {
      return
    }

    if (typeof this.getElement.value.innerHTML === 'string') {
      await nextTick()

      // Update text content
      this.getElement.value.textContent = textContentVueModel

      this.pageBuilderStateStore.setTextAreaVueModel(this.getElement.value.innerHTML)

      this.getElement.value.innerHTML = textContentVueModel
    }

    this.ensureTextAreaHasContent()
  }

  /**
   * Checks if the selected element or its first child is an iframe.
   * @returns {boolean} True if it is an iframe, false otherwise.
   */
  public ElOrFirstChildIsIframe() {
    if (
      this.getElement.value?.tagName === 'IFRAME' ||
      this.getElement.value?.firstElementChild?.tagName === 'IFRAME'
    ) {
      return true
    } else {
      return false
    }
  }
  /**
   * Checks if the selected element is a valid text container (i.e., does not contain images or divs).
   * @returns {boolean | undefined} True if it's a valid text element, otherwise undefined.
   */
  public isSelectedElementValidText() {
    let reachedElseStatement = false

    // Get all child elements of the parentDiv
    const childElements = this.getElement.value?.children
    if (
      this.getElement.value?.tagName === 'IMG' ||
      this.getElement.value?.firstElementChild?.tagName === 'IFRAME'
    ) {
      return
    }
    if (!childElements) {
      return
    }

    Array.from(childElements).forEach((element) => {
      if (element?.tagName === 'IMG' || element?.tagName === 'DIV') {
        reachedElseStatement = false
      } else {
        reachedElseStatement = true
      }
    })

    return reachedElseStatement
  }

  /**
   * Generates a preview of the current page design.
   */
  public previewCurrentDesign() {
    this.pageBuilderStateStore.setElement(null)

    const pagebuilder = document.querySelector('#pagebuilder')
    if (!pagebuilder) return

    if (pagebuilder) {
      // Get cleaned HTML from entire builder
      const cleanedHTML = extractCleanHTMLFromPageBuilder(
        pagebuilder as HTMLElement,
        this.pageBuilderStateStore.getPageBuilderConfig
          ? this.pageBuilderStateStore.getPageBuilderConfig
          : undefined,
      )

      // Store as array with one string (as your preview expects an array)
      const previewData = JSON.stringify([cleanedHTML])

      this.pageBuilderStateStore.setCurrentLayoutPreview(previewData)
    }
  }
  /**
   * Sanitizes a string to be used as a key in local storage.
   * @param {string} input - The string to sanitize.
   * @returns {string} The sanitized string.
   */
  public sanitizeForLocalStorage(input: string): string {
    return input
      .trim() // Remove leading/trailing spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '-') // Replace one or more spaces with single hyphen
      .replace(/[^a-z0-9-]/g, '') // Remove all non-alphanumeric characters except hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  /**
   * Clones an element and removes selection-related attributes from the clone.
   * @param {HTMLElement} element - The element to clone.
   * @returns {HTMLElement} The sanitized clone.
   * @private
   */
  private cloneAndRemoveSelectionAttributes(element: HTMLElement): HTMLElement {
    // Deep clone the element
    const clone = element.cloneNode(true) as HTMLElement

    // Remove [hovered] and [selected] from the clone and all descendants
    clone.querySelectorAll('[hovered]').forEach((el) => el.removeAttribute('hovered'))
    clone.querySelectorAll('[selected]').forEach((el) => el.removeAttribute('selected'))
    // Also remove from the root element itself if present
    clone.removeAttribute('hovered')
    clone.removeAttribute('selected')

    return clone
  }

  /**
   * Syncs the current DOM state of components to the in-memory store.
   * @private
   */
  public syncDomToStoreOnly() {
    const pagebuilder = document.querySelector('#pagebuilder')
    if (!pagebuilder) return

    const componentsToSave: { html_code: string; id: string | null; title: string }[] = []

    pagebuilder.querySelectorAll('section[data-componentid]').forEach((section) => {
      const sanitizedSection = this.cloneAndRemoveSelectionAttributes(section as HTMLElement)
      componentsToSave.push({
        html_code: sanitizedSection.outerHTML,
        id: sanitizedSection.getAttribute('data-componentid'),
        title: sanitizedSection.getAttribute('data-component-title') || 'Untitled Component',
      })
    })

    this.pageBuilderStateStore.setComponents(componentsToSave)
  }

  public async generateHtmlFromComponents(): Promise<string> {
    this.syncDomToStoreOnly()
    await nextTick()

    const components = this.pageBuilderStateStore.getComponents

    if (!Array.isArray(components)) {
      return ''
    }

    // Wait for Vue to finish DOM updates before attaching event listeners. This ensure elements exist in the DOM.
    await nextTick()
    // Attach event listeners to all editable elements in the Builder
    await this.addListenersToEditableElements()

    return components
      .map((comp) => {
        return comp.html_code
          .replace(/data-componentid="[^"]*"/g, '') // remove data-componentid
          .replace(/\s{2,}/g, ' ') // optional: clean up excess spaces
      })
      .join('\n')
  }

  /**
   * Saves the current DOM state of components to local storage.
   * @private
   */
  private saveDomComponentsToLocalStorage() {
    this.updateLocalStorageItemName()
    const pagebuilder = document.querySelector('#pagebuilder')
    if (!pagebuilder) return

    const hoveredElement = pagebuilder.querySelector('[hovered]')
    if (hoveredElement) {
      hoveredElement.removeAttribute('hovered')
    }

    const componentsToSave: { html_code: string; title: string }[] = []

    pagebuilder.querySelectorAll('section[data-componentid]').forEach((section) => {
      const sanitizedSection = this.cloneAndRemoveSelectionAttributes(section as HTMLElement)

      // Remove the data-componentid attribute
      sanitizedSection.removeAttribute('data-componentid')

      componentsToSave.push({
        html_code: sanitizedSection.outerHTML,
        title: sanitizedSection.getAttribute('data-component-title') || 'Untitled Component',
      })
    })

    const pageSettings = {
      classes: pagebuilder.className || '',
      style: pagebuilder.getAttribute('style') || (pagebuilder as HTMLElement).style.cssText || '',
    }

    const dataToSave = {
      components: componentsToSave,
      pageBuilderContentSavedAt: new Date().toISOString(),
      pageSettings,
    }

    const baseKey = this.getHistoryBaseKey()

    if (baseKey) {
      const currentDataRaw = localStorage.getItem(baseKey)

      if (!currentDataRaw) {
        localStorage.setItem(baseKey, JSON.stringify(dataToSave))
      }
      if (currentDataRaw) {
        const currentData = JSON.parse(currentDataRaw)

        // Compare components
        const currentComponents = currentData.components || []
        const newComponents = dataToSave.components || []

        const hasChanges =
          newComponents.length !== currentComponents.length ||
          newComponents.some((newComponent, index) => {
            const currentComponent = currentComponents[index]
            return (
              // New component added
              !currentComponent ||
              // Component HTML changed
              currentComponent.html_code !== newComponent.html_code
            )
          })

        // Compare pageSettings
        const hasPageSettingsChanges =
          (currentData.pageSettings &&
            currentData.pageSettings.classes !== dataToSave.pageSettings.classes) ||
          (currentData.pageSettings &&
            currentData.pageSettings.style !== dataToSave.pageSettings.style)

        // Only save to local storage if there's a difference between the existing saved data and the current DOM data
        if (hasChanges || hasPageSettingsChanges) {
          localStorage.setItem(baseKey, JSON.stringify(dataToSave))
          let history = LocalStorageManager.getHistory(baseKey)

          const lastState = history[history.length - 1]
          if (lastState) {
            const lastComponents = JSON.stringify(lastState.components)
            const newComponents = JSON.stringify(dataToSave.components)
            const lastSettings = JSON.stringify(lastState.pageSettings)
            const newSettings = JSON.stringify(dataToSave.pageSettings)
            if (lastComponents === newComponents && lastSettings === newSettings) {
              return // Do not save duplicate state
            }
          }

          if (this.pageBuilderStateStore.getHistoryIndex < history.length - 1) {
            history = history.slice(0, this.pageBuilderStateStore.getHistoryIndex + 1)
          }
          history.push(dataToSave)
          if (history.length > 10) {
            history = history.slice(history.length - 10)
          }
          localStorage.setItem(baseKey + '-history', JSON.stringify(history))
          this.pageBuilderStateStore.setHistoryIndex(history.length - 1)
          this.pageBuilderStateStore.setHistoryLength(history.length)
          return
        }
      }
    }
  }
  /**
   * Removes the current page's components from local storage.
   * @private
   */
  private async removeCurrentComponentsFromLocalStorage() {
    this.updateLocalStorageItemName()
    await nextTick()

    const key = this.getLocalStorageItemName.value
    if (key) {
      localStorage.removeItem(key)
    }
  }

  /**
   * Handles the form submission process, clearing local storage and the DOM.
   * @returns {Promise<void>}
   */
  public async handleFormSubmission() {
    await this.removeCurrentComponentsFromLocalStorage()
    this.deleteAllComponentsFromDOM()
    this.pageBuilderStateStore.setComponents([])
  }

  /**
   * Parses a CSS style string into a key-value object.
   * @param {string} style - The style string to parse.
   * @returns {Record<string, string>} The parsed style object.
   * @private
   */
  private parseStyleString(style: string): Record<string, string> {
    return style
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .reduce(
        (acc, rule) => {
          const [key, value] = rule.split(':').map((str) => str.trim())
          if (key && value) acc[key] = value
          return acc
        },
        {} as Record<string, string>,
      )
  }

  /**
   * Deletes old page builder data from local storage (older than 2 weeks).
   */
  deleteOldPageBuilderLocalStorage(): void {
    const config = this.pageBuilderStateStore.getPageBuilderConfig
    const formType = config && config.updateOrCreate && config.updateOrCreate.formType

    if (formType === 'update') {
      let oldCountLocalStorages = 0
      const deletedItemsLog: { Number: number; Key: string; SavedAt: string }[] = []

      // const pastTime = new Date(Date.now() - 1 * 60 * 1000) // 1 minute
      const pastTime = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 2 weeks

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)

        if (!key) continue
        if (!key.startsWith('page-builder-update-resource-')) continue

        try {
          const storeComponents = localStorage.getItem(key)
          if (!storeComponents) continue

          const storeComponentsParsed = JSON.parse(storeComponents)
          const savedAt = storeComponentsParsed.pageBuilderContentSavedAt
          if (savedAt) {
            const savedAtDate = new Date(savedAt)

            if (savedAtDate < pastTime) {
              oldCountLocalStorages++
              deletedItemsLog.push({
                Number: oldCountLocalStorages,
                Key: key,
                SavedAt: savedAt,
              })

              // Delete old items
              localStorage.removeItem(key)
            }
          }
        } catch {
          // Ignore parse errors for unrelated keys
        }
      }

      if (deletedItemsLog.length > 0) {
        console.info(
          `Deleted ${deletedItemsLog.length} localStorage item(s) older than ${pastTime} days:`,
        )
        console.table(deletedItemsLog)
      }
    }
  }

  /**
   * Sets a flag to indicate that the user has started editing.
   */
  public startEditing() {
    this.hasStartedEditing = true
  }

  /**
   * Resumes editing from a draft saved in local storage.
   * @returns {Promise<void>}
   */
  public async resumeEditingFromDraft() {
    this.updateLocalStorageItemName()

    const localStorageData = this.getSavedPageHtml()

    if (localStorageData) {
      await delay(400)
      this.pageBuilderStateStore.setIsLoadingResumeEditing(true)
      await this.mountComponentsToDOM(localStorageData)
      this.pageBuilderStateStore.setIsLoadingResumeEditing(false)
    }

    // Wait for Vue to finish DOM updates before attaching event listeners. This ensure elements exist in the DOM.
    await nextTick()
    // Attach event listeners to all editable elements in the Builder
    await this.addListenersToEditableElements()
    // set loading to false
    this.pageBuilderStateStore.setIsLoadingResumeEditing(false)
  }

  /**
   * Restores the original content that was loaded when the builder started.
   * @returns {Promise<void>}
   */
  public async restoreOriginalContent() {
    this.updateLocalStorageItemName()

    this.pageBuilderStateStore.setIsRestoring(true)
    await delay(400)

    // Restore the original content if available
    if (Array.isArray(this.originalComponents)) {
      await this.clearClassesFromPage()
      await this.clearInlineStylesFromPage()
      const htmlString = this.renderComponentsToHtml(this.originalComponents)
      await this.mountComponentsToDOM(htmlString)
      this.removeCurrentComponentsFromLocalStorage()
    }

    // Wait for Vue to finish DOM updates before attaching event listeners. This ensure elements exist in the DOM.
    await nextTick()
    // Attach event listeners to all editable elements in the Builder
    await this.addListenersToEditableElements()

    this.pageBuilderStateStore.setIsRestoring(false)
  }

  public async returnLatestComponents() {
    this.syncDomToStoreOnly()
    // Wait for Vue to finish DOM updates before attaching event listeners. This ensure elements exist in the DOM.
    await nextTick()
    // Attach event listeners to all editable elements in the Builder
    await this.addListenersToEditableElements()

    return this.pageBuilderStateStore.getComponents
  }
  /**
   * Gets the local storage key for the current resource.
   * @returns {string | null} The local storage key.
   */
  public getStorageItemNameForResource(): string | null {
    return this.getLocalStorageItemName.value
  }

  /**
   * Retrieves the saved page HTML from local storage.
   * @returns {string | false} The HTML string or false if not found.
   */
  public getSavedPageHtml() {
    if (!this.getLocalStorageItemName.value) return false

    const key = this.getLocalStorageItemName.value
    if (!key) return false

    const raw = localStorage.getItem(key)
    if (!raw) return false

    const parsed = JSON.parse(raw)

    // Object with components and pageSettings
    if (parsed && Array.isArray(parsed.components)) {
      const classes = (parsed.pageSettings && parsed.pageSettings.classes) || ''
      const style = (parsed.pageSettings && parsed.pageSettings.style) || ''

      const sectionsHtml = parsed.components
        .map((c: ComponentObject) => {
          const parser = new DOMParser()
          const doc = parser.parseFromString(c.html_code, 'text/html')
          const section = doc.querySelector('section')

          if (section) {
            section.removeAttribute('data-componentid') // Remove the data-componentid attribute
            return section.outerHTML
          }

          return c.html_code // Fallback in case section is not found
        })
        .join('\n')

      return `<div id="pagebuilder" class="${classes}" style="${style}">\n${sectionsHtml}\n</div>`
    }

    return false
  }

  /**
   * Applies a selected image to the current element.
   * @param {ImageObject} image - The image object to apply.
   * @returns {Promise<void>}
   */
  public async applySelectedImage(image: ImageObject): Promise<void> {
    this.pageBuilderStateStore.setApplyImageToSelection(image)

    if (!this.getElement.value) return

    // Only apply if an image is staged
    if (this.getApplyImageToSelection.value && this.getApplyImageToSelection.value.src) {
      await nextTick()
      this.pageBuilderStateStore.setBasePrimaryImage(`${this.getApplyImageToSelection.value.src}`)

      await this.handleAutoSave()
    }
  }

  /**
   * Sets the base primary image from the currently selected element if it's an image.
   * @private
   */
  private setBasePrimaryImageFromSelectedElement() {
    if (!this.getElement.value) return

    const currentImageContainer = document.createElement('div')
    currentImageContainer.innerHTML = this.getElement.value.outerHTML

    // Get all img and div within the current image container
    const imgElements = currentImageContainer.getElementsByTagName('img')
    const divElements = currentImageContainer.getElementsByTagName('div')

    // If exactly one img and no div, set as base primary image
    if (imgElements.length === 1 && divElements.length === 0) {
      this.pageBuilderStateStore.setBasePrimaryImage(imgElements[0].src)
      return
    }

    // Otherwise, clear the base primary image
    this.pageBuilderStateStore.setBasePrimaryImage(null)
  }

  /**
   * Adds or removes a hyperlink from the selected element.
   * @param {boolean} hyperlinkEnable - Whether to enable or disable the hyperlink.
   * @param {string | null} urlInput - The URL for the hyperlink.
   * @param {boolean} openHyperlinkInNewTab - Whether the link should open in a new tab.
   * @private
   */
  private addHyperlinkToElement(
    hyperlinkEnable: boolean,
    urlInput: string | null,
    openHyperlinkInNewTab: boolean,
  ) {
    if (!this.getElement.value) return

    // Check if element is a proper DOM element and has closest method
    if (
      !(this.getElement.value instanceof HTMLElement) ||
      typeof this.getElement.value.closest !== 'function'
    )
      return

    const parentHyperlink = this.getElement.value.closest('a')
    const hyperlink = this.getElement.value.querySelector('a')

    this.pageBuilderStateStore.setHyperlinkError(null)

    // url validation
    const urlRegex = /^https?:\/\//

    const isValidURL = ref(true)

    if (hyperlinkEnable === true && urlInput !== null) {
      isValidURL.value = urlRegex.test(urlInput)
    }

    if (isValidURL.value === false) {
      this.pageBuilderStateStore.setHyperlinkMessage(null)

      this.pageBuilderStateStore.setHyperlinkError('URL is not valid')
      return
    }

    if (hyperlinkEnable === true && typeof urlInput === 'string') {
      // check if element contains child hyperlink tag
      // updated existing url
      if (hyperlink !== null && urlInput.length !== 0) {
        hyperlink.href = urlInput

        // Conditionally set the target attribute if openHyperlinkInNewTab is true
        if (openHyperlinkInNewTab === true) {
          hyperlink.target = '_blank'
        }
        if (openHyperlinkInNewTab === false) {
          hyperlink.removeAttribute('target')
        }

        hyperlink.textContent = this.getElement.value.textContent

        this.pageBuilderStateStore.setHyperlinkMessage('Succesfully updated element hyperlink')

        this.pageBuilderStateStore.setElementContainsHyperlink(true)

        return
      }

      // check if element contains child a tag
      if (hyperlink === null && urlInput.length !== 0) {
        // add a href
        if (parentHyperlink === null) {
          const link = document.createElement('a')
          link.href = urlInput

          // Conditionally set the target attribute if openHyperlinkInNewTab is true
          if (openHyperlinkInNewTab === true) {
            link.target = '_blank'
          }

          link.textContent = this.getElement.value.textContent
          this.getElement.value.textContent = ''
          this.getElement.value.appendChild(link)

          this.pageBuilderStateStore.setHyperlinkMessage('Successfully added hyperlink to element')

          this.pageBuilderStateStore.setElementContainsHyperlink(true)

          return
        }
      }
      //
    }

    if (hyperlinkEnable === false && urlInput === 'removeHyperlink') {
      // To remove the added hyperlink tag
      const originalText = this.getElement.value.textContent || ''
      const textNode = document.createTextNode(originalText)
      this.getElement.value.textContent = ''
      this.getElement.value.appendChild(textNode)

      this.pageBuilderStateStore.setHyberlinkEnable(false)
      this.pageBuilderStateStore.setElementContainsHyperlink(false)
    }
  }

  /**
   * Checks if the selected element contains a hyperlink and updates the state accordingly.
   * @private
   */
  private checkForHyperlink() {
    if (!this.getElement.value) return

    const hyperlink = this.getElement.value.querySelector('a')
    if (hyperlink !== null) {
      this.pageBuilderStateStore.setHyberlinkEnable(true)
      this.pageBuilderStateStore.setElementContainsHyperlink(true)
      this.pageBuilderStateStore.setHyperlinkInput(hyperlink.href)
      this.pageBuilderStateStore.setHyperlinkMessage(null)
      this.pageBuilderStateStore.setHyperlinkError(null)

      if (hyperlink.target === '_blank') {
        this.pageBuilderStateStore.setOpenHyperlinkInNewTab(true)
      }
      if (hyperlink.target !== '_blank') {
        this.pageBuilderStateStore.setOpenHyperlinkInNewTab(false)
      }

      return
    }

    this.pageBuilderStateStore.setElementContainsHyperlink(false)
    this.pageBuilderStateStore.setHyperlinkInput('')
    this.pageBuilderStateStore.setHyperlinkError(null)
    this.pageBuilderStateStore.setHyperlinkMessage(null)
    this.pageBuilderStateStore.setHyberlinkEnable(false)
  }

  /**
   * Handles all hyperlink-related actions for the selected element.
   * @param {boolean} [hyperlinkEnable] - Whether to enable or disable the hyperlink.
   * @param {string | null} [urlInput] - The URL for the hyperlink.
   * @param {boolean} [openHyperlinkInNewTab] - Whether the link should open in a new tab.
   */
  public handleHyperlink(
    hyperlinkEnable?: boolean,
    urlInput?: string | null,
    openHyperlinkInNewTab?: boolean,
  ): void {
    this.pageBuilderStateStore.setHyperlinkAbility(true)

    if (!this.getElement.value) return

    // Check if element is a proper DOM element and has closest method
    if (
      !(this.getElement.value instanceof HTMLElement) ||
      typeof this.getElement.value.closest !== 'function'
    )
      return

    const parentHyperlink = this.getElement.value.closest('a')

    // handle case where parent element already has an a href tag
    // when clicking directly on a hyperlink
    if (parentHyperlink !== null) {
      this.pageBuilderStateStore.setHyperlinkAbility(false)
    }
    const elementTag = this.getElement.value?.tagName.toUpperCase()

    if (
      elementTag !== 'P' &&
      elementTag !== 'H1' &&
      elementTag !== 'H2' &&
      elementTag !== 'H3' &&
      elementTag !== 'H4' &&
      elementTag !== 'H5' &&
      elementTag !== 'H6'
    ) {
      this.pageBuilderStateStore.setHyperlinkAbility(false)
    }

    if (hyperlinkEnable === undefined) {
      this.checkForHyperlink()
      return
    }

    this.addHyperlinkToElement(hyperlinkEnable, urlInput || null, openHyperlinkInNewTab || false)
  }

  public async addTheme(components: string): Promise<void> {
    if (components) {
      this.validateMountingHTML(components)
      await this.mountComponentsToDOM(components)
    }
    await this.handleAutoSave()
  }

  public async analyzeSEO(): Promise<SEOSummary> {
    const getComponents = await this.returnLatestComponents()

    if (!getComponents || !Array.isArray(getComponents) || getComponents.length === 0) {
      return {
        score: 0,
        checks: [],
      }
    }

    // Concatenate all html_code strings into a single HTML document
    const fullHtml = getComponents
      .map((component: ComponentObject) => component.html_code)
      .filter((html: string) => html && html.trim() !== '') // Filter out any empty/invalid codes
      .join('\n') // Join with newlines to preserve section structure

    if (!fullHtml) {
      return {
        score: 0,
        checks: [],
      }
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(fullHtml, 'text/html')

    const checks: SEOCheck[] = []

    // Paragraph length
    const paragraphs = [...doc.querySelectorAll('p')].map((p) => p.textContent?.trim() ?? '')
    const totalWords = paragraphs
      .join(' ')
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    checks.push({
      check: 'At least 300 words of content',
      passed: totalWords >= 300,
      details: `Found ${totalWords} words`,
    })

    // Individual heading checks (H2-H6)
    const h2Count = doc.querySelectorAll('h2').length
    checks.push({
      check: 'Has at least one H2',
      passed: h2Count > 0,
      details: `Found ${h2Count} H2 headings`,
    })

    const h3Count = doc.querySelectorAll('h3').length
    checks.push({
      check: 'Has at least one H3',
      passed: h3Count > 0,
      details: `Found ${h3Count} H3 headings`,
    })

    const h4Count = doc.querySelectorAll('h4').length
    checks.push({
      check: 'Has at least one H4',
      passed: h4Count > 0,
      details: `Found ${h4Count} H4 headings`,
    })

    const h5Count = doc.querySelectorAll('h5').length
    checks.push({
      check: 'Has at least one H5',
      passed: h5Count > 0,
      details: `Found ${h5Count} H5 headings`,
    })

    const h6Count = doc.querySelectorAll('h6').length
    checks.push({
      check: 'Has at least one H6',
      passed: h6Count > 0,
      details: `Found ${h6Count} H6 headings`,
    })

    // Score = % of passed checks
    const passedCount = checks.filter((c) => c.passed).length
    const score = Math.round((passedCount / checks.length) * 100)

    return {
      score,
      checks,
    }
  }

  /**
   * Adds a new component to the page builder.
   * @param {ComponentObject} componentObject - The component to add.
   * @returns {Promise<void>}
   */
  public async addComponent(componentObject: ComponentObject): Promise<void> {
    const placeCompAtLocation = this.pageBuilderStateStore.getAddComponentAddIndex ?? 0

    try {
      const clonedComponent = this.cloneCompObjForDOMInsertion({
        html_code: componentObject.html_code,
        id: componentObject.id,
        title: componentObject.title,
      })

      let insertedIndex = placeCompAtLocation

      if (
        this.getComponentArrayAddMethod.value === 'insert' &&
        typeof placeCompAtLocation === 'number' &&
        placeCompAtLocation >= 0
      ) {
        this.syncDomToStoreOnly()
        await nextTick()
        const components = this.pageBuilderStateStore.getComponents || []
        const newComponents = [
          ...components.slice(0, placeCompAtLocation),
          clonedComponent,
          ...components.slice(placeCompAtLocation),
        ]
        this.pageBuilderStateStore.setComponents(newComponents)
        insertedIndex = placeCompAtLocation
      } else {
        this.pageBuilderStateStore.setPushComponents({
          component: clonedComponent,
          componentArrayAddMethod: this.getComponentArrayAddMethod.value
            ? this.getComponentArrayAddMethod.value
            : 'push',
        })
      }

      const pageBuilderWrapper = document.querySelector('#page-builder-wrapper')
      if (pageBuilderWrapper) {
        if (this.getComponentArrayAddMethod.value === 'push') {
          pageBuilderWrapper.scrollTo({
            top: pageBuilderWrapper.scrollHeight + 50,
            behavior: 'smooth',
          })
        }
        if (
          this.getComponentArrayAddMethod.value === 'insert' &&
          typeof insertedIndex === 'number'
        ) {
          this.saveDomComponentsToLocalStorage()
          await nextTick()
          // Wait for DOM update after setting components
          await nextTick()
          const sections = pageBuilderWrapper.querySelectorAll('section[data-componentid]')
          if (sections.length > 0) {
            // Clamp index to valid range
            const index = Math.max(0, Math.min(insertedIndex, sections.length - 1))
            const targetSection = sections[index]
            if (targetSection) {
              ;(targetSection as HTMLElement).scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              })
            }
          }
        }
      }

      await nextTick()
      await this.addListenersToEditableElements()
      await this.handleAutoSave()
    } catch (error) {
      console.error('Error adding component:', error)
    } finally {
      this.pageBuilderStateStore.setAddComponentAddIndex(null)
    }
  }

  /**
   * Adds a prefix to Tailwind CSS classes in a string.
   * @param {string} classList - The string of classes.
   * @param {string} [prefix='pbx-'] - The prefix to add.
   * @returns {string} The prefixed class string.
   * @private
   */
  private addTailwindPrefixToClasses(classList: string, prefix = 'pbx-'): string {
    return classList
      .split(/\s+/)
      .map((cls) => {
        if (!cls || cls.startsWith(prefix)) return cls
        const parts = cls.split(':')
        const base = parts.pop()!
        if (base.startsWith(prefix)) return cls
        // Always prefix if not already prefixed
        return [...parts, prefix + base].join(':')
      })
      .join(' ')
  }

  /**
   * Converts a style object to a CSS string.
   * @param {string | Record<string, string> | null | undefined} styleObj - The style object.
   * @returns {string} The CSS style string.
   * @private
   */
  private convertStyleObjectToString(
    styleObj: string | Record<string, string> | null | undefined,
  ): string {
    if (!styleObj) return ''
    if (typeof styleObj === 'string') return styleObj

    return Object.entries(styleObj)
      .map(([key, value]) => {
        const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
        return `${kebabKey}: ${value};`
      })
      .join(' ')
  }

  /**
   * Parses a string of HTML and extracts builder components and global page settings.
   * - This method expects an **HTML string** containing one or more `<section>...</section>` elements (such as the output from `getSavedPageHtml()` or a previously saved builder HTML string).
   * - **Do NOT pass a JSON string** (such as the result of `JSON.stringify(componentsArray)`) to this method. Passing a JSON string to `DOMParser.parseFromString(..., 'text/html')` will not produce valid DOM nodes. Instead, it will treat the JSON as plain text, resulting in a `<html><head></head><body>{...json...}</body></html>` structure, not real HTML elements.
   * - If you pass a JSON string, you will see lots of `\n` and strange HTML, because the parser is just wrapping your JSON in a `<body>` tag as text.
   *
   * Why only HTML?
   * - It enforces a single source of truth for builder state (HTML).
   * - It prevents misuse (e.g., passing JSON to a DOM parser, which is always a bug).
   * - It makes your documentation and support much simpler.
   *
   * @param htmlString - The HTML string to parse (must contain `<section>...</section>` elements, not JSON).
   * @returns An object with `components` (array of builder components) and `pageSettings` (global styles for the page).
   */
  public parsePageBuilderHTML(htmlString: string): {
    components: ComponentObject[]
    pageSettings: PageSettings
  } {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')

    // Prefix all classes in the document
    doc.querySelectorAll('[class]').forEach((element) => {
      const currentClasses = element.getAttribute('class') || ''
      const prefixedClasses = this.addTailwindPrefixToClasses(currentClasses)
      element.setAttribute('class', prefixedClasses)
    })

    const pagebuilderDiv = doc.querySelector('#pagebuilder')
    let pageSettings: PageSettings = {
      classes: '',
      style: {},
    }

    if (pagebuilderDiv) {
      const rawStyle = pagebuilderDiv.getAttribute('style') || ''
      pageSettings = {
        classes: pagebuilderDiv.className || '',
        style: this.parseStyleString(rawStyle),
      }
    }

    // Always assign sectionNodes before use
    let sectionNodes: NodeListOf<HTMLElement> = doc.querySelectorAll('section')
    if (pagebuilderDiv) {
      sectionNodes = pagebuilderDiv.querySelectorAll('section')
    }

    // Only use top-level (non-nested) sections as components
    const topLevelSections = Array.from(sectionNodes).filter(
      (section) =>
        !section.parentElement || section.parentElement.tagName.toLowerCase() !== 'section',
    )

    let components: ComponentObject[] = []

    if (topLevelSections.length > 0) {
      components = topLevelSections.map((section) => ({
        id: null,
        html_code: section.outerHTML.trim(),
        title: section.getAttribute('data-component-title') || 'Untitled Component',
      }))
    }
    if (topLevelSections.length === 0) {
      // No <section> found: treat each first-level child as a component, wrapped in a section
      const parent = pagebuilderDiv || doc.body
      const children = Array.from(parent.children)
      if (children.length > 0) {
        components = children.map((child) => {
          // Wrap in a section with data-componentid and data-component-title
          const section = doc.createElement('section')
          section.setAttribute('data-component-title', 'Untitled Component')
          // Optionally: generate a uuid for data-componentid if needed
          // section.setAttribute('data-componentid', uuidv4())
          section.innerHTML = child.outerHTML.trim()
          return {
            id: null,
            html_code: section.outerHTML.trim(),
            title: 'Untitled Component',
          }
        })
      }
      if (children.length === 0) {
        // No children: wrap the entire content in a <section> as a single component
        const section = doc.createElement('section')
        section.setAttribute('data-component-title', 'Untitled Component')
        section.innerHTML = parent.innerHTML.trim()
        components = [
          {
            id: null,
            html_code: section.outerHTML.trim(),
            title: 'Untitled Component',
          },
        ]
      }
    }

    return {
      components,
      pageSettings,
    }
  }

  /**
   * Applies modified components by mounting them to the DOM and attaching listeners.
   * @param htmlString - The HTML string to apply
   * @returns {Promise<string | null>} - Returns error message if failed, otherwise null
   */
  public async applyModifiedHTML(htmlString: string): Promise<string | null> {
    if (!htmlString || (typeof htmlString === 'string' && htmlString.length === 0)) {
      return 'No HTML content was provided. Please ensure a valid HTML string is passed.'
    }

    // Check if the htmlString contains any <section> tags
    if (/<section[\s>]/i.test(htmlString)) {
      return 'Error: The <section> tag cannot be used as it is already included inside this component.'
    }

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlString.trim()

    const parsedElement = tempDiv.firstElementChild as HTMLElement | null

    if (!parsedElement) {
      return 'Could not parse element from HTML string.'
    }

    // Replace the actual DOM element
    const oldElement = this.pageBuilderStateStore.getElement

    if (oldElement && oldElement.parentElement) {
      oldElement.replaceWith(parsedElement)

      // Update the element in the store (now referencing the new one)
      this.pageBuilderStateStore.setElement(parsedElement)
    }

    await this.addListenersToEditableElements()
    await nextTick()
    return null
  }

  private validateMountingHTML(
    htmlString: string,
    options?: { logError?: boolean },
  ): string | null {
    // Trim HTML string
    const trimmedData = htmlString.trim()
    const openingSectionMatches = htmlString.match(/<section\b[^>]*>/gi) || []
    const closingSectionMatches = htmlString.match(/<\/section>/gi) || []

    if (!htmlString || htmlString.trim().length === 0) {
      const error = 'No HTML content was provided. Please ensure a valid HTML string is passed.'
      if (options && options.logError) {
        console.error(error)
        // Behavior
        return error
      }
      // default behavior
      return error
    }

    if (openingSectionMatches.length !== closingSectionMatches.length) {
      const error =
        'Uneven <section> tags detected in the provided HTML. Each component must be wrapped in its own properly paired <section>...</section>. ' +
        'Ensure that all <section> tags have a matching closing </section> tag.'

      if (options && options.logError) {
        console.error(error)
        return error
      }

      return error
    }

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = trimmedData
    const nestedSection = tempDiv.querySelector('section section')
    if (nestedSection) {
      const error =
        'Nested <section> tags are not allowed. Please ensure that no <section> is placed inside another <section>.'
      if (options && options.logError) {
        console.error(error)
        return error
      }
      return error
    }

    // Return error since JSON data has been passed to mount HTML to DOM
    if (trimmedData.startsWith('[') || trimmedData.startsWith('{')) {
      const error =
        'Brackets [] or curly braces {} are not valid HTML. They are used for data formats like JSON.'
      if (options && options.logError) {
        console.error(error)
        return error
      }

      return error
    }

    return null
  }

  /**
   * Applies modified components by mounting them to the DOM and attaching listeners.
   * @param htmlString - The HTML string to apply
   * @returns {Promise<string | null>} - Returns error message if failed, otherwise null
   */
  public async applyModifiedComponents(htmlString: string): Promise<string | null> {
    // Trim HTML string
    const trimmedData = htmlString.trim()

    const openingSectionMatches = htmlString.match(/<section\b[^>]*>/gi) || []

    if (openingSectionMatches.length === 0) {
      const error = 'No <section> tags found. Each component must be wrapped in a <section> tag.'
      if (error) {
        return error
      }
    }

    const validationError = this.validateMountingHTML(trimmedData)
    if (validationError) return validationError

    // also fixed to use `trimmedData`
    await this.mountComponentsToDOM(trimmedData)
    await this.addListenersToEditableElements()
    await nextTick()
    return null
  }

  /**
   * Mounts builder components to the DOM from an HTML string.
   *
   * Input format detection:
   *   - If the input starts with `[` or `{`: treated as JSON (array or object).
   *   - If the input starts with `<`: treated as HTML.
   *
   * This function should be used when:
   *   - Restoring the builder from a published HTML snapshot.
   *   - Importing a static HTML export.
   *   - Loading the builder from previously published or saved HTML (e.g., from `getSavedPageHtml()`).
   *
   * Typical use cases include restoring a published state, importing templates, or previewing published content.
   */

  private async mountComponentsToDOM(
    htmlString: string,
    usePassedPageSettings?: boolean,
    pageSettingsFromHistory?: PageSettings,
  ): Promise<void> {
    // Trim HTML string
    const trimmedData = htmlString.trim()

    const validationError = this.validateMountingHTML(trimmedData, { logError: true })
    if (validationError) return

    // HTML string
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlString, 'text/html')

      const importedPageBuilder = doc.querySelector('#pagebuilder') as HTMLElement | null
      const livePageBuilder = document.querySelector('#pagebuilder') as HTMLElement | null

      // Initialize configPageSettings to null
      let configPageSettings = null

      // Use stored page settings if the flag is true
      if (usePassedPageSettings) {
        configPageSettings = this.pageBuilderStateStore.getPageBuilderConfig?.pageSettings || null
      }

      // Use imported page builder settings if available and pageSettings is still null
      if (!pageSettingsFromHistory && !configPageSettings && importedPageBuilder) {
        configPageSettings = {
          classes: importedPageBuilder.className || '',
          style: importedPageBuilder.getAttribute('style') || '',
        }
      }

      // Fallback to stored page settings if pageSettings is still null
      if (!configPageSettings) {
        configPageSettings = this.pageBuilderStateStore.getPageBuilderConfig?.pageSettings || null
      }

      // Apply the page settings to the live page builder
      if (!pageSettingsFromHistory && configPageSettings && livePageBuilder) {
        // Remove existing class and style attributes
        livePageBuilder.removeAttribute('class')
        livePageBuilder.removeAttribute('style')

        // Apply new classes and styles
        livePageBuilder.className = configPageSettings.classes || ''
        livePageBuilder.setAttribute(
          'style',
          this.convertStyleObjectToString(configPageSettings.style),
        )
      }

      // Apply the page settings to the live page builder
      if (pageSettingsFromHistory && livePageBuilder) {
        // Remove existing class and style attributes
        livePageBuilder.removeAttribute('class')
        livePageBuilder.removeAttribute('style')

        // Apply new classes and styles
        livePageBuilder.className = pageSettingsFromHistory.classes || ''
        livePageBuilder.setAttribute(
          'style',
          this.convertStyleObjectToString(pageSettingsFromHistory.style),
        )
      }

      // Select all <section> elements
      const sectionElements = doc.querySelectorAll('section')

      const extractedSections: ComponentObject[] = []
      sectionElements.forEach((section) => {
        // Prefix all classes inside section
        section.querySelectorAll('[class]').forEach((el) => {
          el.setAttribute(
            'class',
            this.addTailwindPrefixToClasses(el.getAttribute('class') || '', 'pbx-'),
          )
        })

        const htmlElement = section as HTMLElement

        // Ensure data-componentid exists
        if (!htmlElement.hasAttribute('data-componentid')) {
          htmlElement.setAttribute('data-componentid', uuidv4())
        }
        const componentId = htmlElement.getAttribute('data-componentid')!

        // Ensure data-component-title exists
        const title = htmlElement.getAttribute('data-component-title') || 'Untitled Component'

        htmlElement.setAttribute('data-component-title', title)

        extractedSections.push({
          html_code: htmlElement.outerHTML,
          id: componentId,
          title: title,
        })
      })

      this.pageBuilderStateStore.setComponents(extractedSections)

      // Clear selections and re-bind events
      await this.clearHtmlSelection()
      await nextTick()
      await this.addListenersToEditableElements()
    } catch (error) {
      console.error('Error parsing HTML components:', error)
      this.deleteAllComponentsFromDOM()
      // Clear selections and re-bind events
      await this.clearHtmlSelection()
      await nextTick()
      await this.addListenersToEditableElements()
    }
  }
  private updateLocalStorageItemName(): void {
    const formtype =
      this.pageBuilderStateStore.getPageBuilderConfig &&
      this.pageBuilderStateStore.getPageBuilderConfig.updateOrCreate &&
      this.pageBuilderStateStore.getPageBuilderConfig.updateOrCreate.formType

    const formname =
      this.pageBuilderStateStore.getPageBuilderConfig &&
      this.pageBuilderStateStore.getPageBuilderConfig.updateOrCreate &&
      this.pageBuilderStateStore.getPageBuilderConfig.updateOrCreate.formName

    const resourceData =
      this.pageBuilderStateStore.getPageBuilderConfig &&
      this.pageBuilderStateStore.getPageBuilderConfig.resourceData

    // Logic for create resource
    if (formtype === 'create') {
      if (formname && formname.length > 0) {
        this.pageBuilderStateStore.setLocalStorageItemName(
          `page-builder-create-resource-${this.sanitizeForLocalStorage(formname)}`,
        )
        return
      }

      this.pageBuilderStateStore.setLocalStorageItemName(`page-builder-create-resource`)
      return
    }

    // Logic for create
    // Logic for update and with resource form name
    if (formtype === 'update') {
      if (typeof formname === 'string' && formname.length > 0) {
        //
        //
        if (resourceData && resourceData != null && !resourceData.title) {
          // Check if id is missing, null, undefined, or an empty string (after trimming)
          if (!resourceData.id || typeof resourceData.id === 'string') {
            this.pageBuilderStateStore.setLocalStorageItemName(
              `page-builder-update-resource-${this.sanitizeForLocalStorage(formname)}`,
            )
            return
          }
        }

        // Runs when resourceData has title but no ID
        if (resourceData && resourceData != null) {
          if (
            resourceData.title &&
            typeof resourceData.title === 'string' &&
            resourceData.title.length > 0
          ) {
            if (!resourceData.id || typeof resourceData.id === 'string') {
              this.pageBuilderStateStore.setLocalStorageItemName(
                `page-builder-update-resource-${this.sanitizeForLocalStorage(formname)}-${this.sanitizeForLocalStorage(resourceData.title)}`,
              )
              return
            }
          }
        }

        // Runs when resourceData has ID but no title
        if (resourceData && resourceData != null) {
          if (!resourceData.title && typeof resourceData.title !== 'string') {
            if (resourceData.id || typeof resourceData.id === 'number') {
              this.pageBuilderStateStore.setLocalStorageItemName(
                `page-builder-update-resource-${this.sanitizeForLocalStorage(formname)}-${this.sanitizeForLocalStorage(String(resourceData.id))}`,
              )
              return
            }
          }
        }

        // Runs when resourceData has both title and ID
        if (resourceData && resourceData != null) {
          if (
            resourceData.title &&
            typeof resourceData.title === 'string' &&
            resourceData.title.length > 0
          ) {
            if (resourceData.id || typeof resourceData.id === 'number') {
              this.pageBuilderStateStore.setLocalStorageItemName(
                `page-builder-update-resource-${this.sanitizeForLocalStorage(formname)}-${this.sanitizeForLocalStorage(resourceData.title)}-${this.sanitizeForLocalStorage(String(resourceData.id))}`,
              )
              return
            }
          }
        }
      }

      // Logic for update without without formname
      if (!formname || (typeof formname === 'string' && formname.length === 0)) {
        //
        //
        if (resourceData && resourceData != null && !resourceData.title) {
          // Check if id is missing, null, undefined, or an empty string (after trimming)
          if (!resourceData.id || typeof resourceData.id === 'string') {
            this.pageBuilderStateStore.setLocalStorageItemName(`page-builder-update-resource`)
            return
          }
        }

        // Runs when resourceData has title but no ID
        if (resourceData && resourceData != null) {
          if (
            resourceData.title &&
            typeof resourceData.title === 'string' &&
            resourceData.title.length > 0
          ) {
            if (!resourceData.id || typeof resourceData.id === 'string') {
              this.pageBuilderStateStore.setLocalStorageItemName(
                `page-builder-update-resource-${this.sanitizeForLocalStorage(resourceData.title)}`,
              )
              return
            }
          }
        }

        // Runs when resourceData has ID but no title
        if (resourceData && resourceData != null) {
          if (!resourceData.title && typeof resourceData.title !== 'string') {
            if (resourceData.id || typeof resourceData.id === 'number') {
              this.pageBuilderStateStore.setLocalStorageItemName(
                `page-builder-update-resource-${this.sanitizeForLocalStorage(String(resourceData.id))}`,
              )
              return
            }
          }
        }

        // Runs when resourceData has both title and ID
        if (resourceData && resourceData != null) {
          if (
            resourceData.title &&
            typeof resourceData.title === 'string' &&
            resourceData.title.length > 0
          ) {
            if (resourceData.id || typeof resourceData.id === 'number') {
              this.pageBuilderStateStore.setLocalStorageItemName(
                `page-builder-update-resource-${this.sanitizeForLocalStorage(resourceData.title)}-${this.sanitizeForLocalStorage(String(resourceData.id))}`,
              )
              return
            }
          }
        }
      }
    }
  }

  /**
   * Initializes the styles for the currently selected element.
   */
  public async initializeElementStyles(): Promise<void> {
    // Wait for Vue to finish DOM updates before attaching event listeners.
    // This ensures elements exist in the DOM.
    await nextTick()
    this.setBasePrimaryImageFromSelectedElement()
    this.handleHyperlink(undefined, null, false)
    this.handleOpacity(undefined)
    this.handleBackgroundOpacity(undefined)
    this.handleBackgroundColor(undefined)
    this.handleTextColor(undefined)
    this.handleBorderStyle(undefined)
    this.handleBorderWidth(undefined)
    this.handleBorderColor(undefined)
    this.handleBorderRadiusGlobal(undefined)
    this.handleBorderRadiusTopLeft(undefined)
    this.handleBorderRadiusTopRight(undefined)
    this.handleBorderRadiusBottomleft(undefined)
    this.handleBorderRadiusBottomRight(undefined)
    this.handleFontSizeBase(undefined)
    this.handleFontSizeDesktop(undefined)
    this.handleFontSizeTablet(undefined)
    this.handleFontSizeMobile(undefined)
    this.handleFontWeight(undefined)
    this.handleFontFamily(undefined)
    this.handleFontStyle(undefined)
    this.handleVerticalPadding(undefined)
    this.handleHorizontalPadding(undefined)
    this.handleVerticalMargin(undefined)
    this.handleHorizontalMargin(undefined)

    await this.syncCurrentClasses()
    await this.syncCurrentStyles()
  }
}
