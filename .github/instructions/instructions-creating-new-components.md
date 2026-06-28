# How to Create New Page Builder Components

All components live in a single file:

```
src/utils/html-elements/component.ts
```

---

## Component Object Shape

Each component is an object with four required fields:

```ts
{
  title: string        // Shown in the UI component picker
  html_code: string    // The full HTML of the component (template literal)
  cover_image: null    // Always null — thumbnails are generated automatically
  category: string     // Groups the component in the UI (see categories below)
}
```

---

## Mandatory HTML Skeleton

Every component **must** follow this exact outer structure:

```html
<section>
  <div class="md:pbx-pt-8 md:pbx-pb-8 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2">
    <div class="pbx-mx-auto pbx-max-w-7xl">

      <!-- your layout goes here -->

    </div>
  </div>
</section>
```

- Start with `<section>`, end with `</section>` — no exceptions.
- The outer padding div controls vertical rhythm and horizontal padding on small screens.
- The `pbx-max-w-7xl` div centres content and limits the max width.

---

## CSS Class Rules

- **Always use the `pbx-` prefix** for every Tailwind utility class:
  `pbx-flex`, `pbx-grid`, `pbx-text-2xl`, `pbx-font-medium`, etc.
- **No inline styles** — use class-based utilities only.
- Responsive variants also carry the prefix: `sm:pbx-grid-cols-2`, `lg:pbx-text-4xl`, `md:pbx-pt-8`.

```html
<!-- correct -->
<div class="pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 pbx-myPrimaryGap">

<!-- wrong — missing prefix -->
<div class="grid grid-cols-2 gap-8">

<!-- wrong — inline style -->
<div style="display:grid;grid-template-columns:1fr 1fr">
```

---

## Text Styling — Classes on the Wrapper, Never on Inline Elements

**All text-related classes (`pbx-text-*`, `pbx-font-*`, `pbx-italic`, `pbx-tracking-*`, colour, etc.) must go on the parent `<div>`, not on `<p>`, `<h2>`, `<span>`, or any other inline element.**

TipTap strips class attributes from `<p>`, `<span>`, and heading tags when a user edits and saves. If you put styles on those elements they will silently disappear.

```html
<!-- CORRECT — style on the wrapper div -->
<div class="pbx-text-2xl pbx-font-medium pbx-text-gray-900">
  <p>Some text here</p>
</div>

<!-- WRONG — TipTap will strip the class on save -->
<p class="pbx-text-2xl pbx-font-medium">Some text here</p>

<!-- WRONG — TipTap will strip the span on save -->
<p>$9 <span class="pbx-text-sm pbx-text-gray-500">/ mo</span></p>
```

**When you need two different text styles side by side** (e.g. a large price and a smaller "/mo" label), use two separate `<div>` wrappers, each with their own classes:

```html
<!-- CORRECT -->
<div class="pbx-flex pbx-items-baseline pbx-gap-1">
  <div class="pbx-text-4xl pbx-font-bold"><p>$29</p></div>
  <div class="pbx-text-base pbx-text-gray-500"><p>/ mo</p></div>
</div>

<!-- WRONG — span classes are stripped on save -->
<div class="pbx-text-4xl pbx-font-bold">
  <p>$29 <span class="pbx-text-base pbx-text-gray-500">/ mo</span></p>
</div>
```

---

## Placeholder Images

Import and call `getPlaceholderImageDataUrl()` (already defined at the top of `component.ts`) for every image src. This produces an embedded SVG data URL so thumbnails render without any network requests.

**Always include both an aspect-ratio class and `pbx-object-cover`.** This is critical: when a user replaces a placeholder with a real image (e.g. from Unsplash), TipTap preserves the `class` attribute. Without a fixed aspect ratio the image will take its natural dimensions, so each image in a grid can end up with a different height and break the layout.

```html
<!-- CORRECT — aspect ratio enforced, image always fills the box consistently -->
<img
  class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square"
  src="${getPlaceholderImageDataUrl()}"
  alt="description"
/>

<!-- WRONG — no aspect ratio, height depends on the image the user picks -->
<img
  class="pbx-object-cover pbx-w-full"
  src="${getPlaceholderImageDataUrl()}"
  alt="description"
/>
```

Common image aspect ratio classes:
| Class | Ratio | Use for |
|---|---|---|
| `pbx-aspect-square` | 1:1 | Profile photos, product cards, team members, logos |
| `aspect-[9/16]` | 9:16 | Portrait / vertical images |
| `aspect-[16/9]` | 16:9 | Landscape / banner images |
| `aspect-[4/3]` | 4:3 | Standard photos |

---

## Placeholder Text

Use these fixed strings so users immediately know what to edit:

- Long body: `"Start customizing by editing this default text directly in the editor."`
- Short label / heading: `"Layouts and visual."`

---

## Headings and Semantic Structure

- Use `<h2>` as the primary heading inside a section (one per component).
- Use `<h3>` for sub-headings within the same component.
- Do not use `<h1>` — that belongs to the page title, not a component.

```html
<div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium">
  <h2>Start customizing by editing this default text directly in the editor.</h2>
</div>
```

---

## Links

Always include `target`, `rel`, and a placeholder `href`:

```html
<a
  target="_blank"
  rel="noopener noreferrer nofollow"
  href="https://www.google.com"
>Link text here</a>
```

---

## Common Layout Patterns

### Single column (stacked)

```html
<div class="pbx-mx-auto pbx-max-w-7xl">
  <!-- content -->
</div>
```

### Two-column side by side (image + text) — supports Reverse Layout feature

```html
<div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-2">
  <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square"
       src="${getPlaceholderImageDataUrl()}" alt="description" />
  <div class="pbx-py-12">
    <!-- text content -->
  </div>
</div>
```

> **Tip:** Any component whose top-level layout div uses `pbx-grid-cols-2` or `pbx-flex-row` with exactly two children will automatically show the **Reverse Layout** button in the editor.

### Three columns

```html
<div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 lg:pbx-grid-cols-3">
  <!-- 3 children -->
</div>
```

### Four columns

```html
<div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-2 sm:pbx-grid-cols-2 lg:pbx-grid-cols-4">
  <!-- 4 children -->
</div>
```

---

## Existing Categories

Match one of these exactly (case-sensitive) so the component appears in the right tab:

| Category | Description |
|---|---|
| `Images` | Components that are primarily images |
| `Images & Text` | Image grids combined with descriptive text |
| `Hero` | Full-page-width hero sections with headline and CTA |
| `Features` | Feature/benefit cards or grids |
| `Call To Action` | Headline + body + link / button |
| `Marketing` | Stats, timelines, how-it-works steps, logo bars, quotes |
| `Pricing` | Pricing tier cards |
| `Team` | Team member photo grids |
| `FAQ` | Question and answer lists |
| `Products` | Product cards or grids |
| `Cards` | Card layouts (info, testimonial, etc.) |
| `Sliders` | Image or card sliders |
| `Contact` | Contact info blocks (email, phone, address) |

To add a new category, just use a new string — it will appear automatically in the UI.

---

## Full Example — "Right Image CTA"

```ts
{
  title: 'Right Image CTA',
  html_code: `<section>
    <div class="md:pbx-pt-8 md:pbx-pb-8 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2">
      <div class="pbx-mx-auto pbx-max-w-7xl">
        <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-2">
          <div class="pbx-py-12">
            <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium">
              <h2>Start customizing by editing this default text directly in the editor.</h2>
            </div>
            <div class="pbx-pt-12 pbx-pb-4">
              <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p>
            </div>
            <div class="pbx-font-semibold pbx-py-4">
              <p>
                <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">
                  Layouts and visual.
                </a>
              </p>
            </div>
          </div>
          <img
            class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square"
            src="${getPlaceholderImageDataUrl()}"
            alt="provider"
          />
        </div>
      </div>
    </div>
  </section>`,
  cover_image: null,
  category: 'Call To Action',
},
```

---

## Checklist Before Adding a Component

- [ ] Starts with `<section>` and ends with `</section>`
- [ ] Outer padding div and `pbx-max-w-7xl` container are present
- [ ] All Tailwind classes use the `pbx-` prefix
- [ ] No inline `style="..."` attributes
- [ ] Placeholder images use `getPlaceholderImageDataUrl()`
- [ ] Placeholder text uses the standard strings
- [ ] Links include `target="_blank" rel="noopener noreferrer nofollow"`
- [ ] Primary heading uses `<h2>`, not `<h1>`
- [ ] `cover_image` is set to `null`
- [ ] `category` matches an existing category or a clearly named new one
- [ ] `title` is unique and descriptive
