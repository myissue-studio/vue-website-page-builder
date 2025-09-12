<script setup>
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import EditorAccordion from '../EditorAccordion.vue'
import { useTranslations } from '../../../../composables/useTranslations'

const pageBuilderStateStore = sharedPageBuilderStore
const { translate } = useTranslations()

const handleShowHTMLEditor = async () => {
  pageBuilderStateStore.setShowModalHTMLEditor(true)
}
</script>
<template>
  <EditorAccordion>
    <template #title>{{ translate('HTML Editor') }}</template>
    <template #content>
      <div class="pbx-my-2 pbx-py-2">
        <label for="vertical-margin" class="pbx-myPrimaryInputLabel">{{
          translate('Gain full control over components by editing the raw HTML.')
        }}</label>
        <hr />
      </div>
      <button @click="handleShowHTMLEditor" type="button" class="pbx-myPrimaryButton">
        {{ translate('HTML Editor') }}
      </button>
    </template>
  </EditorAccordion>
</template>
