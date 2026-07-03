import { ref } from 'vue'

const show = ref(false)
const title = ref('')
const html = ref('')

export function useHtmlCodeViewer() {
  function openHtmlViewer(modalTitle: string, modalHtml: string) {
    title.value = modalTitle
    html.value = modalHtml
    show.value = true
  }

  function closeHtmlViewer() {
    show.value = false
  }

  return {
    show,
    title,
    html,
    openHtmlViewer,
    closeHtmlViewer,
  }
}
