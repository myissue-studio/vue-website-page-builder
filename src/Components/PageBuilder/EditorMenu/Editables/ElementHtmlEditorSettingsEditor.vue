<script setup lang="ts">
import { computed } from 'vue'
import EditorAccordion from '../EditorAccordion.vue'
import HtmlActionButton from './HtmlActionButton.vue'
import { useTranslations } from '../../../../composables/useTranslations'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { useHtmlCodeViewer } from '../../../../composables/useHtmlCodeViewer'
import { useHtmlCodeEditor } from '../../../../composables/useHtmlCodeEditor'

defineOptions({
  name: 'ElementHtmlEditorSettingsEditor',
})

const { translate } = useTranslations()
const pageBuilderStateStore = sharedPageBuilderStore
const { openHtmlViewer } = useHtmlCodeViewer()
const { openHtmlEditor } = useHtmlCodeEditor()

const getElement = computed(() => pageBuilderStateStore.getElement)

const openElementHtmlEditor = () => {
  if (!getElement.value) return
  openHtmlEditor(translate('Element HTML'), getElement.value.outerHTML, 'element')
}

const openElementHtmlViewer = () => {
  if (!getElement.value) return
  openHtmlViewer(translate('Element HTML'), getElement.value.outerHTML)
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Element HTML') }}</template>
    <template #content>
      <p class="pbx-editorSectionDesc">
        {{ translate('Element HTML editor description') }}
      </p>

      <div class="pbx-inspectorActionStack">
        <HtmlActionButton
          icon="visibility"
          :label="translate('View element HTML')"
          :hint="translate('Preview selected element markup')"
          @click="openElementHtmlViewer"
        />
        <HtmlActionButton
          icon="deployed_code"
          :label="translate('Open element HTML editor')"
          :hint="translate('Edit selected element markup')"
          @click="openElementHtmlEditor"
        />
      </div>
    </template>
  </EditorAccordion>
</template>
