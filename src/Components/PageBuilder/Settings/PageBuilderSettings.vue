<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { ComputedRef } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'
import { isEmptyObject } from '../../../utils/is-empty-object'
import { version } from '../../../../package.json'
import { useTranslations } from '../../../composables/useTranslations'
import { useToast } from '../../../composables/useToast'
import SelectedHtmlInspector from '../EditorMenu/Editables/SelectedHtmlInspector.vue'
import {
  downloadStandaloneHtml,
  getStandalonePageHtml,
} from '../../../utils/builder/standalone-html'
import {
  isExpiredPreviewCredential,
  loadTemporaryPreview,
  publishTemporaryPreview,
  removeTemporaryPreview,
  saveTemporaryPreview,
} from '../../../utils/builder/temp-preview'
import type { TemporaryPreview } from '../../../utils/builder/temp-preview'

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
const { showToast } = useToast()
const showTemporaryPreviewButton = inject<ComputedRef<boolean>>(
  'showTemporaryPreviewButton',
  computed(() => false),
)

const isEmbedded = computed(() => Boolean(props.embeddedSection))

const isOverviewSlice = computed(() =>
  ['overviewApp', 'overviewUser', 'overviewConfig'].includes(props.embeddedSection ?? ''),
)

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

const temporaryPreviewStorageKey = computed(() => {
  const resourceId = getPageBuilderConfig.value?.resourceData?.id
  const scope = pageBuilderStateStore.getLocalStorageItemName ?? resourceId ?? 'page'
  return `vue-website-page-builder:temp-preview:${String(scope)}`
})
const temporaryPreview = ref<TemporaryPreview | null>(
  loadTemporaryPreview(temporaryPreviewStorageKey.value),
)
const temporaryPreviewLoading = ref(false)
const temporaryPreviewRemoving = ref(false)
const temporaryPreviewError = ref('')

function getCurrentStandaloneHtml(): string | null {
  const pagebuilder = document.getElementById('pagebuilder')
  if (!pagebuilder) return null
  return getStandalonePageHtml(pagebuilder, document)
}

function handleDownloadHTML() {
  const html = getCurrentStandaloneHtml()
  if (!html) return
  downloadStandaloneHtml('downloaded_html.html', html)
  showToast(translate('HTML file downloaded'), 'success')
}

async function handlePublishTemporaryPreview() {
  const html = getCurrentStandaloneHtml()
  if (!html) return
  temporaryPreviewLoading.value = true
  temporaryPreviewError.value = ''
  let wasUpdate = Boolean(temporaryPreview.value)

  try {
    let published: TemporaryPreview
    try {
      published = await publishTemporaryPreview(html, temporaryPreview.value ?? undefined)
    } catch (error) {
      if (!temporaryPreview.value || !isExpiredPreviewCredential(error)) throw error
      temporaryPreview.value = null
      wasUpdate = false
      saveTemporaryPreview(temporaryPreviewStorageKey.value, null)
      published = await publishTemporaryPreview(html)
    }
    temporaryPreview.value = published
    saveTemporaryPreview(temporaryPreviewStorageKey.value, published)
    showToast(
      translate(wasUpdate ? 'Temporary preview updated' : 'Temporary preview published'),
      'success',
    )
  } catch (error) {
    temporaryPreviewError.value =
      error instanceof Error ? error.message : translate('Could not publish temporary preview')
    showToast(translate('Could not publish temporary preview'), 'error')
  } finally {
    temporaryPreviewLoading.value = false
  }
}

async function handleCopyTemporaryPreview() {
  if (!temporaryPreview.value) return
  try {
    await navigator.clipboard.writeText(temporaryPreview.value.canonicalUrl)
    showToast(translate('Preview link copied'), 'success')
  } catch {
    showToast(translate('Clipboard unavailable'), 'error')
  }
}

async function handleRemoveTemporaryPreview() {
  if (
    !temporaryPreview.value ||
    !window.confirm(translate('Remove this temporary preview permanently?'))
  ) {
    return
  }

  temporaryPreviewRemoving.value = true
  temporaryPreviewError.value = ''
  try {
    await removeTemporaryPreview(temporaryPreview.value)
    temporaryPreview.value = null
    saveTemporaryPreview(temporaryPreviewStorageKey.value, null)
    showToast(translate('Temporary preview removed'), 'success')
  } catch (error) {
    temporaryPreviewError.value =
      error instanceof Error ? error.message : translate('Could not remove temporary preview')
    showToast(translate('Could not remove temporary preview'), 'error')
  } finally {
    temporaryPreviewRemoving.value = false
  }
}

function formatExpiry(expiresAt?: string | null): string {
  if (!expiresAt) return ''
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(expiresAt),
  )
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

      <div
        v-if="showOverviewApp"
        class="pbx-px-2 pbx-settingsSectionGroup"
        :class="showOverviewIntro && !isEmbedded ? 'pbx-mt-8' : ''"
      >
        <div class="pbx-settingsSection">
          <h4 class="pbx-settingsSectionTitle">
            {{ translate('Version Information') }}
          </h4>
          <div
            class="pbx-overflow-hidden pbx-shadow-xs md:pbx-rounded-lg pbx-border pbx-border-gray-200"
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
          class="pbx-settingsSection"
          v-if="
            getPageBuilderConfig?.resourceData && !isEmptyObject(getPageBuilderConfig.resourceData)
          "
        >
          <h4 class="pbx-settingsSectionTitle">
            {{ translate('Resource Data') }}
          </h4>
          <div
            class="pbx-overflow-hidden pbx-shadow-xs md:pbx-rounded-lg pbx-border pbx-border-gray-200"
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

        <!-- Page Builder Logo Table - start -->
        <div
          class="pbx-settingsSection"
          v-if="
            getPageBuilderConfig &&
            getPageBuilderConfig.pageBuilderLogo &&
            !isEmptyObject(getPageBuilderConfig.pageBuilderLogo)
          "
        >
          <h4 class="pbx-settingsSectionTitle">
            {{ translate('Logo Configuration') }}
          </h4>
          <div
            class="pbx-overflow-hidden pbx-shadow-xs md:pbx-rounded-lg pbx-border pbx-border-gray-200"
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
                        <span class="pbx-whitespace-nowrap">{{
                          getPageBuilderConfig.pageBuilderLogo.src
                        }}</span>
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
          class="pbx-settingsSection"
          v-if="
            getPageBuilderConfig?.updateOrCreate &&
            !isEmptyObject(getPageBuilderConfig.updateOrCreate)
          "
        >
          <h4 class="pbx-settingsSectionTitle">
            {{ translate('Form Type') }}
          </h4>
          <div
            class="pbx-overflow-hidden pbx-shadow-xs md:pbx-rounded-lg pbx-border pbx-border-gray-200"
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
                              ? 'pbx-bg-green-100 pbx-text-green-800'
                              : 'pbx-bg-blue-100 pbx-text-blue-800'
                          "
                        >
                          {{ getPageBuilderConfig.updateOrCreate.formType }}
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

      <div v-if="showOverviewUser" class="pbx-px-2 pbx-settingsSectionGroup">
        <!-- User Information Table - start -->
        <div
          class="pbx-settingsSection"
          v-if="
            getPageBuilderConfig?.userForPageBuilder &&
            !isEmptyObject(getPageBuilderConfig.userForPageBuilder)
          "
        >
          <h4 class="pbx-settingsSectionTitle">
            {{ translate('User Information') }}
          </h4>
          <div
            class="pbx-overflow-hidden pbx-shadow-xs md:pbx-rounded-lg pbx-border pbx-border-gray-200"
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
          class="pbx-settingsSection"
          v-if="
            getPageBuilderConfig?.userSettings && !isEmptyObject(getPageBuilderConfig.userSettings)
          "
        >
          <h4 class="pbx-settingsSectionTitle">
            {{ translate('User Settings') }}
          </h4>
          <div
            class="pbx-overflow-hidden pbx-shadow-xs md:pbx-rounded-lg pbx-border pbx-border-gray-200"
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
                              ? 'pbx-bg-green-100 pbx-text-green-800'
                              : 'pbx-bg-red-100 pbx-text-red-800'
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
                              ? 'pbx-bg-green-100 pbx-text-green-800'
                              : 'pbx-bg-red-100 pbx-text-red-800'
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

      <div
        v-if="showOverviewConfig"
        class="pbx-settingsSectionGroup"
        :class="showOverviewIntro ? 'pbx-mt-12' : ''"
      >
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
          class="pbx-settingsSection pbx-whitespace-pre-wrap pbx-text-white pbx-overflow-hidden pbx-bg-gray-900"
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
          <button
            @click="handleDownloadHTML"
            type="button"
            class="pbx-myPrimaryButton pbx-w-full sm:pbx-w-full"
          >
            <span>
              {{ translate('Download HTML file') }}
            </span>
          </button>
        </div>

        <div
          v-if="showTemporaryPreviewButton"
          class="pbx-editorFieldGroup pbx-mt-6 pbx-pt-6 pbx-border-0 pbx-border-solid pbx-border-t pbx-border-gray-200"
        >
          <h4 class="pbx-myQuaternaryHeader">{{ translate('Temporary preview') }}</h4>
          <p class="pbx-editorSectionDesc pbx-mt-2">
            {{
              translate(
                'Publish a public preview link that expires after 7 days. Nothing is uploaded until you click publish.',
              )
            }}
            <a
              href="https://temp.md"
              target="_blank"
              rel="noopener noreferrer"
              class="pbx-text-gray-700 pbx-underline"
              >Temp.md</a
            >
          </p>

          <button
            @click="handlePublishTemporaryPreview"
            type="button"
            class="pbx-myPrimaryButton pbx-mt-3 pbx-w-full sm:pbx-w-full"
            :disabled="temporaryPreviewLoading || temporaryPreviewRemoving"
          >
            {{
              temporaryPreviewLoading
                ? translate('Publishing...')
                : translate(
                    temporaryPreview ? 'Update temporary preview' : 'Publish temporary preview',
                  )
            }}
          </button>

          <div v-if="temporaryPreview" class="pbx-mt-4 pbx-flex pbx-flex-col pbx-gap-3">
            <div
              class="pbx-rounded-xl pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-gray-50 pbx-px-3.5 pbx-py-3"
            >
              <p
                class="pbx-m-0 pbx-mb-1.5 pbx-text-[10px] pbx-font-semibold pbx-uppercase pbx-tracking-wider pbx-text-gray-400"
              >
                {{ translate('Live link') }}
              </p>
              <a
                :href="temporaryPreview.canonicalUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="pbx-block pbx-text-sm pbx-font-medium pbx-text-gray-900 pbx-break-all pbx-no-underline hover:pbx-text-myPrimaryLinkColor"
              >
                {{ temporaryPreview.canonicalUrl }}
              </a>
              <div
                v-if="temporaryPreview.expiresAt"
                class="pbx-mt-2.5 pbx-flex pbx-items-center pbx-gap-1.5 pbx-text-xs pbx-text-gray-500"
              >
                <span
                  class="material-symbols-outlined pbx-text-base pbx-leading-none"
                  aria-hidden="true"
                >
                  schedule
                </span>
                <span>
                  {{ translate('Expires') }}
                  <span class="pbx-font-medium pbx-text-gray-700">{{
                    formatExpiry(temporaryPreview.expiresAt)
                  }}</span>
                </span>
              </div>
            </div>

            <div class="pbx-flex pbx-flex-col pbx-gap-2">
              <button
                @click="handleCopyTemporaryPreview"
                type="button"
                class="pbx-mySecondaryButton pbx-w-full sm:pbx-w-full"
              >
                <span>{{ translate('Copy link') }}</span>
                <span
                  class="material-symbols-outlined pbx-text-base pbx-leading-none"
                  aria-hidden="true"
                >
                  content_copy
                </span>
              </button>
              <a
                :href="temporaryPreview.canonicalUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="pbx-mySecondaryButton pbx-w-full sm:pbx-w-full pbx-no-underline"
              >
                <span>{{ translate('Open preview') }}</span>
                <span
                  class="material-symbols-outlined pbx-text-base pbx-leading-none"
                  aria-hidden="true"
                >
                  open_in_new
                </span>
              </a>
              <button
                @click="handleRemoveTemporaryPreview"
                type="button"
                class="pbx-mySecondaryButton pbx-w-full sm:pbx-w-full"
                :disabled="temporaryPreviewLoading || temporaryPreviewRemoving"
              >
                <span>
                  {{
                    temporaryPreviewRemoving
                      ? translate('Removing...')
                      : translate('Remove preview')
                  }}
                </span>
                <span
                  class="material-symbols-outlined pbx-text-base pbx-leading-none"
                  aria-hidden="true"
                >
                  delete_forever
                </span>
              </button>
            </div>
          </div>
          <p v-if="temporaryPreviewError" class="pbx-mt-3 pbx-text-xs pbx-text-red-700">
            {{ temporaryPreviewError }}
          </p>
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
