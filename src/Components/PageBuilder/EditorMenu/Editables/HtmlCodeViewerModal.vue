<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseModal from '../../../Modals/BaseModal.vue'
import { prettifyHtml } from '../../../../utils/builder/prettify-html'
import { useTranslations } from '../../../../composables/useTranslations'
import { copyTextWithToast } from '../../../../utils/builder/copy-to-clipboard'

const props = defineProps<{
  show: boolean
  title: string
  html: string
}>()

defineEmits<{
  close: []
}>()

const { translate } = useTranslations()
const copied = ref(false)

const prettifiedHtml = computed(() => prettifyHtml(props.html))

const lineCount = computed(() => {
  if (!props.html) return 0
  return prettifiedHtml.value.split('\n').filter((line) => line.trim().length > 0).length
})

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
            <span class="pbx-htmlCodeViewerBadge">HTML</span>
            <span class="pbx-htmlCodeViewerMeta"> {{ lineCount }} {{ translate('lines') }} </span>
            <span class="pbx-htmlCodeViewerMeta pbx-htmlCodeViewerMetaMuted">
              {{ translate('Read-only') }}
            </span>
          </div>
          <button type="button" class="pbx-htmlCodeViewerCopy" @click="copyHtml">
            <span class="material-symbols-outlined" aria-hidden="true">
              {{ copied ? 'check' : 'content_copy' }}
            </span>
          </button>
        </div>

        <div class="pbx-htmlCodeViewerSurface">
          <pre class="pbx-htmlCodeViewerPre"><code v-html="prettifiedHtml"></code></pre>
        </div>
      </div>
    </div>
  </BaseModal>
</template>
