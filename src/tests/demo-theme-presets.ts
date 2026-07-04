import type { ThemeColorPresetSettingsInput } from '../types'

export type DemoThemePackId = 'fashion' | 'corporate' | 'blog'

export interface DemoThemePack {
  id: DemoThemePackId
  label: string
  hint: string
  brandColor: string
  fontKey: string
  themeColorPresets: ThemeColorPresetSettingsInput
}

export const DEMO_THEME_PACKS: DemoThemePack[] = [
  {
    id: 'fashion',
    label: 'Fashion',
    hint: 'Boutique & retail',
    brandColor: '#DB93B0',
    fontKey: 'jost',
    themeColorPresets: {
      enabled: true,
      colors: [
        { id: 'primary', label: 'Primary', color: '482C3D', enabled: true },
        { id: 'secondary', label: 'Secondary', color: 'E5D352', enabled: true },
        { id: 'custom1', label: 'Accent', color: 'AC3931', enabled: true },
        { id: 'custom2', label: 'Highlight', color: 'DB93B0', enabled: true },
        { id: 'custom3', label: 'Neutral', color: '54426B', enabled: true },
        { id: 'custom4', label: 'Light', color: '#ffffff', enabled: true },
        { id: 'custom5', label: 'Custom 5', color: '#f5f5f5', enabled: false },
        { id: 'custom6', label: 'Custom 6', color: '#ffffff', enabled: false },
      ],
    },
  },
  {
    id: 'corporate',
    label: 'Corporate',
    hint: 'SaaS & enterprise',
    brandColor: '#2563EB',
    fontKey: 'inter',
    themeColorPresets: {
      enabled: true,
      colors: [
        { id: 'primary', label: 'Primary', color: '1E3A5F', enabled: true },
        { id: 'secondary', label: 'Secondary', color: '64748B', enabled: true },
        { id: 'custom1', label: 'Accent', color: '2563EB', enabled: true },
        { id: 'custom2', label: 'Success', color: '059669', enabled: true },
        { id: 'custom3', label: 'Surface', color: 'F1F5F9', enabled: true },
        { id: 'custom4', label: 'Light', color: '#ffffff', enabled: true },
        { id: 'custom5', label: 'Custom 5', color: '#e2e8f0', enabled: false },
        { id: 'custom6', label: 'Custom 6', color: '#ffffff', enabled: false },
      ],
    },
  },
  {
    id: 'blog',
    label: 'Blog',
    hint: 'Editorial & media',
    brandColor: '#C45C26',
    fontKey: 'georgia',
    themeColorPresets: {
      enabled: true,
      colors: [
        { id: 'primary', label: 'Primary', color: '292524', enabled: true },
        { id: 'secondary', label: 'Secondary', color: '78716C', enabled: true },
        { id: 'custom1', label: 'Accent', color: 'C45C26', enabled: true },
        { id: 'custom2', label: 'Link', color: 'B45309', enabled: true },
        { id: 'custom3', label: 'Muted', color: 'A8A29E', enabled: true },
        { id: 'custom4', label: 'Paper', color: 'FAF7F2', enabled: true },
        { id: 'custom5', label: 'Custom 5', color: '#ffffff', enabled: false },
        { id: 'custom6', label: 'Custom 6', color: '#ffffff', enabled: false },
      ],
    },
  },
]

export const DEMO_THEME_HINT_STORAGE_KEY = 'vueWebsitePageBuilderDemoThemeHintSeen'
