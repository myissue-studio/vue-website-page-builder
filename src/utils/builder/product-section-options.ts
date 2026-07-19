import type {
  ProductButtonStyle,
  PageBuilderProductInput,
  ProductCardDesign,
  ProductCardStyle,
  ProductGridLayout,
  ProductMobileColumns,
  ProductSectionOptions,
} from '../../types'

export const PRODUCT_LAYOUT_OPTIONS: {
  value: ProductGridLayout
  labelKey: string
  hintKey: string
  iconKey: string
}[] = [
  { value: 'grid-1', labelKey: '1 product', hintKey: 'Full width', iconKey: 'grid_4x4' },
  { value: 'grid-2', labelKey: '2 products (grid)', hintKey: '2 columns', iconKey: 'grid_4x4' },
  { value: 'grid-3', labelKey: '3 products (grid)', hintKey: '3 columns', iconKey: 'grid_4x4' },
  { value: 'grid-4', labelKey: '4 products (grid)', hintKey: '4 columns', iconKey: 'grid_4x4' },
  { value: 'grid-6', labelKey: '6 products (grid)', hintKey: '6 columns', iconKey: 'grid_4x4' },
]

export const PRODUCT_MOBILE_COLUMN_OPTIONS: {
  value: ProductMobileColumns
  labelKey: string
  hintKey: string
  iconKey: string
}[] = [
  { value: 1, labelKey: '1 column', hintKey: 'Single product per row', iconKey: 'grid_4x4' },
  { value: 2, labelKey: '2 columns', hintKey: 'Two products per row', iconKey: 'grid_4x4' },
]

export const PRODUCT_CARD_DESIGN_OPTIONS: {
  value: ProductCardDesign
  labelKey: string
  hintKey: string
  iconKey: string
}[] = [
  {
    value: 'classic',
    labelKey: 'Classic',
    hintKey: 'Catalog layout with clear hierarchy',
    iconKey: 'landscape',
  },
  {
    value: 'modern',
    labelKey: 'Modern',
    hintKey: 'Bold type and tighter spacing',
    iconKey: 'format_overline',
  },
  {
    value: 'minimal',
    labelKey: 'Minimal',
    hintKey: 'Quiet type and more whitespace',
    iconKey: 'filter_retrolux',
  },
]

export const PRODUCT_CARD_STYLE_OPTIONS: {
  value: ProductCardStyle
  labelKey: string
  hintKey: string
  iconKey: string
}[] = [
  { value: 'minimal', labelKey: 'Clean', hintKey: 'No border', iconKey: 'horizontal_rule' },
  { value: 'bordered', labelKey: 'Bordered', hintKey: 'Outlined cards', iconKey: 'line_curve' },
  { value: 'shadow', labelKey: 'Shadow', hintKey: 'Soft depth', iconKey: 'ev_shadow' },
  {
    value: 'elevated',
    labelKey: 'Elevated',
    hintKey: 'Border and shadow',
    iconKey: 'contrast',
  },
]

export const PRODUCT_BUTTON_STYLE_OPTIONS: {
  value: ProductButtonStyle
  labelKey: string
  hintKey: string
  iconKey: string
}[] = [
  {
    value: 'text',
    labelKey: 'Text link',
    hintKey: 'Use a text-only CTA',
    iconKey: 'radio_button_checked',
  },
  {
    value: 'button',
    labelKey: 'Button design',
    hintKey: 'Use brand-color button CTA',
    iconKey: 'radio_button_checked',
  },
]

const PRODUCT_CARD_BASE = 'product-card flex flex-col h-full'

export const PRODUCT_CARD_STYLE_CLASS: Record<ProductCardStyle, string> = {
  minimal: `${PRODUCT_CARD_BASE} py-2`,
  bordered: `${PRODUCT_CARD_BASE} pt-4 pb-3 px-4 rounded-2xl border border-solid border-gray-200 bg-white`,
  shadow: `${PRODUCT_CARD_BASE} pt-4 pb-3 px-4 rounded-2xl bg-white shadow-md`,
  elevated: `${PRODUCT_CARD_BASE} pt-4 pb-3 px-4 rounded-2xl border border-solid border-gray-200 bg-white shadow-sm`,
}

export type ProductCardDesignParts = {
  marker: string
  body: string
  badge: string
  title: string
  description: string
  price: string
  compare: string
  image: string
}

/** Typography/spacing presets — orthogonal to border/shadow card style. */
export const PRODUCT_CARD_DESIGN_PARTS: Record<ProductCardDesign, ProductCardDesignParts> = {
  classic: {
    marker: 'product-card-design-classic',
    body: 'break-words py-2 product-card-body text-gray-900 flex flex-col flex-1',
    badge: 'product-card-badge text-xs font-medium uppercase tracking-wide text-gray-500 pt-2',
    title: 'product-card-title text-lg font-semibold text-gray-900 pt-2 min-h-16',
    description: 'product-card-description text-sm text-gray-600 pt-1',
    price: 'product-card-price text-2xl font-semibold text-gray-900',
    compare: 'product-card-compare text-sm line-through text-gray-400',
    image: 'object-cover w-full object-top aspect-square',
  },
  modern: {
    marker: 'product-card-design-modern',
    body: 'break-words pt-3 pb-2 product-card-body text-gray-900 flex flex-col flex-1',
    badge: 'product-card-badge text-xs font-semibold uppercase tracking-widest text-gray-400 pt-2',
    title: 'product-card-title text-xl font-bold tracking-tight text-gray-900 pt-2',
    description: 'product-card-description text-sm text-gray-500 pt-1',
    price: 'product-card-price text-xl font-bold text-gray-900',
    compare: 'product-card-compare text-sm line-through text-gray-400',
    image: 'object-cover w-full object-top aspect-square',
  },
  minimal: {
    marker: 'product-card-design-minimal',
    body: 'break-words py-4 product-card-body text-gray-900 flex flex-col flex-1',
    badge: 'product-card-badge text-xs font-normal text-gray-400 pt-3',
    title: 'product-card-title text-base font-medium text-gray-900 pt-3',
    description: 'product-card-description text-xs text-gray-500 pt-2',
    price: 'product-card-price text-base font-medium text-gray-900',
    compare: 'product-card-compare text-xs line-through text-gray-400',
    image: 'object-cover w-full object-top aspect-square',
  },
}

export function normalizeCardDesign(value: string | null | undefined): ProductCardDesign {
  if (value === 'classic' || value === 'modern' || value === 'minimal') return value
  return 'classic'
}

export function getProductCardDesignParts(
  design: ProductCardDesign | null | undefined,
): ProductCardDesignParts {
  const key = normalizeCardDesign(design ?? null)
  return PRODUCT_CARD_DESIGN_PARTS[key] ?? PRODUCT_CARD_DESIGN_PARTS.classic
}

export function buildProductCardClass(
  cardStyle: ProductCardStyle | null | undefined,
  cardDesign: ProductCardDesign | null | undefined = 'classic',
): string {
  const style =
    PRODUCT_CARD_STYLE_CLASS[cardStyle as ProductCardStyle] ?? PRODUCT_CARD_STYLE_CLASS.minimal
  const design = getProductCardDesignParts(cardDesign)
  return `${style} ${design.marker}`
}

export function buildProductGridClass(
  layout: ProductGridLayout,
  mobileColumns: ProductMobileColumns = 1,
): string {
  const mobile = mobileColumns === 2 ? 'grid-cols-2' : 'grid-cols-1'

  switch (layout) {
    case 'grid-1':
      return 'myPrimaryGap grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 items-stretch'
    case 'grid-2':
      return `myPrimaryGap grid ${mobile} sm:grid-cols-2 lg:grid-cols-2 items-stretch`
    case 'grid-3':
      return `myPrimaryGap grid ${mobile} sm:grid-cols-3 lg:grid-cols-3 items-stretch`
    case 'grid-4':
      return `myPrimaryGap grid ${mobile} sm:grid-cols-2 lg:grid-cols-4 items-stretch`
    case 'grid-6':
      return `myPrimaryGap grid ${mobile} sm:grid-cols-2 lg:grid-cols-6 items-stretch`
    default:
      return `myPrimaryGap grid ${mobile} sm:grid-cols-3 lg:grid-cols-3 items-stretch`
  }
}

export function prefixBuilderClasses(classList: string, prefix = 'pbx-'): string {
  return classList
    .split(/\s+/)
    .filter(Boolean)
    .map((cls) => {
      const parts = cls.split(':')
      const base = parts.pop()!
      if (base.startsWith(prefix)) return cls
      return [...parts, prefix + base].join(':')
    })
    .join(' ')
}

export function getProductImageWrapClass(roundedImages: boolean): string {
  return roundedImages
    ? 'product-card-image shrink-0 rounded-xl overflow-hidden'
    : 'product-card-image shrink-0'
}

const PRODUCT_CONTENT_HIDDEN_CLASS = 'pbx-hidden'

export function buildProductCtaAnchorClass(
  buttonStyle: ProductButtonStyle,
  roundedButtons: boolean,
): string {
  if (buttonStyle === 'button') {
    return [
      'product-card-cta-link',
      'inline-flex',
      'items-center',
      'justify-center',
      'px-4',
      'py-2',
      'text-sm',
      'font-semibold',
      'bg-myPrimaryLinkColor',
      'text-white',
      'hover:text-white',
      roundedButtons ? 'rounded-full' : 'rounded-md',
    ].join(' ')
  }

  return 'product-card-cta-link text-myPrimaryLinkColor text-sm font-semibold'
}

export function productsHaveImages(products: ReadonlyArray<PageBuilderProductInput>): boolean {
  return products.some((product) => Boolean(product.image?.trim()))
}

export function productsHavePrices(products: ReadonlyArray<PageBuilderProductInput>): boolean {
  return products.some((product) => {
    const price = product.price != null ? String(product.price).trim() : ''
    const compareAtPrice =
      product.compareAtPrice != null ? String(product.compareAtPrice).trim() : ''
    return price !== '' || compareAtPrice !== ''
  })
}

export function productsHaveButtons(products: ReadonlyArray<PageBuilderProductInput>): boolean {
  return products.some((product) => {
    const url = product.url?.trim() ?? ''
    const buttonText = product.buttonText?.trim() ?? ''
    return url !== '' && buttonText !== ''
  })
}

export function productsHaveLinks(products: ReadonlyArray<PageBuilderProductInput>): boolean {
  return products.some((product) => Boolean(product.url?.trim()))
}

export function sectionHasProductImages(section: HTMLElement): boolean {
  return findProductCardsInSection(section).some((card) => {
    const imageWrap = card.querySelector('[class*="product-card-image"]')
    return imageWrap?.querySelector('img') != null
  })
}

export function sectionHasProductPrices(section: HTMLElement): boolean {
  return findProductCardsInSection(section).some((card) => {
    const price = card.querySelector('[class*="product-card-price"]')
    const compare = card.querySelector('[class*="product-card-compare"]')
    return Boolean(price?.textContent?.trim() || compare?.textContent?.trim())
  })
}

export function sectionHasProductButtons(section: HTMLElement): boolean {
  return findProductCardsInSection(section).some((card) => {
    const cta = card.querySelector('[class*="product-card-cta"]')
    return Boolean(cta?.querySelector('a[href]')?.textContent?.trim())
  })
}

export function sectionHasProductLinks(section: HTMLElement): boolean {
  return findProductCardsInSection(section).some((card) => {
    return Array.from(card.querySelectorAll('a[href]')).some((a) => {
      return Boolean(a.getAttribute('href')?.trim())
    })
  })
}

function setProductContentHidden(el: HTMLElement, hidden: boolean): void {
  el.classList.toggle(PRODUCT_CONTENT_HIDDEN_CLASS, hidden)
}

export function applyProductContentVisibilityInSection(
  section: HTMLElement,
  hidePrice: boolean,
  hideImage: boolean,
  hideButton: boolean,
): void {
  findProductCardsInSection(section).forEach((card) => {
    const imageWrap = card.querySelector('[class*="product-card-image"]')
    if (imageWrap instanceof HTMLElement) {
      setProductContentHidden(imageWrap, hideImage)
    }

    const priceRow = card.querySelector('[class*="product-card-price-row"]')
    if (priceRow instanceof HTMLElement) {
      setProductContentHidden(priceRow, hidePrice)
    }

    const cta = card.querySelector('[class*="product-card-cta"]')
    if (cta instanceof HTMLElement) {
      setProductContentHidden(cta, hideButton)
    }
  })
}

export function applyProductLinkTargetsInSection(
  section: HTMLElement,
  openInNewTab: boolean,
): void {
  findProductCardsInSection(section).forEach((card) => {
    card.querySelectorAll('a[href]').forEach((node) => {
      if (!(node instanceof HTMLAnchorElement)) return
      if (openInNewTab) {
        node.target = '_blank'
        node.rel = 'noopener noreferrer'
      } else {
        node.removeAttribute('target')
        node.removeAttribute('rel')
      }
    })
  })
}

export function applyProductLinksVisibilityInSection(
  section: HTMLElement,
  hideLinks: boolean,
): void {
  findProductCardsInSection(section).forEach((card) => {
    card.querySelectorAll('a').forEach((node) => {
      if (!(node instanceof HTMLAnchorElement)) return

      if (hideLinks) {
        const href = node.getAttribute('href')
        if (href && !node.getAttribute('data-pbx-href')) {
          node.setAttribute('data-pbx-href', href)
        }
        node.removeAttribute('href')
        node.removeAttribute('target')
        node.removeAttribute('rel')
        return
      }

      const savedHref = node.getAttribute('data-pbx-href')
      if (savedHref && !node.getAttribute('href')) {
        node.setAttribute('href', savedHref)
      }
    })
  })
}

function normalizeLayout(value: string | null): ProductGridLayout {
  if (
    value === 'grid-1' ||
    value === 'grid-2' ||
    value === 'grid-3' ||
    value === 'grid-4' ||
    value === 'grid-6'
  ) {
    return value
  }
  return 'grid-4'
}

function normalizeCardStyle(value: string | null): ProductCardStyle {
  if (value === 'minimal' || value === 'bordered' || value === 'shadow' || value === 'elevated') {
    return value
  }
  return 'minimal'
}

function normalizeButtonStyle(value: string | null): ProductButtonStyle {
  if (value === 'text' || value === 'button') return value
  return 'text'
}

export function parseProductSectionFromElement(section: HTMLElement): ProductSectionOptions {
  const layout = normalizeLayout(section.getAttribute('data-pbx-product-layout'))
  const mobileRaw = section.getAttribute('data-pbx-product-mobile-cols')
  const mobileColumns: ProductMobileColumns = mobileRaw === '2' ? 2 : 1
  const cardStyle = normalizeCardStyle(section.getAttribute('data-pbx-product-card-style'))
  const cardDesign = normalizeCardDesign(section.getAttribute('data-pbx-product-card-design'))
  const roundedImages = section.getAttribute('data-pbx-product-rounded-images') === 'true'
  const openInNewTab = section.getAttribute('data-pbx-product-open-in-new-tab') === 'true'
  const buttonStyle = normalizeButtonStyle(section.getAttribute('data-pbx-product-button-style'))
  const roundedButtons = section.getAttribute('data-pbx-product-rounded-buttons') === 'true'
  const hidePrice = section.getAttribute('data-pbx-product-hide-price') === 'true'
  const hideImage = section.getAttribute('data-pbx-product-hide-image') === 'true'
  const hideButton = section.getAttribute('data-pbx-product-hide-button') === 'true'
  const hideLinks = section.getAttribute('data-pbx-product-hide-links') === 'true'

  return {
    layout,
    mobileColumns,
    cardStyle,
    cardDesign,
    roundedImages,
    openInNewTab,
    buttonStyle,
    roundedButtons,
    hidePrice,
    hideImage,
    hideButton,
    hideLinks,
  }
}

function applyProductButtonStyleInSection(
  section: HTMLElement,
  buttonStyle: ProductButtonStyle,
  roundedButtons: boolean,
): void {
  const anchorClass = buildProductCtaAnchorClass(buttonStyle, roundedButtons)
  findProductCardsInSection(section).forEach((card) => {
    const ctaAnchor = card.querySelector('[class*="product-card-cta"] a')
    if (ctaAnchor instanceof HTMLElement) {
      ctaAnchor.className = prefixBuilderClasses(anchorClass)
    }
  })
}

function applyProductCardDesignClasses(
  card: HTMLElement,
  design: ProductCardDesign,
  emptyBadge: boolean,
): void {
  const parts = getProductCardDesignParts(design)

  const body = card.querySelector('[class*="product-card-body"]')
  if (body instanceof HTMLElement) {
    body.className = prefixBuilderClasses(parts.body)
  }

  const badge = card.querySelector('[class*="product-card-badge"]')
  if (badge instanceof HTMLElement) {
    const badgeClass =
      emptyBadge && !badge.textContent?.trim() ? `${parts.badge} min-h-6` : parts.badge
    badge.className = prefixBuilderClasses(badgeClass)
  }

  const title = card.querySelector('[class*="product-card-title"]')
  if (title instanceof HTMLElement) {
    title.className = prefixBuilderClasses(parts.title)
  }

  const description = card.querySelector('[class*="product-card-description"]')
  if (description instanceof HTMLElement) {
    description.className = prefixBuilderClasses(parts.description)
  }

  const price = card.querySelector('[class*="product-card-price"]')
  if (price instanceof HTMLElement) {
    price.className = prefixBuilderClasses(parts.price)
  }

  const compare = card.querySelector('[class*="product-card-compare"]')
  if (compare instanceof HTMLElement) {
    compare.className = prefixBuilderClasses(parts.compare)
  }

  const img = card.querySelector('[class*="product-card-image"] img')
  if (img instanceof HTMLElement) {
    img.className = prefixBuilderClasses(parts.image)
  }
}

export function findProductGridInSection(section: HTMLElement): HTMLElement | null {
  return section.querySelector('[data-pbx-product-grid]')
}

export function findProductCardsInSection(section: HTMLElement): HTMLElement[] {
  return Array.from(section.querySelectorAll('[data-pbx-product-id]')).filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  )
}

export function applyProductSectionOptionsToElement(
  section: HTMLElement,
  options: ProductSectionOptions,
): void {
  const layout = normalizeLayout(options.layout)
  const cardStyle = normalizeCardStyle(options.cardStyle ?? 'minimal')
  const cardDesign = normalizeCardDesign(options.cardDesign ?? 'classic')
  const mobileColumns: ProductMobileColumns = options.mobileColumns === 2 ? 2 : 1
  const roundedImages = Boolean(options.roundedImages)
  const openInNewTab = Boolean(options.openInNewTab)
  const buttonStyle = normalizeButtonStyle(options.buttonStyle ?? 'text')
  const roundedButtons = Boolean(options.roundedButtons)
  const hidePrice = Boolean(options.hidePrice)
  const hideImage = Boolean(options.hideImage)
  const hideButton = Boolean(options.hideButton)
  const hideLinks = Boolean(options.hideLinks)

  section.setAttribute('data-pbx-product-layout', layout)
  section.setAttribute('data-pbx-product-mobile-cols', String(mobileColumns))
  section.setAttribute('data-pbx-product-card-style', cardStyle)
  section.setAttribute('data-pbx-product-card-design', cardDesign)
  section.setAttribute('data-pbx-product-rounded-images', roundedImages ? 'true' : 'false')
  section.setAttribute('data-pbx-product-open-in-new-tab', openInNewTab ? 'true' : 'false')
  section.setAttribute('data-pbx-product-button-style', buttonStyle)
  section.setAttribute('data-pbx-product-rounded-buttons', roundedButtons ? 'true' : 'false')
  section.setAttribute('data-pbx-product-hide-price', hidePrice ? 'true' : 'false')
  section.setAttribute('data-pbx-product-hide-image', hideImage ? 'true' : 'false')
  section.setAttribute('data-pbx-product-hide-button', hideButton ? 'true' : 'false')
  section.setAttribute('data-pbx-product-hide-links', hideLinks ? 'true' : 'false')

  const grid = findProductGridInSection(section)
  if (grid) {
    grid.className = prefixBuilderClasses(buildProductGridClass(layout, mobileColumns))
  }

  const imageWrapClass = prefixBuilderClasses(getProductImageWrapClass(roundedImages))
  const cardClass = prefixBuilderClasses(buildProductCardClass(cardStyle, cardDesign))

  findProductCardsInSection(section).forEach((card) => {
    card.className = cardClass
    const imageWrap = card.querySelector('[class*="product-card-image"]')
    if (imageWrap instanceof HTMLElement) {
      imageWrap.className = imageWrapClass
    }
    const badge = card.querySelector('[class*="product-card-badge"]')
    const emptyBadge = Boolean(badge && !(badge.textContent ?? '').trim())
    applyProductCardDesignClasses(card, cardDesign, emptyBadge)
  })

  applyProductLinksVisibilityInSection(section, hideLinks)
  applyProductLinkTargetsInSection(section, openInNewTab)
  applyProductButtonStyleInSection(section, buttonStyle, roundedButtons)
  applyProductContentVisibilityInSection(section, hidePrice, hideImage, hideButton)
}

export const DEFAULT_PRODUCT_SECTION_OPTIONS: ProductSectionOptions = {
  layout: 'grid-4',
  mobileColumns: 1,
  cardStyle: 'minimal',
  cardDesign: 'classic',
  roundedImages: false,
  openInNewTab: false,
  buttonStyle: 'button',
  roundedButtons: true,
  hidePrice: false,
  hideImage: false,
  hideButton: false,
  hideLinks: false,
}
