<script setup lang="ts">
import { onMounted, computed } from 'vue'
import PageBuilderTest from './tests/PageBuilderTest.vue'
import Footer from './Components/Homepage/Footer.vue'
import { useTranslations } from './composables/useTranslations'
import { sharedPageBuilderStore } from './stores/shared-store'

const { loadTranslations } = useTranslations()

const pageBuilderStateStore = sharedPageBuilderStore

const getCurrentLanguage = computed(() => {
  return pageBuilderStateStore.getCurrentLanguage
})

onMounted(async () => {
  const language = getCurrentLanguage.value || 'en'
  await loadTranslations(language)
})
</script>

<template>
  <div class="myissue-pagebuilder">
    <Footer></Footer>
    <PageBuilderTest></PageBuilderTest>
  </div>
</template>

<style>
::-webkit-scrollbar {
  height: 2px; /* horizontal scrollbar height */
}

::-webkit-scrollbar-track {
  background: transparent; /* or a color */
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

::-webkit-scrollbar {
  width: 8px; /* vertical */
  height: 8px; /* horizontal */
}
</style>
