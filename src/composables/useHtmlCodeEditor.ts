import { ref } from 'vue'
import { formatHtml } from '../utils/builder/prettify-html'
import { getPageBuilder } from './usePageBuilder'
import { sleep } from '../utils/sleep'
import { useToast } from './useToast'
import { useTranslations } from './useTranslations'

export type HtmlEditorMode = 'element' | 'page'

const show = ref(false)
const title = ref('')
const html = ref('')
const mode = ref<HtmlEditorMode>('element')
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useHtmlCodeEditor() {
  function openHtmlEditor(
    modalTitle: string,
    modalHtml: string,
    editorMode: HtmlEditorMode = 'element',
  ) {
    title.value = modalTitle
    html.value = formatHtml(modalHtml)
    mode.value = editorMode
    error.value = null
    isLoading.value = false
    show.value = true
  }

  function closeHtmlEditor() {
    show.value = false
    error.value = null
    isLoading.value = false
  }

  async function saveHtmlEditor() {
    const pageBuilderService = getPageBuilder()
    const { showToast } = useToast()
    const { translate } = useTranslations()
    isLoading.value = true
    error.value = null
    await sleep(300)

    const saveError =
      mode.value === 'page'
        ? await pageBuilderService.applyModifiedComponents(html.value)
        : await pageBuilderService.applyModifiedHTML(html.value)

    if (saveError) {
      error.value = saveError
      showToast(saveError, 'error')
      isLoading.value = false
      return
    }

    showToast(translate('HTML updated successfully'), 'success')
    show.value = false
    isLoading.value = false
  }

  return {
    show,
    title,
    html,
    mode,
    isLoading,
    error,
    openHtmlEditor,
    closeHtmlEditor,
    saveHtmlEditor,
  }
}
