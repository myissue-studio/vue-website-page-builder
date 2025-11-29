## Integrate Unsplash Library

Easily add Unsplash image search to your media library modal—just like in the demo!
A code example is provided so you can copy-paste to get started.

# Unsplash Integration Guide

This guide shows you how to add Unsplash image search to your custom media library modal in the Vue Website Page Builder.
You can use the code below almost as-is—just add your Unsplash API key and connect it to your modal.

## Custom Media Library Component

By default, the Page Builder does not include a built-in media library.

First You may extend the Page Builder by adding your own media library.
Inject your media library component easily to tailor the builder to your application's needs.

```vue
<template>
  <div>
    <PageBuilder :CustomMediaLibraryComponent="YourMediaLibraryComponent" />
  </div>
</template>
```

## Example: Unsplash Media Library

You can copy following this code into your own media library modal and customize the UI as needed.  
For a full working example, see the demo project or reach out for support!

> **Security Note:**  
> For production use, it is recommended to fetch Unsplash images from your own backend server, not directly from the frontend.  
> If you use the Unsplash API key in frontend code, it will be visible in browser devtools and can be misused.  
> Instead, create a backend endpoint that proxies Unsplash requests and keeps your API key secure.  
> Your frontend can then fetch images from your backend and render them as shown in the example below.

```vue
<script setup>
import { ref, onMounted } from 'vue'
const unsplashKey = import.meta.env.VITE_UNSPLASH_KEY

import { getPageBuilder, usePageBuilderModal } from '@myissue/vue-website-page-builder'

// Retrieve Page Builder service instance
const pageBuilderService = getPageBuilder()

const { closeMediaLibraryModal } = usePageBuilderModal()

const getIsLoading = ref(false)
const getSearchTerm = ref('')
const getCurrentPageNumber = ref(1)
const getOrientationValue = ref('')
const getCurrentImage = ref('')
const getCurrentUser = ref('')

const getUnsplashImages = ref([])

const fetchUnsplash = async function () {
  getIsLoading.value = true

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
      `https://api.unsplash.com/search/photos?page=${
        getCurrentPageNumber.value
      }&per_page=24&query=${getSearchTerm.value || 'kinfolk'}${orientationParam}`,
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
  getCurrentImage.value = data.url || ''
}

const searchByOrientation = function (orientationParameter) {
  if (getOrientationValue.value !== orientationParameter) {
    getOrientationValue.value = orientationParameter
    getCurrentPageNumber.value = 1
    fetchUnsplash()
  }
}

const previousPage = function () {
  localStorage.setItem('unsplash-page', getCurrentPageNumber.value)
  fetchUnsplash()
}

const nextPage = async function () {
  localStorage.setItem('unsplash-page', getCurrentPageNumber.value)
  fetchUnsplash()
}

const useImage = async function (imageURL) {
  await pageBuilderService.applySelectedImage({
    src: `${imageURL}`,
  })

  closeMediaLibraryModal()
}

onMounted(async () => {
  getSearchTerm.value = localStorage.getItem('unsplash-query') || 'kinfolk'
  getCurrentPageNumber.value = Number(localStorage.getItem('unsplash-page')) || 1

  await fetchUnsplash()
})
</script>

<template>
  <div>
    <div>
      <form
        @submit.prevent="
          () => {
            getCurrentPageNumber = 1
            fetchUnsplash()
          }
        "
      >
        <label
          for="default-search"
          class="mb-2 text-sm font-normal text-gray-900 sr-only dark:text-gray-300"
          >Search</label
        >

        <div class="mysearchBarWithOptions">
          <div class="relative w-full">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <span class="material-symbols-outlined"> search </span>
            </div>
            <input
              type="search"
              id="search_query"
              v-model="getSearchTerm"
              class="myPrimarySearchInput"
              autocomplete="off"
              placeholder="Search..."
            />
          </div>

          <button
            @click="
              () => {
                getCurrentPageNumber = 1
                fetchUnsplash()
              }
            "
            type="submit"
            class="myPrimaryTag break-keep mr-4"
          >
            Search
          </button>
        </div>
      </form>
      <div class="mt-2">
        <div
          v-if="getUnsplashImages && getUnsplashImages.results"
          class="flex lg:justify-between justify-end items-center gap-2 py-2 px-2 mb-1 rounded-full border border-gray-200 shadow-sm"
        >
          <div class="lg:flex hidden justify-left items-center gap-2">
            <button
              @click="searchByOrientation('landscape')"
              type="button"
              class="myPrimaryTag"
              :class="{
                'bg-myPrimaryBrandColor text-white': getOrientationValue === 'landscape',
                '': getOrientationValue !== 'landscape',
              }"
            >
              Landscape
            </button>
            <button
              @click="searchByOrientation('portrait')"
              type="button"
              class="myPrimaryTag"
              :class="{
                'bg-myPrimaryBrandColor text-white': getOrientationValue === 'portrait',
                '': getOrientationValue !== 'portrait',
              }"
            >
              Portrait
            </button>
            <button
              @click="searchByOrientation('squarish')"
              type="button"
              class="myPrimaryTag"
              :class="{
                'bg-myPrimaryBrandColor text-white': getOrientationValue === 'squarish',
                '': getOrientationValue !== 'squarish',
              }"
            >
              Squarish
            </button>

            <svg
              @click="searchByOrientation(null)"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4 cursor-pointer"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <nav class="flex items-center gap-2 justify-start" aria-label="Pagination">
            <p class="myPrimaryParagraph text-xs italic">
              Total pages {{ getUnsplashImages.total_pages }}
            </p>
            <p class="myPrimaryParagraph text-xs italic">Images {{ getUnsplashImages.total }}</p>
            <div class="flex flex-1 justify-between sm:justify-end items-center gap-2">
              <span
                v-if="Number(getCurrentPageNumber) !== 1"
                class="myPrimaryParagraph text-xs italic pr-2 pl-1 cursor-pointer underline"
                @click="nextPage(Number((getCurrentPageNumber = 1)))"
              >
                First page
              </span>
            </div>
            <button
              v-if="Number(getCurrentPageNumber) > 1"
              :disabled="Number(getCurrentPageNumber) < 1"
              class="myPrimaryTag"
              @click="previousPage(Number(getCurrentPageNumber--))"
            >
              {{
                `Prev ${
                  Number(getCurrentPageNumber) > 0
                    ? Number(getCurrentPageNumber) - 1
                    : Number(getCurrentPageNumber) - 1
                }`
              }}
            </button>

            <span class="myPrimaryTag py-2.5 px-4">
              {{ Number(getCurrentPageNumber) }}
            </span>
            <button
              :disabled="Number(getCurrentPageNumber) >= getUnsplashImages.total_pages"
              class="myPrimaryTag"
              :class="{
                'opacity-50': Number(getCurrentPageNumber) >= getUnsplashImages.total_pages,
              }"
              @click="nextPage(Number(getCurrentPageNumber++))"
            >
              {{
                `Next ${
                  Number(getCurrentPageNumber) > 0
                    ? Number(getCurrentPageNumber) + 1
                    : Number(getCurrentPageNumber) + 1
                }`
              }}
            </button>
          </nav>
        </div>

        <div class="min-h-dvh flex gap-6">
          <div class="w-9/12 pr-1 rounded-lg overflow-y-auto">
            <div v-if="getIsLoading">
              <div class="flex items-center justify-center mt-4">
                <div
                  class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                >
                  <span
                    class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >Loading...</span
                  >
                </div>
              </div>
            </div>
            <div v-if="getUnsplashImages && getUnsplashImages.results">
              <div
                v-if="!getIsLoading"
                class="grid md:grid-cols-4 sm:grid-cols-4 grid-cols-2 gap-2"
              >
                <div
                  v-for="image in getUnsplashImages.results"
                  :key="image.id"
                  @click="
                    handleImageClick({
                      url: image.urls.regular,
                      user: image.user.name,
                    })
                  "
                  class="border border-gray-200 my-2 px-2 p-2 cursor-pointer"
                >
                  <img
                    :alt="image.user.name"
                    class="group block w-full overflow-hidden cursor-pointer"
                    :src="image.urls.thumb"
                  />
                  <p class="myPrimaryParagraph text-xs font-normal mt-2">
                    By: {{ image.user.name }}
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
              <p class="myPrimaryParagraph py-4 px-4">
                <span v-if="getCurrentPageNumber === 1">
                  We did not find any images. Make a new search.
                </span>
                <span v-if="getCurrentPageNumber > 1" @click="nextPage(1)" class="myPrimaryLink">
                  No results on current page. Navigate to First Page.
                </span>
              </p>
            </div>
          </div>
          <!-- Sidebar # start -->
          <aside class="w-3/12 overflow-y-auto">
            <template v-if="getCurrentImage">
              <img
                class="mx-auto block w-full object-cover object-center cursor-pointer"
                :src="`${getCurrentImage}`"
                alt="file"
              />
              <div class="md:px-3 px-2">
                <div>
                  <p class="myPrimaryParagraph font-normal text-gray-900 pt-4">Information</p>
                  <dl class="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                    <div class="py-3 flex justify-between text-sm font-normal items-center">
                      <dt class="text-gray-500">From:</dt>
                      <dd class="text-gray-900">Unsplash</dd>
                    </div>
                    <div class="py-3 flex justify-between text-sm font-normal items-center">
                      <dt class="text-gray-500">By:</dt>
                      <dd class="text-gray-900">
                        {{ getCurrentUser }}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </template>
          </aside>
        </div>
        <!-- Sidebar # end -->

        <!-- Actions footer # start -->
        <div class="bg-slate-50 px-2 py-4 flex sm:justify-end justify-center gap-3">
          <button
            @click="
              () => {
                closeMediaLibraryModal()
                localStorage.setItem('unsplash-page', getCurrentPageNumber)
              }
            "
            class="mySecondaryButton focus:ring-2 focus:ring-blue-500"
            type="button"
          >
            Close
          </button>
          <button
            v-if="getCurrentImage && typeof getCurrentImage === 'string'"
            @click="useImage(getCurrentImage)"
            class="myPrimaryButton focus:ring-2 focus:ring-blue-500"
            type="button"
          >
            Select image
          </button>
        </div>
        <!-- Actions footer # end -->
      </div>
    </div>

    <div>
      <button class="sr-only">Focusable fallback</button>
    </div>
  </div>
</template>
```

**Tip:**

- Make sure to set your Unsplash API key in your environment variables.
