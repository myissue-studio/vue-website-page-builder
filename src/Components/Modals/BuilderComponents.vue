<script setup lang="ts">
import ModalBuilder from '../Modals/ModalBuilder.vue'
import DefaultBuilderComponents from '../../tests/DefaultComponents/DefaultBuilderComponents.vue'
import { inject } from 'vue'
const customMediaComponent = inject<object | null>('CustomMediaComponent', null)

defineProps({
  firstButtonText: {
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
    required: true,
  },
  CustomBuilderComponents: {
    type: Object,
    default: null,
  },
})
const emit = defineEmits(['firstModalButtonSearchComponentsFunction'])

// first button function
const firstButtonBuilder = function () {
  emit('firstModalButtonSearchComponentsFunction')
}
</script>

<template>
  <ModalBuilder
    :title="title"
    maxWidth="6xl"
    :showModalBuilder="show"
    @closeMainModalBuilder="firstButtonBuilder"
    minHeight=""
    maxHeight=""
  >
    <div
      class="pbx-w-full pbx-inset-x-0 pbx-bg-white pbx-overflow-x-auto lg:pbx-pt-2 pbx-pt-2 pbx-px-2"
    >
      <div>
        <!-- Only show custom search component if provided -->
        <div v-if="CustomBuilderComponents">
          <component :is="CustomBuilderComponents" />
        </div>
        <div v-else>
          <DefaultBuilderComponents :customMediaComponent="customMediaComponent ?? undefined" />
        </div>
      </div>
    </div>
  </ModalBuilder>
</template>
