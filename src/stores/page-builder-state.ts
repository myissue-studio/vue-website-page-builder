import { defineStore } from 'pinia'
import { nextTick } from 'vue'

import type {
  ComponentObject,
  SetPushComponentsPayload,
  ImageObject,
  PageBuilderConfig,
} from '../types'

interface PageBuilderState {
  // Core Page Builder State
  componentArrayAddMethod: string | null
  localStorageItemName: string | null
  showModalTipTap: boolean
  menuRight: boolean
  borderStyle: string | null
  borderWidth: string | null
  borderColor: string | null
  borderRadiusGlobal: string | null
  borderRadiusTopLeft: string | null
  borderRadiusTopRight: string | null
  borderRadiusBottomleft: string | null
  borderRadiusBottomRight: string | null
  elementContainsHyperlink: boolean | null
  hyperlinkAbility: boolean | null
  hyperlinkInput: string | null
  hyperlinkMessage: string | null
  hyperlinkError: string | null
  hyberlinkEnable: boolean
  openHyperlinkinkInNewTab: boolean | null
  opacity: string | null
  backgroundOpacity: string | null
  textAreaVueModel: string | null
  currentClasses: string[]
  currentStyles: Record<string, string>
  fontVerticalPadding: string | null
  fontHorizontalPadding: string | null
  fontVerticalMargin: string | null
  fontHorizontalMargin: string | null
  fontStyle: string | null
  fontFamily: string | null
  fontWeight: string | null
  fontBase: string | null
  fontDesktop: string | null
  fontTablet: string | null
  fontMobile: string | null
  backgroundColor: string | null
  textColor: string | null
  element: (HTMLElement & { src?: string }) | null
  component: ComponentObject | null
  components: ComponentObject[]
  basePrimaryImage: string | null
  configPageBuilder: PageBuilderConfig | null
  showModalHTMLEditor: boolean
  toggleGlobalHtmlMode: boolean

  // Media Library State
  applyImageToSelection: ImageObject
  currentPreviewImage: string | null

  // User State
  builderStarted: boolean
  isLoadingGlobal: boolean
  isSaving: boolean
  hasLocalDraftForUpdate: boolean
  isResumeEditing: boolean
  isRestoring: boolean
  currentLanguage: string | null
  historyIndex: number
  historyLength: number
  addComponentAddIndex: number | null
}

export const usePageBuilderStateStore = defineStore('pageBuilderState', {
  state: (): PageBuilderState => ({
    // Core Page Builder State
    componentArrayAddMethod: null,
    localStorageItemName: null,
    showModalTipTap: false,
    menuRight: true,
    borderStyle: null,
    borderWidth: null,
    borderColor: null,
    borderRadiusGlobal: null,
    borderRadiusTopLeft: null,
    borderRadiusTopRight: null,
    borderRadiusBottomleft: null,
    borderRadiusBottomRight: null,
    elementContainsHyperlink: null,
    hyperlinkAbility: null,
    hyperlinkInput: null,
    hyperlinkMessage: null,
    hyperlinkError: null,
    hyberlinkEnable: false,
    openHyperlinkinkInNewTab: null,
    opacity: null,
    backgroundOpacity: null,
    textAreaVueModel: null,
    currentClasses: [],
    currentStyles: {},
    fontVerticalPadding: null,
    fontHorizontalPadding: null,
    fontVerticalMargin: null,
    fontHorizontalMargin: null,
    fontStyle: null,
    fontFamily: null,
    fontWeight: null,
    fontBase: null,
    fontDesktop: null,
    fontTablet: null,
    fontMobile: null,
    backgroundColor: null,
    textColor: null,
    element: null,
    component: null,
    components: [],
    basePrimaryImage: null,
    configPageBuilder: null,
    showModalHTMLEditor: false,
    toggleGlobalHtmlMode: false,

    // Media Library State
    applyImageToSelection: { src: '' },
    currentPreviewImage: null,

    // User State
    builderStarted: false,
    isLoadingGlobal: true,
    isSaving: false,
    hasLocalDraftForUpdate: false,
    isResumeEditing: false,
    isRestoring: false,
    currentLanguage: null,
    historyIndex: -1,
    historyLength: 0,
    addComponentAddIndex: null,
  }),
  getters: {
    // Core Page Builder Getters
    getComponentArrayAddMethod(state: PageBuilderState): string | null {
      return state.componentArrayAddMethod
    },
    getLocalStorageItemName(state: PageBuilderState): string | null {
      return state.localStorageItemName
    },
    getShowModalTipTap(state: PageBuilderState): boolean {
      return state.showModalTipTap
    },
    getMenuRight(state: PageBuilderState): boolean {
      return state.menuRight
    },
    getBorderStyle(state: PageBuilderState): string | null {
      return state.borderStyle
    },
    getBorderWidth(state: PageBuilderState): string | null {
      return state.borderWidth
    },
    getBorderColor(state: PageBuilderState): string | null {
      return state.borderColor
    },
    getBorderRadiusGlobal(state: PageBuilderState): string | null {
      return state.borderRadiusGlobal
    },
    getBorderRadiusTopLeft(state: PageBuilderState): string | null {
      return state.borderRadiusTopLeft
    },
    getBorderRadiusTopRight(state: PageBuilderState): string | null {
      return state.borderRadiusTopRight
    },
    getBorderRadiusBottomleft(state: PageBuilderState): string | null {
      return state.borderRadiusBottomleft
    },
    getBorderRadiusBottomRight(state: PageBuilderState): string | null {
      return state.borderRadiusBottomRight
    },
    getElementContainsHyperlink(state: PageBuilderState): boolean | null {
      return state.elementContainsHyperlink
    },
    getHyperlinkAbility(state: PageBuilderState): boolean | null {
      return state.hyperlinkAbility
    },
    getHyperlinkInput(state: PageBuilderState): string | null {
      return state.hyperlinkInput
    },
    getHyperlinkMessage(state: PageBuilderState): string | null {
      return state.hyperlinkMessage
    },
    getHyperlinkError(state: PageBuilderState): string | null {
      return state.hyperlinkError
    },
    getHyberlinkEnable(state: PageBuilderState): boolean {
      return state.hyberlinkEnable
    },
    getOpenHyperlinkInNewTab(state: PageBuilderState): boolean | null {
      return state.openHyperlinkinkInNewTab
    },
    getOpacity(state: PageBuilderState): string | null {
      return state.opacity
    },
    getBackgroundOpacity(state: PageBuilderState): string | null {
      return state.backgroundOpacity
    },
    getTextAreaVueModel(state: PageBuilderState): string | null {
      return state.textAreaVueModel
    },

    getCurrentClasses(state: PageBuilderState): string[] {
      return state.currentClasses
    },
    getCurrentStyles(state: PageBuilderState): Record<string, string> {
      return state.currentStyles
    },
    getFontStyle(state: PageBuilderState): string | null {
      return state.fontStyle
    },
    getFontVerticalPadding(state: PageBuilderState): string | null {
      return state.fontVerticalPadding
    },
    getFontHorizontalPadding(state: PageBuilderState): string | null {
      return state.fontHorizontalPadding
    },
    getFontVerticalMargin(state: PageBuilderState): string | null {
      return state.fontVerticalMargin
    },
    getFontHorizontalMargin(state: PageBuilderState): string | null {
      return state.fontHorizontalMargin
    },
    getFontFamily(state: PageBuilderState): string | null {
      return state.fontFamily
    },
    getFontWeight(state: PageBuilderState): string | null {
      return state.fontWeight
    },
    getFontBase(state: PageBuilderState): string | null {
      return state.fontBase
    },
    getFontDesktop(state: PageBuilderState): string | null {
      return state.fontDesktop
    },
    getFontTablet(state: PageBuilderState): string | null {
      return state.fontTablet
    },
    getFontMobile(state: PageBuilderState): string | null {
      return state.fontMobile
    },
    getBackgroundColor(state: PageBuilderState): string | null {
      return state.backgroundColor
    },
    getTextColor(state: PageBuilderState): string | null {
      return state.textColor
    },
    getElement(state: PageBuilderState): HTMLElement | null {
      return state.element
    },
    getComponent(state: PageBuilderState): ComponentObject | null {
      return state.component
    },
    getComponents(state: PageBuilderState): ComponentObject[] {
      return state.components
    },
    getBasePrimaryImage(state: PageBuilderState): string | null {
      return state.basePrimaryImage
    },

    getPageBuilderConfig(state: PageBuilderState): PageBuilderConfig | null {
      return state.configPageBuilder
    },
    getShowModalHTMLEditor(state: PageBuilderState): boolean {
      return state.showModalHTMLEditor
    },
    getToggleGlobalHtmlMode(state: PageBuilderState): boolean {
      return state.toggleGlobalHtmlMode
    },

    getApplyImageToSelection(state: PageBuilderState): ImageObject {
      return state.applyImageToSelection
    },

    getCurrentPreviewImage(state: PageBuilderState): string | null {
      return state.currentPreviewImage
    },

    // User Getters
    getBuilderStarted: (state: PageBuilderState): boolean => state.builderStarted,
    getIsLoadingGlobal: (state: PageBuilderState): boolean => state.isLoadingGlobal,
    getIsSaving: (state: PageBuilderState): boolean => state.isSaving,
    getHasLocalDraftForUpdate: (state: PageBuilderState): boolean => state.hasLocalDraftForUpdate,
    getIsLoadingResumeEditing: (state: PageBuilderState): boolean => state.isResumeEditing,
    getIsRestoring: (state: PageBuilderState): boolean => state.isRestoring,
    getCurrentLanguage: (state: PageBuilderState): string | null => state.currentLanguage,
    getHistoryIndex: (state: PageBuilderState): number => state.historyIndex,
    getHistoryLength: (state: PageBuilderState): number => state.historyLength,
    getAddComponentAddIndex: (state) => state.addComponentAddIndex,
  },
  actions: {
    setComponentArrayAddMethod(payload: string | null): void {
      this.componentArrayAddMethod = payload
    },
    setLocalStorageItemName(payload: string | null): void {
      this.localStorageItemName = payload
    },
    setShowModalTipTap(payload: boolean): void {
      this.showModalTipTap = payload
    },
    setMenuRight(payload: boolean): void {
      this.menuRight = payload
    },
    setBorderStyle(payload: string | null): void {
      this.borderStyle = payload
    },
    setBorderWidth(payload: string | null): void {
      this.borderWidth = payload
    },
    setBorderColor(payload: string | null): void {
      this.borderColor = payload
    },
    setBorderRadiusGlobal(payload: string | null): void {
      this.borderRadiusGlobal = payload
    },
    setBorderRadiusTopLeft(payload: string | null): void {
      this.borderRadiusTopLeft = payload
    },
    setBorderRadiusTopRight(payload: string | null): void {
      this.borderRadiusTopRight = payload
    },
    setBorderRadiusBottomleft(payload: string | null): void {
      this.borderRadiusBottomleft = payload
    },
    setBorderRadiusBottomRight(payload: string | null): void {
      this.borderRadiusBottomRight = payload
    },
    setElementContainsHyperlink(payload: boolean | null): void {
      this.elementContainsHyperlink = payload
    },
    setHyperlinkAbility(payload: boolean | null): void {
      this.hyperlinkAbility = payload
    },
    setHyperlinkInput(payload: string | null): void {
      this.hyperlinkInput = payload
    },
    setHyperlinkMessage(payload: string | null): void {
      this.hyperlinkMessage = payload
    },
    setHyperlinkError(payload: string | null): void {
      this.hyperlinkError = payload
    },
    setHyberlinkEnable(payload: boolean): void {
      this.hyberlinkEnable = payload
    },
    setOpenHyperlinkInNewTab(payload: boolean | null): void {
      this.openHyperlinkinkInNewTab = payload
    },
    setOpacity(payload: string | null): void {
      this.opacity = payload
    },
    setBackgroundOpacity(payload: string | null): void {
      this.backgroundOpacity = payload
    },
    setTextAreaVueModel(payload: string | null): void {
      this.textAreaVueModel = payload
    },

    setClass(payload: string): void {
      this.currentClasses = [...this.currentClasses, payload]
    },
    removeClass(payload: string): void {
      this.currentClasses = this.currentClasses.filter((cls) => cls !== payload)
    },
    setCurrentClasses(payload: string[] | ArrayLike<string>): void {
      this.currentClasses = Array.from(payload)
    },
    setCurrentStyles(payload: Record<string, string>): void {
      this.currentStyles = payload
    },
    setFontVerticalPadding(payload: string | null): void {
      this.fontVerticalPadding = payload
    },
    setFontHorizontalPadding(payload: string | null): void {
      this.fontHorizontalPadding = payload
    },
    setFontVerticalMargin(payload: string | null): void {
      this.fontVerticalMargin = payload
    },
    setFontHorizontalMargin(payload: string | null): void {
      this.fontHorizontalMargin = payload
    },
    setFontStyle(payload: string | null): void {
      this.fontStyle = payload
    },
    setFontFamily(payload: string | null): void {
      this.fontFamily = payload
    },
    setFontWeight(payload: string | null): void {
      this.fontWeight = payload
    },
    setFontBase(payload: string | null): void {
      this.fontBase = payload
    },
    setFontDesktop(payload: string | null): void {
      this.fontDesktop = payload
    },
    setFontTablet(payload: string | null): void {
      this.fontTablet = payload
    },
    setFontMobile(payload: string | null): void {
      this.fontMobile = payload
    },
    setBackgroundColor(payload: string | null): void {
      this.backgroundColor = payload
    },
    setTextColor(payload: string | null): void {
      this.textColor = payload
    },
    setElement(payload: HTMLElement | null): void {
      // Force reactivity by setting to null first, then the actual value
      this.element = null
      nextTick(() => {
        this.element = payload
      })
    },
    setComponent(payload: ComponentObject | null): void {
      if (!payload) {
        this.element = null
        this.component = null
        return
      }
      // Force reactivity by setting to null first, then the actual value
      this.component = null
      nextTick(() => {
        this.component = payload
      })
    },

    setComponents(payload: ComponentObject[] | null): void {
      // Force reactivity by setting to empty array first, then the actual value
      this.components = []
      nextTick(() => {
        this.components = payload || []
      })
    },
    setPushComponents(payload: SetPushComponentsPayload): void {
      const method = payload.componentArrayAddMethod ?? 'push'
      if (method === 'push') {
        this.components.push(payload.component)
      } else if (method === 'unshift') {
        this.components.unshift(payload.component)
      }
    },

    setBasePrimaryImage(payload: string | null): void {
      if (this.element) {
        this.element.src = payload ?? undefined
      }

      this.basePrimaryImage = payload
    },
    setCurrentLayoutPreview(payload: string): void {
      localStorage.setItem('preview', payload)
    },

    setPageBuilderConfig(payload: PageBuilderConfig | null): void {
      this.configPageBuilder = payload
    },

    setShowModalHTMLEditor(payload: boolean): void {
      this.showModalHTMLEditor = payload
    },
    setToggleGlobalHtmlMode(payload: boolean): void {
      this.toggleGlobalHtmlMode = payload
    },

    setApplyImageToSelection(payload: ImageObject): void {
      this.applyImageToSelection = payload
    },
    setCurrentPreviewImage(payload: string | null): void {
      this.currentPreviewImage = payload
    },

    // User Actions
    setBuilderStarted(payload: boolean): void {
      this.builderStarted = payload
    },
    setIsLoadingGlobal(payload: boolean): void {
      this.isLoadingGlobal = payload
    },
    setIsSaving(payload: boolean): void {
      this.isSaving = payload
    },
    setHasLocalDraftForUpdate(payload: boolean): void {
      this.hasLocalDraftForUpdate = payload
    },
    setIsLoadingResumeEditing(payload: boolean): void {
      this.isResumeEditing = payload
    },
    setIsRestoring(payload: boolean): void {
      this.isRestoring = payload
    },
    setCurrentLanguage(payload: string): void {
      this.currentLanguage = payload
    },
    setHistoryIndex(payload: number): void {
      this.historyIndex = payload
    },
    setHistoryLength(payload: number): void {
      this.historyLength = payload
    },
    setAddComponentAddIndex(payload: number | null): void {
      this.addComponentAddIndex = payload
    },
  },
})
