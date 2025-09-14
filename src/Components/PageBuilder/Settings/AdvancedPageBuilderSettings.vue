<script setup>
import { ref, computed } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'
import { useTranslations } from '../../../composables/useTranslations'
import Typography from '../EditorMenu/Editables/Typography.vue'
import ClassEditor from '../EditorMenu/Editables/ClassEditor.vue'
import StyleEditor from '../EditorMenu/Editables/StyleEditor.vue'
import ImageEditor from '../EditorMenu/Editables/ImageEditor.vue'
import OpacityEditor from '../EditorMenu/Editables/OpacityEditor.vue'
import Padding from '../EditorMenu/Editables/Padding.vue'
import Margin from '../EditorMenu/Editables/Margin.vue'
import BorderRadius from '../EditorMenu/Editables/BorderRadius.vue'
import BackgroundColorEditor from '../EditorMenu/Editables/BackgroundColorEditor.vue'
import TextColorEditor from '../EditorMenu/Editables/TextColorEditor.vue'
import Borders from '../EditorMenu/Editables/Borders.vue'
import LinkEditor from '../EditorMenu/Editables/LinkEditor.vue'
import EditGetElement from '../EditorMenu/Editables/EditGetElement.vue'
import HTMLEditor from '../EditorMenu/Editables/HTMLEditor.vue'
import { extractCleanHTMLFromPageBuilder } from '../../../composables/extractCleanHTMLFromPageBuilder'

defineProps({
  isLoading: {
    Type: Boolean,
    required: true,
    default: true,
  },
})

const { translate } = useTranslations()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

const getElement = computed(() => {
  return pageBuilderStateStore.getElement
})
const getComponent = computed(() => {
  return pageBuilderStateStore.getComponent
})
const getComponents = computed(() => {
  return pageBuilderStateStore.getComponents
})
const current = ref('element')

const updateCurrentTab = function (tab) {
  current.value = tab
}
function prettifyHtml(html) {
  if (!html) return ''

  const tab = '  '
  let indentLevel = 0
  let result = ''

  // Basic HTML entity escaping
  const escapedHtml = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  // Split into tokens, keeping the tags
  const tokens = escapedHtml.split(/(&lt;[^&gt;]+&gt;)/g)

  const selfClosingTags = [
    '&lt;area',
    '&lt;base',
    '&lt;br',
    '&lt;col',
    '&lt;embed',
    '&lt;hr',
    '&lt;img',
    '&lt;input',
    '&lt;link',
    '&lt;meta',
    '&lt;param',
    '&lt;source',
    '&lt;track',
    '&lt;wbr',
  ]

  tokens.forEach((token) => {
    const trimmed = token.trim()
    if (!trimmed) return

    const isTag = trimmed.startsWith('&lt;') && trimmed.endsWith('&gt;')
    const isClosingTag = isTag && trimmed.startsWith('&lt;/')

    // Adjust indentation level
    if (isClosingTag) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    // Add indentation
    let line = tab.repeat(indentLevel) + trimmed

    // Syntax highlighting using spans
    if (isTag) {
      line = line.replace(/(&lt;\/?[[\w\s="/.':;#-\/\?]+&gt;)/g, (match) => {
        const tagName = match.match(/&lt;\/?([\w-]+)/)?.[1]
        let highlighted = match.replace(
          /(&lt;\/?[\w-]+)/g,
          `<span class="html-tag-symbol">&lt;</span><span class="html-tag-name">${tagName}</span>`,
        )

        // Highlight attributes
        highlighted = highlighted.replace(
          /([\w-]+)=(&quot;[^&quot;]*&quot;)/g,
          '<span class="html-attribute-name">$1</span><span class="html-operator">=</span><span class="html-attribute-value">$2</span>',
        )

        return highlighted + '<span class="html-tag-symbol">&gt;</span>'
      })
    }

    result += line + '\n'

    // Increase indent for next line
    if (isTag && !isClosingTag) {
      const isSelfClosing =
        trimmed.endsWith('/&gt;') || selfClosingTags.some((tag) => trimmed.startsWith(tag))
      if (!isSelfClosing) {
        indentLevel++
      }
    }
  })

  return result
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

const selectedTab = ref('globalPageStyles')

function selectTab(tab) {
  selectedTab.value = tab
}
</script>

<template>
  <div>
    <div>
      <!-- tabbar start -->
      <div
        class="pbx-mb-4 pbx-flex pbx-justify-start pbx-items-center pbx-gap-2 pbx-border-0 pbx-border-solid pbx-border-b pbx-border-gray-200 pbx-pb-4 pbx-overflow-x-auto"
      >
        <div class="pbx-flex pbx-justify-center pbx-items-center pbx-gap-2">
          <button
            @click="selectTab('globalPageStyles')"
            :class="[
              'pbx-mySecondaryButton pbx-text-xs pbx-px-4',
              selectedTab === 'globalPageStyles'
                ? 'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white  hover:pbx-bg-myPrimaryLinkColor'
                : 'hover:pbx-text-black',
            ]"
          >
            <span>
              <svg
                fill="currentColor"
                height="22"
                viewBox="0 0 22 22"
                width="22"
                xmlns="http://www.w3.org/2000/svg"
                class="css-l0u10b"
              >
                <g clip-path="url(#prefix__clip0_1645_485)">
                  <path
                    clip-rule="evenodd"
                    d="M19.871 1.81a2.768 2.768 0 00-3.914 0l-3.543 3.544-2.5-2.5L0 12.768l8.914 8.914 9.914-9.914-2.5-2.5 3.543-3.543a2.768 2.768 0 000-3.914zm-2.5 1.415a.768.768 0 011.086 1.086L13.5 9.268l2.5 2.5-1.086 1.086-6.086-6.086 1.086-1.086 2.5 2.5 4.957-4.957zM7.414 8.182l-4.586 4.586 1.086 1.086 3.293-3.293 1.414 1.414-3.293 3.293 1.086 1.086 3.293-3.293 1.414 1.414-3.293 3.293 1.086 1.086 4.586-4.586-6.086-6.086z"
                    fill-rule="evenodd"
                  ></path>
                </g>
                <defs>
                  <clipPath id="prefix__clip0_1645_485">
                    <path d="M0 0h22v22H0z" fill="#fff"></path>
                  </clipPath>
                </defs>
              </svg>
            </span>
            <span>
              {{ translate('Global Page Styles') }}
            </span>
          </button>
          <button
            @click="selectTab('download')"
            :class="[
              'pbx-mySecondaryButton pbx-text-xs pbx-px-4',
              selectedTab === 'download'
                ? 'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white  hover:pbx-bg-myPrimaryLinkColor'
                : 'hover:pbx-text-black',
            ]"
          >
            <span class="material-symbols-outlined"> download_2 </span>
            <span>
              {{ translate('Download HTML') }}
            </span>
          </button>
        </div>
        <div>
          <button
            @click="selectTab('viewHTMLConfig')"
            :class="[
              'pbx-mySecondaryButton pbx-text-xs pbx-px-4',
              selectedTab === 'viewHTMLConfig'
                ? 'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white  hover:pbx-bg-myPrimaryLinkColor'
                : 'hover:pbx-text-black',
            ]"
          >
            <span class="material-symbols-outlined"> deployed_code </span>
            <span>
              {{ translate('Selected HTML') }}
            </span>
          </button>
        </div>
      </div>
      <!-- tabbar end -->

      <!-- loading spinner start -->
      <div v-if="isLoading">
        <div class="pbx-flex pbx-items-top pbx-justify-center pbx-mt-4 pbx-min-h-screen">
          <div
            class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent pbx-align-[-0.125em] motion-reduce:pbx-animate-[spin_1.5s_linear_infinite]"
          >
            <span
              class="!pbx-absolute !pbx-m-px !pbx-h-px !pbx-w-px !pbx-overflow-hidden !pbx-whitespace-nowrap !pbx-border-0 !pbx-p-0 !pbx-[clip:rect(0,0,0,0)]"
              >Loading...</span
            >
          </div>
        </div>
      </div>
      <!-- loading spinner end -->
      <!-- globalPageStyles start -->
      <div v-if="!isLoading">
        <div v-if="selectedTab === 'download'" class="pbx-min-h-screen">
          <div v-if="Array.isArray(getComponents) && getComponents.length >= 1">
            <p class="pbx-myPrimaryParagraph pbx-mt-6 pbx-mb-10">
              {{
                translate(
                  'Export the entire page as a standalone HTML file. This includes all sections, content, and applied styles, making it ready for use or integration elsewhere.',
                )
              }}
            </p>
            <div class="pbx-my-2 pbx-py-2">
              <button @click="handleDownloadHTML" type="button" class="pbx-myPrimaryButton">
                <span class="material-symbols-outlined"> download_2 </span>
                <span>
                  {{ translate('Download HTML file') }}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div v-if="selectedTab === 'globalPageStyles'" class="pbx-min-h-screen">
          <div>
            <p class="pbx-myPrimaryParagraph pbx-mt-6 pbx-mb-10">
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
              <HTMLEditor></HTMLEditor>
            </article>
          </div>
        </div>
        <!-- globalPageStyles end -->
        <!-- viewHTMLConfig start -->
        <div v-if="selectedTab === 'viewHTMLConfig'" class="pbx-min-h-screen">
          <p class="pbx-myPrimaryParagraph pbx-mt-6 pbx-mb-10">
            {{
              translate(
                'Overview of Selected Element, Component, and Components. This section provides real-time updates based on your HTML selection.',
              )
            }}
          </p>

          <div
            class="pbx-w-full pbx-inset-x-0 pbx-h-[90vh] pbx-bg-white pbx-overflow-x-scroll lg:pbx-pt-2 pbx-pt-2"
          >
            <div
              class="pbx-flex pbx-items-left pbx-flex-col pbx-myPrimaryGap pbx-border-myPrimaryMediumGrayColor"
            >
              <!-- Types - start -->
              <div>
                <h4 class="pbx-myPrimaryParagraph pbx-text-xs pbx-pb-2">
                  {{ translate('Types') }}
                </h4>
                <div class="pbx-text-gray-100 pbx-overflow-hidden pbx-bg-gray-900">
                  <div class="pbx-flex pbx-bg-gray-900 pbx-ring-1 ring-white/5">
                    <div
                      class="pbx-mb-px pbx-flex pbx-text-xs pbx-font-medium pbx-text-myPrimaryMediumGrayColor"
                    >
                      <div class="pbx-px-4 pbx-py-4 pbx-text-gray-100">
                        {{ translate('Types') }}
                      </div>
                    </div>
                  </div>
                  <div class="pbx-px-4 pbx-pb-8 pbx-pt-4 pbx-text-gray-100 pbx-text-xs">
                    <p class="pbx-text-xs pbx-pb-2">
                      <span>{{ translate('Element type:') }} </span>
                      <span>
                        {{ typeof getElement }}
                      </span>
                    </p>

                    <p class="pbx-text-xs pbx-pb-2">
                      <span>{{ translate('Component type:') }} </span>
                      {{ typeof getComponent }}
                    </p>
                    <p class="pbx-text-xs pbx-pb-2">
                      <span>{{ translate('Components:') }} </span>
                      <span>
                        {{
                          Array.isArray(getComponents) === true
                            ? translate('array')
                            : typeof getComponents
                        }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <!-- Types - end -->
              <!-- Code Block Component - start-->
              <div>
                <h4 class="pbx-myPrimaryParagraph pbx-text-xs pbx-pb-2">
                  {{ translate('Content') }}
                </h4>
                <div class="pbx-overflow-hidden pbx-bg-gray-900">
                  <div class="pbx-flex pbx-bg-gray-900 pbx-ring-1 ring-white/5">
                    <div
                      class="pbx-mb-px pbx-flex pbx-text-xs pbx-font-medium pbx-text-myPrimaryMediumGrayColor"
                    >
                      <div
                        @click="updateCurrentTab('element')"
                        class="pbx-px-4 pbx-py-4 pbx-cursor-pointer"
                        :class="[current === 'element' ? 'pbx-text-gray-100' : '']"
                      >
                        {{ translate('Element') }}
                      </div>
                      <div
                        @click="updateCurrentTab('component')"
                        class="pbx-px-4 pbx-py-4 pbx-cursor-pointer"
                        :class="[current === 'component' ? 'pbx-text-gray-100' : '']"
                      >
                        {{ translate('Component') }}
                      </div>
                      <div
                        @click="updateCurrentTab('components')"
                        class="pbx-px-4 pbx-py-4 pbx-cursor-pointer"
                        :class="[current === 'components' ? 'pbx-text-gray-100' : '']"
                      >
                        {{ translate('Components added') }}
                        {{ Array.isArray(getComponents) && getComponents.length }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="pbx-px-4 pbx-pb-8 pbx-pt-4 pbx-text-gray-100 pbx-text-xs pbx-break-all"
                  >
                    <div v-if="current === 'element'">
                      <div v-if="!getComponent">
                        <p class="pbx-pb-2 pbx-text-xs">
                          {{
                            getComponent === null
                              ? translate('No Element selected')
                              : typeof getComponent
                          }}
                        </p>
                      </div>
                      <div
                        v-if="getElement"
                        class="pbx-overflow-hidden pbx-border-solid pbx-border pbx-border-gray-100 pbx-mb-6"
                      >
                        <div
                          class="pbx-border-0 pbx-bg-gray-900 pbx-pt-4 pbx-1 pbx-border-solid pbx-border-b pbx-border-gray-200"
                        >
                          <div class="pbx-overflow-x-auto">
                            <table class="pbx-min-w-full">
                              <thead class="pbx-bg-gray-900">
                                <tr>
                                  <th
                                    class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal"
                                  >
                                    {{ translate('Selected HTML:') }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody class="pbx-bg-gray-900 pbx-divide-y pbx-divide-gray-200">
                                <tr>
                                  <td
                                    class="pbx-border-0 pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal pbx-border-solid pbx-border-b"
                                  >
                                    {{ getElement?.outerHTML }}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="pbx-overflow-x-auto">
                            <table class="pbx-min-w-full">
                              <thead class="pbx-bg-gray-900">
                                <tr>
                                  <th
                                    class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal"
                                  >
                                    {{ translate('Element src:') }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody class="pbx-bg-gray-900 pbx-divide-y pbx-divide-gray-200">
                                <tr>
                                  <td
                                    class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal pbx-whitespace-pre-line"
                                  >
                                    {{ getElement?.src ? getElement?.src : typeof getElement?.src }}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div class="pbx-overflow-x-auto">
                          <table class="pbx-min-w-full">
                            <thead class="pbx-bg-gray-900">
                              <tr>
                                <th
                                  class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal"
                                >
                                  {{ translate('Element classes:') }}
                                </th>
                              </tr>
                            </thead>
                            <tbody class="pbx-bg-gray-900 pbx-divide-y pbx-divide-gray-200">
                              <tr>
                                <td
                                  class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal"
                                >
                                  {{
                                    getElement?.classList
                                      ? getElement?.classList
                                      : typeof getElement?.classList
                                  }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div v-if="current === 'component'">
                      <div v-if="!getComponent">
                        <p class="pbx-pb-2 pbx-text-xs">
                          {{
                            getComponent === null
                              ? translate('No Component selected')
                              : typeof getComponent
                          }}
                        </p>
                      </div>
                      <div
                        v-if="getComponent"
                        class="pbx-overflow-hidden pbx-border-solid pbx-border pbx-border-gray-100 pbx-mb-6"
                      >
                        <div
                          class="pbx-border-0 pbx-bg-gray-900 pbx-pt-4 pbx-1 pbx-border-solid pbx-border-b pbx-border-gray-200"
                        >
                          <div class="pbx-overflow-x-auto">
                            <table class="pbx-min-w-full">
                              <thead class="pbx-bg-gray-900">
                                <tr>
                                  <th
                                    class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal"
                                  >
                                    {{ translate('ID:') }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody class="pbx-bg-gray-900 pbx-divide-y pbx-divide-gray-200">
                                <tr>
                                  <td
                                    class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal"
                                  >
                                    {{ getComponent?.id }}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="pbx-overflow-x-auto">
                            <table class="pbx-min-w-full">
                              <thead class="pbx-bg-gray-900">
                                <tr>
                                  <th
                                    class="pbx-border-0 pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal pbx-border-solid pbx-border-t pbx-border-gray-200"
                                  >
                                    {{ translate('Title:') }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody class="pbx-bg-gray-900 pbx-divide-y pbx-divide-gray-200">
                                <tr>
                                  <td
                                    class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal pbx-whitespace-pre-line"
                                  >
                                    {{ getComponent?.title }}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div class="pbx-overflow-x-auto">
                          <table class="pbx-min-w-full">
                            <thead class="pbx-bg-gray-900">
                              <tr>
                                <th
                                  class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal"
                                >
                                  {{ translate('HTML Code:') }}
                                </th>
                              </tr>
                            </thead>
                            <tbody class="pbx-bg-gray-900 pbx-divide-y pbx-divide-gray-200">
                              <tr>
                                <td
                                  class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal"
                                >
                                  <pre
                                    class="pbx-text-xs pbx-text-gray-100 pbx-whitespace-pre-wrap pbx-font-sans pbx-flex pbx-items-start pbx-justify-left"
                                  >
                              <code class="pbx-font-sans pbx-bg-gray-800 pbx-p-4 pbx-rounded-md pbx-block pbx-w-full" v-html="prettifyHtml(getComponent?.html_code)"></code>
                            </pre>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div v-if="current === 'components'">
                      <div v-if="Array.isArray(getComponents) && getComponents.length === 0">
                        <p class="pbx-pb-2 pbx-text-xs">
                          {{ translate('No Components added yet') }}
                        </p>
                      </div>

                      <div v-if="getComponents">
                        <div
                          v-for="component in getComponents"
                          :key="component.id"
                          class="pbx-overflow-hidden pbx-border-solid pbx-border pbx-border-gray-100 pbx-mb-6"
                        >
                          <!-- Id and Title above the table, styled to look connected -->
                          <div
                            class="pbx-border-0 pbx-bg-gray-900 pbx-pt-4 pbx-1 pbx-border-solid pbx-border-b pbx-border-gray-200"
                          >
                            <div class="pbx-overflow-x-auto">
                              <table class="pbx-min-w-full">
                                <thead class="pbx-bg-gray-900">
                                  <tr>
                                    <th
                                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal"
                                    >
                                      {{ translate('ID:') }}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody class="pbx-bg-gray-900 pbx-divide-y pbx-divide-gray-200">
                                  <tr>
                                    <td
                                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal"
                                    >
                                      {{ component.id }}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div class="pbx-overflow-x-auto">
                              <table class="pbx-min-w-full">
                                <thead class="pbx-bg-gray-900">
                                  <tr>
                                    <th
                                      class="pbx-border-0 pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal pbx-border-solid pbx-border-t pbx-border-gray-200"
                                    >
                                      {{ translate('Title:') }}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody class="pbx-bg-gray-900 pbx-divide-y pbx-divide-gray-200">
                                  <tr>
                                    <td
                                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal pbx-whitespace-pre-line"
                                    >
                                      {{ component.title }}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div class="pbx-overflow-x-auto">
                            <table class="pbx-min-w-full">
                              <thead class="pbx-bg-gray-900">
                                <tr>
                                  <th
                                    class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal"
                                  >
                                    {{ translate('HTML Code:') }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody class="pbx-bg-gray-900 pbx-divide-y pbx-divide-gray-200">
                                <tr>
                                  <td
                                    class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-text-gray-100 pbx-font-normal"
                                  >
                                    <pre
                                      class="pbx-text-xs pbx-text-gray-100 pbx-whitespace-pre-wrap pbx-font-sans pbx-flex pbx-items-start pbx-justify-left"
                                    >
                              <code class="pbx-font-sans pbx-w-full" v-html="prettifyHtml(component.html_code)"></code>
                            </pre>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Code Block Component - end-->
            </div>
          </div>
        </div>
      </div>
      <!-- viewHTMLConfig end -->
    </div>
  </div>
</template>

<style>
.html-tag {
  color: #ff79c6;
}
.html-attribute {
  color: #50fa7b;
}
.html-value {
  color: #f1fa8c;
}
</style>
