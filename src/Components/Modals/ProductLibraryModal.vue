<script setup lang="ts">
import { provide } from 'vue'
import DefaultDisplayProducts from '../../tests/DefaultComponents/DefaultDisplayProducts.vue'
import BaseModal from './BaseModal.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    required: true,
  },
  displayProductsComponent: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['closeProductLibrary'])

const closeProductLibraryModal = () => {
  emit('closeProductLibrary')
}
provide('closeProductLibraryModal', closeProductLibraryModal)
</script>

<template>
  <BaseModal
    :title="title"
    :showModalBuilder="open"
    @closeMainModalBuilder="closeProductLibraryModal"
    maxWidth="6xl"
  >
    <div v-if="displayProductsComponent" class="pbx-w-full pbx-min-h-screen">
      <component :is="displayProductsComponent" />
    </div>
    <div v-else>
      <DefaultDisplayProducts />
    </div>
  </BaseModal>
</template>
