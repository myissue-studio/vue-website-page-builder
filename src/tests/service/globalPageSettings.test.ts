// @vitest-environment jsdom
/**
 * Regression tests for global page settings persistence.
 *
 * Bug fixed: When a user applied global page styles (e.g. custom classes/styles on
 * #pagebuilder) and then closed the modal and clicked Publish,
 * the parent app re-called startBuilder() which triggered mountComponentsToDOM()
 * with usePassedPageSettings=true. If config.pageSettings was not set, the DOM
 * element's classes were wiped because _pendingPageSettings was null.
 *
 * Fix: mountComponentsToDOM now reads the current DOM state of #pagebuilder
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
  let pagebuilderEl: HTMLElement
  let contentEl: HTMLElement

  beforeEach(() => {
    localStorage.clear()
    pagebuilderEl = document.createElement('div')
    pagebuilderEl.setAttribute('id', 'pagebuilder')
    contentEl = document.createElement('div')
    contentEl.setAttribute('data-pagebuilder-content', '')
    pagebuilderEl.appendChild(contentEl)
    document.body.appendChild(pagebuilderEl)
  })

  afterEach(() => {
    if (pagebuilderEl.parentNode) {
      pagebuilderEl.parentNode.removeChild(pagebuilderEl)
    }
    localStorage.clear()
  })

  // -------------------------------------------------------------------------
  // Regression: global styles preserved on remount
  // -------------------------------------------------------------------------
  it('REGRESSION: preserves DOM classes when config has no pageSettings and Vue re-renders', async () => {
    const appliedClasses = 'pbx-font-jost pbx-text-black pbx-bg-emerald-300 pbx-border-8'
    pagebuilderEl.setAttribute('class', appliedClasses)

    // Mock setComponents to simulate Vue re-rendering content wrappers.
    // (this is what happens in production when setComponents triggers a re-render)
    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
        // No pageSettings — this was the bug trigger
      },
      setComponents: vi.fn().mockImplementation(() => {
        contentEl.removeAttribute('class')
        contentEl.removeAttribute('style')
      }),
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as {
      mountComponentsToDOM: (html: string, usePassedPageSettings?: boolean) => Promise<void>
    }

    await svc.mountComponentsToDOM(SECTION_HTML, true /* usePassedPageSettings */)
    await nextTick()

    const resultEl = document.querySelector('#pagebuilder')
    expect(resultEl?.getAttribute('class')).toBe(appliedClasses)
    expect(contentEl.hasAttribute('class')).toBe(false)
  })

  it('exports full page HTML with global page settings on the #pagebuilder wrapper', async () => {
    const components: Array<{ html_code: string; id: string | null; title: string }> = []
    const appliedClasses = 'pbx-font-jost pbx-text-black pbx-bg-emerald-300'
    const appliedStyle = 'background-color: rgb(52, 211, 153); color: rgb(17, 24, 39);'

    pagebuilderEl.setAttribute('class', appliedClasses)
    pagebuilderEl.setAttribute('style', appliedStyle)
    contentEl.innerHTML = SECTION_HTML

    const mockStore = createMockStore({
      setComponents: vi.fn().mockImplementation((nextComponents) => {
        components.splice(0, components.length, ...nextComponents)
      }),
    })
    Object.defineProperty(mockStore, 'getComponents', {
      get: () => components,
    })

    const service = new PageBuilderService(mockStore)

    const html = await service.generateFullPageHtml()
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const exportedPagebuilder = doc.querySelector('#pagebuilder')
    const exportedSection = doc.querySelector('section')

    expect(exportedPagebuilder?.getAttribute('class')).toBe(appliedClasses)
    expect(exportedPagebuilder?.getAttribute('style')).toContain('background-color')
    expect(exportedPagebuilder?.getAttribute('style')).toContain('color')
    expect(exportedSection?.getAttribute('data-componentid')).toBeNull()
    expect(exportedSection?.getAttribute('data-component-title')).toBe('Test')
  })

  it('REGRESSION: preserves inline styles when config has no pageSettings and Vue re-renders', async () => {
    pagebuilderEl.setAttribute('style', 'background-color: rgb(52, 211, 153);')

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      setComponents: vi.fn().mockImplementation(() => {
        contentEl.removeAttribute('class')
        contentEl.removeAttribute('style')
      }),
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as {
      mountComponentsToDOM: (html: string, usePassedPageSettings?: boolean) => Promise<void>
    }

    await svc.mountComponentsToDOM(SECTION_HTML, true)
    await nextTick()

    const resultEl = document.querySelector('#pagebuilder')
    // Style is converted via parseStyleString → convertStyleObjectToString, so check it's non-empty
    const styleAttr = resultEl?.getAttribute('style') ?? ''
    expect(styleAttr.length).toBeGreaterThan(0)
    expect(contentEl.hasAttribute('style')).toBe(false)
  })

  it('REGRESSION: uses last known page settings when DOM/config/localStorage are missing wrapper settings', async () => {
    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      setComponents: vi.fn(),
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as {
      _lastKnownPageSettings: { classes: string; style: string }
      mountComponentsToDOM: (html: string, usePassedPageSettings?: boolean) => Promise<void>
    }

    // Simulate persisted singleton memory from a previous open session.
    svc._lastKnownPageSettings = {
      classes: 'pbx-font-jost pbx-text-black pbx-bg-emerald-300',
      style: 'background-color: rgb(52, 211, 153);',
    }

    await svc.mountComponentsToDOM(SECTION_HTML, true)
    await nextTick()

    const resultEl = document.querySelector('#pagebuilder')
    expect(resultEl?.getAttribute('class')).toContain('pbx-bg-emerald-300')
    expect(resultEl?.getAttribute('style')).toContain('background-color')
  })

  it('startBuilder snapshots existing wrapper classes/styles as last known settings', async () => {
    pagebuilderEl.setAttribute('class', 'pbx-font-jost pbx-text-black pbx-bg-zinc-100')
    pagebuilderEl.setAttribute('style', 'letter-spacing: 0.5px;')

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      setComponents: vi.fn(),
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as {
      _lastKnownPageSettings: { classes?: string; style?: string } | null
    }

    await service.startBuilder(
      {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      [],
    )

    expect(svc._lastKnownPageSettings).not.toBeNull()
    expect(svc._lastKnownPageSettings?.classes).toContain('pbx-bg-zinc-100')
    expect(String(svc._lastKnownPageSettings?.style || '')).toContain('letter-spacing')
  })

  it('REGRESSION: startBuilder hydrates runtime config.pageSettings from live wrapper when incoming config omits pageSettings', async () => {
    pagebuilderEl.setAttribute('class', 'pbx-font-jost pbx-text-black pbx-bg-zinc-100')
    pagebuilderEl.setAttribute('style', 'letter-spacing: 0.5px; color: rgb(10, 20, 30);')
    pagebuilderEl.setAttribute('data-meta-title', 'Live Wrapper Title')
    pagebuilderEl.setAttribute('data-meta-description', 'Live Wrapper Description')

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      setComponents: vi.fn(),
    })

    const service = new PageBuilderService(mockStore)

    await service.startBuilder(
      {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      [],
    )

    expect(mockStore.setPageBuilderConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSettings: expect.objectContaining({
          classes: expect.stringContaining('pbx-bg-zinc-100'),
          style: expect.stringContaining('letter-spacing: 0.5px'),
          meta: expect.objectContaining({
            title: 'Live Wrapper Title',
            description: 'Live Wrapper Description',
          }),
        }),
      }),
    )
  })

  it('REGRESSION: startBuilder with empty incoming array still restores pageSettings from localStorage', async () => {
    localStorage.setItem(
      'test-key',
      JSON.stringify({
        components: [
          {
            html_code:
              '<section data-component-title="Text"><div><p>Recovered from draft</p></div></section>',
            title: 'Text',
          },
        ],
        pageBuilderContentSavedAt: new Date().toISOString(),
        pageSettings: {
          classes: 'pbx-font-jost pbx-text-black pbx-bg-emerald-300',
          style: { letterSpacing: '0.5px' },
        },
      }),
    )

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'create', formName: 'article' },
      },
      setComponents: vi.fn(),
    })

    const service = new PageBuilderService(mockStore)

    await service.startBuilder(
      {
        updateOrCreate: { formType: 'create', formName: 'article' },
      },
      [],
    )
    await nextTick()

    const resultEl = document.querySelector('#pagebuilder')
    expect(resultEl?.getAttribute('class')).toContain('pbx-bg-emerald-300')
    expect(resultEl?.getAttribute('style')).toContain('letter-spacing')
  })

  it('REGRESSION: preserves both classes and styles simultaneously', async () => {
    pagebuilderEl.setAttribute('class', 'pbx-font-jost pbx-bg-black')
    pagebuilderEl.setAttribute('style', 'color: red;')

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      setComponents: vi.fn().mockImplementation(() => {
        contentEl.removeAttribute('class')
        contentEl.removeAttribute('style')
      }),
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as {
      mountComponentsToDOM: (html: string, usePassedPageSettings?: boolean) => Promise<void>
    }

    await svc.mountComponentsToDOM(SECTION_HTML, true)
    await nextTick()

    const resultEl = document.querySelector('#pagebuilder')
    expect(resultEl?.getAttribute('class')).toBe('pbx-font-jost pbx-bg-black')
    expect((resultEl?.getAttribute('style') ?? '').length).toBeGreaterThan(0)
    expect(contentEl.hasAttribute('class')).toBe(false)
    expect(contentEl.hasAttribute('style')).toBe(false)
  })

  // -------------------------------------------------------------------------
  // Config pageSettings takes precedence over DOM
  // -------------------------------------------------------------------------
  it('uses config.pageSettings when explicitly provided (overrides DOM)', async () => {
    // DOM has different classes
    pagebuilderEl.setAttribute('class', 'pbx-some-old-class')

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
    const svc = service as unknown as {
      mountComponentsToDOM: (html: string, usePassedPageSettings?: boolean) => Promise<void>
    }

    await svc.mountComponentsToDOM(SECTION_HTML, true)
    await nextTick()

    const resultEl = document.querySelector('#pagebuilder')
    // config.pageSettings takes precedence
    expect(resultEl?.getAttribute('class')).toBe('pbx-font-raleway pbx-text-white')
    expect(contentEl.hasAttribute('class')).toBe(false)
  })

  // -------------------------------------------------------------------------
  // No classes in DOM — nothing to preserve
  // -------------------------------------------------------------------------
  it('does not apply empty classes when DOM element has none', async () => {
    // pagebuilderEl has NO classes

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as {
      mountComponentsToDOM: (html: string, usePassedPageSettings?: boolean) => Promise<void>
    }

    await svc.mountComponentsToDOM(SECTION_HTML, true)
    await nextTick()

    const resultEl = document.querySelector('#pagebuilder')
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

    expect(mockStore.setElement).toHaveBeenCalledWith(pagebuilderEl)
  })

  it('globalPageStyles adds data-global-selected attribute', async () => {
    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    await service.globalPageStyles()

    expect(pagebuilderEl.hasAttribute('data-global-selected')).toBe(true)
  })

  it('globalPageStyles does nothing when no #pagebuilder exists', async () => {
    pagebuilderEl.parentNode?.removeChild(pagebuilderEl)

    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    // Should not throw
    await expect(service.globalPageStyles()).resolves.toBeUndefined()
  })

  // -------------------------------------------------------------------------
  // clearClassesFromPage
  // -------------------------------------------------------------------------
  it('clearClassesFromPage removes all classes from #pagebuilder', async () => {
    pagebuilderEl.setAttribute('class', 'pbx-font-jost pbx-text-black')
    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    await service.clearClassesFromPage()

    expect(pagebuilderEl.hasAttribute('class')).toBe(false)
  })

  it('clearClassesFromPage leaves content wrapper classes alone', async () => {
    pagebuilderEl.setAttribute('class', 'pbx-font-jost')
    contentEl.setAttribute('class', 'section-local-class')

    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    await service.clearClassesFromPage()

    expect(pagebuilderEl.hasAttribute('class')).toBe(false)
    expect(contentEl.getAttribute('class')).toBe('section-local-class')
  })

  it('replaceTheme clears Page Design global classes and styles before applying theme', async () => {
    pagebuilderEl.setAttribute(
      'class',
      'pbx-font-jost pbx-bg-rose-400 pbx-full-width-component pbx-text-slate-800',
    )
    pagebuilderEl.setAttribute('style', 'color:#111111')
    contentEl.innerHTML = SECTION_HTML

    localStorage.setItem(
      'page-builder-update-resource-page',
      JSON.stringify({
        components: [{ html_code: SECTION_HTML, id: 'old', title: 'Old' }],
        pageSettings: {
          classes: 'pbx-font-jost pbx-bg-rose-400 pbx-full-width-component',
          style: 'color:#111111',
        },
      }),
    )

    const config = {
      updateOrCreate: { formType: 'update', formName: 'page' },
      pageSettings: {
        classes: 'pbx-font-jost pbx-bg-rose-400 pbx-full-width-component',
        style: 'color:#111111',
      },
      userSettings: { autoSave: false },
    }
    const mockStore = createMockStore({
      getPageBuilderConfig: config,
      getLocalStorageItemName: 'page-builder-update-resource-page',
      getComponents: [{ html_code: SECTION_HTML, id: 'old', title: 'Old' }],
      setPageBuilderConfig: vi.fn((next) => {
        Object.assign(config, next)
      }),
    })
    const service = new PageBuilderService(mockStore)

    await service.replaceTheme(
      '<section data-component-title="Theme Section"><div><h2>Fresh theme</h2></div></section>',
    )

    expect(pagebuilderEl.getAttribute('class') || '').not.toContain('pbx-bg-rose-400')
    expect(pagebuilderEl.getAttribute('class') || '').not.toContain('pbx-full-width-component')
    expect(pagebuilderEl.getAttribute('class') || '').not.toContain('pbx-text-slate-800')
    expect(pagebuilderEl.getAttribute('class') || '').not.toContain('pbx-font-jost')
    expect(pagebuilderEl.getAttribute('style') || '').not.toContain('color:#111111')
    expect(config.pageSettings).toEqual(
      expect.objectContaining({
        classes: '',
        style: '',
      }),
    )
    expect(mockStore.setFontFamily).toHaveBeenCalledWith('none')
    expect(mockStore.setBackgroundColor).toHaveBeenCalledWith(null)
    expect(mockStore.setTextColor).toHaveBeenCalledWith(null)
    expect(mockStore.setComponents).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Theme Section',
          html_code: expect.stringContaining('Fresh theme'),
        }),
      ]),
    )

    const persisted = JSON.parse(
      localStorage.getItem('page-builder-update-resource-page') || '{}',
    ) as { pageSettings?: { classes?: string; style?: string } }
    expect(persisted.pageSettings?.classes || '').not.toContain('pbx-bg-rose-400')
    expect(persisted.pageSettings?.style || '').not.toContain('color:#111111')
  })

  // -------------------------------------------------------------------------
  // REGRESSION: v-if reopen — importedPageBuilder before live DOM
  // -------------------------------------------------------------------------
  it('REGRESSION (reopen): mounted HTML class overrides fresh DOM defaults when builder was missing at start', async () => {
    // Simulate a v-if reopen: #pagebuilder just rendered by Vue with only default classes.
    pagebuilderEl.setAttribute('class', 'pbx-text-black pbx-font-sans')

    // The saved HTML (from getSavedPageHtml) carries the user's custom class.
    const savedHtml = `<div id="pagebuilder" class="pbx-text-black pbx-bg-red-500">\n${SECTION_HTML}\n</div>`

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      setComponents: vi.fn(),
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as {
      isPageBuilderMissingOnStart: boolean
      mountComponentsToDOM: (html: string, usePassedPageSettings?: boolean) => Promise<void>
    }

    // Flag that the builder was missing at start (v-if reopen pattern).
    svc.isPageBuilderMissingOnStart = true

    await svc.mountComponentsToDOM(savedHtml, undefined)
    await nextTick()

    const resultEl = document.querySelector('#pagebuilder')
    // Custom class from saved HTML must win over the fresh DOM default.
    expect(resultEl?.getAttribute('class')).toContain('pbx-bg-red-500')
  })

  it('REGRESSION (reopen, usePassedPageSettings): memory beats fresh DOM when builder was missing at start', async () => {
    // Simulate fresh DOM after v-if reopen — only default Vue :class binding.
    pagebuilderEl.setAttribute('class', 'pbx-text-black pbx-font-sans')

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      setComponents: vi.fn(),
    })

    const service = new PageBuilderService(mockStore)
    const svc = service as unknown as {
      _lastKnownPageSettings: { classes: string; style: string } | null
      mountComponentsToDOM: (html: string, usePassedPageSettings?: boolean) => Promise<void>
    }

    // _lastKnownPageSettings was captured in startBuilder() from localStorage.
    svc._lastKnownPageSettings = {
      classes: 'pbx-text-black pbx-bg-sky-600',
      style: '',
    }

    // usePassedPageSettings = true is the path taken when fresh components are passed.
    await svc.mountComponentsToDOM(SECTION_HTML, true)
    await nextTick()

    const resultEl = document.querySelector('#pagebuilder')
    // Memory (previous session's saved classes) must win over fresh DOM defaults.
    expect(resultEl?.getAttribute('class')).toContain('pbx-bg-sky-600')
  })

  it('REGRESSION (resume draft): continue where left off restores global wrapper classes and styles', async () => {
    // Simulate fresh wrapper defaults rendered before user clicks "Continue where I left off".
    pagebuilderEl.setAttribute('class', 'pbx-font-pt-serif')
    pagebuilderEl.setAttribute('style', 'letter-spacing: 0.5px;')

    localStorage.setItem(
      'test-key',
      JSON.stringify({
        components: [
          {
            html_code: SECTION_HTML,
            title: 'Test',
          },
        ],
        pageBuilderContentSavedAt: new Date().toISOString(),
        pageSettings: {
          classes: 'pbx-font-pt-serif pbx-bg-orange-600 pbx-py-96 pbx-rounded-full',
          style: {
            letterSpacing: '0.5px',
            color: 'rgb(229, 211, 82)',
          },
        },
      }),
    )

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      setComponents: vi.fn(),
    })

    const service = new PageBuilderService(mockStore)
    await service.resumeEditingFromDraft()
    await nextTick()

    const resultEl = document.querySelector('#pagebuilder')
    const classAttr = resultEl?.getAttribute('class') || ''
    const styleAttr = resultEl?.getAttribute('style') || ''

    expect(classAttr).toContain('pbx-bg-orange-600')
    expect(classAttr).toContain('pbx-py-96')
    expect(classAttr).toContain('pbx-rounded-full')
    expect(styleAttr).toContain('letter-spacing')
    expect(styleAttr).toContain('color')
  })

  it('REGRESSION (resume draft): imported wrapper classes override fresh DOM defaults', async () => {
    // Fresh DOM defaults should not override saved draft wrapper classes.
    pagebuilderEl.setAttribute('class', 'pbx-text-black pbx-font-sans')

    localStorage.setItem(
      'test-key',
      JSON.stringify({
        components: [
          {
            html_code: SECTION_HTML,
            title: 'Test',
          },
        ],
        pageBuilderContentSavedAt: new Date().toISOString(),
        pageSettings: {
          classes: 'pbx-text-black pbx-bg-red-500',
          style: '',
        },
      }),
    )

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      setComponents: vi.fn(),
    })

    const service = new PageBuilderService(mockStore)
    await service.resumeEditingFromDraft()
    await nextTick()

    const resultEl = document.querySelector('#pagebuilder')
    expect(resultEl?.getAttribute('class')).toContain('pbx-bg-red-500')
  })

  it('REGRESSION (resume draft): imported wrapper styles override fresh DOM defaults', async () => {
    pagebuilderEl.setAttribute('style', 'letter-spacing: 0.5px;')

    localStorage.setItem(
      'test-key',
      JSON.stringify({
        components: [
          {
            html_code: SECTION_HTML,
            title: 'Test',
          },
        ],
        pageBuilderContentSavedAt: new Date().toISOString(),
        pageSettings: {
          classes: 'pbx-font-pt-serif',
          style: {
            letterSpacing: '0.5px',
            color: 'rgb(229, 211, 82)',
          },
        },
      }),
    )

    const mockStore = createMockStore({
      getPageBuilderConfig: {
        updateOrCreate: { formType: 'update', formName: 'article' },
      },
      setComponents: vi.fn(),
    })

    const service = new PageBuilderService(mockStore)
    await service.resumeEditingFromDraft()
    await nextTick()

    const styleAttr = document.querySelector('#pagebuilder')?.getAttribute('style') || ''
    expect(styleAttr).toContain('letter-spacing')
    expect(styleAttr).toContain('color')
  })

  // -------------------------------------------------------------------------
  // clearInlineStylesFromPage
  // -------------------------------------------------------------------------
  it('clearInlineStylesFromPage removes inline styles from #pagebuilder', async () => {
    pagebuilderEl.setAttribute('style', 'color: red; background: blue;')
    const mockStore = createMockStore()
    const service = new PageBuilderService(mockStore)

    await service.clearInlineStylesFromPage()

    expect(pagebuilderEl.hasAttribute('style')).toBe(false)
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

  // -------------------------------------------------------------------------
  // Regression: global styles preserved after element delete / duplicate
  // -------------------------------------------------------------------------
  describe('element delete and duplicate', () => {
    const GLOBAL_CLASSES = 'pbx-font-jost pbx-text-black pbx-bg-emerald-300'

    function createWipingSetComponentsMock() {
      return vi.fn().mockImplementation(() => {
        document.querySelectorAll('[data-pagebuilder-content]').forEach((el) => {
          el.removeAttribute('class')
          el.removeAttribute('style')
        })
      })
    }

    function setupPageBuilderDom() {
      document.body.innerHTML = ''
      const pagebuilder = document.createElement('div')
      pagebuilder.id = 'pagebuilder'
      pagebuilder.setAttribute('class', GLOBAL_CLASSES)
      const wrapper = document.createElement('div')
      wrapper.setAttribute('data-pagebuilder-content', '')

      const section = document.createElement('section')
      section.setAttribute('data-componentid', 'test-abc')
      section.setAttribute('data-component-title', 'Test')

      const row = document.createElement('div')
      row.className = 'row-a'
      row.textContent = 'Row A'

      const rowB = document.createElement('div')
      rowB.className = 'row-b'
      rowB.textContent = 'Row B'

      section.appendChild(row)
      section.appendChild(rowB)
      wrapper.appendChild(section)
      pagebuilder.appendChild(wrapper)
      document.body.appendChild(pagebuilder)

      return { pagebuilder, wrapper, section, row, rowB }
    }

    it('REGRESSION: syncDomToStoreOnly preserves global classes after Vue remount', async () => {
      setupPageBuilderDom()
      const mockStore = createMockStore({ setComponents: createWipingSetComponentsMock() })
      const service = new PageBuilderService(mockStore)

      await service.syncDomToStoreOnly()

      const resultEl = document.querySelector('#pagebuilder')
      const wrapper = document.querySelector('[data-pagebuilder-content]')
      expect(resultEl?.getAttribute('class')).toBe(GLOBAL_CLASSES)
      expect(wrapper?.hasAttribute('class')).toBe(false)
    })

    it('REGRESSION: deleteElementFromDOM preserves global classes', async () => {
      const { row } = setupPageBuilderDom()
      const mockStore = createMockStore({
        getElement: row,
        setComponents: createWipingSetComponentsMock(),
      })
      const service = new PageBuilderService(mockStore)

      await service.deleteElementFromDOM()

      const resultEl = document.querySelector('#pagebuilder')
      const wrapper = document.querySelector('[data-pagebuilder-content]')
      expect(resultEl?.getAttribute('class')).toBe(GLOBAL_CLASSES)
      expect(wrapper?.hasAttribute('class')).toBe(false)
    })

    it('REGRESSION: duplicateElementInDOM preserves global classes', async () => {
      const { row } = setupPageBuilderDom()
      const mockStore = createMockStore({
        getElement: row,
        setComponents: createWipingSetComponentsMock(),
      })
      const service = new PageBuilderService(mockStore)

      await service.duplicateElementInDOM()

      const resultEl = document.querySelector('#pagebuilder')
      const wrapper = document.querySelector('[data-pagebuilder-content]')
      expect(resultEl?.getAttribute('class')).toBe(GLOBAL_CLASSES)
      expect(wrapper?.hasAttribute('class')).toBe(false)
    })
  })
})
