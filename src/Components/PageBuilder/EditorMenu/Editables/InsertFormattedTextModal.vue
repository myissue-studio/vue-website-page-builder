<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import ConfirmActionModal from '../../../Modals/ConfirmActionModal.vue'
import ToggleInput from '../../../Inputs/ToggleInput.vue'
import { useTranslations } from '../../../../composables/useTranslations'
import { previewFormattedTextItems } from '../../../../utils/builder/formatted-text-to-components'

const props = defineProps<{
  open: boolean
  /** Show “replace current page” when the canvas already has content. */
  showReplaceToggle?: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'insert', source: string, options?: { replacePage?: boolean }): void
}>()

const { translate } = useTranslations()

const formattedTextInput = ref('')
const isInserting = ref(false)
const replaceExistingContent = ref(false)

const previewCount = computed(() => previewFormattedTextItems(formattedTextInput.value).length)
const willReplacePage = computed(
  () => Boolean(props.showReplaceToggle) && replaceExistingContent.value,
)

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) {
      formattedTextInput.value = ''
      isInserting.value = false
      return
    }
    replaceExistingContent.value = Boolean(props.showReplaceToggle)
    await nextTick()
    document.getElementById('pbx-paste-text-input')?.focus()
  },
)

function closeModal(): void {
  emit('close')
}

async function insertFormattedText(): Promise<void> {
  const source = formattedTextInput.value.trim()
  if (!source || !previewCount.value) return

  isInserting.value = true
  try {
    emit('insert', source, { replacePage: willReplacePage.value })
    closeModal()
  } finally {
    isInserting.value = false
  }
}
</script>

<template>
  <ConfirmActionModal
    :showDynamicModalBuilder="open"
    type="success"
    :gridColumnAmount="2"
    :title="translate('Paste your text')"
    :description="translate('Paste text short description')"
    :isLoading="isInserting"
    :firstButtonText="translate('Close')"
    :thirdButtonText="translate(willReplacePage ? 'Replace' : 'Insert')"
    :disabled="isInserting || !previewCount"
    disabledWhichButton="third"
    maxWidth="2xl"
    @firstModalButtonFunctionDynamicModalBuilder="closeModal"
    @thirdModalButtonFunctionDynamicModalBuilder="insertFormattedText"
  >
    <div class="pbx-pasteTextModal">
      <div>
        <label class="pbx-sr-only" for="pbx-paste-text-input">
          {{ translate('Paste your job post or article here') }}
        </label>
        <textarea
          id="pbx-paste-text-input"
          v-model="formattedTextInput"
          class="pbx-myPrimaryTextArea pbx-min-h-96"
          :placeholder="translate('Paste your job post or article here')"
          @keydown.meta.enter.prevent="insertFormattedText"
          @keydown.ctrl.enter.prevent="insertFormattedText"
        />
        <div class="pbx-pasteTextFooter" aria-live="polite">
          <span class="pbx-pasteTextHint">
            {{ translate('Paste from Word, Docs, ChatGPT, or a webpage') }}
          </span>
          <span v-if="previewCount" class="pbx-pasteTextCount">
            {{ previewCount }}
            {{ translate(previewCount === 1 ? 'block' : 'blocks') }}
          </span>
        </div>
      </div>

      <label v-if="showReplaceToggle" class="pbx-pasteTextReplace">
        <span class="pbx-pasteTextReplaceText">
          {{ translate('Replace existing content') }}
        </span>
        <ToggleInput v-model="replaceExistingContent" />
      </label>
    </div>
  </ConfirmActionModal>
</template>
