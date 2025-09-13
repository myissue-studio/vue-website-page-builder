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
    <div class="pbx-relative pbx-py-4">
    <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2">
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
    html_code: `<section><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words"><h2>Layouts and visual.</h2></div></div></div></section>`,
    id: null,
    title: 'Header H2',
    icon: `
    <span class="material-symbols-outlined">
    format_h2
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words"><h3>Layouts and visual.</h3></div></div></div></section>`,
    id: null,
    title: 'Header H3',
    icon: `
    <span class="material-symbols-outlined">
    format_h3
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words"><h4>Layouts and visual.</h4></div></div></div></section>`,
    id: null,
    title: 'Header H4',
    icon: `
    <span class="material-symbols-outlined">
    format_h3
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words"><h5>Layouts and visual.</h5></div></div></div></section>`,
    id: null,
    title: 'Header H5',
    icon: `
    <span class="material-symbols-outlined">
    format_h3
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words"><h6>Layouts and visual.</h6></div></div></div></section>`,
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
    <div class="pbx-py-4">
    <div class="pbx-mx-auto pbx-max-w-7xl pbx-w-full pbx-pt-6 pbx-pb-6 pbx-bg-gray-100">
    <div id="youtube-video" class="pbx-w-full pbx-aspect-video pbx-p-4">

    <iframe
    frameborder="0" 
    allowfullscreen
    class="pbx-w-full pbx-aspect-video"
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
    html_code: `<section><div class="pbx-relative pbx-py-8"><div class="pbx-absolute pbx-inset-0 pbx-flex pbx-items-center" aria-hidden="true"><div class="pbx-w-full pbx-border-4 pbx-border-gray-800 pbx-leading-none"></div></div><div class="pbx-relative pbx-flex pbx-justify-start"></div></div></section>`,
    id: null,
    title: 'Break Divider',
    icon: `
    <span class="material-symbols-outlined">
    horizontal_rule
    </span>
    `,
  },
  {
    html_code: `<section> <div class="pbx-w-full md:pbx-pt-2 md:pbx-pb-2 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-flex pbx-justify-start"> <div class="pbx-flex pbx-items-center pbx-font-medium pbx-text-white pbx-bg-green-600" id="linktree" > <span> <a id="linktree" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" >Link to landing page</a > </span> </div> </div> </div> </div> </section>`,
    id: null,
    title: 'Left Positioned Button',
    icon: `
        <span class="material-symbols-outlined">
        link
        </span>
        `,
  },
  {
    html_code: `<section> <div class="pbx-w-full md:pbx-pt-2 md:pbx-pb-2 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-flex pbx-justify-center"> <div class="pbx-flex pbx-items-center pbx-font-medium pbx-text-white pbx-bg-green-600" id="linktree" > <span> <a id="linktree" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" >Link to landing page</a > </span> </div> </div> </div> </div> </section>`,
    id: null,
    title: 'Centered Button',
    icon: `
        <span class="material-symbols-outlined">
        link
        </span>
        `,
  },
  {
    html_code: `<section> <div class="pbx-w-full md:pbx-pt-2 md:pbx-pb-2 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-flex pbx-justify-end"> <div class="pbx-flex pbx-items-center pbx-font-medium pbx-text-white pbx-bg-green-600" id="linktree" > <span> <a id="linktree" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" >Link to landing page</a > </span> </div> </div> </div> </div> </section>`,
    id: null,
    title: 'Right Positioned Button',
    icon: `
        <span class="material-symbols-outlined">
        link
        </span>
        `,
  },
]

export default componentHelpers
