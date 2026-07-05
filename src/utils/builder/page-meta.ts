import type { PageMeta, PageSettings } from '../../types'

export const PAGE_META_TITLE_ATTR = 'data-meta-title'
export const PAGE_META_DESCRIPTION_ATTR = 'data-meta-description'

export function readPageMetaFromElement(el: HTMLElement): PageMeta {
  return {
    title: el.getAttribute(PAGE_META_TITLE_ATTR) || '',
    description: el.getAttribute(PAGE_META_DESCRIPTION_ATTR) || '',
  }
}

export function applyPageMetaToElement(el: HTMLElement, meta: PageMeta): void {
  const title = meta.title?.trim() || ''
  const description = meta.description?.trim() || ''

  if (title) el.setAttribute(PAGE_META_TITLE_ATTR, title)
  else el.removeAttribute(PAGE_META_TITLE_ATTR)

  if (description) el.setAttribute(PAGE_META_DESCRIPTION_ATTR, description)
  else el.removeAttribute(PAGE_META_DESCRIPTION_ATTR)
}

export function pageMetaFromPageSettings(settings: PageSettings | null | undefined): PageMeta {
  const meta = settings?.meta
  if (!meta || typeof meta !== 'object') {
    return { title: '', description: '' }
  }
  return {
    title: typeof meta.title === 'string' ? meta.title : '',
    description: typeof meta.description === 'string' ? meta.description : '',
  }
}

export function mergePageMetaIntoSettings(
  settings: PageSettings,
  meta: PageMeta,
): PageSettings {
  return {
    ...settings,
    meta: {
      ...pageMetaFromPageSettings(settings),
      ...meta,
    },
  }
}
