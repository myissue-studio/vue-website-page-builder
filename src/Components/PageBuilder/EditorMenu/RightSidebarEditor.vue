<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'
import ClassEditor from './Editables/ClassEditor.vue'
import StyleEditor from './Editables/StyleEditor.vue'
import ImageEditor from './Editables/ImageEditor.vue'
import OpacityEditor from './Editables/OpacityEditor.vue'
import Typography from './Editables/Typography.vue'
import Padding from './Editables/Padding.vue'
import Margin from './Editables/Margin.vue'
import BorderRadius from './Editables/BorderRadius.vue'
import BackgroundColorEditor from './Editables/BackgroundColorEditor.vue'
import TextColorEditor from './Editables/TextColorEditor.vue'
import Borders from './Editables/Borders.vue'
import LinkEditor from './Editables/LinkEditor.vue'
import EditGetElement from './Editables/EditGetElement.vue'
import HTMLEditor from './Editables/HTMLEditor.vue'
import { getPageBuilder } from '../../../composables/builderInstance'
import EditorAccordion from '../EditorMenu/EditorAccordion.vue'
import fullHTMLContent from '../../../utils/builder/html-doc-declaration-with-components'
import ModalBuilder from '../../../Components/Modals/ModalBuilder.vue'
import { extractCleanHTMLFromPageBuilder } from '../../../composables/extractCleanHTMLFromPageBuilder'
import { useTranslations } from '../../../composables/useTranslations'

const { translate } = useTranslations()

const pageBuilderService = getPageBuilder()
const pageBuilderStateStore = sharedPageBuilderStore

defineEmits(['closeEditor'])

const isLoadingPageStyles = ref(null)
const getComponents = computed(() => {
  return pageBuilderStateStore.getComponents
})
const getElement = computed(() => {
  return pageBuilderStateStore.getElement
})

const elementTag = computed(() => {
  return getElement.value?.tagName
})

const isHeadingElement = computed(() => {
  return (
    (getElement.value instanceof HTMLElement && getElement.value.innerText.trim() !== ' ') ||
    getElement.value instanceof HTMLImageElement
  )
})

const scrollContainer = ref(null)
let lastScrollTop = 0

// Watch for changes that cause re-render (e.g. dropdown value in store)
watch(
  // or the specific value that triggers re-render
  () => pageBuilderStateStore.getElement,
  () => {
    // Restore scroll after DOM updates
    nextTick(() => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = lastScrollTop
      }
    })
  },
)

// Save scroll position before update
function onScroll() {
  if (scrollContainer.value) {
    lastScrollTop = scrollContainer.value.scrollTop
  }
}

const generateHTML = function (filename, HTML) {
  // Extract existing styles from the page
  const existingStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((style) => {
      if (style.tagName === 'STYLE') {
        return style.outerHTML // Inline styles
      } else if (style.tagName === 'LINK') {
        return `<link rel="stylesheet" href="${style.href}">` // External stylesheets
      }
      return ''
    })
    .join('\n')

  // Add your custom CSS
  const customCSS = `
      <style>
        #pagebuilder blockquote,
        #pagebuilder dl,
        #pagebuilder dd,
        #pagebuilder pre,
        #pagebuilder hr,
        #pagebuilder figure,
        #pagebuilder p,
        #pagebuilder h1,
        #pagebuilder h2,
        #pagebuilder h3,
        #pagebuilder h4,
        #pagebuilder h5,
        #pagebuilder h6,
        #pagebuilder ul,
        #pagebuilder ol,
        #pagebuilder li {
          margin: 0;
          padding: 0; /* Often useful for ul/ol too */
        }
      </style>
    `

  // Combine existing styles and custom CSS
  const css = `${existingStyles}\n${customCSS}`

  // Generate the full HTML
  const fullHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Downloaded HTML</title>
            ${css}
        </head>
        <body>
            <div id="pagebuilder" class="pbx-font-sans pbx-text-black">
                ${HTML}
            </div>
        </body>
        </html>
    `

  // Create and trigger the download
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(fullHTML))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

const handleDownloadHTML = function () {
  const pagebuilder = document.getElementById('pagebuilder')
  if (!pagebuilder) {
    return
  }

  // Extract clean HTML
  let html = extractCleanHTMLFromPageBuilder(pagebuilder)

  // Create a temporary DOM element to manipulate the HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // Remove 'hovered' and 'selected' attributes
  tempDiv.querySelectorAll('[hovered], [selected]').forEach((el) => {
    el.removeAttribute('hovered')
    el.removeAttribute('selected')
  })

  // Get the cleaned HTML back
  html = tempDiv.innerHTML

  generateHTML('downloaded_html.html', html)
}
const showModalGlobalPageStyles = ref(null)

const handleUpdatePageStyles = async function () {
  showModalGlobalPageStyles.value = true

  await pageBuilderService.globalPageStyles()
}

const handleCloseGlobalPageStyles = async function () {
  isLoadingPageStyles.value = true
  await pageBuilderService.handleManualSave()

  // Remove global highlight if present
  const pagebuilder = document.querySelector('#pagebuilder')
  if (pagebuilder) {
    pagebuilder.removeAttribute('data-global-selected')
  }

  showModalGlobalPageStyles.value = false
  isLoadingPageStyles.value = false
}

const handleGlobalHtmlMode = function () {
  pageBuilderStateStore.setToggleGlobalHtmlMode()
}
</script>

<template>
  <div class="pbx-flex pbx-h-full pbx-flex-col">
    <div
      class="pbx-flex pbx-flex-row pbx-justify-between pbx-pt-7 pbx-pr-4 pbx-pl-4 pbx-items-center pbx-mb-3"
    >
      <button
        type="button"
        @click="$emit('closeEditor')"
        class="pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-ring-0 pbx-text-black hover:pbx-text-white"
      >
        <span class="material-symbols-outlined"> close </span>
      </button>
      <p class="pbx-font-medium pbx-text-sm">
        {{ translate('Editing') }}
        <span class="pbx-lowercase">&lt;{{ elementTag }}&gt;</span>
      </p>
    </div>

    <div
      v-if="!showModalGlobalPageStyles"
      ref="scrollContainer"
      @scroll="onScroll"
      class="pbx-pl-3 pbx-pr-3 pbx-mb-4 pbx-overflow-y-scroll"
    >
      <div v-show="getElement && pageBuilderService.isEditableElement(getElement)">
        <article class="pbx-mb-1">
          <ImageEditor> </ImageEditor>
        </article>
        <article class="pbx-my-1">
          <OpacityEditor> </OpacityEditor>
        </article>
        <article class="pbx-my-1">
          <Padding> </Padding>
        </article>
        <article class="pbx-my-1">
          <Margin> </Margin>
        </article>
        <article class="pbx-my-1">
          <BorderRadius></BorderRadius>
        </article>
        <article class="pbx-my-1">
          <Borders></Borders>
        </article>
        <article class="pbx-my-1">
          <ClassEditor></ClassEditor>
        </article>
        <article class="pbx-my-1">
          <StyleEditor></StyleEditor>
        </article>
      </div>

      <!-- Global Page Styles -->
      <article class="pbx-my-1">
        <EditorAccordion>
          <template #title>{{ translate('Global Page Styles') }}</template>
          <template #content>
            <p class="pbx-myPrimaryInputLabel pbx-my-4">
              {{
                translate(
                  'Apply styles that affect the entire page. These settings include global font family, text color, background color, and other universal styles that apply to all sections.',
                )
              }}
            </p>

            <hr />
            <div class="pbx-my-2 pbx-py-2">
              <button @click="handleUpdatePageStyles" type="button" class="pbx-myPrimaryButton">
                {{ translate('Update Page Styles') }}
              </button>
            </div>
          </template>
        </EditorAccordion>
      </article>
      <!-- Global Page Styles -->

      <!-- Download Layout HTML -->
      <article v-if="Array.isArray(getComponents) && getComponents.length >= 1" class="pbx-my-1">
        <EditorAccordion>
          <template #title>{{ translate('Download HTML') }}</template>
          <template #content>
            <p class="pbx-myPrimaryInputLabel pbx-my-4">
              {{
                translate(
                  'Export the entire page as a standalone HTML file. This includes all sections, content, and applied styles, making it ready for use or integration elsewhere.',
                )
              }}
            </p>
            <hr />
            <div class="pbx-my-2 pbx-py-2">
              <button @click="handleDownloadHTML" type="button" class="pbx-myPrimaryButton">
                {{ translate('Download HTML file') }}
              </button>
            </div>
          </template>
        </EditorAccordion>
        <!-- Download Layout HTML -->
      </article>
    </div>

    <ModalBuilder
      maxWidth="md"
      minHeight="pbx-min-h-[65vh] pbx-max-h-[65vh]"
      :showModalBuilder="showModalGlobalPageStyles"
      :title="translate('Global Page Styles')"
      @closeMainModalBuilder="handleCloseGlobalPageStyles"
    >
      <div id="pagebuilder-right-menu" class="pbx-flex pbx-flex-col pbx-gap-2 pbx-pt-4 pbx-pb-2">
        <div v-if="isLoadingPageStyles">
          <div class="pbx-flex pbx-items-center pbx-my-2 pbx-py-4 pbx-px-2 pbx-justify-center">
            <div
              class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent pbx-align-[-0.125em] motion-reduce:pbx-animate-[spin_1.5s_linear_infinite]"
            >
              <span
                class="!pbx-absolute !pbx-m-px !pbx-h-px !pbx-w-px !pbx-overflow-hidden !pbx-whitespace-nowrap !pbx-border-0 !pbx-p-0 !pbx-[clip:rect(0,0,0,0)]"
                >{{ translate('Loading...') }}</span
              >
            </div>
          </div>
        </div>
        <div v-if="!isLoadingPageStyles && showModalGlobalPageStyles" class="pbx-pb-12">
          <div>
            <p class="pbx-myPrimaryParagraph">
              {{
                translate(
                  'Apply styles that affect the entire page. These settings include global font family, text color, background color, and other universal styles that apply to all sections.',
                )
              }}
            </p>
            <article class="pbx-my-1">
              <Typography></Typography>
            </article>
            <article class="pbx-my-1">
              <TextColorEditor :globalPageLayout="true"></TextColorEditor>
            </article>
            <article class="pbx-my-1">
              <BackgroundColorEditor :globalPageLayout="true"></BackgroundColorEditor>
            </article>
            <article class="pbx-my-1">
              <Padding> </Padding>
            </article>
            <article class="pbx-my-1">
              <Margin> </Margin>
            </article>
            <article class="pbx-my-1">
              <BorderRadius></BorderRadius>
            </article>
            <article class="pbx-my-1">
              <Borders></Borders>
            </article>
            <article class="pbx-my-1">
              <ClassEditor></ClassEditor>
            </article>
            <article class="pbx-my-1">
              <StyleEditor></StyleEditor>
            </article>
            <article class="pbx-my-1">
              <HTMLEditor @click="handleGlobalHtmlMode"></HTMLEditor>
            </article>
          </div>
        </div>
      </div>
    </ModalBuilder>
  </div>
</template>
