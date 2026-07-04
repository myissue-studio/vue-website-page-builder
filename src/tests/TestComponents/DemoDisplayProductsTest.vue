<script setup lang="ts">
import { computed, ref } from 'vue'
import { getPageBuilder } from '../../composables/usePageBuilder'
import { usePageBuilderModal } from '../../composables/usePageBuilderModal'
import type { PageBuilderProduct, ProductGridLayout } from '../../types'
import { useTranslations } from '../../composables/useTranslations'
import ModalFilterChip from '../../Components/Modals/ModalFilterChip.vue'
import productsArray from '../productsArray.test.json'

const pageBuilderService = getPageBuilder()
const { closeProductLibraryModal } = usePageBuilderModal()
const { translate } = useTranslations()

const isLoading = ref(false)
const searchQuery = ref('')
const products = productsArray as PageBuilderProduct[]
const selectedIds = ref<Set<string | number>>(new Set())
const layout = ref<ProductGridLayout>('grid-3')

const layoutOptions: {
  value: ProductGridLayout
  labelKey: string
  icon: string
  hintKey: string
}[] = [
  { value: 'grid-1', labelKey: '1 product', icon: 'view_agenda', hintKey: 'Full width' },
  { value: 'grid-2', labelKey: '2 products (grid)', icon: 'view_column', hintKey: '2 columns' },
  { value: 'grid-3', labelKey: '3 products (grid)', icon: 'grid_view', hintKey: '3 columns' },
  { value: 'grid-4', labelKey: '4 products (grid)', icon: 'grid_on', hintKey: '4 columns' },
  { value: 'grid-6', labelKey: '6 products (grid)', icon: 'apps', hintKey: '6 columns' },
]

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return products
  return products.filter((product) => {
    const haystack = [product.title, product.description, product.sku, product.badge]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  })
})

const selectedProducts = computed(() =>
  products.filter((product) => product.id != null && selectedIds.value.has(product.id)),
)

function toggleProduct(id: string | number) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  selectedIds.value = next
}

function isSelected(id: string | number | undefined) {
  return id != null && selectedIds.value.has(id)
}

function removeProduct(id: string | number) {
  const next = new Set(selectedIds.value)
  next.delete(id)
  selectedIds.value = next
}

async function insertSelectedProducts() {
  if (!selectedProducts.value.length) return
  isLoading.value = true
  await pageBuilderService.insertProducts(selectedProducts.value, {
    layout: layout.value,
  })
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

      <div class="pbx-modalFilterBar">
        <span class="pbx-modalFilterBarTitle">{{ translate('Grid layout') }}</span>
        <div class="pbx-modalFilterBarChips">
          <ModalFilterChip
            v-for="option in layoutOptions"
            :key="option.value"
            :icon="option.icon"
            :label="translate(option.labelKey)"
            :hint="translate(option.hintKey)"
            :active="layout === option.value"
            @click="layout = option.value"
          />
        </div>
      </div>

      <div class="pbx-mb-12">
        <div class="pbx-px-2">
          <div class="pbx-min-h-full pbx-max-h-full pbx-flex pbx-gap-6">
            <div class="md:pbx-w-9/12 pbx-w-full pbx-pr-1 pbx-rounded-lg pbx-overflow-y-auto">
              <div
                v-if="filteredProducts.length"
                class="pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 md:pbx-grid-cols-3 pbx-gap-4"
              >
                <button
                  v-for="product in filteredProducts"
                  :key="String(product.id)"
                  type="button"
                  class="pbx-group pbx-text-left pbx-relative pbx-overflow-hidden pbx-rounded-2xl pbx-border-2 pbx-p-3 pbx-transition-all pbx-duration-150"
                  :class="
                    isSelected(product.id)
                      ? 'pbx-border-myPrimaryLinkColor pbx-bg-myPrimaryLinkColor/10 pbx-shadow-md'
                      : 'pbx-border-gray-200 pbx-bg-white hover:pbx-border-gray-300 hover:pbx-shadow-sm'
                  "
                  :aria-pressed="isSelected(product.id)"
                  @click="product.id != null && toggleProduct(product.id)"
                >
                  <div class="pbx-relative pbx-overflow-hidden pbx-rounded-xl">
                    <img
                      v-if="product.image"
                      :src="product.image"
                      :alt="product.imageAlt ?? product.title ?? 'Product'"
                      class="pbx-object-cover pbx-w-full pbx-aspect-square pbx-transition-transform pbx-duration-200 group-hover:pbx-scale-[1.02]"
                    />
                    <div
                      v-if="isSelected(product.id)"
                      class="pbx-absolute pbx-inset-0 pbx-bg-myPrimaryLinkColor/20 pbx-pointer-events-none"
                    />
                    <div
                      class="pbx-absolute pbx-top-2 pbx-right-2 pbx-flex pbx-h-8 pbx-w-8 pbx-items-center pbx-justify-center pbx-rounded-full pbx-shadow-sm pbx-transition-colors"
                      :class="
                        isSelected(product.id)
                          ? 'pbx-bg-myPrimaryLinkColor pbx-text-white'
                          : 'pbx-bg-white/90 pbx-text-gray-400 pbx-border pbx-border-gray-200'
                      "
                    >
                      <span class="material-symbols-outlined pbx-text-lg">
                        {{ isSelected(product.id) ? 'check' : 'add' }}
                      </span>
                    </div>
                    <span
                      v-if="product.badge"
                      class="pbx-absolute pbx-top-2 pbx-left-2 pbx-rounded-full pbx-bg-white/95 pbx-px-2.5 pbx-py-0.5 pbx-text-[10px] pbx-font-semibold pbx-uppercase pbx-tracking-wide pbx-text-gray-700 pbx-shadow-sm"
                    >
                      {{ product.badge }}
                    </span>
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
                  </div>
                </button>
              </div>
              <p v-else class="pbx-myPrimaryParagraph pbx-text-sm pbx-text-gray-400 pbx-px-2">
                {{ translate('No products found.') }}
              </p>
            </div>

            <aside class="md:pbx-w-3/12 pbx-hidden md:pbx-block pbx-overflow-y-auto">
              <div class="pbx-min-h-[40rem]">
                <p class="pbx-myPrimaryParagraph pbx-font-normal pbx-text-gray-900 pbx-pt-4">
                  {{ translate('Information') }}
                </p>
                <dl
                  class="pbx-mt-2 pbx-border-t pbx-border-b pbx-border-gray-200 pbx-divide-y pbx-divide-gray-200"
                >
                  <div
                    class="pbx-py-3 pbx-flex pbx-justify-between pbx-text-sm pbx-font-normal pbx-items-center"
                  >
                    <dt class="pbx-text-gray-500">{{ translate('Selected') }}</dt>
                    <dd class="pbx-text-gray-900">{{ selectedProducts.length }}</dd>
                  </div>
                  <div
                    class="pbx-py-3 pbx-flex pbx-justify-between pbx-text-sm pbx-font-normal pbx-items-center"
                  >
                    <dt class="pbx-text-gray-500">{{ translate('Grid layout') }}</dt>
                    <dd class="pbx-text-gray-900">
                      {{ translate(layoutOptions.find((o) => o.value === layout)?.labelKey ?? '') }}
                    </dd>
                  </div>
                </dl>

                <div v-if="selectedProducts.length" class="pbx-mt-6 pbx-space-y-2">
                  <p
                    class="pbx-myPrimaryParagraph pbx-text-xs pbx-font-medium pbx-text-gray-500 pbx-uppercase pbx-tracking-wide"
                  >
                    {{ translate('Selected') }}
                  </p>
                  <div
                    v-for="product in selectedProducts"
                    :key="String(product.id)"
                    class="pbx-flex pbx-items-center pbx-gap-3 pbx-rounded-xl pbx-border pbx-border-myPrimaryLinkColor/30 pbx-bg-myPrimaryLinkColor/5 pbx-py-2 pbx-px-2"
                  >
                    <img
                      v-if="product.image"
                      :src="product.image"
                      :alt="product.imageAlt ?? product.title ?? 'Product'"
                      class="pbx-h-12 pbx-w-12 pbx-shrink-0 pbx-rounded-lg pbx-object-cover"
                    />
                    <div class="pbx-min-w-0 pbx-flex-1">
                      <p class="pbx-myPrimaryParagraph pbx-text-sm pbx-truncate">
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
                      v-if="product.id != null"
                      type="button"
                      class="pbx-select-none pbx-h-10 pbx-w-10 pbx-cursor-pointer pbx-rounded-full pbx-flex pbx-items-center pbx-border-none pbx-justify-center pbx-bg-gray-50 pbx-aspect-square hover:pbx-bg-myPrimaryErrorColor hover:pbx-text-white pbx-text-myPrimaryErrorColor"
                      :aria-label="translate('Remove')"
                      :title="translate('Remove')"
                      @click.stop="removeProduct(product.id)"
                    >
                      <span class="material-symbols-outlined">delete</span>
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
            class="pbx-flex md:pbx-hidden pbx-flex-col pbx-gap-3 pbx-mt-6 pbx-py-3 pbx-px-3 pbx-rounded-2xl pbx-border-solid pbx-border pbx-border-gray-200 pbx-bg-gray-50"
          >
            <p
              v-if="selectedProducts.length"
              class="pbx-myPrimaryParagraph pbx-text-sm pbx-text-center pbx-text-gray-600"
            >
              {{ selectedProducts.length }} {{ translate('Selected') }}
            </p>
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
