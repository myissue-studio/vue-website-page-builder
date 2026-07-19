/** Inline SVG chevrons — no Material Symbols font / class-prefix dependency. */
export const SLIDER_ARROW_BACK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15.5 19L8.5 12L15.5 5" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>'

export const SLIDER_ARROW_FORWARD_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.5 5L15.5 12L8.5 19" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>'

function isMaterialArrowGlyph(el: Element): boolean {
  const text = (el.textContent || '').replace(/\s+/g, '')
  return text === 'arrow_back' || text === 'arrow_forward'
}

/**
 * Replace Material Symbol text glyphs inside slider arrows with SVG chevrons.
 * Needed because Tailwind class-prefixing turns `material-symbols-outlined` into
 * `pbx-material-symbols-outlined`, which breaks the icon font.
 * @returns true if any DOM nodes were updated
 */
export function migrateSliderArrowIcons(root: ParentNode): boolean {
  let changed = false

  root.querySelectorAll<HTMLElement>('.pbx-isl-arrow').forEach((arrow) => {
    const hasSvg = Boolean(arrow.querySelector('svg'))
    if (hasSvg && !isMaterialArrowGlyph(arrow)) return

    const isPrev =
      arrow.classList.contains('pbx-isl-prev') ||
      (arrow.getAttribute('aria-label') || '').toLowerCase().includes('prev')

    arrow.innerHTML = isPrev ? SLIDER_ARROW_BACK_SVG : SLIDER_ARROW_FORWARD_SVG
    changed = true
  })

  // Orphan glyph spans left from older markup (class-prefixed icon font).
  root.querySelectorAll<HTMLElement>('[data-isl] span').forEach((span) => {
    if (span.classList.contains('pbx-isl-arrow')) return
    if (!isMaterialArrowGlyph(span)) return
    if (!span.closest('.pbx-isl-arrow') && !span.closest('[data-isl-arrows]')) return

    const parent = span.closest('.pbx-isl-arrow') as HTMLElement | null
    if (parent) {
      const isPrev =
        parent.classList.contains('pbx-isl-prev') ||
        (parent.getAttribute('aria-label') || '').toLowerCase().includes('prev')
      parent.innerHTML = isPrev ? SLIDER_ARROW_BACK_SVG : SLIDER_ARROW_FORWARD_SVG
      changed = true
      return
    }

    const text = (span.textContent || '').replace(/\s+/g, '')
    span.innerHTML = text === 'arrow_back' ? SLIDER_ARROW_BACK_SVG : SLIDER_ARROW_FORWARD_SVG
    span.classList.remove('material-symbols-outlined', 'pbx-material-symbols-outlined')
    changed = true
  })

  return changed
}
