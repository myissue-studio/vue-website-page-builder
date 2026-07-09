/**
 * Dynamic Google Fonts Loader
 *
 * Loads web fonts on-demand to avoid bloating the npm package.
 * Only loads fonts when users actually select them in the Page Builder.
 */

// Fonts that need to be loaded from Google Fonts
const GOOGLE_FONTS_MAP: Record<string, string> = {
  jost: 'Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;1,100;1,200;1,300;1,400;1,500',
  raleway: 'Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600',
  inter: 'Inter:wght@100;200;300;400;500;600;700;800;900',
  roboto:
    'Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900',
  'open-sans':
    'Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800',
  lato: 'Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900',
  montserrat:
    'Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
  poppins:
    'Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
  nunito:
    'Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
  merriweather: 'Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900',
  'playfair-display':
    'Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900',
  'source-sans-3':
    'Source+Sans+3:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
  'noto-sans':
    'Noto+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
  'work-sans':
    'Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
  quicksand: 'Quicksand:wght@300;400;500;600;700',
  'pt-serif': 'PT+Serif:ital,wght@0,400;0,700;1,400;1,700',
  'crimson-text': 'Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700',
}

// Track which fonts have already been loaded
const loadedFonts = new Set<string>()

// Track pending font loads to avoid duplicate requests
const pendingFontLoads = new Map<string, Promise<void>>()

/**
 * Loads a Google Font dynamically by creating a <link> element.
 * @param fontKey - The font key (e.g., 'raleway', 'inter')
 * @returns Promise that resolves when the font is loaded
 */
export async function loadGoogleFont(fontKey: string): Promise<void> {
  const normalizedKey = fontKey.toLowerCase().trim()

  // Already loaded
  if (loadedFonts.has(normalizedKey)) {
    return Promise.resolve()
  }

  // Already loading
  if (pendingFontLoads.has(normalizedKey)) {
    return pendingFontLoads.get(normalizedKey)!
  }

  // Check if this is a Google Font
  const googleFontQuery = GOOGLE_FONTS_MAP[normalizedKey]
  if (!googleFontQuery) {
    // Not a Google Font (system font or custom font loaded by user)
    loadedFonts.add(normalizedKey)
    return Promise.resolve()
  }

  // Create load promise
  const loadPromise = new Promise<void>((resolve, reject) => {
    // Check if link already exists (might be pre-loaded in CSS)
    const existingLink = document.querySelector(`link[href*="${googleFontQuery.split(':')[0]}"]`)
    if (existingLink) {
      loadedFonts.add(normalizedKey)
      resolve()
      return
    }

    // Create new link element
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${googleFontQuery}&display=swap`

    link.onload = () => {
      loadedFonts.add(normalizedKey)
      pendingFontLoads.delete(normalizedKey)
      resolve()
    }

    link.onerror = () => {
      console.error('Font load error:', normalizedKey, link.href)
      pendingFontLoads.delete(normalizedKey)
      reject(new Error(`Failed to load font: ${fontKey}`))
    }

    document.head.appendChild(link)
  })

  pendingFontLoads.set(normalizedKey, loadPromise)
  return loadPromise
}

/**
 * Extracts the font key from a Tailwind font class (e.g., 'pbx-font-raleway' -> 'raleway')
 */
export function extractFontKeyFromClass(className: string): string | null {
  if (!className || typeof className !== 'string') return null

  // Handle pbx-font-* classes
  if (className.startsWith('pbx-font-')) {
    return className.replace('pbx-font-', '')
  }

  return null
}

/**
 * Loads a font from a Tailwind class name if needed
 * @param className - The Tailwind font class (e.g., 'pbx-font-raleway')
 */
export async function loadFontFromClass(className: string): Promise<void> {
  const fontKey = extractFontKeyFromClass(className)
  if (!fontKey) return

  // Skip generic font families
  const genericFamilies = ['sans', 'serif', 'mono']
  if (genericFamilies.includes(fontKey)) {
    return
  }

  await loadGoogleFont(fontKey)
}

/**
 * Ensures a font utility class has a concrete CSS rule, even when it was not
 * generated by Tailwind in the current bundle.
 */
export function ensureFontClassExists(className: string): void {
  const fontKey = extractFontKeyFromClass(className)
  if (!fontKey) return

  const styleId = `pbx-dynamic-font-class-${fontKey}`
  if (document.getElementById(styleId)) return

  const googleFontQuery = GOOGLE_FONTS_MAP[fontKey]

  let fontFamilyValue = ''
  if (googleFontQuery) {
    const displayName = googleFontQuery.split(':')[0].replace(/\+/g, ' ')
    fontFamilyValue = `'${displayName}', sans-serif`
  } else if (fontKey === 'sans') {
    fontFamilyValue = 'sans-serif'
  } else if (fontKey === 'serif') {
    fontFamilyValue = 'serif'
  } else if (fontKey === 'mono') {
    fontFamilyValue = 'monospace'
  } else {
    const displayName = fontKey
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    fontFamilyValue = `'${displayName}', sans-serif`
  }

  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `.${className} { font-family: ${fontFamilyValue} !important; }`
  document.head.appendChild(style)
}

/**
 * Checks if a font is a Google Font that can be loaded dynamically
 */
export function isGoogleFont(fontKey: string): boolean {
  return fontKey.toLowerCase() in GOOGLE_FONTS_MAP
}

/**
 * Gets the list of all available Google Fonts
 */
export function getAvailableGoogleFonts(): string[] {
  return Object.keys(GOOGLE_FONTS_MAP)
}
