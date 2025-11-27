import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'docs',

  title: 'Vue 3 Page Builder',
  description:
    'Vue 3 Drag & Drop Page Builder. Power your vision and build impressive, modern pages. A web builder designed for stunning results. Enable users to design and publish responsive pages—such as listings, job posts, or blogs—at any scale. Easily manage and update content with flexibility.',
  base: '/vue-website-page-builder/',
  themeConfig: {
    search: {
      provider: 'local',
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/myissue-studio/vue-website-page-builder' },
    ],
  },
})
