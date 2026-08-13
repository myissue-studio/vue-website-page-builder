# Roadmap

Status of features for **[@myissue/vue-website-page-builder](https://www.npmjs.com/package/@myissue/vue-website-page-builder)** ([GitHub](https://github.com/myissue-studio/vue-website-page-builder)) — what to improve next so the editor stays simple, UI stays calm, and package consumers hit fewer type / build errors before production.

Focus: **UI · simplicity · tests · TypeScript / package DX · components**

Last updated: August 2026

Legend: `[ ]` planned · `[~]` partial / in progress · `[x]` done (update as you ship)

---

## A. TypeScript & package typing (catch errors before users)

1. [ ] Audit published `dist/index.d.ts` against real consumer `vue-tsc` / `tsc --noEmit` on Vue 3.3, 3.4, and 3.5 sample apps
2. [ ] Add a CI job that installs the packed tarball into a minimal Vue + TS app and fails on any `vue-tsc` error
3. [ ] Add a CI job that installs the packed tarball into a Nuxt 3 app and fails on type-check / build errors
4. [ ] Add a CI job for a Laravel + Inertia + Vue sample that type-checks `app.use(pageBuilder)`
5. [ ] Ensure every public export in `src/index.ts` has a stable, documented type (no accidental `any` / inferred object shapes)
6. [ ] Type `pageBuilder` as Vue `Plugin` in all published versions (regression guard test on `.d.ts` output)
7. [ ] Keep `vue` as a peerDependency only; never nest Vue types that diverge from the host app
8. [ ] Document and enforce peer ranges for `vue` (and pinia if exported) with a “supported matrix” table
9. [ ] Export explicit types for all public composables (`getPageBuilder`, `usePageBuilderModal`, theme helpers)
10. [ ] Export component prop types for `PageBuilder` and `PageBuilderPreview` (props interface + `InstanceType`)
11. [ ] Tighten `PageBuilderConfig` so optional fields are clearly optional and required ones fail loudly in TS
12. [ ] Add branded / union types for form names, language codes, and theme preset IDs where strings are too loose today
13. [ ] Ensure `PageBuilderProduct` / product insert APIs accept host app product shapes without forcing `[key: string]: unknown` hacks
14. [ ] Publish `exports` map entry for types that works with `moduleResolution: bundler` and `node16`
15. [ ] Add a “types smoke” script: `npm pack` → install → `vue-tsc --noEmit` in fixture apps
16. [ ] Freeze breaking type changes behind semver majors; add a CHANGELOG section for type-only breaks
17. [ ] Add `@ts-expect-error` / negative tests where invalid config **must** fail type-check
18. [ ] Generate API reference from public types (TSDoc → docs) so consumers don’t guess shapes
19. [ ] Align TipTap / Pinia related public types so host apps don’t see duplicate identifier conflicts
20. [ ] Add troubleshooting doc section: “common TS2345 / Plugin / App mismatch” with copy-paste fixes

## B. Tests that fail in CI before users hit production

21. [ ] Expand `pageBuilderService` coverage for startBuilder / save / restore / preview paths
22. [ ] Add integration tests for `syncDomToStoreOnly` + remount so selection / slider / TipTap state survives
23. [ ] Add regression tests for every user-reported production bug (one test per issue, linked in comment)
24. [ ] Snapshot or assert published HTML clean output (no builder-only attrs leaked when intended)
25. [ ] Test `disableH1` omitted / true / false for TipTap, SEO, and Header H1 helper visibility
26. [ ] Test slider per-view `1` vs `2` CSS generation (90% peek, mobile 85%, missing attribute defaults)
27. [ ] Test theme replace clears Page Design / global classes (no leftover styles)
28. [ ] Test custom color modal: sentinel values never wipe real hex into the dropdown model
29. [ ] Test product section “hide prices” and exact class matching (no false `product-card-price-row` hits)
30. [ ] Test image settings open/close without dropping selected `<img>` after autosave remount
31. [ ] Add component mount tests for `PageBuilder.vue` toolbar actions (undo/redo, language, preview)
32. [ ] Add UI tests for component library filters, search, and helper categories
33. [ ] Add modal stacking / focus trap tests for settings panels and TipTap modal
34. [ ] Add RTL language smoke tests for canvas + menus
35. [ ] Add draft recovery tests: dirty localStorage → resume / discard / conflict paths
36. [ ] Add sanitize pipeline tests for inline TipTap HTML (XSS / disallowed tags)
37. [ ] Add font family resolution tests for custom + built-in fonts and `elementFonts`
38. [ ] Run visual regression (Playwright/Chromatic) on demo PageBuilder for desktop + mobile canvas widths
39. [ ] Fail CI if `npm run build` (lib) changes public `.d.ts` without an intentional snapshot update
40. [ ] Add mutation / fuzz tests for config objects with missing `updateOrCreate` / null `userSettings`

## C. UI simplicity & clarity

41. [ ] Audit first-run empty canvas: one clear CTA to add a section (no competing panels)
42. [ ] Reduce toolbar density: group advanced controls behind “More” / progressive disclosure
43. [ ] Unify settings panels (product, slider, SEO, page meta) into one visual pattern
44. [ ] Shorter labels and helper text; drop jargon from editor chrome
45. [ ] Consistent close / save / discard affordances on every modal
46. [ ] Clearer selected-element outline and label (what am I editing?)
47. [ ] Simpler undo/redo history UI (readable step titles, not raw indexes)
48. [ ] Quieter toasts: success only when needed; errors always actionable
49. [ ] Mobile canvas preview: fewer floating controls that obscure content
50. [ ] Keyboard-first paths documented and discoverable (shortcuts cheatsheet in UI)
51. [ ] Empty states for media library / products / themes with one primary action
52. [ ] Loading / saving indicators that don’t block the whole canvas unless necessary
53. [ ] Consistent icon set and sizes across toolbar and library cards
54. [ ] Prefer one scroll region per panel; avoid nested scroll traps
55. [ ] Soften or remove competing accent colors; stick to brand + neutrals
56. [ ] Component library cards: title + one-line description, less chrome
57. [ ] Theme picker: larger previews, fewer text badges
58. [ ] TipTap toolbar: only show relevant controls for the current selection
59. [ ] Image settings: primary controls first (src, alt, fit); advanced last
60. [ ] “Simple mode” config flag: hide power-user panels for smaller host apps

## D. Components, blocks & library

61. [ ] Review every helper block for valid HTML structure and accessible defaults
62. [ ] Ensure Header H1–H6 helpers stay gated by `disableH1` and sized consistently
63. [ ] Add missing locale keys for every block title / description
64. [ ] Thumbnail quality pass for library cards (consistent aspect, no layout jump)
65. [ ] Categorize blocks with fewer, clearer categories (Text, Media, Layout, Commerce, …)
66. [ ] Block search: fuzzy match titles + categories + description keys
67. [ ] Validate custom host components the same way as built-ins (structure tests)
68. [ ] Document and test “safe” HTML patterns for custom builder elements
69. [ ] Product blocks: clearer insert preview before placing on canvas
70. [ ] Slider block: defaults that look good on mobile out of the box
71. [ ] Forms / CTA blocks: simpler link & button style controls
72. [ ] Deprecate or merge near-duplicate helpers that confuse authors
73. [ ] Add “recently used” blocks in the library
74. [ ] Allow host apps to hide entire categories via config
75. [ ] Cover-image / OG-friendly section templates for marketing pages

## E. Editor reliability & simplicity of behavior

76. [ ] Single source of truth for selection after remounts (no “ghost” selected attrs)
77. [ ] Autosave that never surprises authors (status + last saved time)
78. [ ] Preview mode that cannot accidentally edit
79. [ ] Hardening: builder-only attributes stripped from published HTML by default
80. [ ] Clearer error when `startBuilder` config is incomplete (runtime + types)
81. [ ] Guard against double `startBuilder` / remount races
82. [ ] Stable history snapshots for TipTap + slider + product sections
83. [ ] Font loading failures fail soft with a readable fallback message
84. [ ] Media replace flows: keep dimensions / alt when swapping src
85. [ ] Language switch: don’t wipe unsaved canvas edits without confirm

## F. Docs, DX & consumer confidence

86. [ ] “Minimal Vue 3.3 TS app” recipe that type-checks and mounts the builder in &lt; 20 lines
87. [ ] “Minimal Nuxt 3” recipe with client-only plugin + type-check CI snippet
88. [ ] Expand troubleshooting for peer deps, Plugin typing, and duplicate Vue
89. [ ] Document which APIs are public vs internal (do not import from deep paths)
90. [ ] Versioned migration notes when config or types change
91. [ ] Example configs for ecommerce, blog, and SaaS landing pages
92. [ ] Publish a “supported Vue / Nuxt / Vite / vue-tsc versions” compatibility table
93. [ ] Add `attw` / publint / arethetypeswrong checks to CI for the npm package
94. [ ] Shrink or split the published bundle; document expected chunk size
95. [ ] Optional side-effect-free entry points (types-only / preview-only) if demand exists

## G. Accessibility, i18n & polish

96. [ ] Keyboard navigation audit for toolbar, library, and settings panels
97. [ ] Focus management when opening/closing TipTap and settings modals
98. [ ] Screen reader labels for icon-only controls
99. [ ] Locale coverage: every new UI string lands with `en` + key parity check in CI
100. [ ] Final “simplicity pass”: remove one unused setting or panel per minor release until the chrome feels calm

---

## How we use this list

- Prefer items that **prevent user-facing type/build failures** and **reduce UI complexity** first (sections A–C).
- Every bug report from npm / GitHub should map to a regression test (section B) before closing.
- Check items off in PRs; move completed work into release notes.

Questions / proposals: [GitHub issues](https://github.com/myissue-studio/vue-website-page-builder/issues)
