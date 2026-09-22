import type { Editor } from '@tiptap/core'
import type { PageBuilderConfig } from '../../types'
import {
  formattedTextToTipTapHtml,
  parseFormattedText,
  resolveFormattedTextPasteSource,
  shouldTransformFormattedTextPaste,
} from './formatted-text-to-components'

export type FormattedTextPasteOptions = {
  /**
   * When paste parses into multiple page blocks, call this instead of inserting
   * TipTap HTML into the current editor. Return true if handled.
   */
  onCreateComponents?: (source: string) => boolean
}

/** Multi-block pastes become separate Header / Text / List helpers on the page. */
export function shouldCreatePageComponentsFromPaste(source: string): boolean {
  return parseFormattedText(source).length >= 2
}

/**
 * Intercept TipTap paste for Markdown / HTML job ads.
 * Multi-block → page components (via onCreateComponents); otherwise TipTap HTML.
 * Returns true when the paste was handled.
 */
export function handleFormattedTextPaste(
  editor: Editor,
  event: ClipboardEvent,
  config?: PageBuilderConfig | null,
  options?: FormattedTextPasteOptions,
): boolean {
  const clipboard = event.clipboardData
  if (!clipboard) return false
  if (clipboard.files?.length) return false

  const text = clipboard.getData('text/plain') ?? ''
  const html = clipboard.getData('text/html') ?? ''
  if (!shouldTransformFormattedTextPaste(text, html)) return false

  const source = resolveFormattedTextPasteSource(text, html)
  if (!source.trim()) return false

  if (options?.onCreateComponents && shouldCreatePageComponentsFromPaste(source)) {
    event.preventDefault()
    return options.onCreateComponents(source) === true
  }

  const converted = formattedTextToTipTapHtml(source, config).trim()
  if (!converted) return false

  event.preventDefault()
  editor.commands.insertContent(converted)
  return true
}
