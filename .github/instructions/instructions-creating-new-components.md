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

## Placeholder Images

Import and call `getPlaceholderImageDataUrl()` (already defined at the top of `component.ts`) for every image src. This produces an embedded SVG data URL so thumbnails render without any network requests.

```ts
html_code: `<section>
  ...
  <img
    class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square"
    src="${getPlaceholderImageDataUrl()}"
    alt="description"
  />
  ...
</section>`
```

Common image aspect ratio classes:
| Class | Ratio | Use for |
|---|---|---|
| `pbx-aspect-square` | 1:1 | Profile photos, product cards |
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
