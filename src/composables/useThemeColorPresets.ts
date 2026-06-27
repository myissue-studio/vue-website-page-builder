import { computed, ref, unref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type {
  PageBuilderConfig,
  ThemeColorPreset,
  ThemeColorPresetId,
  ThemeColorPresetSettings,
} from '../types'

const STORAGE_KEY = 'vueWebsitePageBuilderThemeColorPresets'

const PRESET_IDS: ThemeColorPresetId[] = [
  'primary',
  'secondary',
  'custom1',
  'custom2',
  'custom3',
  'custom4',
  'custom5',
  'custom6',
]

const DEFAULT_COLORS: Record<ThemeColorPresetId, ThemeColorPreset> = {
  primary: { id: 'primary', label: 'Primary', color: '#16a34a', enabled: true },
  secondary: { id: 'secondary', label: 'Secondary', color: '#111827', enabled: true },
  custom1: { id: 'custom1', label: 'Custom 1', color: '#ffffff', enabled: false },
  custom2: { id: 'custom2', label: 'Custom 2', color: '#ffffff', enabled: false },
  custom3: { id: 'custom3', label: 'Custom 3', color: '#ffffff', enabled: false },
  custom4: { id: 'custom4', label: 'Custom 4', color: '#ffffff', enabled: false },
  custom5: { id: 'custom5', label: 'Custom 5', color: '#ffffff', enabled: false },
  custom6: { id: 'custom6', label: 'Custom 6', color: '#ffffff', enabled: false },
}

const themeColorPresetSettings = ref<ThemeColorPresetSettings>({
  enabled: true,
  colors: PRESET_IDS.map((id) => ({ ...DEFAULT_COLORS[id] })),
})

let hasLoaded = false

function normalizeHexColor(color: unknown, fallback: string): string {
  if (typeof color !== 'string') return fallback

  const trimmed = color.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase()
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return `#${trimmed.toLowerCase()}`

  return fallback
}

function normalizeSettings(settings: unknown): ThemeColorPresetSettings {
  const source = settings && typeof settings === 'object' ? (settings as Partial<ThemeColorPresetSettings>) : {}
  const sourceColors = Array.isArray(source.colors) ? source.colors : []

  return {
    enabled: typeof source.enabled === 'boolean' ? source.enabled : true,
    colors: PRESET_IDS.map((id) => {
      const fallback = DEFAULT_COLORS[id]
      const sourceColor = sourceColors.find((color) => color && color.id === id)

      return {
        id,
        label: typeof sourceColor?.label === 'string' ? sourceColor.label : fallback.label,
        color: normalizeHexColor(sourceColor?.color, fallback.color),
        enabled: typeof sourceColor?.enabled === 'boolean' ? sourceColor.enabled : fallback.enabled,
      }
    }),
  }
}

function saveThemeColorPresets(settings: ThemeColorPresetSettings): void {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Ignore unavailable storage; callers still get in-memory presets.
  }
}

function readStoredThemeColorPresets(): ThemeColorPresetSettings | null {
  if (typeof localStorage === 'undefined') return null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    return normalizeSettings(JSON.parse(raw))
  } catch {
    return null
  }
}

function hydrateThemeColorPresets(config?: PageBuilderConfig | null): void {
  const configSettings = config?.settings?.themeColorPresets

  if (configSettings) {
    themeColorPresetSettings.value = normalizeSettings(configSettings)
    saveThemeColorPresets(themeColorPresetSettings.value)
    hasLoaded = true
    return
  }

  if (hasLoaded) return

  themeColorPresetSettings.value = readStoredThemeColorPresets() ?? normalizeSettings(null)
  hasLoaded = true
}

export function useThemeColorPresets(
  config?: Ref<PageBuilderConfig | null> | ComputedRef<PageBuilderConfig | null>,
) {
  hydrateThemeColorPresets(unref(config))

  if (config) {
    watch(
      config,
      (newConfig) => {
        if (newConfig?.settings?.themeColorPresets) {
          hydrateThemeColorPresets(newConfig)
        }
      },
      { immediate: true },
    )
  }

  const enabledThemeColorPresets = computed(() => {
    if (!themeColorPresetSettings.value.enabled) return []

    return themeColorPresetSettings.value.colors.filter(
      (preset) => preset.enabled && /^#[0-9a-fA-F]{6}$/.test(preset.color),
    )
  })

  function setThemeColorPresetsEnabled(enabled: boolean): void {
    themeColorPresetSettings.value = {
      ...themeColorPresetSettings.value,
      enabled,
    }
    saveThemeColorPresets(themeColorPresetSettings.value)
  }

  function updateThemeColorPreset(
    id: ThemeColorPresetId,
    updates: Partial<Omit<ThemeColorPreset, 'id'>>,
  ): void {
    themeColorPresetSettings.value = {
      ...themeColorPresetSettings.value,
      colors: themeColorPresetSettings.value.colors.map((preset) =>
        preset.id === id
          ? {
              ...preset,
              ...updates,
              color:
                typeof updates.color === 'string'
                  ? normalizeHexColor(updates.color, preset.color)
                  : preset.color,
            }
          : preset,
      ),
    }
    saveThemeColorPresets(themeColorPresetSettings.value)
  }

  return {
    themeColorPresetSettings,
    enabledThemeColorPresets,
    setThemeColorPresetsEnabled,
    updateThemeColorPreset,
  }
}
