interface ComponentData {
  title: string
  html_code: string
  cover_image: string | null
  category: string
}

interface Components {
  components: {
    data: ComponentData[]
  }
}

// Generate placeholder image data URL from Single Image SVG
const getPlaceholderImageDataUrl = (): string => {
  const singleImageSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
      <defs>
        <style>
          .bg { fill: #384152; }
          .fg { fill: #718096; }
        </style>
      </defs>
      <rect class="bg" width="200" height="150"/>
      <polygon class="fg" points="65 90.01 90 60.01 115 90.01"/>
      <polygon class="fg" points="110 90.01 122.5 75.01 135 90.01"/>
      <circle class="fg" cx="122.5" cy="64.15" r="4.16"/>
    </svg>
  `

  // Convert SVG to data URL
  const encodedSvg = encodeURIComponent(singleImageSvg.trim())
  return `data:image/svg+xml,${encodedSvg}`
}

const component: Components[] = [
  {
    components: {
      data: [
        {
          title: 'Single Image',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div></div></div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Two Vertical Images',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div>   </div> </div> </div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Two Square Images',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Three Square Images',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Four Square Images',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"> <div><img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> <div><img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> <div><img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> <div><img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> </div> </div> </div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Six Square Images Grid',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2">\n<div class="pbx-mx-auto pbx-max-w-7xl">\n<div class="grid grid-cols-2 md:grid-cols-3 myPrimaryGap">\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n</div>\n</div>\n</div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Two Square Images With Text',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl">\n<div class="myPrimaryGap lg:flex lg:justify-center"><div class="flex-1 py-2">\n<div class="grid myPrimaryGap grid-cols-1 lg:grid-cols-2"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div>   </div> </div>\n\n<div class="flex-1 py-2"> <div class="break-words py-2"><p>Start customizing by editing this default text directly in the editor.</p></div></div> \n</div></div></div>\n</section>`,
          category: 'Images & Text',
          cover_image: null,
        },
        {
          title: 'Three Vertical Images',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Four Square Images With Text',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"><div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div>\n</section>`,
          category: 'Images & Text',
          cover_image: null,
        },
        {
          title: 'Three Square Images With Text',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div>  </div> </div> </div>\n</section>`,
          category: 'Images & Text',
          cover_image: null,
        },

        {
          title: 'Stats Stepped',
          html_code: `<section> <div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="lg:pbx-mx-0"> <div class="pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> </div> <div class="pbx-flex pbx-justify-between lg:pbx-items-center pbx-gap-4 pbx-mt-12 lg:pbx-flex-row pbx-flex-col" > <div class="pbx-text-2xl pbx-font-semibold"><p>250k</p></div> <div class="pbx-text-2xl pbx-font-semibold"><p>$8.9</p></div> <div class="pbx-text-2xl pbx-font-semibold"><p>401k</p></div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Stats With Two Column',
          html_code: `<section> <div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="lg:pbx-mx-0">  <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"><h2>Layouts and visual.</h2></div> <div class="pbx-mt-10 pbx-grid pbx-grid-cols-1 pbx-gap-8 lg:pbx-grid-cols-2"> <div> <div> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> <div class="pbx-mt-8"> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> </div> <div> <div> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> <div class="pbx-mt-8"> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> </div> </div> <div class="pbx-mt-16 pbx-grid pbx-grid-cols-1 pbx-gap-x-8 pbx-gap-y-12 sm:pbx-mt-20 sm:pbx-grid-cols-2 sm:pbx-gap-y-16 lg:pbx-mt-28 lg:pbx-grid-cols-4" > <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6" > <div> <p>Layouts and visual.</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight"> <p>2021</p> </div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6" > <div> <p>Layouts and visual.</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight"> <p>37</p> </div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6" > <div> <p>Layouts and visual.</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight"> <p>12</p> </div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6" > <div> <p>Layouts and visual.</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight"> <p>$25M</p> </div> </div> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Timeline Simple',
          html_code: `<section><div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mx-auto pbx-grid  pbx-grid-cols-1 pbx-gap-8 pbx-overflow-hidden lg:pbx-mx-0  lg:pbx-grid-cols-4"> <div>  <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Layouts and visual.</p></div> <div class="pbx-mt-1  pbx-text-black"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div>  <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Layouts and visual.</p></div> <div class="pbx-mt-1  pbx-text-black"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> </div> <div>  <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Layouts and visual.</p></div> <div class="pbx-mt-1  pbx-text-black"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> </div> <div>  <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"> <p>Layouts and visual.</p> </div> <div class="pbx-mt-1  pbx-text-black"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div></section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Show Single Product',
          html_code: `<section> <div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Products',
          cover_image: null,
        },
        {
          title: 'Show Multiple Products',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div>  </div> </div> </div>\n</section>`,
          category: 'Products',
          cover_image: null,
        },
        {
          title: 'Simple Centered CTA',
          html_code: `<section><div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-mx-auto pbx-text-center"> <div class="pbx-break-words pbx-text-6xl lg:pbx-text-8xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-font-semibold pbx-py-4"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div></div></section>`,
          category: 'Call To Action',
          cover_image: null,
        },
        {
          title: 'Left Simple CTA',
          html_code: `<section> <div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-break-words pbx-text-6xl lg:pbx-text-8xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-font-semibold pbx-py-4"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div></div> </section>`,
          category: 'Call To Action',
          cover_image: null,
        },
        {
          title: 'Image & Left CTA',
          html_code: `<section> <div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-2" > <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="provider" /> <div class="pbx-py-12"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> <div class="pbx-font-semibold pbx-py-4"> <p> <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" >Layouts and visual.</a > </p> </div> </div> </div> </div> </div> </section>`,
          category: 'Call To Action',
          cover_image: null,
        },
      ],
    },
  },
]

export default component
