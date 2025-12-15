import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'docs',
  title: 'Builder',
  description:
    'Vue 3 Drag & Drop Page Builder. Power your vision and build impressive, modern pages. A web builder designed for stunning results. Enable users to design and publish responsive pages—such as listings, job posts, or blogs—at any scale. Easily manage and update content with flexibility.',
  base: '/vue-website-page-builder/',
  head: [
    ['link', { rel: 'icon', href: '/vue-website-page-builder/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap',
        rel: 'stylesheet',
      },
    ],
  ],
  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local',
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Demo', link: 'https://mybuilder.dev' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Demo', link: '/demo' },
          { text: 'Information', link: '/information' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Installation', link: '/installation' },
          { text: 'Nuxt Integration', link: '/nuxt-integration' },
          { text: 'Vue Integration', link: '/vue-integration' },
        ],
      },
      {
        text: 'Usage',
        items: [
          { text: 'Providing Configuration', link: '/providing-configuration' },
          { text: 'Language Support', link: '/language-support' },
          { text: 'Automatic Draft Recovery', link: '/automatic-draft-recovery' },
          { text: 'Retrieving HTML for Submission', link: '/retrieving-html-for-submission' },
          { text: 'Restoring Previously Content', link: '/restoring-previously-content' },
          { text: 'Rendering HTML Output', link: '/rendering-html-output' },
          { text: 'Publish Changes', link: '/publish-changes' },
          { text: 'Use in Modal', link: '/use-in-modal' },
          { text: 'Styling', link: '/styling' },
          { text: 'Custom Media Library', link: '/custom-media-library' },
          { text: 'Unsplash Integration', link: '/unsplash' },
          { text: 'Custom HTML Builder Elements', link: '/custom-html-builder-elements' },
          { text: 'Troubleshooting', link: '/troubleshooting' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/myissue-studio/vue-website-page-builder' },
    ],
    footer: {
      message: 'Released under the MIT License.',
    },
  },
})
