import { describe, it, expect } from 'vitest'
import type { PageBuilderConfig } from '../types'

/**
 * Comprehensive tests to ensure PageBuilderConfig accepts various user patterns
 * These tests validate that our types are flexible enough for real-world usage
 */
describe('PageBuilderConfig Type Flexibility', () => {
  it('accepts minimal config', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
    }
    expect(config).toBeDefined()
  })

  it('accepts dynamic formName with template literals', () => {
    const pageSlug = 'home'
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'update',
        formName: `cms-page-${pageSlug}`,
      },
    }
    expect(config.updateOrCreate.formName).toBe('cms-page-home')
  })

  it('accepts user without image property', () => {
    const userName = 'John Doe'
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
      userForPageBuilder: { name: userName },
    }
    expect(config.userForPageBuilder?.image).toBeUndefined()
  })

  it('accepts user with image property', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
      userForPageBuilder: {
        name: 'Jane Doe',
        image: '/jane_doe.jpg',
      },
    }
    expect(config.userForPageBuilder?.image).toBe('/jane_doe.jpg')
  })

  it('accepts any language code string', () => {
    const userLang = 'es'
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
      userSettings: {
        language: {
          default: userLang,
        },
      },
    }
    expect(config.userSettings?.language?.default).toBe('es')
  })

  it('accepts custom language codes not in standard list', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
      userSettings: {
        language: {
          default: 'custom-lang',
          enable: ['custom-lang-1', 'custom-lang-2'],
        },
      },
    }
    expect(config.userSettings?.language?.enable).toHaveLength(2)
  })

  it('accepts readonly arrays from as const', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
      userSettings: {
        language: {
          enable: ['en', 'fr', 'de'] as const,
        },
      },
    }
    expect(config.userSettings?.language?.enable).toEqual(['en', 'fr', 'de'])
  })

  it('accepts entire config with as const', () => {
    const config = {
      updateOrCreate: {
        formType: 'update',
        formName: 'article',
      },
      userSettings: {
        language: {
          enable: ['en', 'zh-Hans', 'fr'],
        },
        autoSave: true,
      },
    } as const

    const typedConfig: PageBuilderConfig = config
    expect(typedConfig).toBeDefined()
  })

  it('accepts custom properties in resourceData', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
      resourceData: {
        title: 'My Article',
        id: 1,
        customField: 'custom value',
        anotherCustomField: { nested: 'data' },
      },
    }
    expect(config.resourceData).toHaveProperty('customField')
  })

  it('accepts custom properties in userSettings', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
      userSettings: {
        autoSave: false,
        customTheme: 'dark',
        customProp: 'value',
      },
    }
    expect(config.userSettings).toHaveProperty('customTheme')
  })

  it('accepts custom properties in settings', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
      settings: {
        brandColor: '#DB93B0',
        customSetting: 'value',
      },
    }
    expect(config.settings).toHaveProperty('customSetting')
  })

  it('accepts top-level custom properties', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
      customTopLevelProp: 'value',
      anotherCustomProp: { data: 'nested' },
    }
    expect(config).toHaveProperty('customTopLevelProp')
  })

  it('accepts all font family values', () => {
    const fonts = ['jost', 'raleway', 'palantino', 'arial', 'helvetica', 'custom-font']

    fonts.forEach((font) => {
      const config: PageBuilderConfig = {
        updateOrCreate: {
          formType: 'create',
          formName: 'article',
        },
        userSettings: {
          fontFamily: font,
        },
      }
      expect(config.userSettings?.fontFamily).toBe(font)
    })
  })

  it('accepts maximal config with all properties', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'update',
        formName: 'collection',
      },
      pageBuilderLogo: {
        src: '/logo/logo.svg',
      },
      resourceData: {
        title: 'Demo Article',
        id: 1,
        customField: 'value',
      },
      userForPageBuilder: {
        name: 'Jane Doe',
        image: '/jane_doe.jpg',
      },
      userSettings: {
        language: {
          default: 'en',
          enable: ['en', 'zh-Hans', 'fr', 'ja', 'ru', 'es', 'pt', 'de', 'ar', 'hi', 'da', 'it'],
          disableLanguageDropDown: false,
        },
        autoSave: true,
        fontFamily: 'jost',
        customUserSetting: 'value',
      },
      settings: {
        brandColor: '#DB93B0',
        customSetting: 'value',
      },
      pageSettings: {
        classes: 'my-class',
        style: { background: 'red' },
      },
      customTopLevel: 'value',
    }
    expect(config).toBeDefined()
  })

  it('accepts conditional properties', () => {
    const hasExistingData = false
    const existingData = hasExistingData ? { title: 'Existing', id: 1 } : undefined

    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: hasExistingData ? 'update' : 'create',
        formName: 'article',
      },
      resourceData: existingData,
    }
    expect(config.resourceData).toBeUndefined()
  })

  it('accepts spread objects', () => {
    const baseSettings = {
      autoSave: true,
      fontFamily: 'jost',
    }

    const customSettings = {
      customProp: 'value',
    }

    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
      userSettings: {
        ...baseSettings,
        ...customSettings,
      },
    }
    expect(config.userSettings).toHaveProperty('customProp')
  })

  it('accepts null values for optional properties', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
      pageBuilderLogo: null,
      resourceData: null,
      userSettings: null,
      settings: null,
    }
    expect(config.pageBuilderLogo).toBeNull()
    expect(config.userSettings).toBeNull()
  })

  it('accepts empty objects for nested properties', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: 'article',
      },
      userSettings: {},
      settings: {},
    }
    expect(config.userSettings).toEqual({})
  })

  it('accepts variables from external sources', () => {
    // Simulating data from API or external source
    const apiResponse = {
      userName: 'John Doe',
      userLanguage: 'en',
      pageTitle: 'My Page',
    }

    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: 'create',
        formName: `cms-page-dynamic`,
      },
      resourceData: {
        title: apiResponse.pageTitle,
      },
      userForPageBuilder: {
        name: apiResponse.userName,
      },
      userSettings: {
        language: {
          default: apiResponse.userLanguage,
        },
      },
    }
    expect(config.resourceData?.title).toBe('My Page')
  })

  it('works with real-world GeoStarter pattern', () => {
    const options = { pageSlug: 'about', pageTitle: 'About Us' }
    const userName = 'Admin'
    const existingPage = { title: 'About Us', components: [] }
    const hasContent = true
    const userSettings = {
      language: { default: 'da', enable: ['en', 'da'] },
      autoSave: true,
    }

    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: hasContent ? 'update' : 'create',
        formName: `cms-page-${options.pageSlug}`,
      },
      resourceData: {
        title: existingPage.title || options.pageTitle,
      },
      userForPageBuilder: { name: userName },
      userSettings,
    }

    expect(config.updateOrCreate.formName).toBe('cms-page-about')
    expect(config.userForPageBuilder?.image).toBeUndefined()
  })

  it('accepts empty enable array', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userSettings: { language: { enable: [] } },
    }
    expect(config.userSettings?.language?.enable).toHaveLength(0)
  })

  it('accepts language with only disableLanguageDropDown', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userSettings: { language: { disableLanguageDropDown: true } },
    }
    expect(config.userSettings?.language?.disableLanguageDropDown).toBe(true)
  })
  it('accepts pageSettings alone', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      pageSettings: { classes: 'custom-class', style: { color: 'blue' } },
    }
    expect(config.pageSettings?.classes).toBe('custom-class')
  })
  it('accepts non-string top-level custom properties', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      customNum: 42,
      customBool: true,
      customObj: { nested: 'value' },
      customNull: null,
    }
    expect(config.customNum).toBe(42)
  })
})
