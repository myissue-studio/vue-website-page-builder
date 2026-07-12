import Link from '@tiptap/extension-link'

export const InlineTipTapLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style'),
        renderHTML: (attributes) => {
          if (!attributes.style) return {}
          return { style: attributes.style }
        },
      },
    }
  },
}).configure({
  openOnClick: false,
})
