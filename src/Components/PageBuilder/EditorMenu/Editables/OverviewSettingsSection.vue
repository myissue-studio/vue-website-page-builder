<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import PageBuilderSettings from '../../Settings/PageBuilderSettings.vue'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('App & Resource') }}</template>
    <template #content>
      <PageBuilderSettings embedded-section="overviewApp" />
    </template>
  </EditorAccordion>
</template>
