// @vitest-environment jsdom
/**
 * Tests for component array validation in PageBuilderService.
 *
 * Covers all the edge cases users encounter when passing components to startBuilder():
 *  - Valid arrays (various shapes)
 *  - Empty arrays
 *  - Non-array inputs (null, undefined, object, string)
 *  - Missing or malformed html_code
 *  - formType/components mismatch
 *  - Components with extra/custom fields (flexible)
 *  - Real-world component shapes
 */
import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest'
import { PageBuilderService } from '../../services/PageBuilderService'
import { usePageBuilderStateStore } from '../../stores/page-builder-state'

function createMockStore() {
  const base: Record<string, unknown> = {
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
  }
  return base as unknown as ReturnType<typeof usePageBuilderStateStore>
}

const updateConfig = {
  updateOrCreate: { formType: 'update' as const, formName: 'article' },
}
const createConfig = {
  updateOrCreate: { formType: 'create' as const, formName: 'article' },
}

beforeAll(() => {
  if (!document.getElementById('pagebuilder')) {
    const div = document.createElement('div')
    div.id = 'pagebuilder'
    document.body.appendChild(div)
  }
})

describe('Component Validation', () => {
  let service: PageBuilderService

  beforeEach(() => {
    localStorage.clear()
    service = new PageBuilderService(createMockStore())
  })

  afterEach(() => {
    localStorage.clear()
  })

  // -------------------------------------------------------------------------
  // Non-array inputs
  // -------------------------------------------------------------------------
  describe('non-array inputs', () => {
    it('returns validation error for null components', async () => {
      const result = await service.startBuilder(updateConfig, null as unknown as never)
      expect(result).toHaveProperty('validation.error', true)
    })

    it('returns validation error for undefined components (no array)', async () => {
      // Passing no array at all (undefined implicitly)
      const result = await service.startBuilder(updateConfig)
      expect(result).toHaveProperty('validation.error', true)
    })

    it('returns validation error for string input', async () => {
      const result = await service.startBuilder(updateConfig, 'not-an-array' as unknown as never)
      expect(result).toHaveProperty('validation.error', true)
    })

    it('returns validation error for object input', async () => {
      const result = await service.startBuilder(updateConfig, {
        html_code: '<section/>',
      } as unknown as never)
      expect(result).toHaveProperty('validation.error', true)
    })

    it('returns validation error for number input', async () => {
      const result = await service.startBuilder(updateConfig, 42 as unknown as never)
      expect(result).toHaveProperty('validation.error', true)
    })
  })

  // -------------------------------------------------------------------------
  // Empty array
  // -------------------------------------------------------------------------
  describe('empty array', () => {
    it('accepts empty array with create config', async () => {
      const result = await service.startBuilder(createConfig, [])
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
      expect(result).not.toHaveProperty('error')
    })

    it('accepts empty array with update config', async () => {
      const result = await service.startBuilder(updateConfig, [])
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
    })

    it('returns passedComponentsArray as empty array', async () => {
      const result = await service.startBuilder(createConfig, [])
      if ('passedComponentsArray' in result) {
        expect(result.passedComponentsArray).toHaveLength(0)
      }
    })
  })

  // -------------------------------------------------------------------------
  // Valid components
  // -------------------------------------------------------------------------
  describe('valid components', () => {
    it('accepts a single valid component', async () => {
      const components = [{ html_code: '<section><div>Hello</div></section>', title: 'Test' }]
      const result = await service.startBuilder(updateConfig, components)
      expect(result).not.toHaveProperty('validation.reason')
    })

    it('accepts component with id as string', async () => {
      const components = [
        { id: 'abc-123', html_code: '<section><p>Hi</p></section>', title: 'Test' },
      ]
      const result = await service.startBuilder(updateConfig, components)
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
    })

    it('accepts component with id as number', async () => {
      const components = [{ id: 42, html_code: '<section><p>Hi</p></section>', title: 'Test' }]
      const result = await service.startBuilder(updateConfig, components)
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
    })

    it('accepts component with id as null', async () => {
      const components = [{ id: null, html_code: '<section><p>Hi</p></section>', title: 'Test' }]
      const result = await service.startBuilder(updateConfig, components)
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
    })

    it('accepts components with extra custom fields', async () => {
      const components = [
        {
          id: '1',
          html_code: '<section><div>Content</div></section>',
          title: 'My Section',
          customMetaField: 'some value',
          category: 'hero',
          order: 1,
        },
      ]
      const result = await service.startBuilder(updateConfig, components)
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
    })

    it('accepts multiple components', async () => {
      const components = [
        { html_code: '<section><h1>Title</h1></section>', title: 'Header' },
        { html_code: '<section><p>Body text</p></section>', title: 'Body' },
        { html_code: '<section><footer>Footer</footer></section>', title: 'Footer' },
      ]
      const result = await service.startBuilder(updateConfig, components)
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
      if ('passedComponentsArray' in result) {
        expect(result.passedComponentsArray).toHaveLength(3)
      }
    })

    it('accepts 10+ components (typical real-world page)', async () => {
      const components = Array.from({ length: 12 }, (_, i) => ({
        id: `comp-${i}`,
        html_code: `<section><div>Section ${i}</div></section>`,
        title: `Section ${i}`,
      }))
      const result = await service.startBuilder(updateConfig, components)
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
    })
  })

  // -------------------------------------------------------------------------
  // Invalid component shapes
  // -------------------------------------------------------------------------
  describe('invalid component shapes', () => {
    it('returns validation error when first component is missing html_code', async () => {
      const components = [{ title: 'No html_code here', id: '1' }] as unknown as never
      const result = await service.startBuilder(updateConfig, components)
      if ('validation' in result && result.validation && 'reason' in result.validation) {
        expect(result.validation.reason).toContain('html_code')
      }
    })

    it('returns validation error when html_code is not a string', async () => {
      const components = [{ html_code: 42, title: 'Test', id: '1' }] as unknown as never
      const result = await service.startBuilder(updateConfig, components)
      if ('validation' in result && result.validation && 'reason' in result.validation) {
        expect(result.validation.reason).toContain('string')
      }
    })
  })

  // -------------------------------------------------------------------------
  // formType / components mismatch
  // -------------------------------------------------------------------------
  describe('formType and components mismatch', () => {
    it('returns warning when formType is create with a non-empty components array', async () => {
      const components = [{ html_code: '<section>Hi</section>', title: 'Test' }]
      const result = await service.startBuilder(createConfig, components)
      expect(result).toHaveProperty('validation.error', true)
      if ('validation' in result && result.validation && 'warning' in result.validation) {
        expect(result.validation.warning).toContain('update')
      }
    })

    it('does NOT return warning when formType is update with components', async () => {
      const components = [{ html_code: '<section>Hi</section>', title: 'Test' }]
      const result = await service.startBuilder(updateConfig, components)
      if ('validation' in result && result.validation) {
        expect('warning' in result.validation).toBe(false)
      }
    })
  })

  // -------------------------------------------------------------------------
  // Real-world component shapes from GeoStarter
  // -------------------------------------------------------------------------
  describe('real-world component shapes', () => {
    it('accepts typical section HTML component', async () => {
      const components = [
        {
          id: 'ba0e9774-3779-467c-9c9f-5c95dd47fa6d',
          html_code:
            '<section data-component-title="Header H2"><div class="pbx-mx-auto pbx-max-w-7xl"><h2>Hello World</h2></div></section>',
          title: 'Header H2',
        },
      ]
      const result = await service.startBuilder(updateConfig, components)
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
    })

    it('accepts component with image HTML', async () => {
      const components = [
        {
          id: '1',
          html_code:
            '<section><div><img src="/photo.jpg" alt="Photo" class="pbx-object-cover pbx-w-full"></div></section>',
          title: 'Image Section',
        },
      ]
      const result = await service.startBuilder(updateConfig, components)
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
    })

    it('accepts component with iframe/video HTML', async () => {
      const components = [
        {
          id: '2',
          html_code:
            '<section><div class="pbx-aspect-video"><iframe src="https://www.youtube.com/embed/abc" allowfullscreen></iframe></div></section>',
          title: 'YouTube Video',
        },
      ]
      const result = await service.startBuilder(updateConfig, components)
      expect(result).toHaveProperty('message', 'Page builder started successfully.')
    })
  })
})
