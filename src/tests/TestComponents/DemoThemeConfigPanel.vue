<script setup lang="ts">
import { computed } from 'vue'
import ThemeColorPresetManager from '../../Components/PageBuilder/EditorMenu/Editables/ThemeColorPresetManager.vue'
import HexColorPicker from '../../Components/Inputs/HexColorPicker.vue'
import SliderIcon from '../../Components/Icons/SliderIcon.vue'
import ModalFilterChip from '../../Components/Modals/ModalFilterChip.vue'
import { sharedPageBuilderStore } from '../../stores/shared-store'
import type { PageBuilderConfig, PageBuilderElementFonts } from '../../types'

const pageBuilderStateStore = sharedPageBuilderStore

const DEMO_FONT_OPTIONS = [
  { value: 'jost', label: 'Jost' },
  { value: 'raleway', label: 'Raleway' },
  { value: 'inter', label: 'Inter' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'arial', label: 'Arial' },
  { value: 'georgia', label: 'Georgia' },
] as const

function patchConfig(
  patch: Partial<PageBuilderConfig> & {
    settings?: PageBuilderConfig['settings']
    userSettings?: PageBuilderConfig['userSettings']
  },
): void {
  const current = pageBuilderStateStore.getPageBuilderConfig
  if (!current) return

  pageBuilderStateStore.setPageBuilderConfig({
    ...current,
    ...patch,
    settings: patch.settings ? { ...current.settings, ...patch.settings } : current.settings,
    userSettings: patch.userSettings
      ? { ...current.userSettings, ...patch.userSettings }
      : current.userSettings,
  })
}

function buildElementFonts(fontKey: string): PageBuilderElementFonts {
  const list = `${fontKey}, arial, fantasy`
  return {
    h1: list,
    h2: list,
    h3: list,
    h4: list,
    h5: list,
    h6: list,
    p: list,
  }
}

const brandColor = computed({
  get: () => pageBuilderStateStore.getPageBuilderConfig?.settings?.brandColor ?? '#DB93B0',
  set: (value: string) => {
    patchConfig({
      settings: {
        brandColor: value,
      },
    })
  },
})

const canvasFont = computed(() => {
  const fontConfig = pageBuilderStateStore.getPageBuilderConfig?.userSettings?.fontFamily ?? 'jost'
  return fontConfig.split(',')[0]?.trim().toLowerCase() || 'jost'
})

function setCanvasFont(fontKey: string): void {
  patchConfig({
    userSettings: {
      fontFamily: `${fontKey}, arial, fantasy`,
      elementFonts: buildElementFonts(fontKey),
    },
  })
}
</script>

<template>
  <div class="pbx-flex pbx-flex-col pbx-gap-5 pbx-pb-6">
    <div
      class="pbx-flex pbx-items-start pbx-gap-3 pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-gray-50 pbx-p-3"
    >
      <span class="pbx-pageDesignOpenButtonIcon pbx-mt-0.5">
        <SliderIcon :size="18" />
      </span>
      <div class="pbx-flex pbx-flex-col pbx-gap-1">
        <p class="pbx-m-0 pbx-text-sm pbx-font-semibold pbx-text-myPrimaryDarkGrayColor">
          Try your brand on the live editor
        </p>
        <p class="pbx-m-0 pbx-text-xs pbx-leading-relaxed pbx-text-gray-500">
          Host apps pass the same options to
          <code class="pbx-text-[11px]">startBuilder()</code> — brand color, theme presets, and
          fonts. Changes apply instantly on the canvas and toolbar.
        </p>
      </div>
    </div>

    <section class="pbx-productSettingsSection">
      <div class="pbx-productSettingsSectionHeader">
        <p class="pbx-productSettingsSectionTitle">Brand color</p>
        <p class="pbx-productSettingsSectionDesc">
          UI chrome, buttons, and link accents (toolbar, modals, focus states)
        </p>
      </div>
      <div
        class="pbx-flex pbx-flex-wrap pbx-items-center pbx-gap-3 pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-100 pbx-bg-gray-50 pbx-px-3 pbx-py-3"
      >
        <HexColorPicker v-model="brandColor" />
        <label class="pbx-sr-only" for="demo-brand-color-input">Brand color hex</label>
        <input
          id="demo-brand-color-input"
          v-model="brandColor"
          type="text"
          class="pbx-myPrimaryInput pbx-min-w-0 pbx-flex-1 pbx-text-sm"
          spellcheck="false"
          autocomplete="off"
        />
      </div>
    </section>

    <section class="pbx-productSettingsSection">
      <div class="pbx-productSettingsSectionHeader">
        <p class="pbx-productSettingsSectionTitle">Theme color presets</p>
        <p class="pbx-productSettingsSectionDesc">
          Saved hex colors in text and background menus — same panel as in Settings
        </p>
      </div>
      <ThemeColorPresetManager embedded />
    </section>

    <section class="pbx-productSettingsSection">
      <div class="pbx-productSettingsSectionHeader">
        <p class="pbx-productSettingsSectionTitle">Canvas font</p>
        <p class="pbx-productSettingsSectionDesc">
          Default font for headings and paragraphs via
          <code class="pbx-text-[11px]">userSettings.fontFamily</code>
        </p>
      </div>
      <div class="pbx-productSettingsSectionChips">
        <ModalFilterChip
          v-for="option in DEMO_FONT_OPTIONS"
          :key="option.value"
          :label="option.label"
          :active="canvasFont === option.value"
          @click="setCanvasFont(option.value)"
        />
      </div>
    </section>

    <section class="pbx-productSettingsSection">
      <div class="pbx-productSettingsSectionHeader">
        <p class="pbx-productSettingsSectionTitle">Product catalog</p>
        <p class="pbx-productSettingsSectionDesc">
          Ecommerce teams inject their own picker with
          <code class="pbx-text-[11px]">:DisplayProducts</code> — use the Products button in the
          navbar to try the demo catalog.
        </p>
      </div>
    </section>
  </div>
</template>
