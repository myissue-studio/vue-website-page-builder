export const CLOSE_EDIT_TOOLBAR_POPOVERS_EVENT = 'pagebuilder:close-edit-toolbar-popovers'

export const EDIT_TOOLBAR_POPOVER_SCROLL_DOWN_CLOSE_PX = 80

let scrollCloseSuppressedUntil = 0

export function hasOpenEditToolbarPopovers(): boolean {
  return Boolean(document.querySelector('[data-pbx-edit-toolbar-popover]'))
}

export function suppressEditToolbarPopoverScrollClose(durationMs = 800): void {
  scrollCloseSuppressedUntil = Math.max(scrollCloseSuppressedUntil, Date.now() + durationMs)
}

export function isEditToolbarPopoverScrollCloseSuppressed(): boolean {
  return Date.now() < scrollCloseSuppressedUntil
}

export function dispatchCloseEditToolbarPopovers(): void {
  window.dispatchEvent(new CustomEvent(CLOSE_EDIT_TOOLBAR_POPOVERS_EVENT))
}
