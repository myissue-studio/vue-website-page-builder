import type { StyleValue } from 'vue'

/** Diagonal slash — modern “no fill” swatch indicator. */
export const transparentSwatchStyle: StyleValue = {
  backgroundColor: '#f8fafc',
  backgroundImage:
    'linear-gradient(135deg, transparent 46%, #cbd5e1 46%, #cbd5e1 54%, transparent 54%)',
}
