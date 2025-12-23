<script setup>
import { ref, computed, watchEffect } from 'vue'

const props = defineProps({
  mobile: {
    type: Boolean,
  },
})

const htmlPage = ref('')
const iframeRef = ref(null)

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

// Collect stylesheet content for mobile iframe
const stylesheetContent = ref('')

const updateStylesheets = () => {
  const styles = []
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    if (node.tagName === 'STYLE') {
      styles.push(`<style>${node.textContent}</style>`)
    } else if (node.tagName === 'LINK') {
      styles.push(`<link rel="stylesheet" href="${node.href}">`)
    }
  })
  stylesheetContent.value = styles.join('')
}

const iframeContent = computed(() => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${stylesheetContent.value}
</head>
<body>
  <div id="pagebuilder" class="pbx-font-sans pbx-text-black">${htmlPage.value}</div>
</body>
</html>`
})

watchEffect(() => {
  if (props.mobile && htmlPage.value) {
    updateStylesheets()
  }
})
</script>

<template>
  <template v-if="!mobile">
    <div>
      <div
        class="pbx-text-black pbx-w-full pbx-inset-x-0 pbx-h-[90vh] pbx-bg-white pbx-overflow-x-scroll lg:pbx-pt-2 pbx-pt-2"
      >
        <div id="pagebuilder">
          <div class="" v-html="htmlPage"></div>
        </div>
      </div>
    </div>
  </template>
  <template v-if="mobile">
    <div>
      <iframe
        ref="iframeRef"
        class="pbx-mx-auto pbx-w-full pbx-bg-white pbx-shadow-lg pbx-h-[80vh] pbx-border-0"
        :srcdoc="iframeContent"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      ></iframe>
    </div>
  </template>
</template>
