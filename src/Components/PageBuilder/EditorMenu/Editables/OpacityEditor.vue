<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import BackgroundOpacityControl from './BackgroundOpacityControl.vue'
import OpacityControl from './OpacityControl.vue'
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
      <OpacityControl></OpacityControl>
      <hr />
      <p class="pbx-editorSectionTitle">
        {{ translate('Background Opacity') }}
      </p>
      <BackgroundOpacityControl></BackgroundOpacityControl>
    </template>
  </EditorAccordion>
</template>
