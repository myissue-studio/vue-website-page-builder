<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import { useTranslations } from '../../../../composables/useTranslations'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'

defineOptions({
  name: 'PageHtmlEditorSettingsEditor',
})

const { translate } = useTranslations()
const pageBuilderStateStore = sharedPageBuilderStore

const openPageHtmlEditor = () => {
  pageBuilderStateStore.setToggleGlobalHtmlMode(true)
  pageBuilderStateStore.setShowModalHTMLEditor(true)
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('HTML Editor') }}</template>
    <template #content>
      <p class="pbx-editorSectionDesc">
        {{ translate('Page HTML editor description') }}
      </p>

      <button type="button" class="pbx-pageDesignOpenButton" @click="openPageHtmlEditor">
        <span class="pbx-pageDesignOpenButtonIcon material-symbols-outlined" aria-hidden="true">
          code
        </span>
        <span class="pbx-pageDesignOpenButtonText">
          <span class="pbx-pageDesignOpenButtonLabel">{{ translate('Open HTML editor') }}</span>
          <span class="pbx-pageDesignOpenButtonHint">
            {{ translate('Edit full page markup') }}
          </span>
        </span>
        <span class="pbx-pageDesignOpenButtonArrow material-symbols-outlined" aria-hidden="true">
          arrow_forward
        </span>
      </button>
    </template>
  </EditorAccordion>
</template>
