<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import HtmlActionButton from './HtmlActionButton.vue'
import { useTranslations } from '../../../../composables/useTranslations'

defineOptions({
  name: 'ProductSectionSettingsEditor',
})

const { translate } = useTranslations()

defineEmits<{
  open: []
}>()
</script>

<template>
  <EditorAccordion :default-expanded="true">
    <template #title>{{ translate('Product section settings') }}</template>
    <template #content>
      <HtmlActionButton
        icon="shopping_bag"
        :label="translate('Open product section settings')"
        :hint="translate('Layout, cards & visibility')"
        @click="$emit('open')"
      />
    </template>
  </EditorAccordion>
</template>
