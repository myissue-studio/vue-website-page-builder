import { ref, readonly } from 'vue'
import type { Ref } from 'vue'

// Preload all locale JSON files using Vite's import.meta.glob
const localeModules = import.meta.glob('../locales/*.json', { eager: true })

const translations: Ref<Record<string, string>> = ref({})

function getLocaleRecord(language: string): Record<string, string> | null {
  const localePath = `../locales/${language}.json`
  const localeModule = localeModules[localePath]
  if (localeModule && typeof localeModule === 'object' && 'default' in localeModule) {
    return (localeModule as { default: Record<string, string> }).default
  }
  return null
}

async function loadTranslations(language: string) {
  try {
    const english = getLocaleRecord('en')
    if (!english) {
      throw new Error('English locale not found')
    }

    if (language === 'en') {
      translations.value = english
      return
    }

    const locale = getLocaleRecord(language)
    if (!locale) {
      throw new Error('Locale not found')
    }

    // English fills gaps so new keys never show as raw key strings
    translations.value = { ...english, ...locale }
  } catch (error) {
    console.error(`Could not load translations for language: ${language}`, error)
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
