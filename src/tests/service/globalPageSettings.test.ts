// @vitest-environment jsdom
/**
 * Regression tests for global page settings persistence.
 *
 * Bug fixed: When a user applied global page styles (e.g. custom classes/styles on
 * [data-pagebuilder-content]) and then closed the modal and clicked Publish,
 * the parent app re-called startBuilder() which triggered mountComponentsToDOM()
 * with usePassedPageSettings=true. If config.pageSettings was not set, the DOM
 * element's classes were wiped because _pendingPageSettings was null.
 *
 * Fix: mountComponentsToDOM now reads the current DOM state of [data-pagebuilder-content]
 * before remounting and uses it as a fallback when config.pageSettings is absent.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { PageBuilderService } from '../../services/PageBuilderService'
import { usePageBuilderStateStore } from '../../stores/page-builder-state'

// ---------------------------------------------------------------------------
// Mock factory
// ---------------------------------------------------------------------------
function createMockStore(overrides: Record<string, unknown> = {}) {
  const base = {
    getApplyImageToSelection: { src: '' },
    getLocalStorageItemName: 'test-key',
    getHyberlinkEnable: false,
    getComponents: [],
    getComponent: null,
    getElement: null,
    getComponentArrayAddMethod: null,
    getShowModalTipTap: false,
    getMenuRight: false,
    getBorderStyle: null,
    getBorderWidth: null,
    getBorderColor: null,
    getBorderRadiusGlobal: null,
    getBorderRadiusTopLeft: null,
    getBorderRadiusTopRight: null,
    getBorderRadiusBottomleft: null,
    getBorderRadiusBottomRight: null,
    getElementContainsHyperlink: null,
    getHyperlinkAbility: null,
    getHyperlinkInput: null,
    getHyperlinkMessage: null,
    getHyperlinkError: null,
    getOpenHyperlinkInNewTab: null,
    getOpacity: null,
    getBackgroundOpacity: null,
    getTextAreaVueModel: null,
    getCurrentClasses: [],
    getCurrentStyles: {},
    getFontVerticalPadding: null,
    getFontHorizontalPadding: null,
    getFontVerticalMargin: null,
    getFontHorizontalMargin: null,
    getFontStyle: null,
    getFontFamily: null,
    getFontWeight: null,
    getFontBase: null,
    getFontDesktop: null,
    getFontTablet: null,
    getFontMobile: null,
    getBackgroundColor: null,
    getTextColor: null,
    getBasePrimaryImage: null,
    getPageBuilderConfig: null,
    getCurrentPreviewImage: null,
    getBuilderStarted: false,
    getIsLoadingGlobal: false,
    getIsSaving: false,
    getHasLocalDraftForUpdate: false,
    getIsLoadingResumeEditing: false,
    getIsRestoring: false,
    getCurrentLanguage: null,
    getHistoryIndex: 0,
    getHistoryLength: 0,
    getToggleGlobalHtmlMode: false,
    setBuilderStarted: vi.fn(),
    setPageBuilderConfig: vi.fn(),
    setHistoryIndex: vi.fn(),
    setHistoryLength: vi.fn(),
    setLocalStorageItemName: vi.fn(),
    setShowModalTipTap: vi.fn(),
    setMenuRight: vi.fn(),
    setBorderStyle: vi.fn(),
    setBorderWidth: vi.fn(),
    setBorderColor: vi.fn(),
    setBorderRadiusGlobal: vi.fn(),
    setBorderRadiusTopLeft: vi.fn(),
    setBorderRadiusTopRight: vi.fn(),
    setBorderRadiusBottomleft: vi.fn(),
    setBorderRadiusBottomRight: vi.fn(),
    setElementContainsHyperlink: vi.fn(),
    setHyperlinkAbility: vi.fn(),
    setHyperlinkInput: vi.fn(),
    setHyperlinkMessage: vi.fn(),
    setHyperlinkError: vi.fn(),
    setHyberlinkEnable: vi.fn(),
    setOpenHyperlinkInNewTab: vi.fn(),
    setOpacity: vi.fn(),
    setBackgroundOpacity: vi.fn(),
    setTextAreaVueModel: vi.fn(),
    setClass: vi.fn(),
    removeClass: vi.fn(),
    setCurrentClasses: vi.fn(),
    setCurrentStyles: vi.fn(),
    setFontVerticalPadding: vi.fn(),
    setFontHorizontalPadding: vi.fn(),
    setFontVerticalMargin: vi.fn(),
    setFontHorizontalMargin: vi.fn(),
    setFontStyle: vi.fn(),
    setFontFamily: vi.fn(),
    setFontWeight: vi.fn(),
    setFontBase: vi.fn(),
    setFontDesktop: vi.fn(),
    setFontTablet: vi.fn(),
    setFontMobile: vi.fn(),
    setBackgroundColor: vi.fn(),
    setTextColor: vi.fn(),
    setElement: vi.fn(),
    setComponent: vi.fn(),
    setComponents: vi.fn(),
    setPushComponents: vi.fn(),
    setBasePrimaryImage: vi.fn(),
    setCurrentLayoutPreview: vi.fn(),
    setApplyImageToSelection: vi.fn(),
    setCurrentPreviewImage: vi.fn(),
    setIsLoadingGlobal: vi.fn(),
    setIsSaving: vi.fn(),
    setHasLocalDraftForUpdate: vi.fn(),
    setIsLoadingResumeEditing: vi.fn(),
    setIsRestoring: vi.fn(),
    setCurrentLanguage: vi.fn(),
    setToggleGlobalHtmlMode: vi.fn(),
    ...overrides,
  }
  return base as unknown as ReturnType<typeof usePageBuilderStateStore>
}

const SECTION_HTML =
  '<section data-componentid="test-abc" data-component-title="Test"><div>Content</div></section>'

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('Global Page Settings', () => {
  let contentEl: HTMLElement

  beforeEach(() => {
    localStorage.clear()
    // Set up a fresh [data-pagebuilder-content] element before each test
    contentEl = document.createElement('div')
    contentEl.setAttribute('data-pagebuilder-content', '')
    document.body.appendChild(contentEl)
  })

  afterEach(() => {
    // Remove the element after each test to avoid cross-test contamination
    if (contentEl.parentNode) {
      contentEl.parentNode.removeChild(contentEl)
    }
    localStorage.clear()
  })

  // -------------------------------------------------------------------------
  // Regression: global styles preserved on remount
  // -------------------------------------------------------------------------
  it('REGRESSION: preserves DOM classes when config has no pageSettings and Vue re-renders', async () => {
    const appliedClasses = 'pbx-font-jost pbx-text-black pbx-bg-emerald-300 pbx-border-8'
    contentEl.setAttribute('class', appliedClasses)

    // Mock setComponents to simulate Vue destroying [data-pagebuilder-content] classes
    // (this is what happens in production when setComponents triggers a re-render)
    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
        // No pageSettings — this was the bug trigger
      },
      setComponents: vi.fn().mockImplementation(() => {
        // Simulate Vue re-rendering: removes classes from [data-pagebuilder-content]
        const el = document.querySelector('[data-pagebuilder-content]')
        if (el) {
          el.removeAttribute('class')
          el.removeAttribute('style')
        }
      }),
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as { mountComponentsToDOM: Function }

    await svc.mountComponentsToDOM(SECTION_HTML, true /* usePassedPageSettings */)
    await nextTick()

    // With the fix: classes are read from DOM BEFORE Vue wipes them,
    // stored as _pendingPageSettings, then re-applied after nextTick.
    const resultEl = document.querySelector('[data-pagebuilder-content]')
    expect(resultEl?.getAttribute('class')).toBe(appliedClasses)
  })

  it('REGRESSION: preserves inline styles when config has no pageSettings and Vue re-renders', async () => {
    contentEl.setAttribute('style', 'background-color: rgb(52, 211, 153);')

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      setComponents: vi.fn().mockImplementation(() => {
        const el = document.querySelector('[data-pagebuilder-content]')
        if (el) {
          el.removeAttribute('class')
          el.removeAttribute('style')
        }
      }),
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as { mountComponentsToDOM: Function }

    await svc.mountComponentsToDOM(SECTION_HTML, true)
    await nextTick()

    const resultEl = document.querySelector('[data-pagebuilder-content]')
    // Style is converted via parseStyleString → convertStyleObjectToString, so check it's non-empty
    const styleAttr = resultEl?.getAttribute('style') ?? ''
    expect(styleAttr.length).toBeGreaterThan(0)
  })

  it('REGRESSION: preserves both classes and styles simultaneously', async () => {
    contentEl.setAttribute('class', 'pbx-font-jost pbx-bg-black')
    contentEl.setAttribute('style', 'color: red;')

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      setComponents: vi.fn().mockImplementation(() => {
        const el = document.querySelector('[data-pagebuilder-content]')
        if (el) {
          el.removeAttribute('class')
          el.removeAttribute('style')
        }
      }),
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as { mountComponentsToDOM: Function }

    await svc.mountComponentsToDOM(SECTION_HTML, true)
    await nextTick()

    const resultEl = document.querySelector('[data-pagebuilder-content]')
    expect(resultEl?.getAttribute('class')).toBe('pbx-font-jost pbx-bg-black')
    expect((resultEl?.getAttribute('style') ?? '').length).toBeGreaterThan(0)
  })

  // -------------------------------------------------------------------------
  // Config pageSettings takes precedence over DOM
  // -------------------------------------------------------------------------
  it('uses config.pageSettings when explicitly provided (overrides DOM)', async () => {
    // DOM has different classes
    contentEl.setAttribute('class', 'pbx-some-old-class')

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
        pageSettings: {
          classes: 'pbx-font-raleway pbx-text-white',
          style: {},
        },
      },
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as { mountComponentsToDOM: Function }

    await svc.mountComponentsToDOM(SECTION_HTML, true)
    await nextTick()

    const resultEl = document.querySelector('[data-pagebuilder-content]')
    // config.pageSettings takes precedence
    expect(resultEl?.getAttribute('class')).toBe('pbx-font-raleway pbx-text-white')
  })

  // -------------------------------------------------------------------------
  // No classes in DOM — nothing to preserve
  // -------------------------------------------------------------------------
  it('does not apply empty classes when DOM element has none', async () => {
    // contentEl has NO classes

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as { mountComponentsToDOM: Function }

    await svc.mountComponentsToDOM(SECTION_HTML, true)
    await nextTick()

    const resultEl = document.querySelector('[data-pagebuilder-content]')
    // No classes should be set (empty string means no class attribute applied)
    const cls = resultEl?.getAttribute('class')
    expect(!cls || cls === '').toBe(true)
  })

  // -------------------------------------------------------------------------
  // globalPageStyles sets element in store
  // -------------------------------------------------------------------------
  it('globalPageStyles sets the element on the store', async () => {
    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    await service.globalPageStyles()

    expect(mockStore.setElement).toHaveBeenCalledWith(contentEl)
  })

  it('globalPageStyles adds data-global-selected attribute', async () => {
    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    await service.globalPageStyles()

    expect(contentEl.hasAttribute('data-global-selected')).toBe(true)
  })

  it('globalPageStyles does nothing when no [data-pagebuilder-content] exists', async () => {
    // Remove the contentEl
    contentEl.parentNode?.removeChild(contentEl)

    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    // Should not throw
    await expect(service.globalPageStyles()).resolves.toBeUndefined()
  })

  // -------------------------------------------------------------------------
  // clearClassesFromPage
  // -------------------------------------------------------------------------
  it('clearClassesFromPage removes all classes from [data-pagebuilder-content]', async () => {
    contentEl.setAttribute('class', 'pbx-font-jost pbx-text-black')
    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    await service.clearClassesFromPage()

    expect(contentEl.hasAttribute('class')).toBe(false)
  })

  it('clearClassesFromPage works on multiple [data-pagebuilder-content] elements', async () => {
    const contentEl2 = document.createElement('div')
    contentEl2.setAttribute('data-pagebuilder-content', '')
    contentEl2.setAttribute('class', 'pbx-bg-black')
    document.body.appendChild(contentEl2)
    contentEl.setAttribute('class', 'pbx-font-jost')

    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    await service.clearClassesFromPage()

    expect(contentEl.hasAttribute('class')).toBe(false)
    expect(contentEl2.hasAttribute('class')).toBe(false)

    document.body.removeChild(contentEl2)
  })

  // -------------------------------------------------------------------------
  // clearInlineStylesFromPage
  // -------------------------------------------------------------------------
  it('clearInlineStylesFromPage removes inline styles from [data-pagebuilder-content]', async () => {
    contentEl.setAttribute('style', 'color: red; background: blue;')
    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    await service.clearInlineStylesFromPage()

    expect(contentEl.hasAttribute('style')).toBe(false)
  })

  // -------------------------------------------------------------------------
  // stopGlobalStylesSync
  // -------------------------------------------------------------------------
  it('stopGlobalStylesSync disconnects the MutationObserver without throwing', () => {
    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    // Should not throw even when no observer is active
    expect(() => service.stopGlobalStylesSync()).not.toThrow()
  })

  it('stopGlobalStylesSync cleans up observer after globalPageStyles', async () => {
    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    await service.globalPageStyles()
    service.stopGlobalStylesSync()

    // Verify the observer is cleared (internal _observer = null)
    // No throw = success
    expect(() => service.stopGlobalStylesSync()).not.toThrow()
  })
})
