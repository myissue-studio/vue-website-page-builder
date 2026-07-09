<script setup lang="ts">
import { ref, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    defaultExpanded?: boolean
  }>(),
  {
    defaultExpanded: false,
  },
)

const expanded = ref(props.defaultExpanded)
const contentId = useId()

function toggleExpanded() {
  expanded.value = !expanded.value
}

function open() {
  expanded.value = true
}

function close() {
  expanded.value = false
}

defineExpose({ open, close, toggle: toggleExpanded })
</script>

<template>
  <div
    class="pbx-editorAccordion pbx-flex pbx-flex-col pbx-overflow-visible pbx-border pbx-border-solid pbx-border-gray-200"
  >
    <button
      type="button"
      class="pbx-flex pbx-w-full pbx-cursor-pointer pbx-select-none pbx-flex-row pbx-items-center pbx-justify-between pbx-border-0 pbx-bg-white pbx-px-4 pbx-py-4 pbx-text-left pbx-font-sans pbx-duration-200 hover:pbx-bg-gray-200 focus-visible:pbx-outline-none focus-visible:pbx-ring-2 focus-visible:pbx-ring-inset focus-visible:pbx-ring-myPrimaryLinkColor/30"
      :aria-expanded="expanded"
      :aria-controls="contentId"
      @click="toggleExpanded"
    >
      <span class="pbx-myPrimaryParagraph pbx-my-0 pbx-py-0 pbx-px-2 pbx-text-sm pbx-font-medium">
        <slot name="title" />
      </span>

      <span class="material-symbols-outlined pbx-text-gray-400" aria-hidden="true">
        {{ expanded ? 'keyboard_arrow_down' : 'chevron_right' }}
      </span>
    </button>
    <div
      :id="contentId"
      :class="[expanded ? 'pbx-block' : 'pbx-hidden', 'pbx-editorAccordionContent']"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<style scoped>
.pbx-editorAccordionContent :deep(hr) {
  @apply pbx-my-4 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-200;
}
</style>
