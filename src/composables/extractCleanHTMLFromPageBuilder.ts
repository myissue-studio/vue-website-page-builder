import type { PageBuilderConfig } from '../types'

export function extractCleanHTMLFromPageBuilder(
  pagebuilder: HTMLElement | null,
  config?: PageBuilderConfig,
): string {
  if (!pagebuilder) {
    console.warn('No valid pagebuilder element passed')
    return ''
  }

  const clone = pagebuilder.cloneNode(true) as HTMLElement
  clone.removeAttribute('id')

  // Remove all elements with id="nolocalstorage"
  clone.querySelectorAll<HTMLElement>('[id="nolocalstorage"]').forEach((el) => {
    el.remove()
  })

  // Remove custom attributes
  const elementsWithAttrs = clone.querySelectorAll<HTMLElement>(
    '[data-componentid], [data-component-title], #page-builder-editor-editable-area',
  )

  elementsWithAttrs.forEach((el) => {
    el.removeAttribute('data-componentid')
    el.removeAttribute('data-component-title')
    if (el.id === 'page-builder-editor-editable-area') {
      el.removeAttribute('id')
    }
  })

  if (config && config && typeof config.imageUrlPrefix === 'string') {
    const imageUrlPrefix = config.imageUrlPrefix
    const imgs = clone.querySelectorAll<HTMLImageElement>('img')
    imgs.forEach((img) => {
      const src = img.getAttribute('src') || ''
      if (
        !src.startsWith('http') &&
        // extra safety
        imageUrlPrefix &&
        !src.startsWith(imageUrlPrefix)
      ) {
        img.setAttribute('src', imageUrlPrefix + src.replace(/^\/+/, ''))
      }
    })
  }

  // Recursively remove all comment nodes
  const removeComments = (node: Node): void => {
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      const child = node.childNodes[i]
      if (child.nodeType === Node.COMMENT_NODE) {
        node.removeChild(child)
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        removeComments(child)
      }
    }
  }

  removeComments(clone)

  return clone.outerHTML
}
