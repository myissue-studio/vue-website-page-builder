import { LocalStorageManager } from './LocalStorageManager'
import type {
  BuilderResourceData,
  ComponentObject,
  ImageObject,
  InsertProductsOptions,
  PageBuilderConfig,
  PageBuilderProductInput,
  PageMeta,
  ProductSectionOptions,
  PageSettings,
  SEOCheck,
  SEOSummary,
  StartBuilderResult,
} from '../types'
import type { usePageBuilderStateStore } from '../stores/page-builder-state'

import tailwindFontSizes from '../utils/builder/tailwind-font-sizes'
import tailwindColors from '../utils/builder/tailwind-colors'
import tailwindOpacities from '../utils/builder/tailwind-opacities'
import tailwindFontStyles from '../utils/builder/tailwind-font-styles'
import tailwindPaddingAndMargin from '../utils/builder/tailwind-padding-margin'
import tailwindBorderRadius from '../utils/builder/tailwind-border-radius'
import tailwindBorderStyleWidthPlusColor from '../utils/builder/tailwind-border-style-width-color'
import tailwindImage from '../utils/builder/tailwind-image'
import { computed, ref, nextTick } from 'vue'
import type { ComputedRef } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { sleep } from '../utils/sleep'
import { useToast } from '../composables/useToast'
import { useTranslations } from '../composables/useTranslations'
import { isEmptyObject } from '../utils/is-empty-object'
import { extractCleanHTMLFromPageBuilder } from '../utils/builder/extract-clean-html'
import { finalizeInlineTipTapHtml } from '../utils/builder/sanitize-inline-tiptap-html'
import { normalizeCssColorToHex } from '../utils/builder/color-utils'
import { loadFontFromClass } from '../utils/builder/dynamic-font-loader'
import { buildProductSectionHtml } from '../utils/builder/product-section-html'
import { getEditorFontFamilyClasses } from '../utils/builder/font-family-map'
import { isValidHyperlinkInput } from '../utils/builder/url-validation'
import { NON_LISTENER_TAGS } from '../utils/builder/non-listener-tags'
import {
  HTML_VALIDATION_MESSAGES,
  collectPassedComponentsHtmlWarnings,
  reportNonListenerTagClassViolations,
  reportPassedComponentsHtmlWarnings,
  validateMountingHtmlStructure,
  validateRequiresSectionWrapper,
  validateSectionNotAllowedInElementHtml,
} from '../utils/builder/html-component-validation'
import {
  applyProductSectionOptionsToElement,
  DEFAULT_PRODUCT_SECTION_OPTIONS,
  parseProductSectionFromElement,
  sectionHasProductImages,
  sectionHasProductPrices,
  sectionHasProductButtons,
  sectionHasProductLinks,
} from '../utils/builder/product-section-options'
import {
  applyPageMetaToElement,
  mergePageMetaIntoSettings,
  pageMetaFromPageSettings,
  readPageMetaFromElement,
} from '../utils/builder/page-meta'

function scrollContainerToCenterElement(
  container: HTMLElement,
  element: HTMLElement,
  duration = 180,
): void {
  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  const elementTop = elementRect.top - containerRect.top + container.scrollTop
  const targetScrollTop = elementTop - container.clientHeight / 2 + element.clientHeight / 2
  const start = container.scrollTop
  const distance = targetScrollTop - start

  if (Math.abs(distance) < 1) {
    window.dispatchEvent(new CustomEvent('pagebuilder:layout-change'))
    return
  }

  const startTime = performance.now()
  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration)
    const eased = 1 - (1 - progress) ** 3
    container.scrollTop = start + distance * eased
    window.dispatchEvent(new CustomEvent('pagebuilder:layout-change'))

    if (progress < 1) {
      requestAnimationFrame(step)
      return
    }

    window.dispatchEvent(new CustomEvent('pagebuilder:layout-change'))
  }

  requestAnimationFrame(step)
}

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

const FULL_WIDTH_COMPONENT_CLASS = 'pbx-full-width-component'

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
  private NoneListernesTags: readonly string[]
  private hasStartedEditing: boolean = false
  // Hold data from Database or Backend for updated post
  private originalComponents: BuilderResourceData | undefined = undefined
  private originalPageSettings: PageSettings | null = null
  // Holds data to be mounted when pagebuilder is not yet present in the DOM
  private savedMountComponents: BuilderResourceData | null = null
  private pendingMountComponents: BuilderResourceData | null = null
  private globalStylesObserver: MutationObserver | null = null
  private _pendingPageSettings: PageSettings | null = null
  private _lastKnownPageSettings: PageSettings | null = null
  private isPageBuilderMissingOnStart: boolean = false
  private hasCompletedBuilderMount: boolean = false
  private builderWasMountedBeforeClose: boolean = false
  private builderMountPromise: Promise<void> | null = null
  private activeBuilderSessionToken: number = 0
  private canvasClickCaptureListener: EventListener | null = null
  private canvasDblClickCaptureListener: EventListener | null = null

  // Add a class-level WeakMap to track elements and their listeners
  // Use class-level WeakMap from being a local variable inside addListenersToEditableElements to a private class-level property.
  // This ensures that the map persists across multiple calls to the method and retains knowledge of
  // which elements already have listeners.
  // This prevents multiple event listeners being attached to the same HTML elements
  private elementsWithListeners = new WeakMap<
    Element,
    {
      click: EventListener
      dblclick: EventListener
      mouseover: EventListener
      mouseleave: EventListener
    }
  >()

  private translate: (key: string) => string

  constructor(pageBuilderStateStore: ReturnType<typeof usePageBuilderStateStore>) {
    this.hasStartedEditing = false
    this.pageBuilderStateStore = pageBuilderStateStore
    const { translate } = useTranslations()
    this.translate = translate
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

    this.NoneListernesTags = NON_LISTENER_TAGS
  }

  // ---------------------------------------------------------------------------
  // Debug logging (enable via localStorage: pbx-debug = "1")
  // ---------------------------------------------------------------------------
  private isDebugEnabled(): boolean {
    try {
      return typeof localStorage !== 'undefined' && localStorage.getItem('pbx-debug') === '1'
    } catch {
      return false
    }
  }

  private debugLog(level: 'log' | 'warn' | 'error', message: string, data?: unknown): void {
    if (!this.isDebugEnabled()) return
    const prefix = '[PBX]'
    if (data !== undefined) {
      console[level](`${prefix} ${message}`, data)
      return
    }
    console[level](`${prefix} ${message}`)
  }

  /**
   * Returns the active builder canvas element.
   * Prefer the editor canvas marker to avoid collisions with host-rendered
   * published HTML that may also contain #pagebuilder.
   */
  private getBuilderCanvasElement(): HTMLElement | null {
    const builderCanvas = document.querySelector(
      '#pagebuilder[data-builder-canvas]',
    ) as HTMLElement | null
    if (builderCanvas) return builderCanvas

    return document.querySelector('#pagebuilder') as HTMLElement | null
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
    if (this.pageBuilderStateStore.getImageSettingsPanelOpen) return
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
      // Safely merge: start with existing userSettings (or empty object if undefined) and add/override language
      const mergedUserSettings = userSettings ? { ...userSettings } : {}
      mergedUserSettings.language = {
        default: defaultLang,
        enable: defaultEnable as typeof defaultEnable,
      }

      const updatedLanguage = {
        ...config,
        userSettings: mergedUserSettings,
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
      // After setting defaults, re-fetch or pass the updated config to subsequent validators
      // For simplicity, assuming validateConfig is called with fresh config; in practice, reload from store if needed
      return
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
    // This is called before ensureLanguage to ensure autoSave is preserved in any subsequent merges
    let currentConfig = config // Use a local ref to track updates
    if (
      !currentConfig.userSettings ||
      typeof currentConfig.userSettings !== 'object' ||
      !('autoSave' in currentConfig.userSettings)
    ) {
      const mergedUserSettings = currentConfig.userSettings ? { ...currentConfig.userSettings } : {}
      mergedUserSettings.autoSave = currentConfig.userSettings?.autoSave === false ? false : true

      const updatedConfig = {
        ...currentConfig,
        userSettings: mergedUserSettings,
      }
      this.pageBuilderStateStore.setPageBuilderConfig(updatedConfig)
      currentConfig = updatedConfig // Update local ref for downstream calls
    }

    this.ensureLanguage(currentConfig) // Pass the potentially updated config
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
    const sessionToken = ++this.activeBuilderSessionToken
    this.debugLog('warn', 'startBuilder(): begin', {
      sessionToken,
      hasPassedComponentsArray: Array.isArray(passedComponentsArray),
      passedComponentsLength: Array.isArray(passedComponentsArray)
        ? passedComponentsArray.length
        : null,
    })

    // Detect the current DOM state BEFORE any resets so we can decide whether a
    // full remount is needed.  When the builder is used with v-show (the component
    // stays mounted across close/reopen cycles), #pagebuilder persists with the
    // user's already-edited content and listeners.  Forcing a full remount in that
    // case would clear the canvas and, worse, trigger the "resume from draft" modal
    // every single reopen.  We only do a full lifecycle reset when the DOM wrapper
    // is absent or empty (v-if pattern — the component was destroyed on close).
    const pagebuilderBeforeReset = this.getBuilderCanvasElement()
    const hasLiveMountedContent = Boolean(
      pagebuilderBeforeReset?.querySelector('section[data-componentid]'),
    )

    this.debugLog('warn', 'startBuilder(): dom snapshot', {
      hasLiveMountedContent,
      hasPagebuilderEl: Boolean(pagebuilderBeforeReset),
      hasCompletedBuilderMount: this.hasCompletedBuilderMount,
    })

    const shouldForceFreshMount = this.builderWasMountedBeforeClose && sessionToken > 1

    if (!hasLiveMountedContent || shouldForceFreshMount) {
      // DOM is missing or the canvas has no sections — needs a fresh mount cycle.
      this.hasCompletedBuilderMount = false
      this.builderMountPromise = null
      this.pendingMountComponents = null
      this.isPageBuilderMissingOnStart = false
    }

    // Always reset transient UI/editor state — these must never persist across
    // open/close cycles regardless of whether a full remount is needed.
    if (typeof this.pageBuilderStateStore.setInlineTipTapEditor === 'function') {
      this.pageBuilderStateStore.setInlineTipTapEditor(false)
    }
    if (typeof this.pageBuilderStateStore.setShowModalTipTap === 'function') {
      this.pageBuilderStateStore.setShowModalTipTap(false)
    }
    if (typeof this.pageBuilderStateStore.setImageSettingsPanelOpen === 'function') {
      this.pageBuilderStateStore.setImageSettingsPanelOpen(false)
    }
    if (typeof this.pageBuilderStateStore.setElement === 'function') {
      this.pageBuilderStateStore.setElement(null)
    }
    if (typeof this.pageBuilderStateStore.setComponent === 'function') {
      this.pageBuilderStateStore.setComponent(null)
    }
    // Clear any loading overlay left by a stale previous session. A racing
    // completeMountProcess may have set setIsLoadingGlobal(true) but never
    // cleared it when its session token was invalidated. This explicit reset
    // ensures the GlobalLoader overlay does not permanently block canvas clicks.
    if (typeof this.pageBuilderStateStore.setIsLoadingGlobal === 'function') {
      this.pageBuilderStateStore.setIsLoadingGlobal(false)
    }

    // Reactive flag signals to the UI that the builder has been successfully initialized
    // Prevents builder actions to prevent errors caused by missing DOM .
    this.pageBuilderStateStore.setBuilderStarted(true)
    const pagebuilder = this.getBuilderCanvasElement()
    this.debugLog('warn', 'startBuilder(): #pagebuilder present?', Boolean(pagebuilder))

    // Snapshot page-level settings whenever a live wrapper exists so they can be
    // restored even if subsequent reopen payloads contain sections only.
    const currentStartSettings = this.readCurrentPageSettings()
    if (this.hasMeaningfulPageSettings(currentStartSettings)) {
      this._lastKnownPageSettings = currentStartSettings
    }

    let validation
    try {
      this.originalComponents = passedComponentsArray
      this.originalPageSettings = config.pageSettings ?? null

      // On reopen flows, component edits can survive in the singleton store while
      // incoming config may omit pageSettings. Mirror live wrapper settings into
      // runtime config so #pagebuilder classes/styles remain reactive and stable.
      let runtimeConfig = config
      if (
        this.hasMeaningfulPageSettings(currentStartSettings) &&
        !this.hasMeaningfulPageSettings(config.pageSettings)
      ) {
        runtimeConfig = {
          ...config,
          pageSettings: currentStartSettings,
        }
      }

      this.pageBuilderStateStore.setPageBuilderConfig(runtimeConfig)

      // Apply language default from config if localStorage has no saved preference
      const savedSettings = JSON.parse(localStorage.getItem('userSettingsPageBuilder') ?? 'null')
      if (!savedSettings?.lang && config.userSettings?.language?.default) {
        this.changeLanguage(config.userSettings.language.default)
      }
      // Validate and normalize the config (ensure required fields are present)
      this.validateConfig(config)

      validation = this.validateUserProvidedComponents(passedComponentsArray)

      const usablePassedComponents =
        Array.isArray(passedComponentsArray) && passedComponentsArray.length > 0
          ? passedComponentsArray
          : null
      const hasUsablePassedComponents = usablePassedComponents !== null

      // Soft HTML authoring checks for host-provided components (do not block start).
      const htmlWarnings = hasUsablePassedComponents
        ? collectPassedComponentsHtmlWarnings(usablePassedComponents)
        : []
      if (htmlWarnings.length) {
        reportPassedComponentsHtmlWarnings(htmlWarnings)
      }

      // Update the localStorage key name based on the config/resource
      this.updateLocalStorageItemName()
      this.initializeHistory()
      this.debugLog('warn', 'startBuilder(): storage key', {
        key: this.getLocalStorageItemName.value,
      })

      if (hasUsablePassedComponents) {
        this.savedMountComponents = usablePassedComponents
      }
      // Page Builder is not Present in the DOM but Components have been passed to the Builder
      if (!pagebuilder) {
        this.isPageBuilderMissingOnStart = true
      }
      if (hasUsablePassedComponents && !pagebuilder) {
        const existingDraft = this.getSavedPageHtml()
        this.debugLog('warn', 'startBuilder(): deferred mount decision', {
          existingDraft: Boolean(existingDraft),
          builderWasMountedBeforeClose: this.builderWasMountedBeforeClose,
          willQueuePendingMount: true,
        })
        // Passed update/create content is the source of truth for the initial canvas.
        // A local draft may still exist, but it should be resumed explicitly by the user.
        this.pendingMountComponents = usablePassedComponents
      }
      // Page Builder is Present in the DOM & Components have been passed to the Builder
      if (pagebuilder && (!passedComponentsArray || Array.isArray(passedComponentsArray))) {
        this.debugLog('warn', 'startBuilder(): calling completeBuilderInitialization', {
          hasUsablePassedComponents,
          isPageBuilderMissingOnStart: this.isPageBuilderMissingOnStart,
        })
        await this.completeBuilderInitializationWithSession(
          hasUsablePassedComponents ? usablePassedComponents : undefined,
          sessionToken,
        )
      }

      // Safety net: if the host already rendered #pagebuilder content and a full mount
      // was skipped (for example due to invalid/non-array passed data), still attach
      // interaction listeners so the canvas cannot get stuck as non-editable.
      if (pagebuilder) {
        await this.addListenersToEditableElements()
        this.debugLog('warn', 'startBuilder(): listeners attached (safety net)')
      }

      // Re-apply config pageSettings when the full remount was skipped (hasLiveMountedContent).
      // On a v-if reopen where startBuilder() is called after the DOM is ready, Vue renders
      // #pagebuilder with only its default :class binding — no style attribute.  Config-provided
      // styles (e.g. a background color set via pageSettings.style) must be applied explicitly
      // because mountComponentsToDOM (which normally calls applyPageSettingsToPage) was bypassed.
      // We only apply when the DOM element has no inline style so we do not overwrite user edits
      // that are already present (v-show pattern where styles persist across open/close cycles).
      if (hasLiveMountedContent && pagebuilder) {
        const configPageSettings =
          this.pageBuilderStateStore.getPageBuilderConfig?.pageSettings ?? null
        if (this.hasMeaningfulPageSettings(configPageSettings)) {
          const configStyleStr = this.convertStyleObjectToString(configPageSettings.style)
          const domStyle = pagebuilder.getAttribute('style') || ''
          if (configStyleStr.trim() && !domStyle.trim()) {
            await nextTick()
            this.applyPageSettingsToPage(configPageSettings)
          }
        }
      }

      // result to end user
      const result: StartBuilderResult = {
        message: 'Page builder started successfully.',
      }

      if (validation) {
        result.validation = validation
      }

      if (htmlWarnings.length) {
        result.htmlWarnings = htmlWarnings
      }

      // PassedComponentsArray
      if (Array.isArray(passedComponentsArray) && passedComponentsArray.length >= 0) {
        result.passedComponentsArray = passedComponentsArray
      }

      // Return messages, validation info if present etc.
      return result
    } catch (err) {
      console.error('Not able to start the Page Builder', err)
      this.debugLog('error', 'startBuilder(): error', err)
      return {
        error: true as const,
        reason: 'Failed to start the Page Builder due to an unexpected error.',
      }
    }
  }

  /**
   * Whether PageBuilder.vue should run deferred mount on mount (DOM was missing at startBuilder).
   *
   * @param ownCanvas - The component's own #pagebuilder element (passed from PageBuilder.vue ref).
   *   Using this instead of document.querySelector ensures the correct canvas is checked when
   *   multiple PageBuilder instances exist on the same page (e.g. one always-visible + one in a
   *   modal).  When the modal's canvas is empty while another instance already has content, the
   *   document.querySelector approach would miss the empty canvas entirely.
   */
  public shouldCompleteBuilderMountOnMount(ownCanvas?: HTMLElement): boolean {
    if (this.hasCompletedBuilderMount) {
      // v-if modal reopen path:
      // startBuilder() marks this session as missing-on-start while the modal is closed.
      // Even if Vue renders sections from stale singleton store state, we must still
      // run deferred mount so the latest localStorage draft is applied.
      if (this.isPageBuilderMissingOnStart) {
        this.hasCompletedBuilderMount = false
        this.builderMountPromise = null
        return true
      }

      // A previous PageBuilder session completed mounting. Check THIS component instance's
      // canvas (not the first matching document element) — covers the case of a PageBuilder
      // inside a v-if modal that just opened: its canvas is empty even though another instance
      // on the page already has content loaded.
      const canvas = ownCanvas ?? this.getBuilderCanvasElement()
      const hasSections = Boolean(canvas?.querySelector('section[data-componentid]'))
      if (canvas && !hasSections) {
        // Fresh empty canvas — reset lifecycle so the deferred init will run.
        this.hasCompletedBuilderMount = false
        this.builderMountPromise = null
        return true
      }
      return false
    }
    return this.isPageBuilderMissingOnStart || Boolean(this.pendingMountComponents)
  }

  /**
   * Marks the builder canvas lifecycle as "missing on start" for the next mount.
   * Used by PageBuilder.vue on unmount (v-if modal close) so reopen performs
   * a full draft-aware initialization instead of reusing potentially stale store DOM.
   */
  public markCanvasUnmountedForNextMount(): void {
    this.hasCompletedBuilderMount = false
    this.builderMountPromise = null
    this.isPageBuilderMissingOnStart = true
  }

  /**
   * Completes the builder initialization process once the DOM is ready.
   * @param {BuilderResourceData} [passedComponentsArray] - Optional array of components to load.
   * @returns {Promise<void>}
   */
  async completeBuilderInitialization(passedComponentsArray?: BuilderResourceData): Promise<void> {
    return this.completeBuilderInitializationWithSession(
      passedComponentsArray,
      this.activeBuilderSessionToken,
    )
  }

  private async completeBuilderInitializationWithSession(
    passedComponentsArray?: BuilderResourceData,
    sessionToken: number = this.activeBuilderSessionToken,
  ): Promise<void> {
    if (sessionToken !== this.activeBuilderSessionToken) return
    if (this.hasCompletedBuilderMount) {
      this.pageBuilderStateStore.setIsLoadingGlobal(false)
      return
    }
    if (!this.builderMountPromise) {
      this.builderMountPromise = this.runCompleteBuilderInitialization(
        passedComponentsArray,
        sessionToken,
      )
    }
    try {
      await this.builderMountPromise
    } finally {
      this.pageBuilderStateStore.setIsLoadingGlobal(false)
    }
  }

  private async runCompleteBuilderInitialization(
    passedComponentsArray?: BuilderResourceData,
    sessionToken: number = this.activeBuilderSessionToken,
  ): Promise<void> {
    if (sessionToken !== this.activeBuilderSessionToken) return
    let turnedLoadingOn = false
    try {
      this.pageBuilderStateStore.setIsLoadingGlobal(true)
      turnedLoadingOn = true
      await sleep(400)
      if (sessionToken !== this.activeBuilderSessionToken) return
      this.debugLog('warn', 'completeBuilderInitialization(): loading ON', {
        sessionToken,
        key: this.getLocalStorageItemName.value,
      })

      // Always clear DOM and store before mounting new resource
      this.deleteAllComponentsFromDOM()

      const config = this.pageBuilderStateStore.getPageBuilderConfig
      const formType = config && config.updateOrCreate && config.updateOrCreate.formType

      const localStorageData = this.getSavedPageHtml()
      this.debugLog('warn', 'completeBuilderInitialization(): draft presence', {
        key: this.getLocalStorageItemName.value,
        hasLocalDraft: Boolean(localStorageData),
        draftBytes: typeof localStorageData === 'string' ? localStorageData.length : 0,
        isPageBuilderMissingOnStart: this.isPageBuilderMissingOnStart,
        hasPendingMountComponents: Boolean(this.pendingMountComponents),
        hasPassedComponents: Boolean(passedComponentsArray),
      })
      // Deselect any selected or hovered elements in the builder UI
      await this.clearHtmlSelection()
      if (sessionToken !== this.activeBuilderSessionToken) return

      if (formType === 'update' || formType === 'create') {
        // Page Builder is initially present in the DOM
        if (!this.pendingMountComponents) {
          if (!passedComponentsArray && this.isPageBuilderMissingOnStart && localStorageData) {
            this.debugLog(
              'warn',
              'completeBuilderInitialization(): mounting from local draft (missing-on-start)',
            )
            await this.completeMountProcess(localStorageData, undefined, sessionToken, true)
            return
          }
          if (passedComponentsArray && !localStorageData) {
            this.debugLog(
              'warn',
              'completeBuilderInitialization(): mounting from passed components (no draft)',
            )
            const htmlString = this.renderComponentsToHtml(passedComponentsArray)
            await this.completeMountProcess(htmlString, true, sessionToken)
            this.saveDomComponentsToLocalStorage()
            return
          }

          if (passedComponentsArray && localStorageData) {
            if (this.builderWasMountedBeforeClose) {
              this.debugLog(
                'warn',
                'completeBuilderInitialization(): reopening session -> mounting from local draft directly',
                { key: this.getLocalStorageItemName.value },
              )
              await this.completeMountProcess(localStorageData, undefined, sessionToken, true)
              return
            }
            this.debugLog(
              'warn',
              'completeBuilderInitialization(): both passed + draft exist → mounting passed content + showing resume modal',
              { key: this.getLocalStorageItemName.value },
            )
            const htmlString = this.renderComponentsToHtml(passedComponentsArray)
            await this.completeMountProcess(htmlString, true, sessionToken)
            await sleep(500)
            this.pageBuilderStateStore.setHasLocalDraftForUpdate(true)
            return
          }

          if (!passedComponentsArray && localStorageData && !this.pendingMountComponents) {
            this.debugLog(
              'warn',
              'completeBuilderInitialization(): mounting from local draft (default path)',
            )
            await this.completeMountProcess(localStorageData, undefined, sessionToken, true)
            return
          }

          if (!passedComponentsArray && !localStorageData && this.isPageBuilderMissingOnStart) {
            const htmlString = this.renderComponentsToHtml([])
            await this.completeMountProcess(htmlString, undefined, sessionToken)
            return
          }

          if (!this.isPageBuilderMissingOnStart && !localStorageData && !passedComponentsArray) {
            const htmlString = this.renderComponentsToHtml([])
            await this.completeMountProcess(htmlString, undefined, sessionToken)
            return
          }
        }

        // Page Builder is not initially present in the DOM
        if (this.pendingMountComponents) {
          if (localStorageData && this.isPageBuilderMissingOnStart) {
            this.debugLog(
              'warn',
              'completeBuilderInitialization(): pending mount + draft → mounting passed content + showing resume modal',
            )
            const htmlString = this.renderComponentsToHtml(this.pendingMountComponents)
            await this.completeMountProcess(htmlString, true, sessionToken)
            await sleep(500)
            this.pageBuilderStateStore.setHasLocalDraftForUpdate(true)
            this.pendingMountComponents = null
            return
          }
          if (!localStorageData && passedComponentsArray && this.isPageBuilderMissingOnStart) {
            this.debugLog(
              'warn',
              'completeBuilderInitialization(): pending mount (no draft) → mount and save',
            )
            const htmlString = this.renderComponentsToHtml(this.pendingMountComponents)
            await this.completeMountProcess(htmlString, true, sessionToken)
            this.saveDomComponentsToLocalStorage()
            return
          }

          if (!passedComponentsArray && !localStorageData && this.isPageBuilderMissingOnStart) {
            const htmlString = this.renderComponentsToHtml(this.pendingMountComponents)
            await this.completeMountProcess(htmlString, true, sessionToken)
            this.saveDomComponentsToLocalStorage()
            return
          }
        }
      }
    } finally {
      // Always clear if this init turned loading on. Do not gate on session token:
      // a concurrent startBuilder() can bump the token while we are mid-init and
      // would otherwise leave isLoadingGlobal stuck true forever.
      if (turnedLoadingOn) {
        this.pageBuilderStateStore.setIsLoadingGlobal(false)
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
  private async completeMountProcess(
    html: string,
    useConfigPageSettings?: boolean,
    sessionToken: number = this.activeBuilderSessionToken,
    preferImportedPageSettings: boolean = false,
  ) {
    if (sessionToken !== this.activeBuilderSessionToken) {
      // A new startBuilder() call has already taken over — ensure loading is cleared
      // so the GlobalLoader overlay does not permanently block canvas interactions.
      this.pageBuilderStateStore.setIsLoadingGlobal(false)
      return
    }
    await this.mountComponentsToDOM(
      html,
      useConfigPageSettings,
      undefined,
      preferImportedPageSettings,
    )
    if (sessionToken !== this.activeBuilderSessionToken) {
      // A new startBuilder() call arrived while mountComponentsToDOM was running.
      // Ensure the loading overlay is not left blocking the canvas.
      this.pageBuilderStateStore.setIsLoadingGlobal(false)
      return
    }

    // Clean up any old localStorage items related to previous builder sessions
    this.deleteOldPageBuilderLocalStorage()
    this.pageBuilderStateStore.setIsRestoring(false)
    this.hasCompletedBuilderMount = true
    this.builderWasMountedBeforeClose = true
    this.pendingMountComponents = null
    this.isPageBuilderMissingOnStart = false
    this.pageBuilderStateStore.setIsLoadingGlobal(false)
    this.debugLog('warn', 'completeMountProcess(): loading OFF + mount complete', {
      sessionToken,
      hasCompletedBuilderMount: this.hasCompletedBuilderMount,
    })
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
    const currentHTMLElement = this.getActiveStyleTarget()

    if (!currentHTMLElement) return

    const isBorderRadiusControl =
      CSSArray === tailwindBorderRadius.roundedGlobal ||
      CSSArray === tailwindBorderRadius.roundedTopLeft ||
      CSSArray === tailwindBorderRadius.roundedTopRight ||
      CSSArray === tailwindBorderRadius.roundedBottomLeft ||
      CSSArray === tailwindBorderRadius.roundedBottomRight

    const isColorControl =
      CSSArray === tailwindColors.backgroundColorVariables ||
      CSSArray === tailwindColors.textColorVariables

    const isPaddingControl =
      CSSArray === tailwindPaddingAndMargin.verticalPadding ||
      CSSArray === tailwindPaddingAndMargin.horizontalPadding ||
      CSSArray === tailwindPaddingAndMargin.topPadding ||
      CSSArray === tailwindPaddingAndMargin.rightPadding ||
      CSSArray === tailwindPaddingAndMargin.bottomPadding ||
      CSSArray === tailwindPaddingAndMargin.leftPadding

    const helperButtonAnchor = this.resolveNestedButtonAnchorTarget(currentHTMLElement, {
      forBorderRadius: isBorderRadiusControl,
      forColor: isColorControl,
      forPadding: isPaddingControl,
      classArray: CSSArray,
    })

    const productImageWrapper =
      isBorderRadiusControl && currentHTMLElement.tagName === 'IMG'
        ? currentHTMLElement.closest('.pbx-product-card-image')
        : null

    const classTarget =
      helperButtonAnchor instanceof HTMLElement
        ? helperButtonAnchor
        : productImageWrapper instanceof HTMLElement
          ? productImageWrapper
          : currentHTMLElement

    const currentCSS =
      CSSArray.find((CSS) => {
        return classTarget.classList.contains(CSS)
      }) ||
      (helperButtonAnchor instanceof HTMLElement
        ? CSSArray.find((CSS) => currentHTMLElement.classList.contains(CSS))
        : undefined)

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
      if (elementClass) {
        if (classTarget.classList.contains(elementClass)) classTarget.classList.remove(elementClass)
        if (
          helperButtonAnchor instanceof HTMLElement &&
          currentHTMLElement.classList.contains(elementClass)
        ) {
          currentHTMLElement.classList.remove(elementClass)
        }
      }

      // Remove any legacy lg:- and md:-prefixed variants that may have been saved before the
      // padding/margin system was updated to apply at all screen sizes.
      // Responsive variants sit inside @media blocks in the generated CSS and therefore
      // win over base utilities regardless of declaration order, so they MUST be removed.
      CSSArray.forEach((cls) => {
        if (cls !== 'none') {
          ;['lg', 'md', 'sm', 'xl', '2xl'].forEach((bp) => {
            const prefixed = `${bp}:${cls}`
            if (classTarget.classList.contains(prefixed)) classTarget.classList.remove(prefixed)
            if (
              helperButtonAnchor instanceof HTMLElement &&
              currentHTMLElement.classList.contains(prefixed)
            ) {
              currentHTMLElement.classList.remove(prefixed)
            }
          })
        }
      })

      classTarget.classList.add(cssUserSelection)
      elementClass = cssUserSelection
    } else if (
      typeof cssUserSelection === 'string' &&
      cssUserSelection === 'none' &&
      elementClass
    ) {
      classTarget.classList.remove(elementClass)
      if (helperButtonAnchor instanceof HTMLElement) {
        currentHTMLElement.classList.remove(elementClass)
      }

      // Also clean up any legacy responsive-prefixed variants on reset to 'none'.
      CSSArray.forEach((cls) => {
        if (cls !== 'none') {
          ;['lg', 'md', 'sm', 'xl', '2xl'].forEach((bp) => {
            const prefixed = `${bp}:${cls}`
            if (classTarget.classList.contains(prefixed)) classTarget.classList.remove(prefixed)
            if (
              helperButtonAnchor instanceof HTMLElement &&
              currentHTMLElement.classList.contains(prefixed)
            ) {
              currentHTMLElement.classList.remove(prefixed)
            }
          })
        }
      })

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
        if (!this.pageBuilderStateStore.getInlineTipTapEditor) {
          this.pageBuilderStateStore.setElement(currentHTMLElement)
        }
      }
    }

    if (cssUserSelection !== undefined) {
      this.pageBuilderStateStore.setCurrentClasses(Array.from(currentHTMLElement.classList))

      const style = currentHTMLElement.getAttribute('style')
      if (style) {
        this.pageBuilderStateStore.setCurrentStyles(this.parseStyleString(style))
      } else {
        this.pageBuilderStateStore.setCurrentStyles({})
      }

      if (currentHTMLElement === this.getBuilderCanvasElement()) {
        this.syncGlobalPageSettingsIntoRuntimeConfig()
      }
    }

    return currentCSS
  }

  private resolveNestedButtonAnchorTarget(
    currentHTMLElement: HTMLElement,
    options: {
      forBorderRadius: boolean
      forColor: boolean
      forPadding?: boolean
      classArray: string[]
    },
  ): HTMLAnchorElement | null {
    if (currentHTMLElement.tagName === 'A') return null
    if (!options.forBorderRadius && !options.forColor && !options.forPadding) return null

    const anchors = Array.from(currentHTMLElement.querySelectorAll('a')).filter(
      (el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement,
    )
    if (!anchors.length) return null

    if (options.forBorderRadius) {
      const withRadiusClass = anchors.find((anchor) =>
        options.classArray.some((cls) => cls !== 'none' && anchor.classList.contains(cls)),
      )
      if (withRadiusClass) return withRadiusClass
    }

    // Known wrappers where visual button styles are owned by the nested anchor.
    if (
      currentHTMLElement.id === 'linktree' ||
      currentHTMLElement.classList.contains('pbx-product-card-cta')
    ) {
      return anchors[0] ?? null
    }

    // Generic fallback for button-like wrappers around a single CTA anchor.
    if ((options.forColor || options.forPadding) && anchors.length === 1) {
      const anchor = anchors[0]
      const className = anchor.className
      const looksLikeButton =
        className.includes('pbx-inline-flex') ||
        className.includes('pbx-bg-') ||
        className.includes('pbx-rounded')
      if (looksLikeButton) return anchor
    }

    return null
  }

  private removeElementClassesFromArray(element: HTMLElement, classes: string[]): void {
    classes.forEach((className) => {
      if (className !== 'none' && element.classList.contains(className)) {
        element.classList.remove(className)
      }
    })
  }

  /**
   * During Page Design editing, keep runtime config pageSettings aligned with the
   * live #pagebuilder wrapper so Vue re-renders do not restore stale styles.
   */
  private syncGlobalPageSettingsIntoRuntimeConfig(): void {
    if (!this.pageBuilderStateStore.getToggleGlobalHtmlMode) return

    const pagebuilder = this.getBuilderCanvasElement()
    if (!pagebuilder) return

    const pageSettings: PageSettings = {
      classes: pagebuilder.className || '',
      style: pagebuilder.getAttribute('style') || pagebuilder.style.cssText || '',
      meta: readPageMetaFromElement(pagebuilder),
    }

    this._lastKnownPageSettings = pageSettings

    const currentConfig = this.pageBuilderStateStore.getPageBuilderConfig
    if (currentConfig && typeof currentConfig === 'object') {
      this.pageBuilderStateStore.setPageBuilderConfig({
        ...(currentConfig as Record<string, unknown>),
        pageSettings,
      } as never)
    }
  }

  /**
   * Removes all CSS classes from the main page builder container.
   * @returns {Promise<void>}
   */
  public async clearClassesFromPage() {
    const pagebuilder = this.getBuilderCanvasElement()
    pagebuilder?.removeAttribute('class')

    this.initializeElementStyles()
    this.syncGlobalPageSettingsIntoRuntimeConfig()
    await nextTick()
  }
  /**
   * Removes all inline styles from the main page builder container.
   * @returns {Promise<void>}
   */
  public async clearInlineStylesFromPage() {
    const pagebuilder = this.getBuilderCanvasElement()
    pagebuilder?.removeAttribute('style')

    this.initializeElementStyles()
    this.syncGlobalPageSettingsIntoRuntimeConfig()
    await nextTick()
  }

  /**
   * Selects the main page builder container for global styling.
   * @returns {Promise<void>}
   */
  public async globalPageStyles() {
    const pagebuilder = this.getBuilderCanvasElement()
    if (!pagebuilder) return

    // Deselect any selected or hovered elements in the builder UI
    await this.clearHtmlSelection()

    // Set the element in the store (right sidebar edits this one)
    this.pageBuilderStateStore.setElement(pagebuilder)

    // Add the data attribute for styling
    pagebuilder.setAttribute('data-global-selected', 'true')

    // Keep the latest page-level classes/styles available after Vue remounts.
    if (this.globalStylesObserver) this.globalStylesObserver.disconnect()
    this.globalStylesObserver = new MutationObserver(() => {
      const current = this.readCurrentPageSettings()
      if (current) {
        this._lastKnownPageSettings = current
      }
    })
    this.globalStylesObserver.observe(pagebuilder, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-meta-title', 'data-meta-description'],
    })

    await nextTick()
  }

  /**
   * Disconnects the MutationObserver that tracks global page style changes.
   * Call when closing the global styles editor panel.
   */
  public stopGlobalStylesSync() {
    if (this.globalStylesObserver) {
      this.globalStylesObserver.disconnect()
      this.globalStylesObserver = null
    }
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
  private ensureImagesHaveAltText(element: HTMLElement): void {
    if (element.tagName === 'IMG' && !element.hasAttribute('alt')) {
      element.setAttribute('alt', 'image')
    }
    element.querySelectorAll('img:not([alt])').forEach((img) => {
      img.setAttribute('alt', 'image')
    })
  }

  private applyHelperCSSToElements(element: HTMLElement): void {
    this.wrapElementInDivIfExcluded(element)
    this.ensureImagesHaveAltText(element)

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

  private reportNonListenerTagClassViolations(root: ParentNode): void {
    reportNonListenerTagClassViolations(root)
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
   * Toggles direct, in-canvas rich text editing for the selected element.
   * @param {boolean} status - Whether to enable inline Tiptap editing.
   * @returns {Promise<void>}
   */
  public async toggleInlineTipTapEditor(status: boolean): Promise<void> {
    if (status && !this.isValidTextElement(this.getElement.value)) return

    this.pageBuilderStateStore.setInlineTipTapEditor(status)

    await nextTick()
    await this.addListenersToEditableElements()

    if (!status) {
      // Persist inline edits even if userSettings.autoSave is disabled.
      this.commitActiveInlineTipTapEditorSync()
      this.saveDomComponentsToLocalStorage()
    }
  }

  /**
   * Restores normal builder selection after an inline TipTap editor has been torn down.
   * @param {HTMLElement | null} element - The element that was edited inline.
   * @param {boolean} shouldAutoSave - Whether to autosave the restored element HTML.
   * @returns {Promise<void>}
   */
  public async finishInlineTipTapEditor(
    element: HTMLElement | null,
    shouldAutoSave: boolean = true,
  ): Promise<void> {
    this.pageBuilderStateStore.setInlineTipTapEditor(false)

    await nextTick()

    if (element) {
      const pagebuilder = this.getBuilderCanvasElement()
      pagebuilder?.querySelectorAll('[hovered]').forEach((el) => el.removeAttribute('hovered'))
      pagebuilder?.querySelectorAll('[selected]').forEach((el) => {
        if (el !== element) el.removeAttribute('selected')
      })

      element.removeAttribute('data-pbx-inline-tiptap')
      element.setAttribute('selected', '')
      this.pageBuilderStateStore.setElement(element)
    }

    await nextTick()
    await this.addListenersToEditableElements()
    await this.initializeElementStyles()
    await this.addListenersToEditableElements()

    if (shouldAutoSave) {
      // Persist inline edits even if userSettings.autoSave is disabled.
      this.commitActiveInlineTipTapEditorSync()
      this.saveDomComponentsToLocalStorage()
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
    if (this.pageBuilderStateStore.getInlineTipTapEditor) return

    e.preventDefault()
    e.stopPropagation()

    const pagebuilder = this.getBuilderCanvasElement()

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
    if (this.pageBuilderStateStore.getInlineTipTapEditor) return

    e.preventDefault()
    e.stopPropagation()

    const pagebuilder = this.getBuilderCanvasElement()
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
    // IMG elements are always selectable even inside no-select zones (e.g. slider)
    if (el.tagName !== 'IMG' && el.closest('[data-pb-no-select]')) return false
    return !this.NoneListernesTags.includes(el.tagName)
  }

  public getSelectedComponentSection(): HTMLElement | null {
    const element = this.getElement.value
    if (!element || !(element instanceof HTMLElement)) return null

    return element.closest('section') as HTMLElement | null
  }

  public isSelectedComponentTopElement(): boolean {
    const element = this.getElement.value
    const section = this.getSelectedComponentSection()

    if (!element || !section) return false

    return element.parentElement === section
  }

  public selectedComponentIsFullWidth(): boolean {
    return (
      this.getSelectedComponentSection()?.classList.contains(FULL_WIDTH_COMPONENT_CLASS) ?? false
    )
  }

  public async setSelectedComponentFullWidth(enabled: boolean): Promise<void> {
    const section = this.getSelectedComponentSection()
    if (!section) return

    section.classList.toggle(FULL_WIDTH_COMPONENT_CLASS, enabled)
    await this.handleAutoSave()
  }

  public isSelectedProductSection(): boolean {
    const section = this.getSelectedComponentSection()
    return section?.getAttribute('data-pbx-product-section') === 'true'
  }

  public getSelectedProductSectionOptions(): ProductSectionOptions {
    const section = this.getSelectedComponentSection()
    if (!section || !this.isSelectedProductSection()) {
      return { ...DEFAULT_PRODUCT_SECTION_OPTIONS }
    }
    return parseProductSectionFromElement(section)
  }

  public getSelectedProductSectionContentAvailability(): {
    hasPrices: boolean
    hasImages: boolean
    hasButtons: boolean
    hasLinks: boolean
  } {
    const section = this.getSelectedComponentSection()
    if (!section || !this.isSelectedProductSection()) {
      return { hasPrices: false, hasImages: false, hasButtons: false, hasLinks: false }
    }
    return {
      hasPrices: sectionHasProductPrices(section),
      hasImages: sectionHasProductImages(section),
      hasButtons: sectionHasProductButtons(section),
      hasLinks: sectionHasProductLinks(section),
    }
  }

  public async updateSelectedProductSection(options: ProductSectionOptions): Promise<void> {
    const section = this.getSelectedComponentSection()
    if (!section || !this.isSelectedProductSection()) return

    applyProductSectionOptionsToElement(section, options)
    await this.handleAutoSave()
  }

  /**
   * Returns true when the global page wrapper has the full-width class applied.
   */
  public isGlobalFullWidth(): boolean {
    const pagebuilder = this.getBuilderCanvasElement()
    return pagebuilder?.classList.contains(FULL_WIDTH_COMPONENT_CLASS) ?? false
  }

  /**
   * Toggles the full-width class on the page wrapper so that global background
   * colours stretch across the entire browser viewport.
   */
  public async setGlobalFullWidth(enabled: boolean): Promise<void> {
    const pagebuilder = this.getBuilderCanvasElement()
    pagebuilder?.classList.toggle(FULL_WIDTH_COMPONENT_CLASS, enabled)
    this.saveDomComponentsToLocalStorage()
    await this.handleAutoSave()
  }

  /** Returns true when the currently selected element is an `<img>`. */
  public isSelectedElementImage(): boolean {
    return this.getElement.value?.tagName === 'IMG'
  }

  public setImageSettingsModalOpen(open: boolean): void {
    this.pageBuilderStateStore.setImageSettingsPanelOpen(open)
  }

  public isImageSettingsModalOpen(): boolean {
    return this.pageBuilderStateStore.getImageSettingsPanelOpen
  }

  private findImageAspectClass(element: HTMLElement): string | null {
    const known = tailwindImage.aspectRatio.find(
      (cls) => cls !== 'none' && element.classList.contains(cls),
    )
    if (known) return known

    const arbitrary = Array.from(element.classList).find((cls) => cls.startsWith('pbx-aspect-'))
    return arbitrary ?? null
  }

  private removeImageAspectClasses(element: HTMLElement): void {
    Array.from(element.classList).forEach((cls) => {
      if (cls.startsWith('pbx-aspect-')) {
        element.classList.remove(cls)
      }
    })
  }

  public handleImageObjectFit(userSelection?: string): void {
    this.applyElementClassChanges(userSelection, tailwindImage.objectFit, 'setImageObjectFit')
  }

  public handleImageObjectPosition(userSelection?: string): void {
    this.applyElementClassChanges(
      userSelection,
      tailwindImage.objectPosition,
      'setImageObjectPosition',
    )
  }

  public handleImageAspectRatio(userSelection?: string): void {
    const element = this.getElement.value
    if (!element || element.tagName !== 'IMG') return

    if (userSelection === undefined) {
      const current = this.findImageAspectClass(element)
      this.pageBuilderStateStore.setImageAspectRatio(current || 'none')
      return
    }

    this.removeImageAspectClasses(element)

    if (userSelection !== 'none') {
      element.classList.add(userSelection)
    }

    this.pageBuilderStateStore.setImageAspectRatio(userSelection)
    this.pageBuilderStateStore.setElement(element)
  }

  public async handleImageAltText(alt?: string): Promise<void> {
    const element = this.getElement.value
    if (!element || element.tagName !== 'IMG') return

    if (alt === undefined) return

    const trimmed = alt.trim()
    if (trimmed) {
      element.setAttribute('alt', trimmed)
    } else {
      element.removeAttribute('alt')
    }

    this.pageBuilderStateStore.setElement(element)
    await this.handleAutoSave()
  }

  public getSelectedImageAltText(): string {
    const element = this.getElement.value
    if (!element || element.tagName !== 'IMG') return ''
    return element.getAttribute('alt') || ''
  }

  /**
   * Attaches click, mouseover, and mouseleave event listeners to all editable elements in the page builder.
   * @private
   */
  private addListenersToEditableElements = async () => {
    const pagebuilder = this.getBuilderCanvasElement()
    if (!pagebuilder) return

    // Wait for the next DOM update cycle to ensure all elements are rendered.
    await nextTick()

    this.attachCanvasInlineEditListeners(pagebuilder)

    let eligible = 0
    let attached = 0
    pagebuilder.querySelectorAll('section *').forEach((element) => {
      if (this.isEditableElement(element)) {
        eligible++
        const htmlElement = element as HTMLElement

        // If the element already has listeners, remove them to avoid duplicates.
        if (this.elementsWithListeners.has(htmlElement)) {
          const listeners = this.elementsWithListeners.get(htmlElement)
          if (listeners) {
            htmlElement.removeEventListener('click', listeners.click)
            htmlElement.removeEventListener('dblclick', listeners.dblclick)
            htmlElement.removeEventListener('mouseover', listeners.mouseover)
            htmlElement.removeEventListener('mouseleave', listeners.mouseleave)
          }
        }

        // Define new listener functions.
        const clickListener = (e: Event) => this.handleElementClick(e, htmlElement)
        const dblclickListener = (e: Event) => this.handleElementDoubleClick(e, htmlElement)
        const mouseoverListener = (e: Event) => this.handleMouseOver(e, htmlElement)
        const mouseleaveListener = (e: Event) => this.handleMouseLeave(e)

        // Add the new event listeners.
        htmlElement.addEventListener('click', clickListener)
        htmlElement.addEventListener('dblclick', dblclickListener)
        htmlElement.addEventListener('mouseover', mouseoverListener)
        htmlElement.addEventListener('mouseleave', mouseleaveListener)
        attached++

        // Store the new listeners in the WeakMap to track them.
        this.elementsWithListeners.set(htmlElement, {
          click: clickListener,
          dblclick: dblclickListener,
          mouseover: mouseoverListener,
          mouseleave: mouseleaveListener,
        })
      }
    })

    this.debugLog('log', 'addListenersToEditableElements(): attached listeners', {
      eligible,
      attached,
      hasSections: Boolean(pagebuilder.querySelector('section')),
    })
  }

  private attachCanvasInlineEditListeners(pagebuilder: Element): void {
    if (this.canvasClickCaptureListener) {
      pagebuilder.removeEventListener('click', this.canvasClickCaptureListener, true)
    }

    if (this.canvasDblClickCaptureListener) {
      pagebuilder.removeEventListener('dblclick', this.canvasDblClickCaptureListener, true)
    }

    this.canvasClickCaptureListener = (event: Event) => {
      void this.handleCanvasClickCapture(event)
    }
    this.canvasDblClickCaptureListener = (event: Event) => {
      void this.handleCanvasDoubleClickCapture(event)
    }

    pagebuilder.addEventListener('click', this.canvasClickCaptureListener, true)
    pagebuilder.addEventListener('dblclick', this.canvasDblClickCaptureListener, true)
  }

  public findEditableElementFromEventTarget(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof Element)) return null

    const pagebuilder = this.getBuilderCanvasElement()
    let current: Element | null = target

    while (current && current !== pagebuilder) {
      if (current instanceof HTMLElement && this.isEditableElement(current)) {
        return current
      }

      current = current.parentElement
    }

    return null
  }

  private handleCanvasClickCapture = async (e: Event): Promise<void> => {
    if (this.pageBuilderStateStore.getImageSettingsPanelOpen) return

    if (this.pageBuilderStateStore.getInlineTipTapEditor) {
      if (!this.hasInlineTipTapElement()) {
        // No inline TipTap element in the DOM — clear the stale flag.
        this.pageBuilderStateStore.setInlineTipTapEditor(false)
      } else {
        // TipTap is active. If the click is OUTSIDE the inline-editor element:
        //  1. Prevent default to stop link navigation and other browser actions.
        //  2. Close TipTap.  The document pointerdown handler may be blocked by
        //     shouldPreserveInlineEditorForToolbarPopover when toolbar popovers
        //     exist in the DOM (v-show), so we close reliably from the click event.
        const inlineEl = document.querySelector<HTMLElement>(
          '#pagebuilder [data-pbx-inline-tiptap]',
        )
        if (inlineEl && e.target instanceof Node && !inlineEl.contains(e.target)) {
          // If the click landed on an insert-section button, let its own @click handler
          // fire (don't stop propagation) but still close TipTap without selecting the
          // button element as the "next" editable target.
          const isInsertBtn =
            e.target instanceof Element && Boolean(e.target.closest('[data-pbx-insert-btn]'))
          if (!isInsertBtn) {
            e.preventDefault()
            e.stopPropagation()
          }
          const nextElement = isInsertBtn ? null : this.findEditableElementFromEventTarget(e.target)
          void this.finishActiveInlineTipTapEditorFromDom(nextElement)
        }
      }
    }
  }

  private handleCanvasDoubleClickCapture = async (e: Event): Promise<void> => {
    await this.openInlineTipTapFromEvent(e)
  }

  public async openInlineTipTapFromEvent(e: Event): Promise<void> {
    if (this.pageBuilderStateStore.getImageSettingsPanelOpen) return
    if (this.pageBuilderStateStore.getInlineTipTapEditor && !this.hasInlineTipTapElement()) {
      this.pageBuilderStateStore.setInlineTipTapEditor(false)
    }
    if (this.pageBuilderStateStore.getInlineTipTapEditor) return

    const element = this.findEditableElementFromEventTarget(e.target)
    if (!element || !this.isValidTextElement(element)) {
      if (e.target instanceof Element && (e.target.tagName === 'IMG' || e.target.closest('img'))) {
        e.stopPropagation()
      }
      return
    }

    e.preventDefault()
    e.stopPropagation()

    this.pageBuilderStateStore.setElement(element)
    this.pageBuilderStateStore.setInlineTipTapEditor(true)

    await this.openInlineTipTapForElement(element)
  }

  private hasInlineTipTapElement(): boolean {
    return Boolean(document.querySelector('#pagebuilder [data-pbx-inline-tiptap]'))
  }

  /**
   * Writes any active inline TipTap editor back to the live DOM synchronously.
   * Used before localStorage persistence and before the builder unmounts.
   */
  private commitActiveInlineTipTapEditorSync(): HTMLElement | null {
    const inlineElement = document.querySelector<HTMLElement>(
      '#pagebuilder [data-pbx-inline-tiptap]',
    )

    if (!inlineElement) return null

    const prosemirror = inlineElement.querySelector<HTMLElement>('.ProseMirror')
    const originalHtml = inlineElement.getAttribute('data-pbx-inline-original-html') ?? ''
    // Prefer the Vue store's live model (updated on every TipTap onUpdate) because
    // DOM reads from ProseMirror can lag behind the editor state in some cases.
    const modelHtml = this.pageBuilderStateStore.getTextAreaVueModel
    const htmlSource =
      typeof modelHtml === 'string' && modelHtml.trim().length > 0
        ? modelHtml
        : (prosemirror?.innerHTML ?? inlineElement.innerHTML)
    const html = finalizeInlineTipTapHtml(htmlSource, originalHtml)

    inlineElement.innerHTML = html
    inlineElement.removeAttribute('data-pbx-inline-tiptap')
    inlineElement.removeAttribute('data-pbx-inline-original-html')
    this.pageBuilderStateStore.setTextAreaVueModel(html)
    this.pageBuilderStateStore.setInlineTipTapEditor(false)

    return inlineElement
  }

  /**
   * Commits open inline editors and persists the current canvas to localStorage.
   * Call before destroying the PageBuilder component (e.g. modal v-if close).
   */
  public flushPendingEditsToLocalStorage(): void {
    this.commitActiveInlineTipTapEditorSync()
    this.saveDomComponentsToLocalStorage()
  }

  public async finishActiveInlineTipTapEditorFromDom(
    nextElement: HTMLElement | null = null,
  ): Promise<void> {
    const inlineElement = this.commitActiveInlineTipTapEditorSync()

    if (!inlineElement) {
      await this.toggleInlineTipTapEditor(false)
      return
    }

    this.pageBuilderStateStore.setElement(inlineElement)

    // Close TipTap without blocking on auto-save so the next element can be
    // selected immediately.  A single background save is fired at the end.
    await this.finishInlineTipTapEditor(inlineElement, false)

    if (nextElement && nextElement !== inlineElement) {
      // Select without triggering a second auto-save — the one below covers both.
      await this.selectEditableElement(nextElement, false)
    }

    // Persist the committed inline HTML immediately, even if autoSave is disabled.
    this.saveDomComponentsToLocalStorage()

    // If autoSave is enabled, still run it (non-blocking) so any other
    // DOM-only changes are captured by the normal pipeline.
    void this.handleAutoSave()
  }

  /**
   * Handles the click event for editable elements, setting the element as selected.
   * @param {Event} e - The click event.
   * @param {HTMLElement} element - The clicked element.
   * @private
   */
  private handleElementClick = async (e: Event, element: HTMLElement): Promise<void> => {
    if (this.pageBuilderStateStore.getImageSettingsPanelOpen) return
    if (this.pageBuilderStateStore.getInlineTipTapEditor) {
      // While TipTap is active, prevent default so links and other browser actions
      // are not triggered when the user clicks outside the inline editor.
      e.preventDefault()
      e.stopPropagation()
      return
    }

    e.preventDefault()
    e.stopPropagation()

    await this.selectEditableElement(element)
  }

  /**
   * Opens inline rich-text editing when a valid text element is double-clicked.
   * @param {Event} e - The double-click event.
   * @param {HTMLElement} element - The double-clicked element.
   * @private
   */
  private handleElementDoubleClick = async (e: Event, element: HTMLElement): Promise<void> => {
    if (this.pageBuilderStateStore.getImageSettingsPanelOpen) return
    if (this.pageBuilderStateStore.getInlineTipTapEditor) return
    if (!this.isValidTextElement(element)) {
      e.stopPropagation()
      return
    }

    e.preventDefault()
    e.stopPropagation()

    this.pageBuilderStateStore.setElement(element)
    this.pageBuilderStateStore.setInlineTipTapEditor(true)

    await this.openInlineTipTapForElement(element)

    // If the element became invalid between the check and the actual editor open
    // (e.g. DOM replaced mid-async), reset the flag so clicks are not blocked.
    if (!this.hasInlineTipTapElement()) {
      this.pageBuilderStateStore.setInlineTipTapEditor(false)
    }
  }

  private async openInlineTipTapForElement(element: HTMLElement): Promise<void> {
    if (!this.isValidTextElement(element)) return

    await this.selectEditableElement(element, false)

    await nextTick()
    await this.addListenersToEditableElements()
  }

  /**
   * Selects an editable builder element and syncs builder state.
   * @param {HTMLElement} element - The element to select.
   * @param {boolean} shouldAutoSave - Whether to autosave after selection.
   * @returns {Promise<void>}
   */
  public async selectEditableElement(
    element: HTMLElement,
    shouldAutoSave: boolean = true,
  ): Promise<void> {
    const pagebuilder = this.getBuilderCanvasElement()

    if (!pagebuilder) {
      this.debugLog('warn', 'selectEditableElement(): #pagebuilder missing; cannot select/save', {
        elementTag: element?.tagName,
        elementId: element?.id ?? null,
        key: this.getLocalStorageItemName.value,
      })
      return
    }

    this.pageBuilderStateStore.setMenuRight(true)

    const selectedElement = pagebuilder.querySelector('[selected]')
    if (selectedElement) {
      selectedElement.removeAttribute('selected')
    }

    element.removeAttribute('hovered')

    element.setAttribute('selected', '')

    this.pageBuilderStateStore.setElement(element)

    await nextTick()
    await this.initializeElementStyles()

    if (shouldAutoSave) {
      const passedConfig = this.pageBuilderStateStore.getPageBuilderConfig
      const autoSaveSetting =
        passedConfig && passedConfig.userSettings ? passedConfig.userSettings.autoSave : undefined

      // Always persist a draft snapshot on selection change. This is the lightest,
      // most reliable persistence path (DOM → localStorage) and covers edits like
      // image src changes, link href changes, and inline text edits.
      this.saveDomComponentsToLocalStorage()

      // If auto-save is enabled, also run the full auto-save pipeline (non-blocking).
      if (autoSaveSetting !== false) {
        void this.handleAutoSave()
      }
    }
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

    if (this.pageBuilderStateStore.getInlineTipTapEditor) return

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
          this.commitActiveInlineTipTapEditorSync()
          this.pageBuilderStateStore.setIsSaving(true)
          this.saveDomComponentsToLocalStorage()
          await sleep(400)
        } catch (err) {
          console.error('Error trying auto save.', err)
          this.debugLog('error', 'handleAutoSave(): error', err)
          const { showToast } = useToast()
          const { translate } = useTranslations()
          showToast(translate('Auto-save failed — please save manually'), 'error')
        } finally {
          this.pageBuilderStateStore.setIsSaving(false)
        }
      }
    }
    if (passedConfig && !passedConfig.userSettings) {
      try {
        this.commitActiveInlineTipTapEditorSync()
        this.pageBuilderStateStore.setIsSaving(true)
        this.saveDomComponentsToLocalStorage()
        await sleep(400)
      } catch (err) {
        console.error('Error trying saving.', err)
        this.debugLog('error', 'handleAutoSave(): error (no userSettings)', err)
        const { showToast } = useToast()
        const { translate } = useTranslations()
        showToast(translate('Auto-save failed — please save manually'), 'error')
      } finally {
        this.pageBuilderStateStore.setIsSaving(false)
      }
    }
  }

  /**
   * Manually saves the current page builder content to local storage.
   */
  public handleManualSave = async (doNoClearHTML?: boolean) => {
    // Sync DOM → store BEFORE toggling isSaving (re-render), otherwise Vue will
    // overwrite the user's live edits with stale store HTML on save click.
    this.commitActiveInlineTipTapEditorSync()
    await this.syncDomToStoreOnly()

    this.pageBuilderStateStore.setIsSaving(true)
    if (!doNoClearHTML) {
      this.clearHtmlSelection()
    }
    this.startEditing()
    this.saveDomComponentsToLocalStorage()
    await this.refreshListeners()
    await sleep(300)
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

    this.reportNonListenerTagClassViolations(doc)

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
    const pagebuilder = this.getBuilderCanvasElement()
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
    const targetElement = this.getActiveStyleTarget()
    this.pageBuilderStateStore.setCurrentClasses(Array.from(targetElement?.classList ?? []))
  }

  /**
   * Syncs the inline styles of the currently selected element to the state store.
   * @private
   */
  private async syncCurrentStyles() {
    const targetElement = this.getActiveStyleTarget()
    const style = targetElement?.getAttribute('style')
    if (style) {
      const stylesObject = this.parseStyleString(style)
      this.pageBuilderStateStore.setCurrentStyles(stylesObject)
    } else {
      this.pageBuilderStateStore.setCurrentStyles({})
    }
  }

  /**
   * Returns the element style/class controls should mutate.
   * In global page-design mode, always use #pagebuilder.
   */
  private getActiveStyleTarget(): HTMLElement | null {
    if (this.pageBuilderStateStore.getToggleGlobalHtmlMode) {
      const pagebuilder = this.getBuilderCanvasElement()
      if (pagebuilder) {
        if (this.getElement.value !== pagebuilder) {
          this.pageBuilderStateStore.setElement(pagebuilder)
        }
        return pagebuilder
      }
    }

    return this.getElement.value
  }

  /**
   * Adds a CSS class to the currently selected element.
   * @param {string} userSelectedClass - The class to add.
   */
  public handleAddClasses(userSelectedClass: string): void {
    const element = this.getActiveStyleTarget()

    if (
      element &&
      typeof userSelectedClass === 'string' &&
      userSelectedClass.trim() !== '' &&
      !userSelectedClass.includes(' ') &&
      // Check if class (with prefix) already exists
      !element.classList.contains('pbx-' + userSelectedClass.trim())
    ) {
      const cleanedClass = userSelectedClass.trim()

      // Add prefix if missing
      const prefixedClass = cleanedClass.startsWith('pbx-') ? cleanedClass : 'pbx-' + cleanedClass

      element.classList.add(prefixedClass)

      this.pageBuilderStateStore.setElement(element)
      this.pageBuilderStateStore.setClass(prefixedClass)
      this.pageBuilderStateStore.setCurrentClasses(Array.from(element.classList))
    }
  }

  /**
   * Adds or updates an inline style property on the currently selected element.
   * @param {string} property - The CSS property to add/update.
   * @param {string} value - The value of the CSS property.
   */
  public handleAddStyle(property: string, value: string): void {
    const element = this.getActiveStyleTarget()
    if (!element || !property || !value) return

    element.style.setProperty(property, value)
    this.pageBuilderStateStore.setElement(element)
    this.pageBuilderStateStore.setCurrentStyles(
      this.parseStyleString(element.getAttribute('style') || ''),
    )
  }

  /**
   * Removes an inline style property from the currently selected element.
   * @param {string} property - The CSS property to remove.
   */
  public handleRemoveStyle(property: string): void {
    const element = this.getActiveStyleTarget()
    if (!element || !property) return

    element.style.removeProperty(property)
    this.pageBuilderStateStore.setElement(element)

    const style = element.getAttribute('style')
    if (style) {
      this.pageBuilderStateStore.setCurrentStyles(this.parseStyleString(style))
    } else {
      this.pageBuilderStateStore.setCurrentStyles({})
    }
  }

  /**
   * Handles changes to the font family of the selected element.
   * @param {string} [userSelectedFontFamily] - The selected font family class.
   */
  public async handleFontFamily(userSelectedFontFamily?: string): Promise<void> {
    const fontClasses = getEditorFontFamilyClasses(
      this.pageBuilderStateStore.getPageBuilderConfig?.userSettings,
    )

    // Load the font dynamically if it's a Google Font
    if (userSelectedFontFamily && userSelectedFontFamily !== 'none') {
      try {
        await loadFontFromClass(userSelectedFontFamily)
      } catch (error) {
        console.error('Failed to load font:', userSelectedFontFamily, error)
        // Continue anyway - font might be available from another source
      }
    }
    this.applyElementClassChanges(userSelectedFontFamily, fontClasses, 'setFontFamily')
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
   * Removes every class that appears in any of the given arrays from the currently
   * selected element. Used to strip conflicting shorthand/directional padding or
   * margin classes before applying a new value (e.g. remove pbx-py-* when setting
   * pbx-pt-*, so the shorthand never silently overrides the directional value).
   */
  private purgeConflictingClasses(conflictArrays: string[][]): void {
    const el = this.getActiveStyleTarget()
    if (!el) return

    const buttonAnchor = this.resolveNestedButtonAnchorTarget(el, {
      forBorderRadius: false,
      forColor: false,
      forPadding: true,
      classArray: conflictArrays.flat(),
    })
    // Purge on the visual target only. For product CTAs, the wrapper may keep
    // outer spacing (e.g. pbx-pt-3) while the <a> owns the pill padding.
    const target = buttonAnchor ?? el

    conflictArrays.forEach((arr) => {
      arr.forEach((cls) => {
        if (cls !== 'none' && target.classList.contains(cls)) {
          target.classList.remove(cls)
        }
      })
    })
  }

  /**
   * Handles changes to the vertical padding of the selected element.
   * py-* shorthand: also clear individual pt-* and pb-* so they don't override.
   */
  public handleVerticalPadding(userSelectedVerticalPadding?: string): void {
    if (userSelectedVerticalPadding !== undefined) {
      this.purgeConflictingClasses([
        tailwindPaddingAndMargin.topPadding,
        tailwindPaddingAndMargin.bottomPadding,
      ])
    }
    this.applyElementClassChanges(
      userSelectedVerticalPadding,
      tailwindPaddingAndMargin.verticalPadding,
      'setFontVerticalPadding',
    )
  }
  /**
   * Handles changes to the horizontal padding of the selected element.
   * px-* shorthand: also clear individual pl-* and pr-* so they don't override.
   */
  public handleHorizontalPadding(userSelectedHorizontalPadding?: string): void {
    if (userSelectedHorizontalPadding !== undefined) {
      this.purgeConflictingClasses([
        tailwindPaddingAndMargin.leftPadding,
        tailwindPaddingAndMargin.rightPadding,
      ])
    }
    this.applyElementClassChanges(
      userSelectedHorizontalPadding,
      tailwindPaddingAndMargin.horizontalPadding,
      'setFontHorizontalPadding',
    )
  }
  /**
   * Handles changes to the top padding of the selected element.
   * pt-*: also clear py-* shorthand which also sets padding-top.
   */
  public handleTopPadding(userSelectedTopPadding?: string): void {
    if (userSelectedTopPadding !== undefined) {
      this.purgeConflictingClasses([tailwindPaddingAndMargin.verticalPadding])
    }
    this.applyElementClassChanges(
      userSelectedTopPadding,
      tailwindPaddingAndMargin.topPadding,
      'setFontTopPadding',
    )
  }
  /**
   * Handles changes to the right padding of the selected element.
   * pr-*: also clear px-* shorthand which also sets padding-right.
   */
  public handleRightPadding(userSelectedRightPadding?: string): void {
    if (userSelectedRightPadding !== undefined) {
      this.purgeConflictingClasses([tailwindPaddingAndMargin.horizontalPadding])
    }
    this.applyElementClassChanges(
      userSelectedRightPadding,
      tailwindPaddingAndMargin.rightPadding,
      'setFontRightPadding',
    )
  }
  /**
   * Handles changes to the bottom padding of the selected element.
   * pb-*: also clear py-* shorthand which also sets padding-bottom.
   */
  public handleBottomPadding(userSelectedBottomPadding?: string): void {
    if (userSelectedBottomPadding !== undefined) {
      this.purgeConflictingClasses([tailwindPaddingAndMargin.verticalPadding])
    }
    this.applyElementClassChanges(
      userSelectedBottomPadding,
      tailwindPaddingAndMargin.bottomPadding,
      'setFontBottomPadding',
    )
  }
  /**
   * Handles changes to the left padding of the selected element.
   * pl-*: also clear px-* shorthand which also sets padding-left.
   */
  public handleLeftPadding(userSelectedLeftPadding?: string): void {
    if (userSelectedLeftPadding !== undefined) {
      this.purgeConflictingClasses([tailwindPaddingAndMargin.horizontalPadding])
    }
    this.applyElementClassChanges(
      userSelectedLeftPadding,
      tailwindPaddingAndMargin.leftPadding,
      'setFontLeftPadding',
    )
  }

  /**
   * Handles changes to the vertical margin of the selected element.
   * my-* shorthand: also clear individual mt-* and mb-*.
   */
  public handleVerticalMargin(userSelectedVerticalMargin?: string): void {
    if (userSelectedVerticalMargin !== undefined) {
      this.purgeConflictingClasses([
        tailwindPaddingAndMargin.topMargin,
        tailwindPaddingAndMargin.bottomMargin,
      ])
    }
    this.applyElementClassChanges(
      userSelectedVerticalMargin,
      tailwindPaddingAndMargin.verticalMargin,
      'setFontVerticalMargin',
    )
  }
  /**
   * Handles changes to the horizontal margin of the selected element.
   * mx-* shorthand: also clear individual ml-* and mr-*.
   */
  public handleHorizontalMargin(userSelectedHorizontalMargin?: string): void {
    if (userSelectedHorizontalMargin !== undefined) {
      this.purgeConflictingClasses([
        tailwindPaddingAndMargin.leftMargin,
        tailwindPaddingAndMargin.rightMargin,
      ])
    }
    this.applyElementClassChanges(
      userSelectedHorizontalMargin,
      tailwindPaddingAndMargin.horizontalMargin,
      'setFontHorizontalMargin',
    )
  }
  /**
   * Handles changes to the top margin of the selected element.
   * mt-*: also clear my-* shorthand.
   */
  public handleTopMargin(userSelectedTopMargin?: string): void {
    if (userSelectedTopMargin !== undefined) {
      this.purgeConflictingClasses([tailwindPaddingAndMargin.verticalMargin])
    }
    this.applyElementClassChanges(
      userSelectedTopMargin,
      tailwindPaddingAndMargin.topMargin,
      'setFontTopMargin',
    )
  }
  /**
   * Handles changes to the right margin of the selected element.
   * mr-*: also clear mx-* shorthand.
   */
  public handleRightMargin(userSelectedRightMargin?: string): void {
    if (userSelectedRightMargin !== undefined) {
      this.purgeConflictingClasses([tailwindPaddingAndMargin.horizontalMargin])
    }
    this.applyElementClassChanges(
      userSelectedRightMargin,
      tailwindPaddingAndMargin.rightMargin,
      'setFontRightMargin',
    )
  }
  /**
   * Handles changes to the bottom margin of the selected element.
   * mb-*: also clear my-* shorthand.
   */
  public handleBottomMargin(userSelectedBottomMargin?: string): void {
    if (userSelectedBottomMargin !== undefined) {
      this.purgeConflictingClasses([tailwindPaddingAndMargin.verticalMargin])
    }
    this.applyElementClassChanges(
      userSelectedBottomMargin,
      tailwindPaddingAndMargin.bottomMargin,
      'setFontBottomMargin',
    )
  }
  /**
   * Handles changes to the left margin of the selected element.
   * ml-*: also clear mx-* shorthand.
   */
  public handleLeftMargin(userSelectedLeftMargin?: string): void {
    if (userSelectedLeftMargin !== undefined) {
      this.purgeConflictingClasses([tailwindPaddingAndMargin.horizontalMargin])
    }
    this.applyElementClassChanges(
      userSelectedLeftMargin,
      tailwindPaddingAndMargin.leftMargin,
      'setFontLeftMargin',
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
    const element = this.getActiveStyleTarget()
    if (!element) return

    const buttonAnchorTarget = this.resolveNestedButtonAnchorTarget(element, {
      forBorderRadius: false,
      forColor: true,
      classArray: tailwindColors.backgroundColorVariables,
    })
    const colorTarget = buttonAnchorTarget ?? element

    if (color === undefined) {
      const customColor = colorTarget.style.getPropertyValue('background-color')
      if (customColor) {
        this.pageBuilderStateStore.setBackgroundColor(
          `custom:${normalizeCssColorToHex(customColor) ?? customColor}`,
        )
        return
      }
    } else {
      colorTarget.style.removeProperty('background-color')
    }

    this.applyElementClassChanges(
      color,
      tailwindColors.backgroundColorVariables,
      'setBackgroundColor',
    )
  }

  public handleCustomBackgroundColor(color: string): void {
    const element = this.getActiveStyleTarget()
    if (!element || !color) return

    const buttonAnchorTarget = this.resolveNestedButtonAnchorTarget(element, {
      forBorderRadius: false,
      forColor: true,
      classArray: tailwindColors.backgroundColorVariables,
    })
    const colorTarget = buttonAnchorTarget ?? element

    this.removeElementClassesFromArray(colorTarget, tailwindColors.backgroundColorVariables)
    colorTarget.style.setProperty('background-color', color)
    this.pageBuilderStateStore.setBackgroundColor(`custom:${color}`)
    this.pageBuilderStateStore.setElement(element)
    this.pageBuilderStateStore.setCurrentClasses(Array.from(colorTarget.classList))
    this.pageBuilderStateStore.setCurrentStyles(
      this.parseStyleString(colorTarget.getAttribute('style') || ''),
    )

    if (element === this.getBuilderCanvasElement()) {
      this.syncGlobalPageSettingsIntoRuntimeConfig()
    }
  }

  /**
   * Handles changes to the text color of the selected element.
   * @param {string} [color] - The selected text color class.
   */
  public handleTextColor(color?: string): void {
    const element = this.getActiveStyleTarget()
    if (!element) return

    const buttonAnchorTarget = this.resolveNestedButtonAnchorTarget(element, {
      forBorderRadius: false,
      forColor: true,
      classArray: tailwindColors.textColorVariables,
    })
    const colorTarget = buttonAnchorTarget ?? element

    if (color === undefined) {
      const customColor = colorTarget.style.getPropertyValue('color')
      if (customColor) {
        this.pageBuilderStateStore.setTextColor(
          `custom:${normalizeCssColorToHex(customColor) ?? customColor}`,
        )
        return
      }
    } else {
      colorTarget.style.removeProperty('color')
    }

    this.applyElementClassChanges(color, tailwindColors.textColorVariables, 'setTextColor')
  }

  public handleCustomTextColor(color: string): void {
    const element = this.getActiveStyleTarget()
    if (!element || !color) return

    const buttonAnchorTarget = this.resolveNestedButtonAnchorTarget(element, {
      forBorderRadius: false,
      forColor: true,
      classArray: tailwindColors.textColorVariables,
    })
    const colorTarget = buttonAnchorTarget ?? element

    this.removeElementClassesFromArray(colorTarget, tailwindColors.textColorVariables)
    colorTarget.style.setProperty('color', color)
    this.pageBuilderStateStore.setTextColor(`custom:${color}`)
    this.pageBuilderStateStore.setElement(element)
    this.pageBuilderStateStore.setCurrentClasses(Array.from(colorTarget.classList))
    this.pageBuilderStateStore.setCurrentStyles(
      this.parseStyleString(colorTarget.getAttribute('style') || ''),
    )
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
    const pagebuilder = this.getBuilderCanvasElement()
    if (pagebuilder) {
      // Remove all section elements (assuming each component is a <section>)
      pagebuilder
        .querySelectorAll('section[data-componentid]')
        .forEach((section) => section.remove())
    }
  }

  public async undo() {
    this.pageBuilderStateStore.setIsLoadingGlobal(true)
    await sleep(300)
    const baseKey = this.getHistoryBaseKey()
    if (!baseKey) return

    const history = LocalStorageManager.getHistory(baseKey)
    if (history.length > 1 && this.pageBuilderStateStore.getHistoryIndex > 0) {
      this.pageBuilderStateStore.setHistoryIndex(this.pageBuilderStateStore.getHistoryIndex - 1)
      const data = history[this.pageBuilderStateStore.getHistoryIndex] as {
        components: BuilderResourceData
        pageSettings?: PageSettings
      }
      const htmlString = this.renderComponentsToHtml(data.components)
      await this.mountComponentsToDOM(htmlString, false, data.pageSettings)
    }
    this.pageBuilderStateStore.setIsLoadingGlobal(false)
  }

  public async redo() {
    this.pageBuilderStateStore.setIsLoadingGlobal(true)
    await sleep(300)
    const baseKey = this.getHistoryBaseKey()
    if (!baseKey) return

    const history = LocalStorageManager.getHistory(baseKey)
    if (history.length > 0 && this.pageBuilderStateStore.getHistoryIndex < history.length - 1) {
      this.pageBuilderStateStore.setHistoryIndex(this.pageBuilderStateStore.getHistoryIndex + 1)
      const data = history[this.pageBuilderStateStore.getHistoryIndex] as {
        components: BuilderResourceData
        pageSettings?: PageSettings
      }
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
  /**
   * Finds the first two-column layout container inside the selected section.
   * Matches flex-row containers (including responsive variants like lg:pbx-flex-row)
   * AND grid containers with a grid-cols-2 class, in each case requiring exactly
   * two direct element children.  Returns the container or null.
   */
  public findReverseableContainer(): HTMLElement | null {
    const section = this.getSelectedComponentSection()
    if (!section) return null

    const twoColumnSelectors = [
      '[class*="flex-row"]',
      '[class*="pbx-flex-row"]',
      '[class*="grid-cols-2"]',
      '[class*="pbx-grid-cols-2"]',
    ]

    for (const selector of twoColumnSelectors) {
      const candidates = Array.from(section.querySelectorAll(selector)) as HTMLElement[]
      for (const candidate of candidates) {
        const children = Array.from(candidate.children).filter((el) => el instanceof HTMLElement)
        if (children.length === 2) {
          return candidate
        }
      }
    }

    return null
  }

  /**
   * Reverses the visual order of a two-column layout by physically swapping the
   * two direct children of the detected container.  This works for both flex-row
   * and grid-cols-2 layouts and naturally toggles on repeated clicks.
   * Persists the change to the store and localStorage.
   */
  public async reverseComponentLayout(): Promise<void> {
    const container = this.findReverseableContainer()
    if (!container) return

    const children = Array.from(container.children) as HTMLElement[]
    if (children.length !== 2) return

    // insertBefore(second, first) moves second in front of first — one DOM call,
    // works for both flex and grid, and re-clicking swaps them back.
    container.insertBefore(children[1], children[0])

    // Sync the DOM change back to the store and persist.
    await this.syncDomToStoreOnly()
    await nextTick()
    this.saveDomComponentsToLocalStorage()
    await this.handleAutoSave()

    // The swap moves DOM nodes so all event listeners are detached.
    // Clear the stale selection and re-attach listeners so the component
    // remains fully editable after the reversal.
    this.pageBuilderStateStore.setComponent(null)
    this.pageBuilderStateStore.setElement(null)
    await this.clearHtmlSelection()
    await nextTick()
    await this.addListenersToEditableElements()
  }

  public async duplicateComponent() {
    // Sync latest DOM changes to the store
    await this.syncDomToStoreOnly()
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

    await this.setComponentsPreservingPageSettings(newComponents)

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
    await this.syncDomToStoreOnly()
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

    await this.setComponentsPreservingPageSettings(newComponents)

    // Wait for the DOM to update before re-attaching event listeners.
    await nextTick()
    await this.addListenersToEditableElements()

    this.pageBuilderStateStore.setComponent(null)
    this.pageBuilderStateStore.setElement(null)

    // Trigger an auto-save after deletion.
    await this.handleAutoSave()
  }

  /**
   * Duplicates the currently selected element and inserts the copy immediately
   * after it in the DOM, then syncs the change to the store.
   */
  public async duplicateElementInDOM() {
    const element = this.getElement.value
    if (!element || !element.parentNode) return

    element.removeAttribute('selected')

    const clone = element.cloneNode(true) as HTMLElement

    element.parentNode.insertBefore(clone, element.nextSibling)

    await this.syncDomToStoreOnly()
    await this.addListenersToEditableElements()

    this.pageBuilderStateStore.setComponent(null)
    this.pageBuilderStateStore.setElement(null)

    this.saveDomComponentsToLocalStorage()
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

      if (parentSection && this.isSectionEmpty(parentSection)) {
        parentSection.remove()
      }

      await this.syncDomToStoreOnly()
      this.saveDomComponentsToLocalStorage()
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
    const element = this.getActiveStyleTarget()

    // remove selected class from element
    if (element?.classList.contains(userSelectedClass)) {
      element.classList.remove(userSelectedClass)

      this.pageBuilderStateStore.setElement(element)
      this.pageBuilderStateStore.removeClass(userSelectedClass)
      this.pageBuilderStateStore.setCurrentClasses(Array.from(element.classList))
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
        scrollContainerToCenterElement(pageBuilderWrapper, movedComponentElement)

        // Remove highlights after the animation completes
        window.setTimeout(() => {
          movedComponentElement.classList.remove('pbx-reorder-highlight')
          if (prevSibling && prevSibling.tagName === 'SECTION') {
            prevSibling.classList.remove('pbx-sibling-highlight')
          }
          if (nextSibling && nextSibling.tagName === 'SECTION') {
            nextSibling.classList.remove('pbx-sibling-highlight')
          }
        }, 280)
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
   * Checks whether an element can be edited with inline TipTap (no images/div-only children).
   * @param {HTMLElement | null | undefined} element - The element to validate.
   * @returns {boolean} True when inline rich-text editing is allowed.
   */
  public isValidTextElement(element: HTMLElement | null | undefined): boolean {
    if (!element) return false

    if (element.hasAttribute('data-pb-no-inline-text')) return false

    if (element.tagName === 'IMG' || element.firstElementChild?.tagName === 'IFRAME') {
      return false
    }

    if (element.querySelector('img')) return false

    if (
      element.classList.contains('pbx-product-card-image') ||
      element.classList.contains('product-card-image')
    ) {
      return false
    }

    const childElements = element.children
    if (!childElements.length) return false

    let reachedElseStatement = false

    Array.from(childElements).forEach((child) => {
      if (child.tagName === 'IMG' || child.tagName === 'DIV') {
        reachedElseStatement = false
      } else {
        reachedElseStatement = true
      }
    })

    return reachedElseStatement
  }

  /**
   * Checks if the selected element is a valid text container (i.e., does not contain images or divs).
   * @returns {boolean} True if it's a valid text element, otherwise false.
   */
  public isSelectedElementValidText(): boolean {
    return this.isValidTextElement(this.getElement.value)
  }

  /**
   * Generates a preview of the current page design.
   */
  public previewCurrentDesign() {
    this.pageBuilderStateStore.setElement(null)

    const pagebuilder = this.getBuilderCanvasElement()
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
   * Returns section elements to persist from #pagebuilder.
   * Prefer sections with data-componentid, but fall back to top-level sections
   * so close/reopen cannot wipe content when ids are temporarily missing.
   */
  private getPersistableSections(pagebuilder: Element): HTMLElement[] {
    const withIds = Array.from(
      pagebuilder.querySelectorAll('section[data-componentid]'),
    ) as HTMLElement[]
    if (withIds.length > 0) return withIds

    const allSections = Array.from(pagebuilder.querySelectorAll('section')) as HTMLElement[]
    return allSections.filter(
      (section) =>
        !section.parentElement || section.parentElement.tagName.toLowerCase() !== 'section',
    )
  }

  /**
   * Syncs the current DOM state of components to the in-memory store.
   * @private
   */
  public async syncDomToStoreOnly(): Promise<void> {
    const pagebuilder = this.getBuilderCanvasElement()
    if (!pagebuilder) return

    const componentsToSave: { html_code: string; id: string | null; title: string }[] = []

    const persistableSections = this.getPersistableSections(pagebuilder)
    persistableSections.forEach((section) => {
      const sanitizedSection = this.cloneAndRemoveSelectionAttributes(section as HTMLElement)
      if (!sanitizedSection.getAttribute('data-componentid')) {
        sanitizedSection.setAttribute('data-componentid', uuidv4())
      }
      if (!sanitizedSection.getAttribute('data-component-title')) {
        sanitizedSection.setAttribute('data-component-title', 'Untitled Component')
      }
      componentsToSave.push({
        html_code: sanitizedSection.outerHTML,
        id: sanitizedSection.getAttribute('data-componentid'),
        title: sanitizedSection.getAttribute('data-component-title') || 'Untitled Component',
      })
    })

    await this.setComponentsPreservingPageSettings(componentsToSave)
  }

  public async generateHtmlFromComponents(): Promise<string> {
    await this.syncDomToStoreOnly()
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

  public async generateFullPageHtml(): Promise<string> {
    await this.syncDomToStoreOnly()
    await nextTick()

    const components = this.pageBuilderStateStore.getComponents

    if (!Array.isArray(components)) {
      return ''
    }

    // Wait for Vue to finish DOM updates before attaching event listeners. This ensure elements exist in the DOM.
    await nextTick()
    // Attach event listeners to all editable elements in the Builder
    await this.addListenersToEditableElements()

    const pageSettings = this.readCurrentPageSettings() ?? this._lastKnownPageSettings
    const pagebuilder = document.createElement('div')
    pagebuilder.setAttribute('id', 'pagebuilder')

    if (pageSettings?.classes) {
      pagebuilder.setAttribute('class', pageSettings.classes)
    }

    if (pageSettings?.style) {
      const styleValue =
        typeof pageSettings.style === 'string'
          ? pageSettings.style
          : this.convertStyleObjectToString(pageSettings.style) || ''
      if (styleValue) pagebuilder.setAttribute('style', styleValue)
    }

    applyPageMetaToElement(pagebuilder, pageMetaFromPageSettings(pageSettings))

    components.forEach((comp) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(comp.html_code, 'text/html')
      const section = doc.querySelector('section')

      if (section) {
        section.removeAttribute('data-componentid')
        pagebuilder.appendChild(document.importNode(section, true))
        return
      }

      pagebuilder.insertAdjacentHTML('beforeend', comp.html_code)
    })

    return pagebuilder.outerHTML
  }

  /**
   * Saves the current DOM state of components to local storage.
   * @private
   */
  private saveDomComponentsToLocalStorage() {
    this.commitActiveInlineTipTapEditorSync()
    // IMPORTANT: Do not continuously recompute the storage key while editing.
    // If the key changes between "save" and "reopen", the builder will load from
    // a different key and it will look like the draft never persisted.
    // Only compute a key if one doesn't exist yet.
    if (!this.getLocalStorageItemName.value) {
      this.updateLocalStorageItemName()
    }
    const resolvedKey = this.getLocalStorageItemName.value
    if (!resolvedKey) {
      this.debugLog('warn', 'saveDomComponentsToLocalStorage(): no storage key resolved', {
        config: this.pageBuilderStateStore.getPageBuilderConfig ?? null,
      })
    }
    const pagebuilder = this.getBuilderCanvasElement()
    if (!pagebuilder) {
      this.debugLog('warn', 'saveDomComponentsToLocalStorage(): no #pagebuilder in DOM', {
        key: resolvedKey,
      })
      return
    }

    const hoveredElement = pagebuilder.querySelector('[hovered]')
    if (hoveredElement) {
      hoveredElement.removeAttribute('hovered')
    }

    const componentsToSave: { html_code: string; title: string }[] = []

    const persistableSections = this.getPersistableSections(pagebuilder)
    persistableSections.forEach((section) => {
      const sanitizedSection = this.cloneAndRemoveSelectionAttributes(section as HTMLElement)

      // Remove the data-componentid attribute
      sanitizedSection.removeAttribute('data-componentid')
      if (!sanitizedSection.getAttribute('data-component-title')) {
        sanitizedSection.setAttribute('data-component-title', 'Untitled Component')
      }

      componentsToSave.push({
        html_code: sanitizedSection.outerHTML,
        title: sanitizedSection.getAttribute('data-component-title') || 'Untitled Component',
      })
    })
    this.debugLog('warn', 'saveDomComponentsToLocalStorage(): collected sections', {
      key: resolvedKey,
      sections: componentsToSave.length,
      hasSelected: Boolean(pagebuilder.querySelector('[selected]')),
      hasInlineTipTap: Boolean(pagebuilder.querySelector('[data-pbx-inline-tiptap]')),
    })

    const livePageSettings: PageSettings | null = pagebuilder
      ? {
          classes: pagebuilder.className || '',
          style: pagebuilder.getAttribute('style') || pagebuilder.style.cssText || '',
          meta: readPageMetaFromElement(pagebuilder as HTMLElement),
        }
      : null

    const pageSettings = livePageSettings ??
      this.readCurrentPageSettings() ??
      this._lastKnownPageSettings ?? {
        classes: '',
        style: '',
      }

    // Persist page settings into the in-memory config so Vue bindings can use it.
    // Without this, PageBuilder.vue's :class binding on #pagebuilder will overwrite
    // the DOM class/style on each reopen.
    const currentConfig = this.pageBuilderStateStore.getPageBuilderConfig
    if (currentConfig && typeof currentConfig === 'object') {
      this.pageBuilderStateStore.setPageBuilderConfig({
        ...(currentConfig as Record<string, unknown>),
        pageSettings,
      } as never)
    }

    this.debugLog('warn', 'saveDomComponentsToLocalStorage(): pageSettings snapshot', {
      classes: pageSettings?.classes ?? '',
      style:
        typeof pageSettings?.style === 'string'
          ? pageSettings.style
          : pageSettings?.style
            ? this.convertStyleObjectToString(pageSettings.style)
            : '',
    })

    const dataToSave = {
      components: componentsToSave,
      pageBuilderContentSavedAt: new Date().toISOString(),
      pageSettings,
    }

    const baseKey = this.getHistoryBaseKey()

    if (baseKey) {
      const currentDataRaw = localStorage.getItem(baseKey)
      this.debugLog('warn', 'saveDomComponentsToLocalStorage(): existing key?', {
        baseKey,
        hasExisting: Boolean(currentDataRaw),
      })

      // Always write the latest DOM snapshot. We previously only wrote when we
      // detected a structural diff, but that can miss TipTap edits due to
      // sanitization/normalization differences. History deduping below still
      // prevents redundant undo states.
      try {
        localStorage.setItem(baseKey, JSON.stringify(dataToSave))
      } catch (err) {
        this.debugLog('error', 'saveDomComponentsToLocalStorage(): localStorage.setItem failed', {
          baseKey,
          err,
        })
        return
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
          this.debugLog('error', 'saveDomComponentsToLocalStorage(): wrote draft', {
            baseKey,
            sections: dataToSave.components.length,
          })
          let history = LocalStorageManager.getHistory(baseKey)

          const lastState = history[history.length - 1] as
            | { components: unknown; pageSettings: unknown }
            | undefined
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
   * By default, global page settings (classes / inline styles on the wrapper)
   * are reset so a brand-new resource starts clean after submit.
   *
   * Pass `{ preservePageSettings: true }` when you want "remove all components"
   * behavior that keeps wrapper classes/styles.
   * @returns {Promise<void>}
   */
  public async handleFormSubmission(options?: { preservePageSettings?: boolean }) {
    const preservePageSettings = options?.preservePageSettings ?? false

    // Capture global page settings BEFORE clearing storage so they are not lost.
    const savedPageSettings = this.readCurrentPageSettings()

    // Keep an in-memory copy so the current session can restore them when the
    // first new component is added after a delete-all (at that point the DOM may
    // have no #pagebuilder element left to read from).
    if (savedPageSettings && preservePageSettings) {
      this._lastKnownPageSettings = savedPageSettings
    } else if (!preservePageSettings) {
      this._lastKnownPageSettings = null
    }

    await this.removeCurrentComponentsFromLocalStorage()
    this.deleteAllComponentsFromDOM()
    this.pageBuilderStateStore.setComponents([])

    if (!preservePageSettings) {
      const pagebuilder = this.getBuilderCanvasElement()
      pagebuilder?.removeAttribute('class')
      pagebuilder?.removeAttribute('style')
      if (pagebuilder) {
        applyPageMetaToElement(pagebuilder, { title: '', description: '' })
      }

      const currentConfig = this.pageBuilderStateStore.getPageBuilderConfig
      if (currentConfig && typeof currentConfig === 'object') {
        this.pageBuilderStateStore.setPageBuilderConfig({
          ...(currentConfig as Record<string, unknown>),
          pageSettings: { classes: '', style: '', meta: { title: '', description: '' } },
        } as never)
      }
    }

    // Re-persist the page settings with an empty component list so that global
    // styles (font, background, etc.) survive the next startBuilder call.
    if (savedPageSettings && preservePageSettings) {
      this.updateLocalStorageItemName()
      const key = this.getLocalStorageItemName.value
      if (key) {
        const dataToSave = {
          components: [],
          pageBuilderContentSavedAt: new Date().toISOString(),
          pageSettings: savedPageSettings,
        }
        localStorage.setItem(key, JSON.stringify(dataToSave))
      }
    }
  }

  /**
   * Reads the current page settings.
   * Prioritises the live #pagebuilder element (always current) and falls back to localStorage.
   */
  private readCurrentPageSettings(): PageSettings | null {
    const persistedPageSettings = this.readPersistedPageSettingsFromLocalStorage()

    // The live DOM is always the most up-to-date source — read it first.
    const pagebuilder = this.getBuilderCanvasElement()
    if (pagebuilder) {
      const domSettings: PageSettings = {
        classes: pagebuilder.className || '',
        style: pagebuilder.getAttribute('style') || pagebuilder.style.cssText || '',
        meta: readPageMetaFromElement(pagebuilder),
      }

      const domStyle =
        typeof domSettings.style === 'string'
          ? domSettings.style.trim()
          : this.convertStyleObjectToString(domSettings.style).trim()

      const persistedStyle =
        persistedPageSettings && typeof persistedPageSettings.style === 'string'
          ? persistedPageSettings.style.trim()
          : this.convertStyleObjectToString(persistedPageSettings?.style).trim()

      const normalizeClasses = (value: string | undefined): string[] =>
        (value || '')
          .split(/\s+/)
          .map((token) => token.trim())
          .filter(Boolean)

      const domClassTokens = normalizeClasses(domSettings.classes)
      const persistedClassTokens = normalizeClasses(persistedPageSettings?.classes)
      const domClassString = domClassTokens.join(' ')
      const persistedClassString = persistedClassTokens.join(' ')
      const domHasBackgroundClass = domClassTokens.some((token) => token.startsWith('pbx-bg-'))
      const classesChanged = domClassString !== persistedClassString
      const domLooksLikeIntentionalClassEdit =
        classesChanged &&
        (domHasBackgroundClass || domClassTokens.length >= persistedClassTokens.length)
      const domClassesAreSubsetOfPersisted =
        domClassTokens.length > 0 &&
        domClassTokens.every((token) => persistedClassTokens.includes(token))
      const persistedHasAdditionalClasses = persistedClassTokens.length > domClassTokens.length
      const persistedHasClassChanges = classesChanged && persistedClassTokens.length > 0
      const shouldUsePersistedClassFallback =
        !domStyle &&
        persistedHasClassChanges &&
        domClassesAreSubsetOfPersisted &&
        persistedHasAdditionalClasses
      const isGlobalDesignMode = this.pageBuilderStateStore.getToggleGlobalHtmlMode
      const configPageSettings = this.pageBuilderStateStore.getPageBuilderConfig?.pageSettings
      const configStyle =
        typeof configPageSettings?.style === 'string'
          ? configPageSettings.style.trim()
          : this.convertStyleObjectToString(configPageSettings?.style).trim()
      const configClassString = normalizeClasses(configPageSettings?.classes).join(' ')
      const domMatchesConfigClasses = domClassString === configClassString
      const configWantsNoInlineStyle = !configStyle

      // On v-if modal reopen, Vue can render a fresh wrapper with default class and no
      // style before mountComponentsToDOM runs. In that case prefer persisted settings
      // so global page styles (background, etc.) are not dropped between open/close.
      if (!domStyle && (persistedStyle || shouldUsePersistedClassFallback)) {
        // In active Page Design mode, class/style clearing is intentional and should
        // not be overwritten by stale persisted inline styles.
        if (isGlobalDesignMode && configWantsNoInlineStyle && domMatchesConfigClasses) {
          return {
            classes: domSettings.classes,
            style: '',
            meta: domSettings.meta || persistedPageSettings?.meta,
          }
        }

        if (domLooksLikeIntentionalClassEdit) {
          return {
            classes: domSettings.classes,
            style: '',
            meta: domSettings.meta || persistedPageSettings?.meta,
          }
        }

        return {
          classes: persistedPageSettings?.classes || domSettings.classes || '',
          style: persistedPageSettings?.style || '',
          meta: domSettings.meta || persistedPageSettings?.meta,
        }
      }

      return domSettings
    }

    // Backward-compatible fallback for callers/tests that only mount content wrappers.
    const contentEl = document.querySelector('[data-pagebuilder-content]') as HTMLElement | null
    if (contentEl) {
      return {
        classes: contentEl.className || '',
        style: contentEl.getAttribute('style') || contentEl.style.cssText || '',
      }
    }

    // No live page element exists — fall back to the last persisted localStorage value.
    return persistedPageSettings
  }

  private readPersistedPageSettingsFromLocalStorage(): PageSettings | null {
    this.updateLocalStorageItemName()
    const key = this.getLocalStorageItemName.value
    if (!key) return null

    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null

      const parsed = JSON.parse(raw)
      if (!parsed?.pageSettings) return null

      return parsed.pageSettings as PageSettings
    } catch {
      // Ignore parse errors.
      return null
    }
  }

  /** Applies captured global page classes/styles to the page wrapper once. */
  private applyPageSettingsToPage(pageSettings: PageSettings): void {
    const pagebuilder = this.getBuilderCanvasElement()
    if (pagebuilder) {
      if (pageSettings.classes) pagebuilder.setAttribute('class', pageSettings.classes)
      else pagebuilder.removeAttribute('class')
      const styleValue =
        typeof pageSettings.style === 'string'
          ? pageSettings.style
          : this.convertStyleObjectToString(pageSettings.style) || ''
      if (styleValue) pagebuilder.setAttribute('style', styleValue)
      else pagebuilder.removeAttribute('style')
      applyPageMetaToElement(pagebuilder, pageMetaFromPageSettings(pageSettings))
    }

    // Page settings used to be copied to every content wrapper. Clear those legacy
    // attributes so padding/background do not repeat around each component.
    document.querySelectorAll('[data-pagebuilder-content]').forEach((el) => {
      el.removeAttribute('class')
      el.removeAttribute('style')
    })

    if (pageSettings.classes || pageSettings.style || pageSettings.meta) {
      this._lastKnownPageSettings = pageSettings
    }
  }

  /** Reconnects the global-styles MutationObserver after a Vue remount replaces nodes. */
  private reconnectGlobalStylesObserver(): void {
    if (!this.globalStylesObserver) return

    const pagebuilder = this.getBuilderCanvasElement()
    if (!pagebuilder) return

    this.globalStylesObserver.disconnect()
    this.globalStylesObserver = new MutationObserver(() => {
      const current = this.readCurrentPageSettings()
      if (current) {
        this._lastKnownPageSettings = current
      }
    })
    this.globalStylesObserver.observe(pagebuilder, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-meta-title', 'data-meta-description'],
    })
  }

  /**
   * Updates the component store and re-renders the page without losing global page
   * styles on #pagebuilder. Settings must be captured before the remount and
   * re-applied after Vue renders.
   */
  private async setComponentsPreservingPageSettings(components: ComponentObject[]): Promise<void> {
    const pageSettings = this.readCurrentPageSettings() ?? this._lastKnownPageSettings ?? null

    const shouldReconnectObserver = this.globalStylesObserver !== null
    this.globalStylesObserver?.disconnect()

    this.pageBuilderStateStore.setComponents(components)

    await nextTick()
    await nextTick()

    if (pageSettings && (pageSettings.classes || pageSettings.style)) {
      this.applyPageSettingsToPage(pageSettings)
    }

    if (shouldReconnectObserver) {
      this.reconnectGlobalStylesObserver()
    }
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
   * Re-attaches click/hover listeners to any newly added DOM elements.
   * Call this after programmatically inserting elements into the builder canvas.
   */
  public async refreshListeners(): Promise<void> {
    await nextTick()
    await this.addListenersToEditableElements()
    // Re-apply config page settings if the canvas is missing its inline styles.
    // This covers the v-if modal reopen where #pagebuilder is freshly rendered by
    // Vue with only its :class binding (no style attribute applied yet).
    this.reapplyConfigPageSettingsIfMissing()
  }

  /**
   * Applies config-provided pageSettings.style to #pagebuilder when the element
   * has no inline style attribute.  Safe to call on every canvas refresh because
   * the guard `!domStyle` means user-edited styles are never overwritten.
   */
  private reapplyConfigPageSettingsIfMissing(): void {
    const pagebuilder = this.getBuilderCanvasElement()
    if (!pagebuilder) return
    const configSettings = this.pageBuilderStateStore.getPageBuilderConfig?.pageSettings ?? null
    if (!this.hasMeaningfulPageSettings(configSettings)) return
    const configStyleStr = this.convertStyleObjectToString(configSettings.style)
    const domStyle = pagebuilder.getAttribute('style') || ''
    if (configStyleStr.trim() && !domStyle.trim()) {
      this.applyPageSettingsToPage(configSettings)
    }
  }

  /**
   * Resumes editing from a draft saved in local storage.
   * @returns {Promise<void>}
   */
  public async resumeEditingFromDraft() {
    this.updateLocalStorageItemName()

    const localStorageData = this.getSavedPageHtml()

    if (localStorageData) {
      this.pageBuilderStateStore.setIsLoadingResumeEditing(true)
      await sleep(400)
      await this.mountComponentsToDOM(localStorageData, false, undefined, true)
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
    await sleep(400)

    // Restore the original content if available
    if (Array.isArray(this.originalComponents)) {
      await this.clearClassesFromPage()
      await this.clearInlineStylesFromPage()
      const htmlString = this.renderComponentsToHtml(this.originalComponents)
      // Pass original page settings to restore the original page layout (bg color, classes, styles)
      await this.mountComponentsToDOM(htmlString, false, this.originalPageSettings ?? undefined)
      this.removeCurrentComponentsFromLocalStorage()
    }

    // Wait for Vue to finish DOM updates before attaching event listeners. This ensure elements exist in the DOM.
    await nextTick()
    // Attach event listeners to all editable elements in the Builder
    await this.addListenersToEditableElements()

    this.pageBuilderStateStore.setIsRestoring(false)
  }

  public async returnLatestComponents() {
    await this.syncDomToStoreOnly()
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
      const rawStyle = (parsed.pageSettings && parsed.pageSettings.style) || ''
      const style =
        typeof rawStyle === 'string' ? rawStyle : this.convertStyleObjectToString(rawStyle)

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

    const isValidURL = ref(true)

    if (hyperlinkEnable === true && urlInput !== null) {
      isValidURL.value = isValidHyperlinkInput(urlInput)
    }

    if (isValidURL.value === false) {
      this.pageBuilderStateStore.setHyperlinkMessage(null)

      this.pageBuilderStateStore.setHyperlinkError('URL is not valid')
      return
    }

    if (hyperlinkEnable === true && typeof urlInput === 'string') {
      const normalizedUrl = urlInput.trim()
      // check if element contains child hyperlink tag
      // updated existing url
      if (hyperlink !== null && normalizedUrl.length !== 0) {
        hyperlink.href = normalizedUrl

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
      if (hyperlink === null && normalizedUrl.length !== 0) {
        // add a href
        if (parentHyperlink === null) {
          const link = document.createElement('a')
          link.href = normalizedUrl

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

  /**
   * Replaces the entire page with a theme template (clears existing sections first).
   */
  public async replaceTheme(themeHtml: string): Promise<void> {
    const trimmed = themeHtml?.trim()
    if (!trimmed) return

    const validationError = this.validateMountingHTML(trimmed, { logError: true })
    if (validationError) return

    this.deleteAllComponentsFromDOM()
    await this.mountComponentsToDOM(trimmed)
    await this.handleAutoSave()
  }

  public getPageMeta(): PageMeta {
    const settings = this.readCurrentPageSettings() ?? this._lastKnownPageSettings
    return pageMetaFromPageSettings(settings)
  }

  public async setPageMeta(partial: Partial<PageMeta>): Promise<void> {
    const current = this.getPageMeta()
    const next: PageMeta = { ...current, ...partial }

    const pagebuilder = this.getBuilderCanvasElement()
    if (pagebuilder) {
      applyPageMetaToElement(pagebuilder, next)
    }

    const base: PageSettings = this.readCurrentPageSettings() ??
      this._lastKnownPageSettings ?? { classes: '', style: '' }
    this._lastKnownPageSettings = mergePageMetaIntoSettings(base, next)
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
      category: 'Content',
    })

    // Individual heading checks (H2-H6)
    const h2Count = doc.querySelectorAll('h2').length
    checks.push({
      check: 'Has at least one H2',
      passed: h2Count > 0,
      details: `Found ${h2Count} H2 headings`,
      category: 'Headings',
    })

    const h3Count = doc.querySelectorAll('h3').length
    checks.push({
      check: 'Has at least one H3',
      passed: h3Count > 0,
      details: `Found ${h3Count} H3 headings`,
      category: 'Headings',
    })

    const h4Count = doc.querySelectorAll('h4').length
    checks.push({
      check: 'Has at least one H4',
      passed: h4Count > 0,
      details: `Found ${h4Count} H4 headings`,
      category: 'Headings',
    })

    const h5Count = doc.querySelectorAll('h5').length
    checks.push({
      check: 'Has at least one H5',
      passed: h5Count > 0,
      details: `Found ${h5Count} H5 headings`,
      category: 'Headings',
    })

    const h6Count = doc.querySelectorAll('h6').length
    checks.push({
      check: 'Has at least one H6',
      passed: h6Count > 0,
      details: `Found ${h6Count} H6 headings`,
      category: 'Headings',
    })

    // No heading levels are skipped (e.g. H3 without H2)
    const headingLevels = [2, 3, 4, 5, 6]
    let headingStructureValid = true
    let headingStructureDetail = 'Heading hierarchy is correct'
    for (let i = 1; i < headingLevels.length; i++) {
      const current = headingLevels[i]
      const previous = headingLevels[i - 1]
      if (
        doc.querySelectorAll(`h${current}`).length > 0 &&
        doc.querySelectorAll(`h${previous}`).length === 0
      ) {
        headingStructureValid = false
        headingStructureDetail = `H${current} found but H${previous} is missing — heading levels should not be skipped`
        break
      }
    }
    checks.push({
      check: 'Heading levels are not skipped',
      passed: headingStructureValid,
      details: headingStructureDetail,
      category: 'Headings',
    })

    // Page contains at least one image
    const allImages = [...doc.querySelectorAll('img')]
    checks.push({
      check: 'Page contains at least one image',
      passed: allImages.length > 0,
      details: `Found ${allImages.length} image(s)`,
      category: 'Media',
    })

    // All images have alt text
    const imagesWithoutAlt = allImages.filter(
      (img) => !img.getAttribute('alt') || img.getAttribute('alt')!.trim() === '',
    )
    checks.push({
      check: 'All images have alt text',
      passed: allImages.length === 0 || imagesWithoutAlt.length === 0,
      details:
        allImages.length === 0
          ? 'No images found'
          : imagesWithoutAlt.length === 0
            ? `All ${allImages.length} image(s) have alt text`
            : `${imagesWithoutAlt.length} of ${allImages.length} image(s) are missing alt text`,
      category: 'Media',
    })

    // Page contains at least one link
    const allLinks = [...doc.querySelectorAll('a[href]')].filter(
      (a) => (a.getAttribute('href') || '').trim() !== '',
    )
    checks.push({
      check: 'Page contains at least one link',
      passed: allLinks.length > 0,
      details: `Found ${allLinks.length} link(s)`,
      category: 'Links',
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
        // Capture global page styles BEFORE any DOM manipulation.
        // Fall back to _lastKnownPageSettings when all components were just deleted
        // and no #pagebuilder element exists in the DOM yet.
        const pageSettings = this.readCurrentPageSettings() ?? this._lastKnownPageSettings

        // Pause the MutationObserver so it doesn't fire on the divs being removed/recreated.
        this.globalStylesObserver?.disconnect()

        await this.syncDomToStoreOnly()
        await nextTick()

        const components = this.pageBuilderStateStore.getComponents || []
        const newComponents = [
          ...components.slice(0, placeCompAtLocation),
          clonedComponent,
          ...components.slice(placeCompAtLocation),
        ]
        this.pageBuilderStateStore.setComponents(newComponents)
        insertedIndex = placeCompAtLocation

        // Wait for Vue to finish rendering the new component list.
        await nextTick()
        await nextTick()

        if (pageSettings && (pageSettings.classes || pageSettings.style)) {
          this.applyPageSettingsToPage(pageSettings)
        }

        if (this.globalStylesObserver !== null) {
          this.reconnectGlobalStylesObserver()
        }
      } else {
        // Capture styles before push so we can apply to the new div after render.
        // Fall back to _lastKnownPageSettings when all components were just deleted
        // and no #pagebuilder element exists in the DOM yet.
        const pageSettings = this.readCurrentPageSettings() ?? this._lastKnownPageSettings

        this.pageBuilderStateStore.setPushComponents({
          component: clonedComponent,
          componentArrayAddMethod: this.getComponentArrayAddMethod.value
            ? this.getComponentArrayAddMethod.value
            : 'push',
        })

        if (pageSettings && (pageSettings.classes || pageSettings.style)) {
          await nextTick()
          await nextTick()
          this.applyPageSettingsToPage(pageSettings)
        }
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
   * Inserts a product section using raw HTML from a custom product picker.
   */
  public async insertProductHtml(html: string, title = 'Products'): Promise<void> {
    await this.addComponent({
      id: null,
      title,
      html_code: html,
    })
  }

  /**
   * Inserts products using a built-in grid layout helper.
   * Hosts can also call insertProductHtml() with fully custom markup.
   */
  public async insertProducts(
    products: ReadonlyArray<PageBuilderProductInput>,
    options: InsertProductsOptions = {},
  ): Promise<void> {
    if (!products.length) return

    if (options.method) {
      this.pageBuilderStateStore.setComponentArrayAddMethod(options.method)
    }

    const sectionTitle = options.sectionTitle ?? 'Products'
    const html = buildProductSectionHtml(products, options.layout ?? 'grid-4', sectionTitle, {
      cardStyle: options.cardStyle,
      roundedImages: options.roundedImages,
      openInNewTab: options.openInNewTab,
      buttonStyle: options.buttonStyle,
      roundedButtons: options.roundedButtons,
      hidePrice: options.hidePrice,
      hideImage: options.hideImage,
      hideButton: options.hideButton,
      hideLinks: options.hideLinks,
      mobileColumns: options.mobileColumns,
    })
    await this.insertProductHtml(html, sectionTitle)
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

  private hasMeaningfulPageSettings(
    pageSettings: PageSettings | null | undefined,
  ): pageSettings is PageSettings {
    if (!pageSettings) return false

    const classes = (pageSettings.classes || '').trim()
    const styleString =
      typeof pageSettings.style === 'string'
        ? pageSettings.style.trim()
        : this.convertStyleObjectToString(pageSettings.style).trim()
    const hasMeta = Boolean(
      pageSettings.meta &&
        ((pageSettings.meta.title || '').trim() || (pageSettings.meta.description || '').trim()),
    )

    return classes.length > 0 || styleString.length > 0 || hasMeta
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
        meta: readPageMetaFromElement(pagebuilderDiv as HTMLElement),
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
      return this.translate(HTML_VALIDATION_MESSAGES.NO_HTML_CONTENT)
    }

    const sectionInElementError = validateSectionNotAllowedInElementHtml(htmlString)
    if (sectionInElementError) {
      return this.translate(sectionInElementError.message)
    }

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlString.trim()

    const parsedElement = tempDiv.firstElementChild as HTMLElement | null

    if (!parsedElement) {
      return this.translate(HTML_VALIDATION_MESSAGES.COULD_NOT_PARSE_ELEMENT)
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
    const validation = validateMountingHtmlStructure(htmlString)
    if (!validation) return null

    const error = this.translate(validation.message)
    if (options?.logError) {
      console.error(error)
    }
    return error
  }

  /**
   * Applies modified components by mounting them to the DOM and attaching listeners.
   * @param htmlString - The HTML string to apply
   * @returns {Promise<string | null>} - Returns error message if failed, otherwise null
   */
  public async applyModifiedComponents(htmlString: string): Promise<string | null> {
    // Trim HTML string
    const trimmedData = htmlString.trim()

    const missingSectionError = validateRequiresSectionWrapper(htmlString)
    if (missingSectionError) {
      return this.translate(missingSectionError.message)
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
    preferImportedPageSettings: boolean = false,
  ): Promise<void> {
    // Trim HTML string
    const trimmedData = htmlString.trim()

    const validationError = this.validateMountingHTML(trimmedData, { logError: true })
    if (validationError) return

    // HTML string
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlString, 'text/html')

      // Catch bad reusable HTML on every mount path (startBuilder, draft restore,
      // history), not only when adding a component via cloneCompObjForDOMInsertion.
      this.reportNonListenerTagClassViolations(doc)

      const importedPageBuilder = doc.querySelector('#pagebuilder') as HTMLElement | null
      const importedPageSettings: PageSettings | null = importedPageBuilder
        ? {
            classes: importedPageBuilder.className || '',
            style: this.parseStyleString(importedPageBuilder.getAttribute('style') || ''),
            meta: readPageMetaFromElement(importedPageBuilder),
          }
        : null

      // Initialize configPageSettings to null
      let configPageSettings: PageSettings | null = null

      // Capture current DOM page settings before any remount (in case we need to preserve them)
      const currentDomPageSettings = this.readCurrentPageSettings()

      // Use stored page settings if the flag is true
      if (usePassedPageSettings) {
        // Prefer explicit config, then memory (last known from previous session), then live DOM.
        // Memory takes priority over DOM because on a v-if reopen the DOM is a freshly
        // rendered wrapper with only Vue's default :class; _lastKnownPageSettings has the
        // user's previously saved custom classes/styles captured in startBuilder().
        const fromConfig = this.pageBuilderStateStore.getPageBuilderConfig?.pageSettings ?? null
        const fromMemory = this._lastKnownPageSettings
        const fromDom = currentDomPageSettings

        configPageSettings = this.hasMeaningfulPageSettings(fromConfig)
          ? fromConfig
          : this.hasMeaningfulPageSettings(fromMemory)
            ? fromMemory
            : this.hasMeaningfulPageSettings(fromDom)
              ? fromDom
              : null
      }

      // For imported HTML that contains #pagebuilder (e.g. resume draft), prefer the
      // wrapper settings embedded in that HTML over current live DOM defaults.
      // This prevents stale current DOM pageSettings (often only config font/spacing)
      // from overriding saved draft classes like background, radius, and color.
      if (
        (preferImportedPageSettings || this.isPageBuilderMissingOnStart) &&
        !usePassedPageSettings &&
        !pageSettingsFromHistory &&
        !configPageSettings &&
        this.hasMeaningfulPageSettings(importedPageSettings)
      ) {
        configPageSettings = importedPageSettings
      }

      // When the builder WAS PRESENT at start (in-session remount), the live DOM still
      // holds the current session's settings — preserve them.
      if (!configPageSettings && this.hasMeaningfulPageSettings(currentDomPageSettings)) {
        configPageSettings = currentDomPageSettings
      }

      // importedPageBuilder as a secondary fallback for the present-at-start case
      // (handles edge where the live DOM has only default classes despite being present).
      if (
        !pageSettingsFromHistory &&
        !configPageSettings &&
        this.hasMeaningfulPageSettings(importedPageSettings)
      ) {
        configPageSettings = importedPageSettings
      }

      // Final fallback: config or memory
      if (!configPageSettings) {
        const fromConfig = this.pageBuilderStateStore.getPageBuilderConfig?.pageSettings ?? null
        const fromMemory = this._lastKnownPageSettings
        configPageSettings = this.hasMeaningfulPageSettings(fromConfig)
          ? fromConfig
          : this.hasMeaningfulPageSettings(fromMemory)
            ? fromMemory
            : null
      }

      // Keep runtime config aligned with the settings source selected for this mount.
      // This prevents Vue bindings from repainting stale page settings right after remount.
      const selectedPageSettings = pageSettingsFromHistory ?? configPageSettings
      if (selectedPageSettings) {
        const currentConfig = this.pageBuilderStateStore.getPageBuilderConfig
        if (currentConfig && typeof currentConfig === 'object') {
          this.pageBuilderStateStore.setPageBuilderConfig({
            ...(currentConfig as Record<string, unknown>),
            pageSettings: selectedPageSettings,
          } as never)
        }
      }

      // Apply the page settings to the live page builder
      if (!pageSettingsFromHistory && configPageSettings) {
        this._pendingPageSettings = configPageSettings
      }

      // Apply the page settings to the live page builder
      if (pageSettingsFromHistory) {
        this._pendingPageSettings = pageSettingsFromHistory
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

      // Apply pending page settings to #pagebuilder now that Vue has rendered.
      if (this._pendingPageSettings) {
        const settings = this._pendingPageSettings
        this._pendingPageSettings = null
        const pagebuilder = this.getBuilderCanvasElement()
        const pageSettings: PageSettings = {
          classes: settings.classes || '',
          style: this.convertStyleObjectToString(settings.style) || '',
          meta: pageMetaFromPageSettings(settings),
        }
        if (pagebuilder) {
          this.applyPageSettingsToPage(pageSettings)
        } else {
          // No page wrapper exists (empty page, e.g. after delete-all + page reload).
          // Preserve the settings in _lastKnownPageSettings so that addComponent can
          // apply them once the user adds a component.
          this._lastKnownPageSettings = pageSettings
        }
      }

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
    await this.handleFontFamily(undefined)
    this.handleFontStyle(undefined)
    this.handleVerticalPadding(undefined)
    this.handleHorizontalPadding(undefined)
    this.handleTopPadding(undefined)
    this.handleRightPadding(undefined)
    this.handleBottomPadding(undefined)
    this.handleLeftPadding(undefined)
    this.handleVerticalMargin(undefined)
    this.handleHorizontalMargin(undefined)
    this.handleTopMargin(undefined)
    this.handleRightMargin(undefined)
    this.handleBottomMargin(undefined)
    this.handleLeftMargin(undefined)

    if (this.isSelectedElementImage()) {
      this.handleImageObjectFit(undefined)
      this.handleImageObjectPosition(undefined)
      this.handleImageAspectRatio(undefined)
    }

    await this.syncCurrentClasses()
    await this.syncCurrentStyles()
  }
}
