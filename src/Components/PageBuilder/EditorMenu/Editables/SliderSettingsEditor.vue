<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import HtmlActionButton from './HtmlActionButton.vue'
import { useTranslations } from '../../../../composables/useTranslations'

defineOptions({
  name: 'SliderSettingsEditor',
})

const { translate } = useTranslations()

defineEmits<{
  open: []
}>()
</script>

<template>
  <EditorAccordion :default-expanded="true">
    <template #title>{{ translate('Slider Settings') }}</template>
    <template #content>
      <HtmlActionButton
        icon="adjust"
        :label="translate('Open slider settings')"
        :hint="translate('Autoplay, slides & timing')"
        @click="$emit('open')"
      />
    </template>
  </EditorAccordion>
</template>
