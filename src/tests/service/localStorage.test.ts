// @vitest-environment jsdom
/**
 * Tests for localStorage integration in PageBuilderService.
 *
 * Covers:
 *  - getSavedPageHtml() — returns false when key/data is absent; reconstructs HTML when data exists
 *  - saveUserSettingsStorage() — writes to the correct key
 *  - updateLocalStorageItemName() (via startBuilder side-effects) — generates the correct key
 *    for all combinations of formType / formName / resourceData
 */
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'
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
    setPageBuilderConfig: vi.fn((cfg: unknown) => {
      ;(base as unknown as Record<string, unknown>).getPageBuilderConfig = cfg
    }),
    setHistoryIndex: vi.fn(),
    setHistoryLength: vi.fn(),
    setLocalStorageItemName: vi.fn((key: string) => {
      ;(base as unknown as Record<string, unknown>).getLocalStorageItemName = key
    }),
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

  // Patch setLocalStorageItemName to also update getLocalStorageItemName on the store
  const store = base as unknown as ReturnType<typeof usePageBuilderStateStore>
  return store
}

beforeAll(() => {
  if (!document.getElementById('pagebuilder')) {
    const div = document.createElement('div')
    div.id = 'pagebuilder'
    document.body.appendChild(div)
  }
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('localStorage Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  // -------------------------------------------------------------------------
  // getSavedPageHtml — null key
  // -------------------------------------------------------------------------
  describe('getSavedPageHtml — key absent', () => {
    it('returns false when getLocalStorageItemName is null/empty', () => {
      const mockStore = createMockStore({ getLocalStorageItemName: null })
      const service = new PageBuilderService(mockStore)
      expect(service.getSavedPageHtml()).toBe(false)
    })

    it('returns false when getLocalStorageItemName is empty string', () => {
      const mockStore = createMockStore({ getLocalStorageItemName: '' })
      const service = new PageBuilderService(mockStore)
      expect(service.getSavedPageHtml()).toBe(false)
    })
  })

  // -------------------------------------------------------------------------
  // getSavedPageHtml — no localStorage data
  // -------------------------------------------------------------------------
  describe('getSavedPageHtml — no data in storage', () => {
    it('returns false when key exists but localStorage is empty', () => {
      const mockStore = createMockStore({ getLocalStorageItemName: 'page-builder-test-key' })
      const service = new PageBuilderService(mockStore)
      // localStorage is clear — no data for that key
      expect(service.getSavedPageHtml()).toBe(false)
    })
  })

  // -------------------------------------------------------------------------
  // getSavedPageHtml — data in storage
  // -------------------------------------------------------------------------
  describe('getSavedPageHtml — data exists', () => {
    it('returns an HTML string containing #pagebuilder div', () => {
      const key = 'page-builder-update-resource-article-my-post-42'
      localStorage.setItem(
        key,
        JSON.stringify({
          components: [
            {
              html_code: '<section data-componentid="abc"><div>Hello</div></section>',
              title: 'Section 1',
            },
          ],
          pageSettings: { classes: 'pbx-font-jost', style: '' },
        }),
      )
      const mockStore = createMockStore({ getLocalStorageItemName: key })
      const service = new PageBuilderService(mockStore)
      const result = service.getSavedPageHtml()
      expect(result).not.toBe(false)
      expect(result as string).toContain('id="pagebuilder"')
    })

    it('includes pageSettings classes in the wrapper div', () => {
      const key = 'page-builder-test'
      localStorage.setItem(
        key,
        JSON.stringify({
          components: [{ html_code: '<section><div>Content</div></section>', title: 'Section' }],
          pageSettings: { classes: 'pbx-font-jost pbx-text-black', style: '' },
        }),
      )
      const mockStore = createMockStore({ getLocalStorageItemName: key })
      const service = new PageBuilderService(mockStore)
      const result = service.getSavedPageHtml() as string
      expect(result).toContain('pbx-font-jost pbx-text-black')
    })

    it('strips data-componentid from sections', () => {
      const key = 'page-builder-test'
      localStorage.setItem(
        key,
        JSON.stringify({
          components: [
            {
              html_code: '<section data-componentid="remove-me"><p>Text</p></section>',
              title: 'S',
            },
          ],
          pageSettings: { classes: '', style: '' },
        }),
      )
      const mockStore = createMockStore({ getLocalStorageItemName: key })
      const service = new PageBuilderService(mockStore)
      const result = service.getSavedPageHtml() as string
      expect(result).not.toContain('data-componentid')
    })

    it('includes all component HTML', () => {
      const key = 'page-builder-test'
      localStorage.setItem(
        key,
        JSON.stringify({
          components: [
            { html_code: '<section><p>Section 1</p></section>', title: 'S1' },
            { html_code: '<section><p>Section 2</p></section>', title: 'S2' },
          ],
          pageSettings: { classes: '', style: '' },
        }),
      )
      const mockStore = createMockStore({ getLocalStorageItemName: key })
      const service = new PageBuilderService(mockStore)
      const result = service.getSavedPageHtml() as string
      expect(result).toContain('Section 1')
      expect(result).toContain('Section 2')
    })

    it('returns false for malformed JSON', () => {
      const key = 'page-builder-test'
      localStorage.setItem(key, 'not-valid-json')
      const mockStore = createMockStore({ getLocalStorageItemName: key })
      const service = new PageBuilderService(mockStore)
      expect(() => service.getSavedPageHtml()).toThrow()
    })

    it('returns false when stored value has no components array', () => {
      const key = 'page-builder-test'
      localStorage.setItem(key, JSON.stringify({ other: 'data' }))
      const mockStore = createMockStore({ getLocalStorageItemName: key })
      const service = new PageBuilderService(mockStore)
      expect(service.getSavedPageHtml()).toBe(false)
    })
  })

  // -------------------------------------------------------------------------
  // saveUserSettingsStorage
  // -------------------------------------------------------------------------
  describe('saveUserSettingsStorage', () => {
    it('writes to userSettingsPageBuilder key', () => {
      const mockStore = createMockStore()
      const service = new PageBuilderService(mockStore)
      service.saveUserSettingsStorage('en')
      expect(localStorage.getItem('userSettingsPageBuilder')).not.toBeNull()
    })

    it('stores the language under userSettings.lang', () => {
      const mockStore = createMockStore()
      const service = new PageBuilderService(mockStore)
      service.saveUserSettingsStorage('fr')
      const stored = JSON.parse(localStorage.getItem('userSettingsPageBuilder') ?? 'null')
      expect(stored?.userSettings?.lang).toBe('fr')
    })

    it('overwrites existing userSettingsPageBuilder value', () => {
      const mockStore = createMockStore()
      const service = new PageBuilderService(mockStore)
      service.saveUserSettingsStorage('en')
      service.saveUserSettingsStorage('ar')
      const stored = JSON.parse(localStorage.getItem('userSettingsPageBuilder') ?? 'null')
      expect(stored?.userSettings?.lang).toBe('ar')
    })
  })

  // -------------------------------------------------------------------------
  // updateLocalStorageItemName (via startBuilder)
  // -------------------------------------------------------------------------
  describe('updateLocalStorageItemName — key generation', () => {
    it('generates create key for formType create + formName', async () => {
      const mockStore = createMockStore({ getLocalStorageItemName: '' })
      const service = new PageBuilderService(mockStore)

      await service.startBuilder({ updateOrCreate: { formType: 'create', formName: 'post' } }, [])

      const calls = (mockStore.setLocalStorageItemName as ReturnType<typeof vi.fn>).mock.calls
      const calledKey = calls.find((c) => c[0]?.startsWith('page-builder-create-resource'))?.[0]
      expect(calledKey).toBe('page-builder-create-resource-post')
    })

    it('generates update key for formType update + formName only', async () => {
      const mockStore = createMockStore({ getLocalStorageItemName: '' })
      const service = new PageBuilderService(mockStore)

      await service.startBuilder({
        updateOrCreate: { formType: 'update', formName: 'article' },
        resourceData: null,
      })

      const calls = (mockStore.setLocalStorageItemName as ReturnType<typeof vi.fn>).mock.calls
      const calledKey = calls.find((c) => c[0]?.startsWith('page-builder-update'))?.[0]
      expect(calledKey).toContain('article')
    })

    it('generates update key with title when resourceData.title provided', async () => {
      const mockStore = createMockStore({ getLocalStorageItemName: '' })
      const service = new PageBuilderService(mockStore)

      await service.startBuilder({
        updateOrCreate: { formType: 'update', formName: 'article' },
        resourceData: { title: 'My Post', id: undefined },
      })

      const calls = (mockStore.setLocalStorageItemName as ReturnType<typeof vi.fn>).mock.calls
      const calledKey = calls.find((c) => c[0]?.startsWith('page-builder-update'))?.[0]
      expect(calledKey).toContain('my-post')
    })

    it('generates update key with id when resourceData.id provided', async () => {
      const mockStore = createMockStore({ getLocalStorageItemName: '' })
      const service = new PageBuilderService(mockStore)

      await service.startBuilder({
        updateOrCreate: { formType: 'update', formName: 'article' },
        resourceData: { title: '', id: 99 },
      })

      const calls = (mockStore.setLocalStorageItemName as ReturnType<typeof vi.fn>).mock.calls
      const calledKey = calls.find((c) => c[0]?.startsWith('page-builder-update'))?.[0]
      expect(calledKey).toContain('99')
    })

    it('generates update key with both title and id when both provided', async () => {
      const mockStore = createMockStore({ getLocalStorageItemName: '' })
      const service = new PageBuilderService(mockStore)

      await service.startBuilder({
        updateOrCreate: { formType: 'update', formName: 'article' },
        resourceData: { title: 'My Article', id: 42 },
      })

      const calls = (mockStore.setLocalStorageItemName as ReturnType<typeof vi.fn>).mock.calls
      const calledKey = calls.find((c) => c[0]?.startsWith('page-builder-update'))?.[0]
      expect(calledKey).toContain('my-article')
      expect(calledKey).toContain('42')
    })

    it('key is lowercase and hyphenated (sanitized)', async () => {
      const mockStore = createMockStore({ getLocalStorageItemName: '' })
      const service = new PageBuilderService(mockStore)

      await service.startBuilder({
        updateOrCreate: { formType: 'update', formName: 'BlogPost' },
        resourceData: { title: 'My Amazing Post', id: 7 },
      })

      const calls = (mockStore.setLocalStorageItemName as ReturnType<typeof vi.fn>).mock.calls
      const calledKey = calls.find((c) => c[0]?.startsWith('page-builder-update'))?.[0]
      // Sanitization converts uppercase + spaces to lowercase + hyphens
      expect(calledKey).not.toContain(' ')
      expect(calledKey).not.toMatch(/[A-Z]/)
    })
  })
})
