<script setup lang="ts">
import { onMounted, ref } from 'vue'
import EditorAccordion from '../EditorAccordion.vue'
import { getPageBuilder } from '../../../../composables/usePageBuilder'
import { useTranslations } from '../../../../composables/useTranslations'
import { useToast } from '../../../../composables/useToast'

defineOptions({
  name: 'PageMetaSettingsEditor',
})

const { translate } = useTranslations()
const { showToast } = useToast()
const pageBuilderService = getPageBuilder()

const metaTitle = ref('')
const metaDescription = ref('')
const isSaving = ref(false)

onMounted(() => {
  const meta = pageBuilderService.getPageMeta()
  metaTitle.value = meta.title || ''
  metaDescription.value = meta.description || ''
})

const saveMeta = async () => {
  if (isSaving.value) return
  isSaving.value = true
  try {
    await pageBuilderService.setPageMeta({
      title: metaTitle.value.trim(),
      description: metaDescription.value.trim(),
    })
    showToast(translate('Page meta saved'), 'success')
  } catch {
    showToast(translate('Could not save page meta'), 'error')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <EditorAccordion>
    <template #title>{{ translate('Page Meta') }}</template>
    <template #content>
      <p class="pbx-editorSectionDesc">
        {{ translate('Page meta description') }}
      </p>

      <div class="pbx-editorFieldGroup">
        <label for="page-meta-title" class="pbx-myPrimaryInputLabel">
          {{ translate('Meta title') }}
        </label>
        <input
          id="page-meta-title"
          v-model="metaTitle"
          type="text"
          class="pbx-myPrimaryInput pbx-w-full"
          :placeholder="translate('Meta title placeholder')"
        />
      </div>

      <div class="pbx-editorFieldGroup">
        <label for="page-meta-description" class="pbx-myPrimaryInputLabel">
          {{ translate('Meta description') }}
        </label>
        <textarea
          id="page-meta-description"
          v-model="metaDescription"
          rows="3"
          class="pbx-myPrimaryInput pbx-w-full pbx-resize-y"
          :placeholder="translate('Meta description placeholder')"
        />
      </div>

      <button
        type="button"
        class="pbx-myPrimaryButton pbx-w-full"
        :disabled="isSaving"
        @click="saveMeta"
      >
        {{ isSaving ? translate('Loading...') : translate('Save') }}
      </button>
    </template>
  </EditorAccordion>
</template>
