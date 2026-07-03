<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import ManageBackgroundOpacity from './ManageBackgroundOpacity.vue'
import ManageOpacity from './ManageOpacity.vue'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Opacity & Transparency') }}</template>
    <template #content>
      <p class="pbx-editorSectionTitle">
        {{ translate('Opacity') }}
      </p>
      <ManageOpacity></ManageOpacity>
      <hr />
      <p class="pbx-editorSectionTitle">
        {{ translate('Background Opacity') }}
      </p>
      <ManageBackgroundOpacity></ManageBackgroundOpacity>
    </template>
  </EditorAccordion>
</template>
