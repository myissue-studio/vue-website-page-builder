/** Sync wrap clones and rebuild slider CSS for even/odd 2-up layouts. */

import { SLIDER_ARROW_BACK_SVG, SLIDER_ARROW_FORWARD_SVG } from './slider-arrows'

/** Arrows are on by default; only `data-isl-arrows="false"` turns them off. */
export function isSliderArrowsEnabled(container: HTMLElement): boolean {
  return container.getAttribute('data-isl-arrows') !== 'false'
}

export function syncSliderArrows(container: HTMLElement, show: boolean): boolean {
  const existing = Array.from(container.querySelectorAll('.pbx-isl-arrow'))
  const prevHandler = buildSliderArrowOnclickJs(-1)
  const nextHandler = buildSliderArrowOnclickJs(1)

  if (!show) {
    const wasExplicitOff = container.getAttribute('data-isl-arrows') === 'false'
    let changed = false
    if (existing.length > 0) {
      existing.forEach((el) => el.remove())
      changed = true
    }
    if (!wasExplicitOff) {
      container.setAttribute('data-isl-arrows', 'false')
      changed = true
    }
    return changed
  }

  const prev = existing.find((el) => el.classList.contains('pbx-isl-prev')) as HTMLElement | undefined
  const next = existing.find((el) => el.classList.contains('pbx-isl-next')) as HTMLElement | undefined
  const attrOk = container.getAttribute('data-isl-arrows') !== 'false'
  if (prev && next && attrOk) {
    let changed = false
    if (container.getAttribute('data-isl-arrows') === null) {
      container.setAttribute('data-isl-arrows', '')
      changed = true
    }
    if (prev.getAttribute('onclick') !== prevHandler) {
      prev.setAttribute('onclick', prevHandler)
      changed = true
    }
    if (next.getAttribute('onclick') !== nextHandler) {
      next.setAttribute('onclick', nextHandler)
      changed = true
    }
    // Drop any extra arrow nodes.
    existing.forEach((el) => {
      if (el !== prev && el !== next) {
        el.remove()
        changed = true
      }
    })
    return changed
  }

  existing.forEach((el) => el.remove())
  container.setAttribute('data-isl-arrows', '')

  const prevEl = document.createElement('span')
  prevEl.className = 'pbx-isl-arrow pbx-isl-prev'
  prevEl.setAttribute('role', 'button')
  prevEl.setAttribute('aria-label', 'Previous')
  prevEl.innerHTML = SLIDER_ARROW_BACK_SVG
  prevEl.setAttribute('onclick', prevHandler)

  const nextEl = document.createElement('span')
  nextEl.className = 'pbx-isl-arrow pbx-isl-next'
  nextEl.setAttribute('role', 'button')
  nextEl.setAttribute('aria-label', 'Next')
  nextEl.innerHTML = SLIDER_ARROW_FORWARD_SVG
  nextEl.setAttribute('onclick', nextHandler)

  container.appendChild(prevEl)
  container.appendChild(nextEl)
  return true
}

export function buildSliderNavigateJs(
  idxExpr: string,
  options: { clampToPage?: boolean } = {},
): string {
  // Clear sticky inline highlight styles — focus comes from data-isl-active CSS (and auto keyframes in preview).
  const numHl = `var ns=c.querySelectorAll('.pbx-isl-nums span');ns.forEach(function(s){s.style.opacity='';s.style.background='';s.style.color='';s.style.textShadow='';s.style.borderRadius='';s.style.padding='';});`
  const dotHl = `var ds=c.querySelectorAll('.pbx-isl-dot');ds.forEach(function(dot){dot.style.background='';dot.style.width='';});`
  // Page clamp (arrows): keep a full per-view frame. Direct jumps (nums/dots): allow any real slide
  // so e.g. slide 5 of 5 is reachable when editing, including 2-up layouts.
  const clampToPage = options.clampToPage !== false
  const clamp = clampToPage
    ? `var pv=parseInt(c.getAttribute('data-isl-per-view')||'1',10)||1;var hasClones=!!t.querySelector('[data-isl-clone]');var loop=c.getAttribute('data-isl-loop')!=='false';var maxStart=hasClones&&loop?real.length-1:Math.max(0,real.length-pv);if(idx>maxStart)idx=maxStart;`
    : `if(idx>real.length-1)idx=real.length-1;`
  const nav = `var inBuilder=!!c.closest('[data-builder-canvas]');if(c.hasAttribute('data-isl-auto')&&!inBuilder){var sp=parseInt(c.getAttribute('data-isl-speed')||'3',10);var dl=(idx===0?'0':(-idx*sp))+'s';var els=[t].concat(Array.from(c.querySelectorAll('.pbx-isl-dot,.pbx-isl-nums span')));els.forEach(function(el){el.style.animation='none';});t.offsetHeight;els.forEach(function(el){el.style.animation='';el.style.animationDelay=dl;el.style.opacity='';el.style.background='';});}else{t.scrollTo({left:t.children[idx].offsetLeft,behavior:'smooth'});}`
  return `var real=Array.prototype.filter.call(t.children,function(el){return !el.hasAttribute('data-isl-clone');});var idx=${idxExpr};if(idx<0||idx>=real.length)return;${clamp}c.setAttribute('data-isl-active',String(idx));${numHl}${dotHl}${nav}`
}

export function buildSliderOnclickJs(idx: number): string {
  // Do not page-clamp: editors must be able to open/select every image (e.g. #5 of 5).
  return `(function(d,e){e.stopPropagation();var c=d.closest('[data-isl]');var t=c.querySelector('.pbx-isl-t');${buildSliderNavigateJs(String(idx), { clampToPage: false })}var img=t.children[idx]&&t.children[idx].querySelector('img');if(img)img.click();})(this,event)`
}

export function buildSliderArrowOnclickJs(dir: -1 | 1): string {
  // Wrap around the last *full* start index (maxStart), not n.
  // (cur+1)%n breaks 2-up: from last pair it becomes n-1, then clamp keeps you stuck.
  const nextExpr =
    dir === 1
      ? `loop?(cur>=maxStart?0:cur+1):Math.min(maxStart,cur+1)`
      : `loop?(cur<=0?maxStart:cur-1):Math.max(0,cur-1)`
  return `(function(d,e){e.stopPropagation();e.preventDefault();var c=d.closest('[data-isl]');var t=c.querySelector('.pbx-isl-t');if(!t||!t.children.length)return;var real=Array.prototype.filter.call(t.children,function(el){return !el.hasAttribute('data-isl-clone');});var n=real.length;var pv=parseInt(c.getAttribute('data-isl-per-view')||'1',10)||1;var loop=c.getAttribute('data-isl-loop')!=='false';var hasClones=!!t.querySelector('[data-isl-clone]');var maxStart=hasClones&&loop?n-1:Math.max(0,n-pv);var cur=0;var best=Infinity;for(var i=0;i<n;i++){var dist=Math.abs(t.children[i].offsetLeft-t.scrollLeft);if(dist<best){best=dist;cur=i;}}if(c.hasAttribute('data-isl-active')){var active=parseInt(c.getAttribute('data-isl-active')||'0',10);if(!isNaN(active)&&active>=0&&active<=maxStart)cur=active;}var next=${nextExpr};${buildSliderNavigateJs('next', { clampToPage: true })}})(this,event)`
}

/** For 2-up layouts, clone leading slides at the end only when the last page would be incomplete (e.g. 5 → 5+1). */
export function syncSliderWrapClones(track: HTMLElement, perView: number): boolean {
  const before = track.querySelectorAll(':scope > [data-isl-clone]').length
  track.querySelectorAll(':scope > [data-isl-clone]').forEach((el) => el.remove())
  if (perView < 2) return before > 0

  const realSlides = Array.from(track.children).filter(
    (child) => child instanceof HTMLElement && !child.hasAttribute('data-isl-clone'),
  ) as HTMLElement[]
  const remainder = realSlides.length % perView
  if (remainder === 0) return before > 0

  const cloneCount = perView - remainder
  for (let i = 0; i < cloneCount; i += 1) {
    const source = realSlides[i]
    if (!source) continue
    const clone = source.cloneNode(true) as HTMLElement
    clone.setAttribute('data-isl-clone', '')
    clone.setAttribute('aria-hidden', 'true')
    track.appendChild(clone)
  }
  return before !== cloneCount
}

export function buildSliderStyle(
  n: number,
  speed: number = 3,
  perView: number = 1,
  loop: boolean = true,
): string {
  const pv = perView === 2 ? 2 : 1
  const realCount = Math.max(n, pv)
  // Clone only when the last page would be short (e.g. 5 images → clone 1).
  const remainder = pv > 1 ? realCount % pv : 0
  const cloneCount = remainder === 0 ? 0 : pv - remainder
  const trackSlideCount = realCount + cloneCount
  // Full pages only when there are no wrap clones. With clones + loop, include last+first.
  const fullPageStarts = Math.max(1, realCount - pv + 1)
  const starts = cloneCount > 0 ? (loop ? realCount : fullPageStarts) : fullPageStarts

  const T = starts * speed
  const step = 100 / starts
  const hold = Math.max(step - 3, 1)
  const trackW = (trackSlideCount / pv) * 100
  const slideW = (100 / trackSlideCount).toFixed(3)

  // Track keyframes — translate by one slide width of the track each step
  let trackKf = `@keyframes pbx-isl-r{0%,${hold.toFixed(3)}%{transform:translateX(0)}`
  for (let i = 1; i < starts; i++) {
    const tx = -((100 * i) / trackSlideCount).toFixed(3)
    const s = (i * step).toFixed(3)
    const e2 = (i * step + hold).toFixed(3)
    trackKf += `${s}%,${e2}%{transform:translateX(${tx}%)}`
  }
  if (loop) {
    trackKf += `99%,100%{transform:translateX(0)}}`
  } else {
    const lastTx = -((100 * (starts - 1)) / trackSlideCount).toFixed(3)
    trackKf += `99%,100%{transform:translateX(${lastTx}%)}}`
  }

  // Per-dot keyframes + rules (sync size/background with track timing)
  const dotDim = 'width:0.45rem;background:rgba(255,255,255,0.45)'
  const dotOn = 'width:1.15rem;background:#fff'
  let dotKfs = ''
  let dotRules = ''
  for (let i = 0; i < realCount; i++) {
    const aStart = (i * step).toFixed(3)
    const aEnd = (i * step + hold).toFixed(3)
    const afterEnd = Math.min((i + 1) * step, 100).toFixed(3)
    if (i === 0) {
      dotKfs += `@keyframes pbx-isl-da-${i}{0%,${aEnd}%{${dotOn}}${afterEnd}%,100%{${dotDim}}}`
    } else if (i < starts) {
      const before = (i * step - 0.001).toFixed(3)
      dotKfs += `@keyframes pbx-isl-da-${i}{0%,${before}%{${dotDim}}${aStart}%,${aEnd}%{${dotOn}}${afterEnd}%,100%{${dotDim}}}`
    } else {
      dotKfs += `@keyframes pbx-isl-da-${i}{0%,100%{${dotDim}}}`
    }
    const iter = loop ? 'infinite' : '1 forwards'
    dotRules += `[data-isl][data-isl-auto] .pbx-isl-dot:nth-child(${i + 1}){animation:pbx-isl-da-${i} ${T}s ${iter}}`
  }

  // Per-num keyframes + rules (canvas editor highlight; mirrors dot active/idle)
  const numDim = 'opacity:1;background:transparent;color:rgba(255,255,255,0.7)'
  const numOn = 'opacity:1;background:#fff;color:#111'
  let numKfs = ''
  let numRules = ''
  for (let i = 0; i < realCount; i++) {
    const aStart = (i * step).toFixed(3)
    const aEnd = (i * step + hold).toFixed(3)
    const afterEnd = Math.min((i + 1) * step, 100).toFixed(3)
    if (i === 0) {
      numKfs += `@keyframes pbx-isl-na-${i}{0%,${aEnd}%{${numOn}}${afterEnd}%,100%{${numDim}}}`
    } else if (i < starts) {
      const before = (i * step - 0.001).toFixed(3)
      numKfs += `@keyframes pbx-isl-na-${i}{0%,${before}%{${numDim}}${aStart}%,${aEnd}%{${numOn}}${afterEnd}%,100%{${numDim}}}`
    } else {
      numKfs += `@keyframes pbx-isl-na-${i}{0%,100%{${numDim}}}`
    }
    const iter = loop ? 'infinite' : '1 forwards'
    numRules += `[data-isl][data-isl-auto] .pbx-isl-nums span:nth-child(${i + 1}){animation:pbx-isl-na-${i} ${T}s ${iter}}`
  }

  // Builder active-slide rules (manual mode). Auto preview uses keyframe animations instead.
  let activeNumRules = ''
  let activeDotRules = ''
  for (let i = 0; i < realCount; i++) {
    if (i > 0) {
      activeNumRules += ','
      activeDotRules += ','
    }
    activeNumRules += `[data-isl]:not([data-isl-auto])[data-isl-active="${i}"] .pbx-isl-nums span:nth-child(${i + 1})`
    activeDotRules += `[data-isl]:not([data-isl-auto])[data-isl-active="${i}"] .pbx-isl-dot:nth-child(${i + 1})`
  }
  activeNumRules += '{opacity:1;background:#fff;color:#111;text-shadow:none}'
  activeDotRules += '{width:1.15rem;background:#fff}'

  const defaultFirstNum =
    '[data-isl]:not([data-isl-auto]):not([data-isl-active]) .pbx-isl-nums span:first-child{opacity:1;background:#fff;color:#111;text-shadow:none}'
  const defaultFirstDot =
    '[data-isl]:not([data-isl-auto]):not([data-isl-active]) .pbx-isl-dot:first-child{width:1.15rem;background:#fff}'

  // Editor canvas: data-isl-active drives highlight (auto keyframes are disabled on canvas).
  let canvasActiveNumRules = ''
  let canvasActiveDotRules = ''
  for (let i = 0; i < realCount; i++) {
    if (i > 0) {
      canvasActiveNumRules += ','
      canvasActiveDotRules += ','
    }
    canvasActiveNumRules += `[data-builder-canvas] [data-isl][data-isl-active="${i}"] .pbx-isl-nums span:nth-child(${i + 1})`
    canvasActiveDotRules += `[data-builder-canvas] [data-isl][data-isl-active="${i}"] .pbx-isl-dot:nth-child(${i + 1})`
  }
  canvasActiveNumRules +=
    '{opacity:1!important;background:#fff!important;color:#111!important;text-shadow:none!important}'
  canvasActiveDotRules += '{width:1.15rem!important;background:#fff!important}'

  const canvasDefaultFirst =
    '[data-builder-canvas] [data-isl]:not([data-isl-active]) .pbx-isl-nums span:first-child{opacity:1!important;background:#fff!important;color:#111!important;text-shadow:none!important}'
  const canvasDefaultFirstDot =
    '[data-builder-canvas] [data-isl]:not([data-isl-active]) .pbx-isl-dot:first-child{width:1.15rem!important;background:#fff!important}'
  const canvasDimOthers =
    '[data-builder-canvas] [data-isl][data-isl-active] .pbx-isl-nums span{opacity:1!important;background:transparent!important;color:rgba(255,255,255,0.7)!important;text-shadow:none!important}'
  const canvasDimDots =
    '[data-builder-canvas] [data-isl][data-isl-active] .pbx-isl-dot{width:0.45rem!important;background:rgba(255,255,255,0.45)!important}'

  const animIter = loop ? 'infinite' : '1 forwards'
  // Grid (not flex): % columns resolve against the visible track width. Flex % min-width
  // inside overflow-x:auto often circular-resolves to the image intrinsic width (= 1-up).
  // Desktop 2-up: 50%. Mobile 2-up: peek ~85% so the active slide stays large.
  const mobile2UpPeek = 85
  const colPct = pv === 2 ? '50%' : '90%'
  const multiViewStyles =
    pv === 2
      ? [
          '[data-isl][data-isl-per-view="2"] .pbx-isl-t{grid-auto-columns:50%!important}',
          '[data-isl][data-isl-per-view="2"] .pbx-isl-t>div{box-sizing:border-box!important;min-width:0!important;width:auto!important;max-width:none!important;padding-inline:0.4rem}',
          '[data-isl][data-isl-per-view="2"] .pbx-isl-t>div img{width:100%!important;border-radius:0.75rem;overflow:hidden}',
          `@media (max-width:767px){[data-isl][data-isl-per-view="2"] .pbx-isl-t{grid-auto-columns:${mobile2UpPeek}%!important}[data-isl][data-isl-per-view="2"] .pbx-isl-t>div{padding-inline:0.35rem}}`,
        ].join('')
      : [
          '[data-isl][data-isl-per-view="1"] .pbx-isl-t{grid-auto-columns:90%!important}',
          '[data-isl][data-isl-per-view="1"] .pbx-isl-t>div{box-sizing:border-box!important;min-width:0!important;width:auto!important;max-width:none!important;padding-inline:0.35rem}',
          '[data-isl][data-isl-per-view="1"] .pbx-isl-t>div img{width:100%!important;border-radius:0.75rem;overflow:hidden}',
        ].join('')

  const arrowStyles = [
    '.pbx-isl-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:11;width:2.5rem;height:2.5rem;border-radius:9999px;background:rgba(255,255,255,0.4);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;cursor:pointer;border:0;color:#111;box-shadow:0 1px 4px rgba(0,0,0,0.12);user-select:none}',
    '[data-isl][data-isl-arrows]:not([data-isl-arrows="false"]) .pbx-isl-arrow{display:flex}',
    '.pbx-isl-prev{left:0.75rem}',
    '.pbx-isl-next{right:0.75rem}',
    '.pbx-isl-arrow svg{display:block;flex-shrink:0}',
    '[data-builder-canvas] .pbx-isl-arrow{pointer-events:auto;z-index:20}',
  ].join('')

  // Auto-rotate: widen the track; column % is of that track so 2-up stays half the viewport.
  const peekPct = 90
  const autoTrackW = pv === 1 ? trackSlideCount * peekPct : trackW
  const autoTrackMobile2Up = trackSlideCount * mobile2UpPeek
  const autoTrackDesktop = `[data-isl][data-isl-auto] .pbx-isl-t{overflow:hidden!important;scroll-snap-type:none!important;width:${autoTrackW}%!important;animation:pbx-isl-r ${T}s ${animIter};pointer-events:none}`
  const autoSlideDesktop =
    pv === 2
      ? `[data-isl][data-isl-auto][data-isl-per-view="2"] .pbx-isl-t{grid-auto-columns:${slideW}%!important}`
      : `[data-isl][data-isl-auto][data-isl-per-view="1"] .pbx-isl-t{grid-auto-columns:${slideW}%!important}`
  const autoMobile2Up =
    pv === 2
      ? `@media (max-width:767px){[data-isl][data-isl-auto][data-isl-per-view="2"] .pbx-isl-t{width:${autoTrackMobile2Up}%!important;grid-auto-columns:${slideW}%!important}}`
      : ''
  // Canvas forces track to 100% while editing — keep viewport columns at 50%/90% (mobile 2-up peeks).
  const canvasManualForce =
    pv === 2
      ? [
          '[data-builder-canvas] [data-isl][data-isl-per-view="2"] .pbx-isl-t,[data-builder-canvas] [data-isl][data-isl-auto][data-isl-per-view="2"] .pbx-isl-t{grid-auto-columns:50%!important}',
          `@media (max-width:767px){[data-builder-canvas] [data-isl][data-isl-per-view="2"] .pbx-isl-t,[data-builder-canvas] [data-isl][data-isl-auto][data-isl-per-view="2"] .pbx-isl-t{grid-auto-columns:${mobile2UpPeek}%!important}}`,
        ].join('')
      : '[data-builder-canvas] [data-isl][data-isl-per-view="1"] .pbx-isl-t,[data-builder-canvas] [data-isl][data-isl-auto][data-isl-per-view="1"] .pbx-isl-t{grid-auto-columns:90%!important}'

  return [
    `.pbx-isl-t{display:grid;grid-auto-flow:column;grid-auto-columns:${colPct};overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;width:100%}`,
    '.pbx-isl-t::-webkit-scrollbar{display:none}',
    '.pbx-isl-t>div{min-width:0;width:auto;max-width:none;scroll-snap-align:start;box-sizing:border-box}',
    multiViewStyles,
    arrowStyles,
    trackKf,
    autoTrackDesktop,
    autoSlideDesktop,
    autoMobile2Up,
    canvasManualForce,
    // Frosted pill behind dots so they read as one control (esp. when centered in the 2-up gap).
    '.pbx-isl-dots{display:flex;align-items:center;justify-content:center;gap:0.6rem;padding:8px 10px;border-radius:10px;background:rgba(128,128,128,0.08);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-sizing:border-box}',
    '.pbx-isl-dot{display:block;flex-shrink:0;width:0.45rem;height:0.45rem;border-radius:9999px;background:rgba(255,255,255,0.45);cursor:pointer;transition:width 0.2s ease,background 0.2s ease;box-sizing:border-box}',
    // Number chips: editor-only index strip, same frosted chip language as dots.
    '.pbx-isl-nums{display:none;align-items:center;justify-content:center;gap:0.35rem;margin-bottom:0.5rem;padding:6px 8px;border-radius:10px;background:rgba(128,128,128,0.08);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-sizing:border-box;font-family:Jost,Helvetica,Arial,sans-serif}',
    '[data-builder-canvas] .pbx-isl-nums{display:flex}',
    '.pbx-isl-nums span{font-family:inherit;font-size:0.75rem;font-weight:600;line-height:1;color:rgba(255,255,255,0.7);text-shadow:none;cursor:pointer;min-width:1.35rem;height:1.35rem;padding:0 0.35rem;text-align:center;background:transparent;border-radius:9999px;opacity:1;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;transition:background 0.2s ease,color 0.2s ease}',
    defaultFirstNum,
    defaultFirstDot,
    activeNumRules,
    activeDotRules,
    canvasDefaultFirst,
    canvasDefaultFirstDot,
    canvasDimOthers,
    canvasDimDots,
    canvasActiveNumRules,
    canvasActiveDotRules,
    dotKfs,
    dotRules,
    numKfs,
    numRules,
  ].join('')
}

/**
 * Fix wrap clones + matching CSS for every slider in `root`.
 * Removes leftover clones on even counts (which left the last image alone).
 */
export function normalizeSliderWrapClones(root: ParentNode): boolean {
  let changed = false

  root.querySelectorAll<HTMLElement>('[data-isl]').forEach((container) => {
    const track = container.querySelector('.pbx-isl-t') as HTMLElement | null
    if (!track) return

    const perViewRaw = parseInt(container.getAttribute('data-isl-per-view') || '1', 10)
    const perView = perViewRaw === 2 ? 2 : 1
    if (syncSliderWrapClones(track, perView)) changed = true

    // Drop sticky inline slide widths — grid-auto-columns owns sizing (flex % was unreliable).
    Array.from(track.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return
      const before = child.getAttribute('style')
      if (!before) return
      child.style.minWidth = ''
      child.style.width = ''
      child.style.maxWidth = ''
      child.style.flex = ''
      child.style.flexShrink = ''
      const after = child.getAttribute('style')?.trim() ?? ''
      if (!after) {
        child.removeAttribute('style')
        changed = true
      } else if (after !== before.trim()) {
        changed = true
      }
    })

    // Drop sticky inline focus styles — highlight is driven by data-isl-active / auto keyframes.
    container.querySelectorAll<HTMLElement>('.pbx-isl-nums span, .pbx-isl-dot').forEach((el) => {
      if (el.getAttribute('style')) {
        el.removeAttribute('style')
        changed = true
      }
    })

    // Ensure dots sit in a frosted pill wrapper (class may be missing on older saves).
    const numsEl = container.querySelector('.pbx-isl-nums')
    const dotsWrap = numsEl?.nextElementSibling as HTMLElement | null
    if (dotsWrap && dotsWrap.querySelector('.pbx-isl-dot')) {
      if (!dotsWrap.classList.contains('pbx-isl-dots')) {
        dotsWrap.classList.add('pbx-isl-dots')
        changed = true
      }
    }

    // Default: show arrows unless explicitly disabled.
    if (syncSliderArrows(container, isSliderArrowsEnabled(container))) changed = true

    // Keep num/dot clicks in sync with current navigate helper.
    container.querySelectorAll<HTMLElement>('.pbx-isl-nums span').forEach((span, i) => {
      const handler = buildSliderOnclickJs(i)
      if (span.getAttribute('onclick') !== handler) {
        span.setAttribute('onclick', handler)
        changed = true
      }
    })
    container.querySelectorAll<HTMLElement>('.pbx-isl-dot').forEach((dot, i) => {
      const handler = buildSliderOnclickJs(i)
      if (dot.getAttribute('onclick') !== handler) {
        dot.setAttribute('onclick', handler)
        changed = true
      }
    })

    const realCount = Array.from(track.children).filter(
      (child) => !child.hasAttribute('data-isl-clone'),
    ).length
    if (realCount < 1) return

    const speed = parseInt(container.getAttribute('data-isl-speed') || '3', 10) || 3
    const loop = container.getAttribute('data-isl-loop') !== 'false'
    const section = container.closest('section')
    const styleTag = section?.querySelector('style')
    if (styleTag) {
      const next = buildSliderStyle(realCount, speed, perView, loop)
      if (styleTag.textContent !== next) {
        styleTag.textContent = next
        changed = true
      }
    }
  })

  return changed
}

export type InlineSliderViewportSnapshot = {
  componentId: string
  sliderOrdinal: number
  active: string | null
  scrollLeft: number
}

/** Remember which slide is visible before a v-html remount resets scrollLeft. */
export function captureInlineSliderViewports(root: ParentNode): InlineSliderViewportSnapshot[] {
  const snaps: InlineSliderViewportSnapshot[] = []

  root.querySelectorAll<HTMLElement>('section[data-componentid]').forEach((section) => {
    const componentId = section.getAttribute('data-componentid')
    if (!componentId) return

    section.querySelectorAll<HTMLElement>('[data-isl]').forEach((container, sliderOrdinal) => {
      const track = container.querySelector('.pbx-isl-t') as HTMLElement | null
      if (!track) return
      snaps.push({
        componentId,
        sliderOrdinal,
        active: container.getAttribute('data-isl-active'),
        scrollLeft: track.scrollLeft,
      })
    })
  })

  return snaps
}

/** Restore slide position/highlight after canvas remount from store. */
export function restoreInlineSliderViewports(
  root: ParentNode,
  snaps: InlineSliderViewportSnapshot[],
): void {
  for (const snap of snaps) {
    const section = Array.from(root.querySelectorAll<HTMLElement>('section[data-componentid]')).find(
      (el) => el.getAttribute('data-componentid') === snap.componentId,
    )
    if (!section) continue

    const container = section.querySelectorAll<HTMLElement>('[data-isl]')[snap.sliderOrdinal]
    if (!container) continue

    const track = container.querySelector('.pbx-isl-t') as HTMLElement | null
    if (!track) continue

    if (snap.active !== null) {
      container.setAttribute('data-isl-active', snap.active)
    }

    const activeIdx = snap.active != null ? parseInt(snap.active, 10) : NaN
    const targetSlide =
      !isNaN(activeIdx) && activeIdx >= 0
        ? (track.children[activeIdx] as HTMLElement | undefined)
        : undefined

    // Force layout so offsetLeft is correct after v-html remount (otherwise all are 0).
    void track.offsetWidth

    if (targetSlide) {
      track.scrollLeft = targetSlide.offsetLeft
    } else {
      track.scrollLeft = snap.scrollLeft
    }
  }
}

/** Run restore after the browser has laid out remounted slider slides. */
export function restoreInlineSliderViewportsAfterLayout(
  root: ParentNode,
  snaps: InlineSliderViewportSnapshot[],
): Promise<void> {
  if (!snaps.length) return Promise.resolve()
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        restoreInlineSliderViewports(root, snaps)
        resolve()
      })
    })
  })
}

/**
 * If `el` is a slider image (or wraps one), set data-isl-active to that slide
 * so remounts can restore the same viewport.
 */
export function pinSliderActiveFromElement(el: HTMLElement | null | undefined): number | null {
  if (!el) return null

  const img =
    el.tagName === 'IMG'
      ? (el as HTMLImageElement)
      : (el.querySelector('img') as HTMLImageElement | null)
  if (!img) return null

  const container = img.closest('[data-isl]') as HTMLElement | null
  const track = container?.querySelector('.pbx-isl-t') as HTMLElement | null
  if (!container || !track) return null

  const slide = Array.from(track.children).find(
    (child) => child instanceof HTMLElement && child.contains(img),
  ) as HTMLElement | undefined
  if (!slide || slide.hasAttribute('data-isl-clone')) return null

  const realSlides = Array.from(track.children).filter(
    (child) => !child.hasAttribute('data-isl-clone'),
  )
  const idx = realSlides.indexOf(slide)
  if (idx < 0) return null

  container.setAttribute('data-isl-active', String(idx))
  track.scrollLeft = slide.offsetLeft
  return idx
}
