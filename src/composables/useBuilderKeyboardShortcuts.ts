import { onBeforeUnmount, onMounted } from 'vue'

type ShortcutHandler = () => void | Promise<void>

interface BuilderKeyboardShortcutsOptions {
  canUndo: () => boolean
  canRedo: () => boolean
  isBlocked: () => boolean
  onUndo: ShortcutHandler
  onRedo: ShortcutHandler
  onSave: ShortcutHandler
  onDeselect: ShortcutHandler
  onDelete: () => void
  hasSelection: () => boolean
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true"], .pbx-inline-tiptap-editor, .ProseMirror',
    ),
  )
}

export function useBuilderKeyboardShortcuts(options: BuilderKeyboardShortcutsOptions): void {
  const handleKeydown = (event: KeyboardEvent) => {
    if (options.isBlocked() || isEditableTarget(event.target)) return

    const modifier = event.metaKey || event.ctrlKey

    if (modifier && event.key.toLowerCase() === 'z' && !event.shiftKey) {
      event.preventDefault()
      if (options.canUndo()) void options.onUndo()
      return
    }

    if (
      (modifier && event.shiftKey && event.key.toLowerCase() === 'z') ||
      (modifier && event.key.toLowerCase() === 'y')
    ) {
      event.preventDefault()
      if (options.canRedo()) void options.onRedo()
      return
    }

    if (modifier && event.key.toLowerCase() === 's') {
      event.preventDefault()
      void options.onSave()
      return
    }

    if (event.key === 'Escape') {
      void options.onDeselect()
      return
    }

    if ((event.key === 'Delete' || event.key === 'Backspace') && options.hasSelection()) {
      event.preventDefault()
      options.onDelete()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}
