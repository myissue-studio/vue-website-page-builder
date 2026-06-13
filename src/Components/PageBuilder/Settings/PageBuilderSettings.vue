<script setup lang="ts">
import { computed } from 'vue'
import { sharedPageBuilderStore } from '../../../stores/shared-store'

import { isEmptyObject } from '../../../helpers/isEmptyObject'
import { version } from '../../../../package.json'

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

const getPageBuilderConfig = computed(() => {
  return pageBuilderStateStore.getPageBuilderConfig
})
</script>

<template>
  <div
    class="pbx-w-full pbx-inset-x-0 pbx-h-[90vh] pbx-bg-white pbx-overflow-x-scroll lg:pbx-pt-2 pbx-pt-2"
  >
    <!-- Advanced Settings - start -->
    <div
      class="pbx-mt-4 pbx-mb-4 pbx-py-8 pbx-px-2 pbx-border pbx-border-solid pbx-border-gray-600 pbx-rounded-xl"
    >
      <!-- Advanced Settings - start -->
      <div>
        <div class="pbx-flex pbx-items-left pbx-flex-col pbx-gap-1">
          <h3 class="pbx-myQuaternaryHeader">Configuration Overview</h3>
          <p class="pbx-myPrimaryParagraph pbx-text-xs">
            A summary of current user preferences, application settings, and system metadata
            including UI theme, language, saved components, and logo configuration.
          </p>
        </div>

        <!-- Version Information Table - start -->
        <div class="pbx-px-2">
          <div class="pbx-mt-8">
            <h4 class="pbx-myQuaternaryHeader pbx-text-sm pbx-mb-2">Version Information</h4>
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
                        App
                      </th>
                      <th
                        scope="col"
                        class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                      >
                        Version
                      </th>
                    </tr>
                  </thead>
                  <tbody class="pbx-bg-white pbx-divide-y pbx-divide-gray-200">
                    <tr>
                      <td
                        class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                      >
                        <div class="pbx-min-w-[30rem] pbx-w-max">Page Builder</div>
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
              getPageBuilderConfig?.resourceData &&
              !isEmptyObject(getPageBuilderConfig.resourceData)
            "
          >
            <h4 class="pbx-myQuaternaryHeader pbx-text-sm pbx-mb-2">Resource Data</h4>
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
                        Property
                      </th>
                      <th
                        scope="col"
                        class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                      >
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody class="pbx-bg-white pbx-divide-y pbx-divide-gray-200">
                    <tr v-if="getPageBuilderConfig?.resourceData?.title">
                      <td
                        class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                      >
                        <div class="pbx-min-w-[30rem] pbx-w-max">Title</div>
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
                        <div class="pbx-min-w-[30rem] pbx-w-max">ID</div>
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

          <!-- User Information Table - start -->
          <div
            class="pbx-mt-8"
            v-if="
              getPageBuilderConfig?.userForPageBuilder &&
              !isEmptyObject(getPageBuilderConfig.userForPageBuilder)
            "
          >
            <h4 class="pbx-myQuaternaryHeader pbx-text-sm pbx-mb-2">User Information</h4>
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
                        Property
                      </th>
                      <th
                        scope="col"
                        class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                      >
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody class="pbx-bg-white pbx-divide-y pbx-divide-gray-200">
                    <tr>
                      <td
                        class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                      >
                        <div class="pbx-min-w-[30rem] pbx-w-max">User Name</div>
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
                        <div class="pbx-min-w-[30rem] pbx-w-max">Image</div>
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
                        <div class="pbx-min-w-[30rem] pbx-w-max">Image URL</div>
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
            class="pbx-mt-8"
            v-if="
              getPageBuilderConfig?.userSettings &&
              !isEmptyObject(getPageBuilderConfig.userSettings)
            "
          >
            <h4 class="pbx-myQuaternaryHeader pbx-text-sm pbx-mb-2">User Settings</h4>
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
                        Setting
                      </th>
                      <th
                        scope="col"
                        class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                      >
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody class="pbx-bg-white pbx-divide-y pbx-divide-gray-200">
                    <tr v-if="getPageBuilderConfig?.userSettings?.theme">
                      <td
                        class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                      >
                        <div class="pbx-min-w-[30rem] pbx-w-max">Theme</div>
                      </td>
                      <td
                        class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-text-gray-500"
                      >
                        <div class="pbx-min-w-[30rem] pbx-w-max">
                          {{ getPageBuilderConfig.userSettings.theme }}
                        </div>
                      </td>
                    </tr>
                    <tr v-if="getPageBuilderConfig?.userSettings?.language">
                      <td
                        class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                      >
                        <div class="pbx-min-w-[30rem] pbx-w-max">Language</div>
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
                        <div class="pbx-min-w-[30rem] pbx-w-max">Auto Save</div>
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
                              getPageBuilderConfig.userSettings.autoSave ? 'Enabled' : 'Disabled'
                            }}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="getPageBuilderConfig?.userSettings?.notifications !== undefined">
                      <td
                        class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                      >
                        <div class="pbx-min-w-[30rem] pbx-w-max">Notifications</div>
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
                                ? 'Enabled'
                                : 'Disabled'
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

          <!-- Page Builder Logo Table - start -->
          <div
            class="pbx-mt-8"
            v-if="
              getPageBuilderConfig &&
              getPageBuilderConfig.pageBuilderLogo &&
              !isEmptyObject(getPageBuilderConfig.pageBuilderLogo)
            "
          >
            <h4 class="pbx-myQuaternaryHeader pbx-text-sm pbx-mb-2">Logo Configuration</h4>
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
                        Property
                      </th>
                      <th
                        scope="col"
                        class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                      >
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody class="pbx-bg-white pbx-divide-y pbx-divide-gray-200">
                    <tr>
                      <td
                        class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                      >
                        <div class="pbx-min-w-[30rem] pbx-w-max">Logo</div>
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
                        <div class="pbx-min-w-[30rem] pbx-w-max">Logo URL</div>
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
            class="pbx-mt-8"
            v-if="
              getPageBuilderConfig?.updateOrCreate &&
              !isEmptyObject(getPageBuilderConfig.updateOrCreate)
            "
          >
            <h4 class="pbx-myQuaternaryHeader pbx-text-sm pbx-mb-2">Form Type</h4>
            <div
              class="pbx-overflow-hidden pbx-shadow pbx-ring-1 pbx-ring-black pbx-ring-opacity-5 md:pbx-rounded-lg"
            >
              <div class="pbx-overflow-x-auto">
                <table class="pbx-w-max">
                  <thead class="pbx-bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                      >
                        Mode
                      </th>
                      <th
                        scope="col"
                        class="pbx-px-6 pbx-py-3 pbx-text-left pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wider"
                      >
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody class="pbx-bg-white pbx-divide-y pbx-divide-gray-200">
                    <tr>
                      <td
                        class="pbx-px-6 pbx-py-4 pbx-whitespace-nowrap pbx-text-sm pbx-font-medium pbx-text-gray-900"
                      >
                        <div class="pbx-min-w-[30rem] pbx-w-max">Form Type</div>
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
                        <div class="pbx-min-w-[30rem] pbx-w-max">Form Name</div>
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
      </div>
    </div>
    <!-- Advanced Settings - end -->

    <!-- Congig - start -->
    <div
      class="pbx-mt-4 pbx-mb-4 pbx-py-8 pbx-px-2 pbx-border pbx-border-solid pbx-border-gray-600 pbx-rounded-xl"
    >
      <div class="pbx-flex pbx-items-left pbx-flex-col pbx-gap-1">
        <h3 class="pbx-myQuaternaryHeader">Complete Configuration Overview</h3>
        <p class="pbx-myPrimaryParagraph pbx-text-xs">
          Complete configuration object currently used by the Page Builder. Includes user
          information, branding settings, and other context-specific data needed for rendering and
          managing the builder environment.
        </p>
      </div>

      <div
        class="pbx-mt-4 pbx-whitespace-pre-wrap pbx-text-white pbx-overflow-hidden pbx-bg-gray-900"
      >
        <div class="pbx-flex bg-gray-800/40 pbx-ring-1 ring-white/5">
          <div
            class="pbx-mb-px pbx-flex pbx-text-xs pbx-font-medium pbx-text-myPrimaryMediumGrayColor"
          >
            <div class="pbx-px-4 pbx-py-4 pbx-text-white">Configuration</div>
          </div>
        </div>
        <div class="pbx-px-4 pbx-pb-8 pbx-pt-4 pbx-text-white pbx-text-xs pbx-break-all">
          <p class="pbx-myPrimaryParagraph pbx-text-xs pbx-text-white">
            config: {{ JSON.stringify(getPageBuilderConfig, null, 4) }}
          </p>
        </div>
      </div>
    </div>
    <!-- Config - end -->
  </div>
</template>
