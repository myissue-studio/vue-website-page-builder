<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, nextTick } from 'vue'

const props = defineProps({
  mobile: {
    type: Boolean,
  },
  tablet: {
    type: Boolean,
  },
})

const htmlPage = ref('')
const previewFontClass = ref('pbx-font-sans')
const previewElementFontStyle = ref<Record<string, string>>({})
const previewRootRef = ref<HTMLElement | null>(null)

const previewData = localStorage.getItem('preview')
if (previewData) {
  try {
    const parsed = JSON.parse(previewData)
    htmlPage.value = Array.isArray(parsed) ? parsed.join('') : ''
  } catch (err) {
    console.error('Invalid preview data:', err)
    htmlPage.value = ''
  }
}

const savedFontClass = localStorage.getItem('preview-font-class')
if (savedFontClass) previewFontClass.value = savedFontClass

const savedElementFonts = localStorage.getItem('preview-element-fonts')
if (savedElementFonts) {
  try {
    previewElementFontStyle.value = JSON.parse(savedElementFonts)
  } catch {
    // ignore malformed data
  }
}

// Collect stylesheet content for mobile iframe
const stylesheetContent = ref('')

const updateStylesheets = () => {
  const styles: string[] = []
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    if (node.tagName === 'STYLE') {
      styles.push(`<style>${node.textContent}</style>`)
    } else if (node.tagName === 'LINK') {
      styles.push(`<link rel="stylesheet" href="${(node as HTMLLinkElement).href}">`)
    }
  })
  stylesheetContent.value = styles.join('')
}

// Inject element-font CSS custom properties into the iframe via a <style> block
// so the #pagebuilder h1-p rules in style.css can resolve the variables.
const elementFontCssBlock = computed(() => {
  const entries = Object.entries(previewElementFontStyle.value)
  if (!entries.length) return ''
  const vars = entries.map(([k, v]) => `  ${k}: ${v};`).join('\n')
  return `<style>#pagebuilder {\n${vars}\n}</style>`
})

const sliderResetScript =
  '<script>(function(){document.querySelectorAll("[data-isl] .pbx-isl-t").forEach(function(t){t.scrollLeft=0;t.style.animation="none";void t.offsetHeight;t.style.animation="";});})();</' +
  'script>'

const iframeContent = computed(() => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${stylesheetContent.value}
  ${elementFontCssBlock.value}
</head>
<body>
  <div id="pagebuilder" class="${previewFontClass.value} pbx-text-black">${htmlPage.value}</div>
  ${sliderResetScript}
</body>
</html>`
})

const isFramedPreview = computed(() => props.mobile || props.tablet)

const framedPreviewClass = computed(() => {
  const base = 'pbx-mx-auto pbx-bg-white pbx-shadow-lg pbx-h-[80vh] pbx-border-0'
  if (props.tablet) {
    return `${base} pbx-w-full lg:pbx-max-w-[900px]`
  }
  return `${base} pbx-w-full lg:pbx-max-w-[480px]`
})

const framedPreviewTitle = computed(() => (props.tablet ? 'Tablet preview' : 'Mobile preview'))

function resetPreviewSlidersToFirstSlide(root: ParentNode | null | undefined) {
  if (!root) return
  root.querySelectorAll<HTMLElement>('[data-isl] .pbx-isl-t').forEach((track) => {
    track.scrollLeft = 0
    // Restart CSS autoplay from slide 1 if animation is active.
    track.style.animation = 'none'
    void track.offsetHeight
    track.style.animation = ''
  })
}

watchEffect(() => {
  if (isFramedPreview.value && htmlPage.value) {
    updateStylesheets()
  }
})

onMounted(() => {
  nextTick(() => {
    resetPreviewSlidersToFirstSlide(previewRootRef.value)
  })
})
</script>

<template>
  <template v-if="!isFramedPreview">
    <div>
      <div
        class="pbx-text-black pbx-w-full pbx-inset-x-0 pbx-h-[90vh] pbx-bg-white pbx-overflow-x-scroll lg:pbx-pt-2 pbx-pt-2"
      >
        <div :style="previewElementFontStyle">
          <div id="pagebuilder" :class="[previewFontClass, 'pbx-text-black']">
            <div ref="previewRootRef" v-html="htmlPage"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-if="isFramedPreview">
    <div>
      <iframe
        :title="framedPreviewTitle"
        :class="framedPreviewClass"
        :srcdoc="iframeContent"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      ></iframe>
    </div>
  </template>
</template>
