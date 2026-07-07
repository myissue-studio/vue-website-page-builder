import type {
  ProductButtonStyle,
  PageBuilderProductInput,
  ProductCardStyle,
  ProductGridLayout,
} from '../../types'
import {
  buildProductCtaAnchorClass,
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
  openInNewTab?: boolean
  buttonStyle?: ProductButtonStyle
  roundedButtons?: boolean
  hidePrice?: boolean
  hideImage?: boolean
  hideButton?: boolean
  mobileColumns?: 1 | 2
}

const PRODUCT_CONTENT_HIDDEN_CLASS = 'hidden'

const STANDARD_PRODUCT_FIELDS = new Set([
  'id',
  'title',
  'description',
  'image',
  'imageAlt',
  'price',
  'compareAtPrice',
  'badge',
  'url',
  'buttonText',
  'sku',
])

function productLinkAttrs(openInNewTab: boolean): string {
  return openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''
}

function renderProductCard(
  product: PageBuilderProductInput,
  styleOptions: BuildProductSectionStyleOptions = {},
  sectionHasBadge = false,
): string {
  const cardStyle = styleOptions.cardStyle ?? 'minimal'
  const roundedImages = styleOptions.roundedImages ?? false
  const openInNewTab = styleOptions.openInNewTab ?? false
  const buttonStyle = styleOptions.buttonStyle ?? 'text'
  const roundedButtons = styleOptions.roundedButtons ?? false
  const hidePrice = styleOptions.hidePrice ?? false
  const hideImage = styleOptions.hideImage ?? false
  const hideButton = styleOptions.hideButton ?? false
  const linkAttrs = productLinkAttrs(openInNewTab)
  const productCardClass = PRODUCT_CARD_STYLE_CLASS[cardStyle] ?? PRODUCT_CARD_STYLE_CLASS.minimal
  const imageWrapClass = [
    getProductImageWrapClass(roundedImages),
    hideImage ? PRODUCT_CONTENT_HIDDEN_CLASS : '',
  ]
    .filter(Boolean)
    .join(' ')
  const id = product.id != null ? String(product.id) : ''
  const title = product.title ? escapeHtml(product.title) : ''
  const description = product.description ? escapeHtml(product.description) : ''
  const price = product.price != null ? escapeHtml(String(product.price)) : ''
  const compareAtPrice =
    product.compareAtPrice != null ? escapeHtml(String(product.compareAtPrice)) : ''
  const badge = product.badge ? escapeHtml(product.badge) : ''
  const imageSrc = product.image ? escapeHtml(product.image) : ''
  const imageAlt = product.imageAlt ? escapeHtml(product.imageAlt) : title || 'Product'
  const url = product.url ? escapeHtml(product.url) : ''
  const buttonText = product.buttonText ? escapeHtml(product.buttonText) : ''

  let imageHtml = ''
  if (imageSrc) {
    const imgTag = `<img class="object-cover w-full object-top aspect-square " src="${imageSrc}" alt="${imageAlt}">`
    imageHtml = url
      ? `<div class="${imageWrapClass}" data-pb-no-inline-text><a href="${url}"${linkAttrs}>${imgTag}</a></div>`
      : `<div class="${imageWrapClass}" data-pb-no-inline-text>${imgTag}</div>`
  }

  const badgeHtml = badge
    ? `<div class="product-card-badge text-xs font-medium uppercase tracking-wide text-gray-500 pt-2"><p>${badge}</p></div>`
    : sectionHasBadge
      ? `<div class="product-card-badge text-xs font-medium uppercase tracking-wide text-gray-500 pt-2 min-h-6"></div>`
      : ''

  const titleHtml = title
    ? `<div class="product-card-title text-lg font-semibold text-gray-900 pt-2 min-h-16">${url ? `<p><a href="${url}"${linkAttrs}>${title}</a></p>` : `<p>${title}</p>`}</div>`
    : ''

  const descriptionHtml = description
    ? `<div class="product-card-description text-sm text-gray-600 pt-1"><p>${description}</p></div>`
    : ''

  const customEntries = Object.entries(product as Record<string, unknown>).filter(
    ([key, value]) =>
      !STANDARD_PRODUCT_FIELDS.has(key) && value != null && String(value).trim() !== '',
  )
  const customFieldsHtml = customEntries.length
    ? `<div class="product-card-custom-fields text-sm text-gray-600 pt-1">${customEntries
        .map(([key, value]) => {
          const slug = key
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
          return `<div class="product-card-custom-field product-card-custom-field-${slug}"><p><strong>${escapeHtml(key)}</strong>: ${escapeHtml(String(value))}</p></div>`
        })
        .join('')}</div>`
    : ''

  let footerHtml = ''
  const hasFooter = Boolean(price || compareAtPrice || (url && buttonText))
  if (hasFooter) {
    let priceRowHtml = ''
    if (price || compareAtPrice) {
      const priceParts = [
        compareAtPrice
          ? `<div class="product-card-compare text-sm line-through text-gray-400"><p>${compareAtPrice}</p></div>`
          : '',
        price
          ? `<div class="product-card-price text-2xl font-semibold text-gray-900"><p>${price}</p></div>`
          : '',
      ].filter(Boolean)
      const priceRowClass = [
        'product-card-price-row flex flex-wrap items-baseline gap-2 pt-2',
        hidePrice ? PRODUCT_CONTENT_HIDDEN_CLASS : '',
      ]
        .filter(Boolean)
        .join(' ')
      priceRowHtml = `<div class="${priceRowClass}">${priceParts.join('')}</div>`
    }

    const ctaAnchorClass = buildProductCtaAnchorClass(buttonStyle, roundedButtons)
    const ctaHtml =
      url && buttonText
        ? `<div class="product-card-cta text-sm font-semibold pt-3${hideButton ? ` ${PRODUCT_CONTENT_HIDDEN_CLASS}` : ''}"><p><a class="${ctaAnchorClass}" href="${url}"${linkAttrs}>${buttonText}</a></p></div>`
        : ''

    footerHtml = `<div class="product-card-footer mt-auto flex flex-col">${priceRowHtml}${ctaHtml}</div>`
  }

  return [
    `<div class="${productCardClass}" data-pbx-product-id="${escapeHtml(id)}">`,
    imageHtml,
    '<div class="break-words py-2 product-card-body text-gray-900 flex flex-col flex-1">',
    '<div class="product-card-meta flex flex-col flex-1">',
    badgeHtml,
    titleHtml,
    descriptionHtml,
    customFieldsHtml,
    '</div>',
    footerHtml,
    '</div></div>',
  ]
    .filter(Boolean)
    .join('\n')
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
  const openInNewTab = styleOptions.openInNewTab ?? false
  const buttonStyle = styleOptions.buttonStyle ?? 'text'
  const roundedButtons = styleOptions.roundedButtons ?? false
  const hidePrice = styleOptions.hidePrice ?? false
  const hideImage = styleOptions.hideImage ?? false
  const hideButton = styleOptions.hideButton ?? false

  const sectionHasBadge = products.some((p) => Boolean(p.badge))
  const cards = products
    .map((product) => renderProductCard(product, styleOptions, sectionHasBadge))
    .join('\n')
  const gridClass = buildProductGridClass(layout, mobileColumns)

  return `<section data-component-title="${escapeHtml(sectionTitle)}" data-pbx-product-section="true" data-pbx-product-ids="${escapeHtml(productIds)}" data-pbx-product-layout="${escapeHtml(String(layout))}" data-pbx-product-mobile-cols="${mobileColumns}" data-pbx-product-card-style="${escapeHtml(cardStyle)}" data-pbx-product-rounded-images="${roundedImages ? 'true' : 'false'}" data-pbx-product-open-in-new-tab="${openInNewTab ? 'true' : 'false'}" data-pbx-product-button-style="${escapeHtml(buttonStyle)}" data-pbx-product-rounded-buttons="${roundedButtons ? 'true' : 'false'}" data-pbx-product-hide-price="${hidePrice ? 'true' : 'false'}" data-pbx-product-hide-image="${hideImage ? 'true' : 'false'}" data-pbx-product-hide-button="${hideButton ? 'true' : 'false'}">
<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="${gridClass}" data-pbx-product-grid="true">
${cards}
</div></div></div>
</section>`
}
