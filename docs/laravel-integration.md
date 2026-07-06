---
title: Laravel Integration — Vue Page Builder
description: Embed the Vue page builder in Laravel admin panels with Inertia, Blade, or a dedicated Vue SPA. Save HTML to Eloquent models and restore with parsePageBuilderHTML().
---

## Laravel Integration

This guide covers the most common way to ship the builder inside a **Laravel admin** or **multi-tenant SaaS** dashboard.

The builder is a Vue 3 package — Laravel serves the shell; Vue handles the editor UI.

## Quick overview

| Layer | Responsibility |
|-------|----------------|
| Laravel | Auth, routes, Eloquent models, API to save `content` HTML |
| Vue (Vite) | Mount `<PageBuilder />`, call `startBuilder()`, publish via `getSavedPageHtml()` |
| Database | One `content` (longText) column per page/post/product description |

## 1. Install the package

In your Laravel project's frontend (Vite + Vue):

```bash
npm install @myissue/vue-website-page-builder pinia
```

Import styles once in your app entry:

```ts
import '@myissue/vue-website-page-builder/style.css'
```

Register Pinia if you have not already:

```ts
import { createPinia } from 'pinia'
app.use(createPinia())
```

## 2. Database column

Add a column for saved builder output:

```php
Schema::table('pages', function (Blueprint $table) {
    $table->longText('content')->nullable();
});
```

Store the **full HTML** from `getSavedPageHtml()` — including the `#pagebuilder` wrapper and `data-meta-title` / `data-meta-description` when set.

## 3. Inertia page (recommended)

**Route** (`routes/web.php`):

```php
Route::middleware(['auth'])->group(function () {
    Route::get('/admin/pages/{page}/edit', [PageController::class, 'edit'])->name('pages.edit');
    Route::put('/admin/pages/{page}', [PageController::class, 'update'])->name('pages.update');
});
```

**Controller**:

```php
public function edit(Page $page)
{
    return Inertia::render('Admin/Pages/Edit', [
        'page' => $page->only('id', 'title', 'content'),
    ]);
}

public function update(Request $request, Page $page)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
    ]);

    $page->update($validated);

    return redirect()->route('pages.edit', $page);
}
```

**Vue page** (`resources/js/Pages/Admin/Pages/Edit.vue`):

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { router } from '@inertiajs/vue3'
import { PageBuilder, getPageBuilder } from '@myissue/vue-website-page-builder'

const props = defineProps<{ page: { id: number; title: string; content: string | null } }>()

const pageBuilderService = getPageBuilder()

onMounted(async () => {
  const html = props.page.content ?? ''
  const { components, pageSettings } = pageBuilderService.parsePageBuilderHTML(html)

  await pageBuilderService.startBuilder(
    {
      updateOrCreate: { formType: 'update', formName: 'page' },
      resourceData: { id: props.page.id, title: props.page.title },
      pageSettings,
      userSettings: { autoSave: true },
    },
    components,
  )
})

function publish() {
  const content = pageBuilderService.getSavedPageHtml()
  router.put(route('pages.update', props.page.id), {
    title: props.page.title,
    content,
  })
}
</script>

<template>
  <PageBuilder :showPublishButton="true" @handlePublishPageBuilder="publish" />
</template>
```

## 4. Page meta (title + description)

Users can set **Meta title** and **Meta description** in the builder **Settings** tab. Values persist on `#pagebuilder` as:

```html
<div
  id="pagebuilder"
  data-meta-title="My Blog Post"
  data-meta-description="A short summary for SEO."
>
  ...
</div>
```

On the Laravel side, parse these when rendering the public page:

```php
// Example: extract meta from stored HTML before Blade layout
$dom = new DOMDocument();
@$dom->loadHTML($page->content);
$xpath = new DOMXPath($dom);
$wrapper = $dom->getElementById('pagebuilder');

$metaTitle = $wrapper?->getAttribute('data-meta-title') ?: $page->title;
$metaDescription = $wrapper?->getAttribute('data-meta-description') ?: '';
```

Or use `parsePageBuilderHTML()` on the frontend and send meta as separate API fields if you prefer normalized storage.

## 5. New page (create flow)

```php
public function create()
{
    return Inertia::render('Admin/Pages/Create', [
        'page' => ['id' => null, 'title' => 'Untitled', 'content' => null],
    ]);
}
```

```ts
await pageBuilderService.startBuilder({
  updateOrCreate: { formType: 'create', formName: 'page' },
  resourceData: { title: 'Untitled' },
  userSettings: { autoSave: true },
})
```

## 6. Blade-only embed (no Inertia)

Load a Vite entry that mounts the builder into a Blade view:

```blade
{{-- resources/views/admin/pages/edit.blade.php --}}
@vite(['resources/js/admin-page-builder.ts'])
<div id="page-builder-root"
     data-page-id="{{ $page->id }}"
     data-title="{{ $page->title }}"
     data-content="{{ $page->content }}">
</div>
```

Pass `data-content` via a JSON script tag if HTML is large (avoid attribute size limits).

## 7. Multi-tenant notes

- Use a unique `resourceData.id` (or slug) per tenant page so **localStorage draft keys** do not collide across users on shared machines.
- Scope Laravel policies so tenants only load their own `content`.
- For product grids, pass `:DisplayProducts` with your catalog picker when you need real SKUs, pagination, or API search (see [Display Products](/display-products)). Omit the prop to use the built-in sample catalog, or set `:enableDefaultProducts="false"` to hide product sections entirely.

## 8. Rendering public pages

The saved HTML is self-contained sections. Render it inside your layout:

```blade
@section('meta')
  <title>{{ $metaTitle }}</title>
  <meta name="description" content="{{ $metaDescription }}">
@endsection

<article class="prose">
  {!! $cleanHtml !!}
</article>
```

Strip builder-only attributes for production if needed — see [Rendering HTML Output](/rendering-html-output).

## Related docs

- [Backend Integration](/backend-integration) — save/restore contract
- [Vue Integration](/vue-integration) — generic Vue setup
- [Providing Configuration](/providing-configuration) — `startBuilder()` options
- [Display Products](/display-products) — ecommerce product sections
