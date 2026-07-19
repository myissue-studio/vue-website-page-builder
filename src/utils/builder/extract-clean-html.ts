import type { PageBuilderConfig } from '../../types'

const isAbsoluteOrInlineImageSrc = (src: string): boolean => {
  return /^[a-z][a-z0-9+.-]*:/i.test(src) || src.startsWith('//')
}

/** Force every image slider back to slide 1 for preview/publish HTML. */
function resetInlineSlidersToFirstSlide(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-isl]').forEach((container) => {
    container.removeAttribute('data-isl-active')

    const track = container.querySelector('.pbx-isl-t') as HTMLElement | null
    if (track) {
      track.removeAttribute('style')
      track.scrollLeft = 0
    }

    const nums = container.querySelectorAll<HTMLElement>('.pbx-isl-nums span')
    nums.forEach((span) => {
      span.removeAttribute('style')
    })
    const firstNum = nums[0]
    if (firstNum) {
      firstNum.style.opacity = '1'
      firstNum.style.background = 'rgba(255,255,255,0.9)'
      firstNum.style.color = '#111'
      firstNum.style.borderRadius = '9999px'
      firstNum.style.padding = '0.1rem 0.55rem'
      firstNum.style.textShadow = 'none'
    }

    const dots = container.querySelectorAll<HTMLElement>('.pbx-isl-dot')
    dots.forEach((dot) => {
      dot.removeAttribute('style')
    })
    const firstDot = dots[0]
    if (firstDot) {
      firstDot.style.background = 'rgba(255,255,255,1)'
    }
  })
}

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

  // Remove all builder-only insert-button wrappers
  clone.querySelectorAll<HTMLElement>('[data-pbx-insert-btn]').forEach((el) => {
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

  // Remove builder-only attributes that must not appear in published/preview HTML
  clone.querySelectorAll<HTMLElement>('[data-pagebuilder-content]').forEach((el) => {
    el.removeAttribute('data-pagebuilder-content')
  })
  clone.querySelectorAll<HTMLElement>('[data-isl-active]').forEach((el) => {
    el.removeAttribute('data-isl-active')
  })
  // data-builder-canvas marks the live edit canvas — must not appear in saved/preview HTML
  // (it would cause the builder's animation-pause rule to fire in preview)
  clone.removeAttribute('data-builder-canvas')

  // Preview/publish should always start on slide 1. Editing often leaves the track scrolled
  // and num/dot highlight styles stuck on a later slide, which makes preview look wrong.
  resetInlineSlidersToFirstSlide(clone)

  if (config && config && typeof config.imageUrlPrefix === 'string') {
    const imageUrlPrefix = config.imageUrlPrefix
    const imgs = clone.querySelectorAll<HTMLImageElement>('img')
    imgs.forEach((img) => {
      const src = img.getAttribute('src') || ''
      if (
        src &&
        !src.startsWith('http') &&
        !isAbsoluteOrInlineImageSrc(src) &&
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
