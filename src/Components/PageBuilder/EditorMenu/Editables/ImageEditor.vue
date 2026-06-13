<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import MediaLibraryModal from '../../../Modals/MediaLibraryModal.vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { preloadImage } from '../../../../composables/preloadImage'
import { delay } from '../../../../composables/delay'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore
const customMediaComponent = inject<Record<string, unknown> | null>('CustomMediaComponent', null)

const getIsLoadingImage = ref(false)

const showMediaLibraryModal = ref(false)
// modal content
const titleMedia = ref('')
const descriptionMedia = ref<string | null>('')
const firstButtonMedia = ref('')
const secondButtonMedia = ref<string | null>(null)
const thirdButtonMedia = ref<string | null>(null)
// set dynamic modal handle functions
const firstMediaButtonFunction = ref<(() => void) | null>(null)

// get current image from store
const getBasePrimaryImage = computed(() => {
  if (pageBuilderStateStore.getBasePrimaryImage) {
    loadingImage(pageBuilderStateStore.getBasePrimaryImage)
  }
  return pageBuilderStateStore.getBasePrimaryImage
})

const handleAddImage = function () {
  // open modal to true
  showMediaLibraryModal.value = true

  titleMedia.value = translate('Media Library')
  descriptionMedia.value = null
  firstButtonMedia.value = translate('Close')
  secondButtonMedia.value = translate('Select image')

  // handle click
  firstMediaButtonFunction.value = function () {
    showMediaLibraryModal.value = false
  }
  //
  // end modal
}

const loadingImage = async function (imageURL: string) {
  getIsLoadingImage.value = true

  if (imageURL && typeof imageURL === 'string' && imageURL.length > 2) {
    await preloadImage(imageURL)
    await delay(200)
    getIsLoadingImage.value = false
  }
}
</script>
<template>
  <div>
    <div v-show="getIsLoadingImage">
      <div class="pbx-flex pbx-items-center pbx-justify-center pbx-mt-4 pbx-min-h-80">
        <div
          class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent pbx-align-[-0.125em] motion-reduce:pbx-animate-[spin_1.5s_linear_infinite]"
        >
          <span
            class="!pbx-absolute !pbx-m-px !pbx-h-px !pbx-w-px !pbx-overflow-hidden !pbx-whitespace-nowrap !pbx-border-0 !pbx-p-0 !pbx-[clip:rect(0,0,0,0)]"
            >Loading...</span
          >
        </div>
      </div>
    </div>
    <div v-show="getBasePrimaryImage && !getIsLoadingImage">
      <img
        class="pbx-object-cover pbx-object-center pbx-w-full pbx-cursor-pointer"
        :src="getBasePrimaryImage ?? undefined"
        @click="handleAddImage"
        alt="image"
      />
    </div>
    <MediaLibraryModal
      :open="showMediaLibraryModal"
      :title="titleMedia"
      :description="descriptionMedia"
      :firstButtonText="firstButtonMedia"
      :secondButtonText="secondButtonMedia ?? undefined"
      :thirdButtonText="thirdButtonMedia ?? undefined"
      :customMediaComponent="customMediaComponent ?? undefined"
      @firstMediaButtonFunction="() => firstMediaButtonFunction?.()"
    >
    </MediaLibraryModal>
  </div>
</template>
