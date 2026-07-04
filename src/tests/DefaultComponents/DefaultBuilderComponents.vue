<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import componentHelpers from '../../utils/html-elements/componentHelpers'
import components from '../../utils/html-elements/component'
import themes from '../../utils/html-elements/themes'
import { usePageBuilderModal } from '../../composables/usePageBuilderModal'
import type { ComponentObject } from '../../types'
import { getPageBuilder } from '../../composables/usePageBuilder'
import { useTranslations } from '../../composables/useTranslations'
import ComponentThumbnail from '../../Components/ComponentThumbnail.vue'
import ModalFilterChip from '../../Components/Modals/ModalFilterChip.vue'
import ModalLibraryCard from '../../Components/Modals/ModalLibraryCard.vue'

function categoryIcon(category: string): string {
  const icons: Record<string, string> = {
    All: 'apps',
    Text: 'title',
    Media: 'perm_media',
    Layout: 'view_quilt',
    Buttons: 'smart_button',
    Components: 'widgets',
    Themes: 'palette',
  }
  return icons[category] ?? 'category'
}

function helperIconName(helper: { icon: string; category: string }): string {
  const match = helper.icon.match(/>\s*([a-z0-9_]+)\s*</)
  if (match?.[1]) return match[1]
  return categoryIcon(helper.category)
}

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
      <form @submit.prevent>
        <div class="pbx-mysearchBarWithOptions">
          <div class="pbx-relative pbx-w-full pbx-flex pbx-gap-2">
            <input
              v-model="searchQuery"
              type="search"
              id="search-components"
              class="pbx-myPrimarySearchInput pbx-w-full pbx-pl-10 pbx-border-0"
              autocomplete="off"
              :placeholder="translate('Search...')"
            />
            <div
              class="pbx-flex pbx-absolute pbx-inset-y-0 pbx-left-0 pbx-items-center pbx-pl-3 pbx-pointer-events-none"
            >
              <span class="material-symbols-outlined"> search </span>
            </div>
          </div>

          <button type="submit" class="pbx-myPrimarySearchButton">
            {{ translate('Search') }}
          </button>
        </div>
      </form>

      <div class="pbx-modalFilterBar">
        <span class="pbx-modalFilterBarTitle">{{ translate('Browse') }}</span>
        <div class="pbx-modalFilterBarChips">
          <ModalFilterChip
            v-for="category in componentOrThemes"
            :key="category"
            :icon="category === 'Themes' ? 'palette' : 'widgets'"
            :label="translate(category)"
            :hint="category === 'Themes' ? translate('Full page themes') : translate('Building blocks')"
            :active="selectedThemeSelection === category"
            @click="selectedThemeSelection = category"
          />
        </div>
      </div>

      <div class="pbx-min-h-[96rem] pbx-mb-12">
        <!-- theme is selected start -->
        <template v-if="selectedThemeSelection === 'Themes'">
          <div class="pbx-mb-8">
            <h3 class="pbx-myQuaternaryHeader pbx-mb-4">{{ translate('Themes') }}</h3>
            <div class="pbx-modalFilterBar">
              <span class="pbx-modalFilterBarTitle">{{ translate('Category') }}</span>
              <div class="pbx-modalFilterBarChips">
                <ModalFilterChip
                  v-for="category in themeCategories"
                  :key="category"
                  :icon="categoryIcon(category)"
                  :label="translate(category)"
                  :active="selectedThemeCategory === category"
                  @click="selectedThemeCategory = category"
                />
              </div>
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
            <div class="pbx-modalFilterBar">
              <span class="pbx-modalFilterBarTitle">{{ translate('Category') }}</span>
              <div class="pbx-modalFilterBarChips">
                <ModalFilterChip
                  v-for="category in helperCategories"
                  :key="category"
                  :icon="categoryIcon(category)"
                  :label="translate(category)"
                  :active="selectedHelperCategory === category"
                  @click="selectedHelperCategory = category"
                />
              </div>
            </div>
            <div class="pbx-min-h-[10rem] pbx-max-h-[30rem] pbx-overflow-y-auto">
              <div
                v-if="filteredHelpers.length"
                class="pbx-px-2 pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-3 pbx-gap-3"
              >
                <ModalLibraryCard
                  v-for="helper in filteredHelpers"
                  :key="helper.title"
                  :icon="helperIconName(helper)"
                  :label="translate(helper.title)"
                  :hint="translate(helper.category)"
                  @click="handleDropComponent(helper)"
                />
              </div>
              <p v-else class="pbx-myPrimaryParagraph pbx-text-sm pbx-text-gray-400 pbx-px-2">
                {{ translate('No components found.') }}
              </p>
            </div>
          </div>

          <!-- Regular Components Section -->
          <div class="pbx-px-2">
            <h3 class="pbx-myQuaternaryHeader pbx-mb-4">{{ translate('Layout Components') }}</h3>
            <div class="pbx-modalFilterBar">
              <span class="pbx-modalFilterBarTitle">{{ translate('Category') }}</span>
              <div class="pbx-modalFilterBarChips">
                <ModalFilterChip
                  v-for="category in categories"
                  :key="category"
                  :icon="categoryIcon(category)"
                  :label="translate(category)"
                  :active="selectedCategory === category"
                  @click="selectedCategory = category"
                />
              </div>
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
