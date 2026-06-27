import { computed, ref, unref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type {
  PageBuilderConfig,
  ThemeColorPreset,
  ThemeColorPresetId,
  ThemeColorPresetSettings,
} from '../types'

const BASE_STORAGE_KEY = 'vueWebsitePageBuilderThemeColorPresets'

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

// ---------------------------------------------------------------------------
// Module-level singleton — shared across all component instances in the same
// application session so every panel reads from the same reactive source.
// ---------------------------------------------------------------------------
const themeColorPresetSettings = ref<ThemeColorPresetSettings>({
  enabled: true,
  colors: PRESET_IDS.map((id) => ({ ...DEFAULT_COLORS[id] })),
})

let hasLoaded = false
// Tracks which user's data is currently resident in the singleton above.
let activeStorageKey = BASE_STORAGE_KEY

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Build a user-scoped storage key so each user keeps their own presets.
 * Falls back to the shared key when no `userForPageBuilder.id` is provided.
 *
 * @example
 * // user id 42  → "vueWebsitePageBuilderThemeColorPresets-u42"
 * // no id       → "vueWebsitePageBuilderThemeColorPresets"
 */
export function buildStorageKey(config?: PageBuilderConfig | null): string {
  const userId = config?.userForPageBuilder?.id
  if (userId != null && String(userId).trim() !== '') {
    return `${BASE_STORAGE_KEY}-u${String(userId).trim()}`
  }
  return BASE_STORAGE_KEY
}
function normalizeHexColor(color: unknown, fallback: string): string {
  if (typeof color !== 'string') return fallback

  const trimmed = color.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase()
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return `#${trimmed.toLowerCase()}`

  return fallback
}

function normalizeSettings(settings: unknown): ThemeColorPresetSettings {
  const source =
    settings && typeof settings === 'object' ? (settings as Partial<ThemeColorPresetSettings>) : {}
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

function saveThemeColorPresets(
  settings: ThemeColorPresetSettings,
  key: string = activeStorageKey,
): void {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(key, JSON.stringify(settings))
  } catch {
    // Ignore unavailable storage; callers still get in-memory presets.
  }
}

function readStoredThemeColorPresets(
  key: string = activeStorageKey,
): ThemeColorPresetSettings | null {
  if (typeof localStorage === 'undefined') return null

  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null

    return normalizeSettings(JSON.parse(raw))
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Hydration
//
// Priority (highest → lowest):
//   1. localStorage  — user's saved preferences survive modal close / page reload
//   2. config        — acts as initial defaults the very first time (no stored data)
//   3. DEFAULT_COLORS — ultimate fallback
// ---------------------------------------------------------------------------
function hydrateThemeColorPresets(config?: PageBuilderConfig | null): void {
  const storageKey = buildStorageKey(config)

  // When a different user opens the builder reset so we load their own data.
  if (hasLoaded && storageKey !== activeStorageKey) {
    hasLoaded = false
  }

  // In-memory state is already current for this user — nothing to do.
  // This is the key guard: prevents the config from overwriting user changes
  // every time the modal re-opens or the config ref updates.
  if (hasLoaded) return

  activeStorageKey = storageKey

  // 1. Respect user's saved preferences.
  const stored = readStoredThemeColorPresets(storageKey)
  if (stored) {
    themeColorPresetSettings.value = stored
    hasLoaded = true
    return
  }

  // 2. No stored data yet — use config values as initial defaults.
  const configSettings = config?.settings?.themeColorPresets
  themeColorPresetSettings.value = normalizeSettings(configSettings ?? null)
  saveThemeColorPresets(themeColorPresetSettings.value, storageKey)
  hasLoaded = true
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Clear the stored theme color presets for the current user and reset the
 * in-memory state to built-in defaults.
 *
 * Useful when the user explicitly wants to "restore defaults" or when a
 * host application signs out a user and needs to clear personalization data.
 */
export function resetThemeColorPresets(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(activeStorageKey)
  }
  hasLoaded = false
  themeColorPresetSettings.value = normalizeSettings(null)
}

export function useThemeColorPresets(
  config?: Ref<PageBuilderConfig | null> | ComputedRef<PageBuilderConfig | null>,
) {
  hydrateThemeColorPresets(unref(config))

  if (config) {
    watch(
      config,
      (newConfig) => {
        hydrateThemeColorPresets(newConfig)
      },
      { immediate: true },
    )
  }

  /**
   * Restore theme color presets to the values originally provided in the
   * page builder config.  Clears the user's personalisation from localStorage
   * and replaces in-memory state with the normalised config colours.
   *
   * If the host app did not pass any themeColorPresets in the config, this
   * falls back to the package's built-in defaults (same as resetThemeColorPresets).
   */
  function resetToConfigDefaults(): void {
    const currentConfig = unref(config)
    const storageKey = buildStorageKey(currentConfig)
    const configSettings = currentConfig?.settings?.themeColorPresets
    themeColorPresetSettings.value = normalizeSettings(configSettings ?? null)
    saveThemeColorPresets(themeColorPresetSettings.value, storageKey)
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
    resetToConfigDefaults,
  }
}
