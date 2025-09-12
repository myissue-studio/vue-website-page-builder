<script setup>
import { ref, computed } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'
import { useTranslations } from '../../../composables/useTranslations'

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

const selectedTab = ref('globalPageStyles')

function selectTab(tab) {
  selectedTab.value = tab
}
</script>

<template>
  <div>
    <!-- tabbar start -->
    <div class="pbx-mb-4 pbx-flex pbx-jusitify-left pbx-items-center pbx-gap-2">
      <button
        @click="selectTab('globalPageStyles')"
        :class="[
          'pbx-mySecondaryButton pbx-text-xs pbx-px-4',
          selectedTab === 'globalPageStyles'
            ? 'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white  hover:pbx-bg-myPrimaryLinkColor'
            : 'hover:pbx-text-black',
        ]"
      >
        {{ translate('Global Page Styles') }}
      </button>
      <button
        @click="selectTab('viewHTMLConfig')"
        :class="[
          'pbx-mySecondaryButton pbx-text-xs pbx-px-4',
          selectedTab === 'viewHTMLConfig'
            ? 'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white  hover:pbx-bg-myPrimaryLinkColor'
            : 'hover:pbx-text-black',
        ]"
      >
        {{ translate('Selected HTML') }}
      </button>
    </div>
    <!-- tabbar end -->

    <!-- globalPageStyles start -->
    <div v-if="selectedTab === 'globalPageStyles'">hiiii</div>
    <!-- globalPageStyles end -->
    <!-- viewHTMLConfig start -->
    <div v-if="selectedTab === 'viewHTMLConfig'">
      <div
        class="pbx-w-full pbx-inset-x-0 pbx-h-[90vh] pbx-bg-white pbx-overflow-x-scroll lg:pbx-pt-2 pbx-pt-2"
      >
        <div
          class="pbx-flex pbx-items-left pbx-flex-col pbx-myPrimaryGap pbx-border-myPrimaryMediumGrayColor"
        >
          <p class="pbx-myPrimaryParagraph">
            {{
              translate(
                'Overview of Selected Element, Component, and Components. This section provides real-time updates based on your HTML selection.',
              )
            }}
          </p>

          <!-- Types - start -->
          <div>
            <h4 class="pbx-myPrimaryParagraph pbx-text-xs pbx-pb-2">{{ translate('Types') }}</h4>
            <div class="pbx-text-gray-100 pbx-overflow-hidden pbx-bg-gray-900">
              <div class="pbx-flex pbx-bg-gray-900 pbx-ring-1 ring-white/5">
                <div
                  class="pbx-mb-px pbx-flex pbx-text-xs pbx-font-medium pbx-text-myPrimaryMediumGrayColor"
                >
                  <div class="pbx-px-4 pbx-py-4 pbx-text-gray-100">{{ translate('Types') }}</div>
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
            <h4 class="pbx-myPrimaryParagraph pbx-text-xs pbx-pb-2">{{ translate('Content') }}</h4>
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
              <div class="pbx-px-4 pbx-pb-8 pbx-pt-4 pbx-text-gray-100 pbx-text-xs pbx-break-all">
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
                    <p class="pbx-pb-2 pbx-text-xs">{{ translate('No Components added yet') }}</p>
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
    <!-- viewHTMLConfig end -->
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
