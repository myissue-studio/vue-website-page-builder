<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComputedRef } from 'vue'
import EditorAccordion from '../EditorAccordion.vue'
import PageBuilderSettings from '../../Settings/PageBuilderSettings.vue'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()

const showTemporaryPreviewButton = inject<ComputedRef<boolean>>(
  'showTemporaryPreviewButton',
  computed(() => false),
)

const sectionTitle = computed(() =>
  showTemporaryPreviewButton.value
    ? translate('Export & preview')
    : translate('Download HTML'),
)
</script>

<template>
  <EditorAccordion :default-expanded="showTemporaryPreviewButton">
    <template #title>{{ sectionTitle }}</template>
    <template #content>
      <PageBuilderSettings embedded-section="download" />
    </template>
  </EditorAccordion>
</template>
