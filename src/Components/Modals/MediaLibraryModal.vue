<script setup lang="ts">
import { provide } from 'vue'
import DefaultMediaLibraryComponent from '../../tests/DefaultComponents/DefaultMediaLibraryComponent.vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    required: true,
  },
  firstButtonText: {
    type: String,
  },
  secondButtonText: {
    type: String,
  },
  thirdButtonText: {
    type: String,
  },
  open: {
    type: Boolean,
    required: true,
  },
  customMediaComponent: {
    type: Object,
    default: null,
  },
  onMediaSelected: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits(['firstMediaButtonFunction'])

// first button function
const firstButton = function () {
  emit('firstMediaButtonFunction')
}

// Provide close function for custom components
const closeMediaLibraryModal = () => {
  firstButton()
}
provide('closeMediaLibraryModal', closeMediaLibraryModal)
provide('onMediaSelected', props.onMediaSelected ?? null)
</script>

<template>
  <BaseModal
    :title="props.title"
    :showModalBuilder="props.open"
    @closeMainModalBuilder="firstButton"
    maxWidth="6xl"
  >
    <!-- Show only custom media component if provided -->
    <div v-if="props.customMediaComponent" class="pbx-w-full pbx-min-h-screen">
      <component :is="props.customMediaComponent" />
    </div>
    <div v-else>
      <DefaultMediaLibraryComponent />
    </div>
  </BaseModal>
</template>
