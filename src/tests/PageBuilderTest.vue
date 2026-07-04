<script setup lang="ts">
import PageBuilder from '../PageBuilder/PageBuilder.vue'
import DemoMediaLibraryComponentTest from '../tests/TestComponents/DemoMediaLibraryComponentTest.vue'
import DemoDisplayProductsTest from '../tests/TestComponents/DemoDisplayProductsTest.vue'
import DemoThemeConfigPanel from '../tests/TestComponents/DemoThemeConfigPanel.vue'
import FloatingSidePanel from '../Components/Overlays/FloatingSidePanel.vue'
import SliderIcon from '../Components/Icons/SliderIcon.vue'
import { computed, ref, watch } from 'vue'
import componentsArray from '../tests/componentsArray.test.json'
import { getPageBuilder } from '../composables/usePageBuilder'
import { useTranslations } from '../composables/useTranslations'

const pageBuilderService = getPageBuilder()
const { translate, currentTranslations } = useTranslations()

const showDemoThemePanel = ref(false)

const translatedComponents = computed(() => {
  return componentsArray.map((component) => {
    const newComponent = { ...component }
    newComponent.html_code = newComponent.html_code.replace(
      /{{\s*translate\('([^']+)'\)\s*}}/g,
      (_, key) => translate(key),
    )
    return newComponent
  })
})

const demoPost = computed(() => ({
  id: 1,
  title: 'Demo Article',
  content:
    '<div id="pagebuilder" class="pbx-bg-white" style="letter-spacing: 0.5px;">' +
    translatedComponents.value.map((component) => component.html_code).join('\n') +
    '</div>',
}))

const publishPageBuilder = function () {
  const latestHtml = pageBuilderService.getSavedPageHtml()
  console.info('Full page HTML ready for backend submission:', latestHtml)
}

watch(
  currentTranslations,
  async () => {
    const { components: newComponents, pageSettings } = pageBuilderService.parsePageBuilderHTML(
      demoPost.value.content,
    )

    const configPageBuilder = {
      userForPageBuilder: {
        id: 1, // Optional — scopes theme color presets to this user in localStorage
        name: 'Jane Doe',
        image: '/jane_doe.jpg',
      },
      updateOrCreate: {
        formType: 'update',
        formName: 'collection',
      },
      pageBuilderLogo: {
        src: '/logo/mybuilder_new_lowercase.svg',
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
        autoSave: true,
        fontFamily: 'jost, raleway, arial, fantasy',
        elementFonts: {
          h1: 'jost, raleway, arial, fantasy',
          h2: 'jost, raleway, arial, fantasy',
          h3: 'jost, raleway, arial, fantasy',
          h4: 'jost, raleway, arial, fantasy',
          h5: 'jost, raleway, arial, fantasy',
          h6: 'jost, raleway, arial, fantasy',
          p: 'jost, raleway, arial, fantasy',
        },
      },

      settings: {
        brandColor: '#000000',
        themeColorPresets: {
          enabled: true,
          colors: [
            { id: 'primary', label: 'Primary', color: '482C3D', enabled: true },
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
        @click="showDemoThemePanel = true"
      >
        <span class="pbx-pageDesignOpenButtonIcon">
          <SliderIcon :size="18" />
        </span>
        <span class="pbx-pageDesignOpenButtonText">
          <span class="pbx-pageDesignOpenButtonLabel">Customize theme for your business</span>
          <span class="pbx-pageDesignOpenButtonHint"
            >Brand color, presets &amp; fonts — live demo</span
          >
        </span>
        <span class="pbx-pageDesignOpenButtonArrow material-symbols-outlined" aria-hidden="true">
          tune
        </span>
      </button>

      <FloatingSidePanel
        title="Demo: Your brand theme"
        :showSidebarPanel="showDemoThemePanel"
        position="right"
        @closeSidebarPanel="showDemoThemePanel = false"
      >
        <DemoThemeConfigPanel />
      </FloatingSidePanel>
    </div>
  </div>
</template>

<style scoped>
.pbx-demoThemeTrigger {
  position: fixed;
  right: 1rem;
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

@media (min-width: 1024px) {
  .pbx-demoThemeTrigger {
    right: 1.5rem;
    bottom: 1.5rem;
  }
}
</style>
