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
  <div>
    <Footer></Footer>
    <PageBuilderTest></PageBuilderTest>
  </div>
</template>
