<template>
  <div
    class="pbx-flex pbx-flex-col pbx-border-solid pbx-border pbx-border-gray-400"
    :class="{ '': expanded }"
  >
    <div
      class="pbx-flex pbx-flex-row pbx-justify-between pbx-items-center pbx-pl-3 pbx-pr-3 pbx-py-5 pbx-cursor-pointer pbx-duration-200 pbx-bg-white hover:pbx-bg-myPrimaryLightGrayColor pbx-select-none"
      @click="expanded = !expanded"
    >
      <p class="pbx-myPrimaryParagraph pbx-font-medium pbx-my-0 pbx-py-0">
        <slot name="title" />
      </p>

      <template v-if="expanded">
        <span class="material-symbols-outlined"> keyboard_arrow_down </span>
      </template>
      <template v-if="!expanded">
        <span class="material-symbols-outlined"> chevron_right </span>
      </template>
    </div>
    <div
      :class="[
        expanded
          ? 'pbx-block pbx-bg-indigo-50 pbx-border-0 pbx-border-solid pbx-border-t pbx-border-red-50'
          : 'pbx-hidden',
      ]"
      class="pbx-px-4 pbx-ease-linear pbx-duration-75 pbx-pb-8"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const expanded = ref(false)

    return {
      expanded,
    }
  },
}
</script>
