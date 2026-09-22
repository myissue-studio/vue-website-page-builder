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

const formattedTextPreview = computed(() => previewFormattedTextItems(formattedTextInput.value))
const previewCount = computed(() => formattedTextPreview.value.length)
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
    <div class="pbx-pasteTextModal pbx-px-2">
      <div v-if="showReplaceToggle" class="pbx-productSettingsToggleRow">
        <div class="pbx-flex pbx-flex-col pbx-gap-0.5">
          <p class="pbx-m-0 pbx-text-sm pbx-font-medium pbx-text-myPrimaryDarkGrayColor">
            {{ translate('Replace existing content') }}
          </p>
          <p class="pbx-m-0 pbx-text-xs pbx-text-gray-500">
            {{ translate('Remove current page blocks before inserting') }}
          </p>
        </div>
        <ToggleInput v-model="replaceExistingContent" />
      </div>

      <label class="pbx-sr-only" for="pbx-paste-text-input">
        {{ translate('Paste your job post or article here') }}
      </label>
      <textarea
        id="pbx-paste-text-input"
        v-model="formattedTextInput"
        class="pbx-myPrimaryTextArea pbx-min-h-[14rem]"
        :placeholder="translate('Paste your job post or article here')"
        @keydown.meta.enter.prevent="insertFormattedText"
        @keydown.ctrl.enter.prevent="insertFormattedText"
      />

      <div class="pbx-pasteTextMeta" aria-live="polite">
        <p v-if="!previewCount" class="pbx-pasteTextHint">
          {{ translate('Paste from Word, Docs, ChatGPT, or a webpage') }}
        </p>
        <p v-else class="pbx-pasteTextCount">
          {{ previewCount }}
          {{ translate(previewCount === 1 ? 'block' : 'blocks') }}
        </p>
      </div>

      <ul v-if="previewCount" class="pbx-pasteTextList">
        <li
          v-for="(item, index) in formattedTextPreview.slice(0, 6)"
          :key="`${item.title}-${index}`"
          class="pbx-pasteTextListItem"
        >
          <span class="pbx-pasteTextListIndex">{{ index + 1 }}</span>
          <span class="pbx-pasteTextListExcerpt">{{ item.excerpt || translate(item.title) }}</span>
        </li>
        <li v-if="previewCount > 6" class="pbx-pasteTextListMore">
          +{{ previewCount - 6 }}
          {{ translate('blocks') }}
        </li>
      </ul>
    </div>
  </ConfirmActionModal>
</template>
