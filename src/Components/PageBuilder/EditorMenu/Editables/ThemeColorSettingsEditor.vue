<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import ThemeColorPresetManager from './ThemeColorPresetManager.vue'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Theme & colors') }}</template>
    <template #content>
      <ThemeColorPresetManager embedded />
    </template>
  </EditorAccordion>
</template>
