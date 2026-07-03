<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import PageBuilderSettings from '../../Settings/PageBuilderSettings.vue'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Download HTML') }}</template>
    <template #content>
      <PageBuilderSettings embedded-section="download" />
    </template>
  </EditorAccordion>
</template>
