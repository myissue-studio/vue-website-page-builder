import type {
  ProductButtonStyle,
  PageBuilderProductInput,
  ProductCardDesign,
  ProductCardStyle,
  ProductGridLayout,
} from '../../types'
import {
  buildProductCardClass,
  buildProductCtaAnchorClass,
  buildProductGridClass,
  getProductCardDesignParts,
  getProductImageWrapClass,
  normalizeCardDesign,
  PRODUCT_CONTENT_HIDDEN_ATTR,
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
  cardDesign?: ProductCardDesign
  roundedImages?: boolean
  openInNewTab?: boolean
  buttonStyle?: ProductButtonStyle
  roundedButtons?: boolean
  hidePrice?: boolean
  hideImage?: boolean
  hideButton?: boolean
  hideLinks?: boolean
  mobileColumns?: 1 | 2
}

const PRODUCT_CONTENT_HIDDEN_CLASS = 'hidden'

function productContentHiddenAttr(hidden: boolean): string {
  return hidden ? ` ${PRODUCT_CONTENT_HIDDEN_ATTR}="true"` : ''
}

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
  const cardDesign = normalizeCardDesign(styleOptions.cardDesign ?? 'classic')
  const design = getProductCardDesignParts(cardDesign)
  const roundedImages = styleOptions.roundedImages ?? false
  const openInNewTab = styleOptions.openInNewTab ?? false
  const buttonStyle = styleOptions.buttonStyle ?? 'text'
  const roundedButtons = styleOptions.roundedButtons ?? false
  const hidePrice = styleOptions.hidePrice ?? false
  const hideImage = styleOptions.hideImage ?? false
  const hideButton = styleOptions.hideButton ?? false
  const hideLinks = styleOptions.hideLinks ?? false
  const linkAttrs = productLinkAttrs(openInNewTab)
  const productCardClass = buildProductCardClass(cardStyle, cardDesign)
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
  const linkHref = url && !hideLinks ? ` href="${url}"` : ''
  const linkDataHref = url ? ` data-pbx-href="${url}"` : ''
  const buttonText = product.buttonText ? escapeHtml(product.buttonText) : ''

  let imageHtml = ''
  if (imageSrc) {
    const imgTag = `<img class="${design.image} " src="${imageSrc}" alt="${imageAlt}">`
    imageHtml = url
      ? `<div class="${imageWrapClass}"${productContentHiddenAttr(hideImage)} data-pb-no-inline-text><a${linkHref}${linkDataHref}${linkAttrs}>${imgTag}</a></div>`
      : `<div class="${imageWrapClass}"${productContentHiddenAttr(hideImage)} data-pb-no-inline-text>${imgTag}</div>`
  }

  const badgeHtml = badge
    ? `<div class="${design.badge}"><p>${badge}</p></div>`
    : sectionHasBadge
      ? `<div class="${design.badge} min-h-6"></div>`
      : ''

  const titleHtml = title
    ? `<div class="${design.title}">${url ? `<p><a${linkHref}${linkDataHref}${linkAttrs}>${title}</a></p>` : `<p>${title}</p>`}</div>`
    : ''

  const descriptionHtml = description
    ? `<div class="${design.description}"><p>${description}</p></div>`
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
        compareAtPrice ? `<div class="${design.compare}"><p>${compareAtPrice}</p></div>` : '',
        price ? `<div class="${design.price}"><p>${price}</p></div>` : '',
      ].filter(Boolean)
      const priceRowClass = [
        'product-card-price-row flex flex-wrap items-baseline gap-2 pt-2',
        hidePrice ? PRODUCT_CONTENT_HIDDEN_CLASS : '',
      ]
        .filter(Boolean)
        .join(' ')
      priceRowHtml = `<div class="${priceRowClass}"${productContentHiddenAttr(hidePrice)}>${priceParts.join('')}</div>`
    }

    const ctaAnchorClass = buildProductCtaAnchorClass(buttonStyle, roundedButtons)
    const ctaHtml =
      url && buttonText
        ? `<div class="product-card-cta text-sm font-semibold text-myPrimaryLinkColor pt-3${hideButton ? ` ${PRODUCT_CONTENT_HIDDEN_CLASS}` : ''}"${productContentHiddenAttr(hideButton)}><p><a class="${ctaAnchorClass}"${linkHref}${linkDataHref}${linkAttrs}>${buttonText}</a></p></div>`
        : ''

    footerHtml = `<div class="product-card-footer mt-auto flex flex-col">${priceRowHtml}${ctaHtml}</div>`
  }

  return [
    `<div class="${productCardClass}" data-pbx-product-id="${escapeHtml(id)}">`,
    imageHtml,
    `<div class="${design.body}">`,
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
  layout: ProductGridLayout = 'grid-4',
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
  const cardDesign = normalizeCardDesign(styleOptions.cardDesign ?? 'classic')
  const roundedImages = styleOptions.roundedImages ?? false
  const openInNewTab = styleOptions.openInNewTab ?? false
  const buttonStyle = styleOptions.buttonStyle ?? 'text'
  const roundedButtons = styleOptions.roundedButtons ?? false
  const hidePrice = styleOptions.hidePrice ?? false
  const hideImage = styleOptions.hideImage ?? false
  const hideButton = styleOptions.hideButton ?? false
  const hideLinks = styleOptions.hideLinks ?? false

  const sectionHasBadge = products.some((p) => Boolean(p.badge))
  const cards = products
    .map((product) => renderProductCard(product, styleOptions, sectionHasBadge))
    .join('\n')
  const gridClass = buildProductGridClass(layout, mobileColumns)

  return `<section data-component-title="${escapeHtml(sectionTitle)}" data-pbx-product-section="true" data-pbx-product-ids="${escapeHtml(productIds)}" data-pbx-product-layout="${escapeHtml(String(layout))}" data-pbx-product-mobile-cols="${mobileColumns}" data-pbx-product-card-style="${escapeHtml(cardStyle)}" data-pbx-product-card-design="${escapeHtml(cardDesign)}" data-pbx-product-rounded-images="${roundedImages ? 'true' : 'false'}" data-pbx-product-open-in-new-tab="${openInNewTab ? 'true' : 'false'}" data-pbx-product-button-style="${escapeHtml(buttonStyle)}" data-pbx-product-rounded-buttons="${roundedButtons ? 'true' : 'false'}" data-pbx-product-hide-price="${hidePrice ? 'true' : 'false'}" data-pbx-product-hide-image="${hideImage ? 'true' : 'false'}" data-pbx-product-hide-button="${hideButton ? 'true' : 'false'}" data-pbx-product-hide-links="${hideLinks ? 'true' : 'false'}">
<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="${gridClass}" data-pbx-product-grid="true">
${cards}
</div></div></div>
</section>`
}
