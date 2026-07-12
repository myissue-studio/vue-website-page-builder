# Creating Page Builder HTML Elements (Components, Helpers, Themes)

This guide is for AI models and contributors adding reusable HTML to the Vue Website Page Builder.

There are **three** HTML libraries. Know which one you are editing before writing anything.

| Kind | File | Purpose |
|---|---|---|
| **Components** | `src/utils/html-elements/component.ts` | Full page sections (hero, pricing, portfolio, …) shown in the component library |
| **Helpers** | `src/utils/html-elements/componentHelpers.ts` | Small building blocks (text, headings, buttons, spacers, columns) |
| **Themes** | `src/utils/html-elements/themes.ts` | Multi-section starter pages (composed of several `<section>` blocks) |

Shared validation lives in:

- `src/utils/builder/non-listener-tags.ts`
- `src/utils/builder/html-component-validation.ts`
- Tests: `src/tests/utils/html-elements-structure.test.ts`

Always run:

```bash
npm test -- --run src/tests/utils/html-elements-structure.test.ts
```

---

## Universal Rules (all three files)

### 1. Section wrappers

- Every **component** and **helper** must be a single paired `<section>…</section>`.
- **Themes** are one or more top-level sections (often wrapped in `#pagebuilder`). Nested `<section>` inside `<section>` is forbidden.
- Uneven open/close `<section>` tags will fail validation.

### 2. `pbx-` Tailwind prefix

- Prefer `pbx-` on every utility: `pbx-flex`, `pbx-grid`, `lg:pbx-text-4xl`.
- Older entries may still use unprefixed classes (they get prefixed at insert time). **New HTML should always use `pbx-`.**
- No inline `style="…"` attributes.

### 3. Classes on wrappers — never on non-listener tags

Non-editable / non-listener tags must **not** carry classes. Put classes on a parent `<div>` (or other editable wrapper) instead.

**Never put classes on:**  
`p`, `h1`–`h6`, `a`, `span`, `ul`, `ol`, `li`, `em`, `strong`, `b`, `blockquote`, `br`, `pre`, `code`, `mark`, `del`, `ins`, `u`, `figure`, `figcaption`  
(and do not put classes on `iframe` content wrappers in a way that breaks selection — keep iframe markup as in existing YouTube helper).

```html
<!-- CORRECT -->
<div class="pbx-text-2xl pbx-font-bold pbx-text-gray-900">
  <p>Layouts and visual.</p>
</div>

<!-- WRONG — fails CI + console.error at startBuilder / insert / mount -->
<p class="pbx-text-2xl pbx-font-bold">Layouts and visual.</p>
```

Why: TipTap and the builder treat those tags as non-selectable text nodes. Classes on them are stripped or rejected by `findNonListenerTagClassViolations`.

**Exception — button-like anchors:** see **Buttons** below. Classes on `<a>` are allowed only for CTA buttons (`#linktree` / button-like classes).

### 4. No icons in HTML

Do **not** put emoji, symbol glyphs, or icon fonts inside component/helper/theme HTML:

- No `▶` `✓` `→` `★` etc.
- No Material Symbols / SVG icons inside `html_code`.

Helpers may still use Material Symbols only in the separate `icon` field (picker UI), never inside `html_code`.

Use text, numbers (`01`), or plain colored `<div>` dots/bars for visual accents.

### 5. Placeholder copy

Use these exact strings so translation/replace hooks and demos stay consistent:

- Body: `Start customizing by editing this default text directly in the editor.`
- Short label / CTA / heading: `Layouts and visual.`

### 6. Links (plain text links)

Plain text links are just an `<a>` — no `#linktree`, no button chrome:

```html
<div class="pbx-font-semibold">
  <p>
    <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">
      Layouts and visual.
    </a>
  </p>
</div>
```

Do **not** put classes on a plain text `<a>` (it is a non-listener tag). Put typography classes on the wrapper `<div>`.

### 7. Buttons (always an `<a>`, never `<button>`)

There is **no HTML `<button>`** in this builder. A “button” is a styled **anchor** (`<a>`) so it navigates like a normal link.

#### Required structure

```html
<div id="linktree"> … <p> … <a …> … </a> … </p> … </div>
```

Enforced by `html-elements-structure.test.ts` for every helper that uses `id="linktree"`.

| Piece | Role |
|---|---|
| `<div id="linktree">` | Marks the control as a builder button (selection / styling hooks) |
| `<p>` | Required TipTap / editor wrapper around the link |
| `<a href="…">` | The actual clickable control |

Always include:

```html
target="_blank" rel="noopener noreferrer nofollow"
```

Special `href` values:

- Email: `mailto:hello@example.com`
- Phone: `tel:+15550000000`

#### Preferred pattern (style the `<a>` — same as product CTAs)

Put **button chrome** (`pbx-bg-…`, `pbx-px-…`, `pbx-py-…`, `pbx-rounded-…`) on the **`<a>`**, not on `#linktree`.

Why: the editor selects `#linktree` / `.pbx-product-card-cta`. Padding on that wrapper becomes **outer spacing**. Padding on the `<a>` grows the visible pill — matching product “Button design” CTAs.

```html
<div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree">
  <p>
    <a
      target="_blank"
      rel="noopener noreferrer nofollow"
      href="https://www.google.com"
      class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full"
    >
      Link to landing page
    </a>
  </p>
</div>
```

Product cards use the same idea (`pbx-product-card-cta` wrapper + styled `pbx-product-card-cta-link` on `<a>`).

Outline variant — border/text on the `<a>`:

```html
<div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree">
  <p>
    <a
      target="_blank"
      rel="noopener noreferrer nofollow"
      href="https://www.google.com"
      class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-border pbx-border-myPrimaryLinkColor pbx-text-myPrimaryLinkColor pbx-rounded-full"
    >
      Link to landing page
    </a>
  </p>
</div>
```

Alignment is done by a **parent** flex container (`pbx-justify-start` / `center` / `end`), not by putting layout chrome on `#linktree`.

Classes on `<a>` are allowed for button-like anchors (`isButtonLikeAnchor` in `non-listener-tags.ts`) when inside `#linktree` / `.pbx-product-card-cta`, or with `pbx-inline-flex` / `pbx-bg-…` / `pbx-rounded…` / `pbx-product-card-cta-link`.

#### In components and themes

Same rule: `#linktree` → `<p>` → `<a class="…chrome…">`. Wrapper stays a thin shell.

```html
<div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree">
  <p>
    <a
      target="_blank"
      rel="noopener noreferrer nofollow"
      href="https://www.google.com"
      class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-8 pbx-py-3 pbx-bg-gray-900 pbx-text-white pbx-rounded-full"
    >
      Layouts and visual.
    </a>
  </p>
</div>
```

Plain text CTAs (`pbx-font-semibold` only, no button chrome) stay as text links — **no** `#linktree`.

#### Wrong

```html
<!-- Never use <button> -->
<button type="button">Click me</button>

<!-- Chrome on #linktree (padding then pads the colored parent) -->
<div class="pbx-bg-gray-900 pbx-px-8 pbx-py-3 pbx-rounded-full" id="linktree">
  <p><a href="https://www.google.com">Layouts and visual.</a></p>
</div>

<!-- Missing #linktree / <p> wrapper -->
<a class="pbx-bg-myPrimaryLinkColor pbx-px-4" href="https://www.google.com">Click</a>

<!-- Classes on a plain (non-button) <a> -->
<a class="pbx-font-semibold" href="https://www.google.com">Layouts and visual.</a>
```

### 8. What not to build

- **No contact forms** (no mail server / submit API in the page builder). Use Contact Banner, Address Block, Email Button, Phone Button instead.
- **No fake interactive widgets** that imply backend behavior (newsletter inputs that do nothing, form fields, etc.). A CTA **link** is fine.
- Keep layouts simple and powerful — avoid decorative complexity.

---

## Components (`component.ts`)

### Shape

```ts
{
  title: string        // Unique, shown in the picker
  html_code: string    // Full section HTML (template literal)
  cover_image: null    // Always null — thumbnails are generated
  category: string     // Groups in the UI
}
```

`getPlaceholderImageDataUrl()` is defined at the top of the file — use it for every `<img src>`.

### Recommended skeleton

```html
<section>
  <div class="pbx-py-8 pbx-px-4">
    <div class="pbx-mx-auto pbx-max-w-7xl">
      <!-- layout -->
    </div>
  </div>
</section>
```

Narrower content (articles, quotes) may use `pbx-max-w-3xl` / `pbx-max-w-4xl` / `pbx-max-w-5xl`.

### Images (components & themes only)

Rules:

1. `src="${getPlaceholderImageDataUrl()}"`
2. Always `pbx-object-cover` + `pbx-w-full` (unless fixed avatar size)
3. Always an aspect-ratio class
4. **Only `pbx-object-center`** — never `pbx-object-top`, `object-top`, `object-down`, or `object-bottom`
5. Meaningful `alt`

```html
<img
  class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-3xl"
  src="${getPlaceholderImageDataUrl()}"
  alt="description"
/>
```

| Class | Use |
|---|---|
| `pbx-aspect-square` | Products, team, logos |
| `pbx-aspect-[9/16]` or `pbx-aspect-[3/4]` | Portrait |
| `pbx-aspect-video` / `pbx-aspect-[16/9]` | Landscape / video poster |
| `pbx-aspect-[4/3]` | Standard photo |
| `pbx-aspect-[21/9]` | Wide banner |

Avatars:

```html
<img
  class="pbx-object-cover pbx-w-12 pbx-h-12 pbx-min-w-12 pbx-object-center pbx-rounded-full"
  src="${getPlaceholderImageDataUrl()}"
  alt="author"
/>
```

### Headings in components

- Prefer one `<h2>` as the section title (classes on the wrapping `<div>`).
- Use `<h3>` for card/sub titles.
- Avoid `<h1>` in full page components (page-level title). Helpers may include Header H1 for building blocks.

### Component categories (examples)

Reuse an existing category when possible. New strings are allowed and appear in the UI automatically.

| Category | Examples |
|---|---|
| `Images` | Grids, mosaics, galleries |
| `Images & Text` | Split image + copy |
| `Hero` | Hero Minimal, Hero Centered |
| `Features` | Feature grids, process steps, checklists |
| `Call To Action` | CTAs, dual CTA cards, resource CTA |
| `Marketing` | Stats, logos, press, events, case study |
| `Pricing` | One / two / three tier pricing |
| `Team` | Team grids, spotlight |
| `Products` | Product grids / highlight |
| `Cards` | Testimonials, blog cards, category cards |
| `Contact` | Contact banner/minimal (not forms) |
| `Portfolio` | Portfolio grids |
| `Content` | Wide article, long-form blocks |
| `FAQ` | FAQ sections |
| `About` | About split |
| `Careers` | Job listings |
| `Footer` | Footer simple |
| `Media` | Video placeholder (image only) |
| `Sliders` | Carousel-style layouts |

### Layout patterns

**Two columns (supports Reverse Layout when exactly two children):**

```html
<div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-items-center">
  <!-- child A -->
  <!-- child B -->
</div>
```

**Three / four columns:**

```html
<div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 lg:pbx-grid-cols-3">
  <!-- 3 children -->
</div>
```

---

## Helpers (`componentHelpers.ts`)

Helpers are **small, HTML-only** primitives. Comment in file: do **not** use images or placeholder images.

### Shape

```ts
{
  html_code: string
  id: null
  title: string
  category: string   // Text | Buttons | Layout | Media
  icon: string       // Material Symbols markup for the picker ONLY
}
```

### Rules specific to helpers

- Single `<section>` per helper.
- No `<img>`, no `getPlaceholderImageDataUrl()`.
- **Buttons:** follow the **Buttons** section above — always `#linktree` → `<p>` → `<a class="…chrome…">` (never `<button>`). Put padding / bg / radius on the `<a>`, same as product CTAs.
- YouTube helper keeps an empty `iframe` `src=""` for the editor to fill.
- Spacers / dividers are layout-only (no fake content).

### Helper categories

| Category | Examples |
|---|---|
| `Text` | Text, H1–H6, lists, quote, lead, caption, note, callout, FAQ item, address |
| `Buttons` | Positioned buttons, outline/full-width, text links, email/phone |
| `Layout` | Spacers, dividers, 2/3/4 column text |
| `Media` | YouTube Video |

---

## Themes (`themes.ts`)

Themes are **starter pages**: multiple sections composed into one `html_code` string.

### Shape

Same fields as components (`title`, `html_code`, `cover_image: null`, `category`), grouped under `themes.data`.

`themes.ts` defines its own `getPlaceholderImageDataUrl()` at the top of the file — use that (do not import from `component.ts`).

### Rules specific to themes

- Compose from existing component/helper patterns.
- Prefer multiple sibling `<section data-component-title="…">…</section>` blocks (`data-component-title` should match the source component/helper title when reusing one).
- May wrap everything in `<div id="pagebuilder" …>…</div>`.
- Images: same rules as **new** components (`getPlaceholderImageDataUrl()`, `pbx-object-center`, aspect ratio). Do not introduce `pbx-object-top` / `object-top` in new theme HTML.
- No nested sections.
- Keep non-listener class rules for every section inside the theme (classes on wrappers, not on `p` / headings).
- No contact forms; email/phone CTA links are fine.

### Theme categories (examples)

| Category | Examples |
|---|---|
| `Article` | Basic Article, Blog Post, Job Post |
| `Landing` | Landing Page, SaaS Launch |
| `Marketing` | Stats Simple |
| `Corporate` | Corporate Page |

---

## Validation & runtime feedback

| Check | Where |
|---|---|
| Section pairing / nesting / JSON mistaken for HTML | `validateMountingHtmlStructure` |
| Classes on non-listener tags | `findNonListenerTagClassViolations` / `reportNonListenerTagClassViolations` |
| Host-passed components soft warnings | `startBuilder` → `result.htmlWarnings` |
| Library CI | `src/tests/utils/html-elements-structure.test.ts` |

Broken reusable HTML logs:

```text
[PageBuilder] A non-editable <p> tag was inserted with classes: "…". Move these classes to an editable wrapper element instead.
```

Fix by moving classes to a wrapper `<div>`.

---

## Full component example

```ts
{
  title: 'Split Image Right',
  html_code: `<section>
    <div class="pbx-py-8 pbx-px-4">
      <div class="pbx-mx-auto pbx-max-w-7xl">
        <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-items-center">
          <div>
            <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-6">
              <h2>Layouts and visual.</h2>
            </div>
            <div class="pbx-text-gray-600 pbx-text-lg pbx-leading-relaxed pbx-mb-8">
              <p>Start customizing by editing this default text directly in the editor.</p>
            </div>
            <div class="pbx-font-semibold">
              <p>
                <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">
                  Layouts and visual.
                </a>
              </p>
            </div>
          </div>
          <img
            class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-3xl"
            src="${getPlaceholderImageDataUrl()}"
            alt="feature"
          />
        </div>
      </div>
    </div>
  </section>`,
  cover_image: null,
  category: 'Images & Text',
},
```

---

## Full helper example

```ts
{
  html_code: `<section>
    <div class="pbx-pt-4 pbx-pb-8 pbx-px-4">
      <div class="pbx-mx-auto pbx-max-w-7xl">
        <div class="pbx-text-xl lg:pbx-text-2xl pbx-leading-relaxed">
          <p>Start customizing by editing this default text directly in the editor.</p>
        </div>
      </div>
    </div>
  </section>`,
  id: null,
  title: 'Lead Text',
  category: 'Text',
  icon: `
    <span class="material-symbols-outlined">
    subject
    </span>
  `,
},
```

---

## Checklist

### All kinds

- [ ] Valid paired `<section>` tags (themes: no nesting)
- [ ] Classes only on editable wrappers — not on `p` / headings / `a` / `span` / list tags
- [ ] Prefer `pbx-` utilities; no inline styles
- [ ] No emoji / icon glyphs in `html_code`
- [ ] Standard placeholder copy strings
- [ ] Links have `target` + `rel` (or `mailto:` / `tel:` when appropriate)
- [ ] Unique descriptive `title`
- [ ] Structure tests pass

### Components / themes with images

- [ ] `getPlaceholderImageDataUrl()` for every image
- [ ] `pbx-object-cover` + aspect ratio + **`pbx-object-center` only**
- [ ] `cover_image: null`

### Helpers

- [ ] No images
- [ ] `#linktree` buttons keep `<div id="linktree"><p><a` structure
- [ ] `icon` is Material Symbols for the picker only
- [ ] `id: null`
