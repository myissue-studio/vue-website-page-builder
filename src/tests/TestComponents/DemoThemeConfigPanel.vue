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
import type { PageBuilderConfig, PageBuilderElementFonts } from '../../types'
import { DEMO_THEME_PACKS, type DemoThemePackId } from '../demo-theme-presets'
import {
  getThemeHtmlByTitle,
  restoreDemoPage,
  translateThemePlaceholderText,
} from '../demo-theme-utils'
import { useToast } from '../../composables/useToast'

const { translate } = useTranslations()
const { showToast } = useToast()
const pageBuilderService = getPageBuilder()

const props = defineProps<{
  showWelcomeHint?: boolean
}>()

const emit = defineEmits<{
  dismissWelcomeHint: []
}>()

const pageBuilderStateStore = sharedPageBuilderStore

const getPageBuilderConfig = computed(() => pageBuilderStateStore.getPageBuilderConfig)
const { resetToConfigDefaults } = useThemeColorPresets(getPageBuilderConfig)

const activePresetId = ref<DemoThemePackId | null>('fashion')
const showConfigModal = ref(false)
const configModalContent = ref('')

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

async function syncThemePresetsFromConfig(): Promise<void> {
  await nextTick()
  resetToConfigDefaults()
}

async function applyPresetPack(packId: DemoThemePackId): Promise<void> {
  const pack = DEMO_THEME_PACKS.find((item) => item.id === packId)
  if (!pack) return

  activePresetId.value = packId

  patchConfig({
    settings: {
      brandColor: pack.brandColor,
      themeColorPresets: pack.themeColorPresets,
    },
    userSettings: {
      fontFamily: `${pack.fontKey}, arial, fantasy`,
      elementFonts: buildElementFonts(pack.fontKey),
    },
  })
  await syncThemePresetsFromConfig()

  const themeHtml = getThemeHtmlByTitle(pack.themeTitle)
  if (themeHtml) {
    await pageBuilderService.replaceTheme(translateThemePlaceholderText(themeHtml, translate))
  }
}

const brandColor = computed({
  get: () => pageBuilderStateStore.getPageBuilderConfig?.settings?.brandColor ?? '#DB93B0',
  set: (value: string) => {
    activePresetId.value = null
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

async function setCanvasFont(fontKey: string): Promise<void> {
  activePresetId.value = null
  patchConfig({
    userSettings: {
      fontFamily: `${fontKey}, arial, fantasy`,
      elementFonts: buildElementFonts(fontKey),
    },
  })
}

const startBuilderSnippet = computed(() => {
  const config = pageBuilderStateStore.getPageBuilderConfig
  if (!config) return '// Builder not started yet'

  const snippet = {
    settings: {
      brandColor: config.settings?.brandColor ?? '#DB93B0',
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
  activePresetId.value = null
  await restoreDemoPage(pageBuilderService, translate)
  showToast('Restored mybuilder.dev demo page', 'success')
}

async function copyPageHtmlForDemoFile(): Promise<void> {
  const html = await pageBuilderService.generateFullPageHtml()
  try {
    await navigator.clipboard.writeText(html)
    showToast('Copied — paste into src/tests/demo-page.content.html (replace entire file)', 'success')
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
        <span class="material-symbols-outlined pbx-text-base">close</span>
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
          Swaps page layout, colors, and fonts for fashion, corporate, or blog sites
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
          <code class="pbx-text-[11px] pbx-font-sans">userSettings.fontFamily</code>
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
          <code class="pbx-text-[11px] pbx-font-sans">src/tests/demo-page.content.html</code>
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
          hint="Reload demo-page.content.html"
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
