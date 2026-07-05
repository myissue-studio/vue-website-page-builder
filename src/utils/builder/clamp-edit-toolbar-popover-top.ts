const PAGE_BUILDER_NAVBAR_ID = 'pagebuilder-navbar'

export function getPageBuilderNavbarBottomInset(gap = 4): number {
  const navbar = document.getElementById(PAGE_BUILDER_NAVBAR_ID)
  if (!navbar) return 0

  return Math.max(0, Math.round(navbar.getBoundingClientRect().bottom + gap))
}

export function getEditToolbarPopoverTop(triggerBottom: number, gap = 4): number {
  return Math.max(getPageBuilderNavbarBottomInset(gap), Math.round(triggerBottom + gap))
}
