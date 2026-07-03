<script setup lang="ts">
import EditorAccordion from '../EditorAccordion.vue'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()

defineEmits<{
  open: []
}>()
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Global Page Styles') }}</template>
    <template #content>
      <div class="pbx-editorFieldGroup">
        <button type="button" class="pbx-myPrimaryButton pbx-w-full" @click="$emit('open')">
          {{ translate('Global Page Styles') }}
        </button>
      </div>
    </template>
  </EditorAccordion>
</template>
