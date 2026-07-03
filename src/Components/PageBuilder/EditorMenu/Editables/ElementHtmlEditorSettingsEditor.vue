<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import { useTranslations } from '../../../../composables/useTranslations'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'

defineOptions({
  name: 'ElementHtmlEditorSettingsEditor',
})

const { translate } = useTranslations()
const pageBuilderStateStore = sharedPageBuilderStore

const openElementHtmlEditor = () => {
  pageBuilderStateStore.setToggleGlobalHtmlMode(false)
  pageBuilderStateStore.setShowModalHTMLEditor(true)
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Element HTML') }}</template>
    <template #content>
      <p class="pbx-editorSectionDesc">
        {{ translate('Element HTML editor description') }}
      </p>

      <button type="button" class="pbx-pageDesignOpenButton" @click="openElementHtmlEditor">
        <span class="material-symbols-outlined"> deployed_code </span>
        <span class="pbx-pageDesignOpenButtonText">
          <span class="pbx-pageDesignOpenButtonLabel">{{
            translate('Open element HTML editor')
          }}</span>
          <span class="pbx-pageDesignOpenButtonHint">
            {{ translate('Edit selected element markup') }}
          </span>
        </span>
        <span class="pbx-pageDesignOpenButtonArrow material-symbols-outlined" aria-hidden="true">
          arrow_forward
        </span>
      </button>
    </template>
  </EditorAccordion>
</template>
