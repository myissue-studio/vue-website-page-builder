<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseModal from '../../../Modals/BaseModal.vue'
import { useTranslations } from '../../../../composables/useTranslations'

const props = defineProps<{
  show: boolean
  title: string
  html: string
  isLoading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  close: []
  save: []
  'update:html': [value: string]
}>()

const { translate } = useTranslations()
const copied = ref(false)

const lineCount = computed(() => {
  if (!props.html) return 0
  return props.html.split('\n').filter((line) => line.trim().length > 0).length
})

function onHtmlInput(event: Event) {
  emit('update:html', (event.target as HTMLTextAreaElement).value)
}

async function copyHtml() {
  if (!props.html) return

  try {
    await navigator.clipboard.writeText(props.html)
    copied.value = true
    globalThis.setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Clipboard unavailable.
  }
}
</script>

<template>
  <BaseModal
    :showModalBuilder="show"
    :title="title"
    maxWidth="7xl"
    :z-index="10001"
    @closeMainModalBuilder="$emit('close')"
  >
    <div class="pbx-min-h-[10rem] pbx-py-6">
      <p v-if="!html" class="pbx-inspectorEmpty">{{ translate('No HTML available') }}</p>

      <div v-else class="pbx-htmlCodeViewer">
        <div class="pbx-htmlCodeViewerToolbar">
          <div class="pbx-htmlCodeViewerToolbarLeft">
            <span class="pbx-htmlCodeViewerBadge">HTML</span>
            <span class="pbx-htmlCodeViewerMeta"> {{ lineCount }} {{ translate('lines') }} </span>
            <span class="pbx-htmlCodeViewerMeta pbx-htmlCodeViewerMetaMuted">
              {{ translate('Editable') }}
            </span>
          </div>
          <button type="button" class="pbx-htmlCodeViewerCopy" @click="copyHtml">
            <span class="material-symbols-outlined" aria-hidden="true">
              {{ copied ? 'check' : 'content_copy' }}
            </span>
          </button>
        </div>

        <div class="pbx-htmlCodeViewerSurface">
          <textarea
            id="html-editor"
            class="pbx-htmlCodeEditorTextarea"
            :value="html"
            :aria-label="title"
            spellcheck="false"
            @input="onHtmlInput"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="pbx-flex pbx-justify-end pbx-min-h-6 pbx-mt-2">
      <p v-if="error" class="pbx-myPrimaryParagraphError">Error: {{ error }}</p>
    </div>

    <div
      class="pbx-border-0 pbx-border-solid pbx-border-t pbx-border-gray-200 pbx-flex pbx-items-center pbx-justify-end"
    >
      <div class="pbx-py-4 pbx-flex sm:pbx-justify-end pbx-justify-center">
        <div
          class="sm:pbx-grid-cols-2 sm:pbx-items-end sm:pbx-justify-end pbx-flex pbx-flex-row pbx-myPrimaryGap pbx-w-full"
        >
          <template v-if="!isLoading">
            <button type="button" class="pbx-mySecondaryButton" @click="$emit('close')">
              {{ translate('Close') }}
            </button>
            <button type="button" class="pbx-myPrimaryButton" @click="$emit('save')">
              {{ translate('Save') }}
            </button>
          </template>
          <template v-else>
            <div class="pbx-flex pbx-items-center pbx-my-2 pbx-justify-end">
              <div
                class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent pbx-align-[-0.125em] motion-reduce:pbx-animate-[spin_1.5s_linear_infinite]"
              >
                <span
                  class="!pbx-absolute !pbx-m-px !pbx-h-px !pbx-w-px !pbx-overflow-hidden !pbx-whitespace-nowrap !pbx-border-0 !pbx-p-0 !pbx-[clip:rect(0,0,0,0)]"
                  >Loading...</span
                >
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </BaseModal>
</template>
