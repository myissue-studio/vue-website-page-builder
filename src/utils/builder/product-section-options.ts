import type {
  ProductCardStyle,
  ProductGridLayout,
  ProductMobileColumns,
  ProductSectionOptions,
} from '../../types'

export const PRODUCT_LAYOUT_OPTIONS: {
  value: ProductGridLayout
  labelKey: string
  hintKey: string
}[] = [
  { value: 'grid-1', labelKey: '1 product', hintKey: 'Full width' },
  { value: 'grid-2', labelKey: '2 products (grid)', hintKey: '2 columns' },
  { value: 'grid-3', labelKey: '3 products (grid)', hintKey: '3 columns' },
  { value: 'grid-4', labelKey: '4 products (grid)', hintKey: '4 columns' },
  { value: 'grid-6', labelKey: '6 products (grid)', hintKey: '6 columns' },
]

export const PRODUCT_CARD_STYLE_OPTIONS: {
  value: ProductCardStyle
  labelKey: string
  hintKey: string
}[] = [
  { value: 'minimal', labelKey: 'Clean', hintKey: 'No border' },
  { value: 'bordered', labelKey: 'Bordered', hintKey: 'Outlined cards' },
  { value: 'shadow', labelKey: 'Shadow', hintKey: 'Soft depth' },
  { value: 'elevated', labelKey: 'Elevated', hintKey: 'Border and shadow' },
]

const PRODUCT_CARD_BASE = 'product-card flex flex-col h-full'

export const PRODUCT_CARD_STYLE_CLASS: Record<ProductCardStyle, string> = {
  minimal: `${PRODUCT_CARD_BASE} py-2`,
  bordered: `${PRODUCT_CARD_BASE} pt-4 pb-3 px-4 rounded-2xl border border-solid border-gray-200 bg-white`,
  shadow: `${PRODUCT_CARD_BASE} pt-4 pb-3 px-4 rounded-2xl bg-white shadow-md`,
  elevated: `${PRODUCT_CARD_BASE} pt-4 pb-3 px-4 rounded-2xl border border-solid border-gray-200 bg-white shadow-sm`,
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
      return `grid ${mobile} md:grid-cols-3 myPrimaryGap items-stretch`
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
  return 'grid-3'
}

function normalizeCardStyle(value: string | null): ProductCardStyle {
  if (value === 'minimal' || value === 'bordered' || value === 'shadow' || value === 'elevated') {
    return value
  }
  return 'minimal'
}

export function parseProductSectionFromElement(section: HTMLElement): ProductSectionOptions {
  const layout = normalizeLayout(section.getAttribute('data-pbx-product-layout'))
  const mobileRaw = section.getAttribute('data-pbx-product-mobile-cols')
  const mobileColumns: ProductMobileColumns = mobileRaw === '2' ? 2 : 1
  const cardStyle = normalizeCardStyle(section.getAttribute('data-pbx-product-card-style'))
  const roundedImages = section.getAttribute('data-pbx-product-rounded-images') === 'true'

  return { layout, mobileColumns, cardStyle, roundedImages }
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
  const mobileColumns: ProductMobileColumns = options.mobileColumns === 2 ? 2 : 1
  const roundedImages = Boolean(options.roundedImages)

  section.setAttribute('data-pbx-product-layout', layout)
  section.setAttribute('data-pbx-product-mobile-cols', String(mobileColumns))
  section.setAttribute('data-pbx-product-card-style', cardStyle)
  section.setAttribute('data-pbx-product-rounded-images', roundedImages ? 'true' : 'false')

  const grid = findProductGridInSection(section)
  if (grid) {
    grid.className = prefixBuilderClasses(buildProductGridClass(layout, mobileColumns))
  }

  const imageWrapClass = prefixBuilderClasses(getProductImageWrapClass(roundedImages))
  const cardClass = prefixBuilderClasses(PRODUCT_CARD_STYLE_CLASS[cardStyle] ?? PRODUCT_CARD_STYLE_CLASS.minimal)

  findProductCardsInSection(section).forEach((card) => {
    card.className = cardClass
    const imageWrap = card.querySelector('[class*="product-card-image"]')
    if (imageWrap instanceof HTMLElement) {
      imageWrap.className = imageWrapClass
    }
  })
}

export const DEFAULT_PRODUCT_SECTION_OPTIONS: ProductSectionOptions = {
  layout: 'grid-3',
  mobileColumns: 1,
  cardStyle: 'minimal',
  roundedImages: false,
}
