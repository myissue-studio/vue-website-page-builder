import type { PageBuilderProductInput, ProductCardStyle, ProductGridLayout } from '../../types'
import {
  buildProductGridClass,
  getProductImageWrapClass,
  PRODUCT_CARD_STYLE_CLASS,
} from './product-section-options'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export interface BuildProductSectionStyleOptions {
  cardStyle?: ProductCardStyle
  roundedImages?: boolean
  mobileColumns?: 1 | 2
}

function renderProductCard(
  product: PageBuilderProductInput,
  styleOptions: BuildProductSectionStyleOptions = {},
): string {
  const cardStyle = styleOptions.cardStyle ?? 'minimal'
  const roundedImages = styleOptions.roundedImages ?? false
  const productCardClass = PRODUCT_CARD_STYLE_CLASS[cardStyle] ?? PRODUCT_CARD_STYLE_CLASS.minimal
  const imageWrapClass = getProductImageWrapClass(roundedImages)
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

  const mobileColumns = styleOptions.mobileColumns === 2 ? 2 : 1
  const cardStyle = styleOptions.cardStyle ?? 'minimal'
  const roundedImages = styleOptions.roundedImages ?? false

  const cards = products.map((product) => renderProductCard(product, styleOptions)).join('\n')
  const gridClass = buildProductGridClass(layout, mobileColumns)

  return `<section data-component-title="${escapeHtml(sectionTitle)}" data-pbx-product-section="true" data-pbx-product-ids="${escapeHtml(productIds)}" data-pbx-product-layout="${escapeHtml(String(layout))}" data-pbx-product-mobile-cols="${mobileColumns}" data-pbx-product-card-style="${escapeHtml(cardStyle)}" data-pbx-product-rounded-images="${roundedImages ? 'true' : 'false'}">
<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="${gridClass}" data-pbx-product-grid="true">
${cards}
</div></div></div>
</section>`
}
