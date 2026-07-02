// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest'
import { PageBuilderService, AVAILABLE_LANGUAGES } from '../../services/PageBuilderService'
import { usePageBuilderStateStore } from '../../stores/page-builder-state'
import componentsArray from '../componentsArray.test.json'

// ---------------------------------------------------------------------------
// Shared mock store factory
// ---------------------------------------------------------------------------
function createMockStore() {
  const base: Record<string, unknown> = {
    getApplyImageToSelection: { src: '' },
    getLocalStorageItemName: 'test-key',
    getHyberlinkEnable: false,
    getComponents: [] as unknown[],
    getComponent: null as unknown,
    getElement: null as HTMLElement | null,
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
    getPageBuilderConfig: null as unknown,
    getCurrentPreviewImage: null,
    getImageSettingsPanelOpen: false,
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
    getInlineTipTapEditor: false,
    // Actions
    setBuilderStarted: vi.fn(),
    setPageBuilderConfig: vi.fn((cfg: unknown) => {
      base.getPageBuilderConfig = cfg
    }),
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
    setElement: vi.fn((payload: HTMLElement | null) => {
      base.getElement = payload
    }),
    setComponent: vi.fn(),
    setComponents: vi.fn(),
    setPushComponents: vi.fn(),
    setBasePrimaryImage: vi.fn(),
    setCurrentLayoutPreview: vi.fn(),
    setApplyImageToSelection: vi.fn(),
    setImageSettingsPanelOpen: vi.fn((payload: boolean) => {
      base.getImageSettingsPanelOpen = payload
    }),
    setCurrentPreviewImage: vi.fn(),
    setIsLoadingGlobal: vi.fn(),
    setIsSaving: vi.fn(),
    setHasLocalDraftForUpdate: vi.fn(),
    setIsLoadingResumeEditing: vi.fn(),
    setIsRestoring: vi.fn(),
    setCurrentLanguage: vi.fn(),
    setToggleGlobalHtmlMode: vi.fn(),
    setInlineTipTapEditor: vi.fn((payload: boolean) => {
      base.getInlineTipTapEditor = payload
    }),
  }
  return base as unknown as ReturnType<typeof usePageBuilderStateStore>
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeAll(() => {
  const div = document.createElement('div')
  div.id = 'pagebuilder'
  document.body.appendChild(div)
})

const updateConfig = {
  updateOrCreate: { formType: 'update' as const, formName: 'collection' },
}
const createConfig = {
  updateOrCreate: { formType: 'create' as const, formName: 'article' },
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('PageBuilderService', () => {
  let service: PageBuilderService
  let mockStore: ReturnType<typeof createMockStore>

  beforeEach(() => {
    localStorage.clear()
    mockStore = createMockStore()
    service = new PageBuilderService(mockStore)
  })

  afterEach(() => {
    localStorage.clear()
  })

  // --- startBuilder ---
  describe('startBuilder', () => {
    it('returns success message with valid update config and components', async () => {
      const result = await service.startBuilder(updateConfig, componentsArray)
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
      expect(mockStore.setBuilderStarted).toHaveBeenCalledWith(true)
      expect(mockStore.setPageBuilderConfig).toHaveBeenCalledWith(updateConfig)
    })

    it('returns passedComponentsArray in result', async () => {
      const result = await service.startBuilder(updateConfig, componentsArray)
      expect(result).toHaveProperty('passedComponentsArray')
      if ('passedComponentsArray' in result) {
        expect(result.passedComponentsArray).toHaveLength(componentsArray.length)
      }
    })

    it('returns validation error when no components array passed', async () => {
      const result = await service.startBuilder(updateConfig)
      expect(result).toHaveProperty('validation.error', true)
      if ('validation' in result && result.validation && 'reason' in result.validation) {
        expect(result.validation.reason).toContain('array')
      }
    })

    it('returns validation warning when formType create with components', async () => {
      const result = await service.startBuilder(createConfig, componentsArray)
      expect(result).toHaveProperty('validation.error', true)
      if ('validation' in result && result.validation && 'warning' in result.validation) {
        expect(result.validation.warning).toContain('update')
      }
    })

    it('succeeds with empty components array and create config', async () => {
      const result = await service.startBuilder(createConfig, [])
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
    })

    it('calls setBuilderStarted(true) regardless of config validity', async () => {
      await service.startBuilder(createConfig)
      expect(mockStore.setBuilderStarted).toHaveBeenCalledWith(true)
    })

    it('handles minimal config gracefully', async () => {
      const minConfig = { updateOrCreate: { formType: 'create' as const, formName: 'post' } }
      const result = await service.startBuilder(minConfig)
      expect(result).not.toHaveProperty('error')
    })

    it('handles config with full userSettings', async () => {
      const config = {
        updateOrCreate: { formType: 'update' as const, formName: 'article' },
        userSettings: {
          language: { default: 'da', enable: ['en', 'da'] },
          autoSave: false,
          fontFamily: 'jost',
        },
      }
      const result = await service.startBuilder(config, componentsArray)
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
    })
  })

  // --- availableLanguage ---
  describe('availableLanguage', () => {
    it('returns an array', () => {
      expect(Array.isArray(service.availableLanguage())).toBe(true)
    })

    it('contains expected languages', () => {
      const langs = service.availableLanguage()
      expect(langs).toContain('en')
      expect(langs).toContain('da')
      expect(langs).toContain('fr')
      expect(langs).toContain('de')
      expect(langs).toContain('zh-Hans')
    })

    it('matches the exported AVAILABLE_LANGUAGES constant', () => {
      expect(service.availableLanguage()).toEqual(AVAILABLE_LANGUAGES)
    })

    it('has at least 10 languages', () => {
      expect(service.availableLanguage().length).toBeGreaterThanOrEqual(10)
    })
  })

  // --- changeLanguage ---
  describe('changeLanguage', () => {
    it('calls setCurrentLanguage on the store', () => {
      service.changeLanguage('da')
      expect(mockStore.setCurrentLanguage).toHaveBeenCalledWith('da')
    })

    it('passes through any string language code', () => {
      service.changeLanguage('custom-lang')
      expect(mockStore.setCurrentLanguage).toHaveBeenCalledWith('custom-lang')
    })
  })

  // --- isEditableElement ---
  describe('isEditableElement', () => {
    it('returns false for null', () => {
      expect(service.isEditableElement(null)).toBe(false)
    })

    it('returns true for DIV', () => {
      const el = document.createElement('div')
      expect(service.isEditableElement(el)).toBe(true)
    })

    it('returns true for SECTION', () => {
      const el = document.createElement('section')
      expect(service.isEditableElement(el)).toBe(true)
    })

    it('returns true for IMG', () => {
      const el = document.createElement('img')
      expect(service.isEditableElement(el)).toBe(true)
    })

    it('returns true for BUTTON', () => {
      const el = document.createElement('button')
      expect(service.isEditableElement(el)).toBe(true)
    })

    it('returns false for P (excluded tag)', () => {
      const el = document.createElement('p')
      expect(service.isEditableElement(el)).toBe(false)
    })

    it('returns false for H1 (excluded tag)', () => {
      const el = document.createElement('h1')
      expect(service.isEditableElement(el)).toBe(false)
    })

    it('returns false for SPAN (excluded tag)', () => {
      const el = document.createElement('span')
      expect(service.isEditableElement(el)).toBe(false)
    })

    it('returns false for A (excluded tag)', () => {
      const el = document.createElement('a')
      expect(service.isEditableElement(el)).toBe(false)
    })

    it('returns false for element inside [data-pb-no-select]', () => {
      const wrapper = document.createElement('div')
      wrapper.setAttribute('data-pb-no-select', '')
      const inner = document.createElement('div')
      wrapper.appendChild(inner)
      document.body.appendChild(wrapper)
      expect(service.isEditableElement(inner)).toBe(false)
      document.body.removeChild(wrapper)
    })

    it('returns true for IMG inside [data-pb-no-select] (always selectable)', () => {
      const wrapper = document.createElement('div')
      wrapper.setAttribute('data-pb-no-select', '')
      const img = document.createElement('img')
      wrapper.appendChild(img)
      document.body.appendChild(wrapper)
      expect(service.isEditableElement(img)).toBe(true)
      document.body.removeChild(wrapper)
    })
  })

  // --- sanitizeForLocalStorage ---
  describe('sanitizeForLocalStorage', () => {
    it('converts to lowercase', () => {
      expect(service.sanitizeForLocalStorage('Article')).toBe('article')
    })

    it('replaces spaces with hyphens', () => {
      expect(service.sanitizeForLocalStorage('my article')).toBe('my-article')
    })

    it('removes special characters', () => {
      expect(service.sanitizeForLocalStorage('article!')).toBe('article')
    })

    it('collapses multiple spaces into single hyphen', () => {
      expect(service.sanitizeForLocalStorage('my   article')).toBe('my-article')
    })

    it('trims leading and trailing spaces', () => {
      expect(service.sanitizeForLocalStorage('  article  ')).toBe('article')
    })

    it('removes leading and trailing hyphens', () => {
      expect(service.sanitizeForLocalStorage('-article-')).toBe('article')
    })

    it('handles empty string', () => {
      expect(service.sanitizeForLocalStorage('')).toBe('')
    })

    it('handles cms-page slug pattern', () => {
      expect(service.sanitizeForLocalStorage('cms-page-about')).toBe('cms-page-about')
    })
  })

  // --- cloneCompObjForDOMInsertion ---
  describe('cloneCompObjForDOMInsertion', () => {
    it('returns a new component with a fresh uuid id', () => {
      const component = {
        id: 'original-id',
        html_code: '<section><div>Content</div></section>',
        title: 'Test',
      }
      const cloned = service.cloneCompObjForDOMInsertion(component)
      expect(cloned.id).not.toBe('original-id')
      expect(typeof cloned.id).toBe('string')
      expect((cloned.id as string).length).toBeGreaterThan(10)
    })

    it('preserves the component title', () => {
      const component = {
        id: 'id-1',
        html_code: '<section><div>Content</div></section>',
        title: 'My Section',
      }
      const cloned = service.cloneCompObjForDOMInsertion(component)
      expect(cloned.title).toBe('My Section')
    })

    it('includes data-componentid attribute in html_code', () => {
      const component = {
        id: 'id-1',
        html_code: '<section><div>Content</div></section>',
        title: 'Test',
      }
      const cloned = service.cloneCompObjForDOMInsertion(component)
      expect(cloned.html_code).toContain('data-componentid=')
    })

    it('adds pbx- prefix to classes inside section', () => {
      const component = {
        id: 'id-1',
        html_code: '<section><div class="text-black font-bold">Content</div></section>',
        title: 'Test',
      }
      const cloned = service.cloneCompObjForDOMInsertion(component)
      expect(cloned.html_code).toContain('pbx-text-black')
      expect(cloned.html_code).toContain('pbx-font-bold')
    })

    it('does not double-prefix already-prefixed classes', () => {
      const component = {
        id: 'id-1',
        html_code: '<section><div class="pbx-text-black">Content</div></section>',
        title: 'Test',
      }
      const cloned = service.cloneCompObjForDOMInsertion(component)
      expect(cloned.html_code).not.toContain('pbx-pbx-')
    })
  })

  // --- canMoveUp / canMoveDown ---
  describe('canMoveUp and canMoveDown', () => {
    const comp1 = { id: '1', html_code: '<section>1</section>', title: 'C1' }
    const comp2 = { id: '2', html_code: '<section>2</section>', title: 'C2' }
    const comp3 = { id: '3', html_code: '<section>3</section>', title: 'C3' }

    it('canMoveUp returns false when no component selected', () => {
      expect(service.canMoveUp()).toBe(false)
    })

    it('canMoveDown returns false when no component selected', () => {
      expect(service.canMoveDown()).toBe(false)
    })

    it('canMoveUp returns false for first component', () => {
      ;(mockStore as unknown as Record<string, unknown>).getComponents = [comp1, comp2]
      ;(mockStore as unknown as Record<string, unknown>).getComponent = comp1
      const fresh = new PageBuilderService(mockStore)
      expect(fresh.canMoveUp()).toBe(false)
    })

    it('canMoveUp returns true for second component', () => {
      ;(mockStore as unknown as Record<string, unknown>).getComponents = [comp1, comp2]
      ;(mockStore as unknown as Record<string, unknown>).getComponent = comp2
      const fresh = new PageBuilderService(mockStore)
      expect(fresh.canMoveUp()).toBe(true)
    })

    it('canMoveDown returns false for last component', () => {
      ;(mockStore as unknown as Record<string, unknown>).getComponents = [comp1, comp2]
      ;(mockStore as unknown as Record<string, unknown>).getComponent = comp2
      const fresh = new PageBuilderService(mockStore)
      expect(fresh.canMoveDown()).toBe(false)
    })

    it('canMoveDown returns true for first component', () => {
      ;(mockStore as unknown as Record<string, unknown>).getComponents = [comp1, comp2]
      ;(mockStore as unknown as Record<string, unknown>).getComponent = comp1
      const fresh = new PageBuilderService(mockStore)
      expect(fresh.canMoveDown()).toBe(true)
    })

    it('middle component can both move up and down', () => {
      ;(mockStore as unknown as Record<string, unknown>).getComponents = [comp1, comp2, comp3]
      ;(mockStore as unknown as Record<string, unknown>).getComponent = comp2
      const fresh = new PageBuilderService(mockStore)
      expect(fresh.canMoveUp()).toBe(true)
      expect(fresh.canMoveDown()).toBe(true)
    })

    it('canMoveUp returns false with only one component', () => {
      ;(mockStore as unknown as Record<string, unknown>).getComponents = [comp1]
      ;(mockStore as unknown as Record<string, unknown>).getComponent = comp1
      const fresh = new PageBuilderService(mockStore)
      expect(fresh.canMoveUp()).toBe(false)
    })
  })

  // --- handleAddClasses / handleRemoveClasses ---
  describe('handleAddClasses and handleRemoveClasses', () => {
    it('adds a CSS class with pbx- prefix to the selected element', () => {
      const el = document.createElement('div')
      ;(mockStore as unknown as Record<string, unknown>).getElement = el
      const fresh = new PageBuilderService(mockStore)
      fresh.handleAddClasses('font-bold')
      expect(el.classList.contains('pbx-font-bold')).toBe(true)
    })

    it('does not add duplicate class', () => {
      const el = document.createElement('div')
      el.classList.add('pbx-font-bold')
      ;(mockStore as unknown as Record<string, unknown>).getElement = el
      const fresh = new PageBuilderService(mockStore)
      fresh.handleAddClasses('font-bold')
      expect(el.classList.length).toBe(1)
    })

    it('ignores empty class input', () => {
      const el = document.createElement('div')
      ;(mockStore as unknown as Record<string, unknown>).getElement = el
      const fresh = new PageBuilderService(mockStore)
      fresh.handleAddClasses('')
      expect(el.classList.length).toBe(0)
    })

    it('ignores class input with spaces', () => {
      const el = document.createElement('div')
      ;(mockStore as unknown as Record<string, unknown>).getElement = el
      const fresh = new PageBuilderService(mockStore)
      fresh.handleAddClasses('text black')
      expect(el.classList.length).toBe(0)
    })

    it('removes a CSS class from the selected element', () => {
      const el = document.createElement('div')
      el.classList.add('pbx-text-black')
      ;(mockStore as unknown as Record<string, unknown>).getElement = el
      const fresh = new PageBuilderService(mockStore)
      fresh.handleRemoveClasses('pbx-text-black')
      expect(el.classList.contains('pbx-text-black')).toBe(false)
    })

    it('does nothing when removing a class not on element', () => {
      const el = document.createElement('div')
      el.classList.add('pbx-text-black')
      ;(mockStore as unknown as Record<string, unknown>).getElement = el
      const fresh = new PageBuilderService(mockStore)
      fresh.handleRemoveClasses('pbx-font-bold')
      expect(el.classList.contains('pbx-text-black')).toBe(true)
    })
  })

  // --- handleAddStyle / handleRemoveStyle ---
  describe('handleAddStyle and handleRemoveStyle', () => {
    it('adds an inline style to the selected element', () => {
      const el = document.createElement('div')
      ;(mockStore as unknown as Record<string, unknown>).getElement = el
      const fresh = new PageBuilderService(mockStore)
      fresh.handleAddStyle('color', 'red')
      expect(el.style.color).toBe('red')
    })

    it('removes an inline style from the selected element', () => {
      const el = document.createElement('div')
      el.style.color = 'blue'
      ;(mockStore as unknown as Record<string, unknown>).getElement = el
      const fresh = new PageBuilderService(mockStore)
      fresh.handleRemoveStyle('color')
      expect(el.style.color).toBe('')
    })

    it('does nothing when no element selected', () => {
      expect(() => service.handleAddStyle('color', 'red')).not.toThrow()
    })
  })

  // --- image settings ---
  describe('image settings', () => {
    it('getSelectedImageAltText returns alt attribute from selected img', () => {
      const img = document.createElement('img')
      img.setAttribute('alt', 'Hero banner')
      ;(mockStore as unknown as Record<string, unknown>).getElement = img
      const fresh = new PageBuilderService(mockStore)
      expect(fresh.getSelectedImageAltText()).toBe('Hero banner')
    })

    it('handleImageAltText updates alt without remounting components', async () => {
      const img = document.createElement('img')
      img.setAttribute('alt', 'Old alt')
      ;(mockStore as unknown as Record<string, unknown>).getElement = img
      const fresh = new PageBuilderService(mockStore)
      const syncSpy = vi.spyOn(fresh, 'syncDomToStoreOnly')
      const autoSaveSpy = vi.spyOn(fresh, 'handleAutoSave').mockResolvedValue()

      await fresh.handleImageAltText('New alt')

      expect(img.getAttribute('alt')).toBe('New alt')
      expect(mockStore.setElement).toHaveBeenCalledWith(img)
      expect(syncSpy).not.toHaveBeenCalled()
      expect(autoSaveSpy).toHaveBeenCalled()
    })

    it('handleImageAltText removes alt when empty', async () => {
      const img = document.createElement('img')
      img.setAttribute('alt', 'Remove me')
      ;(mockStore as unknown as Record<string, unknown>).getElement = img
      const fresh = new PageBuilderService(mockStore)
      vi.spyOn(fresh, 'handleAutoSave').mockResolvedValue()

      await fresh.handleImageAltText('   ')

      expect(img.hasAttribute('alt')).toBe(false)
    })

    it('clearHtmlSelection is skipped while image settings panel is open', async () => {
      const img = document.createElement('img')
      ;(mockStore as unknown as Record<string, unknown>).getElement = img
      ;(mockStore as unknown as Record<string, unknown>).getImageSettingsPanelOpen = true
      const fresh = new PageBuilderService(mockStore)

      await fresh.clearHtmlSelection()

      expect(mockStore.setElement).not.toHaveBeenCalled()
    })
  })

  describe('inline text editing', () => {
    it('opens inline TipTap editor when double-clicking a valid text element', async () => {
      const pagebuilder = document.querySelector('#pagebuilder')
      expect(pagebuilder).not.toBeNull()
      if (!pagebuilder) return

      pagebuilder.innerHTML = `
        <section data-component-title="Header H2">
          <div class="pbx-py-4 pbx-px-4">
            <div class="pbx-mx-auto pbx-max-w-7xl">
              <div
                id="editable-text"
                class="pbx-break-words pbx-text-6xl lg:pbx-text-8xl pbx-font-medium"
              >
                <h2>Demo Content</h2>
              </div>
            </div>
          </div>
        </section>
      `
      const element = pagebuilder.querySelector<HTMLElement>('#editable-text')
      const heading = pagebuilder.querySelector<HTMLElement>('h2')
      expect(element).not.toBeNull()
      expect(heading).not.toBeNull()
      if (!element || !heading) return

      vi.spyOn(service, 'handleAutoSave').mockResolvedValue()
      await (
        service as unknown as {
          addListenersToEditableElements: () => Promise<void>
        }
      ).addListenersToEditableElements()

      heading.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }))
      await Promise.resolve()

      expect(element.hasAttribute('selected')).toBe(true)
      expect(mockStore.setElement).toHaveBeenCalledWith(element)
      expect(mockStore.setInlineTipTapEditor).not.toHaveBeenCalledWith(true)

      heading.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true }))
      await Promise.resolve()

      expect(element.hasAttribute('selected')).toBe(true)
      expect(mockStore.setElement).toHaveBeenCalledWith(element)
      expect(mockStore.setInlineTipTapEditor).toHaveBeenCalledWith(true)
    })
  })
})
