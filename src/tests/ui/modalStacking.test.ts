// @vitest-environment jsdom
/**
 * Tests for modal / overlay stacking-context safety.
 *
 * REAL-WORLD SCENARIO
 * -------------------
 * Many users embed the page builder inside their own modal (e.g. a Laravel
 * Jetstream Dialog, a Headless-UI Dialog, a custom `<div class="fixed inset-0
 * z-50">`). Modern CSS modal implementations typically set `transform`,
 * `filter`, or `will-change` on their animated wrappers to create smooth
 * open/close transitions.
 *
 * A CSS `transform` (even `transform: none`) creates a new "containing block"
 * for any `position: fixed` descendants, confining them to that element rather
 * than the viewport. It also creates a new stacking context, so z-index values
 * inside cannot "win" against z-index values of elements that are siblings of
 * the transformed ancestor.
 *
 * The correct fix is `<teleport to="body">` — this lifts the overlay element
 * out of the parent stacking context entirely.
 *
 * WHAT WE TEST
 * ------------
 * 1. ModalBuilder  — correctly teleports to <body>  ✅ (should PASS)
 * 2. FloatingSidePanel — correctly teleports to <body>  ✅ (should PASS)
 * 3. GlobalLoader  — does NOT teleport to <body>  ❌ BUG (should FAIL)
 *    → When the page builder is inside a parent modal with `transform`, the
 *      loader only covers the modal area, not the full viewport.
 * 4. Integration: parent-modal scenario — child page-builder modals escape
 *    the parent stacking context                       ✅ (should PASS)
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createApp, h, nextTick, defineComponent } from 'vue'
import ModalBuilder from '../../Components/Modals/ModalBuilder.vue'
import FloatingSidePanel from '../../Components/Overlays/FloatingSidePanel.vue'
import GlobalLoader from '../../Components/Loaders/GlobalLoader.vue'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mounts a Vue component into a fresh <div> appended to document.body.
 *  Returns the app instance and the mount container so they can be cleaned up. */
async function mountInto(
  component: Parameters<typeof createApp>[0],
  props: Record<string, unknown> = {},
  slots: Record<string, () => ReturnType<typeof h>> = {},
): Promise<{ app: ReturnType<typeof createApp>; container: HTMLElement }> {
  const container = document.createElement('div')
  container.setAttribute('data-test-mount', '')
  document.body.appendChild(container)

  const app = createApp(
    defineComponent({
      render() {
        return h(component as Parameters<typeof h>[0], props, slots)
      },
    }),
  )
  app.mount(container)
  await nextTick()
  return { app, container }
}

function cleanUp(app: ReturnType<typeof createApp>, container: HTMLElement) {
  app.unmount()
  if (container.parentNode) container.parentNode.removeChild(container)
}

// ---------------------------------------------------------------------------
// ModalBuilder — must teleport to body
// ---------------------------------------------------------------------------
describe('ModalBuilder — teleport to body', () => {
  it('renders the modal overlay at document.body level, not inside the mount container', async () => {
    const { app, container } = await mountInto(ModalBuilder, {
      title: 'Test Modal',
      showModalBuilder: true,
    })

    // The teleported element should exist somewhere in document.body
    const modal = document.getElementById('pbx-modal')
    expect(modal).not.toBeNull()

    // It must NOT be inside our mount container (that would mean no teleport)
    expect(container.contains(modal)).toBe(false)

    // It must be reachable from document.body
    expect(document.body.contains(modal)).toBe(true)

    cleanUp(app, container)
  })

  it('modal overlay is a direct child of <body> (not nested inside the page-builder wrapper)', async () => {
    // Simulate a user wrapping the page builder in their own modal container
    const parentModal = document.createElement('div')
    parentModal.id = 'user-parent-modal'
    parentModal.style.cssText = 'position:fixed;inset:0;z-index:50;transform:scale(1)'
    document.body.appendChild(parentModal)

    const innerContainer = document.createElement('div')
    innerContainer.id = 'page-builder-wrapper'
    parentModal.appendChild(innerContainer)

    const app = createApp(
      defineComponent({
        render() {
          return h(ModalBuilder, { title: 'Inner Modal', showModalBuilder: true }, {})
        },
      }),
    )
    app.mount(innerContainer)
    await nextTick()

    const modal = document.getElementById('pbx-modal')
    expect(modal).not.toBeNull()

    // Even though the component was mounted inside parentModal > innerContainer,
    // the teleport should have moved #pbx-modal to document.body
    expect(parentModal.contains(modal)).toBe(false) // NOT trapped inside the parent modal
    expect(document.body.contains(modal)).toBe(true)

    app.unmount()
    parentModal.remove()
  })

  it('does not render the modal markup when showModalBuilder is false', async () => {
    const { app, container } = await mountInto(ModalBuilder, {
      title: 'Hidden Modal',
      showModalBuilder: false,
    })

    // The teleport container (#pbx-modal) may still exist but the inner dialog should not
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog).toBeNull()

    cleanUp(app, container)
  })
})

// ---------------------------------------------------------------------------
// FloatingSidePanel — must teleport to body
// ---------------------------------------------------------------------------
describe('FloatingSidePanel — teleport to body', () => {
  it('renders the side panel at document.body level when open', async () => {
    const { app, container } = await mountInto(FloatingSidePanel, {
      showSidebarPanel: true,
      title: 'Test Panel',
    })

    await nextTick()

    // The panel should be teleported — find its fixed wrapper which is NOT
    // inside the mount container
    const fixedEls = [...document.body.children].flatMap((el) =>
      [...el.querySelectorAll('.pbx-fixed')].concat(el.classList.contains('pbx-fixed') ? [el] : []),
    )

    // At least one fixed overlay element should exist outside container
    const outsideContainer = fixedEls.filter((el) => !container.contains(el))
    expect(outsideContainer.length).toBeGreaterThan(0)

    cleanUp(app, container)
  })

  it('mounts the panel inside a simulated parent modal — panel still escapes to body', async () => {
    const parentModal = document.createElement('div')
    parentModal.id = 'user-parent-modal-2'
    parentModal.style.cssText = 'position:fixed;inset:0;z-index:50;transform:translateY(0)'
    document.body.appendChild(parentModal)

    const innerContainer = document.createElement('div')
    parentModal.appendChild(innerContainer)

    const app = createApp(
      defineComponent({
        render() {
          return h(FloatingSidePanel, { showSidebarPanel: true, title: 'Side Panel' }, {})
        },
      }),
    )
    app.mount(innerContainer)
    await nextTick()

    // Any .pbx-fixed overlay should NOT be trapped inside parentModal
    const trappedFixedEls = parentModal.querySelectorAll('.pbx-fixed')
    expect(trappedFixedEls.length).toBe(0)

    app.unmount()
    parentModal.remove()
  })
})

// ---------------------------------------------------------------------------
// GlobalLoader — BUG: not teleported to body
//
// This test documents the bug. It asserts the CORRECT behavior (loader at body
// level), which currently FAILS because GlobalLoader uses `position: fixed`
// without `<teleport to="body">`. When the page builder is inside an animated
// parent modal with `transform`, the loader is trapped and only covers the
// modal area, not the full viewport.
//
// Fix: add `<teleport to="body">` around the loader div in GlobalLoader.vue.
// ---------------------------------------------------------------------------
describe('GlobalLoader — teleport to body (BUG: currently trapped in mount container)', () => {
  it('loader element should be at document.body level, not inside the mount container', async () => {
    const { app, container } = await mountInto(GlobalLoader)

    await nextTick()

    // The loader's fixed overlay should NOT be inside our container
    // (if it IS inside, it would be trapped by any transform on a parent)
    const loaderInContainer = container.querySelector('.pbx-fixed')

    // This assertion documents the CORRECT requirement.
    // It currently FAILS because GlobalLoader lacks <teleport to="body">.
    expect(loaderInContainer).toBeNull()

    cleanUp(app, container)
  })

  it('loader should be accessible from document.body even when mounted inside a transformed parent', async () => {
    // Simulate: user's modal has transform (very common for CSS transitions)
    const parentModal = document.createElement('div')
    parentModal.style.cssText = 'position:fixed;inset:0;z-index:100;transform:scale(1)'
    document.body.appendChild(parentModal)

    const innerContainer = document.createElement('div')
    parentModal.appendChild(innerContainer)

    const app = createApp(GlobalLoader)
    app.mount(innerContainer)
    await nextTick()

    // The loader SHOULD escape the transformed parent via teleport
    // Currently FAILS: loader is inside innerContainer → inside parentModal
    const loaderTrapped = parentModal.querySelector('.pbx-fixed')
    expect(loaderTrapped).toBeNull()

    app.unmount()
    parentModal.remove()
  })
})

// ---------------------------------------------------------------------------
// Integration: full parent-modal scenario
// ---------------------------------------------------------------------------
describe('Integration — page builder inside user parent modal', () => {
  it('ModalBuilder child modal escapes the parent stacking context', async () => {
    // User wraps page builder in a modal (common pattern with JS frameworks)
    const userModal = document.createElement('div')
    userModal.setAttribute('data-user-modal', '')
    // Simulate a transformed modal wrapper (Headless UI / Radix style)
    userModal.style.cssText =
      'position:fixed;inset:0;z-index:50;transform:translateZ(0);overflow:hidden'
    document.body.appendChild(userModal)

    // Page builder is mounted inside the user's modal
    const pageBuilderRoot = document.createElement('div')
    pageBuilderRoot.setAttribute('data-page-builder-root', '')
    userModal.appendChild(pageBuilderRoot)

    const app = createApp(
      defineComponent({
        render() {
          // ModalBuilder is one of the page builder's internal modals (e.g. image picker)
          return h(ModalBuilder, { title: 'Image Picker', showModalBuilder: true }, {})
        },
      }),
    )
    app.mount(pageBuilderRoot)
    await nextTick()

    const modal = document.getElementById('pbx-modal')
    expect(modal).not.toBeNull()

    // CRITICAL: the page builder's internal modal must NOT be trapped inside
    // the user's parent modal (which has transform and overflow:hidden)
    expect(userModal.contains(modal)).toBe(false)

    // And it must be at document.body level
    expect(document.body.contains(modal)).toBe(true)

    app.unmount()
    userModal.remove()
  })

  it('page builder internals do not render any fixed overlay inside a transformed ancestor', async () => {
    const userModal = document.createElement('div')
    userModal.setAttribute('data-overflow-modal', '')
    userModal.style.cssText = 'position:fixed;inset:0;z-index:50;transform:scale(1)'
    document.body.appendChild(userModal)

    const pbRoot = document.createElement('div')
    userModal.appendChild(pbRoot)

    // Simulate both ModalBuilder (open) + FloatingSidePanel (open) simultaneously
    const app = createApp(
      defineComponent({
        render() {
          return h('div', [
            h(ModalBuilder, { title: 'Settings', showModalBuilder: true }),
            h(FloatingSidePanel, { title: 'Styles', showSidebarPanel: true }),
          ])
        },
      }),
    )
    app.mount(pbRoot)
    await nextTick()

    // After teleport, NO fixed overlay should be inside userModal
    const trappedOverlays = userModal.querySelectorAll('.pbx-fixed')
    expect(trappedOverlays.length).toBe(0)

    app.unmount()
    userModal.remove()
  })
})
