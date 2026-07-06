<script setup lang="ts">
import type { SEOSummary } from '../../../../types'
import { ref } from 'vue'
import EditorAccordion from '../EditorAccordion.vue'
import HtmlActionButton from './HtmlActionButton.vue'
import FloatingSidePanel from '../../../Overlays/FloatingSidePanel.vue'
import SeoCheckPanel from './SeoCheckPanel.vue'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'
import { delay } from '../../../../composables/delay'

defineOptions({
  name: 'SeoCheckSettingsEditor',
})

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()

const seoResult = ref<SEOSummary | null>(null)
const showSEO = ref(false)
const isAnalyzing = ref(false)

const openSeoCheck = async () => {
  isAnalyzing.value = true
  showSEO.value = true
  await delay(300)
  try {
    seoResult.value = await pageBuilderService.analyzeSEO()
  } finally {
    isAnalyzing.value = false
  }
}

const closeSEO = () => {
  showSEO.value = false
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('SEO Check') }}</template>
    <template #content>
      <p class="pbx-editorSectionDesc">
        {{ translate('SEO check description') }}
      </p>

      <HtmlActionButton
        icon="circle_circle"
        :label="translate('Run SEO check')"
        :hint="translate('Analyze headings, images, links and word count')"
        :is-loading="isAnalyzing"
        @click="openSeoCheck"
      />
    </template>
  </EditorAccordion>

  <FloatingSidePanel
    :title="translate('SEO Check')"
    :showSidebarPanel="showSEO"
    position="left"
    @closeSidebarPanel="closeSEO"
  >
    <SeoCheckPanel :seo-result="seoResult" />
  </FloatingSidePanel>
</template>
