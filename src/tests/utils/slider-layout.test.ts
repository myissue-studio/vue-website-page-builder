// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import {
  buildSliderArrowOnclickJs,
  buildSliderOnclickJs,
  buildSliderStyle,
  captureInlineSliderViewports,
  isSliderArrowsEnabled,
  normalizeSliderWrapClones,
  pinSliderActiveFromElement,
  restoreInlineSliderViewports,
  syncSliderArrows,
  syncSliderWrapClones,
} from '../../utils/builder/slider-layout'

describe('slider-layout', () => {
  it('does not clone when slide count divides evenly by perView', () => {
    const track = document.createElement('div')
    for (let i = 0; i < 4; i += 1) {
      const slide = document.createElement('div')
      slide.textContent = `slide-${i + 1}`
      track.appendChild(slide)
    }

    syncSliderWrapClones(track, 2)

    expect(track.children.length).toBe(4)
    expect(track.querySelectorAll('[data-isl-clone]').length).toBe(0)
  })

  it('clones leading slides when count is odd for 2-up', () => {
    const track = document.createElement('div')
    for (let i = 0; i < 5; i += 1) {
      const slide = document.createElement('div')
      slide.textContent = `slide-${i + 1}`
      track.appendChild(slide)
    }

    syncSliderWrapClones(track, 2)

    expect(track.children.length).toBe(6)
    expect(track.querySelectorAll('[data-isl-clone]').length).toBe(1)
    expect(track.lastElementChild?.textContent).toBe('slide-1')
  })

  it('strips leftover clones on even counts and rebuilds style', () => {
    const section = document.createElement('section')
    const style = document.createElement('style')
    style.textContent = 'old'
    section.appendChild(style)

    const container = document.createElement('div')
    container.setAttribute('data-isl', '')
    container.setAttribute('data-isl-per-view', '2')
    container.setAttribute('data-isl-speed', '3')
    container.setAttribute('data-isl-loop', 'true')

    const track = document.createElement('div')
    track.className = 'pbx-isl-t'
    for (let i = 0; i < 4; i += 1) {
      track.appendChild(document.createElement('div'))
    }
    const clone = document.createElement('div')
    clone.setAttribute('data-isl-clone', '')
    track.appendChild(clone)

    container.appendChild(track)
    section.appendChild(container)

    expect(normalizeSliderWrapClones(section)).toBe(true)
    expect(track.querySelectorAll('[data-isl-clone]').length).toBe(0)
    expect(style.textContent).toContain('min-width:80%')
    expect(style.textContent).toContain('@media (min-width:1024px)')
    expect(style.textContent).toContain('min-width:50%')
    // 4 slides, no clones → track width 200% for auto (4/2*100)
    expect(style.textContent).toContain('width:200%!important')
  })

  it('buildSliderStyle uses full-page starts for even 2-up counts', () => {
    const css = buildSliderStyle(4, 3, 2, true)
    // 3 starts (0,1,2) × 3s = 9s — not 4 starts which would leave last image alone
    expect(css).toContain('animation:pbx-isl-r 9s infinite')
    expect(css).toContain('width:200%!important')
    expect(css).toContain('font-family:Jost')
    expect(css).toContain('min-width:80%')
    expect(css).toContain('@media (min-width:1024px)')
    expect(css).toContain('.pbx-isl-dots{display:flex')
    expect(css).toContain('background:rgba(128,128,128,0.08)')
    expect(css).toContain('width:1.15rem;background:#fff')
    expect(css).toContain('[data-builder-canvas] .pbx-isl-nums{display:flex}')
  })

  it('arrow next from last start wraps to 0 when loop is on', () => {
    const js = buildSliderArrowOnclickJs(1)
    expect(js).toContain('cur>=maxStart?0:cur+1')
    expect(js).not.toContain('(cur+1)%n')
  })

  it('arrow prev from first start wraps to maxStart when loop is on', () => {
    const js = buildSliderArrowOnclickJs(-1)
    expect(js).toContain('cur<=0?maxStart:cur-1')
  })

  it('number/dot jumps do not page-clamp so the last slide stays reachable', () => {
    const js = buildSliderOnclickJs(4)
    expect(js).toContain('if(idx>real.length-1)idx=real.length-1')
    expect(js).not.toContain('real.length-pv')
  })

  it('enables arrows by default when data-isl-arrows is missing', () => {
    const container = document.createElement('div')
    container.setAttribute('data-isl', '')
    expect(isSliderArrowsEnabled(container)).toBe(true)
    expect(syncSliderArrows(container, true)).toBe(true)
    expect(container.querySelectorAll('.pbx-isl-arrow').length).toBe(2)
    expect(container.getAttribute('data-isl-arrows')).not.toBe('false')
  })

  it('keeps arrows off when data-isl-arrows is false', () => {
    const container = document.createElement('div')
    container.setAttribute('data-isl', '')
    container.setAttribute('data-isl-arrows', 'false')
    expect(isSliderArrowsEnabled(container)).toBe(false)
    expect(syncSliderArrows(container, false)).toBe(false)
    expect(container.querySelectorAll('.pbx-isl-arrow').length).toBe(0)
  })

  it('pinSliderActiveFromElement records the slide containing the image', () => {
    const container = document.createElement('div')
    container.setAttribute('data-isl', '')
    const track = document.createElement('div')
    track.className = 'pbx-isl-t'
    const slides: HTMLElement[] = []
    for (let i = 0; i < 5; i += 1) {
      const slide = document.createElement('div')
      const img = document.createElement('img')
      img.src = `https://example.com/${i + 1}.jpg`
      slide.appendChild(img)
      track.appendChild(slide)
      slides.push(slide)
    }
    container.appendChild(track)

    const idx = pinSliderActiveFromElement(slides[4].querySelector('img') as HTMLElement)
    expect(idx).toBe(4)
    expect(container.getAttribute('data-isl-active')).toBe('4')
  })

  it('restoreInlineSliderViewports reapplies active slide after remount', () => {
    const root = document.createElement('div')
    const section = document.createElement('section')
    section.setAttribute('data-componentid', 'sec-1')
    const container = document.createElement('div')
    container.setAttribute('data-isl', '')
    container.setAttribute('data-isl-active', '3')
    const track = document.createElement('div')
    track.className = 'pbx-isl-t'
    for (let i = 0; i < 5; i += 1) {
      const slide = document.createElement('div')
      Object.defineProperty(slide, 'offsetLeft', { configurable: true, get: () => i * 100 })
      track.appendChild(slide)
    }
    container.appendChild(track)
    section.appendChild(container)
    root.appendChild(section)

    const snaps = captureInlineSliderViewports(root)
    expect(snaps).toHaveLength(1)
    expect(snaps[0].active).toBe('3')

    container.removeAttribute('data-isl-active')
    track.scrollLeft = 0
    restoreInlineSliderViewports(root, snaps)

    expect(container.getAttribute('data-isl-active')).toBe('3')
    expect(track.scrollLeft).toBe(300)
  })
})
