<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import DynamicModalBuilder from '../Modals/DynamicModalBuilder.vue'
import { sharedPageBuilderStore } from '../../stores/shared-store'
import { getPageBuilder } from '../../composables/builderInstance'
import { useTranslations } from '../../composables/useTranslations'
import TextAlign from '@tiptap/extension-text-align'
import TypographyForTipTap from '../PageBuilder/EditorMenu/Editables/TypographyForTipTap.vue'

const pageBuilderService = getPageBuilder()

const { translate } = useTranslations()

// Use shared store instance
const pageBuilderStateStore = sharedPageBuilderStore

const showModalUrl = ref(false)

// use dynamic model
const typeModal = ref('')
const gridColumnModal = ref(Number(1))
const titleModal = ref('')
const descriptionModal = ref('')
const firstButtonModal = ref('')
const secondButtonModal = ref(null)
const thirdButtonModal = ref(null)
// set dynamic modal handle functions
const firstModalButtonFunctionDynamicModalBuilder = ref(null)
const secondModalButtonFunctionDynamicModalBuilder = ref(null)
const thirdModalButtonFunctionDynamicModalBuilder = ref(null)

const getElement = computed(() => {
  return pageBuilderStateStore.getElement
})
const textContentVueModel = ref('')

const textContent = computed(() => {
  if (editor.value) {
    return editor.value.getHTML()
  }
  return null
})

const getElementtextContentLength = ref(0)

watch(getElement, (newVal) => {
  const tempContainer = document.createElement('div')

  if (newVal) {
    tempContainer.innerHTML = newVal
    const textContent = tempContainer.textContent
    getElementtextContentLength.value = textContent.length
  }
})

// Check if any of the child elements have the tagName "IMG"

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit.configure({
      // Configure Link here if needed
      link: {
        openOnClick: false,
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose-sm sm:prose-sm lg:prose-sm focus:outline-none',
    },
  },
})

// watch for changes in textContent and update store and textContentVueModel
watch(textContent, async (newValue) => {
  if (!pageBuilderService.isSelectedElementValidText()) return

  if (getElement.value) {
    pageBuilderStateStore.setTextAreaVueModel(newValue)

    if (typeof newValue === 'string' && newValue !== textContentVueModel.value) {
      await pageBuilderService.handleTextInput(newValue)
    }
  }
})

const TipTapSetContent = function () {
  if (!pageBuilderService.isSelectedElementValidText()) return

  if (editor.value) {
    editor.value.commands.setContent(getElement.value.innerHTML)
  }
}

watch(getElement, () => {
  TipTapSetContent()
})

// Manage URL
const urlEnteret = ref('')
const newUpdatedExistingURL = ref('')
const urlError = ref(null)

watch(urlEnteret, (newVal) => {
  newUpdatedExistingURL.value = newVal
})
const handleURL = function () {
  urlEnteret.value = editor.value.getAttributes('link').href

  showModalUrl.value = true
  typeModal.value = 'success'
  gridColumnModal.value = 2
  titleModal.value = translate('Enter URL')
  descriptionModal.value = translate(
    'Add a valid URL to transform the selected text into a clickable hyperlink that directs users to the specified web address.',
  )
  firstButtonModal.value = translate('Close')
  secondButtonModal.value = urlEnteret.value ? 'Remove url' : null
  thirdButtonModal.value = translate('Save')

  // handle click
  firstModalButtonFunctionDynamicModalBuilder.value = function () {
    showModalUrl.value = false
    urlError.value = null
  }

  // handle click
  secondModalButtonFunctionDynamicModalBuilder.value = function () {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    showModalUrl.value = false
  }

  // handle click
  thirdModalButtonFunctionDynamicModalBuilder.value = function () {
    const isNotValidated = validateURL()
    if (isNotValidated) {
      return
    }
    if (!isNotValidated) {
      setEnteretURL()
    }
    showModalUrl.value = false
  }
  // end modal
}

//
//
const validateURL = function () {
  // initial value
  urlError.value = null

  // url validation
  const urlRegex = /^https?:\/\//
  const isValidURL = ref(true)
  isValidURL.value = urlRegex.test(newUpdatedExistingURL.value)

  // cancelled
  if (isValidURL.value === false) {
    urlError.value =
      "The provided URL is invalid. Please ensure that it begins with 'https://' for proper formatting and security."
    return true
  }

  return false
}
const setEnteretURL = function () {
  // update link
  editor.value
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: newUpdatedExistingURL.value })
    .run()
}

const showTypography = ref(false)

const toggleShowTypography = function () {
  showTypography.value = !showTypography.value
}

onBeforeMount(() => {
  editor.value?.destroy()
})

onMounted(() => {
  TipTapSetContent()
})
</script>
<template>
  <div>
    <DynamicModalBuilder
      maxWidth="4xl"
      :showDynamicModalBuilder="showModalUrl"
      :type="typeModal"
      :gridColumnAmount="gridColumnModal"
      :title="titleModal"
      :description="descriptionModal"
      :firstButtonText="firstButtonModal"
      :secondButtonText="secondButtonModal"
      :thirdButtonText="thirdButtonModal"
      @firstModalButtonFunctionDynamicModalBuilder="firstModalButtonFunctionDynamicModalBuilder"
      @secondModalButtonFunctionDynamicModalBuilder="secondModalButtonFunctionDynamicModalBuilder"
      @thirdModalButtonFunctionDynamicModalBuilder="thirdModalButtonFunctionDynamicModalBuilder"
    >
      <header></header>
      <main>
        <div class="pbx-myInputGroup">
          <label class="pbx-myPrimaryInputLabel" for="roles"
            ><span>{{ translate('Enter URL') }}</span></label
          ><input
            v-model="urlEnteret"
            class="pbx-myPrimaryInput pbx-mt-1 pbx-w-full"
            type="url"
            placeholder="url"
          />
          <div
            v-if="urlError"
            class="pbx-min-h-[2.5rem] pbx-flex pbx-items-center pbx-justify-start"
          >
            <p class="pbx-myPrimaryInputError pbx-mt-2 pbx-mb-0 pbx-py-0 pbx-self-start">
              {{ urlError }}
            </p>
          </div>
        </div>
      </main>
    </DynamicModalBuilder>

    <div class="pbx-blockease-linear pbx-duration-200 pbx-block pbx-ease-linear">
      <div v-if="pageBuilderService.isSelectedElementValidText() && editor">
        <div class="pbx-relative pbx-rounded-lg pbx-px-2">
          <div
            class="pbx-flex pbx-flex-wrap pbx-items-center pbx-border-solid pbx-p-1 pbx-border pbx-border-gray-200 pbx-shadow-sm pbx-mb-4"
          >
            <!-- Save -->
            <div class="pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-mr-6">
              <div
                @click="pageBuilderService.toggleTipTapModal(false)"
                class="pbx-myPrimaryTag pbx-cursor-pointer"
              >
                <span class="material-symbols-outlined"> save </span>
                <span>{{ translate('Save') }}</span>
              </div>
            </div>
            <!-- Bold -->
            <div
              class="pbx-py-1 pbx-px-1 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-border pbxborder-gray-100 pbx-my-0.5 pbx-mx-0.5"
            >
              <div
                @click="editor.chain().focus().toggleBold().run()"
                class="pbx-h-10 pbx-w-10 pbx-flex-end pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
                :class="{
                  'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white hover:pbx-bg-myPrimaryLinkColor':
                    editor.isActive('bold'),
                }"
              >
                <span class="material-symbols-outlined"> format_bold </span>
              </div>
            </div>

            <!-- Link -->
            <div
              class="pbx-py-1 pbx-px-1 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-border pbxborder-gray-100 pbx-my-0.5 pbx-mx-0.5"
            >
              <div
                @click="handleURL"
                class="pbx-h-10 pbx-w-10 pbx-flex-end pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
                :class="{
                  'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white hover:pbx-bg-myPrimaryLinkColor':
                    editor.isActive('link'),
                }"
              >
                <span class="material-symbols-outlined"> link </span>
              </div>
            </div>

            <!-- H2 -->
            <div
              class="pbx-py-1 pbx-px-1 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-border pbxborder-gray-100 pbx-my-0.5 pbx-mx-0.5"
            >
              <div
                @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                class="pbx-h-10 pbx-w-10 pbx-flex-end pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
                :class="{
                  'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white hover:pbx-bg-myPrimaryLinkColor':
                    editor.isActive('heading', {
                      level: 2,
                    }),
                }"
              >
                <div class="pbx-font-semibold pbx-text-sm">H2</div>
              </div>
            </div>
            <!-- H3 -->
            <div
              class="pbx-py-1 pbx-px-1 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-border pbxborder-gray-100 pbx-my-0.5 pbx-mx-0.5"
            >
              <div
                @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                class="pbx-h-10 pbx-w-10 pbx-flex-end pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
                :class="{
                  'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white hover:pbx-bg-myPrimaryLinkColor':
                    editor.isActive('heading', {
                      level: 3,
                    }),
                }"
              >
                <div class="pbx-font-semibold pbx-text-sm">H3</div>
              </div>
            </div>

            <!-- H4 -->
            <div
              class="pbx-py-1 pbx-px-1 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-border pbxborder-gray-100 pbx-my-0.5 pbx-mx-0.5"
            >
              <div
                @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
                class="pbx-h-10 pbx-w-10 pbx-flex-end pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
                :class="{
                  'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white hover:pbx-bg-myPrimaryLinkColor':
                    editor.isActive('heading', {
                      level: 4,
                    }),
                }"
              >
                <div class="pbx-font-semibold pbx-text-sm">H4</div>
              </div>
            </div>

            <!-- H5 -->
            <div
              class="pbx-py-1 pbx-px-1 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-border pbxborder-gray-100 pbx-my-0.5 pbx-mx-0.5"
            >
              <div
                @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
                class="pbx-h-10 pbx-w-10 pbx-flex-end pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
                :class="{
                  'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white hover:pbx-bg-myPrimaryLinkColor':
                    editor.isActive('heading', {
                      level: 5,
                    }),
                }"
              >
                <div class="pbx-font-semibold pbx-text-sm">H5</div>
              </div>
            </div>

            <!-- H6 -->
            <div
              class="pbx-py-1 pbx-px-1 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-border pbxborder-gray-100 pbx-my-0.5 pbx-mx-0.5"
            >
              <div
                @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
                class="pbx-h-10 pbx-w-10 pbx-flex-end pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
                :class="{
                  'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white hover:pbx-bg-myPrimaryLinkColor':
                    editor.isActive('heading', {
                      level: 6,
                    }),
                }"
              >
                <div class="pbx-font-semibold pbx-text-sm">H6</div>
              </div>
            </div>

            <!-- Left Align -->
            <div
              class="pbx-py-1 pbx-px-1 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-border pbxborder-gray-100 pbx-my-0.5 pbx-mx-0.5"
            >
              <div
                @click="
                  editor.isActive({ textAlign: 'left' })
                    ? editor.chain().focus().unsetTextAlign().run()
                    : editor.chain().focus().setTextAlign('left').run()
                "
                class="pbx-h-10 pbx-w-10 pbx-flex-end pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
                :class="{
                  'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white hover:pbx-bg-myPrimaryLinkColor':
                    editor.isActive({ textAlign: 'left' }),
                }"
              >
                <span class="material-symbols-outlined"> format_align_left </span>
              </div>
            </div>

            <!-- Center Align -->
            <div
              class="pbx-py-1 pbx-px-1 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-border pbxborder-gray-100 pbx-my-0.5 pbx-mx-0.5"
            >
              <div
                @click="
                  editor.isActive({ textAlign: 'center' })
                    ? editor.chain().focus().unsetTextAlign().run()
                    : editor.chain().focus().setTextAlign('center').run()
                "
                class="pbx-h-10 pbx-w-10 pbx-flex-end pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
                :class="{
                  'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white hover:pbx-bg-myPrimaryLinkColor':
                    editor.isActive({ textAlign: 'center' }),
                }"
              >
                <span class="material-symbols-outlined"> format_align_center </span>
              </div>
            </div>

            <!-- Right Align -->
            <div
              class="pbx-py-1 pbx-px-1 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-border pbxborder-gray-100 pbx-my-0.5 pbx-mx-0.5"
            >
              <div
                @click="
                  editor.isActive({ textAlign: 'right' })
                    ? editor.chain().focus().unsetTextAlign().run()
                    : editor.chain().focus().setTextAlign('right').run()
                "
                class="pbx-h-10 pbx-w-10 pbx-flex-end pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
                :class="{
                  'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white hover:pbx-bg-myPrimaryLinkColor':
                    editor.isActive({ textAlign: 'right' }),
                }"
              >
                <span class="material-symbols-outlined"> format_align_right </span>
              </div>
            </div>

            <div
              class="pbx-py-1 pbx-px-1 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-border pbxborder-gray-100 pbx-my-0.5 pbx-mx-0.5"
            >
              <div
                @click="editor.chain().focus().toggleBulletList().run()"
                class="pbx-h-10 pbx-w-10 pbx-flex-end pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-aspect-square pbx-text-myPrimaryDarkGrayColor"
                :class="{
                  'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white hover:pbx-bg-myPrimaryLinkColor':
                    editor.isActive('bulletList'),
                }"
              >
                <span class="material-symbols-outlined"> format_list_bulleted </span>
              </div>
            </div>

            <!-- Toggle showTypography start -->
            <div
              class="pbx-py-1 pbx-px-1 pbx-flex pbx-items-center pbx-gap-2 pbx-border pbxborder-gray-100 pbx-my-0.5 pbx-mx-0.5 pbx-relative"
            >
              <div
                @click="toggleShowTypography"
                class="pbx-h-10 pbx-px-12 pbx-flex-end pbx-cursor-pointer pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center hover:pbx-bg-gray-100 pbx-text-myPrimaryDarkGrayColor pbx-font-medium"
                :class="{
                  'pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white hover:pbx-bg-myPrimaryLinkColor':
                    showTypography,
                }"
              >
                {{ translate('Font Appearance') }}
              </div>

              <transition name="popup-fade">
                <div
                  v-if="showTypography"
                  class="pbx-top-full pbx-absolute pbx-z-40 pbx-left-1/2 pbx-transform pbx--translate-x-1/2 pbx-w-72 pbx-select-none"
                >
                  <div
                    class="pbx-rounded-3xl pbx-border pbx-border-gray-100 pbx-bg-white pbx-shadow-lg pbx-pt-4 pbx-pb-4 pbx-flex pbx-flex-col pbx-overflow-y-auto pbx-max-h-[50vh] pbx-mx-4 pbx-pl-2 pbx-pr-4"
                  >
                    <TypographyForTipTap></TypographyForTipTap>
                  </div>
                </div>
              </transition>
            </div>
            <!-- Toggle showTypography end -->
          </div>

          <EditorContent
            v-if="editor"
            id="page-builder-editor"
            :editor="editor"
            class="pbx-p-2 pbx-prounded-lg lg:pbx-min-h-[20rem] lg:pbx-max-h-[30rem] md:pbx-min-h-[20rem] md:pbx-max-h-[20rem] pbx-min-h-[20rem] pbx-max-h-[20rem] pbx-overflow-y-auto"
          ></EditorContent>
        </div>
      </div>
    </div>
  </div>
</template>
