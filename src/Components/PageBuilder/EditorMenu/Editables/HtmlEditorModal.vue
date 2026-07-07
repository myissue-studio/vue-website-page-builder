<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseModal from '../../../Modals/BaseModal.vue'
import { useTranslations } from '../../../../composables/useTranslations'
import { copyTextWithToast } from '../../../../utils/builder/copy-to-clipboard'

const props = withDefaults(
  defineProps<{
    show: boolean
    title: string
    html: string
    isLoading?: boolean
    error?: string | null
    /** Toolbar badge, e.g. HTML or JSON */
    badge?: string
    /** Preview-only mode — hides Save and locks the textarea */
    readOnly?: boolean
  }>(),
  {
    badge: 'HTML',
    readOnly: false,
  },
)

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
  const didCopy = await copyTextWithToast(props.html)
  if (didCopy) {
    copied.value = true
    globalThis.setTimeout(() => {
      copied.value = false
    }, 2000)
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
    <div>
      <p v-if="!html" class="pbx-inspectorEmpty">{{ translate('No HTML available') }}</p>

      <div v-else class="pbx-htmlCodeViewer">
        <div class="pbx-htmlCodeViewerToolbar">
          <div class="pbx-htmlCodeViewerToolbarLeft">
            <span class="pbx-htmlCodeViewerBadge">{{ badge }}</span>
            <span class="pbx-htmlCodeViewerMeta"> {{ lineCount }} {{ translate('lines') }} </span>
            <span class="pbx-htmlCodeViewerMeta pbx-htmlCodeViewerMetaMuted">
              {{ readOnly ? translate('Read-only') : translate('Editable') }}
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
            :readonly="readOnly"
            spellcheck="false"
            @input="onHtmlInput"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="pbx-flex pbx-justify-end pbx-min-h-6 pbx-mt-2">
      <p v-if="error" class="pbx-myPrimaryParagraphError">Error: {{ error }}</p>
    </div>

    <template #actions>
      <button
        type="button"
        class="pbx-mySecondaryButton"
        :disabled="isLoading"
        @click="$emit('close')"
      >
        {{ translate('Close') }}
      </button>
      <button
        v-if="!readOnly"
        type="button"
        class="pbx-myPrimaryButton"
        :disabled="isLoading"
        @click="$emit('save')"
      >
        {{ translate('Save') }}
        <span v-if="!isLoading" class="material-symbols-outlined">check</span>
        <span v-if="isLoading" class="material-symbols-outlined pbx-animate-spin">refresh</span>
      </button>
    </template>
  </BaseModal>
</template>
