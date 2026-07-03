<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTranslations } from '../../../../composables/useTranslations'

const props = defineProps<{
  value?: string | null
}>()

const { translate } = useTranslations()
const copied = ref(false)

const displayId = computed(() => {
  const id = props.value
  if (!id) return '—'
  if (id.length <= 18) return id
  return `${id.slice(0, 8)}…${id.slice(-4)}`
})

async function copyId() {
  if (!props.value) return

  try {
    await navigator.clipboard.writeText(props.value)
    copied.value = true
    globalThis.setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Clipboard unavailable — title attribute still shows full ID on hover.
  }
}
</script>

<template>
  <button
    v-if="value"
    type="button"
    class="pbx-inspectorIdChip"
    :title="value"
    :aria-label="`${translate('Copy ID')}: ${value}`"
    @click="copyId"
  >
    <span class="pbx-inspectorIdChipText">{{ displayId }}</span>
    <span class="pbx-inspectorIdChipIcon material-symbols-outlined" aria-hidden="true">
      {{ copied ? 'check' : 'content_copy' }}
    </span>
  </button>
  <span v-else class="pbx-inspectorValue">—</span>
</template>
