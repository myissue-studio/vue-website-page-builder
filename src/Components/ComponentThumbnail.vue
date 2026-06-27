<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import tailwindCSS from '../css/style.css?inline'
import ElementLoader from './Loaders/ElementLoader.vue'

const props = withDefaults(
  defineProps<{
    htmlCode: string
    containerHeight?: number
    renderWidth?: number
    /** Maximum visual height in px. Thumbnails taller than this are clipped
     *  at the bottom (cover-style). Shorter ones show fully. */
    maxHeight?: number
    /** 'cover': fill container width, clip vertically.
     *  'contain' (default): grow container to show the full component at a
     *  consistent zoom level. Content is never clipped beyond maxHeight. */
    fit?: 'cover' | 'contain'
  }>(),
  {
    containerHeight: 256,
    renderWidth: 1280,
    maxHeight: 380,
    fit: 'contain',
  },
)

// Measured pixel width of the outer container element (updated by ResizeObserver).
// Starts at a reasonable guess so the iframe isn't invisible on first paint.
const containerWidth = ref(320)

// Scale is width-driven: the iframe renders at renderWidth and is scaled down
// to the actual container width.
const scale = computed(() => containerWidth.value / props.renderWidth)

// For 'contain' fit: measure the rendered content height, then grow the
// container to fit everything at the current scale, capped at maxHeight.
const adaptiveHeight = ref<number | null>(null)

// Placeholder height shown while the iframe is still measuring content.
// Keeps the loader centred regardless of the maxHeight cap.
const LOADING_HEIGHT = 260

const displayHeight = computed(() => {
  if (props.fit === 'contain' && adaptiveHeight.value !== null) {
    return Math.min(adaptiveHeight.value, props.maxHeight)
  }
  // cover mode OR still measuring: use a fixed height so the loader is visible
  return props.fit === 'cover' ? props.containerHeight : LOADING_HEIGHT
})

// During the measurement phase use a tall initial iframe so the content
// renders fully before we read scrollHeight.
const iframeHeight = computed(() =>
  props.fit === 'contain' && adaptiveHeight.value === null
    ? 8192
    : Math.ceil(displayHeight.value / scale.value),
)

const isVisible = ref(false)
const isLoaded = ref(false)

// Re-measure content height when container width changes (e.g. panel resize).
watch(containerWidth, () => {
  if (props.fit === 'contain') {
    adaptiveHeight.value = null
    isLoaded.value = false
  }
})

// Component HTML is authored for both the pbx-prefixed library CSS AND the
// consuming app's non-prefixed Tailwind CSS. The inlined style.css only has
// pbx- classes, so we inject a compact set of the most-used non-prefixed
// utilities here so layouts (grid, flex, aspect-ratio, etc.) render correctly.
// Body font-family defaults to Jost so text matches the live canvas.
const BASE_CSS = String.raw`*,*::before,*::after{box-sizing:border-box}body{margin:0;padding:0;font-family:'Jost',sans-serif}img{max-width:100%;display:block}section{display:block}.grid{display:grid}.flex{display:flex}.inline-flex{display:inline-flex}.block{display:block}.hidden{display:none}.flex-col{flex-direction:column}.flex-row{flex-direction:row}.flex-row-reverse{flex-direction:row-reverse}.flex-wrap{flex-wrap:wrap}.flex-1{flex:1 1 0%}.flex-auto{flex:1 1 auto}.flex-none{flex:none}.shrink-0{flex-shrink:0}.grow{flex-grow:1}.items-start{align-items:flex-start}.items-center{align-items:center}.items-end{align-items:flex-end}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.justify-end{justify-content:flex-end}.self-center{align-self:center}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.col-span-1{grid-column:span 1/span 1}.col-span-2{grid-column:span 2/span 2}.col-span-3{grid-column:span 3/span 3}.gap-0{gap:0}.gap-1{gap:.25rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}.gap-10{gap:2.5rem}.gap-12{gap:3rem}.gap-x-4{column-gap:1rem}.gap-y-4{row-gap:1rem}.myPrimaryGap{gap:1rem}.space-y-2>*+*{margin-top:.5rem}.space-y-4>*+*{margin-top:1rem}.space-x-2>*+*{margin-left:.5rem}.space-x-4>*+*{margin-left:1rem}.w-full{width:100%}.w-auto{width:auto}.w-1\/2{width:50%}.w-1\/3{width:33.333%}.w-2\/3{width:66.666%}.min-w-0{min-width:0}.max-w-full{max-width:100%}.max-w-xs{max-width:20rem}.max-w-sm{max-width:24rem}.max-w-md{max-width:28rem}.max-w-lg{max-width:32rem}.max-w-xl{max-width:36rem}.max-w-2xl{max-width:42rem}.max-w-3xl{max-width:48rem}.max-w-4xl{max-width:56rem}.max-w-5xl{max-width:64rem}.max-w-6xl{max-width:72rem}.max-w-7xl{max-width:80rem}.mx-auto{margin-left:auto;margin-right:auto}.my-0{margin-top:0;margin-bottom:0}.my-2{margin-top:.5rem;margin-bottom:.5rem}.my-4{margin-top:1rem;margin-bottom:1rem}.my-8{margin-top:2rem;margin-bottom:2rem}.mt-0{margin-top:0}.mt-1{margin-top:.25rem}.mt-2{margin-top:.5rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.mt-8{margin-top:2rem}.mt-12{margin-top:3rem}.mb-0{margin-bottom:0}.mb-1{margin-bottom:.25rem}.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.ml-auto{margin-left:auto}.mr-auto{margin-right:auto}.h-full{height:100%}.h-auto{height:auto}.h-screen{height:100vh}.h-4{height:1rem}.h-6{height:1.5rem}.h-8{height:2rem}.h-10{height:2.5rem}.h-12{height:3rem}.h-16{height:4rem}.h-20{height:5rem}.h-24{height:6rem}.h-32{height:8rem}.h-40{height:10rem}.h-48{height:12rem}.h-64{height:16rem}.min-h-0{min-height:0}.min-h-full{min-height:100%}.min-h-screen{min-height:100vh}.p-0{padding:0}.p-1{padding:.25rem}.p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-6{padding:1.5rem}.p-8{padding:2rem}.px-0{padding-left:0;padding-right:0}.px-1{padding-left:.25rem;padding-right:.25rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.px-8{padding-left:2rem;padding-right:2rem}.py-0{padding-top:0;padding-bottom:0}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-4{padding-top:1rem;padding-bottom:1rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.py-8{padding-top:2rem;padding-bottom:2rem}.py-12{padding-top:3rem;padding-bottom:3rem}.py-16{padding-top:4rem;padding-bottom:4rem}.py-20{padding-top:5rem;padding-bottom:5rem}.py-24{padding-top:6rem;padding-bottom:6rem}.py-28{padding-top:7rem;padding-bottom:7rem}.pt-0{padding-top:0}.pt-2{padding-top:.5rem}.pt-4{padding-top:1rem}.pt-6{padding-top:1.5rem}.pt-8{padding-top:2rem}.pt-12{padding-top:3rem}.pt-16{padding-top:4rem}.pt-20{padding-top:5rem}.pb-0{padding-bottom:0}.pb-2{padding-bottom:.5rem}.pb-4{padding-bottom:1rem}.pb-6{padding-bottom:1.5rem}.pb-8{padding-bottom:2rem}.pb-12{padding-bottom:3rem}.pb-16{padding-bottom:4rem}.pb-20{padding-bottom:5rem}.object-cover{object-fit:cover}.object-contain{object-fit:contain}.object-fill{object-fit:fill}.object-top{object-position:top}.object-center{object-position:center}.object-bottom{object-position:bottom}.aspect-square{aspect-ratio:1/1}.aspect-video{aspect-ratio:16/9}.aspect-\[9\/16\]{aspect-ratio:9/16}.aspect-\[4\/3\]{aspect-ratio:4/3}.aspect-\[3\/4\]{aspect-ratio:3/4}.aspect-\[3\/2\]{aspect-ratio:3/2}.aspect-\[2\/3\]{aspect-ratio:2/3}.aspect-\[2\/1\]{aspect-ratio:2/1}.aspect-\[1\/2\]{aspect-ratio:1/2}.overflow-hidden{overflow:hidden}.overflow-auto{overflow:auto}.font-sans{font-family:'Jost',sans-serif}.font-serif{font-family:Georgia,serif}.text-xs{font-size:.75rem;line-height:1rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-5xl{font-size:3rem;line-height:1}.font-light{font-weight:300}.font-normal{font-weight:400}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.font-extrabold{font-weight:800}.leading-none{line-height:1}.leading-tight{line-height:1.25}.leading-snug{line-height:1.375}.leading-normal{line-height:1.5}.leading-relaxed{line-height:1.625}.leading-loose{line-height:2}.tracking-tight{letter-spacing:-.025em}.tracking-normal{letter-spacing:0}.tracking-wide{letter-spacing:.025em}.tracking-wider{letter-spacing:.05em}.tracking-widest{letter-spacing:.1em}.text-left{text-align:left}.text-center{text-align:center}.text-right{text-align:right}.uppercase{text-transform:uppercase}.lowercase{text-transform:lowercase}.capitalize{text-transform:capitalize}.italic{font-style:italic}.break-all{word-break:break-all}.break-words{overflow-wrap:break-word}.whitespace-pre-line{white-space:pre-line}.whitespace-nowrap{white-space:nowrap}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.text-white{color:#fff}.text-black{color:#000}.text-gray-400{color:#9ca3af}.text-gray-500{color:#6b7280}.text-gray-600{color:#4b5563}.text-gray-700{color:#374151}.text-gray-800{color:#1f2937}.text-gray-900{color:#111827}.bg-white{background-color:#fff}.bg-black{background-color:#000}.bg-gray-50{background-color:#f9fafb}.bg-gray-100{background-color:#f3f4f6}.bg-transparent{background-color:transparent}.rounded-none{border-radius:0}.rounded-sm{border-radius:.125rem}.rounded{border-radius:.25rem}.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-xl{border-radius:.75rem}.rounded-2xl{border-radius:1rem}.rounded-3xl{border-radius:1.5rem}.rounded-full{border-radius:9999px}.border-0{border-width:0}.border{border-width:1px}.border-2{border-width:2px}.border-gray-200{border-color:#e5e7eb}.border-gray-300{border-color:#d1d5db}.shadow{box-shadow:0 1px 3px 0 rgb(0 0 0/.1),0 1px 2px -1px rgb(0 0 0/.1)}.shadow-sm{box-shadow:0 1px 2px 0 rgb(0 0 0/.05)}.shadow-lg{box-shadow:0 10px 15px -3px rgb(0 0 0/.1),0 4px 6px -4px rgb(0 0 0/.1)}.relative{position:relative}.absolute{position:absolute}.sticky{position:sticky}.inset-0{top:0;right:0;bottom:0;left:0}.top-0{top:0}.bottom-0{bottom:0}.left-0{left:0}.right-0{right:0}.z-10{z-index:10}.z-20{z-index:20}.z-50{z-index:50}.opacity-0{opacity:0}.opacity-50{opacity:.5}.opacity-100{opacity:1}.pointer-events-none{pointer-events:none}.cursor-pointer{cursor:pointer}.select-none{user-select:none}.divide-y>*+*{border-top-width:1px;border-top-style:solid}.divide-gray-200>*+*{border-color:#e5e7eb}.list-none{list-style-type:none}.transition{transition-property:color,background-color,border-color,opacity,box-shadow,transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:150ms}.duration-100{transition-duration:100ms}.duration-200{transition-duration:200ms}.duration-300{transition-duration:300ms}@media(min-width:640px){.sm\:grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.sm\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.sm\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.sm\:flex{display:flex}.sm\:hidden{display:none}.sm\:w-auto{width:auto}.sm\:px-4{padding-left:1rem;padding-right:1rem}.sm\:text-lg{font-size:1.125rem;line-height:1.75rem}.sm\:text-xl{font-size:1.25rem;line-height:1.75rem}.sm\:col-span-2{grid-column:span 2/span 2}}@media(min-width:768px){.md\:grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.md\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\:flex{display:flex}.md\:hidden{display:none}.md\:block{display:block}.md\:flex-row{flex-direction:row}.md\:items-center{align-items:center}.md\:justify-between{justify-content:space-between}.md\:w-1\/2{width:50%}.md\:w-8\/12{width:66.666%}.md\:w-4\/12{width:33.333%}.md\:px-4{padding-left:1rem;padding-right:1rem}.md\:py-8{padding-top:2rem;padding-bottom:2rem}.md\:py-16{padding-top:4rem;padding-bottom:4rem}.md\:py-28{padding-top:7rem;padding-bottom:7rem}.md\:pb-4{padding-bottom:1rem}.md\:pt-12{padding-top:3rem}.md\:pb-12{padding-bottom:3rem}.md\:pt-16{padding-top:4rem}.md\:pb-16{padding-bottom:4rem}.md\:text-xl{font-size:1.25rem;line-height:1.75rem}.md\:text-2xl{font-size:1.5rem;line-height:2rem}.md\:text-3xl{font-size:1.875rem;line-height:2.25rem}.md\:text-4xl{font-size:2.25rem;line-height:2.5rem}.md\:col-span-2{grid-column:span 2/span 2}}@media(min-width:1024px){.lg\:grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.lg\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.lg\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.lg\:flex{display:flex}.lg\:hidden{display:none}.lg\:block{display:block}.lg\:flex-row{flex-direction:row}.lg\:items-center{align-items:center}.lg\:gap-8{gap:2rem}.lg\:px-4{padding-left:1rem;padding-right:1rem}.lg\:px-8{padding-left:2rem;padding-right:2rem}.lg\:py-8{padding-top:2rem;padding-bottom:2rem}.lg\:py-16{padding-top:4rem;padding-bottom:4rem}.lg\:py-20{padding-top:5rem;padding-bottom:5rem}.lg\:pb-8{padding-bottom:2rem}.lg\:pb-10{padding-bottom:2.5rem}.lg\:pt-20{padding-top:5rem}.lg\:text-2xl{font-size:1.5rem;line-height:2rem}.lg\:text-3xl{font-size:1.875rem;line-height:2.25rem}.lg\:text-4xl{font-size:2.25rem;line-height:2.5rem}.lg\:text-5xl{font-size:3rem;line-height:1}.lg\:col-span-2{grid-column:span 2/span 2}.lg\:col-span-3{grid-column:span 3/span 3}}`

const srcdoc = computed(() => {
  if (!isVisible.value) return ''
  // Use DOMParser to reliably strip ALL on* event handler attributes regardless
  // of quoting style, encoding, or whitespace. Regex-based stripping is fragile
  // for complex onclick values like the slider's animation-restart handlers.
  let safeHtml: string
  if (typeof DOMParser === 'undefined') {
    safeHtml = props.htmlCode.replace(/\s+on\w+="[^"]*"/g, '')
  } else {
    const doc = new DOMParser().parseFromString(props.htmlCode, 'text/html')
    doc.querySelectorAll('*').forEach((el) => {
      const toRemove: string[] = []
      for (const attr of el.attributes) {
        if (/^on/i.test(attr.name)) toRemove.push(attr.name)
      }
      toRemove.forEach((name) => el.removeAttribute(name))
    })
    safeHtml = doc.body.innerHTML
  }
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=${props.renderWidth}"><style>${BASE_CSS}</style><style>${tailwindCSS}</style></head><body style="overflow:hidden">${safeHtml}</body></html>`
})

const wrapper = ref<HTMLElement | null>(null)
let intersectionObs: IntersectionObserver | null = null
let resizeObs: ResizeObserver | null = null

function onIframeLoad(event: Event) {
  const iframe = event.target as HTMLIFrameElement
  if (props.fit === 'contain') {
    // Wait for web fonts (e.g. Jost) before measuring so the final layout
    // height is stable. Fall back to double-rAF when fonts API is unavailable.
    const measure = () => {
      const doc = iframe.contentDocument
      // Use body.scrollHeight — the <html> element expands to fill the full
      // iframe viewport (8192px during measurement), body does not.
      const bodyHeight = doc?.body?.scrollHeight ?? 0
      const contentHeight = bodyHeight > 0 ? bodyHeight : (doc?.documentElement?.scrollHeight ?? 0)
      if (contentHeight > 0) {
        adaptiveHeight.value = Math.ceil(contentHeight * scale.value)
      }
      isLoaded.value = true
    }
    const fontsReady = iframe.contentDocument?.fonts?.ready
    if (fontsReady) {
      fontsReady.then(measure)
    } else {
      requestAnimationFrame(() => requestAnimationFrame(measure))
    }
  } else {
    isLoaded.value = true
  }
}

onMounted(() => {
  if (!wrapper.value) return

  // --- IntersectionObserver: lazy-render the iframe ---
  if (typeof IntersectionObserver === 'undefined') {
    isVisible.value = true
  } else {
    intersectionObs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible.value = true
          intersectionObs?.disconnect()
          intersectionObs = null
        }
      },
      { rootMargin: '300px' },
    )
    intersectionObs.observe(wrapper.value)
  }

  // --- ResizeObserver: keep containerWidth in sync with the real DOM width ---
  if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
    resizeObs = new window.ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      if (w > 0) containerWidth.value = w
    })

    if (wrapper.value) {
      resizeObs.observe(wrapper.value)
    }
  } else {
    containerWidth.value = wrapper.value?.clientWidth || 320
  }
})

onUnmounted(() => {
  intersectionObs?.disconnect()
  intersectionObs = null
  resizeObs?.disconnect()
  resizeObs = null
})
</script>

<template>
  <div
    ref="wrapper"
    class="pbx-relative pbx-overflow-hidden pbx-w-full"
    :style="{ height: `${displayHeight}px` }"
  >
    <iframe
      v-if="isVisible"
      :srcdoc="srcdoc"
      sandbox="allow-same-origin"
      loading="lazy"
      title=""
      aria-hidden="true"
      class="pbx-absolute pbx-top-0 pbx-left-0 pbx-border-0 pbx-pointer-events-none"
      :style="{
        width: `${renderWidth}px`,
        height: `${iframeHeight}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        overflow: 'hidden',
      }"
      @load="onIframeLoad"
    ></iframe>
    <div
      v-if="!isLoaded"
      class="pbx-absolute pbx-inset-0 pbx-flex pbx-items-center pbx-justify-center"
    >
      <ElementLoader />
    </div>
  </div>
</template>
