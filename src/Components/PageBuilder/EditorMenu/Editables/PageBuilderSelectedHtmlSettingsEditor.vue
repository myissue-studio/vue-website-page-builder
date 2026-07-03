<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import PageBuilderSettings from '../../Settings/PageBuilderSettings.vue'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Selected HTML') }}</template>
    <template #content>
      <PageBuilderSettings embedded-section="selectedHtml" />
    </template>
  </EditorAccordion>
</template>
