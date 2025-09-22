<script setup>
import { ref, onMounted } from 'vue'
const unsplashKey = import.meta.env.VITE_UNSPLASH_KEY
import { usePageBuilderModal } from '../../composables/usePageBuilderModal'
import { delay } from '../../composables/delay'
import { preloadImage } from '../../composables/preloadImage'
import { getPageBuilder } from '../../composables/builderInstance'
import { useTranslations } from '../../composables/useTranslations'
const { translate } = useTranslations()

const pageBuilderService = getPageBuilder()

const { closeMediaLibraryModal } = usePageBuilderModal()

const getIsLoading = ref(false)
const getIsLoadingImage = ref(false)
const getSearchTerm = ref('')
const getCurrentPageNumber = ref(1)
const getOrientationValue = ref('')
const getApplyImageToSelection = ref('')
const getCurrentUser = ref('')

const getUnsplashImages = ref([])

const fetchUnsplash = async function () {
  getIsLoading.value = true
  await delay(300)
  localStorage.setItem('unsplash-query', getSearchTerm.value)
  localStorage.setItem('unsplash-page', getCurrentPageNumber.value)

  if (
    getUnsplashImages.value &&
    Array.isArray(getUnsplashImages.value.results) &&
    getUnsplashImages.value.results.length === 0
  ) {
    getCurrentPageNumber.value = 1
  }

  const orientationParam = getOrientationValue.value
    ? `&orientation=${getOrientationValue.value}`
    : ''

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=${getCurrentPageNumber.value}&per_page=24&query=${getSearchTerm.value || 'kinfolk'}${orientationParam}`,
      {
        headers: {
          'Accept-Version': 'v1',
          Authorization: `Client-ID ${unsplashKey}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const images = await response.json()
    getUnsplashImages.value = images
    getIsLoading.value = false
  } catch (error) {
    console.error('Error fetching Unsplash images:', error)
  } finally {
    getIsLoading.value = false
  }
}

const handleImageClick = async function (data) {
  getIsLoadingImage.value = true

  if (data.url) {
    await preloadImage(data.url)
  }

  await delay(100)
  getApplyImageToSelection.value = data.url || ''

  getIsLoadingImage.value = false
}

const searchByOrientation = function (orientationParameter) {
  // check if search term length is more than 0
  if (getOrientationValue.value !== orientationParameter) {
    getOrientationValue.value = orientationParameter
    getCurrentPageNumber.value = 1
    fetchUnsplash()
  }
}
//
// load images for previous page
const previousPage = function () {
  localStorage.setItem('unsplash-page', getCurrentPageNumber.value)
  fetchUnsplash()
}

// load images for next page
const nextPage = async function () {
  localStorage.setItem('unsplash-page', getCurrentPageNumber.value)
  fetchUnsplash()
}

const isLoading = ref(false)

const applySelectedImage = async function (imageURL) {
  isLoading.value = true
  await pageBuilderService.applySelectedImage({
    src: `${imageURL}`,
  })

  closeMediaLibraryModal()
  isLoading.value = false
}

// on mounted
onMounted(async () => {
  getSearchTerm.value = localStorage.getItem('unsplash-query') || 'kinfolk'
  getCurrentPageNumber.value = Number(localStorage.getItem('unsplash-page')) || 1

  await fetchUnsplash()
})
</script>

<template>
  <div>
    <div v-if="getIsLoading || isLoading" class="pbx-min-h-[98vh] pbx-h-[98vh]">
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
    <div v-if="!isLoading && !getIsLoading">
      <form
        @submit.prevent="
          () => {
            getCurrentPageNumber = 1
            fetchUnsplash()
          }
        "
      >
        <div class="pbx-mysearchBarWithOptions">
          <div class="pbx-relative pbx-w-full pbx-flex pbx-gap-2">
            <input
              type="search"
              id="search_query"
              v-model="getSearchTerm"
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

          <button
            @click="
              () => {
                getCurrentPageNumber = 1
                fetchUnsplash()
              }
            "
            type="submit"
            class="pbx-myPrimarySearchButton"
          >
            {{ translate('Search') }}
          </button>
        </div>
      </form>
      <div class="pbx-mt-2">
        <div
          v-if="getUnsplashImages && getUnsplashImages.results"
          class="pbx-flex lg:pbx-justify-between pbx-justify-end pbx-items-center pbx-gap-2 pbx-py-2 pbx-px-2 pbx-mb-1 pbx-rounded-full pbx-border-solid pbx-border pbx-border-gray-200 pbx-shadow-sm"
        >
          <div class="lg:pbx-flex pbx-hidden pbx-justify-left pbx-items-center pbx-gap-2">
            <button
              @click="searchByOrientation('landscape')"
              type="button"
              class="pbx-myPrimaryTag pbx-cursor-pointer"
              :class="{
                'pbx-bg-myPrimaryBrandColor pbx-text-white': getOrientationValue === 'landscape',
                '': getOrientationValue !== 'landscape',
              }"
            >
              {{ translate('Landscape') }}
            </button>
            <button
              @click="searchByOrientation('portrait')"
              type="button"
              class="pbx-myPrimaryTag pbx-cursor-pointer"
              :class="{
                'pbx-bg-myPrimaryBrandColor pbx-text-white': getOrientationValue === 'portrait',
                '': getOrientationValue !== 'portrait',
              }"
            >
              {{ translate('Portrait') }}
            </button>
            <button
              @click="searchByOrientation('squarish')"
              type="button"
              class="pbx-myPrimaryTag pbx-cursor-pointer"
              :class="{
                'pbx-bg-myPrimaryBrandColor pbx-text-white': getOrientationValue === 'squarish',
                '': getOrientationValue !== 'squarish',
              }"
            >
              {{ translate('Squarish') }}
            </button>

            <svg
              @click="searchByOrientation(null)"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="pbx-w-4 pbx-h-4 pbx-cursor-pointer"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <nav
            class="pbx-flex pbx-items-center pbx-gap-2 pbx-justify-start"
            aria-label="Pagination"
          >
            <p class="pbx-myPrimaryParagraph pbx-text-xs pbx-italic">
              {{ translate('Total pages') }} {{ getUnsplashImages.total_pages }}
            </p>
            <p class="pbx-myPrimaryParagraph pbx-text-xs pbx-italic">
              {{ translate('Images') }} {{ getUnsplashImages.total }}
            </p>
            <div
              class="pbx-flex pbx-flex-1 pbx-justify-between sm:pbx-justify-end pbx-items-center pbx-gap-2"
            >
              <span
                v-if="Number(getCurrentPageNumber) !== 1"
                class="pbx-myPrimaryParagraph pbx-text-xs pbx-italic pbx-pr-2 pbx-pl-1 pbx-cursor-pointer pbx-underline"
                @click="nextPage(Number((getCurrentPageNumber = 1)))"
              >
                {{ translate('First page') }}
              </span>
            </div>
            <button
              v-if="Number(getCurrentPageNumber) > 1"
              :disabled="Number(getCurrentPageNumber) < 1"
              class="pbx-myPrimaryTag pbx-cursor-pointer"
              @click="previousPage(Number(getCurrentPageNumber--))"
            >
              {{
                `${translate('Prev')} ${Number(getCurrentPageNumber) > 0 ? Number(getCurrentPageNumber) - 1 : Number(getCurrentPageNumber) - 1}`
              }}
            </button>

            <span class="pbx-myPrimaryTag pbx-py-2.5 pbx-px-4">
              {{ Number(getCurrentPageNumber) }}
            </span>
            <button
              :disabled="Number(getCurrentPageNumber) >= getUnsplashImages.total_pages"
              class="pbx-myPrimaryTag pbx-cursor-pointer"
              :class="{
                'pbx-opacity-50': Number(getCurrentPageNumber) >= getUnsplashImages.total_pages,
              }"
              @click="nextPage(Number(getCurrentPageNumber++))"
            >
              {{
                `${translate('Next')} ${Number(getCurrentPageNumber) > 0 ? Number(getCurrentPageNumber) + 1 : Number(getCurrentPageNumber) + 1}`
              }}
            </button>
          </nav>
        </div>

        <div class="pbx-min-h-full pbx-max-h-full pbx-flex pbx-gap-6">
          <div class="md:pbx-w-9/12 pbx-w-6/12 pbx-pr-1 pbx-rounded-lg pbx-overflow-y-auto">
            <div v-if="getUnsplashImages && getUnsplashImages.results">
              <div
                v-if="!getIsLoading"
                class="pbx-grid lg:pbx-grid-cols-6 md:pbx-grid-cols-4 sm:pbx-grid-cols-4 pbx-grid-cols-1 pbx-gap-2"
              >
                <div
                  v-for="image in getUnsplashImages.results"
                  :key="image.id"
                  @click="handleImageClick({ url: image.urls.regular, user: image.user.name })"
                  class="pbx-border-solid pbx-border pbx-border-gray-200 pbx-my-2 pbx-px-2 pbx-p-2 pbx-cursor-pointer"
                >
                  <img
                    :alt="image.user.name"
                    class="pbx-group pbx-block pbx-w-full pbx-overflow-hidden pbx-cursor-pointer"
                    :src="image.urls.thumb"
                  />
                  <p class="pbx-myPrimaryParagraph pbx-text-xs pbx-font-normal pbx-mt-2">
                    {{ translate('By:') }} {{ image.user.name }}
                  </p>
                </div>
              </div>
            </div>

            <div
              v-if="
                getUnsplashImages &&
                getUnsplashImages.results &&
                getUnsplashImages.results.length < 1
              "
            >
              <p class="pbx-myPrimaryParagraph pbx-py-4 pbx-px-4">
                <span v-if="getCurrentPageNumber === 1">
                  {{ translate('We did not find any images. Make a new search.') }}
                </span>
                <span
                  v-if="getCurrentPageNumber > 1"
                  @click="nextPage(1)"
                  class="pbx-myPrimaryLink"
                >
                  {{ translate('No results on current page. Navigate to First Page.') }}
                </span>
              </p>
            </div>
          </div>
          <!-- Sidebar # start -->
          <aside class="md:pbx-w-3/12 pbx-w-6/12 pbx-overflow-y-auto">
            <template v-if="getIsLoadingImage">
              <div class="pbx-flex pbx-items-center pbx-justify-center pbx-mt-4">
                <div
                  class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent pbx-align-[-0.125em] motion-reduce:pbx-animate-[spin_1.5s_linear_infinite]"
                >
                  <span
                    class="!pbx-absolute !pbx-m-px !pbx-h-px !pbx-w-px !pbx-overflow-hidden !pbx-whitespace-nowrap !pbx-border-0 !pbx-p-0 !pbx-[clip:rect(0,0,0,0)]"
                    >{{ translate('Loading...') }}</span
                  >
                </div>
              </div>
            </template>
            <template v-if="getApplyImageToSelection && !getIsLoadingImage">
              <img
                class="pbx-mx-auto pbx-block pbx-w-full pbx-object-cover pbx-object-center pbx-cursor-pointer"
                :src="`${getApplyImageToSelection}`"
                alt="file"
              />
              <div class="md:pbx-px-3 pbx-px-2">
                <div>
                  <p class="pbx-myPrimaryParagraph pbx-font-normal pbx-text-gray-900 pbx-pt-4">
                    {{ translate('Information') }}
                  </p>
                  <dl
                    class="pbx-mt-2 pbx-border-t pbx-border-b pbx-border-gray-200 pbx-divide-y pbx-divide-gray-200"
                  >
                    <div
                      class="pbx-py-3 pbx-flex pbx-justify-between pbx-text-sm pbx-font-normal pbx-items-center"
                    >
                      <dt class="pbx-text-gray-500">{{ translate('From:') }}</dt>
                      <dd class="pbx-text-gray-900">Unsplash</dd>
                    </div>
                    <div
                      class="pbx-py-3 pbx-flex pbx-justify-between pbx-text-sm pbx-font-normal pbx-items-center"
                    >
                      <dt class="pbx-text-gray-500">{{ translate('By:') }}</dt>
                      <dd class="pbx-text-gray-900">{{ getCurrentUser }}</dd>
                    </div>
                  </dl>
                </div>
                <div class="pbx-flex pbx-justify-end pbx-mt-4 pbx-w-full">
                  <button
                    v-if="getApplyImageToSelection && typeof getApplyImageToSelection === 'string'"
                    @click="applySelectedImage(getApplyImageToSelection)"
                    class="pbx-myPrimaryButton"
                    type="button"
                  >
                    {{ translate(' Select image') }}
                  </button>
                </div>
              </div>
            </template>
          </aside>
        </div>
        <!-- Sidebar # end -->
      </div>
      <div>
        <button class="pbx-sr-only">Focusable fallback</button>
      </div>
    </div>
  </div>
</template>
