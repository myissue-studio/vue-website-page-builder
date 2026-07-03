/**
 * Returns true when a pointer/mouse event should not close the inline TipTap editor
 * because the user is interacting with a teleported toolbar popover (e.g. font menu).
 * Native <select> option menus render outside the popover in the DOM.
 */
export function shouldPreserveInlineEditorForToolbarPopover(
  target: EventTarget | null,
): boolean {
  if (target instanceof Element && target.closest('#pbxEditToolbar')) {
    return true
  }

  if (target instanceof Element && target.closest('[data-pbx-edit-toolbar-popover]')) {
    return true
  }

  const active = document.activeElement
  if (active instanceof Element && active.closest('[data-pbx-edit-toolbar-popover]')) {
    return true
  }

  // Teleported toolbar popovers (font, more, color pickers, etc.).
  if (document.querySelector('[data-pbx-edit-toolbar-popover]')) {
    return true
  }

  return false
}
