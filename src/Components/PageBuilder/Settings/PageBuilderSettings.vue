<script setup lang="ts">
import { computed, ref } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'
import { isEmptyObject } from '../../../utils/is-empty-object'
import { version } from '../../../../package.json'
import { useTranslations } from '../../../composables/useTranslations'
import { extractCleanHTMLFromPageBuilder } from '../../../utils/builder/extract-clean-html'
import SelectedHtmlInspector from '../EditorMenu/Editables/SelectedHtmlInspector.vue'

type EmbeddedSection =
  | 'overviewApp'
  | 'overviewUser'
  | 'overviewConfig'
  | 'download'
  | 'selectedHtml'

const props = defineProps<{
  embeddedSection?: EmbeddedSection
}>()

const { translate } = useTranslations()

const isEmbedded = computed(() => Boolean(props.embeddedSection))

const isOverviewSlice = computed(() =>
  ['overviewApp', 'overviewUser', 'overviewConfig'].includes(props.embeddedSection ?? ''),
)

const overviewSectionSpacing = computed(() => (isEmbedded.value ? 'pbx-mt-4' : 'pbx-mt-8'))

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

const getPageBuilderConfig = computed(() => {
  return pageBuilderStateStore.getPageBuilderConfig
})

const getComponents = computed(() => pageBuilderStateStore.getComponents)

const selectedTab = ref('overview')
function selectTab(tab: string) {
  selectedTab.value = tab
}

const showOverview = computed(
  () => isOverviewSlice.value || (!props.embeddedSection && selectedTab.value === 'overview'),
)
const showOverviewIntro = computed(() => showOverview.value && !isOverviewSlice.value)
const showOverviewApp = computed(
  () =>
    props.embeddedSection === 'overviewApp' ||
    (!props.embeddedSection && selectedTab.value === 'overview'),
)
const showOverviewUser = computed(
  () =>
    props.embeddedSection === 'overviewUser' ||
    (!props.embeddedSection && selectedTab.value === 'overview'),
)
const showOverviewConfig = computed(
  () =>
    props.embeddedSection === 'overviewConfig' ||
    (!props.embeddedSection && selectedTab.value === 'overview'),
)
const showDownload = computed(
  () =>
    props.embeddedSection === 'download' ||
    (!props.embeddedSection && selectedTab.value === 'download'),
)
const showSelectedHtml = computed(
  () =>
    props.embeddedSection === 'selectedHtml' ||
    (!props.embeddedSection && selectedTab.value === 'viewHTMLConfig'),
)

function generateHTML(filename: string, HTML: string) {
  const existingStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((style) => {
      if (style.tagName === 'STYLE') {
        return style.outerHTML
      } else if (style.tagName === 'LINK') {
        return `<link rel="stylesheet" href="${(style as HTMLLinkElement).href}">`
      }
      return ''
    })
    .join('\n')

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
          padding: 0;
        }
      </style>
    `

  const css = `${existingStyles}\n${customCSS}`

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

  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(fullHTML))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

function handleDownloadHTML() {
  const pagebuilder = document.getElementById('pagebuilder')
  if (!pagebuilder) return

  let html = extractCleanHTMLFromPageBuilder(pagebuilder)

  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  tempDiv.querySelectorAll('[hovered], [selected]').forEach((el) => {
    el.removeAttribute('hovered')
    el.removeAttribute('selected')
  })

  html = tempDiv.innerHTML
  generateHTML('downloaded_html.html', html)
}
</script>

<template>
  <div
    class="pbx-w-full"
    :class="
      isEmbedded
        ? 'pbx-editorEmbeddedSettings'
        : 'pbx-inset-x-0 pbx-h-[90vh] pbx-bg-white pbx-overflow-x-scroll lg:pbx-pt-2 pbx-pt-2'
    "
  >
    <!-- tab bar start -->
    <div
      v-if="!isEmbedded"
      class="pbx-flex pbx-items-center pbx-gap-1 pbx-border-0 pbx-border-solid pbx-border-b pbx-border-gray-100 pbx-pb-3 pbx-pt-1 pbx-overflow-x-auto"
    >
      <button
        @click="selectTab('overview')"
        type="button"
        class="pbx-inline-flex pbx-items-center pbx-gap-1 pbx-px-2.5 pbx-py-2 pbx-rounded pbx-text-xs pbx-font-medium pbx-cursor-pointer pbx-border pbx-transition-colors pbx-whitespace-nowrap"
        :class="
          selectedTab === 'overview'
            ? 'pbx-bg-gray-900 pbx-text-white pbx-border-gray-900'
            : 'pbx-bg-white pbx-text-gray-500 pbx-border-gray-200 hover:pbx-bg-gray-50 hover:pbx-text-gray-700'
        "
      >
        <span class="material-symbols-outlined" style="font-size: 13px">visibility</span>
        <span>{{ translate('Overview') }}</span>
      </button>
      <button
        @click="selectTab('download')"
        type="button"
        class="pbx-inline-flex pbx-items-center pbx-gap-1 pbx-px-2.5 pbx-py-2 pbx-rounded pbx-text-xs pbx-font-medium pbx-cursor-pointer pbx-border pbx-transition-colors pbx-whitespace-nowrap"
        :class="
          selectedTab === 'download'
            ? 'pbx-bg-gray-900 pbx-text-white pbx-border-gray-900'
            : 'pbx-bg-white pbx-text-gray-500 pbx-border-gray-200 hover:pbx-bg-gray-50 hover:pbx-text-gray-700'
        "
      >
        <span class="material-symbols-outlined" style="font-size: 13px">nest_eco_leaf</span>
        <span>{{ translate('Download HTML') }}</span>
      </button>
      <button
        @click="selectTab('viewHTMLConfig')"
        type="button"
        class="pbx-inline-flex pbx-items-center pbx-gap-1 pbx-px-2.5 pbx-py-2 pbx-rounded pbx-text-xs pbx-font-medium pbx-cursor-pointer pbx-border pbx-transition-colors pbx-whitespace-nowrap"
        :class="
          selectedTab === 'viewHTMLConfig'
            ? 'pbx-bg-gray-900 pbx-text-white pbx-border-gray-900'
            : 'pbx-bg-white pbx-text-gray-500 pbx-border-gray-200 hover:pbx-bg-gray-50 hover:pbx-text-gray-700'
        "
      >
        <span class="material-symbols-outlined" style="font-size: 13px">deployed_code</span>
        <span>{{ translate('Selected HTML') }}</span>
      </button>
    </div>
    <!-- tab bar end -->

    <!-- Overview tab start -->
    <div v-if="showOverview">
      <div v-if="showOverviewIntro">
        <div class="pbx-flex pbx-items-left pbx-flex-col pbx-gap-1">
          <h3 class="pbx-myQuaternaryHeader">{{ translate('Configuration Overview') }}</h3>
          <p :class="isEmbedded ? 'pbx-editorSectionDesc' : 'pbx-myPrimaryParagraph pbx-text-xs'">
            {{
              translate(
                'A summary of current user preferences, application settings, and system metadata including UI theme, language, saved components, and logo configuration.',
              )
            }}
          </p>
        </div>
      </div>

      <p v-if="embeddedSection === 'overviewApp'" class="pbx-editorSectionDesc">
        {{ translate('Application version, resource metadata, logo, and form configuration.') }}
      </p>
      <p v-if="embeddedSection === 'overviewUser'" class="pbx-editorSectionDesc">
        {{ translate('Current user profile and saved application preferences.') }}
      </p>
      <p v-if="embeddedSection === 'overviewConfig'" class="pbx-editorSectionDesc">
        {{
          translate(
            'Complete configuration object currently used by the Page Builder. Includes user information, branding settings, and other context-specific data needed for rendering and managing the builder environment.',
          )
        }}
      </p>

      <div v-if="showOverviewApp" class="pbx-px-2">
        <div :class="showOverviewIntro ? overviewSectionSpacing : ''">
          <h4 class="pbx-myQuaternaryHeader pbx-text-sm pbx-mb-2">
            {{ translate('Version Information') }}
          </h4>
          <div
            class="pbx-overflow-hidden pbx-shadow pbx-ring-1 pbx-ring-black pbx-ring-opacity-5 md:pbx-rounded-lg"
          >
            <div class="pbx-overflow-x-auto">
              <table class="pbx-min-w-full">
                <thead class="pbx-bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                    >
                      {{ translate('App') }}
                    </th>
                    <th
                      scope="col"
                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                    >
                      {{ translate('Version') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="pbx-bg-white pbx-divide-y pbx-divide-gray-200">
                  <tr>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ translate('Page Builder') }}
                      </div>
                    </td>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        <span
                          class="pbx-inline-flex pbx-items-center pbx-px-2.5 pbx-py-0.5 pbx-rounded-full pbx-text-xs pbx-font-medium pbx-bg-blue-100 pbx-text-blue-800"
                        >
                          {{ version }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- Version Information Table - end -->

        <!-- Resource Data Table - start -->
        <div
          class="pbx-mt-4"
          v-if="
            getPageBuilderConfig?.resourceData && !isEmptyObject(getPageBuilderConfig.resourceData)
          "
        >
          <h4 class="pbx-myQuaternaryHeader pbx-text-sm pbx-mb-2">
            {{ translate('Resource Data') }}
          </h4>
          <div
            class="pbx-overflow-hidden pbx-shadow pbx-ring-1 pbx-ring-black pbx-ring-opacity-5 md:pbx-rounded-lg"
          >
            <div class="pbx-overflow-x-auto">
              <table class="pbx-min-w-full">
                <thead class="pbx-bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                    >
                      {{ translate('Property') }}
                    </th>
                    <th
                      scope="col"
                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                    >
                      {{ translate('Value') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="pbx-bg-white pbx-divide-y pbx-divide-gray-200">
                  <tr v-if="getPageBuilderConfig?.resourceData?.title">
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">{{ translate('Title') }}</div>
                    </td>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ getPageBuilderConfig.resourceData.title }}
                      </div>
                    </td>
                  </tr>
                  <tr v-if="getPageBuilderConfig?.resourceData?.id">
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">{{ translate('ID') }}</div>
                    </td>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ getPageBuilderConfig.resourceData.id }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- Resource Data Table - end -->
      </div>

      <div v-if="showOverviewUser" class="pbx-px-2">
        <!-- User Information Table - start -->
        <div
          :class="overviewSectionSpacing"
          v-if="
            getPageBuilderConfig?.userForPageBuilder &&
            !isEmptyObject(getPageBuilderConfig.userForPageBuilder)
          "
        >
          <h4 class="pbx-myQuaternaryHeader pbx-text-sm pbx-mb-2">
            {{ translate('User Information') }}
          </h4>
          <div
            class="pbx-overflow-hidden pbx-shadow pbx-ring-1 pbx-ring-black pbx-ring-opacity-5 md:pbx-rounded-lg"
          >
            <div class="pbx-overflow-x-auto">
              <table class="pbx-min-w-full">
                <thead class="pbx-bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                    >
                      {{ translate('Property') }}
                    </th>
                    <th
                      scope="col"
                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                    >
                      {{ translate('Value') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="pbx-bg-white pbx-divide-y pbx-divide-gray-200">
                  <tr>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ translate('User Name') }}
                      </div>
                    </td>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ getPageBuilderConfig.userForPageBuilder.name }}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">ID</div>
                    </td>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ getPageBuilderConfig.userForPageBuilder.id }}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">{{ translate('Image') }}</div>
                    </td>
                    <td
                      v-if="
                        getPageBuilderConfig.userForPageBuilder.image &&
                        typeof getPageBuilderConfig.userForPageBuilder.image === 'string' &&
                        getPageBuilderConfig.userForPageBuilder.image.length > 2
                      "
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        <div class="pbx-flex pbx-items-center pbx-space-x-3">
                          <img
                            class="pbx-block pbx-inset-0 pbx-object-top pbx-h-10 pbx-min-h-10 pbx-max-h-10 pbx-w-10 pbx-min-w-10 pbx-max-w-10 pbx-object-cover pbx-rounded-full"
                            :src="getPageBuilderConfig.userForPageBuilder.image"
                            alt="image"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ translate('Image URL') }}
                      </div>
                    </td>
                    <td
                      v-if="
                        getPageBuilderConfig.userForPageBuilder.image &&
                        typeof getPageBuilderConfig.userForPageBuilder.image === 'string' &&
                        getPageBuilderConfig.userForPageBuilder.image.length > 2
                      "
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ getPageBuilderConfig.userForPageBuilder.image }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- User Information Table - end -->

        <!-- User Settings Table - start -->
        <div
          class="pbx-mt-4"
          v-if="
            getPageBuilderConfig?.userSettings && !isEmptyObject(getPageBuilderConfig.userSettings)
          "
        >
          <h4 class="pbx-myQuaternaryHeader pbx-text-sm pbx-mb-2">
            {{ translate('User Settings') }}
          </h4>
          <div
            class="pbx-overflow-hidden pbx-shadow pbx-ring-1 pbx-ring-black pbx-ring-opacity-5 md:pbx-rounded-lg"
          >
            <div class="pbx-overflow-x-auto">
              <table class="pbx-min-w-full">
                <thead class="pbx-bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                    >
                      {{ translate('Setting') }}
                    </th>
                    <th
                      scope="col"
                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                    >
                      {{ translate('Value') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="pbx-bg-white pbx-divide-y pbx-divide-gray-200">
                  <tr v-if="getPageBuilderConfig?.userSettings?.language">
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">{{ translate('Language') }}</div>
                    </td>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ getPageBuilderConfig.userSettings.language }}
                      </div>
                    </td>
                  </tr>
                  <tr v-if="getPageBuilderConfig?.userSettings?.autoSave !== undefined">
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ translate('Auto Save') }}
                      </div>
                    </td>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        <span
                          class="pbx-inline-flex pbx-items-center pbx-px-2.5 pbx-py-0.5 pbx-rounded-full pbx-text-xs pbx-font-medium"
                          :class="
                            getPageBuilderConfig.userSettings.autoSave
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          "
                        >
                          {{
                            getPageBuilderConfig.userSettings.autoSave
                              ? translate('Enabled')
                              : translate('Disabled')
                          }}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="getPageBuilderConfig?.userSettings?.notifications !== undefined">
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ translate('Notifications') }}
                      </div>
                    </td>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        <span
                          class="pbx-inline-flex pbx-items-center pbx-px-2.5 pbx-py-0.5 pbx-rounded-full pbx-text-xs pbx-font-medium"
                          :class="
                            getPageBuilderConfig.userSettings.notifications
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          "
                        >
                          {{
                            getPageBuilderConfig.userSettings.notifications
                              ? translate('Enabled')
                              : translate('Disabled')
                          }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- User Settings Table - end -->
      </div>

      <div v-if="showOverviewApp" class="pbx-px-2">
        <!-- Page Builder Logo Table - start -->
        <div
          class="pbx-mt-4"
          v-if="
            getPageBuilderConfig &&
            getPageBuilderConfig.pageBuilderLogo &&
            !isEmptyObject(getPageBuilderConfig.pageBuilderLogo)
          "
        >
          <h4 class="pbx-myQuaternaryHeader pbx-text-sm pbx-mb-2">
            {{ translate('Logo Configuration') }}
          </h4>
          <div
            class="pbx-overflow-hidden pbx-shadow pbx-ring-1 pbx-ring-black pbx-ring-opacity-5 md:pbx-rounded-lg"
          >
            <div class="pbx-overflow-x-auto">
              <table class="pbx-min-w-full">
                <thead class="pbx-bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                    >
                      {{ translate('Property') }}
                    </th>
                    <th
                      scope="col"
                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                    >
                      {{ translate('Value') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="pbx-bg-white pbx-divide-y pbx-divide-gray-200">
                  <tr>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">{{ translate('Logo') }}</div>
                    </td>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        <div class="pbx-flex pbx-items-center pbx-space-x-3">
                          <img
                            class="pbx-h-4"
                            :src="getPageBuilderConfig.pageBuilderLogo.src"
                            alt="Logo"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">{{ translate('Logo URL') }}</div>
                    </td>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        <div class="pbx-flex pbx-items-center pbx-space-x-3">
                          <div class="pbx-pr-6">
                            <div class="pbx-flex pbx-items-center pbx-space-x-3">
                              <span class="pbx-whitespace-nowrap">{{
                                getPageBuilderConfig.pageBuilderLogo.src
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- Page Builder Logo Table - end -->

        <!-- Form Type Table - start -->
        <div
          class="pbx-mt-4"
          v-if="
            getPageBuilderConfig?.updateOrCreate &&
            !isEmptyObject(getPageBuilderConfig.updateOrCreate)
          "
        >
          <h4 class="pbx-myQuaternaryHeader pbx-text-sm pbx-mb-2">
            {{ translate('Form Type') }}
          </h4>
          <div
            class="pbx-overflow-hidden pbx-shadow pbx-ring-1 pbx-ring-black pbx-ring-opacity-5 md:pbx-rounded-lg"
          >
            <div class="pbx-overflow-x-auto">
              <table class="pbx-w-max pbx-min-w-full">
                <thead class="pbx-bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                    >
                      {{ translate('Mode') }}
                    </th>
                    <th
                      scope="col"
                      class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                    >
                      {{ translate('Description') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="pbx-bg-white pbx-divide-y pbx-divide-gray-200">
                  <tr>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ translate('Form Type') }}
                      </div>
                    </td>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        <span
                          class="pbx-inline-flex pbx-items-center pbx-px-2.5 pbx-py-0.5 pbx-rounded-full pbx-text-xs pbx-font-medium"
                          :class="
                            getPageBuilderConfig.updateOrCreate.formType === 'create'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          "
                        >
                          <span
                            v-if="
                              getPageBuilderConfig &&
                              getPageBuilderConfig.updateOrCreate.formType === 'create'
                            "
                          >
                            {{ getPageBuilderConfig.updateOrCreate.formType }}
                          </span>
                          <span
                            v-if="
                              getPageBuilderConfig &&
                              getPageBuilderConfig.updateOrCreate.formType === 'update'
                            "
                          >
                            {{ getPageBuilderConfig.updateOrCreate.formType }}
                          </span>
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-if="
                      getPageBuilderConfig.updateOrCreate.formName &&
                      getPageBuilderConfig.updateOrCreate.formName.length > 0
                    "
                  >
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        {{ translate('Form Name') }}
                      </div>
                    </td>
                    <td
                      class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                    >
                      <div class="pbx-min-w-[30rem] pbx-w-max">
                        <span
                          class="pbx-inline-flex pbx-items-center pbx-px-2.5 pbx-py-0.5 pbx-rounded-full pbx-text-xs pbx-font-medium"
                        >
                          {{ getPageBuilderConfig.updateOrCreate.formName }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- Form Type Table - end -->
      </div>

      <div v-if="showOverviewConfig" :class="showOverviewIntro ? 'pbx-mt-12' : ''">
        <div v-if="showOverviewIntro" class="pbx-flex pbx-items-left pbx-flex-col pbx-gap-1">
          <h3 class="pbx-myQuaternaryHeader">{{ translate('Complete Configuration Overview') }}</h3>
          <p class="pbx-myPrimaryParagraph pbx-text-xs">
            {{
              translate(
                'Complete configuration object currently used by the Page Builder. Includes user information, branding settings, and other context-specific data needed for rendering and managing the builder environment.',
              )
            }}
          </p>
        </div>

        <div
          class="pbx-mt-4 pbx-whitespace-pre-wrap pbx-text-white pbx-overflow-hidden pbx-bg-gray-900"
        >
          <div class="pbx-flex bg-gray-800/40 pbx-ring-1 ring-white/5">
            <div
              class="pbx-mb-px pbx-flex pbx-text-xs pbx-font-medium pbx-text-myPrimaryMediumGrayColor"
            >
              <div class="pbx-px-4 pbx-py-4 pbx-text-white">{{ translate('Configuration') }}</div>
            </div>
          </div>
          <div class="pbx-px-4 pbx-pb-8 pbx-pt-4 pbx-text-white pbx-text-xs pbx-break-all">
            <p class="pbx-myPrimaryParagraph pbx-text-xs pbx-text-white">
              config: {{ JSON.stringify(getPageBuilderConfig, null, 4) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- Overview tab end -->

    <!-- Download HTML tab start -->
    <div v-if="showDownload" :class="isEmbedded ? '' : 'pbx-min-h-screen pbx-mt-4'">
      <div v-if="Array.isArray(getComponents) && getComponents.length >= 1">
        <p class="pbx-editorSectionDesc" :class="isEmbedded ? '' : 'pbx-mb-10'">
          {{
            translate(
              'Export the entire page as a standalone HTML file. This includes all sections, content, and applied styles, making it ready for use or integration elsewhere.',
            )
          }}
        </p>
        <div class="pbx-editorFieldGroup">
          <button @click="handleDownloadHTML" type="button" class="pbx-myPrimaryButton">
            <span>
              {{ translate('Download HTML file') }}
            </span>
          </button>
        </div>
      </div>
      <div v-else>
        <p class="pbx-myPrimaryParagraph pbx-mt-6 pbx-text-gray-500">
          {{
            translate(
              'No components added yet. Add components to the page to enable HTML download.',
            )
          }}
        </p>
      </div>
    </div>
    <!-- Download HTML tab end -->

    <!-- Selected HTML tab start -->
    <div v-if="showSelectedHtml" :class="isEmbedded ? '' : 'pbx-min-h-screen pbx-mt-4'">
      <SelectedHtmlInspector />
    </div>
    <!-- Selected HTML tab end -->
  </div>
</template>
