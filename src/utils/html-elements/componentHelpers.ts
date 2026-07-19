import type { PageBuilderConfig } from '../../types'
import { isTipTapH1Disabled } from '../builder/tiptap-heading-levels'

interface ComponentHelper {
  html_code: string
  id: string | null
  title: string
  icon: string
  category: string
  [key: string]: unknown // Allow compatibility with ComponentObject
}

// Do not use iamges or placeholder images for helepr componenets. Should be html only
const componentHelpers: ComponentHelper[] = [
  {
    html_code: `
    <section>
    <div class="pbx-pt-4 pbx-pb-8 pbx-px-4">
    <div class="pbx-mx-auto pbx-max-w-7xl">
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
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    text_fields
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-break-words pbx-text-4xl lg:pbx-text-5xl pbx-font-medium"><h1>Layouts and visual.</h1></div></div></div></section>`,
    id: null,
    title: 'Header H1',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    format_h1
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-break-words"><h2>Layouts and visual.</h2></div></div></div></section>`,
    id: null,
    title: 'Header H2',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    format_h2
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-break-words"><h3>Layouts and visual.</h3></div></div></div></section>`,
    id: null,
    title: 'Header H3',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    format_h3
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-break-words"><h4>Layouts and visual.</h4></div></div></div></section>`,
    id: null,
    title: 'Header H4',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    format_h3
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-break-words"><h5>Layouts and visual.</h5></div></div></div></section>`,
    id: null,
    title: 'Header H5',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    format_h3
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-break-words"><h6>Layouts and visual.</h6></div></div></div></section>`,
    id: null,
    title: 'Header H6',
    category: 'Text',
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
    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen">
    </iframe>
    </div>
    </div>
    </div>
    </section>`,
    id: null,
    title: 'YouTube Video',
    category: 'Media',
    icon: `
    <span class="material-symbols-outlined">
    play_circle
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-relative pbx-py-8"><div class="pbx-absolute pbx-inset-0 pbx-flex pbx-items-center" aria-hidden="true"><div class="pbx-w-full pbx-border pbx-border-gray-800 pbx-leading-none"></div></div><div class="pbx-relative pbx-flex pbx-justify-start"></div></div></section>`,
    id: null,
    title: 'Break Divider',
    category: 'Layout',
    icon: `
    <span class="material-symbols-outlined">
    horizontal_rule
    </span>
    `,
  },
  {
    html_code: `<section> <div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-flex pbx-justify-start"> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full">Link to landing page</a></p> </div> </div> </div> </div> </section>`,
    id: null,
    title: 'Left Positioned Button',
    category: 'Buttons',
    icon: `
        <span class="material-symbols-outlined">
        link
        </span>
        `,
  },
  {
    html_code: `<section> <div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-flex pbx-justify-center"> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full">Link to landing page</a></p> </div> </div> </div> </div> </section>`,
    id: null,
    title: 'Centered Button',
    category: 'Buttons',
    icon: `
        <span class="material-symbols-outlined">
        link
        </span>
        `,
  },
  {
    html_code: `<section> <div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-flex pbx-justify-end"> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full">Link to landing page</a></p> </div> </div> </div> </div> </section>`,
    id: null,
    title: 'Right Positioned Button',
    category: 'Buttons',
    icon: `
        <span class="material-symbols-outlined">
        link
        </span>
        `,
  },
  {
    html_code: `<section> <div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-flex pbx-justify-start pbx-gap-4"> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full">Link to landing page</a></p> </div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full">Link to landing page</a></p> </div> </div> </div> </div> </section>`,
    id: null,
    title: '2 Left Positioned Buttons',
    category: 'Buttons',
    icon: `
        <span class="material-symbols-outlined">
        link
        </span>
        `,
  },
  {
    html_code: `<section> <div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-flex pbx-justify-center pbx-gap-4"> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full">Link to landing page</a></p> </div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full">Link to landing page</a></p> </div> </div> </div> </div> </section>`,
    id: null,
    title: '2 Centered Buttons',
    category: 'Buttons',
    icon: `
        <span class="material-symbols-outlined">
        link
        </span>
        `,
  },
  {
    html_code: `<section> <div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-flex pbx-justify-end pbx-gap-4"> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full">Link to landing page</a></p> </div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full">Link to landing page</a></p> </div> </div> </div> </div> </section>`,
    id: null,
    title: '2 Right Positioned Buttons',
    category: 'Buttons',
    icon: `
        <span class="material-symbols-outlined">
        link
        </span>
        `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><ul><li><p>First list item</p></li><li><p>Second list item</p></li><li><p>Third list item</p></li></ul></div></div></section>`,
    id: null,
    title: 'Simple List',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    format_list_bulleted
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-p-4 pbx-bg-gray-100"><p>This is a simple note box for important information.</p></div></div></div></section>`,
    id: null,
    title: 'Note Box',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    sticky_note_2
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-py-10"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-h-px pbx-bg-transparent"></div></div></div></section>`,
    id: null,
    title: 'Spacer Medium',
    category: 'Layout',
    icon: `
    <span class="material-symbols-outlined">
    height
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-py-16"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-h-px pbx-bg-transparent"></div></div></div></section>`,
    id: null,
    title: 'Spacer Large',
    category: 'Layout',
    icon: `
    <span class="material-symbols-outlined">
    unfold_more
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-gap-6"><div><p>Left column text. Start customizing by editing this default text directly in the editor.</p></div><div><p>Right column text. Start customizing by editing this default text directly in the editor.</p></div></div></div></div></section>`,
    id: null,
    title: '2 Column Text',
    category: 'Layout',
    icon: `
    <span class="material-symbols-outlined">
    view_column_2
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-3 pbx-gap-6"><div><p>Column one text.</p></div><div><p>Column two text.</p></div><div><p>Column three text.</p></div></div></div></div></section>`,
    id: null,
    title: '3 Column Text',
    category: 'Layout',
    icon: `
    <span class="material-symbols-outlined">
    view_column_3
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-flex pbx-justify-center"><div class="pbx-flex pbx-items-center pbx-font-medium pbx-text-myPrimaryLinkColor"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Simple text link</a></p></div></div></div></div></section>`,
    id: null,
    title: 'Centered Text Link',
    category: 'Buttons',
    icon: `
    <span class="material-symbols-outlined">
    link
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-p-4 pbx-border pbx-border-gray-200"><p><strong>Q:</strong> What is this section for?</p><p><strong>A:</strong> Use it as a simple FAQ item and edit text inline.</p></div></div></div></section>`,
    id: null,
    title: 'FAQ Item',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    help
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-h-px pbx-bg-transparent"></div></div></div></section>`,
    id: null,
    title: 'Spacer Small',
    category: 'Layout',
    icon: `
    <span class="material-symbols-outlined">
    compress
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><ol><li><p>First list item</p></li><li><p>Second list item</p></li><li><p>Third list item</p></li></ol></div></div></section>`,
    id: null,
    title: 'Numbered List',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    format_list_numbered
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-3xl"><div class="pbx-border-l-4 pbx-border-gray-900 pbx-pl-6"><div class="pbx-text-xl pbx-leading-relaxed"><p>Start customizing by editing this default text directly in the editor.</p></div></div></div></div></section>`,
    id: null,
    title: 'Quote Block',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    format_quote
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-text-xl lg:pbx-text-2xl pbx-leading-relaxed"><p>Start customizing by editing this default text directly in the editor.</p></div></div></div></section>`,
    id: null,
    title: 'Lead Text',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    subject
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-text-sm pbx-text-gray-500"><p>Start customizing by editing this default text directly in the editor.</p></div></div></div></section>`,
    id: null,
    title: 'Caption Text',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    notes
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-flex pbx-justify-center"><div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-border pbx-border-myPrimaryLinkColor pbx-text-myPrimaryLinkColor pbx-rounded-full">Link to landing page</a></p> </div></div></div></div></section>`,
    id: null,
    title: 'Centered Outline Button',
    category: 'Buttons',
    icon: `
    <span class="material-symbols-outlined">
    crop_square
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-flex pbx-justify-stretch"><div class="pbx-flex pbx-items-center pbx-justify-center pbx-w-full pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-w-full pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full">Link to landing page</a></p> </div></div></div></div></section>`,
    id: null,
    title: 'Full Width Button',
    category: 'Buttons',
    icon: `
    <span class="material-symbols-outlined">
    width
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-flex pbx-justify-start"><div class="pbx-flex pbx-items-center pbx-font-medium pbx-text-myPrimaryLinkColor"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Simple text link</a></p></div></div></div></div></section>`,
    id: null,
    title: 'Left Text Link',
    category: 'Buttons',
    icon: `
    <span class="material-symbols-outlined">
    link
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-flex pbx-justify-end"><div class="pbx-flex pbx-items-center pbx-font-medium pbx-text-myPrimaryLinkColor"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Simple text link</a></p></div></div></div></div></section>`,
    id: null,
    title: 'Right Text Link',
    category: 'Buttons',
    icon: `
    <span class="material-symbols-outlined">
    link
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-relative pbx-py-8 pbx-px-4"><div class="pbx-absolute pbx-inset-0 pbx-flex pbx-items-center" aria-hidden="true"><div class="pbx-w-full pbx-border-t pbx-border-gray-200"></div></div><div class="pbx-relative pbx-flex pbx-justify-center"><div class="pbx-bg-white pbx-px-4 pbx-text-sm pbx-text-gray-500"><p>Layouts and visual.</p></div></div></div></section>`,
    id: null,
    title: 'Labeled Divider',
    category: 'Layout',
    icon: `
    <span class="material-symbols-outlined">
    more_horiz
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-4 pbx-gap-6"><div><p>Column one text.</p></div><div><p>Column two text.</p></div><div><p>Column three text.</p></div><div><p>Column four text.</p></div></div></div></div></section>`,
    id: null,
    title: '4 Column Text',
    category: 'Layout',
    icon: `
    <span class="material-symbols-outlined">
    view_column
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-gap-8"><div><div class="pbx-font-semibold pbx-mb-2"><h3>Layouts and visual.</h3></div><div><p>Start customizing by editing this default text directly in the editor.</p></div></div><div><div class="pbx-font-semibold pbx-mb-2"><h3>Layouts and visual.</h3></div><div><p>Start customizing by editing this default text directly in the editor.</p></div></div></div></div></div></section>`,
    id: null,
    title: '2 Column With Headers',
    category: 'Layout',
    icon: `
    <span class="material-symbols-outlined">
    view_agenda
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-p-4 pbx-border-l-4 pbx-border-myPrimaryLinkColor pbx-bg-gray-50"><p>Start customizing by editing this default text directly in the editor.</p></div></div></div></section>`,
    id: null,
    title: 'Callout Box',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    campaign
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-flex pbx-flex-col pbx-gap-2"><div class="pbx-font-semibold"><p>Company Name</p></div><div><p>123 Example Street</p></div><div><p>City, Country</p></div><div class="pbx-text-myPrimaryLinkColor"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">hello@example.com</a></p></div></div></div></div></section>`,
    id: null,
    title: 'Address Block',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    location_on
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-flex pbx-justify-center"><div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="mailto:hello@example.com" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full">Email us</a></p> </div></div></div></div></section>`,
    id: null,
    title: 'Email Button',
    category: 'Buttons',
    icon: `
    <span class="material-symbols-outlined">
    mail
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-w-full pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-flex pbx-justify-center"><div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="tel:+15550000000" class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-px-4 pbx-py-2 pbx-bg-myPrimaryLinkColor pbx-text-white hover:pbx-text-white pbx-rounded-full">Call us</a></p> </div></div></div></div></section>`,
    id: null,
    title: 'Phone Button',
    category: 'Buttons',
    icon: `
    <span class="material-symbols-outlined">
    call
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-font-semibold pbx-mb-3"><h3>Layouts and visual.</h3></div><ul><li><p>First list item</p></li><li><p>Second list item</p></li><li><p>Third list item</p></li></ul></div></div></section>`,
    id: null,
    title: 'List With Title',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    list_alt
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-3 pbx-gap-8"><div><div class="pbx-font-semibold pbx-mb-2"><h3>Layouts and visual.</h3></div><div><p>Start customizing by editing this default text directly in the editor.</p></div></div><div><div class="pbx-font-semibold pbx-mb-2"><h3>Layouts and visual.</h3></div><div><p>Start customizing by editing this default text directly in the editor.</p></div></div><div><div class="pbx-font-semibold pbx-mb-2"><h3>Layouts and visual.</h3></div><div><p>Start customizing by editing this default text directly in the editor.</p></div></div></div></div></div></section>`,
    id: null,
    title: '3 Column With Headers',
    category: 'Layout',
    icon: `
    <span class="material-symbols-outlined">
    view_week
    </span>
    `,
  },
  {
    html_code: `<section><div class="pbx-pt-4 pbx-pb-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl pbx-text-center"><div class="pbx-break-words"><h2>Layouts and visual.</h2></div></div></div></section>`,
    id: null,
    title: 'Centered Header H2',
    category: 'Text',
    icon: `
    <span class="material-symbols-outlined">
    format_align_center
    </span>
    `,
  },
]

/** Returns helper blocks for the component library, omitting Header H1 when disabled. */
export function getComponentHelpers(
  config?: PageBuilderConfig | null,
): ComponentHelper[] {
  if (isTipTapH1Disabled(config)) {
    return componentHelpers.filter((comp) => comp.title !== 'Header H1')
  }
  return componentHelpers
}

export default componentHelpers
