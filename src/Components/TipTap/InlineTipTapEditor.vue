<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Editor } from '@tiptap/vue-3'
import type { Editor as TiptapCoreEditor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { sharedPageBuilderStore } from '../../stores/shared-store'
import { getPageBuilder } from '../../composables/usePageBuilder'
import { useTranslations } from '../../composables/useTranslations'
import TypographyForTipTap from '../PageBuilder/EditorMenu/Editables/TypographyForTipTap.vue'
import ConfirmActionModal from '../Modals/ConfirmActionModal.vue'
import {
  sanitizeInlineTipTapHtml,
  finalizeInlineTipTapHtml,
} from '../../utils/builder/sanitize-inline-tiptap-html'
import { isRtlContentContext } from '../../utils/builder/is-rtl-content'
import { shouldPreserveInlineEditorForToolbarPopover } from '../../utils/builder/should-preserve-inline-editor-for-toolbar-popover'
import { getEditToolbarPopoverTop } from '../../utils/builder/clamp-edit-toolbar-popover-top'
import { CLOSE_EDIT_TOOLBAR_POPOVERS_EVENT } from '../../utils/builder/edit-toolbar-popover-events'

const pageBuilderService = getPageBuilder()
const pageBuilderStateStore = sharedPageBuilderStore
const { translate } = useTranslations()

const editor = ref<Editor | null>(null)
const inlineElement = ref<HTMLElement | null>(null)
const originalHTML = ref('')
const isSaving = ref(false)
const showTypography = ref(false)
const typographyMenuRef = ref<HTMLElement | null>(null)
const typographyPopoverRef = ref<HTMLElement | null>(null)
const TYPOGRAPHY_MENU_WIDTH_PX = 256

const typographyPopoverStyle = ref({
  top: '0px',
  left: '0px',
  width: `${TYPOGRAPHY_MENU_WIDTH_PX}px`,
})
const showModalUrl = ref(false)
const urlEntered = ref('')
const urlError = ref<string | null>(null)

type InlineEditorHtmlSource = {
  getHTML(): string
}

type InlineEditorFocusSource = Pick<TiptapCoreEditor, 'state' | 'commands' | 'chain'>

const getElement = computed(() => pageBuilderStateStore.getElement)
const isInlineEditing = computed(() => pageBuilderStateStore.getInlineTipTapEditor)

const openUrlModal = function () {
  if (!editor.value) return

  urlEntered.value = editor.value.getAttributes('link').href || ''
  urlError.value = null
  showModalUrl.value = true
}

const closeUrlModal = function () {
  showModalUrl.value = false
  urlError.value = null
}

const removeUrl = function () {
  editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
  closeUrlModal()
}

const validateUrl = function (): boolean {
  urlError.value = null
  const nextUrl = urlEntered.value.trim()

  if (!/^https?:\/\//.test(nextUrl)) {
    urlError.value =
      "The provided URL is invalid. Please ensure that it begins with 'https://' for proper formatting and security."
    return false
  }

  return true
}

const saveUrl = function () {
  if (!editor.value || !validateUrl()) return

  editor.value
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: urlEntered.value.trim() })
    .run()
  closeUrlModal()
}

const editorIsActive = function (...args: Parameters<Editor['isActive']>): boolean {
  return editor.value?.isActive(...args) ?? false
}

const headingIsActive = function (level: 2 | 3 | 4 | 5 | 6): boolean {
  return editor.value?.isActive('heading', { level }) ?? false
}

const toggleBold = function () {
  editor.value?.chain().focus().toggleBold().run()
}

const toggleItalic = function () {
  editor.value?.chain().focus().toggleItalic().run()
}

const toggleHeading = function (level: 2 | 3 | 4 | 5 | 6) {
  editor.value?.chain().focus().toggleHeading({ level }).run()
}

const toggleBulletList = function () {
  editor.value?.chain().focus().toggleBulletList().run()
}

const toggleTextAlign = function (alignment: 'left' | 'center' | 'right') {
  if (!editor.value) return

  if (editor.value.isActive({ textAlign: alignment })) {
    editor.value.chain().focus().unsetTextAlign().run()
    return
  }

  editor.value.chain().focus().setTextAlign(alignment).run()
}

const toggleShowTypography = function () {
  showTypography.value = !showTypography.value
}

const updateTypographyMenuPosition = function () {
  const trigger = typographyMenuRef.value
  if (!trigger) return

  const rect = trigger.getBoundingClientRect()
  const margin = 8
  let left = rect.left + rect.width / 2 - TYPOGRAPHY_MENU_WIDTH_PX / 2
  left = Math.max(margin, Math.min(left, window.innerWidth - TYPOGRAPHY_MENU_WIDTH_PX - margin))

  typographyPopoverStyle.value = {
    top: `${getEditToolbarPopoverTop(rect.bottom)}px`,
    left: `${Math.round(left)}px`,
    width: `${TYPOGRAPHY_MENU_WIDTH_PX}px`,
  }
}

let typographyPositionRaf = 0

const trackTypographyMenuPosition = function () {
  if (!showTypography.value) {
    typographyPositionRaf = 0
    return
  }

  updateTypographyMenuPosition()
  typographyPositionRaf = requestAnimationFrame(trackTypographyMenuPosition)
}

const startTypographyPositionTracking = function () {
  cancelAnimationFrame(typographyPositionRaf)
  void nextTick(() => {
    updateTypographyMenuPosition()
    typographyPositionRaf = requestAnimationFrame(trackTypographyMenuPosition)
  })
}

const stopTypographyPositionTracking = function () {
  cancelAnimationFrame(typographyPositionRaf)
  typographyPositionRaf = 0
}

const attachTypographyPositionListeners = function () {
  startTypographyPositionTracking()
}

const detachTypographyPositionListeners = function () {
  stopTypographyPositionTracking()
}

let typographySelectInteractionUntil = 0

const markTypographySelectInteraction = function (event: Event) {
  const target = event.target
  const active = document.activeElement

  const selectFromTarget =
    target instanceof HTMLSelectElement && typographyPopoverRef.value?.contains(target)
      ? target
      : null
  const selectFromActive =
    active instanceof HTMLSelectElement && typographyPopoverRef.value?.contains(active)
      ? active
      : null

  if (!selectFromTarget && !selectFromActive) return

  typographySelectInteractionUntil = Date.now() + 500
}

const closeTypographyOnOutsideClick = function (event: Event) {
  if (!showTypography.value) return
  if (!(event.target instanceof Node)) return
  if (typographyMenuRef.value?.contains(event.target)) return
  if (typographyPopoverRef.value?.contains(event.target)) return
  if (Date.now() < typographySelectInteractionUntil) return

  // Native <select> option menus render outside the teleported popover in the DOM.
  window.setTimeout(() => {
    if (!showTypography.value) return
    if (Date.now() < typographySelectInteractionUntil) return

    const active = document.activeElement
    if (active instanceof Element) {
      if (typographyPopoverRef.value?.contains(active)) return
      if (typographyMenuRef.value?.contains(active)) return
      if (active.closest('[data-pbx-typography-menu-popover]')) return
    }

    showTypography.value = false
  }, 0)
}

const focusEditorAtPrimaryCaretPosition = function (
  tiptapEditor: InlineEditorFocusSource,
  target: HTMLElement,
  contentText?: string,
) {
  const { doc } = tiptapEditor.state
  const rtl = isRtlContentContext(target, {
    lang: pageBuilderStateStore.getCurrentLanguage,
    text: contentText ?? doc.textContent,
  })

  if (!doc.childCount) {
    tiptapEditor.commands.focus('start')
    return
  }

  const lastBlock = doc.lastChild
  if (!lastBlock?.isTextblock) {
    tiptapEditor.commands.focus(rtl ? 'start' : 'end')
    return
  }

  const lastBlockStart = doc.content.size - lastBlock.nodeSize
  const $pos = doc.resolve(lastBlockStart + 1)
  const caretPos = rtl ? $pos.start($pos.depth) : $pos.end($pos.depth)
  tiptapEditor.chain().focus().setTextSelection(caretPos).run()
}

const getSanitizedEditorHtml = function (tiptapEditor: InlineEditorHtmlSource): string {
  return sanitizeInlineTipTapHtml(tiptapEditor.getHTML())
}

const getFinalEditorHtml = function (tiptapEditor: InlineEditorHtmlSource): string {
  return finalizeInlineTipTapHtml(tiptapEditor.getHTML(), originalHTML.value)
}

const findEditableElement = function (target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null

  let current: Element | null = target

  while (current && !current.matches('#pagebuilder')) {
    if (current instanceof HTMLElement && pageBuilderService.isEditableElement(current)) {
      return current
    }

    current = current.parentElement
  }

  return null
}

const teardownEditor = function (html?: string) {
  const target = inlineElement.value
  const activeEditor = editor.value

  if (activeEditor && target) {
    const finalHTML = finalizeInlineTipTapHtml(html ?? activeEditor.getHTML(), originalHTML.value)
    activeEditor.destroy()
    target.innerHTML = finalHTML
    target.removeAttribute('data-pbx-inline-tiptap')
    target.removeAttribute('data-pbx-inline-original-html')
    pageBuilderStateStore.setTextAreaVueModel(finalHTML)
  }

  editor.value = null
  inlineElement.value = null
  originalHTML.value = ''
  showTypography.value = false
}

const startEditor = async function () {
  const target = getElement.value

  if (!target || editor.value || !pageBuilderService.isSelectedElementValidText()) return

  await nextTick()

  originalHTML.value = target.innerHTML
  inlineElement.value = target
  target.innerHTML = ''
  target.setAttribute('data-pbx-inline-tiptap', '')
  target.setAttribute('data-pbx-inline-original-html', originalHTML.value)

  const rtl = isRtlContentContext(target, {
    lang: pageBuilderStateStore.getCurrentLanguage,
    text: originalHTML.value,
  })

  const tiptapEditor = new Editor({
    element: target,
    content: originalHTML.value,
    extensions: [
      StarterKit.configure({
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
        class: 'pbx-inline-tiptap-editor',
        ...(rtl ? { dir: 'rtl' } : {}),
      },
      handleDOMEvents: {
        mousedown: (_view, event) => {
          event.stopPropagation()
          return false
        },
        click: (_view, event) => {
          event.stopPropagation()
          return false
        },
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      pageBuilderStateStore.setTextAreaVueModel(getSanitizedEditorHtml(activeEditor))
    },
  })

  editor.value = tiptapEditor
  await nextTick()
  focusEditorAtPrimaryCaretPosition(tiptapEditor, target, originalHTML.value)
}

const saveInlineEditor = async function () {
  if (!editor.value) return

  isSaving.value = true
  const target = inlineElement.value
  const html = getFinalEditorHtml(editor.value)
  removeDocumentMouseDownListener()
  teardownEditor(html)
  await pageBuilderService.finishInlineTipTapEditor(target)
  isSaving.value = false
}

const saveInlineEditorAndSelect = async function (nextElement: HTMLElement | null) {
  if (!editor.value) return

  isSaving.value = true
  const target = inlineElement.value
  const html = getFinalEditorHtml(editor.value)

  removeDocumentMouseDownListener()
  teardownEditor(html)
  await pageBuilderService.finishInlineTipTapEditor(target)

  if (nextElement && nextElement !== target) {
    await pageBuilderService.selectEditableElement(nextElement)
  }

  isSaving.value = false
}

const handleDocumentMouseDown = function (event: MouseEvent) {
  if (!editor.value || !inlineElement.value) return
  if (!(event.target instanceof Node)) return

  const editorDom = inlineElement.value.querySelector('.ProseMirror')
  const modalElement = event.target instanceof Element ? event.target.closest('#pbx-modal') : null

  if (editorDom?.contains(event.target)) return
  if (modalElement) return
  if (shouldPreserveInlineEditorForToolbarPopover(event.target)) return

  const nextElement = findEditableElement(event.target)

  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation()

  void saveInlineEditorAndSelect(nextElement)
}

const removeDocumentMouseDownListener = function () {
  document.removeEventListener('mousedown', handleDocumentMouseDown, true)
  document.removeEventListener('pointerdown', handleDocumentMouseDown, true)
}

watch(
  [isInlineEditing, getElement],
  async ([active, selectedElement]) => {
    if (active) {
      if (!selectedElement && (editor.value || inlineElement.value)) {
        return
      }

      if (editor.value && inlineElement.value !== selectedElement) {
        teardownEditor(getFinalEditorHtml(editor.value))
      }

      await startEditor()
      return
    }

    if (editor.value) {
      teardownEditor(getFinalEditorHtml(editor.value))
    }
  },
  { immediate: true },
)

watch(isInlineEditing, (active) => {
  if (active) {
    document.addEventListener('mousedown', handleDocumentMouseDown, true)
    document.addEventListener('pointerdown', handleDocumentMouseDown, true)
    return
  }

  removeDocumentMouseDownListener()
})

const closeTypographyOnScrollDown = function () {
  showTypography.value = false
}

watch(showTypography, (isOpen) => {
  if (isOpen) {
    attachTypographyPositionListeners()
    document.addEventListener('pointerdown', closeTypographyOnOutsideClick)
    document.addEventListener('pointerdown', markTypographySelectInteraction, true)
    document.addEventListener('change', markTypographySelectInteraction, true)
    window.addEventListener(CLOSE_EDIT_TOOLBAR_POPOVERS_EVENT, closeTypographyOnScrollDown)
    return
  }

  detachTypographyPositionListeners()
  document.removeEventListener('pointerdown', closeTypographyOnOutsideClick)
  document.removeEventListener('pointerdown', markTypographySelectInteraction, true)
  document.removeEventListener('change', markTypographySelectInteraction, true)
  window.removeEventListener(CLOSE_EDIT_TOOLBAR_POPOVERS_EVENT, closeTypographyOnScrollDown)
})

onBeforeUnmount(() => {
  removeDocumentMouseDownListener()
  detachTypographyPositionListeners()
  document.removeEventListener('pointerdown', closeTypographyOnOutsideClick)
  document.removeEventListener('pointerdown', markTypographySelectInteraction, true)
  document.removeEventListener('change', markTypographySelectInteraction, true)
  window.removeEventListener(CLOSE_EDIT_TOOLBAR_POPOVERS_EVENT, closeTypographyOnScrollDown)

  if (editor.value) {
    teardownEditor(getFinalEditorHtml(editor.value))
  }

  if (pageBuilderStateStore.getInlineTipTapEditor) {
    pageBuilderStateStore.setInlineTipTapEditor(false)
  }
})
</script>

<template>
  <div data-pbx-inline-editor-ui>
    <ConfirmActionModal
      maxWidth="4xl"
      :showDynamicModalBuilder="showModalUrl"
      type="success"
      :gridColumnAmount="2"
      :title="translate('Enter URL')"
      :description="
        translate(
          'Add a valid URL to transform the selected text into a clickable hyperlink that directs users to the specified web address.',
        )
      "
      :firstButtonText="translate('Close')"
      :secondButtonText="urlEntered ? translate('Remove url') : undefined"
      :thirdButtonText="translate('Save')"
      @firstModalButtonFunctionDynamicModalBuilder="closeUrlModal"
      @secondModalButtonFunctionDynamicModalBuilder="removeUrl"
      @thirdModalButtonFunctionDynamicModalBuilder="saveUrl"
    >
      <main>
        <div class="pbx-min-h-[8rem]">
          <div class="pbx-myInputGroup">
            <label class="pbx-myPrimaryInputLabel" for="inline-tiptap-url">
              <span>{{ translate('Enter URL') }}</span>
            </label>
            <input
              id="inline-tiptap-url"
              v-model="urlEntered"
              class="pbx-myPrimaryInput pbx-mt-1 pbx-w-full"
              type="url"
              placeholder="https://"
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
        </div>
      </main>
    </ConfirmActionModal>
  </div>

  <div
    v-if="isInlineEditing && editor"
    data-pbx-inline-editor-ui
    @mousedown.prevent.stop
    @click.stop
  >
    <div
      @mousedown.prevent.stop="saveInlineEditor"
      class="pbx-h-8 pbx-px-2 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-gap-1 pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-ring-0 pbx-cursor-pointer pbx-border pbx-border-gray-500"
    >
      <span class="material-symbols-outlined pbx-text-[18px]"> save </span>
      <span class="pbx-text-xs">{{ isSaving ? translate('Saving') : translate('Save') }}</span>
    </div>

    <div class="pbx-h-6 pbx-border-l pbx-border-gray-300"></div>

    <div class="pbx-shrink-0">
      <div
        ref="typographyMenuRef"
        @click="toggleShowTypography"
        class="pbx-h-8 pbx-px-2 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-gap-1 pbx-text-myPrimaryDarkGrayColor hover:pbx-bg-myPrimaryLinkColor hover:pbx-text-white focus-visible:pbx-ring-0 pbx-cursor-pointer pbx-border pbx-border-gray-500 pbx-select-none"
        :class="{ 'pbx-bg-myPrimaryLinkColor pbx-text-white': showTypography }"
      >
        <span class="pbx-text-xs pbx-font-semibold">{{ translate('Font') }}</span>
      </div>
    </div>

    <div
      @click="toggleBold"
      class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
      :class="{ 'pbx-bg-myPrimaryLinkColor pbx-text-white': editorIsActive('bold') }"
    >
      <span class="material-symbols-outlined pbx-text-[18px]"> format_bold </span>
    </div>

    <div
      @click="toggleItalic"
      class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
      :class="{ 'pbx-bg-myPrimaryLinkColor pbx-text-white': editorIsActive('italic') }"
    >
      <span class="material-symbols-outlined pbx-text-[18px]"> format_italic </span>
    </div>

    <div
      v-for="level in [2, 3, 4, 5, 6] as const"
      :key="level"
      @click="toggleHeading(level)"
      class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
      :class="{
        'pbx-bg-myPrimaryLinkColor pbx-text-white': headingIsActive(level),
      }"
    >
      <span class="pbx-text-xs pbx-font-semibold">H{{ level }}</span>
    </div>

    <div
      @click="openUrlModal"
      class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
      :class="{ 'pbx-bg-myPrimaryLinkColor pbx-text-white': editorIsActive('link') }"
    >
      <span class="material-symbols-outlined pbx-text-[18px]"> link </span>
    </div>

    <div
      @click="toggleBulletList"
      class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
      :class="{ 'pbx-bg-myPrimaryLinkColor pbx-text-white': editorIsActive('bulletList') }"
    >
      <span class="material-symbols-outlined pbx-text-[18px]"> format_list_bulleted </span>
    </div>

    <div
      @click="toggleTextAlign('left')"
      class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
      :class="{ 'pbx-bg-myPrimaryLinkColor pbx-text-white': editorIsActive({ textAlign: 'left' }) }"
    >
      <span class="material-symbols-outlined pbx-text-[18px]"> format_align_left </span>
    </div>

    <div
      @click="toggleTextAlign('center')"
      class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
      :class="{
        'pbx-bg-myPrimaryLinkColor pbx-text-white': editorIsActive({ textAlign: 'center' }),
      }"
    >
      <span class="material-symbols-outlined pbx-text-[18px]"> format_align_center </span>
    </div>

    <div
      @click="toggleTextAlign('right')"
      class="pbx-h-8 pbx-w-8 pbx-rounded-sm pbx-flex pbx-items-center pbx-justify-center pbx-aspect-square pbx-text-myPrimaryDarkGrayColor pbx-border pbx-border-gray-500 pbx-cursor-pointer pbx-transition-all pbx-duration-200 pbx-ease-in-out hover:pbx-shadow-md hover:pbx-text-yellow-500 focus-visible:pbx-ring-0 pbx-transition-transform pbx-duration-200"
      :class="{
        'pbx-bg-myPrimaryLinkColor pbx-text-white': editorIsActive({ textAlign: 'right' }),
      }"
    >
      <span class="material-symbols-outlined pbx-text-[18px]"> format_align_right </span>
    </div>

    <div class="pbx-h-6 pbx-border-l pbx-border-gray-300"></div>
  </div>

  <Teleport to="body">
    <div
      v-if="showTypography"
      ref="typographyPopoverRef"
      data-pbx-edit-toolbar-popover
      data-pbx-typography-menu-popover
      :style="typographyPopoverStyle"
      class="pbx-fixed pbx-z-50 pbx-max-h-[70vh] pbx-overflow-y-auto pbx-rounded-lg pbx-bg-white pbx-py-2 pbx-px-2 pbx-shadow-lg pbx-border pbx-border-solid pbx-border-gray-200"
      @mousedown.stop
      @pointerdown.stop
      @click.stop
    >
      <TypographyForTipTap></TypographyForTipTap>
    </div>
  </Teleport>
</template>
