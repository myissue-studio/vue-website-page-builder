// @vitest-environment jsdom
/**
 * Tests for useThemeColorPresets composable.
 *
 * Covers:
 *  - buildStorageKey()             — user-scoped vs shared key derivation
 *  - Initial hydration             — config values become initial defaults
 *  - Persistence priority          — localStorage beats config on re-hydration
 *  - Same-session preservation     — modal reopen does NOT revert user changes
 *  - Page-reload persistence       — changes survive clearing hasLoaded
 *  - updateThemeColorPreset()      — normalises hex, persists to localStorage
 *  - setThemeColorPresetsEnabled() — toggles global enabled flag, persists
 *  - resetThemeColorPresets()      — clears storage and restores built-in defaults
 *  - User-specific isolation       — different user ids write to separate keys
 *  - PageBuilderUser.id type       — accepts string and number ids
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import {
  useThemeColorPresets,
  resetThemeColorPresets,
  buildStorageKey,
} from '../../composables/useThemeColorPresets'
import type { PageBuilderConfig } from '../../types'

const BASE_KEY = 'vueWebsitePageBuilderThemeColorPresets'

// Reset singleton state and clear localStorage before every test so tests
// cannot affect each other through shared module-level state or storage.
beforeEach(() => {
  resetThemeColorPresets()
  localStorage.clear()
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeConfig(overrides: Partial<PageBuilderConfig> = {}): PageBuilderConfig {
  return {
    updateOrCreate: { formType: 'create', formName: 'article' },
    ...overrides,
  }
}

function storedColors(key = BASE_KEY): Array<{ id: string; color: string; enabled: boolean }> {
  const raw = localStorage.getItem(key)
  if (!raw) return []
  return JSON.parse(raw).colors ?? []
}

function storedColorById(id: string, key = BASE_KEY): { color: string; enabled: boolean } | undefined {
  return storedColors(key).find((c) => c.id === id)
}

// ---------------------------------------------------------------------------
// buildStorageKey
// ---------------------------------------------------------------------------
describe('buildStorageKey', () => {
  it('returns the base key when no config is provided', () => {
    expect(buildStorageKey()).toBe(BASE_KEY)
  })

  it('returns the base key when userForPageBuilder has no id', () => {
    const config = makeConfig({ userForPageBuilder: { name: 'Alice' } })
    expect(buildStorageKey(config)).toBe(BASE_KEY)
  })

  it('builds a user-scoped key from a numeric id', () => {
    const config = makeConfig({ userForPageBuilder: { name: 'Alice', id: 42 } })
    expect(buildStorageKey(config)).toBe(`${BASE_KEY}-u42`)
  })

  it('builds a user-scoped key from a string id', () => {
    const config = makeConfig({ userForPageBuilder: { name: 'Bob', id: 'usr-abc' } })
    expect(buildStorageKey(config)).toBe(`${BASE_KEY}-uusr-abc`)
  })

  it('falls back to the base key when id is an empty string', () => {
    const config = makeConfig({ userForPageBuilder: { name: 'Charlie', id: '' } })
    expect(buildStorageKey(config)).toBe(BASE_KEY)
  })

  it('falls back to the base key when id is whitespace only', () => {
    const config = makeConfig({ userForPageBuilder: { name: 'Dave', id: '   ' } })
    expect(buildStorageKey(config)).toBe(BASE_KEY)
  })
})

// ---------------------------------------------------------------------------
// PageBuilderUser.id type flexibility
// ---------------------------------------------------------------------------
describe('PageBuilderUser.id type flexibility', () => {
  it('accepts a numeric id in the config type', () => {
    const config: PageBuilderConfig = makeConfig({
      userForPageBuilder: { name: 'Alice', id: 1 },
    })
    expect(config.userForPageBuilder?.id).toBe(1)
  })

  it('accepts a string id in the config type', () => {
    const config: PageBuilderConfig = makeConfig({
      userForPageBuilder: { name: 'Bob', id: 'u-999' },
    })
    expect(config.userForPageBuilder?.id).toBe('u-999')
  })

  it('accepts a config without id (backwards compatible)', () => {
    const config: PageBuilderConfig = makeConfig({
      userForPageBuilder: { name: 'Charlie' },
    })
    expect(config.userForPageBuilder?.id).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// Initial hydration
// ---------------------------------------------------------------------------
describe('initial hydration', () => {
  it('uses config values as initial defaults when localStorage is empty', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'primary', color: '#ff0000', enabled: true }],
          },
        },
      }),
    )

    const { themeColorPresetSettings } = useThemeColorPresets(config)
    const primary = themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')
    expect(primary?.color).toBe('#ff0000')
  })

  it('saves config values to localStorage on first load', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'primary', color: '#123456', enabled: true }],
          },
        },
      }),
    )
    useThemeColorPresets(config)

    expect(storedColorById('primary')?.color).toBe('#123456')
  })

  it('uses built-in defaults when neither config nor localStorage provide colors', () => {
    const { themeColorPresetSettings } = useThemeColorPresets()
    const primary = themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')
    expect(primary?.color).toBe('#16a34a')
    expect(primary?.enabled).toBe(true)
  })

  it('normalises a bare 6-digit hex from config (adds #)', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'secondary', color: 'E5D352', enabled: true }],
          },
        },
      }),
    )
    const { themeColorPresetSettings } = useThemeColorPresets(config)
    const secondary = themeColorPresetSettings.value.colors.find((c) => c.id === 'secondary')
    expect(secondary?.color).toBe('#e5d352')
  })
})

// ---------------------------------------------------------------------------
// Persistence priority: localStorage beats config
// ---------------------------------------------------------------------------
describe('localStorage takes priority over config on re-hydration', () => {
  it('uses stored color on simulated page reload, ignoring config value', () => {
    // Seed localStorage with user's saved color (simulates a previous session)
    localStorage.setItem(
      BASE_KEY,
      JSON.stringify({
        enabled: true,
        colors: [{ id: 'primary', label: 'Primary', color: '#000000', enabled: true }],
      }),
    )

    // Config still carries the original default color
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'primary', color: '#aaaaaa', enabled: true }],
          },
        },
      }),
    )

    const { themeColorPresetSettings } = useThemeColorPresets(config)
    const primary = themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')
    // Must use stored value, not config
    expect(primary?.color).toBe('#000000')
  })

  it('preserves enabled=false across a simulated reload', () => {
    localStorage.setItem(
      BASE_KEY,
      JSON.stringify({
        enabled: true,
        colors: [{ id: 'custom1', label: 'Custom 1', color: '#ffffff', enabled: false }],
      }),
    )

    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'custom1', color: '#ffffff', enabled: true }],
          },
        },
      }),
    )

    const { themeColorPresetSettings } = useThemeColorPresets(config)
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'custom1')?.enabled).toBe(
      false,
    )
  })
})

// ---------------------------------------------------------------------------
// Same-session preservation: modal close → reopen
// ---------------------------------------------------------------------------
describe('same-session preservation (modal close / reopen)', () => {
  it('does not revert a color change when useThemeColorPresets is called a second time', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'secondary', color: '#ffffff', enabled: true }],
          },
        },
      }),
    )

    // First mount (modal opens)
    const { updateThemeColorPreset, themeColorPresetSettings } = useThemeColorPresets(config)
    updateThemeColorPreset('secondary', { color: '#123456' })
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'secondary')?.color).toBe(
      '#123456',
    )

    // Second mount (modal closes and reopens — same config ref)
    const { themeColorPresetSettings: settings2 } = useThemeColorPresets(config)
    // Must preserve user's change, NOT revert to config '#ffffff'
    expect(settings2.value.colors.find((c) => c.id === 'secondary')?.color).toBe('#123456')
  })

  it('does not revert enabled=false when modal reopens', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'custom2', color: '#ffffff', enabled: true }],
          },
        },
      }),
    )

    const { updateThemeColorPreset } = useThemeColorPresets(config)
    updateThemeColorPreset('custom2', { enabled: false })

    // Reopen
    const { themeColorPresetSettings } = useThemeColorPresets(config)
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'custom2')?.enabled).toBe(
      false,
    )
  })
})

// ---------------------------------------------------------------------------
// updateThemeColorPreset
// ---------------------------------------------------------------------------
describe('updateThemeColorPreset', () => {
  it('accepts a 6-digit hex without hash and normalises it', () => {
    const { updateThemeColorPreset, themeColorPresetSettings } = useThemeColorPresets()
    updateThemeColorPreset('primary', { color: 'ff4400' })
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.color).toBe(
      '#ff4400',
    )
  })

  it('accepts a full #rrggbb hex', () => {
    const { updateThemeColorPreset, themeColorPresetSettings } = useThemeColorPresets()
    updateThemeColorPreset('primary', { color: '#AABBCC' })
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.color).toBe(
      '#aabbcc',
    )
  })

  it('persists the normalised color to localStorage', () => {
    const { updateThemeColorPreset } = useThemeColorPresets()
    updateThemeColorPreset('primary', { color: 'AABBCC' })
    expect(storedColorById('primary')?.color).toBe('#aabbcc')
  })

  it('updates the enabled flag and persists it', () => {
    const { updateThemeColorPreset } = useThemeColorPresets()
    updateThemeColorPreset('custom1', { enabled: true })
    expect(storedColorById('custom1')?.enabled).toBe(true)
  })

  it('leaves an invalid hex unchanged in-memory and in storage', () => {
    const config = ref(
      makeConfig({
        settings: { themeColorPresets: { colors: [{ id: 'primary', color: '#aabbcc', enabled: true }] } },
      }),
    )
    const { updateThemeColorPreset, themeColorPresetSettings } = useThemeColorPresets(config)
    updateThemeColorPreset('primary', { color: 'not-a-color' })
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.color).toBe(
      '#aabbcc',
    )
  })
})

// ---------------------------------------------------------------------------
// setThemeColorPresetsEnabled
// ---------------------------------------------------------------------------
describe('setThemeColorPresetsEnabled', () => {
  it('setting enabled=false empties enabledThemeColorPresets', () => {
    const { setThemeColorPresetsEnabled, enabledThemeColorPresets } = useThemeColorPresets()
    setThemeColorPresetsEnabled(false)
    expect(enabledThemeColorPresets.value).toHaveLength(0)
  })

  it('re-enabling restores colors with valid hex', () => {
    const { setThemeColorPresetsEnabled, enabledThemeColorPresets } = useThemeColorPresets()
    setThemeColorPresetsEnabled(false)
    setThemeColorPresetsEnabled(true)
    // Built-in defaults have primary + secondary enabled with valid hex
    expect(enabledThemeColorPresets.value.length).toBeGreaterThanOrEqual(2)
  })

  it('persists the enabled flag to localStorage', () => {
    const { setThemeColorPresetsEnabled } = useThemeColorPresets()
    setThemeColorPresetsEnabled(false)

    const stored = JSON.parse(localStorage.getItem(BASE_KEY)!)
    expect(stored.enabled).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// resetToConfigDefaults
// ---------------------------------------------------------------------------
describe('resetToConfigDefaults', () => {
  it('restores colors to the config-provided values, not built-in defaults', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'primary', color: '#ff4400', enabled: true }],
          },
        },
      }),
    )
    const { updateThemeColorPreset, resetToConfigDefaults, themeColorPresetSettings } =
      useThemeColorPresets(config)

    // User changes the color
    updateThemeColorPreset('primary', { color: '#000000' })
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.color).toBe(
      '#000000',
    )

    // Reset to config defaults — should restore #ff4400, not the built-in #16a34a
    resetToConfigDefaults()
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.color).toBe(
      '#ff4400',
    )
  })

  it('persists the config-provided values to localStorage', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'primary', color: '#aabbcc', enabled: true }],
          },
        },
      }),
    )
    const { updateThemeColorPreset, resetToConfigDefaults } = useThemeColorPresets(config)

    updateThemeColorPreset('primary', { color: '#000000' })
    resetToConfigDefaults()

    expect(storedColorById('primary')?.color).toBe('#aabbcc')
  })

  it('restores enabled=true for a color the user had disabled', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'custom1', color: '#cccccc', enabled: true }],
          },
        },
      }),
    )
    const { updateThemeColorPreset, resetToConfigDefaults, themeColorPresetSettings } =
      useThemeColorPresets(config)

    updateThemeColorPreset('custom1', { enabled: false })
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'custom1')?.enabled).toBe(
      false,
    )

    resetToConfigDefaults()
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'custom1')?.enabled).toBe(
      true,
    )
  })

  it('falls back to built-in defaults when no config colors are provided', () => {
    const { updateThemeColorPreset, resetToConfigDefaults, themeColorPresetSettings } =
      useThemeColorPresets()

    updateThemeColorPreset('primary', { color: '#000000' })
    resetToConfigDefaults()

    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.color).toBe(
      '#16a34a',
    )
  })

  it('writes to the user-scoped key when a user id is present', () => {
    const config = ref(
      makeConfig({
        userForPageBuilder: { name: 'Alice', id: 5 },
        settings: {
          themeColorPresets: {
            colors: [{ id: 'primary', color: '#123456', enabled: true }],
          },
        },
      }),
    )
    const { updateThemeColorPreset, resetToConfigDefaults } = useThemeColorPresets(config)

    updateThemeColorPreset('primary', { color: '#000000' })
    resetToConfigDefaults()

    expect(storedColorById('primary', `${BASE_KEY}-u5`)?.color).toBe('#123456')
    expect(localStorage.getItem(BASE_KEY)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// resetThemeColorPresets
// ---------------------------------------------------------------------------
describe('resetThemeColorPresets', () => {
  it('removes the storage entry for the current user', () => {
    const { updateThemeColorPreset } = useThemeColorPresets()
    updateThemeColorPreset('primary', { color: '#ff0000' })
    expect(localStorage.getItem(BASE_KEY)).not.toBeNull()

    resetThemeColorPresets()
    expect(localStorage.getItem(BASE_KEY)).toBeNull()
  })

  it('restores in-memory state to built-in defaults after reset', () => {
    const { updateThemeColorPreset } = useThemeColorPresets()
    updateThemeColorPreset('primary', { color: '#ff0000' })

    resetThemeColorPresets()

    const { themeColorPresetSettings } = useThemeColorPresets()
    const primary = themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')
    expect(primary?.color).toBe('#16a34a')
  })

  it('removes the user-scoped key, not the base key', () => {
    // Seed the base key to prove it is left alone
    localStorage.setItem(BASE_KEY, JSON.stringify({ enabled: true, colors: [] }))

    const config = ref(makeConfig({ userForPageBuilder: { name: 'Alice', id: 7 } }))
    const { updateThemeColorPreset } = useThemeColorPresets(config)
    updateThemeColorPreset('primary', { color: '#ff0000' })

    resetThemeColorPresets() // removes u7 key

    expect(localStorage.getItem(`${BASE_KEY}-u7`)).toBeNull()
    // Base key must be untouched by user 7's reset
    expect(localStorage.getItem(BASE_KEY)).not.toBeNull()
  })
})

// ---------------------------------------------------------------------------
// User-specific storage isolation
// ---------------------------------------------------------------------------
describe('user-specific storage isolation', () => {
  it('writes to the user-scoped key, not the base key', () => {
    const config = ref(
      makeConfig({
        userForPageBuilder: { name: 'Alice', id: 1 },
        settings: {
          themeColorPresets: { colors: [{ id: 'primary', color: '#111111', enabled: true }] },
        },
      }),
    )
    useThemeColorPresets(config)

    expect(localStorage.getItem(`${BASE_KEY}-u1`)).not.toBeNull()
    expect(localStorage.getItem(BASE_KEY)).toBeNull()
  })

  it('user 2 does not overwrite user 1 stored presets', () => {
    // Pre-seed user 1's saved presets directly in localStorage
    localStorage.setItem(
      `${BASE_KEY}-u1`,
      JSON.stringify({
        enabled: true,
        colors: [{ id: 'primary', label: 'Primary', color: '#aaaaaa', enabled: true }],
      }),
    )

    // Load as user 2 (different user, no prior storage)
    const configUser2 = ref(
      makeConfig({
        userForPageBuilder: { name: 'Bob', id: 2 },
        settings: {
          themeColorPresets: {
            colors: [{ id: 'primary', color: '#222222', enabled: true }],
          },
        },
      }),
    )
    const { updateThemeColorPreset } = useThemeColorPresets(configUser2)
    updateThemeColorPreset('primary', { color: '#bbbbbb' })

    // User 2 stored their own color
    expect(storedColorById('primary', `${BASE_KEY}-u2`)?.color).toBe('#bbbbbb')

    // User 1's data is completely untouched
    expect(storedColorById('primary', `${BASE_KEY}-u1`)?.color).toBe('#aaaaaa')
  })

  it('two users reading from storage get their own presets', () => {
    // Pre-seed both user keys
    localStorage.setItem(
      `${BASE_KEY}-u10`,
      JSON.stringify({
        enabled: true,
        colors: [{ id: 'primary', label: 'Primary', color: '#decade', enabled: true }],
      }),
    )
    localStorage.setItem(
      `${BASE_KEY}-u20`,
      JSON.stringify({
        enabled: true,
        colors: [{ id: 'primary', label: 'Primary', color: '#facade', enabled: true }],
      }),
    )

    // Load as user 10
    const { themeColorPresetSettings: settings10 } = useThemeColorPresets(
      ref(makeConfig({ userForPageBuilder: { name: 'User10', id: 10 } })),
    )
    expect(settings10.value.colors.find((c) => c.id === 'primary')?.color).toBe('#decade')

    // Reset so user 20 loads fresh
    resetThemeColorPresets()

    // Load as user 20
    const { themeColorPresetSettings: settings20 } = useThemeColorPresets(
      ref(makeConfig({ userForPageBuilder: { name: 'User20', id: 20 } })),
    )
    expect(settings20.value.colors.find((c) => c.id === 'primary')?.color).toBe('#facade')
  })
})

// ---------------------------------------------------------------------------
// enabledThemeColorPresets computed
// ---------------------------------------------------------------------------
describe('enabledThemeColorPresets computed', () => {
  it('only includes presets where enabled=true with a valid hex color', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            enabled: true,
            colors: [
              { id: 'primary', color: '#ff0000', enabled: true },
              { id: 'secondary', color: '#00ff00', enabled: false }, // disabled — excluded
              { id: 'custom2', color: '#0000ff', enabled: true },
            ],
          },
        },
      }),
    )
    const { enabledThemeColorPresets } = useThemeColorPresets(config)
    const ids = enabledThemeColorPresets.value.map((p) => p.id)
    expect(ids).toContain('primary')
    expect(ids).toContain('custom2')
    expect(ids).not.toContain('secondary') // disabled
  })

  it('invalid hex in config is normalised to the built-in fallback color (still visible when enabled)', () => {
    // normalizeHexColor('not-valid', fallback) → returns the fallback (a valid hex)
    // so the preset shows up in enabledThemeColorPresets with the fallback color
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            enabled: true,
            colors: [{ id: 'custom3', color: 'not-valid', enabled: true }],
          },
        },
      }),
    )
    const { enabledThemeColorPresets, themeColorPresetSettings } = useThemeColorPresets(config)
    const preset = themeColorPresetSettings.value.colors.find((c) => c.id === 'custom3')
    // Color is normalised to the built-in fallback, not left as 'not-valid'
    expect(preset?.color).toBe('#ffffff') // custom3 built-in default
    // Because it now has a valid hex it appears in the enabled list
    expect(enabledThemeColorPresets.value.map((p) => p.id)).toContain('custom3')
  })

  it('returns empty array when global enabled is false, regardless of individual presets', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            enabled: false,
            colors: [
              { id: 'primary', color: '#ff0000', enabled: true },
              { id: 'secondary', color: '#00ff00', enabled: true },
            ],
          },
        },
      }),
    )
    const { enabledThemeColorPresets } = useThemeColorPresets(config)
    expect(enabledThemeColorPresets.value).toHaveLength(0)
  })

  it('global disable does not delete individual preset colors — re-enable restores them', () => {
    const { setThemeColorPresetsEnabled, enabledThemeColorPresets, themeColorPresetSettings } =
      useThemeColorPresets()
    // Defaults: primary and secondary are enabled
    const countBefore = enabledThemeColorPresets.value.length

    setThemeColorPresetsEnabled(false)
    expect(enabledThemeColorPresets.value).toHaveLength(0)

    // Individual colors still intact in settings
    const primary = themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')
    expect(primary?.enabled).toBe(true) // individual flag unchanged

    setThemeColorPresetsEnabled(true)
    expect(enabledThemeColorPresets.value.length).toBe(countBefore)
  })

  it('returns empty array when all individual presets are disabled', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            enabled: true,
            colors: [
              { id: 'primary', color: '#ff0000', enabled: false },
              { id: 'secondary', color: '#00ff00', enabled: false },
            ],
          },
        },
      }),
    )
    const { enabledThemeColorPresets } = useThemeColorPresets(config)
    expect(enabledThemeColorPresets.value).toHaveLength(0)
  })

  it('reflects updates immediately after updateThemeColorPreset', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            enabled: true,
            colors: [{ id: 'custom1', color: '#ff0000', enabled: false }],
          },
        },
      }),
    )
    const { updateThemeColorPreset, enabledThemeColorPresets } = useThemeColorPresets(config)
    expect(enabledThemeColorPresets.value.map((p) => p.id)).not.toContain('custom1')

    updateThemeColorPreset('custom1', { enabled: true })
    expect(enabledThemeColorPresets.value.map((p) => p.id)).toContain('custom1')
  })
})

// ---------------------------------------------------------------------------
// All 8 preset IDs always present (normalization)
// ---------------------------------------------------------------------------
describe('normalization — all 8 preset IDs always present', () => {
  it('fills in missing presets from built-in defaults when config only provides some', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'primary', color: '#ff0000', enabled: true }],
          },
        },
      }),
    )
    const { themeColorPresetSettings } = useThemeColorPresets(config)
    const ids = themeColorPresetSettings.value.colors.map((c) => c.id)
    expect(ids).toEqual(['primary', 'secondary', 'custom1', 'custom2', 'custom3', 'custom4', 'custom5', 'custom6'])
  })

  it('always produces exactly 8 presets regardless of config input', () => {
    const { themeColorPresetSettings } = useThemeColorPresets()
    expect(themeColorPresetSettings.value.colors).toHaveLength(8)
  })

  it('unknown ids in config colors are ignored (not added to the list)', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'unknown-id', color: '#ff0000', enabled: true }],
          },
        },
      }),
    )
    const { themeColorPresetSettings } = useThemeColorPresets(config)
    const ids = themeColorPresetSettings.value.colors.map((c) => c.id)
    expect(ids).not.toContain('unknown-id')
    expect(ids).toHaveLength(8)
  })

  it('config with empty colors array produces 8 presets from built-in defaults', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: { enabled: true, colors: [] },
        },
      }),
    )
    const { themeColorPresetSettings } = useThemeColorPresets(config)
    expect(themeColorPresetSettings.value.colors).toHaveLength(8)
    // Defaults for primary and secondary
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.color).toBe('#16a34a')
  })

  it('null themeColorPresets in config falls back to built-in defaults', () => {
    const config = ref(
      makeConfig({ settings: { themeColorPresets: null } }),
    )
    const { themeColorPresetSettings } = useThemeColorPresets(config)
    expect(themeColorPresetSettings.value.colors).toHaveLength(8)
    expect(themeColorPresetSettings.value.enabled).toBe(true)
  })

  it('storage output always has all 8 ids after hydration', () => {
    const config = ref(
      makeConfig({
        settings: {
          themeColorPresets: {
            colors: [{ id: 'primary', color: '#abcdef', enabled: true }],
          },
        },
      }),
    )
    useThemeColorPresets(config)
    expect(storedColors()).toHaveLength(8)
  })
})

// ---------------------------------------------------------------------------
// Color normalization edge cases
// ---------------------------------------------------------------------------
describe('color normalization edge cases', () => {
  it('rejects a 3-char hex and keeps the existing color', () => {
    const config = ref(
      makeConfig({
        settings: { themeColorPresets: { colors: [{ id: 'primary', color: '#ff0000', enabled: true }] } },
      }),
    )
    const { updateThemeColorPreset, themeColorPresetSettings } = useThemeColorPresets(config)
    updateThemeColorPreset('primary', { color: '#fff' })
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.color).toBe('#ff0000')
  })

  it('rejects a hex with spaces and keeps the existing color', () => {
    const config = ref(
      makeConfig({
        settings: { themeColorPresets: { colors: [{ id: 'primary', color: '#ff0000', enabled: true }] } },
      }),
    )
    const { updateThemeColorPreset, themeColorPresetSettings } = useThemeColorPresets(config)
    updateThemeColorPreset('primary', { color: '# ff0000' })
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.color).toBe('#ff0000')
  })

  it('lowercases a valid uppercase hex', () => {
    const { updateThemeColorPreset, themeColorPresetSettings } = useThemeColorPresets()
    updateThemeColorPreset('primary', { color: '#FFAABB' })
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.color).toBe('#ffaabb')
  })

  it('already-lowercase hex passes through unchanged', () => {
    const { updateThemeColorPreset, themeColorPresetSettings } = useThemeColorPresets()
    updateThemeColorPreset('primary', { color: '#ffaabb' })
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.color).toBe('#ffaabb')
  })
})

// ---------------------------------------------------------------------------
// buildStorageKey — additional edge cases
// ---------------------------------------------------------------------------
describe('buildStorageKey — additional edge cases', () => {
  it('uses user-scoped key for numeric id 0 (falsy but valid)', () => {
    const config = makeConfig({ userForPageBuilder: { name: 'Zero', id: 0 } })
    expect(buildStorageKey(config)).toBe(`${BASE_KEY}-u0`)
  })

  it('falls back to base key for null id', () => {
    const config = makeConfig({ userForPageBuilder: { name: 'Alice', id: null } })
    expect(buildStorageKey(config)).toBe(BASE_KEY)
  })

  it('falls back to base key for undefined id', () => {
    const config = makeConfig({ userForPageBuilder: { name: 'Alice', id: undefined } })
    expect(buildStorageKey(config)).toBe(BASE_KEY)
  })

  it('produces the same key every time for the same config', () => {
    const config = makeConfig({ userForPageBuilder: { name: 'Alice', id: 42 } })
    expect(buildStorageKey(config)).toBe(buildStorageKey(config))
  })
})

// ---------------------------------------------------------------------------
// Multiple updates — consistency
// ---------------------------------------------------------------------------
describe('multiple updates stay consistent in memory and storage', () => {
  it('sequential color + enabled updates are both reflected', () => {
    const { updateThemeColorPreset, themeColorPresetSettings } = useThemeColorPresets()

    updateThemeColorPreset('custom1', { color: '#abcdef' })
    updateThemeColorPreset('custom1', { enabled: true })

    const preset = themeColorPresetSettings.value.colors.find((c) => c.id === 'custom1')
    expect(preset?.color).toBe('#abcdef')
    expect(preset?.enabled).toBe(true)

    // Both changes in storage
    const stored = storedColorById('custom1')
    expect(stored?.color).toBe('#abcdef')
    expect(stored?.enabled).toBe(true)
  })

  it('updating one preset does not affect others', () => {
    const { updateThemeColorPreset, themeColorPresetSettings } = useThemeColorPresets()
    const originalSecondary = themeColorPresetSettings.value.colors.find((c) => c.id === 'secondary')?.color

    updateThemeColorPreset('primary', { color: '#ff0000' })

    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'secondary')?.color).toBe(originalSecondary)
  })

  it('label update is saved and retrieved', () => {
    const { updateThemeColorPreset, themeColorPresetSettings } = useThemeColorPresets()
    updateThemeColorPreset('primary', { label: 'Brand' })

    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.label).toBe('Brand')
    const stored = storedColors().find((c) => c.id === 'primary') as { label?: string } | undefined
    expect(stored?.label).toBe('Brand')
  })
})

// ---------------------------------------------------------------------------
// End-to-end: full session + simulated page reload
// ---------------------------------------------------------------------------
describe('end-to-end: full session and page reload', () => {
  it('user changes survive a simulated page reload (hasLoaded reset)', () => {
    // ---- Session 1: user makes changes ----
    const config = ref(
      makeConfig({
        userForPageBuilder: { name: 'Alice', id: 99 },
        settings: {
          themeColorPresets: {
            colors: [
              { id: 'primary', color: '#ff0000', enabled: true },
              { id: 'custom1', color: '#ffffff', enabled: true },
            ],
          },
        },
      }),
    )
    const { updateThemeColorPreset, setThemeColorPresetsEnabled } = useThemeColorPresets(config)
    updateThemeColorPreset('primary', { color: '#123456' })
    updateThemeColorPreset('custom1', { enabled: false })
    setThemeColorPresetsEnabled(true)

    // ---- Simulate page reload (reset singleton, keep localStorage) ----
    // resetThemeColorPresets deletes the active key — we preserve it manually
    const savedData = localStorage.getItem(`${BASE_KEY}-u99`)!
    resetThemeColorPresets()
    localStorage.setItem(`${BASE_KEY}-u99`, savedData)

    // ---- Session 2: builder re-initialises with same config ----
    const { themeColorPresetSettings } = useThemeColorPresets(config)

    // User's changes must survive
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'primary')?.color).toBe('#123456')
    expect(themeColorPresetSettings.value.colors.find((c) => c.id === 'custom1')?.enabled).toBe(false)
    expect(themeColorPresetSettings.value.enabled).toBe(true)
  })

  it('global disabled state survives a simulated reload', () => {
    const config = ref(makeConfig({ userForPageBuilder: { name: 'Bob', id: 88 } }))
    const { setThemeColorPresetsEnabled } = useThemeColorPresets(config)
    setThemeColorPresetsEnabled(false)

    const savedData = localStorage.getItem(`${BASE_KEY}-u88`)!
    resetThemeColorPresets()
    localStorage.setItem(`${BASE_KEY}-u88`, savedData)

    const { themeColorPresetSettings } = useThemeColorPresets(config)
    expect(themeColorPresetSettings.value.enabled).toBe(false)
  })
})
