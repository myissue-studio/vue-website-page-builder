<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import HtmlActionButton from './HtmlActionButton.vue'
import { useTranslations } from '../../../../composables/useTranslations'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useHtmlCodeViewer } from '../../../../composables/useHtmlCodeViewer'
import { useHtmlCodeEditor } from '../../../../composables/useHtmlCodeEditor'

defineOptions({
  name: 'PageHtmlEditorSettingsEditor',
})

const { translate } = useTranslations()
const pageBuilderService = getPageBuilder()
const { openHtmlViewer } = useHtmlCodeViewer()
const { openHtmlEditor } = useHtmlCodeEditor()

const openPageHtmlEditor = async () => {
  const html = await pageBuilderService.generateFullPageHtml()
  openHtmlEditor(translate('HTML Editor'), html, 'page')
}

const openPageHtmlViewer = async () => {
  const html = await pageBuilderService.generateFullPageHtml()
  openHtmlViewer(translate('Page HTML'), html)
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('HTML Editor') }}</template>
    <template #content>
      <p class="pbx-editorSectionDesc">
        {{ translate('Page HTML editor description') }}
      </p>

      <div class="pbx-inspectorActionStack">
        <HtmlActionButton
          icon="visibility"
          :label="translate('View page HTML')"
          :hint="translate('Preview full page markup')"
          @click="openPageHtmlViewer"
        />
        <HtmlActionButton
          icon="deployed_code"
          :label="translate('Open HTML editor')"
          :hint="translate('Edit full page markup')"
          @click="openPageHtmlEditor"
        />
      </div>
    </template>
  </EditorAccordion>
</template>
