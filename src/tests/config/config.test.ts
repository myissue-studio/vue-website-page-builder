import { describe, it, expect } from 'vitest'
import type { PageBuilderConfig } from '../../types'

/**
 * Comprehensive tests to ensure PageBuilderConfig accepts various user patterns.
 * These tests validate that our types are flexible enough for real-world usage.
 */
describe('PageBuilderConfig Type Flexibility', () => {
  it('accepts minimal config', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
    }
    expect(config).toBeDefined()
  })

  it('accepts dynamic formName with template literals', () => {
    const pageSlug = 'home'
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'update', formName: `cms-page-${pageSlug}` },
    }
    expect(config.updateOrCreate.formName).toBe('cms-page-home')
  })

  it('accepts user without image property', () => {
    const userName = 'John Doe'
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userForPageBuilder: { name: userName },
    }
    expect(config.userForPageBuilder?.image).toBeUndefined()
  })

  it('accepts user with image property', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userForPageBuilder: { name: 'Jane Doe', image: '/jane_doe.jpg' },
    }
    expect(config.userForPageBuilder?.image).toBe('/jane_doe.jpg')
  })

  it('accepts any language code string', () => {
    const userLang = 'es'
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userSettings: { language: { default: userLang } },
    }
    expect(config.userSettings?.language?.default).toBe('es')
  })

  it('accepts custom language codes not in standard list', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userSettings: {
        language: { default: 'custom-lang', enable: ['custom-lang-1', 'custom-lang-2'] },
      },
    }
    expect(config.userSettings?.language?.enable).toHaveLength(2)
  })

  it('accepts readonly arrays from as const', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userSettings: {
        language: { enable: ['en', 'fr', 'de'] as const },
      },
    }
    expect(config.userSettings?.language?.enable).toEqual(['en', 'fr', 'de'])
  })

  it('accepts entire config with as const', () => {
    const config = {
      updateOrCreate: { formType: 'update', formName: 'article' },
      userSettings: {
        language: { enable: ['en', 'zh-Hans', 'fr'] },
        autoSave: true,
      },
    } as const

    const typedConfig: PageBuilderConfig = config
    expect(typedConfig).toBeDefined()
  })

  it('accepts custom properties in resourceData', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      resourceData: {
        title: 'My Article',
        id: 1,
        customField: 'custom value',
        anotherCustomField: { nested: 'data' },
      },
    }
    expect(config.resourceData).toHaveProperty('customField')
  })

  it('accepts custom properties in userSettings via type assertion', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userSettings: {
        autoSave: false,
      } as PageBuilderConfig['userSettings'],
    }
    expect(config.userSettings).toHaveProperty('autoSave')
  })

  it('accepts custom properties in settings', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      settings: { brandColor: '#DB93B0', customSetting: 'value' },
    }
    expect(config.settings).toHaveProperty('customSetting')
  })

  it('accepts top-level custom properties', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      customTopLevelProp: 'value',
      anotherCustomProp: { data: 'nested' },
    }
    expect(config).toHaveProperty('customTopLevelProp')
  })

  it('accepts all font family values', () => {
    const fonts = ['jost', 'raleway', 'palantino', 'arial', 'helvetica', 'custom-font']
    fonts.forEach((font) => {
      const config: PageBuilderConfig = {
        updateOrCreate: { formType: 'create', formName: 'article' },
        userSettings: { fontFamily: font },
      }
      expect(config.userSettings?.fontFamily).toBe(font)
    })
  })

  it('accepts maximal config with all properties', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'update', formName: 'collection' },
      pageBuilderLogo: { src: '/logo/logo.svg' },
      resourceData: { title: 'Demo Article', id: 1, customField: 'value' },
      userForPageBuilder: { name: 'Jane Doe', image: '/jane_doe.jpg' },
      userSettings: {
        language: {
          default: 'en',
          enable: ['en', 'zh-Hans', 'fr', 'ja', 'ru', 'es', 'pt', 'de', 'ar', 'hi', 'da', 'it'],
          disableLanguageDropDown: false,
        },
        autoSave: true,
        fontFamily: 'jost',
      },
      settings: { brandColor: '#DB93B0', customSetting: 'value' },
      pageSettings: { classes: 'my-class', style: { background: 'red' } },
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
    const baseSettings = { autoSave: true, fontFamily: 'jost' }
    const customSettings = { customProp: 'value' }
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userSettings: { ...baseSettings, ...customSettings },
    }
    expect(config.userSettings).toHaveProperty('customProp')
  })

  it('accepts null values for optional properties', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
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
      updateOrCreate: { formType: 'create', formName: 'article' },
      userSettings: {},
      settings: {},
    }
    expect(config.userSettings).toEqual({})
  })

  it('accepts variables from external sources', () => {
    const apiResponse = { userName: 'John Doe', userLanguage: 'en', pageTitle: 'My Page' }
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: `cms-page-dynamic` },
      resourceData: { title: apiResponse.pageTitle },
      userForPageBuilder: { name: apiResponse.userName },
      userSettings: { language: { default: apiResponse.userLanguage } },
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
      resourceData: { title: existingPage.title || options.pageTitle },
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

  it('accepts FormName autocomplete values', () => {
    const commonForms: PageBuilderConfig['updateOrCreate']['formName'][] = [
      'article',
      'post',
      'product',
      'collection',
      'job',
      'event',
    ]
    commonForms.forEach((formName) => {
      const config: PageBuilderConfig = {
        updateOrCreate: { formType: 'update', formName },
      }
      expect(config.updateOrCreate.formName).toBe(formName)
    })
  })

  // -------------------------------------------------------------------------
  // Named interface assignment — the pattern that object-literal tests miss.
  //
  // TypeScript treats object literals loosely (no index-signature check), but
  // is strict when you assign a pre-typed variable. Every test below was added
  // specifically because a bug went undetected: [key: string]: unknown on
  // userSettings prevented consumers from passing their own typed interfaces.
  // -------------------------------------------------------------------------

  it('accepts userSettings from a typed interface without index signature', () => {
    // This is the EXACT pattern GeoStarter uses — a named interface, no [key: string]: unknown.
    // Previously failed with: "Index signature for type 'string' is missing in type 'UserSettings'"
    interface UserSettings {
      language?: { default?: string; enable?: string[] }
      autoSave?: boolean
      fontFamily?: string
    }

    const userSettings: UserSettings = {
      language: { default: 'da', enable: ['en', 'da'] },
      autoSave: true,
    }

    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'update', formName: 'cms-page-about' },
      userSettings, // ← assigning a typed variable, not an object literal
    }
    expect(config.userSettings?.language?.default).toBe('da')
  })

  it('accepts userSettings from a class instance', () => {
    class AppSettings {
      language = { default: 'en', enable: ['en', 'fr'] as string[] }
      autoSave = false
      fontFamily = 'jost'
    }

    const userSettings = new AppSettings()

    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userSettings,
    }
    expect(config.userSettings?.fontFamily).toBe('jost')
  })

  it('accepts userSettings from a function return value typed as an interface', () => {
    interface LanguageSettings {
      default: string
      enable: string[]
      disableLanguageDropDown: boolean
    }
    interface AppUserSettings {
      language: LanguageSettings
      autoSave: boolean
    }

    function buildSettings(): AppUserSettings {
      return {
        language: { default: 'en', enable: ['en', 'de'], disableLanguageDropDown: false },
        autoSave: true,
      }
    }

    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'update', formName: 'blog' },
      userSettings: buildSettings(),
    }
    expect(config.userSettings?.language?.default).toBe('en')
  })

  it('replicates the exact GeoStarter startBuilder call pattern', () => {
    // Mirrors the exact code structure in GeoStarter's composable.
    interface UserSettings {
      language?: { default?: string; enable?: readonly string[] }
      autoSave?: boolean
    }

    const options = { pageSlug: 'home', pageTitle: 'Home' }
    const userName = 'Admin'
    const existingPage = {
      title: 'Home Page',
      components: [{ html_code: '<section/>', title: 'S' }],
    }
    const hasContent = existingPage.components.length > 0
    const userSettings: UserSettings = { language: { default: 'da' }, autoSave: true }

    // This is the call that previously caused the TypeScript error
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: hasContent ? 'update' : 'create',
        formName: `cms-page-${options.pageSlug}`,
      },
      resourceData: { title: existingPage.title || options.pageTitle },
      userForPageBuilder: { name: userName },
      userSettings,
    }
    expect(config.userSettings?.language?.default).toBe('da')
    expect(config.updateOrCreate.formName).toBe('cms-page-home')
  })

  it('accepts themeColorPresets from a pre-built config object (GeoStarter pattern)', () => {
    interface UserSettings {
      language?: { default?: string; enable?: readonly string[] }
      autoSave?: boolean
    }

    const options = { pageSlug: 'home', pageTitle: 'Home' }
    const userName = 'Admin'
    const userSettings: UserSettings = { language: { default: 'da' }, autoSave: true }

    const baseConfig = {
      updateOrCreate: {
        formType: 'create' as 'update' | 'create',
        formName: `cms-page-${options.pageSlug}`,
      },
      resourceData: { title: options.pageTitle },
      userForPageBuilder: { name: userName },
      userSettings,
      settings: {
        brandColor: '#DB93B0',
        themeColorPresets: {
          enabled: true,
          colors: [
            { id: 'primary', label: 'Primary', color: 'FF4400', enabled: true },
            { id: 'secondary', label: 'Secondary', color: 'E5D352', enabled: true },
            { id: 'custom1', label: 'Custom 1', color: 'AC3931', enabled: true },
            { id: 'custom2', label: 'Custom 2', color: '623CEA', enabled: true },
            { id: 'custom3', label: 'Custom 3', color: '54426B', enabled: true },
            { id: 'custom4', label: 'Custom 4', color: '#ffffff', enabled: true },
            { id: 'custom5', label: 'Custom 5', color: '#ffffff', enabled: false },
            { id: 'custom6', label: 'Custom 6', color: '#ffffff', enabled: false },
          ],
        },
      },
    }

    const config: PageBuilderConfig = baseConfig
    expect(config.settings?.themeColorPresets?.colors).toHaveLength(8)
  })

  // -------------------------------------------------------------------------
  // Type flexibility additions — covering the four common real-world gaps that
  // previously caused TypeScript errors in consumer projects.
  // -------------------------------------------------------------------------

  it('accepts a dynamic formType without as const (ternary / variable)', () => {
    // The most common consumer pattern: compute formType from a boolean.
    // Previously failed: "string is not assignable to 'create' | 'update'".
    const hasContent = true
    const config: PageBuilderConfig = {
      updateOrCreate: {
        formType: hasContent ? 'update' : 'create', // TypeScript widens to string without as const
        formName: 'article',
      },
    }
    expect(config.updateOrCreate.formType).toBe('update')
  })

  it('accepts formType from a plain string variable', () => {
    const formType = 'create' // TypeScript infers string, not 'create'
    const config: PageBuilderConfig = {
      updateOrCreate: { formType, formName: 'article' },
    }
    expect(config.updateOrCreate.formType).toBe('create')
  })

  it('accepts userForPageBuilder.id as null (nullable DB column)', () => {
    // ORMs / databases frequently return null for optional foreign keys.
    const userId: number | null = null
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userForPageBuilder: { id: userId, name: 'Alice' },
    }
    expect(config.userForPageBuilder?.id).toBeNull()
  })

  it('accepts userForPageBuilder.id as string | null', () => {
    const userId: string | null = 'usr-abc-123'
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userForPageBuilder: { id: userId, name: 'Bob' },
    }
    expect(config.userForPageBuilder?.id).toBe('usr-abc-123')
  })

  it('accepts resourceData.id as a string (UUID)', () => {
    // Many modern ORMs use UUID strings as primary keys.
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      resourceData: { title: 'My Page', id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
    }
    expect(typeof config.resourceData?.id).toBe('string')
  })

  it('accepts resourceData.id as a number (integer PK)', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      resourceData: { title: 'My Page', id: 42 },
    }
    expect(config.resourceData?.id).toBe(42)
  })

  it('accepts pageBuilderLogo with extra properties (e.g. alt text)', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      pageBuilderLogo: { src: '/logo.svg', alt: 'Company Logo', width: 120 },
    }
    expect(config.pageBuilderLogo).toHaveProperty('alt')
  })

  it('accepts pageSettings with only style (classes is now optional)', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      pageSettings: { style: 'background:#fff' },
    }
    expect(config.pageSettings?.classes).toBeUndefined()
  })

  it('accepts userForPageBuilder without a name (name is now optional)', () => {
    // Auth systems often use 'username' or 'displayName' — the consumer just picks the right field.
    // If unavailable at call time, the whole property can be omitted or passed without name.
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      userForPageBuilder: { id: 99 },  // name intentionally omitted
    }
    expect(config.userForPageBuilder?.name).toBeUndefined()
  })

  it('accepts resourceData without a title (title is now optional)', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      resourceData: { id: 42 },  // no title
    }
    expect(config.resourceData?.title).toBeUndefined()
  })

  it('accepts updateOrCreate with extra properties (no excess property error)', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article', customMeta: 'value' },
    }
    expect(config.updateOrCreate).toHaveProperty('customMeta')
  })

  it('accepts pageSettings with extra properties (no excess property error)', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      pageSettings: { classes: 'my-class', style: 'color:red', extraMeta: true },
    }
    expect(config.pageSettings).toHaveProperty('extraMeta')
  })

  it('accepts themeColorPresets colors with extra DB fields per color', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      settings: {
        themeColorPresets: {
          enabled: true,
          colors: [
            { id: 'primary', label: 'Primary', color: '#482C3D', enabled: true, dbId: 1, sortOrder: 0 },
          ],
        },
      },
    }
    const colors = config.settings?.themeColorPresets?.colors
    expect(Array.isArray(colors)).toBe(true)
  })

  it('accepts themeColorPresets settings with extra metadata fields', () => {
    const config: PageBuilderConfig = {
      updateOrCreate: { formType: 'create', formName: 'article' },
      settings: {
        themeColorPresets: {
          enabled: true,
          colors: [],
          updatedAt: '2026-01-01',  // extra field
          source: 'database',        // extra field
        },
      },
    }
    expect(config.settings?.themeColorPresets).toHaveProperty('updatedAt')
  })
})
