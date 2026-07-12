---
title: Live Demo — Vue 3 Page Builder
description: Try the free Vue page builder demo. Drag-and-drop editing, product sections, custom media library, and ecommerce admin workflows at mybuilder.dev.
---

## Demo

Vue 3 Page Builder component with drag-and-drop functionality for creating dynamic web pages.

Try the live demo to explore real-time visual updates and smooth content management.
<br>
[Play around with the Page Builder](https://mybuilder.dev)

The demo top links bar includes compact quick links (npm, GitHub, guide, contact, and current version) with improved responsive spacing for easier scanning.

In the Add Products modal (desktop), selected product editing now uses a full-width section below the main product grid and information sidebar. This gives more horizontal room for inputs, supports a two-column field layout inside each selected card, and makes editing multiple selected products more comfortable.

The Selected area now includes a "Fill missing required fields" helper button that auto-fills required values for selected products with human-readable defaults; missing links are set to https://www.google.com so you can quickly continue testing or layout work.

After using this helper, the modal now shows a success toast to confirm that missing required fields were filled.

Selected product editing in desktop now uses this order: Title, Description, then Link. New price and Old price stay together on the same row for faster pricing edits.

The built-in Full page themes library now also includes four additional presets: SaaS Launch, Portfolio Story, Event Registration, and Docs Overview.

The default component helper library now includes additional simple blocks (for example Quote, Simple List, Note Box, Spacer variants, text columns, and link/FAQ blocks) for faster page assembly.

Create and enhance digital experiences with Vue on any backend.
Experience the power and simplicity of the Vue Website Page Builder in action, with a live SEO analyzer for content optimization.

For local demo development inside this repository, demo harness files are organized under `src/tests/demo` (including `PageBuilderTest.vue`, demo page HTML, and demo theme preset utilities).
