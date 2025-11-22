import type { PageBuilderService } from '../services/PageBuilderService.ts'

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
}

export interface ImageObject {
  src: string
}

// For a single component/block passed by the developer
export interface BuilderResourceComponent {
  html_code: string
  title?: string
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
  setFontVerticalMargin: (margin: string) => void
  setFontHorizontalMargin: (margin: string) => void
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
  name: string
  image: string
}

export interface PageSettings {
  classes: string
  style?: Record<string, string>
}

// Page Builder Configuration interface
export interface PageBuilderConfig {
  updateOrCreate: {
    formType: 'create' | 'update'
    formName: FormName
  }
  pageBuilderLogo?: { src: string } | null
  resourceData?: { title: string; id?: number } | null
  userForPageBuilder?: PageBuilderUser
  [key: string]: unknown
  userSettings?: {
    theme?: 'light' | 'dark' | 'auto'
    language?: {
      default: 'en' | 'zh-Hans' | 'fr' | 'ja' | 'ru' | 'es' | 'pt' | 'de' | 'ar' | 'hi' | 'da' | 'it'
      enable?: ReadonlyArray<
        'en' | 'zh-Hans' | 'fr' | 'ja' | 'ru' | 'es' | 'pt' | 'de' | 'ar' | 'hi' | 'da' | 'id' 
      >
    }

    autoSave?: boolean
    [key: string]: unknown
  } | null
  settings?: {
    brandColor?: string
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
