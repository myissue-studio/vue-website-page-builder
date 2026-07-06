// @vitest-environment jsdom
/**
 * Tests for internal HTML utility methods in PageBuilderService.
 * These methods are private, accessed via (service as any) casting.
 *
 * Covered utilities:
 *  - addTailwindPrefixToClasses   — adds pbx- prefix to Tailwind classes
 *  - parseStyleString             — parses CSS string to object
 *  - convertStyleObjectToString   — converts style object to CSS string
 *  - cloneAndRemoveSelectionAttributes — clones element, removes hovered/selected attrs
 *  - renderComponentsToHtml       — builds an HTML string from component array
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PageBuilderService } from '../../services/PageBuilderService'
import { usePageBuilderStateStore } from '../../stores/page-builder-state'
import { extractCleanHTMLFromPageBuilder } from '../../utils/builder/extract-clean-html'
import type { PageBuilderConfig } from '../../types'

function createMockStore() {
  return {
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
  } as unknown as ReturnType<typeof usePageBuilderStateStore>
}

// Helper to access private methods
type SvcAny = {
  addTailwindPrefixToClasses: (classList: string, prefix?: string) => string
  parseStyleString: (style: string) => Record<string, string>
  convertStyleObjectToString: (
    styleObj: string | Record<string, string> | null | undefined,
  ) => string
  cloneAndRemoveSelectionAttributes: (element: HTMLElement) => HTMLElement
  renderComponentsToHtml: (components: unknown[]) => string
}

const configWithImagePrefix = (imageUrlPrefix: string): PageBuilderConfig => ({
  updateOrCreate: {
    formType: 'create',
    formName: 'test',
  },
  imageUrlPrefix,
})

describe('HTML Utility Methods', () => {
  let svc: SvcAny

  beforeEach(() => {
    const mockStore = createMockStore()
    svc = new PageBuilderService(mockStore) as unknown as SvcAny
  })

  // -------------------------------------------------------------------------
  // addTailwindPrefixToClasses
  // -------------------------------------------------------------------------
  describe('addTailwindPrefixToClasses', () => {
    it('adds pbx- prefix to a single class', () => {
      expect(svc.addTailwindPrefixToClasses('text-black')).toBe('pbx-text-black')
    })

    it('adds prefix to multiple classes', () => {
      expect(svc.addTailwindPrefixToClasses('text-black font-bold')).toBe(
        'pbx-text-black pbx-font-bold',
      )
    })

    it('does not double-prefix already-prefixed class', () => {
      expect(svc.addTailwindPrefixToClasses('pbx-text-black')).toBe('pbx-text-black')
    })

    it('handles responsive prefix: lg:text-xl → lg:pbx-text-xl', () => {
      expect(svc.addTailwindPrefixToClasses('lg:text-xl')).toBe('lg:pbx-text-xl')
    })

    it('does not double-prefix responsive already-prefixed: lg:pbx-text-xl stays', () => {
      expect(svc.addTailwindPrefixToClasses('lg:pbx-text-xl')).toBe('lg:pbx-text-xl')
    })

    it('handles hover: prefix', () => {
      expect(svc.addTailwindPrefixToClasses('hover:text-blue-500')).toBe('hover:pbx-text-blue-500')
    })

    it('handles empty string', () => {
      expect(svc.addTailwindPrefixToClasses('')).toBe('')
    })

    it('handles class with extra whitespace', () => {
      const result = svc.addTailwindPrefixToClasses('text-black  font-bold')
      expect(result).toContain('pbx-text-black')
      expect(result).toContain('pbx-font-bold')
    })

    it('handles mixed prefixed and non-prefixed classes', () => {
      const result = svc.addTailwindPrefixToClasses('pbx-text-black font-bold')
      expect(result).toBe('pbx-text-black pbx-font-bold')
    })

    it('handles focus: prefix', () => {
      expect(svc.addTailwindPrefixToClasses('focus:ring-2')).toBe('focus:pbx-ring-2')
    })

    it('uses custom prefix when provided', () => {
      expect(svc.addTailwindPrefixToClasses('text-black', 'my-')).toBe('my-text-black')
    })
  })

  // -------------------------------------------------------------------------
  // parseStyleString
  // -------------------------------------------------------------------------
  describe('parseStyleString', () => {
    it('parses a single property', () => {
      expect(svc.parseStyleString('color: red')).toEqual({ color: 'red' })
    })

    it('parses multiple properties', () => {
      expect(svc.parseStyleString('color: red; font-size: 14px')).toEqual({
        color: 'red',
        'font-size': '14px',
      })
    })

    it('handles trailing semicolon', () => {
      expect(svc.parseStyleString('color: red;')).toEqual({ color: 'red' })
    })

    it('handles empty string', () => {
      expect(svc.parseStyleString('')).toEqual({})
    })

    it('handles whitespace around colon', () => {
      expect(svc.parseStyleString('color :  red')).toEqual({ color: 'red' })
    })

    it('handles multiple semicolons gracefully', () => {
      const result = svc.parseStyleString('color: red; background: blue;')
      expect(result.color).toBe('red')
      expect(result.background).toBe('blue')
    })

    it('ignores malformed rules (no colon)', () => {
      const result = svc.parseStyleString('colorred; font-size: 14px')
      expect(result['font-size']).toBe('14px')
    })
  })

  // -------------------------------------------------------------------------
  // convertStyleObjectToString
  // -------------------------------------------------------------------------
  describe('convertStyleObjectToString', () => {
    it('returns empty string for null', () => {
      expect(svc.convertStyleObjectToString(null)).toBe('')
    })

    it('returns empty string for undefined', () => {
      expect(svc.convertStyleObjectToString(undefined)).toBe('')
    })

    it('returns empty string for empty string', () => {
      expect(svc.convertStyleObjectToString('')).toBe('')
    })

    it('passes through a string value unchanged', () => {
      expect(svc.convertStyleObjectToString('color: red;')).toBe('color: red;')
    })

    it('converts single-property object to CSS string', () => {
      expect(svc.convertStyleObjectToString({ color: 'red' })).toBe('color: red;')
    })

    it('converts camelCase property to kebab-case', () => {
      expect(svc.convertStyleObjectToString({ backgroundColor: 'blue' })).toBe(
        'background-color: blue;',
      )
    })

    it('converts multi-property object to CSS string', () => {
      const result = svc.convertStyleObjectToString({ color: 'red', fontSize: '14px' })
      expect(result).toContain('color: red;')
      expect(result).toContain('font-size: 14px;')
    })

    it('returns empty string for empty object', () => {
      // Object.entries({}) = [], .join(' ') = ''
      expect(svc.convertStyleObjectToString({})).toBe('')
    })
  })

  // -------------------------------------------------------------------------
  // cloneAndRemoveSelectionAttributes
  // -------------------------------------------------------------------------
  describe('cloneAndRemoveSelectionAttributes', () => {
    it('removes hovered attribute from root element', () => {
      const el = document.createElement('section')
      el.setAttribute('hovered', '')
      const clone = svc.cloneAndRemoveSelectionAttributes(el)
      expect(clone.hasAttribute('hovered')).toBe(false)
    })

    it('removes selected attribute from root element', () => {
      const el = document.createElement('section')
      el.setAttribute('selected', '')
      const clone = svc.cloneAndRemoveSelectionAttributes(el)
      expect(clone.hasAttribute('selected')).toBe(false)
    })

    it('removes hovered attribute from descendant elements', () => {
      const el = document.createElement('section')
      const child = document.createElement('div')
      child.setAttribute('hovered', '')
      el.appendChild(child)
      const clone = svc.cloneAndRemoveSelectionAttributes(el)
      expect(clone.querySelector('[hovered]')).toBeNull()
    })

    it('removes selected attribute from descendant elements', () => {
      const el = document.createElement('section')
      const child = document.createElement('div')
      child.setAttribute('selected', '')
      el.appendChild(child)
      const clone = svc.cloneAndRemoveSelectionAttributes(el)
      expect(clone.querySelector('[selected]')).toBeNull()
    })

    it('does not modify the original element', () => {
      const el = document.createElement('section')
      el.setAttribute('hovered', '')
      svc.cloneAndRemoveSelectionAttributes(el)
      expect(el.hasAttribute('hovered')).toBe(true)
    })

    it('preserves other attributes on the clone', () => {
      const el = document.createElement('section')
      el.setAttribute('data-componentid', 'test-id')
      el.setAttribute('class', 'pbx-text-black')
      el.setAttribute('hovered', '')
      const clone = svc.cloneAndRemoveSelectionAttributes(el)
      expect(clone.getAttribute('data-componentid')).toBe('test-id')
      expect(clone.getAttribute('class')).toBe('pbx-text-black')
    })

    it('preserves innerHTML on clone', () => {
      const el = document.createElement('section')
      el.innerHTML = '<div class="pbx-text-black"><p>Hello</p></div>'
      const clone = svc.cloneAndRemoveSelectionAttributes(el)
      expect(clone.innerHTML).toContain('Hello')
    })
  })

  // -------------------------------------------------------------------------
  // renderComponentsToHtml
  // -------------------------------------------------------------------------
  describe('renderComponentsToHtml', () => {
    it('returns default HTML structure for empty array', () => {
      const result = svc.renderComponentsToHtml([])
      expect(result).toContain('id="pagebuilder"')
    })

    it('returns default HTML structure for null/falsy input', () => {
      const result = svc.renderComponentsToHtml(null as unknown as unknown[])
      expect(result).toContain('id="pagebuilder"')
    })

    it('returns the html_code of a single component', () => {
      const components = [{ html_code: '<section>Test content</section>', title: 'Test' }]
      const result = svc.renderComponentsToHtml(components)
      expect(result).toContain('<section>Test content</section>')
    })

    it('joins multiple components with newline', () => {
      const components = [
        { html_code: '<section>Section 1</section>', title: 'S1' },
        { html_code: '<section>Section 2</section>', title: 'S2' },
      ]
      const result = svc.renderComponentsToHtml(components)
      expect(result).toContain('<section>Section 1</section>')
      expect(result).toContain('<section>Section 2</section>')
    })

    it('returns raw html_code without wrapping it in extra tags', () => {
      const components = [{ html_code: '<section data-componentid="abc">X</section>', title: 'X' }]
      const result = svc.renderComponentsToHtml(components)
      expect(result).not.toContain('#pagebuilder')
    })
  })

  describe('extractCleanHTMLFromPageBuilder', () => {
    it('preserves data image sources when imageUrlPrefix is configured', () => {
      const root = document.createElement('div')
      root.id = 'pagebuilder'
      const dataSrc =
        'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C%2Fsvg%3E'
      root.innerHTML = `<img src="${dataSrc}" alt="Placeholder">`

      const result = extractCleanHTMLFromPageBuilder(
        root,
        configWithImagePrefix('http://localhost:11001/storage/uploads/'),
      )

      expect(result).toContain(`src="${dataSrc}"`)
      expect(result).not.toContain('/storage/uploads/data:image')
    })

    it('preserves blob image sources when imageUrlPrefix is configured', () => {
      const root = document.createElement('div')
      root.id = 'pagebuilder'
      root.innerHTML = '<img src="blob:http://localhost:11001/image-id" alt="Preview">'

      const result = extractCleanHTMLFromPageBuilder(
        root,
        configWithImagePrefix('http://localhost:11001/storage/uploads/'),
      )

      expect(result).toContain('src="blob:http://localhost:11001/image-id"')
    })

    it('prefixes relative image sources when imageUrlPrefix is configured', () => {
      const root = document.createElement('div')
      root.id = 'pagebuilder'
      root.innerHTML = '<img src="hero.jpg" alt="Hero">'

      const result = extractCleanHTMLFromPageBuilder(
        root,
        configWithImagePrefix('http://localhost:11001/storage/uploads/'),
      )

      expect(result).toContain('src="http://localhost:11001/storage/uploads/hero.jpg"')
    })
  })
})
