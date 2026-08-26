<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import PageBuilderSettings from '../../Settings/PageBuilderSettings.vue'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
</script>

<template>
  <div class="pbx-flex pbx-flex-col pbx-gap-2">
    <p
      class="pbx-m-0 pbx-px-0.5 pbx-text-[10px] pbx-font-semibold pbx-uppercase pbx-tracking-wider pbx-text-gray-400"
    >
      {{ translate('Developer') }}
    </p>

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

    <EditorAccordion>
      <template #title>{{ translate('Selected HTML') }}</template>
      <template #content>
        <PageBuilderSettings embedded-section="selectedHtml" />
      </template>
    </EditorAccordion>
  </div>
</template>
