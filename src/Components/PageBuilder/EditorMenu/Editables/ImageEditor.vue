<script setup lang="ts">
import { computed, ref, inject, watch, onMounted, nextTick } from 'vue'
import MediaLibraryModal from '../../../Modals/MediaLibraryModal.vue'
import EditorAccordion from '../EditorAccordion.vue'
import SliderIcon from '../../../Icons/SliderIcon.vue'
import { sharedPageBuilderStore } from '../../../../stores/shared-store'
import { preloadImage } from '../../../../utils/preload-image'
import { sleep } from '../../../../utils/sleep'
import { useTranslations } from '../../../../composables/useTranslations'

const { translate } = useTranslations()

const emit = defineEmits<{
  open: []
}>()

const pageBuilderStateStore = sharedPageBuilderStore
const customMediaComponent = inject<Record<string, unknown> | null>('CustomMediaComponent', null)

const imageAccordionRef = ref<InstanceType<typeof EditorAccordion> | null>(null)
const getIsLoadingImage = ref(false)

const showMediaLibraryModal = ref(false)
const titleMedia = ref('')
const descriptionMedia = ref<string | null>('')
const firstButtonMedia = ref('')
const secondButtonMedia = ref<string | null>(null)
const thirdButtonMedia = ref<string | null>(null)
const firstMediaButtonFunction = ref<(() => void) | null>(null)

const getBasePrimaryImage = computed(() => {
  if (pageBuilderStateStore.getBasePrimaryImage) {
    loadingImage(pageBuilderStateStore.getBasePrimaryImage)
  }
  return pageBuilderStateStore.getBasePrimaryImage
})

function isImageSelection(element: HTMLElement | null | undefined): boolean {
  if (!element) return false
  if (element.tagName === 'IMG') return true
  return Boolean(pageBuilderStateStore.getBasePrimaryImage)
}

function openImageAccordionIfNeeded(element: HTMLElement | null | undefined) {
  if (isImageSelection(element)) {
    imageAccordionRef.value?.open()
  }
}

watch(
  () => pageBuilderStateStore.getElement,
  (element) => {
    openImageAccordionIfNeeded(element)
  },
  { immediate: true, flush: 'post' },
)

watch(
  () => pageBuilderStateStore.getBasePrimaryImage,
  () => {
    openImageAccordionIfNeeded(pageBuilderStateStore.getElement)
  },
)

onMounted(() => {
  nextTick(() => {
    openImageAccordionIfNeeded(pageBuilderStateStore.getElement)
  })
})

const handleAddImage = function () {
  showMediaLibraryModal.value = true

  titleMedia.value = translate('Media Library')
  descriptionMedia.value = null
  firstButtonMedia.value = translate('Close')
  secondButtonMedia.value = translate('Select image')

  firstMediaButtonFunction.value = function () {
    showMediaLibraryModal.value = false
  }
}

const loadingImage = async function (imageURL: string) {
  getIsLoadingImage.value = true

  if (imageURL && typeof imageURL === 'string' && imageURL.length > 2) {
    await preloadImage(imageURL)
    await sleep(200)
    getIsLoadingImage.value = false
  }
}
</script>

<template>
  <EditorAccordion ref="imageAccordionRef">
    <template #title>{{ translate('Image') }}</template>
    <template #content>
      <div v-show="getIsLoadingImage" class="pbx-editorFieldGroup">
        <div class="pbx-flex pbx-min-h-40 pbx-items-center pbx-justify-center">
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

      <div v-show="getBasePrimaryImage && !getIsLoadingImage" class="pbx-editorFieldGroup">
        <img
          class="pbx-w-full pbx-cursor-pointer pbx-rounded-lg pbx-object-cover pbx-object-center"
          :src="getBasePrimaryImage ?? undefined"
          @click="handleAddImage"
          alt="image"
        />
      </div>

      <div
        v-show="!getIsLoadingImage && !getBasePrimaryImage"
        class="pbx-editorFieldGroup pbx-rounded-lg pbx-border pbx-border-solid pbx-border-gray-200 pbx-bg-gray-50 pbx-px-4 pbx-py-8 pbx-text-center"
      >
        <p class="pbx-editorSectionDesc pbx-mb-0">
          {{ translate('No image has been selected.') }}
        </p>
      </div>

      <button type="button" class="pbx-pageDesignOpenButton" @click="emit('open')">
        <span class="pbx-pageDesignOpenButtonIcon">
          <SliderIcon />
        </span>
        <span class="pbx-pageDesignOpenButtonText">
          <span class="pbx-pageDesignOpenButtonLabel">{{ translate('Open image settings') }}</span>
          <span class="pbx-pageDesignOpenButtonHint">
            {{ translate('Fit, crop focus & alt text') }}
          </span>
        </span>
        <span class="pbx-pageDesignOpenButtonArrow material-symbols-outlined" aria-hidden="true">
          arrow_forward
        </span>
      </button>
    </template>
  </EditorAccordion>

  <MediaLibraryModal
    :open="showMediaLibraryModal"
    :title="titleMedia"
    :description="descriptionMedia"
    :firstButtonText="firstButtonMedia"
    :secondButtonText="secondButtonMedia ?? undefined"
    :thirdButtonText="thirdButtonMedia ?? undefined"
    :customMediaComponent="customMediaComponent ?? undefined"
    @firstMediaButtonFunction="() => firstMediaButtonFunction?.()"
  />
</template>
