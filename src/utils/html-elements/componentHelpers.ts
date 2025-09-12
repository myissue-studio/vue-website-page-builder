interface ComponentHelper {
  html_code: string
  id: string | null
  title: string
  icon: string
}

const componentHelpers: ComponentHelper[] = [
  {
    html_code: `
    <section>
    <div class="relative py-4">
    <div class="mx-auto max-w-7xl lg:px-4 px-2">
    <div>
    <p>
    Start customizing by editing this default text directly in the editor.
    </p>
    </div>
    </div>
    </div>
    </section>`,
    id: null,
    title: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    text_fields
    </span>
    `,
  },
  {
    html_code: `<section><div class="relative py-4"><div class="mx-auto max-w-7xl lg:px-4 px-2"><div class="break-words"><h2>Layouts and visual.</h2></div></div></div></section>`,
    id: null,
    title: 'Header H2',
    icon: `
    <span class="material-symbols-outlined">
    format_h2
    </span>
    `,
  },
  {
    html_code: `<section><div class="relative py-4"><div class="mx-auto max-w-7xl lg:px-4 px-2"><div class="break-words"><h3>Layouts and visual.</h3></div></div></div></section>`,
    id: null,
    title: 'Header H3',
    icon: `
    <span class="material-symbols-outlined">
    format_h3
    </span>
    `,
  },
  {
    html_code: `<section><div class="relative py-4"><div class="mx-auto max-w-7xl lg:px-4 px-2"><div class="break-words"><h4>Layouts and visual.</h4></div></div></div></section>`,
    id: null,
    title: 'Header H4',
    icon: `
    <span class="material-symbols-outlined">
    format_h3
    </span>
    `,
  },
  {
    html_code: `<section><div class="relative py-4"><div class="mx-auto max-w-7xl lg:px-4 px-2"><div class="break-words"><h5>Layouts and visual.</h5></div></div></div></section>`,
    id: null,
    title: 'Header H5',
    icon: `
    <span class="material-symbols-outlined">
    format_h3
    </span>
    `,
  },
  {
    html_code: `<section><div class="relative py-4"><div class="mx-auto max-w-7xl lg:px-4 px-2"><div class="break-words"><h6>Layouts and visual.</h6></div></div></div></section>`,
    id: null,
    title: 'Header H6',
    icon: `
    <span class="material-symbols-outlined">
    format_h3
    </span>
    `,
  },
  {
    html_code: `
    <section>
    <div class="py-4">
    <div class="mx-auto max-w-7xl w-full pt-6 pb-6 bg-gray-100">
    <div  id="youtube-video" class="w-full aspect-video p-4">

    <iframe
    frameborder="0" 
    allowfullscreen
    class="w-full aspect-video"
    src="" 
    allow="accelerometer; autoplay; clipboard-write;" allowfullscreen>
    </iframe>
    </div>
    </div>
    </div>
    </section>`,
    id: null,
    title: 'YouTube Video',
    icon: `
    <span class="material-symbols-outlined">
    play_circle
    </span>
    `,
  },
  {
    html_code: `<section><div class="relative py-8"><div class="absolute inset-0 flex items-center" aria-hidden="true"><div class="w-full border-4 border-gray-800 leading-none"></div></div><div class="relative flex justify-start"></div></div></section>`,
    id: null,
    title: 'Break Divider',
    icon: `
    <span class="material-symbols-outlined">
    horizontal_rule
    </span>
    `,
  },
  {
    html_code: `<section>\n<div class=\"w-full md:pt-2 md:pb-2 pt-4 pb-4 lg:px-4 px-2\">\n<div class=\"mx-auto max-w-7xl\">\n<div id=\"linktree\"\nclass=\"flex items-centre justify-start font-medium text-black bg-gray-200\">\n\n<a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://www.google.com\">Link to landing page</a>\n</div>\n</div>\n</div>\n</section>`,
    id: null,
    title: 'Link',
    icon: `
        <span class="material-symbols-outlined">
        link
        </span>
        `,
  },
]

export default componentHelpers
