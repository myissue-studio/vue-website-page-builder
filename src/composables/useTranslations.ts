import { ref, readonly } from 'vue'
import type { Ref } from 'vue'

// Preload all locale JSON files using Vite's import.meta.glob
const localeModules = import.meta.glob('../locales/*.json', { eager: true })

const translations: Ref<Record<string, string>> = ref({})

async function loadTranslations(language: string) {
  try {
    // Find the matching locale file
    const localePath = `../locales/${language}.json`
    const localeModule = localeModules[localePath]
    if (localeModule && 'default' in localeModule) {
      translations.value = (localeModule as any).default
    } else {
      throw new Error('Locale not found')
    }
  } catch (error) {
    console.error(`højo - Could not load translations for language: ${language}`, error)
    if (language !== 'en') {
      await loadTranslations('en')
    }
  }
}

export function useTranslations() {
  function translate(key: string): string {
    return translations.value[key] || key
  }

  return {
    translate,
    loadTranslations,
    currentTranslations: readonly(translations),
  }
}
