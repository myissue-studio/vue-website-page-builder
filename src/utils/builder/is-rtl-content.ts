const RTL_LANGS = new Set([
  'ar',
  'arc',
  'ckb',
  'dv',
  'fa',
  'he',
  'khw',
  'ks',
  'ku',
  'ps',
  'sd',
  'ug',
  'ur',
  'yi',
])

const RTL_SCRIPT_PATTERN = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/

export function isRtlLang(lang: string | null | undefined): boolean {
  if (!lang) return false
  return RTL_LANGS.has(lang.split('-')[0]?.toLowerCase() ?? '')
}

export function isPrimarilyRtlScript(text: string): boolean {
  const letters = text.replace(/\s+/g, '')
  if (!letters) return false

  let rtlCount = 0
  for (const char of letters) {
    if (RTL_SCRIPT_PATTERN.test(char)) rtlCount++
  }

  return rtlCount / letters.length >= 0.3
}

export function isRtlElement(element: HTMLElement): boolean {
  let current: HTMLElement | null = element

  while (current && !current.matches('#pagebuilder')) {
    const dir = current.getAttribute('dir')?.toLowerCase()
    if (dir === 'rtl') return true
    if (dir === 'ltr') return false
    current = current.parentElement
  }

  const pagebuilder = element.closest('#pagebuilder')
  if (pagebuilder instanceof HTMLElement) {
    const rootDir = pagebuilder.getAttribute('dir')?.toLowerCase()
    if (rootDir === 'rtl') return true
    if (rootDir === 'ltr') return false
  }

  if (typeof window !== 'undefined') {
    const direction = window.getComputedStyle(element).direction
    if (direction === 'rtl') return true
    if (direction === 'ltr') return false
  }

  return false
}

export function isRtlContentContext(
  element: HTMLElement,
  options?: { lang?: string | null; text?: string | null },
): boolean {
  if (isRtlElement(element)) return true
  if (isRtlLang(options?.lang)) return true

  const langHost = element.closest('[lang]')
  if (langHost instanceof HTMLElement && isRtlLang(langHost.lang)) return true

  const text = options?.text ?? element.textContent ?? ''
  return isPrimarilyRtlScript(text)
}
