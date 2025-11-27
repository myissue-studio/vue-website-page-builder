## Styling

Styling the Main Page Builder Container.
The Page Builder allows you to define and update global styles for the main wrapper (`#pagebuilder`) at any time. These settings control the overall appearance, including font family, text color, background color, and more. Whether you set them initially in your config or update them dynamically at runtime, your changes are instantly reflected across all sections.

Use the `pageSettings` config to apply custom CSS classes and inline styles to the Page Builder’s main wrapper.
The Page Builder renders all components wrapped inside a single parent container, `<div id="pagebuilder">`.
You can pass global CSS `classes` and `style` to this wrapper by adding a `pageSettings` object in your config:

```ts
const configPageBuilder = {
  // other config options...

  pageSettings: {
    classes: 'max-w-screen-lg mx-auto px-4 bg-white',
    style: {
      backgroundColor: 'red',
      border: '6px solid yellow',
    },
  },
} as const
```

You have full control over the page’s appearance at any time—instantly override or clear global st
