<script setup>
import { provide } from 'vue'
import DefaultMediaLibraryComponent from '../../tests/DefaultComponents/DefaultMediaLibraryComponent.vue'
import ModalBuilder from './ModalBuilder.vue'

defineProps({
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
    required: true,
  },
  customMediaComponent: {
    type: Object,
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
</script>

<template>
  <ModalBuilder
    :title="title"
    :showModalBuilder="open"
    @closeMainModalBuilder="firstButton"
    maxWidth="6xl"
  >
    <!-- Show only custom media component if provided -->
    <div v-if="customMediaComponent" class="pbx-w-full pbx-min-h-screen">
      <component :is="customMediaComponent" />
    </div>
    <div v-else>
      <DefaultMediaLibraryComponent />
    </div>
  </ModalBuilder>
</template>
