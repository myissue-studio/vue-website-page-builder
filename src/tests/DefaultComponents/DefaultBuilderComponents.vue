<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import componentHelpers from '../../utils/html-elements/componentHelpers'
import components from '../../utils/html-elements/component'
import themes from '../../utils/html-elements/themes'
import { usePageBuilderModal } from '../../composables/usePageBuilderModal'
import type { ComponentObject } from '../../types'
import { getPageBuilder } from '../../composables/builderInstance'
import { useTranslations } from '../../composables/useTranslations'
import ComponentThumbnail from '../../Components/ComponentThumbnail.vue'

const { translate } = useTranslations()

const pageBuilderService = getPageBuilder()

defineProps({
  customMediaComponent: {
    type: Object,
    default: null,
  },
})

const isLoading = ref(false)

const searchQuery = ref('')

const selectedThemeSelection = ref('Components')

const componentOrThemes = computed(() => {
  return ['Components', 'Themes']
})
const selectedCategory = ref('All')

const selectedHelperCategory = ref('All')

const helperCategories = computed(() => {
  const allCategories = componentHelpers.map((comp) => comp.category)
  return ['All', ...new Set(allCategories)]
})

const categories = computed(() => {
  const allCategories = components[0].components.data.map((comp) => comp.category)
  return ['All', ...new Set(allCategories)]
})

const filteredComponents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const byCategory =
    !query && selectedCategory.value !== 'All'
      ? components[0].components.data.filter((comp) => comp.category === selectedCategory.value)
      : components[0].components.data
  if (!query) return byCategory
  return byCategory.filter((comp) => comp.title.toLowerCase().includes(query))
})

// ---------------------------------------------------------------------------
// Pagination for Layout Components
// ---------------------------------------------------------------------------
const COMPONENTS_PER_PAGE = 12
const componentsPage = ref(1)

const componentsTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredComponents.value.length / COMPONENTS_PER_PAGE)),
)

const pagedComponents = computed(() => {
  const start = (componentsPage.value - 1) * COMPONENTS_PER_PAGE
  return filteredComponents.value.slice(start, start + COMPONENTS_PER_PAGE)
})

// Reset to first page whenever the filter or search changes.
watch([selectedCategory, searchQuery], () => {
  componentsPage.value = 1
})

const filteredHelpers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const byCategory =
    !query && selectedHelperCategory.value !== 'All'
      ? componentHelpers.filter((comp) => comp.category === selectedHelperCategory.value)
      : componentHelpers
  if (!query) return byCategory
  return byCategory.filter((comp) => comp.title.toLowerCase().includes(query))
})

const selectedThemeCategory = ref('All')

const themeCategories = computed(() => {
  const allCategories = themes[0].themes.data.map((comp) => comp.category)
  return ['All', ...new Set(allCategories)]
})

const filteredThemes = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const byCategory =
    !query && selectedThemeCategory.value !== 'All'
      ? themes[0].themes.data.filter((comp) => comp.category === selectedThemeCategory.value)
      : themes[0].themes.data
  if (!query) return byCategory
  return byCategory.filter((comp) => comp.title.toLowerCase().includes(query))
})

// Get modal close function
const { closeAddComponentModal } = usePageBuilderModal()

// Super simple component addition with professional modal closing!
const handleDropTheme = async function (themeHtml: string) {
  isLoading.value = true

  // Translate all occurrences of hardcoded strings in the theme HTML
  const translatedThemeHtml = themeHtml
    .replace(/Layouts and visual\./g, translate('Layouts and visual.'))
    .replace(
      /Start customizing by editing this default text directly in the editor\./g,
      translate('Start customizing by editing this default text directly in the editor.'),
    )

  await pageBuilderService.addTheme(translatedThemeHtml)
  closeAddComponentModal()
  isLoading.value = false
}

// Super simple component addition with professional modal closing!
const handleDropComponent = async function (componentObject: ComponentObject) {
  isLoading.value = true
  // Translate all occurrences of the hardcoded strings in the html_code
  const translatedHtmlCode = componentObject.html_code
    .replace(/Layouts and visual\./g, translate('Layouts and visual.'))
    .replace(
      /Start customizing by editing this default text directly in the editor\./g,
      translate('Start customizing by editing this default text directly in the editor.'),
    )

  // Create a new component object with the translated html_code and title
  const translatedComponentObject = {
    ...componentObject,
    html_code: translatedHtmlCode,
    title: componentObject.title,
  }

  await pageBuilderService.addComponent(translatedComponentObject)
  closeAddComponentModal()
  isLoading.value = false
}

// Helper function to convert ComponentData to ComponentObject
const convertToComponentObject = function (comp: {
  title: string
  html_code: string
}): ComponentObject {
  return {
    id: null, // Generate ID when needed in PageBuilderClass
    html_code: comp.html_code,
    title: comp.title,
  }
}
</script>

<style scoped>
/* Add any additional styling if needed */
.category-button {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 8px 16px;
  margin: 4px;
  cursor: pointer;
  border-radius: 4px;
}
.category-button.active {
  background-color: #007bff;
  border-color: #007bff;
}
</style>

<template>
  <div>
    <template v-if="isLoading">
      <div class="pbx-min-h-[90vh] pbx-h-[90vh]">
        <div class="pbx-flex pbx-items-center pbx-justify-center">
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
    </template>
    <div v-if="!isLoading">
      <!-- Search input -->
      <div
        class="pbx-flex pbx-justify-between pbx-items-center pbx-gap-4 pbx-border pbx-border-gray-200 pbx-py-4 pbx-px-3 pbx-rounded-lg"
      >
        <label class="pbx-myPrimaryInputLabel" for="search-components">{{
          translate('Search components...')
        }}</label>
        <input
          v-model="searchQuery"
          id="search-components"
          type="text"
          :placeholder="translate('Search components...')"
          class="pbx-myPrimaryInput"
        />
      </div>

      <div
        class="pbx-mb-4 pbx-flex pbx-jusitify-left pbx-items-center pbx-gap-2 pbx-border-0 pbx-border-solid pbx-border-b pbx-border-gray-200 pbx-pb-4 pbx-overflow-auto pbx-pt-6"
      >
        <button
          v-for="category in componentOrThemes"
          :key="category"
          @click="selectedThemeSelection = category"
          class="pbx-mySecondaryButton pbx-text-xs pbx-px-4"
          :class="[
            selectedThemeSelection === category
              ? 'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white'
              : 'hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white',
          ]"
        >
          <span class="material-symbols-outlined">{{
            category === 'Themes' ? 'landscape_2' : 'wheat'
          }}</span>
          <span>
            {{ translate(category) }}
          </span>
        </button>
      </div>

      <div class="pbx-min-h-[96rem] pbx-mb-12">
        <!-- theme is selected start -->
        <template v-if="selectedThemeSelection === 'Themes'">
          <div class="pbx-mb-8">
            <h3 class="pbx-myQuaternaryHeader pbx-mb-4">{{ translate('Themes') }}</h3>
            <div
              class="pbx-mb-4 pbx-flex pbx-jusitify-left pbx-items-center pbx-gap-2 pbx-border-0 pbx-border-solid pbx-border-b pbx-border-gray-200 pbx-pb-4 pbx-overflow-auto pbx-pt-6"
            >
              <button
                v-for="category in themeCategories"
                :key="category"
                @click="selectedThemeCategory = category"
                class="pbx-mySecondaryButton pbx-text-xs pbx-px-4"
                :class="[
                  selectedThemeCategory === category
                    ? 'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white'
                    : 'hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white',
                ]"
              >
                {{ translate(category) }}
              </button>
            </div>

            <div>
              <div
                v-if="filteredThemes.length"
                class="pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 pbx-gap-4"
              >
                <div
                  v-for="theme in filteredThemes"
                  :key="theme.title"
                  class="pbx-px-2 pbx-border-solid pbx-border pbx-border-gray-400 pbx-overflow-hidden hover:pbx-border-myPrimaryLinkColor pbx-duration-100 pbx-cursor-pointer pbx-min-h-[40rem]"
                  @click="handleDropTheme(theme.html_code)"
                >
                  <ComponentThumbnail :htmlCode="theme.html_code" :maxHeight="9999" fit="contain" />
                </div>
              </div>
              <p
                v-if="!filteredThemes.length"
                class="pbx-myPrimaryParagraph pbx-text-sm pbx-text-gray-400"
              >
                {{ translate('No themes found.') }}
              </p>
            </div>
          </div>
        </template>
        <!-- theme is selected end -->

        <template v-if="selectedThemeSelection === 'Components'">
          <!-- Helper Components Section -->
          <div class="pbx-mb-8">
            <h3 class="pbx-myQuaternaryHeader pbx-mb-4">{{ translate('Helper Components') }}</h3>

            <!-- Helper category filter -->
            <div
              class="pbx-mb-4 pbx-flex pbx-jusitify-left pbx-items-center pbx-gap-2 pbx-border-0 pbx-border-solid pbx-border-b pbx-border-gray-200 pbx-pb-4 pbx-overflow-auto pbx-pt-6"
            >
              <button
                v-for="category in helperCategories"
                :key="category"
                @click="selectedHelperCategory = category"
                class="pbx-mySecondaryButton pbx-text-xs pbx-px-4"
                :class="[
                  selectedHelperCategory === category
                    ? 'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white'
                    : 'hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white',
                ]"
              >
                {{ translate(category) }}
              </button>
            </div>
            <div class="pbx-min-h-[10rem] pbx-max-h-[30rem] pbx-overflow-y-auto">
              <div
                v-if="filteredHelpers.length"
                class="pbx-px-2 pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 md:pbx-grid-cols-3 lg:pbx-grid-cols-4 pbx-gap-4"
              >
                <div
                  v-for="helper in filteredHelpers"
                  :key="helper.title"
                  class="pbx-px-2 pbx-border-solid pbx-border pbx-border-gray-400 pbx-overflow-hidden hover:pbx-border-myPrimaryLinkColor pbx-duration-100 pbx-cursor-pointer pbx-max-h-96 pbx-p-4 pbx-rounded-3xl pbx-bg-gray-50"
                  @click="handleDropComponent(helper)"
                >
                  <div class="pbx-max-h-72 pbx-cursor-pointer pbx-object-contain pbx-mx-auto">
                    <div v-if="false" class="pbx-mr-2" v-html="helper.icon"></div>
                    <h4 class="pbx-myPrimaryParagraph pbx-text-base pbx-font-medium">
                      {{ translate(helper.title) }}
                    </h4>
                  </div>
                  <div class="pbx-myPrimaryParagraph pbx-text-xs pbx-font-normal pbx-pt-2">
                    {{ translate('Click to add') }} {{ helper.title.toLowerCase() }}
                    {{ translate('component') }}
                  </div>
                </div>
              </div>
              <p v-else class="pbx-myPrimaryParagraph pbx-text-sm pbx-text-gray-400 pbx-px-2">
                {{ translate('No components found.') }}
              </p>
            </div>
          </div>

          <!-- Regular Components Section -->
          <div class="pbx-px-2">
            <h3 class="pbx-myQuaternaryHeader pbx-mb-4">{{ translate('Layout Components') }}</h3>
            <div
              class="pbx-mb-4 pbx-flex pbx-jusitify-left pbx-items-center pbx-gap-2 pbx-border-0 pbx-border-solid pbx-border-b pbx-border-gray-200 pbx-pb-4 pbx-overflow-auto pbx-pt-6"
            >
              <button
                v-for="category in categories"
                :key="category"
                @click="selectedCategory = category"
                class="pbx-mySecondaryButton pbx-text-xs pbx-px-4"
                :class="[
                  selectedCategory === category
                    ? 'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white'
                    : 'hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white',
                ]"
              >
                {{ translate(category) }}
              </button>
            </div>

            <div>
              <div
                v-if="pagedComponents.length"
                class="pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 md:pbx-grid-cols-3 pbx-gap-4"
              >
                <div
                  v-for="comp in pagedComponents"
                  :key="comp.title"
                  class="pbx-px-2 pbx-border-solid pbx-border pbx-border-gray-400 pbx-overflow-hidden hover:pbx-border-myPrimaryLinkColor pbx-duration-100 pbx-cursor-pointer pbx-min-h-[25rem]"
                  @click="handleDropComponent(convertToComponentObject(comp))"
                >
                  <ComponentThumbnail :htmlCode="comp.html_code" fit="contain" />
                </div>
              </div>
              <p
                v-if="!filteredComponents.length"
                class="pbx-myPrimaryParagraph pbx-text-sm pbx-text-gray-400"
              >
                {{ translate('No components found.') }}
              </p>

              <!-- Pagination controls -->
              <div
                v-if="componentsTotalPages > 1"
                class="pbx-flex lg:pbx-justify-between pbx-justify-end pbx-items-center pbx-gap-2 pbx-py-2 pbx-px-2 pbx-mb-3 pbx-rounded-full pbx-border-solid pbx-border pbx-border-gray-200 pbx-shadow-sm pbx-mt-6"
              >
                <button
                  type="button"
                  class="pbx-mySecondaryButton pbx-text-xs pbx-px-4"
                  :disabled="componentsPage === 1"
                  :class="componentsPage === 1 ? 'pbx-opacity-40 pbx-cursor-not-allowed' : ''"
                  @click="componentsPage--"
                >
                  {{ translate('Previous') }}
                </button>

                <div class="pbx-flex pbx-items-center pbx-gap-1">
                  <button
                    v-for="page in componentsTotalPages"
                    :key="page"
                    type="button"
                    class="pbx-mySecondaryButton"
                    :class="
                      page === componentsPage
                        ? 'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white'
                        : 'hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white'
                    "
                    @click="componentsPage = page"
                  >
                    {{ page }}
                  </button>
                </div>

                <button
                  type="button"
                  class="pbx-mySecondaryButton pbx-text-xs pbx-px-4"
                  :disabled="componentsPage === componentsTotalPages"
                  :class="
                    componentsPage === componentsTotalPages
                      ? 'pbx-opacity-40 pbx-cursor-not-allowed'
                      : ''
                  "
                  @click="componentsPage++"
                >
                  {{ translate('Next') }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div>
        <button class="pbx-sr-only">Focusable fallback</button>
      </div>
    </div>
  </div>
</template>
