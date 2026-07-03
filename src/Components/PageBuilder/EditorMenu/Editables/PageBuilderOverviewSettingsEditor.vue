<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import PageBuilderSettings from '../../Settings/PageBuilderSettings.vue'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
</script>

<template>
  <div class="pbx-flex pbx-flex-col pbx-gap-2">
    <EditorAccordion>
      <template #title>{{ translate('App & Resource') }}</template>
      <template #content>
        <PageBuilderSettings embedded-section="overviewApp" />
      </template>
    </EditorAccordion>

    <EditorAccordion>
      <template #title>{{ translate('User & Settings') }}</template>
      <template #content>
        <PageBuilderSettings embedded-section="overviewUser" />
      </template>
    </EditorAccordion>

    <EditorAccordion>
      <template #title>{{ translate('Full Configuration') }}</template>
      <template #content>
        <PageBuilderSettings embedded-section="overviewConfig" />
      </template>
    </EditorAccordion>
  </div>
</template>
