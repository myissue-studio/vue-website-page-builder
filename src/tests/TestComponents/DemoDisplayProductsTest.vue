<script setup lang="ts">
import { computed, ref } from 'vue'
import { getPageBuilder } from '../../composables/usePageBuilder'
import { usePageBuilderModal } from '../../composables/usePageBuilderModal'
import type {
  PageBuilderProduct,
  ProductCardStyle,
  ProductGridLayout,
  ProductMobileColumns,
} from '../../types'
import { useTranslations } from '../../composables/useTranslations'
import { useToast } from '../../composables/useToast'
import ProductSectionSettingsFields from '../../Components/PageBuilder/EditorMenu/Editables/ProductSectionSettingsFields.vue'
import {
  PRODUCT_CARD_STYLE_OPTIONS,
  PRODUCT_LAYOUT_OPTIONS,
  productsHaveButtons,
  productsHaveImages,
  productsHavePrices,
  productsHaveLinks,
} from '../../utils/builder/product-section-options'
import productsArray from '../productsArray.test.json'

const pageBuilderService = getPageBuilder()
const { closeProductLibraryModal } = usePageBuilderModal()
const { translate } = useTranslations()
const { showToast } = useToast()

const isLoading = ref(false)
const searchQuery = ref('')
const products = productsArray as PageBuilderProduct[]
const selectedMap = ref<Map<string | number | PageBuilderProduct, PageBuilderProduct>>(new Map())
const layout = ref<ProductGridLayout>('grid-3')
const mobileColumns = ref<ProductMobileColumns>(2)
const cardStyle = ref<ProductCardStyle>('minimal')
const roundedImages = ref(true)
const openInNewTab = ref(true)
const hidePrice = ref(false)
const hideImage = ref(false)
const hideButton = ref(false)

const catalogHasPrices = computed(() => productsHavePrices(products))
const catalogHasImages = computed(() => productsHaveImages(products))
const catalogHasButtons = computed(() => productsHaveButtons(products))
const catalogHasLinks = computed(() => productsHaveLinks(products))

const layoutOptions = PRODUCT_LAYOUT_OPTIONS
const cardStyleOptions = PRODUCT_CARD_STYLE_OPTIONS

function productKey(product: PageBuilderProduct): string | number | PageBuilderProduct {
  if (product.id != null) return product.id
  if (product.title != null) return product.title
  return product
}

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const list = !query
    ? products
    : products.filter((product) => {
        const haystack = [product.title, product.description, product.sku, product.badge]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(query)
      })
  const seen = new Set<string | number | PageBuilderProduct>()
  return list.filter((product) => {
    const key = productKey(product)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})

const selectedProducts = computed(() => Array.from(selectedMap.value.values()))

const activeLayout = computed(
  () => layoutOptions.find((option) => option.value === layout.value) ?? layoutOptions[0],
)

const activeCardStyle = computed(
  () => cardStyleOptions.find((option) => option.value === cardStyle.value) ?? cardStyleOptions[0],
)

function toggleProduct(product: PageBuilderProduct) {
  const key = productKey(product)
  const next = new Map(selectedMap.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.set(key, product)
  }
  selectedMap.value = next
}

function isSelected(product: PageBuilderProduct): boolean {
  return selectedMap.value.has(productKey(product))
}

function removeProduct(product: PageBuilderProduct) {
  const next = new Map(selectedMap.value)
  next.delete(productKey(product))
  selectedMap.value = next
}

const STANDARD_PRODUCT_FIELDS = new Set([
  'id',
  'title',
  'description',
  'image',
  'imageAlt',
  'price',
  'compareAtPrice',
  'badge',
  'url',
  'buttonText',
  'sku',
])

function customFieldEntries(product: PageBuilderProduct): [string, unknown][] {
  return Object.entries(product).filter(
    ([key, value]) => !STANDARD_PRODUCT_FIELDS.has(key) && value != null && value !== '',
  )
}

async function insertSelectedProducts() {
  if (!selectedProducts.value.length) return
  isLoading.value = true
  await pageBuilderService.insertProducts(selectedProducts.value, {
    layout: layout.value,
    mobileColumns: mobileColumns.value,
    cardStyle: cardStyle.value,
    roundedImages: roundedImages.value,
    openInNewTab: openInNewTab.value,
    hidePrice: hidePrice.value,
    hideImage: hideImage.value,
    hideButton: hideButton.value,
  })
  showToast(translate('Products added to page'), 'success')
  closeProductLibraryModal()
  isLoading.value = false
}
</script>

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
      <form @submit.prevent>
        <div class="pbx-mysearchBarWithOptions">
          <div class="pbx-relative pbx-w-full pbx-flex pbx-gap-2">
            <label for="search-products" class="pbx-sr-only">{{
              translate('Search products')
            }}</label>
            <input
              v-model="searchQuery"
              type="search"
              id="search-products"
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

      <div class="pbx-mt-4">
        <ProductSectionSettingsFields
          v-model:layout="layout"
          v-model:mobile-columns="mobileColumns"
          v-model:card-style="cardStyle"
          v-model:rounded-images="roundedImages"
          v-model:open-in-new-tab="openInNewTab"
          v-model:hide-price="hidePrice"
          v-model:hide-image="hideImage"
          v-model:hide-button="hideButton"
          :has-product-prices="catalogHasPrices"
          :has-product-images="catalogHasImages"
          :has-product-buttons="catalogHasButtons"
          :has-product-links="catalogHasLinks"
          :translate="translate"
        />
      </div>

      <div class="pbx-mt-6 pbx-mb-12">
        <div>
          <div class="pbx-min-h-full pbx-max-h-full pbx-flex pbx-gap-6">
            <div class="md:pbx-w-9/12 pbx-w-full pbx-pr-1 pbx-rounded-lg pbx-overflow-y-auto">
              <div
                v-if="filteredProducts.length"
                class="pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 md:pbx-grid-cols-3 pbx-gap-4"
              >
                <button
                  v-for="product in filteredProducts"
                  :key="String(products.indexOf(product))"
                  type="button"
                  class="pbx-group pbx-text-left pbx-relative pbx-overflow-hidden pbx-rounded-2xl pbx-border pbx-p-3 pbx-transition-all pbx-duration-150"
                  :class="
                    isSelected(product)
                      ? 'pbx-bg-myPrimaryLinkColor/10 pbx-shadow-md'
                      : 'pbx-border-gray-200 pbx-bg-white hover:pbx-border-gray-300 hover:pbx-shadow-sm'
                  "
                  :aria-pressed="isSelected(product)"
                  @click="toggleProduct(product)"
                >
                  <div
                    v-if="product.image"
                    class="pbx-relative pbx-overflow-hidden pbx-rounded-xl pbx-aspect-square"
                  >
                    <img
                      :src="product.image"
                      :alt="product.imageAlt ?? product.title ?? 'Product'"
                      class="pbx-object-cover pbx-w-full pbx-h-full pbx-transition-transform pbx-duration-200 group-hover:pbx-scale-[1.02]"
                    />
                    <div
                      v-if="isSelected(product)"
                      class="pbx-absolute pbx-inset-0 pbx-bg-myPrimaryLinkColor/20 pbx-pointer-events-none"
                    />
                    <div
                      class="pbx-absolute pbx-top-2 pbx-right-2 pbx-flex pbx-h-8 pbx-w-8 pbx-items-center pbx-justify-center pbx-rounded-full pbx-shadow-sm pbx-transition-colors"
                      :class="
                        isSelected(product)
                          ? 'pbx-bg-myPrimaryLinkColor pbx-text-white'
                          : 'pbx-bg-white/90 pbx-text-gray-400 pbx-border pbx-border-gray-200'
                      "
                    >
                      <span class="material-symbols-outlined pbx-text-lg">
                        {{ isSelected(product) ? 'check' : 'add' }}
                      </span>
                    </div>
                    <span
                      v-if="product.badge"
                      class="pbx-absolute pbx-top-2 pbx-left-2 pbx-rounded-full pbx-bg-white/95 pbx-px-2.5 pbx-py-0.5 pbx-text-[10px] pbx-font-semibold pbx-uppercase pbx-tracking-wide pbx-text-gray-700 pbx-shadow-sm"
                    >
                      {{ product.badge }}
                    </span>
                  </div>

                  <div v-else class="pbx-flex pbx-items-center pbx-justify-between pbx-pb-1">
                    <span
                      v-if="product.badge"
                      class="pbx-rounded-full pbx-bg-gray-100 pbx-px-2.5 pbx-py-0.5 pbx-text-[10px] pbx-font-semibold pbx-uppercase pbx-tracking-wide pbx-text-gray-500"
                    >
                      {{ product.badge }}
                    </span>
                    <span v-else />
                    <div
                      class="pbx-flex pbx-h-8 pbx-w-8 pbx-items-center pbx-justify-center pbx-rounded-full pbx-shadow-sm pbx-transition-colors"
                      :class="
                        isSelected(product)
                          ? 'pbx-bg-myPrimaryLinkColor pbx-text-white'
                          : 'pbx-bg-white/90 pbx-text-gray-400 pbx-border pbx-border-gray-200'
                      "
                    >
                      <span class="material-symbols-outlined pbx-text-lg">
                        {{ isSelected(product) ? 'check' : 'add' }}
                      </span>
                    </div>
                  </div>

                  <div class="pbx-pt-3 pbx-px-1">
                    <p
                      class="pbx-myPrimaryParagraph pbx-text-sm pbx-font-semibold pbx-line-clamp-2"
                    >
                      {{ product.title }}
                    </p>
                    <p
                      v-if="product.price != null"
                      class="pbx-myPrimaryParagraph pbx-pt-1 pbx-text-lg pbx-font-semibold"
                    >
                      {{ product.price }}
                    </p>
                    <div
                      v-if="customFieldEntries(product).length"
                      class="pbx-mt-1 pbx-flex pbx-flex-wrap pbx-gap-x-2 pbx-gap-y-0.5"
                    >
                      <span
                        v-for="[key, value] in customFieldEntries(product)"
                        :key="key"
                        class="pbx-text-xs pbx-text-gray-500 pbx-truncate"
                      >
                        {{ value }}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
              <p v-else class="pbx-myPrimaryParagraph pbx-text-sm pbx-text-gray-400 pbx-px-2">
                {{ translate('No products found.') }}
              </p>
            </div>

            <aside class="md:pbx-w-3/12 pbx-hidden md:pbx-block pbx-overflow-y-auto">
              <div class="pbx-min-h-[10rem]">
                <div class="pbx-modalSidebarPanel pbx-mt-4">
                  <p class="pbx-modalSidebarPanelTitle">{{ translate('Information') }}</p>
                  <div class="pbx-modalSidebarStatGrid">
                    <div
                      class="pbx-modalSidebarStatCard"
                      :class="{ 'pbx-modalSidebarStatCard--active': selectedProducts.length > 0 }"
                    >
                      <span class="pbx-modalSidebarStatLabel">{{ translate('Selected') }}</span>
                      <p class="pbx-modalSidebarStatValue">{{ selectedProducts.length }}</p>
                    </div>

                    <div class="pbx-modalSidebarStatCard pbx-modalSidebarStatCard--active">
                      <span class="pbx-modalSidebarStatLabel">{{ translate('Grid layout') }}</span>
                      <p class="pbx-modalSidebarStatValue pbx-text-sm">
                        {{ translate(activeLayout.labelKey) }}
                      </p>
                      <p class="pbx-modalSidebarStatHint">
                        {{
                          layout !== 'grid-1' && mobileColumns === 2
                            ? translate('Two products per row')
                            : translate(activeLayout.hintKey)
                        }}
                      </p>
                    </div>

                    <div
                      v-if="openInNewTab"
                      class="pbx-modalSidebarStatCard pbx-modalSidebarStatCard--active"
                    >
                      <span class="pbx-modalSidebarStatLabel">{{
                        translate('Open in new tab')
                      }}</span>
                      <p class="pbx-modalSidebarStatValue pbx-text-sm">
                        {{ translate('Open in new tab') }}
                      </p>
                      <p class="pbx-modalSidebarStatHint">
                        {{ translate('Product links open in a new browser tab') }}
                      </p>
                    </div>

                    <div class="pbx-modalSidebarStatCard pbx-modalSidebarStatCard--active">
                      <span class="pbx-modalSidebarStatLabel">{{ translate('Card style') }}</span>
                      <p class="pbx-modalSidebarStatValue pbx-text-sm">
                        {{ translate(activeCardStyle.labelKey) }}
                      </p>
                      <p class="pbx-modalSidebarStatHint">
                        {{
                          roundedImages
                            ? translate('Rounded photo corners')
                            : translate(activeCardStyle.hintKey)
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <div v-if="selectedProducts.length" class="pbx-modalSidebarSelectedList">
                  <p class="pbx-modalSidebarSelectedTitle">{{ translate('Selected') }}</p>
                  <div
                    v-for="product in selectedProducts"
                    :key="String(products.indexOf(product))"
                    class="pbx-modalSidebarSelectedItem"
                  >
                    <img
                      v-if="product.image"
                      :src="product.image"
                      :alt="product.imageAlt ?? product.title ?? 'Product'"
                      class="pbx-h-12 pbx-w-12 pbx-shrink-0 pbx-rounded-lg pbx-object-cover"
                    />
                    <div class="pbx-min-w-0 pbx-flex-1">
                      <p class="pbx-myPrimaryParagraph pbx-text-sm pbx-font-medium pbx-truncate">
                        {{ product.title }}
                      </p>
                      <p
                        v-if="product.price != null"
                        class="pbx-myPrimaryParagraph pbx-text-xs pbx-text-gray-500"
                      >
                        {{ product.price }}
                      </p>
                    </div>
                    <button
                      type="button"
                      class="pbx-select-none pbx-h-9 pbx-w-9 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryErrorColor hover:pbx-text-white pbx-text-myPrimaryErrorColor"
                      :aria-label="translate('Remove')"
                      :title="translate('Remove')"
                      @click.stop="removeProduct(product)"
                    >
                      <span class="material-symbols-outlined pbx-text-lg">close</span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="pbx-flex pbx-justify-end pbx-mt-4 pbx-w-full">
                <button
                  type="button"
                  class="pbx-myPrimaryButton pbx-w-full"
                  :disabled="!selectedProducts.length"
                  @click="insertSelectedProducts"
                >
                  {{ translate('Insert products') }}
                </button>
              </div>
            </aside>
          </div>

          <div
            class="pbx-flex md:pbx-hidden pbx-flex-col pbx-gap-3 pbx-mt-6 pbx-rounded-2xl pbx-border-solid pbx-border pbx-border-gray-200 pbx-bg-white pbx-p-3"
          >
            <div class="pbx-modalSidebarStatGrid">
              <div
                class="pbx-modalSidebarStatCard"
                :class="{ 'pbx-modalSidebarStatCard--active': selectedProducts.length > 0 }"
              >
                <span class="pbx-modalSidebarStatLabel">{{ translate('Selected') }}</span>
                <p class="pbx-modalSidebarStatValue">{{ selectedProducts.length }}</p>
              </div>
              <div class="pbx-modalSidebarStatCard pbx-modalSidebarStatCard--active">
                <span class="pbx-modalSidebarStatLabel">{{ translate('Grid layout') }}</span>
                <p class="pbx-modalSidebarStatValue pbx-text-sm">
                  {{ translate(activeLayout.labelKey) }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="pbx-myPrimaryButton pbx-w-full"
              :disabled="!selectedProducts.length"
              @click="insertSelectedProducts"
            >
              {{ translate('Insert products') }}
            </button>
          </div>
        </div>
      </div>

      <div>
        <button class="pbx-sr-only">Focusable fallback</button>
      </div>
    </div>
  </div>
</template>
