declare module '@myissue/vue-website-page-builder' {
  import type { Component, Plugin } from 'vue'

  export interface PageBuilderUser {
    name: string
    image: string
  }

  export interface PageBuilderConfig {
    updateOrCreate: {
      formType: 'create' | 'update'
      formName: string
    }
    pageBuilderLogo?: { src: string } | null
    resourceData?: { title: string; id?: number } | null
    userForPageBuilder?: PageBuilderUser
    userSettings?: {
      theme?: 'light' | 'dark' | 'auto'
      language?: { default: string; enable?: ReadonlyArray<string> }
      autoSave?: boolean
      [key: string]: unknown
    } | null
    settings?: { brandColor?: string; [key: string]: unknown } | null
    [key: string]: unknown
  }

  export interface ComponentObject {
    id: string | number | null
    html_code: string
    title: string
  }

  export interface ImageObject {
    src: string
  }

  export type StartBuilderResult =
    | { error: true; reason: string }
    | {
        message: string
        validation?:
          | { error: true; warning: string; status: string }
          | { error: true; reason: string }
        passedComponentsArray?: ComponentObject[]
      }

  export interface PageBuilderService {
    startBuilder(config: PageBuilderConfig): Promise<StartBuilderResult>
  }

  export const PageBuilder: Component
  export const Preview: Component

  export function getPageBuilder(): PageBuilderService
  export function usePageBuilderStateStore(): unknown
  export function usePageBuilderModal(): unknown
  export function createPinia(): unknown

  export const pageBuilder: Plugin
  export const sharedPageBuilderPinia: unknown
  export const sharedPageBuilderStore: unknown
}
