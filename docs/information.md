## Why Use the Shared Instance?

By always accessing the shared instance, you avoid creating multiple, isolated copies of the builder. This prevents data inconsistencies, synchronization issues, and unpredictable behavior. All components and modules interact with the same centralized service, ensuring that updates and state changes are reflected everywhere in your application.

> **Note:**  
> The Page Builder is implemented as a singleton service. All page-building logic and state are managed by a single shared instance, even if you use `<PageBuilder />` in multiple places.

## Important: CSS Prefixing (`pbx-`)

All CSS classes generated or processed by the Page Builder—including Tailwind utilities and your custom classes—are automatically prefixed with `pbx-`. This ensures the builder’s styles never conflict with your app’s existing CSS or Tailwind setup.
This prevents global styles from leaking into the builder and vice versa, which is crucial for embedding the builder into larger apps or white-label environments.

**How does this affect you?**

When a user adds a component into the Page Builder, all classes from that component are automatically prefixed with `pbx-` (e.g., `pbx-button`, `pbx-container`) to ensure style isolation and avoid conflicts.

Tailwind installation is not required. The Page Builder ships with prefixed utility classes to ensure there are no naming conflicts. If you wish to use Tailwind in your own application, you may install and configure it as usual without interfering with the Page Builder.

> **Note:**
> Simply import the builder’s CSS file once in your project. All builder styles are namespaced, so there is no risk of style conflicts.

## Local Storage & Auto-Save

The Page Builder automatically saves all changes to the browser’s local storage. Every time you add, edit, or delete a component, your progress is preserved—even if you close the browser or navigate away.

- **Auto-Save:** Changes are periodically saved as you work.
- **Manual Save:** Clicking the Save button also stores the current state.
