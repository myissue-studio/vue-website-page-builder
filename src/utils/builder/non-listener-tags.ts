export const NON_LISTENER_TAGS = [
  'P',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'IFRAME',
  'UL',
  'OL',
  'LI',
  'EM',
  'STRONG',
  'B',
  'A',
  'SPAN',
  'BLOCKQUOTE',
  'BR',
  'PRE',
  'CODE',
  'MARK',
  'DEL',
  'INS',
  'U',
  'FIGURE',
  'FIGCAPTION',
] as const

export type NonListenerTagName = (typeof NON_LISTENER_TAGS)[number]

export type NonListenerTagClassViolation = {
  tagName: NonListenerTagName
  className: string
  outerHTML: string
}

function isButtonLikeAnchor(element: HTMLElement): boolean {
  if (element.tagName !== 'A') return false

  const className = element.className
  return (
    element.classList.contains('pbx-product-card-cta-link') ||
    className.includes('pbx-inline-flex') ||
    className.includes('pbx-bg-') ||
    className.includes('pbx-rounded') ||
    Boolean(element.closest('#linktree, .pbx-product-card-cta'))
  )
}

export function findNonListenerTagClassViolations(
  root: ParentNode,
): NonListenerTagClassViolation[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[class]'))
    .filter((element) => NON_LISTENER_TAGS.includes(element.tagName as NonListenerTagName))
    .filter((element) => element.tagName !== 'IFRAME')
    .filter((element) => !element.closest('[data-pb-no-select]'))
    .filter((element) => !isButtonLikeAnchor(element))
    .filter((element) => element.className.trim().length > 0)
    .map((element) => ({
      tagName: element.tagName as NonListenerTagName,
      className: element.className,
      outerHTML: element.outerHTML,
    }))
}
