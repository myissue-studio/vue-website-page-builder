<script setup lang="ts">
import PageBuilder from '../../PageBuilder/PageBuilder.vue'
import DemoMediaLibraryComponentTest from '../TestComponents/DemoMediaLibraryComponentTest.vue'
import DemoDisplayProductsTest from '../TestComponents/DemoDisplayProductsTest.vue'
import DemoThemeConfigPanel from '../TestComponents/DemoThemeConfigPanel.vue'
import FloatingSidePanel from '../../Components/Overlays/FloatingSidePanel.vue'
import SliderIcon from '../../Components/Icons/SliderIcon.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { getPageBuilder } from '../../composables/usePageBuilder'
import { useTranslations } from '../../composables/useTranslations'
import { DEMO_THEME_HINT_STORAGE_KEY, DEMO_THEME_PACKS } from './demo-theme-presets'
import { getDemoPageHtml, translateThemePlaceholderText } from './demo-theme-utils'

const pageBuilderService = getPageBuilder()
const { translate, currentTranslations } = useTranslations()

const showDemoThemePanel = ref(false)
const showWelcomeHint = ref(false)
const highlightThemeTrigger = ref(false)

const fashionPreset = DEMO_THEME_PACKS[0]

const demoPost = computed(() => ({
  id: 1,
  title: 'mybuilder.dev Demo',
  content: translateThemePlaceholderText(getDemoPageHtml(), translate),
}))

const publishPageBuilder = function () {
  const latestHtml = pageBuilderService.getSavedPageHtml()
  console.info('Full page HTML ready for backend submission:', latestHtml)
}

function dismissWelcomeHint(): void {
  showWelcomeHint.value = false
  highlightThemeTrigger.value = false
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(DEMO_THEME_HINT_STORAGE_KEY, '1')
  }
}

function openDemoThemePanel(): void {
  showDemoThemePanel.value = true
  highlightThemeTrigger.value = false
}

onMounted(() => {
  const hasSeenHint =
    typeof localStorage !== 'undefined' && localStorage.getItem(DEMO_THEME_HINT_STORAGE_KEY) === '1'

  if (!hasSeenHint) {
    showWelcomeHint.value = true
    highlightThemeTrigger.value = true
    window.setTimeout(() => {
      showDemoThemePanel.value = false
    }, 900)
  }
})

watch(
  currentTranslations,
  async () => {
    const { components: newComponents, pageSettings } = pageBuilderService.parsePageBuilderHTML(
      demoPost.value.content,
    )

    const configPageBuilder = {
      userForPageBuilder: {
        id: 1,
        name: 'Jane Doe',
        image: '/jane_doe.jpg',
      },
      updateOrCreate: {
        formType: 'update',
        formName: 'collection',
      },
      pageBuilderLogo: {
        src: '/logo/logo.svg',
      },
      resourceData: {
        title: demoPost.value.title,
        id: demoPost.value.id,
      },
      userSettings: {
        language: {
          default: 'en',
          enable: ['en', 'zh-Hans', 'fr', 'ja', 'ru', 'es', 'pt', 'de', 'ar', 'hi', 'da', 'it'],
          disableLanguageDropDown: false,
        },
        // Hide TipTap H1 when the host page already owns the page <h1>.
        disableH1: true,
        autoSave: true,
        // Load custom fonts in your app CSS, e.g. dev-global.css or index.html:
        // @import url('https://fonts.googleapis.com/css2?family=Bitcount+Grid+Double:wght@100..900&display=swap');
        fontFamily: `${fashionPreset.fontKey}, raleway, arial, fantasy, Bitcount Grid Double`,
        elementFonts: {
          h1: `${fashionPreset.fontKey}, raleway, arial, fantasy, Bitcount Grid Double`,
          h2: `${fashionPreset.fontKey}, raleway, arial, fantasy, Bitcount Grid Double`,
          h3: `${fashionPreset.fontKey}, raleway, arial, fantasy, Bitcount Grid Double`,
          h4: `${fashionPreset.fontKey}, raleway, arial, fantasy, Bitcount Grid Double`,
          h5: `${fashionPreset.fontKey}, raleway, arial, fantasy, Bitcount Grid Double`,
          h6: `${fashionPreset.fontKey}, raleway, arial, fantasy, Bitcount Grid Double`,
          p: `${fashionPreset.fontKey}, raleway, arial, fantasy, Bitcount Grid Double`,
        },
      },

      settings: {
        brandColor: '#000000',
        themeColorPresets: fashionPreset.themeColorPresets,
      },
      pageSettings,
    } as const

    await pageBuilderService.startBuilder(configPageBuilder, newComponents)
  },
  { immediate: true },
)
</script>

<template>
  <div class="pbx-bg-white">
    <div class="lg:pbx-p-2">
      <PageBuilder
        :CustomMediaLibraryComponent="DemoMediaLibraryComponentTest"
        :DisplayProducts="DemoDisplayProductsTest"
        :showPublishButton="true"
        :showCloseButton="true"
        @handlePublishPageBuilder="publishPageBuilder"
      />

      <button
        v-if="!showDemoThemePanel"
        type="button"
        class="pbx-demoThemeTrigger"
        :class="{ 'pbx-demoThemeTrigger--pulse': highlightThemeTrigger }"
        @click="openDemoThemePanel"
      >
        <span class="pbx-pageDesignOpenButtonIcon">
          <SliderIcon :size="18" />
        </span>
        <span class="pbx-pageDesignOpenButtonText pbx-pr-6">
          <span class="pbx-pageDesignOpenButtonLabel">Customize theme for your business</span>
          <span class="pbx-pageDesignOpenButtonHint">
            Brand color, presets &amp; fonts — live demo
          </span>
        </span>
      </button>

      <FloatingSidePanel
        title="Demo: Your brand theme"
        :showSidebarPanel="showDemoThemePanel"
        position="right"
        @closeSidebarPanel="showDemoThemePanel = false"
      >
        <DemoThemeConfigPanel
          :show-welcome-hint="showWelcomeHint"
          @dismiss-welcome-hint="dismissWelcomeHint"
        />
      </FloatingSidePanel>
    </div>
  </div>
</template>

<style scoped>
.pbx-demoThemeTrigger {
  position: fixed;
  left: 1rem;
  bottom: 1.25rem;
  z-index: 9990;
  display: flex;
  max-width: min(22rem, calc(100vw - 2rem));
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.92);
  padding: 0.75rem;
  text-align: left;
  cursor: pointer;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.08),
    0 4px 6px -4px rgb(0 0 0 / 0.08);
  backdrop-filter: blur(8px);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;
}

.pbx-demoThemeTrigger:hover {
  border-color: var(--myPrimaryLinkColor, #db93b0);
  box-shadow:
    0 12px 20px -5px rgb(0 0 0 / 0.12),
    0 6px 8px -4px rgb(0 0 0 / 0.08);
  transform: translateY(-1px);
}

.pbx-demoThemeTrigger--pulse {
  animation: demo-theme-trigger-pulse 2s ease-in-out infinite;
}

@keyframes demo-theme-trigger-pulse {
  0%,
  100% {
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.08),
      0 4px 6px -4px rgb(0 0 0 / 0.08),
      0 0 0 0 color-mix(in srgb, var(--myPrimaryLinkColor, #db93b0) 45%, transparent);
  }

  50% {
    box-shadow:
      0 12px 20px -5px rgb(0 0 0 / 0.12),
      0 6px 8px -4px rgb(0 0 0 / 0.08),
      0 0 0 6px color-mix(in srgb, var(--myPrimaryLinkColor, #db93b0) 0%, transparent);
  }
}

@media (min-width: 1024px) {
  .pbx-demoThemeTrigger {
    right: 1.5rem;
    bottom: 1.5rem;
  }
}
</style>
