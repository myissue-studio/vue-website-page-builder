<script setup lang="ts">
import FullWidthElement from '../Components/Layouts/FullWidthElement.vue'
import PageBuilder from '../PageBuilder/PageBuilder.vue'
import DemoMediaLibraryComponentTest from '../tests/TestComponents/DemoMediaLibraryComponentTest.vue'
import DemoBuilderComponentsTest from '../tests/TestComponents/DemoBuilderComponentsTest.vue'
import { computed, watch } from 'vue'
import componentsArray from '../tests/componentsArray.test.json'
import { getPageBuilder } from '../composables/builderInstance'
import { useTranslations } from '../composables/useTranslations'

const pageBuilderService = getPageBuilder()
const { translate, currentTranslations } = useTranslations()

const publishPageBuilder = function () {}

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

watch(currentTranslations, async () => {
  const { components: newComponents, pageSettings: pageSettings } =
    pageBuilderService.parsePageBuilderHTML(
      '<div id="pagebuilder" class="" style="">' +
        translatedComponents.value.map((c) => c.html_code).join('\n') +
        '</div>',
    )

  const configPageBuilder = {
    userForPageBuilder: {
      name: 'Jane Doe',
      image: '/jane_doe.jpg',
    },
    updateOrCreate: {
      formType: 'create',
      formName: 'collection',
    },
    pageBuilderLogo: {
      src: '/logo/mybuilder_new_lowercase.svg',
    },
    resourceData: {
      title: 'Demo Article',
      id: 1,
    },
    userSettings: {
      theme: 'light',
      language: {
        default: 'en',
        enable: ['en', 'zh-Hans', 'fr', 'ja', 'ru', 'es', 'pt', 'de', 'ar', 'hi'],
        disableLanguageDropDown: false,
      },
      autoSave: true,
    },

    settings: {
      brandColor: '#DB93B0',
    },
    pageSettings: pageSettings,
  } as const

  await pageBuilderService.startBuilder(configPageBuilder, newComponents)
})
</script>

<template>
  <div class="pbx-bg-white">
    <div class="lg:pbx-p-2">
      <!--   :CustomBuilderComponents="DemoBuilderComponentsTest" -->
      <PageBuilder
        :CustomMediaLibraryComponent="DemoMediaLibraryComponentTest"
        :showPublishButton="true"
        @handlePublishPageBuilder="publishPageBuilder"
      ></PageBuilder>
    </div>
  </div>
</template>
