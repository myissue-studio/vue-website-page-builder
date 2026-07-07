import type { PageBuilderService } from '../services/PageBuilderService'

export interface PageBuilderState {
  // ...other state properties...
  PageBuilderService: PageBuilderService | null
  isSaving: boolean
  // etc.
}

// Central type definitions for the Vue Page Builder project

export interface SEOCheck {
  check: string
  passed: boolean
  details: string
  category: string
}

export interface SEOSummary {
  score: number
  checks: SEOCheck[]
}

// Component and Image interfaces
export interface ComponentObject {
  id: string | number | null
  html_code: string
  title: string
  [key: string]: unknown // Allow custom properties on components
}

export interface ImageObject {
  src: string
  [key: string]: unknown // Allow custom properties on images (e.g., alt, width, height)
}

/**
 * Product fields accepted by insertProducts() / buildProductSectionHtml().
 * No index signature — assign from your API interfaces without extra casting.
 */
export interface PageBuilderProductInput {
  id?: string | number
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  price?: string | number
  compareAtPrice?: string | number
  badge?: string
  /** Product or checkout URL on the host storefront */
  url?: string
  buttonText?: string
  sku?: string
}

/**
 * Flexible product shape for ecommerce integrations.
 * All fields are optional — hosts decide what to show in their custom picker or layouts.
 * Includes an index signature for custom fields used in templates.
 */
export type PageBuilderProduct = PageBuilderProductInput & {
  [key: string]: unknown
}

export type ProductGridLayout = 'grid-1' | 'grid-2' | 'grid-3' | 'grid-4' | 'grid-6' | (string & {})

export type ProductCardStyle = 'minimal' | 'bordered' | 'shadow' | 'elevated' | (string & {})

export type ProductButtonStyle = 'text' | 'button' | (string & {})

export type ProductMobileColumns = 1 | 2

export interface ProductSectionOptions {
  layout: ProductGridLayout
  mobileColumns?: ProductMobileColumns
  cardStyle?: ProductCardStyle
  roundedImages?: boolean
  openInNewTab?: boolean
  /** Product CTA appearance: plain text link or button style */
  buttonStyle?: ProductButtonStyle
  /** Applies rounded/full corners when CTA button style is enabled */
  roundedButtons?: boolean
  /** Hides price and compare-at price when product data includes them */
  hidePrice?: boolean
  /** Hides product photos when product data includes images */
  hideImage?: boolean
  /** Hides the CTA button when product data includes url and buttonText */
  hideButton?: boolean
}

export interface InsertProductsOptions {
  layout?: ProductGridLayout
  mobileColumns?: ProductMobileColumns
  cardStyle?: ProductCardStyle
  /** Adds rounded corners to product images */
  roundedImages?: boolean
  /** Adds target="_blank" rel="noopener noreferrer" to product links */
  openInNewTab?: boolean
  /** Product CTA appearance: plain text link or button style */
  buttonStyle?: ProductButtonStyle
  /** Applies rounded/full corners when CTA button style is enabled */
  roundedButtons?: boolean
  /** Hides price and compare-at price when product data includes them */
  hidePrice?: boolean
  /** Hides product photos when product data includes images */
  hideImage?: boolean
  /** Hides the CTA button when product data includes url and buttonText */
  hideButton?: boolean
  sectionTitle?: string
  /** unshift | push | insert (uses current add index) */
  method?: 'unshift' | 'push' | 'insert' | (string & {})
}

// For a single component/block passed by the developer
export interface BuilderResourceComponent {
  html_code: string
  title?: string
  [key: string]: unknown // Allow custom properties from external systems
}

// For the full resource object passed to your package
export type BuilderResourceData = BuilderResourceComponent[]

export type StartBuilderResult =
  | { error: true; reason: string }
  | {
      message: string
      validation?:
        | { error: true; warning: string; status: string }
        | { error: true; reason: string }
      passedComponentsArray?: BuilderResourceData
    }

// Store interfaces for better type safety
export interface PageBuilderStateStore {
  getTextAreaVueModel: string | null
  LocalStorageItemName: string | null
  getHyberlinkEnable: boolean
  getComponents: ComponentObject[] | null
  getComponent: ComponentObject | null
  getElement: HTMLElement | null
  getNextSibling: HTMLElement | null
  getParentElement: HTMLElement | null
  getRestoredElement: string | null
  getComponentArrayAddMethod: string | null
  getFontBase: string | null
  getFontDesktop: string | null
  getFontTablet: string | null
  getFontMobile: string | null
  setElement: (element: HTMLElement | null) => void
  setMenuRight: (value: boolean) => void
  setComponent: (component: ComponentObject | null) => void
  setComponents: (components: ComponentObject[] | null) => void
  setComponentArrayAddMethod: (method: string) => void
  setCurrentClasses: (classes: string[] | ArrayLike<string>) => void
  setClass: (className: string) => void
  removeClass: (className: string) => void
  setParentElement: (element: HTMLElement | Node | null) => void
  setRestoredElement: (html: string | null) => void
  setNextSibling: (element: HTMLElement | Node | null) => void
  setTextAreaVueModel: (html: string | null) => void
  setFontBase: (size: string | null) => void
  setFontDesktop: (size: string | null) => void
  setFontTablet: (size: string | null) => void
  setFontMobile: (size: string | null) => void
  setBasePrimaryImage: (url: string | null) => void
  setCurrentLayoutPreview: (html: string) => void
  setHyperlinkError: (error: string | null) => void
  setHyperlinkMessage: (message: string | null) => void
  setElementContainsHyperlink: (contains: boolean) => void
  setHyberlinkEnable: (enable: boolean) => void
  setHyperlinkInput: (input: string) => void
  setOpenHyperlinkInNewTab: (newTab: boolean) => void
  setHyperlinkAbility: (ability: boolean) => void
  setPushComponents: (payload: SetPushComponentsPayload) => void
  setLocalStorageItemName: (name: string | null) => void
  setUpdateOrCreate: (mode: string) => void
  setFontWeight: (weight: string) => void
  setFontFamily: (family: string) => void
  setFontStyle: (style: string) => void
  setFontVerticalPadding: (padding: string) => void
  setFontHorizontalPadding: (padding: string) => void
  setFontTopPadding: (padding: string) => void
  setFontRightPadding: (padding: string) => void
  setFontBottomPadding: (padding: string) => void
  setFontLeftPadding: (padding: string) => void
  setFontVerticalMargin: (margin: string) => void
  setFontHorizontalMargin: (margin: string) => void
  setFontTopMargin: (margin: string) => void
  setFontRightMargin: (margin: string) => void
  setFontBottomMargin: (margin: string) => void
  setFontLeftMargin: (margin: string) => void
  setBorderStyle: (style: string) => void
  setBorderWidth: (width: string) => void
  setBorderColor: (color: string) => void
  setBorderRadiusGlobal: (radius: string) => void
  setBorderRadiusTopLeft: (radius: string) => void
  setBorderRadiusTopRight: (radius: string) => void
  setBorderRadiusBottomleft: (radius: string) => void
  setBorderRadiusBottomRight: (radius: string) => void
  setBackgroundColor: (color: string) => void
  setTextColor: (color: string) => void
  setBackgroundOpacity: (opacity: string) => void
  setOpacity: (opacity: string) => void
  getApplyImageToSelection: ImageObject | null
  setCurrentImage: (image: ImageObject) => void
  getCurrentPreviewImage: string | null
  setCurrentPreviewImage: (url: string | null) => void
  [key: string]: unknown
}

export type FormName =
  // --- Content ---
  | 'post'
  | 'article'
  | 'blog'
  | 'news'
  | 'page'
  | 'faq'
  | 'testimonial'
  | 'case-study'
  | 'press-release'

  // --- Commerce ---
  | 'product'
  | 'products'
  | 'category'
  | 'collection'
  | 'brand'
  | 'coupon'
  | 'discount'
  | 'shop'
  | 'cart'
  | 'checkout'

  // --- User / Team ---
  | 'profile'
  | 'account'
  | 'team'
  | 'team-member'
  | 'author'
  | 'customer'
  | 'user'

  // --- Business / Services ---
  | 'service'
  | 'services'
  | 'package'
  | 'plan'
  | 'pricing'
  | 'subscription'

  // --- Job / Careers ---
  | 'job'
  | 'job-listing'
  | 'career'
  | 'applicant'

  // --- Events / Scheduling ---
  | 'event'
  | 'events'
  | 'webinar'
  | 'appointment'
  | 'reservation'
  | 'schedule'

  // --- Directory / Listings ---
  | 'listing'
  | 'directory'
  | 'location'
  | 'vendor'
  | 'company'

  // --- Media ---
  | 'gallery'
  | 'image'
  | 'video'
  | 'media'
  | 'audio'
  | 'file'

  // --- Support / Feedback ---
  | 'contact'
  | 'support'
  | 'ticket'
  | 'feedback'
  | 'review'
  | 'inquiry'
  | 'report'

  // --- Misc ---
  | 'setting'
  | 'configuration'
  | 'integration'
  | 'theme'
  | 'language'
  | 'menu'
  | 'navigation'
  | 'tag'
  | 'meta'

// User interfaces
export interface User {
  name: string
}

// Specific user interface for page builder usage
export interface PageBuilderUser {
  /**
   * Optional stable user identifier.
   * When provided, theme color presets are stored under a user-scoped localStorage
   * key (`vueWebsitePageBuilderThemeColorPresets-u{id}`) so every user keeps their
   * own personalized presets on the same device.  Accepts any string or number that
   * uniquely identifies the user in the host application (e.g. a database row id).
   * Also accepts `null` for cases where the DB returns a nullable id column.
   */
  id?: string | number | null
  /**
   * Display name shown in the builder toolbar.
   * Optional so consumers can omit it or pass auth-user objects where the name
   * field may be `username`, `displayName`, etc. — just pick the right field.
   */
  name?: string
  image?: string // Optional - allows flexibility for different user contexts
}

export interface PageMeta {
  title?: string
  description?: string
}

export interface PageSettings {
  classes?: string
  style?: string | Record<string, string>
  meta?: PageMeta
  [key: string]: unknown
}

export type ThemeColorPresetId =
  | 'primary'
  | 'secondary'
  | 'custom1'
  | 'custom2'
  | 'custom3'
  | 'custom4'
  | 'custom5'
  | 'custom6'

export interface ThemeColorPreset {
  id: ThemeColorPresetId
  label: string
  color: string
  enabled: boolean
}

/** Flexible input for consumer configs — id accepts any string (e.g. inferred from variables). */
export interface ThemeColorPresetInput {
  id: ThemeColorPresetId | (string & {})
  label?: string
  color?: string
  enabled?: boolean
  [key: string]: unknown
}

/** Input shape for themeColorPresets in PageBuilderConfig (partial colors are normalized at runtime). */
export interface ThemeColorPresetSettingsInput {
  enabled?: boolean
  colors?: ReadonlyArray<ThemeColorPresetInput>
  [key: string]: unknown
}

export interface ThemeColorPresetSettings {
  enabled: boolean
  colors: readonly ThemeColorPreset[]
}

/**
 * Per-element font overrides for the builder canvas.
 * Each value is a font key name or comma-separated list (e.g. `'jost'` or
 * `'jost, raleway, arial'`). The first recognised font name is applied;
 * unrecognised names are silently skipped.
 */
export interface PageBuilderElementFonts {
  h1?: string
  h2?: string
  h3?: string
  h4?: string
  h5?: string
  h6?: string
  p?: string
}

// Page Builder Configuration interface
export interface PageBuilderConfig {
  updateOrCreate: {
    /**
     * Whether the builder is creating new content or updating existing content.
     * Accepts `'create'`, `'update'`, or any other string for dynamic / computed values.
     * The union with `(string & {})` preserves autocomplete for the two common values
     * while allowing any string without requiring `as const` or explicit casting.
     *
     * @example
     * // Dynamic value — works without `as const`
     * formType: hasContent ? 'update' : 'create'
     */
    formType: 'create' | 'update' | (string & {})
    formName: FormName | (string & {}) // Provides autocomplete for common values while accepting any string
    [key: string]: unknown
  }
  pageBuilderLogo?: { src: string; [key: string]: unknown } | null
  resourceData?: {
    /**
     * Optional page/resource title shown in the builder toolbar.
     * Made optional so consumers can pass a resource object without a title
     * or when the title isn't known yet at the time `startBuilder` is called.
     */
    title?: string
    /**
     * Accepts both numeric IDs and string-based IDs (e.g. UUIDs).
     * The service handles both types at runtime when building localStorage keys.
     */
    id?: number | string
    [key: string]: unknown
  } | null
  userForPageBuilder?: PageBuilderUser // image is already optional on PageBuilderUser
  [key: string]: unknown // Allow any additional properties for forward-compatibility
  userSettings?: {
    language?: {
      default?: string // Accept any language code (e.g., 'en', 'fr', 'custom-lang', etc.)
      enable?: readonly string[] // Accept any language codes array (readonly for 'as const' compatibility)
      disableLanguageDropDown?: boolean
    }
    autoSave?: boolean
    notifications?: boolean
    /**
     * Default canvas font and, optionally, the restricted set of fonts shown in
     * the font-family picker.
     *
     * - Single built-in key: `'jost'` — canvas default; picker shows all built-in fonts.
     * - Comma-separated list: first entry is the canvas default; picker is restricted
     *   to the listed fonts.
     *
     * Any name not in the built-in list is treated as a custom font (e.g.
     * `'Bitcount Grid Double'`). You must load the font in your app CSS
     * (`@import`, `@font-face`, or a `<link>`). The builder applies the name only.
     */
    fontFamily?: string
    /**
     * Per-element font overrides applied to the builder canvas.
     * Same format as `fontFamily` — built-in keys, comma-separated fallbacks,
     * or custom font names you load yourself.
     */
    elementFonts?: PageBuilderElementFonts
  } | null // Allow null for maximum flexibility; no [key: string] here so typed UserSettings interfaces assign without error
  settings?: {
    brandColor?: string
    themeColorPresets?: ThemeColorPresetSettingsInput | ThemeColorPresetSettings | null
    [key: string]: unknown
  } | null
  pageSettings?: PageSettings
}
// Tailwind utility interfaces
export interface TailwindColors {
  backgroundColorVariables: string[]
  textColorVariables: string[]
}

export interface TailwindOpacities {
  opacities: string[]
  backgroundOpacities: string[]
}

export interface TailwindFontSizes {
  fontBase: string[]
  fontDesktop: string[]
  fontTablet: string[]
  fontMobile: string[]
}

export interface TailwindFontStyles {
  fontStyles: string[]
}

export interface TailwindPaddingAndMargin {
  paddingAndMargin: string[]
}

export interface TailwindBorderRadius {
  borderRadius: string[]
}

export interface TailwindBorderStyleWidthColor {
  borderStyles: string[]
  borderWidths: string[]
  borderColors: string[]
}

// Utility types
export type TimerHandle = ReturnType<typeof setTimeout>
export type MutationObserver = globalThis.MutationObserver

// Fetch response interfaces
export interface FetchedComponentsResponse {
  components: ComponentObject[]
  pagination?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  [key: string]: unknown
}

export interface SetPushComponentsPayload {
  componentArrayAddMethod?: string
  component: ComponentObject
}

export interface LoadComponentsData {
  search_query?: string
  page?: string | number
}
