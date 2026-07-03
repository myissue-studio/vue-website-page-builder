<script setup lang="ts">
import { ref } from 'vue'

const expanded = ref(false)

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
    <div
      class="pbx-flex pbx-cursor-pointer pbx-select-none pbx-flex-row pbx-items-center pbx-justify-between pbx-bg-white pbx-px-4 pbx-py-4 pbx-duration-200 hover:pbx-bg-myPrimaryLightGrayColor"
      @click="toggleExpanded"
    >
      <p class="pbx-myPrimaryParagraph pbx-my-0 pbx-py-0 pbx-text-sm pbx-font-medium">
        <slot name="title" />
      </p>

      <span class="material-symbols-outlined pbx-text-gray-400">
        {{ expanded ? 'keyboard_arrow_down' : 'chevron_right' }}
      </span>
    </div>
    <div :class="[expanded ? 'pbx-block' : 'pbx-hidden', 'pbx-editorAccordionContent']">
      <slot name="content" />
    </div>
  </div>
</template>

<style scoped>
.pbx-editorAccordionContent :deep(hr) {
  @apply pbx-my-4 pbx-border-0 pbx-border-t pbx-border-solid pbx-border-gray-200;
}
</style>
