/**
 * Returns true when a pointer/mouse event should not close the inline TipTap editor
 * because the user is interacting with the floating edit toolbar or a teleported
 * toolbar popover (e.g. font menu).
 *
 * The right style sidebar is intentionally NOT preserved: TipTap must commit before
 * class/style mutations, otherwise closing the editor rewrites DOM from TipTap's
 * model and drops padding/color changes applied while editing.
 *
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
