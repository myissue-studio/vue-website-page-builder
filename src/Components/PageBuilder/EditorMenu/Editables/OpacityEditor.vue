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
      <ManageOpacity></ManageOpacity>
      <hr />
      <ManageBackgroundOpacity></ManageBackgroundOpacity>
    </template>
  </EditorAccordion>
</template>
