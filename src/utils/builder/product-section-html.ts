import type { PageBuilderProductInput, ProductCardStyle, ProductGridLayout } from '../../types'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const GRID_CLASS: Record<ProductGridLayout, string> = {
  'grid-1': 'myPrimaryGap grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 items-stretch',
  'grid-2': 'myPrimaryGap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 items-stretch',
  'grid-3': 'myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 items-stretch',
  'grid-4': 'myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 items-stretch',
  'grid-6': 'grid grid-cols-2 md:grid-cols-3 myPrimaryGap items-stretch',
}

const PRODUCT_CARD_BASE = 'product-card flex flex-col h-full'

const CARD_STYLE_CLASS: Record<ProductCardStyle, string> = {
  minimal: `${PRODUCT_CARD_BASE} py-2`,
  bordered: `${PRODUCT_CARD_BASE} pt-4 pb-3 px-4 rounded-2xl border border-solid border-gray-200 bg-white`,
  shadow: `${PRODUCT_CARD_BASE} pt-4 pb-3 px-4 rounded-2xl bg-white shadow-md`,
  elevated: `${PRODUCT_CARD_BASE} pt-4 pb-3 px-4 rounded-2xl border border-solid border-gray-200 bg-white shadow-sm`,
}

export interface BuildProductSectionStyleOptions {
  cardStyle?: ProductCardStyle
  roundedImages?: boolean
}

function renderProductCard(
  product: PageBuilderProductInput,
  _layout: ProductGridLayout,
  styleOptions: BuildProductSectionStyleOptions = {},
): string {
  const cardStyle = styleOptions.cardStyle ?? 'minimal'
  const roundedImages = styleOptions.roundedImages ?? false
  const productCardClass = CARD_STYLE_CLASS[cardStyle] ?? CARD_STYLE_CLASS.minimal
  const imageWrapClass = roundedImages
    ? 'product-card-image shrink-0 rounded-xl overflow-hidden'
    : 'product-card-image shrink-0'
  const id = product.id != null ? String(product.id) : ''
  const title = product.title ? escapeHtml(product.title) : ''
  const description = product.description ? escapeHtml(product.description) : ''
  const price = product.price != null ? escapeHtml(String(product.price)) : ''
  const compareAtPrice =
    product.compareAtPrice != null ? escapeHtml(String(product.compareAtPrice)) : ''
  const badge = product.badge ? escapeHtml(product.badge) : ''
  const imageSrc = product.image ? escapeHtml(product.image) : ''
  const imageAlt = product.imageAlt
    ? escapeHtml(product.imageAlt)
    : title || 'Product'
  const url = product.url ? escapeHtml(product.url) : ''
  const buttonText = product.buttonText ? escapeHtml(product.buttonText) : ''

  const parts: string[] = []

  parts.push(`<div class="${productCardClass}" data-pbx-product-id="${escapeHtml(id)}">`)

  if (imageSrc) {
    const imgTag = `<img class="object-cover w-full object-top aspect-square " src="${imageSrc}" alt="${imageAlt}">`
    parts.push(
      url
        ? `<div class="${imageWrapClass}"><a href="${url}">${imgTag}</a></div>`
        : `<div class="${imageWrapClass}">${imgTag}</div>`,
    )
  }

  parts.push('<div class="break-words py-2 product-card-body flex flex-col flex-1">')

  parts.push('<div class="product-card-meta flex flex-col flex-1">')

  parts.push(
    `<div class="product-card-badge text-xs font-medium uppercase tracking-wide text-gray-500 pt-2 min-h-5">${badge ? `<p>${badge}</p>` : '<p></p>'}</div>`,
  )

  if (title) {
    const titleInner = url ? `<p><a href="${url}">${title}</a></p>` : `<p>${title}</p>`
    parts.push(
      `<div class="product-card-title text-lg font-semibold pt-2 line-clamp-2">${titleInner}</div>`,
    )
  }

  if (description) {
    parts.push(
      `<div class="product-card-description text-sm text-gray-600 pt-1 line-clamp-3"><p>${description}</p></div>`,
    )
  }

  parts.push('</div>')

  const hasFooter = Boolean(price || compareAtPrice || (url && buttonText))
  if (hasFooter) {
    parts.push('<div class="product-card-footer mt-auto flex flex-col">')

    if (price || compareAtPrice) {
      parts.push('<div class="product-card-price-row flex flex-wrap items-baseline gap-2 pt-2">')
      if (compareAtPrice) {
        parts.push(
          `<div class="product-card-compare text-sm line-through text-gray-400"><p>${compareAtPrice}</p></div>`,
        )
      }
      if (price) {
        parts.push(
          `<div class="product-card-price text-2xl font-semibold"><p>${price}</p></div>`,
        )
      }
      parts.push('</div>')
    }

    if (url && buttonText) {
      parts.push(
        `<div class="product-card-cta text-sm font-semibold pt-3"><p><a href="${url}">${buttonText}</a></p></div>`,
      )
    }

    parts.push('</div>')
  }

  parts.push('</div></div>')
  return parts.join('\n')
}

export function buildProductSectionHtml(
  products: ReadonlyArray<PageBuilderProductInput>,
  layout: ProductGridLayout = 'grid-3',
  sectionTitle = 'Products',
  styleOptions: BuildProductSectionStyleOptions = {},
): string {
  if (!products.length) return ''

  const productIds = products
    .map((p) => (p.id != null ? String(p.id) : ''))
    .filter(Boolean)
    .join(',')

  const cards = products
    .map((product) => renderProductCard(product, layout, styleOptions))
    .join('\n')
  const gridClass = GRID_CLASS[layout] ?? GRID_CLASS['grid-3']

  return `<section data-component-title="${escapeHtml(sectionTitle)}" data-pbx-product-section="true" data-pbx-product-ids="${escapeHtml(productIds)}">
<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="${gridClass}">
${cards}
</div></div></div>
</section>`
}
