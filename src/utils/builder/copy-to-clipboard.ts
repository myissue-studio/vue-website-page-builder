import { useToast } from '../../composables/useToast'
import { useTranslations } from '../../composables/useTranslations'

export async function copyTextWithToast(text: string): Promise<boolean> {
  const { showToast } = useToast()
  const { translate } = useTranslations()

  try {
    await navigator.clipboard.writeText(text)
    showToast(translate('Copied to clipboard'), 'success')
    return true
  } catch {
    showToast(translate('Clipboard unavailable'), 'error')
    return false
  }
}
