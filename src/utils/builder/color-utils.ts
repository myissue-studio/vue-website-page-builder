export type RgbColor = { r: number; g: number; b: number }
export type HsvColor = { h: number; s: number; v: number }

export function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim()
  const match = /^#?([0-9a-fA-F]{6})$/.exec(trimmed)
  if (!match) return null
  return `#${match[1].toLowerCase()}`
}

export function normalizeCssColorToHex(value: string): string | null {
  const normalizedHex = normalizeHexColor(value)
  if (normalizedHex) return normalizedHex

  const rgbMatch =
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i.exec(
      value.trim(),
    )
  if (!rgbMatch) return null

  const channels = rgbMatch.slice(1, 4).map((channel) => Number.parseInt(channel, 10))
  if (channels.some((channel) => Number.isNaN(channel) || channel < 0 || channel > 255)) {
    return null
  }

  return rgbToHex({ r: channels[0], g: channels[1], b: channels[2] })
}

export function hexToRgb(hex: string): RgbColor | null {
  const normalized = normalizeHexColor(hex)
  if (!normalized) return null

  const value = normalized.slice(1)
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  }
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  const toHex = (channel: number) => channel.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function rgbToHsv({ r, g, b }: RgbColor): HsvColor {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6
    } else if (max === gn) {
      h = (bn - rn) / delta + 2
    } else {
      h = (rn - gn) / delta + 4
    }
    h *= 60
    if (h < 0) h += 360
  }

  const s = max === 0 ? 0 : delta / max
  const v = max

  return { h, s: s * 100, v: v * 100 }
}

export function hsvToRgb({ h, s, v }: HsvColor): RgbColor {
  const sn = s / 100
  const vn = v / 100
  const c = vn * sn
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = vn - c

  let rn = 0
  let gn = 0
  let bn = 0

  if (h < 60) {
    rn = c
    gn = x
  } else if (h < 120) {
    rn = x
    gn = c
  } else if (h < 180) {
    gn = c
    bn = x
  } else if (h < 240) {
    gn = x
    bn = c
  } else if (h < 300) {
    rn = x
    bn = c
  } else {
    rn = c
    bn = x
  }

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
  }
}

export function hexToHsv(hex: string): HsvColor {
  const rgb = hexToRgb(hex)
  if (!rgb) return { h: 0, s: 100, v: 100 }
  return rgbToHsv(rgb)
}

export function hsvToHex(hsv: HsvColor): string {
  return rgbToHex(hsvToRgb(hsv))
}
