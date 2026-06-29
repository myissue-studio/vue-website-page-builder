<script setup lang="ts">
import PageBuilder from '../PageBuilder/PageBuilder.vue'
import DemoMediaLibraryComponentTest from '../tests/TestComponents/DemoMediaLibraryComponentTest.vue'
import { computed, watch } from 'vue'
import componentsArray from '../tests/componentsArray.test.json'
import { getPageBuilder } from '../composables/builderInstance'
import { useTranslations } from '../composables/useTranslations'

const pageBuilderService = getPageBuilder()
const { translate, currentTranslations } = useTranslations()

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
        fontFamily: 'jost', // Available fonts: jost, raleway, palantino, arial, helvetica, georgia, times, times-new-roman, courier, courier-new, verdana, tahoma, trebuchet, garamond, bookman, comic-sans, impact, lucida, lucida-console, lucida-sans, candara, optima, avenir, futura, calibri, cambria, didot, franklin-gothic, rockwell, baskerville, sans, serif, mono
      },

      settings: {
        brandColor: '#DB93B0',
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
      <!--   :CustomBuilderComponents="DemoBuilderComponentsTest" -->
      <PageBuilder
        :CustomMediaLibraryComponent="DemoMediaLibraryComponentTest"
        :showPublishButton="true"
        :showCloseButton="true"
        @handlePublishPageBuilder="publishPageBuilder"
      ></PageBuilder>
    </div>
  </div>
</template>
