<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import ThemeColorPresetManager from '../../Components/PageBuilder/EditorMenu/Editables/ThemeColorPresetManager.vue'
import HexColorPicker from '../../Components/Inputs/HexColorPicker.vue'
import SliderIcon from '../../Components/Icons/SliderIcon.vue'
import ModalFilterChip from '../../Components/Modals/ModalFilterChip.vue'
import HtmlActionButton from '../../Components/PageBuilder/EditorMenu/Editables/HtmlActionButton.vue'
import HtmlEditorModal from '../../Components/PageBuilder/EditorMenu/Editables/HtmlEditorModal.vue'
import { sharedPageBuilderStore } from '../../stores/shared-store'
import { getPageBuilder } from '../../composables/usePageBuilder'
import { useTranslations } from '../../composables/useTranslations'
import { useThemeColorPresets } from '../../composables/useThemeColorPresets'
import type { PageBuilderConfig, PageBuilderElementFonts, PageSettings } from '../../types'
import {
  DEMO_PAGE_THEME_TITLE,
  DEMO_THEME_PACKS,
  type DemoThemePackId,
} from '../demo/demo-theme-presets'
import {
  getThemeHtmlByTitle,
  restoreDemoPage,
  translateThemePlaceholderText,
} from '../demo/demo-theme-utils'
import { useToast } from '../../composables/useToast'
import { normalizeHexColor } from '../../utils/builder/color-utils'
import { resolveFontFamilyClassForToken } from '../../utils/builder/font-family-config'
import { loadFontFromClass } from '../../utils/builder/dynamic-font-loader'

const { translate } = useTranslations()
const { showToast } = useToast()
const pageBuilderService = getPageBuilder()

defineProps<{
  showWelcomeHint?: boolean
}>()

const emit = defineEmits<{
  dismissWelcomeHint: []
}>()

const pageBuilderStateStore = sharedPageBuilderStore

const getPageBuilderConfig = computed(() => pageBuilderStateStore.getPageBuilderConfig)
const { resetToConfigDefaults } = useThemeColorPresets(getPageBuilderConfig)

const showConfigModal = ref(false)
const configModalContent = ref('')

/** Font-weight utilities — keep these when swapping page font-family classes. */
const FONT_WEIGHT_CLASSES = new Set([
  'pbx-font-thin',
  'pbx-font-extralight',
  'pbx-font-light',
  'pbx-font-normal',
  'pbx-font-medium',
  'pbx-font-bold',
  'pbx-font-extrabold',
  'pbx-font-black',
])

function normalizePackColor(value?: string | null): string {
  if (!value?.trim()) return ''
  return normalizeHexColor(value) ?? value.trim().toLowerCase()
}

/**
 * Saved demo HTML often includes `pbx-font-jost` on `#pagebuilder`. That page font
 * overrides `userSettings.fontFamily` — so the demo picker must update pageSettings too.
 */
function buildPageSettingsWithFont(
  current: PageBuilderConfig['pageSettings'] | null | undefined,
  fontKey: string,
): PageSettings {
  const nextFontClass = resolveFontFamilyClassForToken(fontKey)
  const tokens = String(current?.classes ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => {
      if (token.startsWith('pbx-font-custom-')) return false
      if (!token.startsWith('pbx-font-')) return true
      return FONT_WEIGHT_CLASSES.has(token)
    })

  return {
    ...(current ?? {}),
    classes: [...tokens, nextFontClass].join(' '),
  }
}

/** Match live config so selection survives panel close/reopen (FloatingSidePanel uses v-if). */
const activePresetId = computed<DemoThemePackId | null>(() => {
  const config = pageBuilderStateStore.getPageBuilderConfig
  if (!config) return null

  const brand = normalizePackColor(config.settings?.brandColor)
  const button = normalizePackColor(
    config.settings?.buttonColor ?? config.settings?.brandColor,
  )
  const buttonText = normalizePackColor(config.settings?.buttonTextColor ?? '#ffffff')
  const fontKey =
    config.userSettings?.fontFamily?.split(',')[0]?.trim().toLowerCase() || 'jost'

  const match = DEMO_THEME_PACKS.find(
    (pack) =>
      normalizePackColor(pack.brandColor) === brand &&
      normalizePackColor(pack.buttonColor) === button &&
      normalizePackColor(pack.buttonTextColor) === buttonText &&
      pack.fontKey === fontKey,
  )

  return match?.id ?? null
})

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
    pageSettings?: PageBuilderConfig['pageSettings']
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
    pageSettings: patch.pageSettings
      ? { ...current.pageSettings, ...patch.pageSettings }
      : current.pageSettings,
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

async function syncThemePresetsFromConfig(): Promise<void> {
  await nextTick()
  resetToConfigDefaults()
}

async function applyPresetPack(packId: DemoThemePackId): Promise<void> {
  const pack = DEMO_THEME_PACKS.find((item) => item.id === packId)
  if (!pack) return

  patchConfig({
    settings: {
      brandColor: pack.brandColor,
      buttonColor: pack.buttonColor,
      buttonTextColor: pack.buttonTextColor,
      themeColorPresets: pack.themeColorPresets,
    },
    userSettings: {
      fontFamily: `${pack.fontKey}, arial, fantasy`,
      elementFonts: buildElementFonts(pack.fontKey),
    },
  })
  await syncThemePresetsFromConfig()

  if (pack.themeTitle === DEMO_PAGE_THEME_TITLE) {
    await restoreDemoPage(pageBuilderService, translate)
  } else {
    const themeHtml = getThemeHtmlByTitle(pack.themeTitle)
    if (themeHtml) {
      await pageBuilderService.replaceTheme(translateThemePlaceholderText(themeHtml, translate))
    }
  }

  // replaceTheme / demo HTML may set or clear page fonts — re-apply the pack font on the wrapper.
  const pageSettings = buildPageSettingsWithFont(
    pageBuilderStateStore.getPageBuilderConfig?.pageSettings,
    pack.fontKey,
  )
  patchConfig({ pageSettings })
  await loadFontFromClass(resolveFontFamilyClassForToken(pack.fontKey))
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

const buttonColor = computed({
  get: () =>
    pageBuilderStateStore.getPageBuilderConfig?.settings?.buttonColor ??
    pageBuilderStateStore.getPageBuilderConfig?.settings?.brandColor ??
    '#DB93B0',
  set: (value: string) => {
    patchConfig({
      settings: {
        buttonColor: value,
      },
    })
  },
})

const buttonTextColor = computed({
  get: () =>
    pageBuilderStateStore.getPageBuilderConfig?.settings?.buttonTextColor ?? '#ffffff',
  set: (value: string) => {
    patchConfig({
      settings: {
        buttonTextColor: value,
      },
    })
  },
})

const canvasFont = computed(() => {
  const pageClasses = pageBuilderStateStore.getPageBuilderConfig?.pageSettings?.classes ?? ''
  const pageFontClass = pageClasses
    .split(/\s+/)
    .find(
      (token) =>
        token.startsWith('pbx-font-') &&
        !token.startsWith('pbx-font-custom-') &&
        !FONT_WEIGHT_CLASSES.has(token),
    )
  if (pageFontClass?.startsWith('pbx-font-')) {
    return pageFontClass.slice('pbx-font-'.length)
  }

  const fontConfig = pageBuilderStateStore.getPageBuilderConfig?.userSettings?.fontFamily ?? 'jost'
  return fontConfig.split(',')[0]?.trim().toLowerCase() || 'jost'
})

async function setCanvasFont(fontKey: string): Promise<void> {
  const fontClass = resolveFontFamilyClassForToken(fontKey)
  patchConfig({
    userSettings: {
      fontFamily: `${fontKey}, arial, fantasy`,
      elementFonts: buildElementFonts(fontKey),
    },
    pageSettings: buildPageSettingsWithFont(
      pageBuilderStateStore.getPageBuilderConfig?.pageSettings,
      fontKey,
    ),
  })
  await loadFontFromClass(fontClass)
}

const startBuilderSnippet = computed(() => {
  const config = pageBuilderStateStore.getPageBuilderConfig
  if (!config) return '// Builder not started yet'

  const snippet = {
    settings: {
      brandColor: config.settings?.brandColor ?? '#DB93B0',
      buttonColor: config.settings?.buttonColor ?? config.settings?.brandColor ?? '#DB93B0',
      buttonTextColor: config.settings?.buttonTextColor ?? '#ffffff',
      themeColorPresets: config.settings?.themeColorPresets ?? { enabled: true, colors: [] },
    },
    userSettings: {
      fontFamily: config.userSettings?.fontFamily ?? 'jost, arial, fantasy',
      elementFonts: config.userSettings?.elementFonts ?? buildElementFonts('jost'),
    },
  }

  return `// Pass inside your PageBuilderConfig when calling startBuilder()\n${JSON.stringify(snippet, null, 2)}`
})

function openConfigModal(): void {
  configModalContent.value = startBuilderSnippet.value
  showConfigModal.value = true
}

function closeConfigModal(): void {
  showConfigModal.value = false
}

function dismissWelcome(): void {
  emit('dismissWelcomeHint')
}

async function restoreMybuilderDemoPage(): Promise<void> {
  await applyPresetPack('default')
  showToast('Restored mybuilder.dev demo page', 'success')
}

async function copyPageHtmlForDemoFile(): Promise<void> {
  const html = await pageBuilderService.generateFullPageHtml()
  try {
    await navigator.clipboard.writeText(html)
    showToast(
      'Copied — paste into src/tests/demo/demo-page.content.html (replace entire file)',
      'success',
    )
  } catch {
    configModalContent.value = html
    showConfigModal.value = true
    showToast('Copy failed — HTML opened in viewer instead', 'warning')
  }
}

onMounted(() => {
  void syncThemePresetsFromConfig()
})
</script>

<template>
  <div class="pbx-flex pbx-flex-col pbx-gap-5 pbx-pb-6">
    <div v-if="showWelcomeHint" class="pbx-demoThemeWelcomeHint" role="status">
      <div class="pbx-flex pbx-flex-col pbx-gap-1 pbx-pr-2">
        <p class="pbx-m-0 pbx-text-sm pbx-font-semibold pbx-text-myPrimaryDarkGrayColor">
          Welcome — try your brand here
        </p>
        <p class="pbx-m-0 pbx-text-xs pbx-leading-relaxed pbx-text-gray-600">
          Pick a preset pack, tweak colors and fonts, then copy the JSON for your
          <code class="pbx-font-sans pbx-text-[11px]">startBuilder()</code> config.
        </p>
      </div>
      <button
        type="button"
        class="pbx-demoThemeWelcomeDismiss"
        aria-label="Dismiss welcome hint"
        @click="dismissWelcome"
      >
        <span class="material-symbols-outlined pbx-materialIconBase">close</span>
      </button>
    </div>

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
          <code class="pbx-text-[11px] pbx-font-sans">startBuilder()</code> — brand color, theme
          presets, and fonts. Changes apply instantly on the canvas and toolbar.
        </p>
      </div>
    </div>

    <section class="pbx-productSettingsSection">
      <div class="pbx-productSettingsSectionHeader">
        <p class="pbx-productSettingsSectionTitle">Preset packs</p>
        <p class="pbx-productSettingsSectionDesc">
          Swaps page layout, colors, and fonts — Default restores the demo page after trying
          fashion, corporate, or blog
        </p>
      </div>
      <div class="pbx-productSettingsSectionChips">
        <ModalFilterChip
          v-for="pack in DEMO_THEME_PACKS"
          :key="pack.id"
          slider-icon
          :label="pack.label"
          :hint="pack.hint"
          :active="activePresetId === pack.id"
          @click="applyPresetPack(pack.id)"
        />
      </div>
    </section>

    <section class="pbx-productSettingsSection">
      <div class="pbx-productSettingsSectionHeader">
        <p class="pbx-productSettingsSectionTitle">Brand color</p>
        <p class="pbx-productSettingsSectionDesc">
          Links, text accents, and focus rings
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
        <p class="pbx-productSettingsSectionTitle">Button color</p>
        <p class="pbx-productSettingsSectionDesc">
          Filled CTAs, primary buttons, and selected editor UI via
          <code class="pbx-text-[11px] pbx-font-sans">settings.buttonColor</code>
        </p>
      </div>
      <div
        class="pbx-flex pbx-flex-wrap pbx-items-center pbx-gap-3 pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-100 pbx-bg-gray-50 pbx-px-3 pbx-py-3"
      >
        <HexColorPicker v-model="buttonColor" />
        <label class="pbx-sr-only" for="demo-button-color-input">Button color hex</label>
        <input
          id="demo-button-color-input"
          v-model="buttonColor"
          type="text"
          class="pbx-myPrimaryInput pbx-min-w-0 pbx-flex-1 pbx-text-sm"
          spellcheck="false"
          autocomplete="off"
        />
      </div>
    </section>

    <section class="pbx-productSettingsSection">
      <div class="pbx-productSettingsSectionHeader">
        <p class="pbx-productSettingsSectionTitle">Button text color</p>
        <p class="pbx-productSettingsSectionDesc">
          Label color on filled buttons via
          <code class="pbx-text-[11px] pbx-font-sans">settings.buttonTextColor</code>
          (use dark text on light button backgrounds)
        </p>
      </div>
      <div
        class="pbx-flex pbx-flex-wrap pbx-items-center pbx-gap-3 pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-100 pbx-bg-gray-50 pbx-px-3 pbx-py-3"
      >
        <HexColorPicker v-model="buttonTextColor" />
        <label class="pbx-sr-only" for="demo-button-text-color-input">Button text color hex</label>
        <input
          id="demo-button-text-color-input"
          v-model="buttonTextColor"
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
          Updates
          <code class="pbx-text-[11px] pbx-font-sans">userSettings.fontFamily</code>
          and the page wrapper font class (saved demo HTML can lock
          <code class="pbx-text-[11px] pbx-font-sans">pbx-font-jost</code>
          otherwise)
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
        <p class="pbx-productSettingsSectionTitle">Update demo file</p>
        <p class="pbx-productSettingsSectionDesc">
          After editing the page, copy HTML and paste into
          <code class="pbx-text-[11px] pbx-font-sans">src/tests/demo/demo-page.content.html</code>
          (replace the whole file — not shipped to npm)
        </p>
      </div>
      <div class="pbx-inspectorActionStack">
        <HtmlActionButton
          icon="content_copy"
          label="Copy page HTML for demo file"
          hint="Full #pagebuilder output for DEMO_PAGE_HTML"
          @click="copyPageHtmlForDemoFile"
        />
        <HtmlActionButton
          icon="restart_alt"
          label="Restore mybuilder demo page"
          hint="Reload demo/demo-page.content.html"
          @click="restoreMybuilderDemoPage"
        />
      </div>
    </section>

    <section class="pbx-productSettingsSection">
      <div class="pbx-productSettingsSectionHeader">
        <p class="pbx-productSettingsSectionTitle">Copy for developers</p>
        <p class="pbx-productSettingsSectionDesc">
          JSON snippet for
          <code class="pbx-text-[11px] pbx-font-sans">startBuilder(configPageBuilder)</code>
        </p>
      </div>
      <div class="pbx-inspectorActionStack">
        <HtmlActionButton
          icon="visibility"
          label="View config JSON"
          hint="Preview startBuilder() theme snippet"
          @click="openConfigModal"
        />
      </div>
    </section>

    <section class="pbx-productSettingsSection">
      <div class="pbx-productSettingsSectionHeader">
        <p class="pbx-productSettingsSectionTitle">Product catalog</p>
        <p class="pbx-productSettingsSectionDesc">
          Ecommerce teams inject their own picker with
          <code class="pbx-text-[11px] pbx-font-sans">:DisplayProducts</code> — use the Products
          button in the navbar to try the demo catalog.
        </p>
      </div>
    </section>
  </div>

  <HtmlEditorModal
    :show="showConfigModal"
    title="startBuilder() theme config"
    :html="configModalContent"
    badge="JSON"
    read-only
    @close="closeConfigModal"
  />
</template>

<style scoped>
.pbx-demoThemeWelcomeHint {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid color-mix(in srgb, var(--myPrimaryLinkColor, #db93b0) 35%, #e5e7eb);
  background: color-mix(in srgb, var(--myPrimaryLinkColor, #db93b0) 8%, #ffffff);
  padding: 0.75rem;
}

.pbx-demoThemeWelcomeDismiss {
  display: flex;
  height: 2rem;
  width: 2rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.8);
  color: #6b7280;
  cursor: pointer;
}

.pbx-demoThemeWelcomeDismiss:hover {
  background: #fff;
  color: #111827;
}
</style>
