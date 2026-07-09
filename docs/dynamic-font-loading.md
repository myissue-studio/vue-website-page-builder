# Dynamic Font Loading

## Overview

The Page Builder now uses **dynamic font loading** to keep the npm package small while supporting a wide range of Google Fonts. Fonts are loaded on-demand when users select them, rather than pre-loading all fonts in the CSS bundle.

## How It Works

### 1. Automatic Loading

When a user selects a font in the Page Builder (via Typography controls or Page Design panel), the system automatically:

1. Checks if the font is a Google Font
2. Loads it dynamically via a `<link>` element if not already loaded
3. Caches the font to avoid duplicate requests
4. Applies the font class to the selected element

### 2. Pre-Loaded Fonts

Only essential fonts are pre-loaded in `style.css`:

- **Jost** (default canvas font)
- **Material Symbols Outlined** (UI icons)

### 3. Supported Google Fonts

The following Google Fonts are configured for dynamic loading:

- Inter
- Roboto
- Open Sans
- Lato
- Montserrat
- Poppins
- Nunito
- Merriweather
- Playfair Display
- Source Sans 3
- Noto Sans
- Work Sans
- Quicksand
- PT Serif
- Crimson Text
- Raleway
- Jost

### 4. System Fonts

These fonts work immediately without loading (OS built-in):

- Arial
- Helvetica
- Georgia
- Times / Times New Roman
- Courier / Courier New
- Verdana
- Tahoma
- Trebuchet
- Comic Sans
- Impact
- And many more...

## For Package Users

### Using Custom Fonts

If you want to use a custom font (not in the Google Fonts list above), you have two options:

#### Option 1: Load in Your App CSS

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Custom+Font:wght@300;400;700&display=swap');
```

#### Option 2: Self-Host the Font

```css
@font-face {
  font-family: 'Your Custom Font';
  src: url('/fonts/YourCustomFont.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}
```

Then configure it in your Page Builder config:

```typescript
const config: PageBuilderConfig = {
  userSettings: {
    fontFamily: 'Your Custom Font, sans-serif',
  },
  // ...
}
```

### Adding More Google Fonts

To add more Google Fonts to the dynamic loader:

1. Find the font on [Google Fonts](https://fonts.google.com/)
2. Get the font URL parameters (e.g., `Roboto:ital,wght@0,400;0,700;1,400`)
3. Add it to `GOOGLE_FONTS_MAP` in `src/utils/builder/dynamic-font-loader.ts`
4. Add the font to Tailwind config in `tailwind.config.ts`
5. Add the font class to `tailwind-font-styles.ts`

Example:

```typescript
// In dynamic-font-loader.ts
const GOOGLE_FONTS_MAP: Record<string, string> = {
  // ... existing fonts
  'dm-sans': 'DM+Sans:ital,opsz,wght@0,9..40,100;0,9..40,400;0,9..40,700;1,9..40,400',
}

// In tailwind.config.ts
fontFamily: {
  // ... existing fonts
  'dm-sans': ['DM Sans', 'sans-serif'],
}

// In tailwind-font-styles.ts
fontFamily: [
  // ... existing classes
  'pbx-font-dm-sans',
]
```

## Technical Details

### Font Loading Process

1. **User selects font** → Typography control or Page Design panel
2. **Extract font key** → `pbx-font-raleway` → `raleway`
3. **Check if Google Font** → Look up in `GOOGLE_FONTS_MAP`
4. **Check if already loaded** → Avoid duplicate requests
5. **Create <link> element** → Add to document head
6. **Wait for load** → Promise resolves when font is ready
7. **Apply font class** → Element gets the font styling

### Performance Optimizations

- **Caching**: Fonts are loaded once and cached for the session
- **Deduplication**: Multiple simultaneous requests for the same font are merged
- **Non-blocking**: Font loading doesn't block UI interactions
- **Fallback fonts**: CSS fallbacks ensure text is always readable

### Browser Support

Dynamic font loading works in all modern browsers:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### Font Not Loading

If a font doesn't load:

1. **Check browser console** for font loading errors
2. **Verify font name** matches exactly (case-sensitive)
3. **Check network tab** to see if the font request succeeded
4. **Try a different font** to isolate the issue

### Font Loads But Doesn't Apply

This usually means the font class wasn't properly added to Tailwind config:

1. Check `tailwind.config.ts` has the font in `fontFamily` section
2. Verify `tailwind-font-styles.ts` includes the `pbx-font-*` class
3. Rebuild the project to regenerate Tailwind classes

### Package Size Concerns

The dynamic loader adds ~2KB to the package, which is minimal compared to pre-loading all fonts (~50-100KB per font).

## Migration from Pre-Loaded Fonts

If you were using the old system with pre-loaded fonts in `style.css`:

**Before:**

```css
/* All fonts pre-loaded */
@import url('https://fonts.googleapis.com/css2?family=Font1&family=Font2&family=Font3...');
```

**After:**

```css
/* Only Jost pre-loaded */
@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200...');
```

The change is automatic - fonts will now load on-demand with no code changes needed.
