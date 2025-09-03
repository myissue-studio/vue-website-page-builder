<script setup>
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import Link from '@tiptap/extension-link'
import DynamicModalBuilder from '../Modals/DynamicModalBuilder.vue'
import { sharedPageBuilderStore } from '../../stores/shared-store'
import { getPageBuilder } from '../../composables/builderInstance'
import { useTranslations } from '../../composables/useTranslations'
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
    StarterKit,
    Link.configure({
      openOnClick: false,
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
        <div class="pbx-relative pbx-rounded-lg">
          <div
            class="pbx-flex pbx-justify-between pbx-myPrimaryGap pbx-items-center pbx-pb-2 pbx-mb-2 pbx-px-4 pbx-overflow-x-auto pbx-border-0 pbx-border-b pbx-border-solid pbx-border-gray-200"
          >
            <div>
              <div>
                <div
                  class="pbx-px-2 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max pbx-p-1 pbx-rounded-full pbx-border-solid pbx-border pbx-border-gray-200 pbx-shadow-sm"
                >
                  <button
                    @click="pageBuilderService.toggleTipTapModal(false)"
                    type="button"
                    class="pbx-myPrimaryTag pbx-cursor-pointer"
                  >
                    <span class="material-symbols-outlined"> save </span>
                    <span>{{ translate('Save') }}</span>
                  </button>
                </div>
              </div>
            </div>
            <div
              class="pbx-flex pbx-items-center pbx-p-1 pbx-rounded-full pbx-border-solid pbx-border pbx-border-gray-200 pbx-shadow-sm"
            >
              <div class="pbx-px-2 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max">
                <button
                  @click="editor.chain().focus().setHardBreak().run()"
                  type="button"
                  class="pbx-myPrimaryTag pbx-cursor-pointer"
                >
                  <span class="material-symbols-outlined"> keyboard_return </span>
                  <span>{{ translate('Line break') }}</span>
                </button>
              </div>

              <div class="pbx-px-2 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max">
                <button
                  @click="editor.chain().focus().toggleBold().run()"
                  type="button"
                  class="pbx-myPrimaryTag pbx-cursor-pointer"
                  :class="{ 'pbx-bg-myPrimaryLinkColor pbx-text-white': editor.isActive('bold') }"
                >
                  <span class="material-symbols-outlined"> format_bold </span>
                  <span>{{ translate('Bold') }}</span>
                </button>
              </div>

              <div class="pbx-px-2 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max">
                <button
                  @click="handleURL"
                  type="button"
                  class="pbx-myPrimaryTag pbx-cursor-pointer"
                  :class="{ 'pbx-bg-myPrimaryLinkColor pbx-text-white': editor.isActive('link') }"
                >
                  <span class="material-symbols-outlined"> link </span>
                  <span>{{ translate('Link') }}</span>
                </button>
              </div>

              <div class="pbx-px-2 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max">
                <button
                  @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                  type="button"
                  class="pbx-myPrimaryTag pbx-cursor-pointer"
                  :class="{
                    'pbx-bg-myPrimaryLinkColor pbx-text-white': editor.isActive('heading', {
                      level: 2,
                    }),
                  }"
                >
                  <span class="material-symbols-outlined"> titlecase </span>
                  <span>{{ translate('Header 2') }}</span>
                </button>
              </div>

              <div class="pbx-px-2 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max">
                <button
                  @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                  type="button"
                  class="pbx-myPrimaryTag pbx-cursor-pointer"
                  :class="{
                    'pbx-bg-myPrimaryLinkColor pbx-text-white': editor.isActive('heading', {
                      level: 3,
                    }),
                  }"
                >
                  <span class="material-symbols-outlined"> titlecase </span>
                  <span>{{ translate('Header 3') }}</span>
                </button>
              </div>

              <div class="pbx-px-2 pbx-flex pbx-items-center pbx-justify-start pbx-gap-2 pbx-w-max">
                <button
                  @click="editor.chain().focus().toggleBulletList().run()"
                  type="button"
                  class="pbx-myPrimaryTag pbx-cursor-pointer"
                  :class="{
                    'pbx-bg-myPrimaryLinkColor pbx-text-white': editor.isActive('bulletList'),
                  }"
                >
                  <span class="material-symbols-outlined"> list </span>
                  <span>{{ translate('List') }}</span>
                </button>
              </div>
            </div>
          </div>

          <editor-content
            v-if="editor"
            id="page-builder-editor"
            :editor="editor"
            class="pbx-p-2 pbx-prounded-lg lg:pbx-min-h-[20rem] lg:pbx-max-h-[30rem] md:pbx-min-h-[20rem] md:pbx-max-h-[20rem] pbx-min-h-[20rem] pbx-max-h-[20rem] pbx-overflow-y-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>
