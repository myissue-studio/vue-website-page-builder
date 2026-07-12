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
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1"> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div></div></div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Two Vertical Images',
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2"> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div>   </div> </div> </div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Two Square Images',
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Three Square Images',
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Four Square Images',
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"> <div><img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> <div><img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> <div><img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> <div><img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> </div> </div> </div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Six Square Images Grid',
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4">\n<div class="pbx-mx-auto pbx-max-w-7xl">\n<div class="grid grid-cols-2 md:grid-cols-3 myPrimaryGap">\n\n<div>\n<img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n</div>\n</div>\n</div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Two Square Images With Text',
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl">\n<div class="myPrimaryGap lg:flex lg:justify-center"><div class="flex-1 py-2">\n<div class="grid myPrimaryGap grid-cols-1 lg:grid-cols-2"> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div>   </div> </div>\n\n<div class="flex-1 py-2"> <div class="break-words py-2"><p>Start customizing by editing this default text directly in the editor.</p></div></div> \n</div></div></div>\n</section>`,
          category: 'Images & Text',
          cover_image: null,
        },
        {
          title: 'Three Vertical Images',
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div>\n</section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Four Square Images With Text',
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"><div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div>\n</section>`,
          category: 'Images & Text',
          cover_image: null,
        },
        {
          title: 'Three Square Images With Text',
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div>  </div> </div> </div>\n</section>`,
          category: 'Images & Text',
          cover_image: null,
        },

        {
          title: 'Stats Stepped',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="lg:pbx-mx-0"> <div class="pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> </div> <div class="pbx-flex pbx-justify-between lg:pbx-items-center pbx-gap-4 pbx-mt-12 lg:pbx-flex-row pbx-flex-col" > <div class="pbx-text-2xl pbx-font-semibold"><p>250k</p></div> <div class="pbx-text-2xl pbx-font-semibold"><p>$8.9</p></div> <div class="pbx-text-2xl pbx-font-semibold"><p>401k</p></div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Stats With Two Column',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="lg:pbx-mx-0">  <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"><h2>Layouts and visual.</h2></div> <div class="pbx-mt-10 pbx-grid pbx-grid-cols-1 pbx-gap-8 lg:pbx-grid-cols-2"> <div> <div> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> <div class="pbx-mt-8"> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> </div> <div> <div> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> <div class="pbx-mt-8"> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> </div> </div> <div class="pbx-mt-16 pbx-grid pbx-grid-cols-1 pbx-gap-x-8 pbx-gap-y-12 sm:pbx-grid-cols-2 lg:pbx-grid-cols-4" > <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6" > <div> <p>Layouts and visual.</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight"> <p>2021</p> </div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6" > <div> <p>Layouts and visual.</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight"> <p>37</p> </div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6" > <div> <p>Layouts and visual.</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight"> <p>12</p> </div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6" > <div> <p>Layouts and visual.</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight"> <p>$25M</p> </div> </div> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Timeline Simple',
          html_code: `<section><div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mx-auto pbx-grid  pbx-grid-cols-1 pbx-gap-8 pbx-overflow-hidden lg:pbx-mx-0  lg:pbx-grid-cols-4"> <div>  <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Layouts and visual.</p></div> <div class="pbx-mt-1  pbx-text-black"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div>  <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Layouts and visual.</p></div> <div class="pbx-mt-1  pbx-text-black"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> </div> <div>  <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Layouts and visual.</p></div> <div class="pbx-mt-1  pbx-text-black"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> </div> <div>  <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"> <p>Layouts and visual.</p> </div> <div class="pbx-mt-1  pbx-text-black"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div></section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Show Single Product',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Products',
          cover_image: null,
        },
        {
          title: 'Show Multiple Products',
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-center aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div>  </div> </div> </div>\n</section>`,
          category: 'Products',
          cover_image: null,
        },
        {
          title: 'Simple Centered CTA',
          html_code: `<section><div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-mx-auto pbx-text-center"> <div class="pbx-break-words pbx-text-6xl lg:pbx-text-8xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-font-semibold pbx-py-4"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div></div></section>`,
          category: 'Call To Action',
          cover_image: null,
        },
        {
          title: 'Left Simple CTA',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-break-words pbx-text-6xl lg:pbx-text-8xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-font-semibold pbx-py-4"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div></div> </section>`,
          category: 'Call To Action',
          cover_image: null,
        },
        {
          title: 'Image & Left CTA',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-2" > <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="provider" /> <div class="pbx-py-12"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> <div class="pbx-font-semibold pbx-py-4"> <p> <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" >Layouts and visual.</a > </p> </div> </div> </div> </div> </div> </section>`,
          category: 'Call To Action',
          cover_image: null,
        },
        {
          title: 'Cards Slider',
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 lg:pbx-grid-cols-3"><div><img src="${getPlaceholderImageDataUrl()}" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:0.5rem;display:block" alt="Card 1"><div style="padding:1rem 0"><h3>Card Title</h3><p>Start customizing by editing this default text directly in the editor.</p></div></div><div><img src="${getPlaceholderImageDataUrl()}" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:0.5rem;display:block" alt="Card 2"><div style="padding:1rem 0"><h3>Card Title</h3><p>Start customizing by editing this default text directly in the editor.</p></div></div><div><img src="${getPlaceholderImageDataUrl()}" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:0.5rem;display:block" alt="Card 3"><div style="padding:1rem 0"><h3>Card Title</h3><p>Start customizing by editing this default text directly in the editor.</p></div></div></div></div></div>\n</section>`,
          category: 'Cards',
          cover_image: null,
        },
        {
          title: 'Testimonials Slider',
          html_code: `<section>\n<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 lg:pbx-grid-cols-3"><div class="pbx-bg-gray-50 pbx-rounded-xl pbx-p-8"><div class="pbx-mb-4"><p>"Start customizing by editing this testimonial text directly in the editor. This is a great product."</p></div><div style="display:flex;align-items:center;gap:0.75rem"><img src="${getPlaceholderImageDataUrl()}" class="pbx-block pbx-inset-0 pbx-object-center pbx-d pbx-min-d pbx-max-d lg:pbx-w-10 lg:pbx-h-10 lg:pbx-min-w-10 lg:pbx-max-w-10 pbx-w-10 pbx-h-10 pbx-min-w-10 pbx-max-w-10 pbx-object-cover pbx-rounded-full" alt="Avatar"><div><p>Full Name</p><p>Job Title</p></div></div></div><div class="pbx-bg-gray-50 pbx-rounded-xl pbx-p-8"><div class="pbx-mb-4"><p>"Start customizing by editing this testimonial text directly in the editor. Highly recommended."</p></div><div style="display:flex;align-items:center;gap:0.75rem"><img src="${getPlaceholderImageDataUrl()}" class="pbx-block pbx-inset-0 pbx-object-center pbx-d pbx-min-d pbx-max-d lg:pbx-w-10 lg:pbx-h-10 lg:pbx-min-w-10 lg:pbx-max-w-10 pbx-w-10 pbx-h-10 pbx-min-w-10 pbx-max-w-10 pbx-object-cover pbx-rounded-full" alt="Avatar"><div><p>Full Name</p><p>Job Title</p></div></div></div><div class="pbx-bg-gray-50 pbx-rounded-xl pbx-p-8"><div class="pbx-mb-4"><p>"Start customizing by editing this testimonial text directly in the editor. Excellent experience overall."</p></div><div style="display:flex;align-items:center;gap:0.75rem"><img src="${getPlaceholderImageDataUrl()}" class="pbx-block pbx-inset-0 pbx-object-center pbx-d pbx-min-d pbx-max-d lg:pbx-w-10 lg:pbx-h-10 lg:pbx-min-w-10 lg:pbx-max-w-10 pbx-w-10 pbx-h-10 pbx-min-w-10 pbx-max-w-10 pbx-object-cover pbx-rounded-full" alt="Avatar"><div><p>Full Name</p><p>Job Title</p></div></div></div></div></div></div>\n</section>`,
          category: 'Cards',
          cover_image: null,
        },
        {
          title: 'Image Slider',
          html_code: `<section><style>.pbx-isl-t{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none}.pbx-isl-t::-webkit-scrollbar{display:none}.pbx-isl-dot{display:inline-block;width:0.5rem;height:0.5rem;border-radius:50%;background:rgba(255,255,255,0.55);cursor:pointer}.pbx-isl-nums{display:none;gap:0.75rem;margin-bottom:0.625rem}.pbx-isl-nums span{font-size:1rem;font-weight:700;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,0.7);cursor:pointer;min-width:1.5rem;text-align:center;background:rgba(255,255,255,0.25);border-radius:9999px;padding:0.1rem 0.55rem;opacity:0.55;display:inline-block;box-sizing:border-box}[data-pagebuilder-content] .pbx-isl-nums{display:flex}[data-pagebuilder-content] .pbx-isl-nums span{opacity:0.4;transition:all 0.2s}[data-isl-active="0"] .pbx-isl-nums span:nth-child(1),[data-isl-active="1"] .pbx-isl-nums span:nth-child(2),[data-isl-active="2"] .pbx-isl-nums span:nth-child(3){opacity:1;background:rgba(255,255,255,0.9);color:#111;border-radius:9999px;padding:0.1rem 0.55rem;text-shadow:none}@keyframes pbx-isl-r{0%,30.333%{transform:translateX(0)}33.333%,63.667%{transform:translateX(-33.333%)}66.667%,96.999%{transform:translateX(-66.667%)}99%,100%{transform:translateX(0)}}[data-isl][data-isl-auto] .pbx-isl-t{overflow:hidden!important;scroll-snap-type:none!important;width:300%!important;animation:pbx-isl-r 9s infinite;pointer-events:none}[data-isl][data-isl-auto] .pbx-isl-t>div{min-width:33.333%!important}@keyframes pbx-isl-da-0{0%,30.333%{background:rgba(255,255,255,1)}33.333%,100%{background:rgba(255,255,255,0.55)}}@keyframes pbx-isl-da-1{0%,33.332%{background:rgba(255,255,255,0.55)}33.333%,63.667%{background:rgba(255,255,255,1)}66.667%,100%{background:rgba(255,255,255,0.55)}}@keyframes pbx-isl-da-2{0%,66.666%{background:rgba(255,255,255,0.55)}66.667%,96.999%{background:rgba(255,255,255,1)}100%{background:rgba(255,255,255,0.55)}}[data-isl][data-isl-auto] .pbx-isl-dot:nth-child(1){animation:pbx-isl-da-0 9s infinite}[data-isl][data-isl-auto] .pbx-isl-dot:nth-child(2){animation:pbx-isl-da-1 9s infinite}[data-isl][data-isl-auto] .pbx-isl-dot:nth-child(3){animation:pbx-isl-da-2 9s infinite}@keyframes pbx-isl-na-0{0%,30.333%{opacity:1;background:rgba(255,255,255,0.9)}33.333%,100%{opacity:0.55;background:rgba(255,255,255,0.25)}}@keyframes pbx-isl-na-1{0%,33.332%{opacity:0.55;background:rgba(255,255,255,0.25)}33.333%,63.667%{opacity:1;background:rgba(255,255,255,0.9)}66.667%,100%{opacity:0.55;background:rgba(255,255,255,0.25)}}@keyframes pbx-isl-na-2{0%,66.666%{opacity:0.55;background:rgba(255,255,255,0.25)}66.667%,96.999%{opacity:1;background:rgba(255,255,255,0.9)}100%{opacity:0.55;background:rgba(255,255,255,0.25)}}[data-isl][data-isl-auto] .pbx-isl-nums span:nth-child(1){animation:pbx-isl-na-0 9s infinite}[data-isl][data-isl-auto] .pbx-isl-nums span:nth-child(2){animation:pbx-isl-na-1 9s infinite}[data-isl][data-isl-auto] .pbx-isl-nums span:nth-child(3){animation:pbx-isl-na-2 9s infinite}</style>\n<div class="pbx-py-8 pbx-px-4"><div class="pbx-mx-auto pbx-max-w-7xl"><div data-pb-no-select style="position:relative;border-radius:0.5rem;overflow:hidden" data-isl data-isl-speed="3"><div class="pbx-isl-t"><div style="min-width:100%;scroll-snap-align:start"><img src="${getPlaceholderImageDataUrl()}" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block" alt="Slide 1"></div><div style="min-width:100%;scroll-snap-align:start"><img src="${getPlaceholderImageDataUrl()}" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block" alt="Slide 2"></div><div style="min-width:100%;scroll-snap-align:start"><img src="${getPlaceholderImageDataUrl()}" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block" alt="Slide 3"></div></div><div data-pb-no-select style="position:absolute;bottom:0.75rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:0.35rem;z-index:10"><div class="pbx-isl-nums"><span style="opacity:1;background:rgba(255,255,255,0.9);color:#111;border-radius:9999px;padding:0.1rem 0.55rem;text-shadow:none" onclick="(function(d,e){e.stopPropagation();var c=d.closest('[data-isl]');var t=c.querySelector('.pbx-isl-t');var ns=c.querySelectorAll('.pbx-isl-nums span');ns.forEach(function(s,i){s.style.opacity=i===0?'1':'0.55';s.style.background=i===0?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.25)';s.style.borderRadius='9999px';s.style.padding='0.1rem 0.55rem';s.style.color=i===0?'#111':'#fff';s.style.textShadow=i===0?'none':'0 1px 4px rgba(0,0,0,0.7)';});var ds=c.querySelectorAll('.pbx-isl-dot');ds.forEach(function(dot,i){dot.style.background=i===0?'rgba(255,255,255,1)':'rgba(255,255,255,0.55)';});t.scrollTo({left:t.children[0].offsetLeft,behavior:'smooth'});var img=t.children[0].querySelector('img');if(img)img.click()})(this,event)">1</span><span onclick="(function(d,e){e.stopPropagation();var c=d.closest('[data-isl]');var t=c.querySelector('.pbx-isl-t');var ns=c.querySelectorAll('.pbx-isl-nums span');ns.forEach(function(s,i){s.style.opacity=i===1?'1':'0.55';s.style.background=i===1?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.25)';s.style.borderRadius='9999px';s.style.padding='0.1rem 0.55rem';s.style.color=i===1?'#111':'#fff';s.style.textShadow=i===1?'none':'0 1px 4px rgba(0,0,0,0.7)';});var ds=c.querySelectorAll('.pbx-isl-dot');ds.forEach(function(dot,i){dot.style.background=i===1?'rgba(255,255,255,1)':'rgba(255,255,255,0.55)';});t.scrollTo({left:t.children[1].offsetLeft,behavior:'smooth'});var img=t.children[1].querySelector('img');if(img)img.click()})(this,event)">2</span><span onclick="(function(d,e){e.stopPropagation();var c=d.closest('[data-isl]');var t=c.querySelector('.pbx-isl-t');var ns=c.querySelectorAll('.pbx-isl-nums span');ns.forEach(function(s,i){s.style.opacity=i===2?'1':'0.55';s.style.background=i===2?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.25)';s.style.borderRadius='9999px';s.style.padding='0.1rem 0.55rem';s.style.color=i===2?'#111':'#fff';s.style.textShadow=i===2?'none':'0 1px 4px rgba(0,0,0,0.7)';});var ds=c.querySelectorAll('.pbx-isl-dot');ds.forEach(function(dot,i){dot.style.background=i===2?'rgba(255,255,255,1)':'rgba(255,255,255,0.55)';});t.scrollTo({left:t.children[2].offsetLeft,behavior:'smooth'});var img=t.children[2].querySelector('img');if(img)img.click()})(this,event)">3</span></div><div style="display:flex;gap:0.6rem;padding:8px 10px;border-radius:10px;background:rgba(128,128,128,0.08);"><span class="pbx-isl-dot" style="background:rgba(255,255,255,1)" onclick="(function(d,e){e.stopPropagation();var c=d.closest('[data-isl]');var t=c.querySelector('.pbx-isl-t');var ns=c.querySelectorAll('.pbx-isl-nums span');ns.forEach(function(s,i){s.style.opacity=i===0?'1':'0.55';s.style.background=i===0?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.25)';s.style.borderRadius='9999px';s.style.padding='0.1rem 0.55rem';s.style.color=i===0?'#111':'#fff';s.style.textShadow=i===0?'none':'0 1px 4px rgba(0,0,0,0.7)';});var ds=c.querySelectorAll('.pbx-isl-dot');ds.forEach(function(dot,i){dot.style.background=i===0?'rgba(255,255,255,1)':'rgba(255,255,255,0.55)';});t.scrollTo({left:t.children[0].offsetLeft,behavior:'smooth'});var img=t.children[0].querySelector('img');if(img)img.click()})(this,event)"></span><span class="pbx-isl-dot" onclick="(function(d,e){e.stopPropagation();var c=d.closest('[data-isl]');var t=c.querySelector('.pbx-isl-t');var ns=c.querySelectorAll('.pbx-isl-nums span');ns.forEach(function(s,i){s.style.opacity=i===1?'1':'0.55';s.style.background=i===1?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.25)';s.style.borderRadius='9999px';s.style.padding='0.1rem 0.55rem';s.style.color=i===1?'#111':'#fff';s.style.textShadow=i===1?'none':'0 1px 4px rgba(0,0,0,0.7)';});var ds=c.querySelectorAll('.pbx-isl-dot');ds.forEach(function(dot,i){dot.style.background=i===1?'rgba(255,255,255,1)':'rgba(255,255,255,0.55)';});t.scrollTo({left:t.children[1].offsetLeft,behavior:'smooth'});var img=t.children[1].querySelector('img');if(img)img.click()})(this,event)"></span><span class="pbx-isl-dot" onclick="(function(d,e){e.stopPropagation();var c=d.closest('[data-isl]');var t=c.querySelector('.pbx-isl-t');var ns=c.querySelectorAll('.pbx-isl-nums span');ns.forEach(function(s,i){s.style.opacity=i===2?'1':'0.55';s.style.background=i===2?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.25)';s.style.borderRadius='9999px';s.style.padding='0.1rem 0.55rem';s.style.color=i===2?'#111':'#fff';s.style.textShadow=i===2?'none':'0 1px 4px rgba(0,0,0,0.7)';});var ds=c.querySelectorAll('.pbx-isl-dot');ds.forEach(function(dot,i){dot.style.background=i===2?'rgba(255,255,255,1)':'rgba(255,255,255,0.55)';});t.scrollTo({left:t.children[2].offsetLeft,behavior:'smooth'});var img=t.children[2].querySelector('img');if(img)img.click()})(this,event)"></span></div></div></div></div></div>\n</section>`,
          category: 'Sliders',
          cover_image: null,
        },

        // ── Hero ─────────────────────────────────────────────────────────────
        {
          title: 'Hero Centered',
          html_code: `<section> <div class="pbx-py-16 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-4xl pbx-text-center"> <div class="pbx-break-words pbx-text-5xl lg:pbx-text-7xl pbx-font-bold pbx-tracking-tight"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-mt-8 pbx-text-lg lg:pbx-text-xl pbx-text-gray-600"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-mt-10 pbx-font-semibold pbx-py-4"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Get started today</a></p> </div> </div> </div> </section>`,
          category: 'Hero',
          cover_image: null,
        },
        {
          title: 'Hero With Image',
          html_code: `<section> <div class="pbx-py-12 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-2 pbx-items-center"> <div> <div class="pbx-break-words pbx-text-4xl lg:pbx-text-6xl pbx-font-bold pbx-tracking-tight"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-mt-6 pbx-text-lg pbx-text-gray-600"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-mt-8 pbx-font-semibold pbx-py-4"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Get started today</a></p> </div> </div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="hero image" /> </div> </div> </div> </section>`,
          category: 'Hero',
          cover_image: null,
        },

        // ── Features ─────────────────────────────────────────────────────────
        {
          title: 'Features Three Column',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-text-center pbx-mb-12"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>Layouts and visual.</h2> </div> <div class="pbx-mt-4 pbx-text-gray-600"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 lg:pbx-grid-cols-3"> <div class="pbx-p-8 pbx-bg-gray-50 pbx-rounded-2xl"> <div class="pbx-text-3xl pbx-font-bold pbx-mb-4"><p>01</p></div> <div class="pbx-font-semibold pbx-text-lg pbx-mb-3"><p>Layouts and visual.</p></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-p-8 pbx-bg-gray-50 pbx-rounded-2xl"> <div class="pbx-text-3xl pbx-font-bold pbx-mb-4"><p>02</p></div> <div class="pbx-font-semibold pbx-text-lg pbx-mb-3"><p>Layouts and visual.</p></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-p-8 pbx-bg-gray-50 pbx-rounded-2xl"> <div class="pbx-text-3xl pbx-font-bold pbx-mb-4"><p>03</p></div> <div class="pbx-font-semibold pbx-text-lg pbx-mb-3"><p>Layouts and visual.</p></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Features',
          cover_image: null,
        },

        // ── Marketing ─────────────────────────────────────────────────────────
        {
          title: 'How It Works',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-text-center pbx-mb-12"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>Layouts and visual.</h2> </div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-4 lg:pbx-grid-cols-4"> <div class="pbx-text-center"> <div class="pbx-w-12 pbx-h-12 pbx-rounded-full pbx-bg-gray-900 pbx-text-white pbx-flex pbx-items-center pbx-justify-center pbx-text-xl pbx-font-bold pbx-mx-auto pbx-mb-4"><p>1</p></div> <div class="pbx-font-semibold pbx-mb-2"><p>Layouts and visual.</p></div> <div class="pbx-text-gray-600 pbx-text-sm"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-text-center"> <div class="pbx-w-12 pbx-h-12 pbx-rounded-full pbx-bg-gray-900 pbx-text-white pbx-flex pbx-items-center pbx-justify-center pbx-text-xl pbx-font-bold pbx-mx-auto pbx-mb-4"><p>2</p></div> <div class="pbx-font-semibold pbx-mb-2"><p>Layouts and visual.</p></div> <div class="pbx-text-gray-600 pbx-text-sm"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-text-center"> <div class="pbx-w-12 pbx-h-12 pbx-rounded-full pbx-bg-gray-900 pbx-text-white pbx-flex pbx-items-center pbx-justify-center pbx-text-xl pbx-font-bold pbx-mx-auto pbx-mb-4"><p>3</p></div> <div class="pbx-font-semibold pbx-mb-2"><p>Layouts and visual.</p></div> <div class="pbx-text-gray-600 pbx-text-sm"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-text-center"> <div class="pbx-w-12 pbx-h-12 pbx-rounded-full pbx-bg-gray-900 pbx-text-white pbx-flex pbx-items-center pbx-justify-center pbx-text-xl pbx-font-bold pbx-mx-auto pbx-mb-4"><p>4</p></div> <div class="pbx-font-semibold pbx-mb-2"><p>Layouts and visual.</p></div> <div class="pbx-text-gray-600 pbx-text-sm"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Logo Bar',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-text-center pbx-mb-8 pbx-text-gray-400 pbx-text-sm pbx-font-medium pbx-tracking-widest pbx-uppercase"> <p>Layouts and visual.</p> </div> <div class="pbx-grid pbx-grid-cols-3 sm:pbx-grid-cols-6 lg:pbx-grid-cols-6 pbx-gap-8 pbx-items-center"> <div class="pbx-flex pbx-items-center pbx-justify-center"><img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="partner logo" /></div> <div class="pbx-flex pbx-items-center pbx-justify-center"><img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="partner logo" /></div> <div class="pbx-flex pbx-items-center pbx-justify-center"><img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="partner logo" /></div> <div class="pbx-flex pbx-items-center pbx-justify-center"><img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="partner logo" /></div> <div class="pbx-flex pbx-items-center pbx-justify-center"><img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="partner logo" /></div> <div class="pbx-flex pbx-items-center pbx-justify-center"><img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="partner logo" /></div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Large Quote',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-4xl pbx-text-center"> <div class="pbx-text-5xl pbx-text-gray-300 pbx-font-bold pbx-mb-4"><p>"</p></div> <div class="pbx-break-words pbx-text-xl lg:pbx-text-3xl pbx-font-medium pbx-italic pbx-text-gray-800"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-mt-10 pbx-flex pbx-items-center pbx-justify-center pbx-gap-4"> <img class="pbx-object-cover pbx-w-12 pbx-h-12 pbx-object-center pbx-rounded-full" src="${getPlaceholderImageDataUrl()}" alt="testimonial author" /> <div class="pbx-text-left"> <div class="pbx-font-semibold"><p>Full Name</p></div> <div class="pbx-text-gray-500 pbx-text-sm"><p>Job Title</p></div> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },

        // ── Pricing ───────────────────────────────────────────────────────────
        {
          title: 'Pricing Three Tiers',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-text-center pbx-mb-12"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>Layouts and visual.</h2> </div> <div class="pbx-mt-4 pbx-text-gray-600"> <p>Start customizing by editing this default text directly in the editor.</p> </div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 lg:pbx-grid-cols-3"> <div class="pbx-p-8 pbx-border pbx-border-gray-200 pbx-rounded-2xl"> <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><p>Starter</p></div> <div class="pbx-text-4xl pbx-font-bold pbx-mb-3"><p>$9</p></div> <div class="pbx-text-base pbx-font-normal pbx-text-gray-500 pbx-mb-6"><p>/ mo</p></div> <div class="pbx-space-y-2 pbx-mb-8 pbx-text-sm pbx-text-gray-600"> <p>Layouts and visual.</p> <p>Start customizing by editing this default text directly in the editor.</p> <p>Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Get started</a></p></div> </div> <div class="pbx-p-8 pbx-border-2 pbx-border-gray-900 pbx-rounded-2xl"> <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><p>Pro</p></div> <div class="pbx-text-4xl pbx-font-bold pbx-mb-3"><p>$29</p></div> <div class="pbx-text-base pbx-font-normal pbx-text-gray-500 pbx-mb-6"><p>/ mo</p></div> <div class="pbx-space-y-2 pbx-mb-8 pbx-text-sm pbx-text-gray-600"> <p>Layouts and visual.</p> <p>Start customizing by editing this default text directly in the editor.</p> <p>Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Get started</a></p></div> </div> <div class="pbx-p-8 pbx-border pbx-border-gray-200 pbx-rounded-2xl"> <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><p>Enterprise</p></div> <div class="pbx-text-4xl pbx-font-bold pbx-mb-3"><p>$99</p></div> <div class="pbx-text-base pbx-font-normal pbx-text-gray-500 pbx-mb-6"><p>/ mo</p></div> <div class="pbx-space-y-2 pbx-mb-8 pbx-text-sm pbx-text-gray-600"> <p>Layouts and visual.</p> <p>Start customizing by editing this default text directly in the editor.</p> <p>Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Contact us</a></p></div> </div> </div> </div> </div> </section>`,
          category: 'Pricing',
          cover_image: null,
        },

        // ── Team ──────────────────────────────────────────────────────────────
        {
          title: 'Team Members',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-text-center pbx-mb-12"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>Layouts and visual.</h2> </div> <div class="pbx-mt-4 pbx-text-gray-600"> <p>Start customizing by editing this default text directly in the editor.</p> </div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-4"> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-xl" src="${getPlaceholderImageDataUrl()}" alt="team member" /> <div class="pbx-mt-4 pbx-font-semibold"><p>Full Name</p></div> <div class="pbx-text-gray-500 pbx-text-sm"><p>Job Title</p></div> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-xl" src="${getPlaceholderImageDataUrl()}" alt="team member" /> <div class="pbx-mt-4 pbx-font-semibold"><p>Full Name</p></div> <div class="pbx-text-gray-500 pbx-text-sm"><p>Job Title</p></div> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-xl" src="${getPlaceholderImageDataUrl()}" alt="team member" /> <div class="pbx-mt-4 pbx-font-semibold"><p>Full Name</p></div> <div class="pbx-text-gray-500 pbx-text-sm"><p>Job Title</p></div> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-xl" src="${getPlaceholderImageDataUrl()}" alt="team member" /> <div class="pbx-mt-4 pbx-font-semibold"><p>Full Name</p></div> <div class="pbx-text-gray-500 pbx-text-sm"><p>Job Title</p></div> </div> </div> </div> </div> </section>`,
          category: 'Team',
          cover_image: null,
        },

        // ── FAQ ───────────────────────────────────────────────────────────────
        {
          title: 'FAQ',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-3xl"> <div class="pbx-text-center pbx-mb-12"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>Frequently asked questions</h2> </div> </div> <div> <div class="pbx-border-b pbx-border-gray-200 pbx-pb-6 pbx-mb-6"> <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><p>Layouts and visual?</p></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-border-b pbx-border-gray-200 pbx-pb-6 pbx-mb-6"> <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><p>Layouts and visual?</p></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-border-b pbx-border-gray-200 pbx-pb-6 pbx-mb-6"> <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><p>Layouts and visual?</p></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-border-b pbx-border-gray-200 pbx-pb-6 pbx-mb-6"> <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><p>Layouts and visual?</p></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-pb-6"> <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><p>Layouts and visual?</p></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'FAQ',
          cover_image: null,
        },

        // ── Call To Action ────────────────────────────────────────────────────
        {
          title: 'Newsletter CTA',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-bg-gray-900 pbx-rounded-2xl pbx-py-16 pbx-px-8 pbx-text-center"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium pbx-text-white"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-mt-6 pbx-text-gray-300"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-mt-10 pbx-font-semibold pbx-py-4 pbx-text-white"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Subscribe now</a></p> </div> </div> </div> </div> </section>`,
          category: 'Call To Action',
          cover_image: null,
        },

        // ── Design-forward components ─────────────────────────────────────
        {
          title: 'Hero Dark',
          html_code: `<section class="pbx-bg-black pbx-text-white"> <div class="pbx-py-32 pbx-px-6"> <div class="pbx-mx-auto pbx-max-w-5xl pbx-text-center"> <div class="pbx-break-words pbx-text-5xl lg:pbx-text-8xl pbx-font-bold pbx-tracking-tight pbx-leading-none pbx-mb-8"> <h1>The future is here.</h1> </div> <div class="pbx-text-gray-400 pbx-text-xl lg:pbx-text-2xl pbx-mb-14 pbx-max-w-2xl pbx-mx-auto"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-flex pbx-flex-col sm:pbx-flex-row pbx-gap-4 pbx-justify-center"> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-white pbx-text-black pbx-font-semibold pbx-px-8 pbx-py-4 pbx-rounded-full pbx-inline-block" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p> </div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-border pbx-border-white pbx-text-white pbx-font-semibold pbx-px-8 pbx-py-4 pbx-rounded-full pbx-inline-block" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p> </div> </div> </div> </div> </section>`,
          category: 'Hero',
          cover_image: null,
        },
        {
          title: 'Feature Spotlight',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-text-white pbx-overflow-hidden"> <div class="pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2"> <div class="pbx-p-12 lg:pbx-p-16 pbx-flex pbx-flex-col pbx-justify-center pbx-rounded-bl-3xl pbx-rounded-tl-3xl pbx-bg-gray-900"> <div class="pbx-text-blue-400 pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-mb-6"> <p>Layouts and visual.</p> </div> <div class="pbx-break-words pbx-text-4xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-leading-tight pbx-mb-6"> <h2>Extraordinary performance.</h2> </div> <div class="pbx-text-gray-400 pbx-text-lg pbx-mb-10"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-text-blue-400 pbx-font-semibold pbx-py-2"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p> </div> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-h-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="feature" /> </div> </div> </div> </div> </div> </section>`,
          category: 'Features',
          cover_image: null,
        },
        {
          title: 'Dark Stats',
          html_code: `<section class="pbx-bg-black pbx-text-white"> <div class="pbx-py-28 pbx-px-6"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-text-center pbx-mb-20"> <div class="pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight"> <h2>Layouts and visual.</h2> </div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 lg:pbx-grid-cols-3 pbx-text-center pbx-divide-x pbx-divide-gray-800"> <div class="pbx-px-8"> <div class="pbx-text-6xl lg:pbx-text-8xl pbx-font-bold pbx-text-blue-400 pbx-tracking-tight pbx-leading-none pbx-mb-4"><p>250k</p></div> <div class="pbx-text-gray-400 pbx-text-lg"><p>Layouts and visual.</p></div> </div> <div class="pbx-px-8"> <div class="pbx-text-6xl lg:pbx-text-8xl pbx-font-bold pbx-text-blue-400 pbx-tracking-tight pbx-leading-none pbx-mb-4"><p>$8.9M</p></div> <div class="pbx-text-gray-400 pbx-text-lg"><p>Layouts and visual.</p></div> </div> <div class="pbx-px-8"> <div class="pbx-text-6xl lg:pbx-text-8xl pbx-font-bold pbx-text-blue-400 pbx-tracking-tight pbx-leading-none pbx-mb-4"><p>401k</p></div> <div class="pbx-text-gray-400 pbx-text-lg"><p>Layouts and visual.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Editorial Banner',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-bg-gray-900 pbx-text-white pbx-rounded-3xl pbx-py-24 pbx-px-8 pbx-px-20 pbx-text-center"> <div class="pbx-text-blue-400 pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-mb-8"> <p>Layouts and visual.</p> </div> <div class="pbx-break-words pbx-text-4xl lg:pbx-text-7xl pbx-font-bold pbx-tracking-tight pbx-leading-tight pbx-mb-8 pbx-max-w-4xl pbx-mx-auto"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-text-gray-400 pbx-text-xl pbx-max-w-2xl pbx-mx-auto pbx-mb-12"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"> <p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-blue-600 pbx-text-white pbx-font-semibold pbx-px-8 pbx-py-4 pbx-rounded-full pbx-inline-block" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Large Testimonial',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-4xl pbx-text-center"> <div class="pbx-text-8xl pbx-font-serif pbx-text-gray-200 pbx-leading-none pbx-mb-2"> <p>"</p> </div> <div class="pbx-text-2xl lg:pbx-text-3xl pbx-font-medium pbx-italic pbx-leading-snug pbx-text-gray-900 pbx-mb-12"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-flex pbx-items-center pbx-justify-center pbx-gap-4"> <img class="pbx-object-cover pbx-w-14 pbx-h-14 pbx-min-w-14 pbx-object-center pbx-rounded-full" src="${getPlaceholderImageDataUrl()}" alt="author" /> <div class="pbx-text-left"> <div class="pbx-font-semibold pbx-text-gray-900"><p>Full Name</p></div> <div class="pbx-text-gray-500 pbx-text-sm"><p>Job Title, Company</p></div> </div> </div> </div> </div> </section>`,
          category: 'Cards',
          cover_image: null,
        },
        {
          title: 'Feature Cards Grid',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-text-center pbx-mb-16"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"> <h2>Layouts and visual.</h2> </div> <div class="pbx-text-gray-500 pbx-text-xl pbx-max-w-2xl pbx-mx-auto"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-4"> <div class="pbx-bg-gray-50 pbx-rounded-3xl pbx-p-8"> <div class="pbx-w-10 pbx-h-10 pbx-rounded-xl pbx-bg-blue-100 pbx-mb-6"></div> <div class="pbx-font-semibold pbx-text-lg pbx-mb-3"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-text-sm pbx-leading-relaxed"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-bg-gray-50 pbx-rounded-3xl pbx-p-8"> <div class="pbx-w-10 pbx-h-10 pbx-rounded-xl pbx-bg-indigo-100 pbx-mb-6"></div> <div class="pbx-font-semibold pbx-text-lg pbx-mb-3"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-text-sm pbx-leading-relaxed"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-bg-gray-50 pbx-rounded-3xl pbx-p-8"> <div class="pbx-w-10 pbx-h-10 pbx-rounded-xl pbx-bg-emerald-100 pbx-mb-6"></div> <div class="pbx-font-semibold pbx-text-lg pbx-mb-3"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-text-sm pbx-leading-relaxed"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-bg-gray-50 pbx-rounded-3xl pbx-p-8"> <div class="pbx-w-10 pbx-h-10 pbx-rounded-xl pbx-bg-rose-100 pbx-mb-6"></div> <div class="pbx-font-semibold pbx-text-lg pbx-mb-3"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-text-sm pbx-leading-relaxed"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Features',
          cover_image: null,
        },

        {
          title: 'Profile Card',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-3xl"> <div class="pbx-bg-gray-50 pbx-rounded-3xl pbx-p-10 lg:pbx-p-14"> <div class="pbx-flex pbx-flex-col sm:pbx-flex-row pbx-gap-8 pbx-items-start"> <img class="pbx-object-cover pbx-w-28 pbx-h-28 pbx-min-w-28 pbx-object-center pbx-rounded-2xl" src="${getPlaceholderImageDataUrl()}" alt="profile" /> <div> <div class="pbx-text-2xl pbx-font-bold pbx-mb-1"><p>Full Name</p></div> <div class="pbx-text-gray-500 pbx-mb-6"><p>Job Title · Company Name</p></div> <div class="pbx-text-gray-700 pbx-text-lg pbx-leading-relaxed pbx-mb-6"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-font-semibold pbx-py-2"> <p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p> </div> </div> </div> </div> </div> </div> </section>`,
          category: 'Team',
          cover_image: null,
        },
        {
          title: 'Contact Minimal',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-5xl"> <div class="pbx-border-t pbx-border-gray-200 pbx-pt-16"> <div class="pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-myPrimaryGap"> <div> <div class="pbx-break-words pbx-text-4xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-6"> <h2>Let's talk.</h2> </div> <div class="pbx-text-gray-600 pbx-text-lg pbx-leading-relaxed"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-10"> <div> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-2"><p>Email</p></div> <div class="pbx-text-xl pbx-font-medium"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">hello@example.com</a></p></div> </div> <div> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-2"><p>Phone</p></div> <div class="pbx-text-xl pbx-font-medium"><p>+1 (555) 000-0000</p></div> </div> <div> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-2"><p>Address</p></div> <div class="pbx-text-xl pbx-font-medium"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </div> </div> </section>`,
          category: 'Contact',
          cover_image: null,
        },
        {
          title: 'Editorial List',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-5xl"> <div class="pbx-break-words pbx-text-5xl lg:pbx-text-7xl pbx-font-bold pbx-tracking-tight pbx-mb-16"> <h2>Layouts and visual.</h2> </div> <div class="pbx-divide-y pbx-divide-gray-100"> <div class="pbx-grid pbx-grid-cols-12 pbx-gap-6 pbx-py-8 pbx-items-start"> <div class="pbx-col-span-1 pbx-text-sm pbx-font-semibold pbx-text-gray-400"><p>01</p></div> <div class="pbx-col-span-5 pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> <div class="pbx-col-span-6 pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-grid pbx-grid-cols-12 pbx-gap-6 pbx-py-8 pbx-items-start"> <div class="pbx-col-span-1 pbx-text-sm pbx-font-semibold pbx-text-gray-400"><p>02</p></div> <div class="pbx-col-span-5 pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> <div class="pbx-col-span-6 pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-grid pbx-grid-cols-12 pbx-gap-6 pbx-py-8 pbx-items-start"> <div class="pbx-col-span-1 pbx-text-sm pbx-font-semibold pbx-text-gray-400"><p>03</p></div> <div class="pbx-col-span-5 pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> <div class="pbx-col-span-6 pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-grid pbx-grid-cols-12 pbx-gap-6 pbx-py-8 pbx-items-start"> <div class="pbx-col-span-1 pbx-text-sm pbx-font-semibold pbx-text-gray-400"><p>04</p></div> <div class="pbx-col-span-5 pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> <div class="pbx-col-span-6 pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Features',
          cover_image: null,
        },

        {
          title: 'Blog Cards',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mb-12"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg pbx-max-w-2xl"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-3"> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[16/10] pbx-rounded-2xl" src="${getPlaceholderImageDataUrl()}" alt="article"> <div class="pbx-pt-5"> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-2"><p>Article</p></div> <div class="pbx-font-semibold pbx-text-xl pbx-mb-2"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[16/10] pbx-rounded-2xl" src="${getPlaceholderImageDataUrl()}" alt="article"> <div class="pbx-pt-5"> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-2"><p>Article</p></div> <div class="pbx-font-semibold pbx-text-xl pbx-mb-2"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[16/10] pbx-rounded-2xl" src="${getPlaceholderImageDataUrl()}" alt="article"> <div class="pbx-pt-5"> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-2"><p>Article</p></div> <div class="pbx-font-semibold pbx-text-xl pbx-mb-2"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </div> </section>`,
          category: 'Cards',
          cover_image: null,
        },
        {
          title: 'Split Image Right',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-items-center"> <div> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-6"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-600 pbx-text-lg pbx-leading-relaxed pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="feature"> </div> </div> </div> </section>`,
          category: 'Images & Text',
          cover_image: null,
        },
        {
          title: 'Video Placeholder',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-5xl"> <div class="pbx-text-center pbx-mb-10"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-overflow-hidden pbx-rounded-3xl pbx-bg-gray-900"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-video" src="${getPlaceholderImageDataUrl()}" alt="video placeholder"> </div> </div> </div> </section>`,
          category: 'Media',
          cover_image: null,
        },
        {
          title: 'Footer Simple',
          html_code: `<section> <div class="pbx-py-16 pbx-px-4 pbx-border-t pbx-border-gray-200"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-4 pbx-gap-10 pbx-mb-12"> <div class="md:pbx-col-span-2"> <div class="pbx-text-xl pbx-font-bold pbx-mb-4"><p>Brand Name</p></div> <div class="pbx-text-gray-500 pbx-max-w-md"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div> <div class="pbx-font-semibold pbx-mb-4"><p>Product</p></div> <div class="pbx-flex pbx-flex-col pbx-gap-3 pbx-text-gray-500"> <div><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> <div><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> <div><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> <div> <div class="pbx-font-semibold pbx-mb-4"><p>Company</p></div> <div class="pbx-flex pbx-flex-col pbx-gap-3 pbx-text-gray-500"> <div><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> <div><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> <div><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </div> <div class="pbx-pt-8 pbx-border-t pbx-border-gray-100 pbx-text-sm pbx-text-gray-400"><p>© 2026 Brand Name. All rights reserved.</p></div> </div> </div> </section>`,
          category: 'Footer',
          cover_image: null,
        },
        {
          title: 'Announcement Bar',
          html_code: `<section> <div class="pbx-bg-gray-900 pbx-text-white pbx-py-3 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl pbx-flex pbx-flex-col sm:pbx-flex-row pbx-items-center pbx-justify-center pbx-gap-2 sm:pbx-gap-4 pbx-text-center pbx-text-sm"> <div><p>Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-font-semibold pbx-underline"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Checklist Features',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-4xl"> <div class="pbx-text-center pbx-mb-12"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-5"> <div class="pbx-flex pbx-items-start pbx-gap-4 pbx-p-5 pbx-rounded-2xl pbx-bg-gray-50"> <div class="pbx-w-2 pbx-h-2 pbx-min-w-2 pbx-mt-2 pbx-rounded-full pbx-bg-emerald-500"></div> <div> <div class="pbx-font-semibold pbx-mb-1"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> <div class="pbx-flex pbx-items-start pbx-gap-4 pbx-p-5 pbx-rounded-2xl pbx-bg-gray-50"> <div class="pbx-w-2 pbx-h-2 pbx-min-w-2 pbx-mt-2 pbx-rounded-full pbx-bg-emerald-500"></div> <div> <div class="pbx-font-semibold pbx-mb-1"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> <div class="pbx-flex pbx-items-start pbx-gap-4 pbx-p-5 pbx-rounded-2xl pbx-bg-gray-50"> <div class="pbx-w-2 pbx-h-2 pbx-min-w-2 pbx-mt-2 pbx-rounded-full pbx-bg-emerald-500"></div> <div> <div class="pbx-font-semibold pbx-mb-1"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> <div class="pbx-flex pbx-items-start pbx-gap-4 pbx-p-5 pbx-rounded-2xl pbx-bg-gray-50"> <div class="pbx-w-2 pbx-h-2 pbx-min-w-2 pbx-mt-2 pbx-rounded-full pbx-bg-emerald-500"></div> <div> <div class="pbx-font-semibold pbx-mb-1"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </div> </section>`,
          category: 'Features',
          cover_image: null,
        },
        {
          title: 'Bento Gallery',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mb-10"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight"><h2>Layouts and visual.</h2></div> </div> <div class="pbx-grid pbx-grid-cols-2 lg:pbx-grid-cols-4 pbx-gap-4"> <div class="pbx-col-span-2 pbx-row-span-2"> <img class="pbx-object-cover pbx-w-full pbx-h-full pbx-object-center pbx-aspect-square pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="gallery"> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="gallery"> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="gallery"> </div> <div class="pbx-col-span-2"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[21/9] pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="gallery"> </div> </div> </div> </div> </section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'About Split',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-items-center"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/5] pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="about"> <div class="pbx-py-4"> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-4"><p>About</p></div> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-6"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-600 pbx-text-lg pbx-leading-relaxed pbx-mb-6"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-text-gray-600 pbx-leading-relaxed pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </div> </div> </section>`,
          category: 'About',
          cover_image: null,
        },
        {
          title: 'Services Two Column',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mb-14 pbx-max-w-2xl"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-2"> <div class="pbx-border-t pbx-border-gray-200 pbx-pt-8"> <div class="pbx-text-sm pbx-font-semibold pbx-text-gray-400 pbx-mb-3"><p>01</p></div> <div class="pbx-font-semibold pbx-text-2xl pbx-mb-3"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-border-t pbx-border-gray-200 pbx-pt-8"> <div class="pbx-text-sm pbx-font-semibold pbx-text-gray-400 pbx-mb-3"><p>02</p></div> <div class="pbx-font-semibold pbx-text-2xl pbx-mb-3"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-border-t pbx-border-gray-200 pbx-pt-8"> <div class="pbx-text-sm pbx-font-semibold pbx-text-gray-400 pbx-mb-3"><p>03</p></div> <div class="pbx-font-semibold pbx-text-2xl pbx-mb-3"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-border-t pbx-border-gray-200 pbx-pt-8"> <div class="pbx-text-sm pbx-font-semibold pbx-text-gray-400 pbx-mb-3"><p>04</p></div> <div class="pbx-font-semibold pbx-text-2xl pbx-mb-3"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Features',
          cover_image: null,
        },
        {
          title: 'Contact Banner',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-bg-gray-50 pbx-rounded-3xl pbx-px-8 pbx-py-12 lg:pbx-px-14 lg:pbx-py-16"> <div class="pbx-flex pbx-flex-col lg:pbx-flex-row lg:pbx-items-center lg:pbx-justify-between pbx-gap-8"> <div> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-4xl pbx-font-bold pbx-tracking-tight pbx-mb-3"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-600 pbx-text-lg"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-flex pbx-flex-col sm:pbx-flex-row pbx-gap-6 sm:pbx-items-center"> <div> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-1"><p>Email</p></div> <div class="pbx-font-medium"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">hello@example.com</a></p></div> </div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"><p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-gray-900 pbx-text-white pbx-font-semibold pbx-px-6 pbx-py-3 pbx-rounded-full pbx-text-center" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </div> </div> </div> </section>`,
          category: 'Contact',
          cover_image: null,
        },

        {
          title: 'Portfolio Grid',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mb-12 pbx-max-w-2xl"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2"> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/3] pbx-rounded-2xl" src="${getPlaceholderImageDataUrl()}" alt="project"> <div class="pbx-pt-4"> <div class="pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-text-sm pbx-mt-1"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/3] pbx-rounded-2xl" src="${getPlaceholderImageDataUrl()}" alt="project"> <div class="pbx-pt-4"> <div class="pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-text-sm pbx-mt-1"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/3] pbx-rounded-2xl" src="${getPlaceholderImageDataUrl()}" alt="project"> <div class="pbx-pt-4"> <div class="pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-text-sm pbx-mt-1"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/3] pbx-rounded-2xl" src="${getPlaceholderImageDataUrl()}" alt="project"> <div class="pbx-pt-4"> <div class="pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-text-sm pbx-mt-1"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </div> </section>`,
          category: 'Portfolio',
          cover_image: null,
        },
        {
          title: 'Pricing Two Tiers',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-5xl"> <div class="pbx-text-center pbx-mb-12"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-2"> <div class="pbx-border pbx-border-gray-200 pbx-rounded-3xl pbx-p-8 lg:pbx-p-10"> <div class="pbx-text-sm pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-4"><p>Starter</p></div> <div class="pbx-text-4xl pbx-font-bold pbx-mb-2"><p>$19</p></div> <div class="pbx-text-gray-500 pbx-mb-8"><p>Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-flex pbx-flex-col pbx-gap-3 pbx-mb-8 pbx-text-gray-600"> <div><p>Layouts and visual.</p></div> <div><p>Layouts and visual.</p></div> <div><p>Layouts and visual.</p></div> </div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"><p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-font-semibold pbx-text-center pbx-py-3 pbx-rounded-full pbx-border pbx-border-gray-900" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> <div class="pbx-bg-gray-900 pbx-text-white pbx-rounded-3xl pbx-p-8 lg:pbx-p-10"> <div class="pbx-text-sm pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-4"><p>Pro</p></div> <div class="pbx-text-4xl pbx-font-bold pbx-mb-2"><p>$49</p></div> <div class="pbx-text-gray-400 pbx-mb-8"><p>Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-flex pbx-flex-col pbx-gap-3 pbx-mb-8 pbx-text-gray-300"> <div><p>Layouts and visual.</p></div> <div><p>Layouts and visual.</p></div> <div><p>Layouts and visual.</p></div> <div><p>Layouts and visual.</p></div> </div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"><p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-white pbx-text-gray-900 pbx-font-semibold pbx-text-center pbx-py-3 pbx-rounded-full" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </div> </div> </section>`,
          category: 'Pricing',
          cover_image: null,
        },
        {
          title: 'Event Banner',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-items-center"> <div> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-4"><p>Upcoming event</p></div> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-6"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-600 pbx-text-lg pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-flex pbx-flex-col sm:pbx-flex-row pbx-gap-6 pbx-mb-8"> <div> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-1"><p>Date</p></div> <div class="pbx-font-medium"><p>12 July 2026</p></div> </div> <div> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-1"><p>Location</p></div> <div class="pbx-font-medium"><p>Layouts and visual.</p></div> </div> </div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"><p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-gray-900 pbx-text-white pbx-font-semibold pbx-inline-block pbx-px-6 pbx-py-3 pbx-rounded-full" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="event"> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Quote With Image',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-6xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-5 pbx-items-center"> <div class="lg:pbx-col-span-2"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/5] pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="author"> </div> <div class="lg:pbx-col-span-3 lg:pbx-pl-8"> <div class="pbx-text-2xl lg:pbx-text-4xl pbx-font-medium pbx-leading-snug pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-font-semibold"><p>Full Name</p></div> <div class="pbx-text-gray-500"><p>Job Title, Company</p></div> </div> </div> </div> </div> </section>`,
          category: 'Cards',
          cover_image: null,
        },
        {
          title: 'Wide Article',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-3xl"> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-4"><p>Article</p></div> <div class="pbx-break-words pbx-text-4xl lg:pbx-text-6xl pbx-font-bold pbx-tracking-tight pbx-mb-6"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-mb-10"><p>Start customizing by editing this default text directly in the editor.</p></div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[16/9] pbx-rounded-3xl pbx-mb-10" src="${getPlaceholderImageDataUrl()}" alt="article"> <div class="pbx-text-lg pbx-leading-relaxed pbx-text-gray-700 pbx-mb-6"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-text-lg pbx-leading-relaxed pbx-text-gray-700"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section>`,
          category: 'Content',
          cover_image: null,
        },
        {
          title: 'Dual CTA Cards',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-2"> <div class="pbx-bg-gray-50 pbx-rounded-3xl pbx-p-10"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-3xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-600 pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> <div class="pbx-bg-gray-900 pbx-text-white pbx-rounded-3xl pbx-p-10"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-3xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-400 pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </div> </div> </section>`,
          category: 'Call To Action',
          cover_image: null,
        },
        {
          title: 'Office Locations',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mb-12"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg pbx-max-w-2xl"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-3"> <div class="pbx-border-t pbx-border-gray-200 pbx-pt-6"> <div class="pbx-font-semibold pbx-text-xl pbx-mb-3"><h3>New York</h3></div> <div class="pbx-text-gray-600 pbx-mb-2"><p>Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-text-gray-500"><p>+1 (555) 000-0001</p></div> </div> <div class="pbx-border-t pbx-border-gray-200 pbx-pt-6"> <div class="pbx-font-semibold pbx-text-xl pbx-mb-3"><h3>London</h3></div> <div class="pbx-text-gray-600 pbx-mb-2"><p>Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-text-gray-500"><p>+44 20 0000 0002</p></div> </div> <div class="pbx-border-t pbx-border-gray-200 pbx-pt-6"> <div class="pbx-font-semibold pbx-text-xl pbx-mb-3"><h3>Tokyo</h3></div> <div class="pbx-text-gray-600 pbx-mb-2"><p>Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-text-gray-500"><p>+81 3 0000 0003</p></div> </div> </div> </div> </div> </section>`,
          category: 'Contact',
          cover_image: null,
        },
        {
          title: 'Process Steps',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-text-center pbx-mb-14"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg pbx-max-w-2xl pbx-mx-auto"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-3"> <div class="pbx-text-center pbx-px-4"> <div class="pbx-text-5xl pbx-font-bold pbx-text-gray-200 pbx-mb-4"><p>01</p></div> <div class="pbx-font-semibold pbx-text-xl pbx-mb-3"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-text-center pbx-px-4"> <div class="pbx-text-5xl pbx-font-bold pbx-text-gray-200 pbx-mb-4"><p>02</p></div> <div class="pbx-font-semibold pbx-text-xl pbx-mb-3"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-text-center pbx-px-4"> <div class="pbx-text-5xl pbx-font-bold pbx-text-gray-200 pbx-mb-4"><p>03</p></div> <div class="pbx-font-semibold pbx-text-xl pbx-mb-3"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Features',
          cover_image: null,
        },
        {
          title: 'Image Mosaic',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-3 pbx-gap-4"> <div class="lg:pbx-col-span-2"> <img class="pbx-object-cover pbx-w-full pbx-h-full pbx-object-center pbx-aspect-[16/10] lg:pbx-aspect-auto pbx-min-h-full pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="mosaic"> </div> <div class="pbx-flex pbx-flex-col pbx-gap-4"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="mosaic"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="mosaic"> </div> </div> </div> </div> </section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Product Highlight',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-items-center"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="product"> <div> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-4"><p>New arrival</p></div> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-2xl pbx-font-semibold pbx-mb-6"><p>$129</p></div> <div class="pbx-text-gray-600 pbx-text-lg pbx-leading-relaxed pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"><p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-gray-900 pbx-text-white pbx-font-semibold pbx-inline-block pbx-px-6 pbx-py-3 pbx-rounded-full" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </div> </div> </section>`,
          category: 'Products',
          cover_image: null,
        },

        {
          title: 'Case Study',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-items-center"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/3] pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="case study"> <div> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-4"><p>Case study</p></div> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-4xl pbx-font-bold pbx-tracking-tight pbx-mb-6"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-600 pbx-text-lg pbx-leading-relaxed pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-grid pbx-grid-cols-3 pbx-gap-6 pbx-mb-8"> <div> <div class="pbx-text-2xl pbx-font-bold"><p>48%</p></div> <div class="pbx-text-sm pbx-text-gray-500"><p>Layouts and visual.</p></div> </div> <div> <div class="pbx-text-2xl pbx-font-bold"><p>3x</p></div> <div class="pbx-text-sm pbx-text-gray-500"><p>Layouts and visual.</p></div> </div> <div> <div class="pbx-text-2xl pbx-font-bold"><p>12w</p></div> <div class="pbx-text-sm pbx-text-gray-500"><p>Layouts and visual.</p></div> </div> </div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Before After',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-text-center pbx-mb-12"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-2"> <div> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-3"><p>Before</p></div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="before"> </div> <div> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-3"><p>After</p></div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="after"> </div> </div> </div> </div> </section>`,
          category: 'Images',
          cover_image: null,
        },
        {
          title: 'Job Listings',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-4xl"> <div class="pbx-mb-12"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-flex pbx-flex-col"> <div class="pbx-flex pbx-flex-col sm:pbx-flex-row sm:pbx-items-center sm:pbx-justify-between pbx-gap-4 pbx-py-6 pbx-border-t pbx-border-gray-200"> <div> <div class="pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-text-sm pbx-mt-1"><p>Remote · Full-time</p></div> </div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> <div class="pbx-flex pbx-flex-col sm:pbx-flex-row sm:pbx-items-center sm:pbx-justify-between pbx-gap-4 pbx-py-6 pbx-border-t pbx-border-gray-200"> <div> <div class="pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-text-sm pbx-mt-1"><p>New York · Full-time</p></div> </div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> <div class="pbx-flex pbx-flex-col sm:pbx-flex-row sm:pbx-items-center sm:pbx-justify-between pbx-gap-4 pbx-py-6 pbx-border-t pbx-border-b pbx-border-gray-200"> <div> <div class="pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-text-sm pbx-mt-1"><p>London · Contract</p></div> </div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </div> </div> </section>`,
          category: 'Careers',
          cover_image: null,
        },
        {
          title: 'Metrics Strip',
          html_code: `<section> <div class="pbx-py-16 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-2 lg:pbx-grid-cols-4 pbx-text-center"> <div> <div class="pbx-text-4xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-2"><p>120k</p></div> <div class="pbx-text-gray-500"><p>Layouts and visual.</p></div> </div> <div> <div class="pbx-text-4xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-2"><p>98%</p></div> <div class="pbx-text-gray-500"><p>Layouts and visual.</p></div> </div> <div> <div class="pbx-text-4xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-2"><p>45</p></div> <div class="pbx-text-gray-500"><p>Layouts and visual.</p></div> </div> <div> <div class="pbx-text-4xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-2"><p>24/7</p></div> <div class="pbx-text-gray-500"><p>Layouts and visual.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Full Bleed Caption',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[21/9] pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="feature"> <div class="pbx-mt-6 pbx-flex pbx-flex-col sm:pbx-flex-row sm:pbx-items-end sm:pbx-justify-between pbx-gap-4"> <div class="pbx-max-w-2xl"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-3xl pbx-font-bold pbx-tracking-tight pbx-mb-2"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </div> </section>`,
          category: 'Images & Text',
          cover_image: null,
        },
        {
          title: 'Category Cards',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mb-12 pbx-text-center"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-4"> <div class="pbx-rounded-3xl pbx-overflow-hidden pbx-bg-gray-50"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/3]" src="${getPlaceholderImageDataUrl()}" alt="category"> <div class="pbx-p-5"> <div class="pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> </div> </div> <div class="pbx-rounded-3xl pbx-overflow-hidden pbx-bg-gray-50"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/3]" src="${getPlaceholderImageDataUrl()}" alt="category"> <div class="pbx-p-5"> <div class="pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> </div> </div> <div class="pbx-rounded-3xl pbx-overflow-hidden pbx-bg-gray-50"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/3]" src="${getPlaceholderImageDataUrl()}" alt="category"> <div class="pbx-p-5"> <div class="pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> </div> </div> <div class="pbx-rounded-3xl pbx-overflow-hidden pbx-bg-gray-50"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/3]" src="${getPlaceholderImageDataUrl()}" alt="category"> <div class="pbx-p-5"> <div class="pbx-font-semibold pbx-text-lg"><h3>Layouts and visual.</h3></div> </div> </div> </div> </div> </div> </section>`,
          category: 'Cards',
          cover_image: null,
        },
        {
          title: 'Resource CTA',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-5xl"> <div class="pbx-bg-gray-50 pbx-rounded-3xl pbx-p-10 lg:pbx-p-14 pbx-text-center"> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-4"><p>Free resource</p></div> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-600 pbx-text-lg pbx-max-w-2xl pbx-mx-auto pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"><p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-gray-900 pbx-text-white pbx-font-semibold pbx-inline-block pbx-px-8 pbx-py-3 pbx-rounded-full" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </div> </section>`,
          category: 'Call To Action',
          cover_image: null,
        },
        {
          title: 'Press Mentions',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-text-center pbx-mb-12"> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-4"><p>As seen in</p></div> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-bold pbx-tracking-tight"><h2>Layouts and visual.</h2></div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-3"> <div class="pbx-border pbx-border-gray-200 pbx-rounded-3xl pbx-p-8"> <div class="pbx-text-lg pbx-leading-relaxed pbx-mb-6"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-font-semibold"><p>Publication Name</p></div> </div> <div class="pbx-border pbx-border-gray-200 pbx-rounded-3xl pbx-p-8"> <div class="pbx-text-lg pbx-leading-relaxed pbx-mb-6"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-font-semibold"><p>Publication Name</p></div> </div> <div class="pbx-border pbx-border-gray-200 pbx-rounded-3xl pbx-p-8"> <div class="pbx-text-lg pbx-leading-relaxed pbx-mb-6"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-font-semibold"><p>Publication Name</p></div> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Split Newsletter',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-overflow-hidden pbx-rounded-3xl pbx-bg-gray-900 pbx-text-white"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-items-center"> <div class="pbx-p-10 lg:pbx-p-14"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-4xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-400 pbx-text-lg pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"><p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-white pbx-text-gray-900 pbx-font-semibold pbx-inline-block pbx-px-6 pbx-py-3 pbx-rounded-full" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square lg:pbx-aspect-auto lg:pbx-h-full" src="${getPlaceholderImageDataUrl()}" alt="newsletter"> </div> </div> </div> </div> </section>`,
          category: 'Call To Action',
          cover_image: null,
        },
        {
          title: 'Feature List Image',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-items-center"> <div> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-6"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-600 pbx-text-lg pbx-mb-8"><p>Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-flex pbx-flex-col pbx-gap-5"> <div class="pbx-border-l-2 pbx-border-gray-900 pbx-pl-5"> <div class="pbx-font-semibold pbx-mb-1"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-border-l-2 pbx-border-gray-900 pbx-pl-5"> <div class="pbx-font-semibold pbx-mb-1"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-border-l-2 pbx-border-gray-900 pbx-pl-5"> <div class="pbx-font-semibold pbx-mb-1"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/5] pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="feature"> </div> </div> </div> </section>`,
          category: 'Features',
          cover_image: null,
        },

        {
          title: 'Hero Minimal',
          html_code: `<section> <div class="pbx-py-24 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-3xl pbx-text-center"> <div class="pbx-break-words pbx-text-5xl lg:pbx-text-7xl pbx-font-bold pbx-tracking-tight pbx-mb-6"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg lg:pbx-text-xl pbx-mb-10"><p>Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"><p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-gray-900 pbx-text-white pbx-font-semibold pbx-inline-block pbx-px-8 pbx-py-3 pbx-rounded-full" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </section>`,
          category: 'Hero',
          cover_image: null,
        },
        {
          title: 'Product Grid Four',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mb-12"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-2 lg:pbx-grid-cols-4"> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-2xl" src="${getPlaceholderImageDataUrl()}" alt="product"> <div class="pbx-pt-4"> <div class="pbx-font-semibold"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-mt-1"><p>$49</p></div> </div> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-2xl" src="${getPlaceholderImageDataUrl()}" alt="product"> <div class="pbx-pt-4"> <div class="pbx-font-semibold"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-mt-1"><p>$59</p></div> </div> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-2xl" src="${getPlaceholderImageDataUrl()}" alt="product"> <div class="pbx-pt-4"> <div class="pbx-font-semibold"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-mt-1"><p>$69</p></div> </div> </div> <div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-2xl" src="${getPlaceholderImageDataUrl()}" alt="product"> <div class="pbx-pt-4"> <div class="pbx-font-semibold"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-500 pbx-mt-1"><p>$79</p></div> </div> </div> </div> </div> </div> </section>`,
          category: 'Products',
          cover_image: null,
        },
        {
          title: 'Testimonial Pair',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-2"> <div class="pbx-bg-gray-50 pbx-rounded-3xl pbx-p-10"> <div class="pbx-text-xl lg:pbx-text-2xl pbx-leading-relaxed pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-flex pbx-items-center pbx-gap-4"> <img class="pbx-object-cover pbx-w-12 pbx-h-12 pbx-min-w-12 pbx-object-center pbx-rounded-full" src="${getPlaceholderImageDataUrl()}" alt="author"> <div> <div class="pbx-font-semibold"><p>Full Name</p></div> <div class="pbx-text-gray-500 pbx-text-sm"><p>Job Title</p></div> </div> </div> </div> <div class="pbx-bg-gray-50 pbx-rounded-3xl pbx-p-10"> <div class="pbx-text-xl lg:pbx-text-2xl pbx-leading-relaxed pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-flex pbx-items-center pbx-gap-4"> <img class="pbx-object-cover pbx-w-12 pbx-h-12 pbx-min-w-12 pbx-object-center pbx-rounded-full" src="${getPlaceholderImageDataUrl()}" alt="author"> <div> <div class="pbx-font-semibold"><p>Full Name</p></div> <div class="pbx-text-gray-500 pbx-text-sm"><p>Job Title</p></div> </div> </div> </div> </div> </div> </div> </section>`,
          category: 'Cards',
          cover_image: null,
        },
        {
          title: 'Sidebar Article',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-3"> <div class="lg:pbx-col-span-2"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-6"><h2>Layouts and visual.</h2></div> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[16/9] pbx-rounded-3xl pbx-mb-8" src="${getPlaceholderImageDataUrl()}" alt="article"> <div class="pbx-text-lg pbx-leading-relaxed pbx-text-gray-700 pbx-mb-6"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-text-lg pbx-leading-relaxed pbx-text-gray-700"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div> <div class="pbx-bg-gray-50 pbx-rounded-3xl pbx-p-8"> <div class="pbx-font-semibold pbx-text-lg pbx-mb-6"><h3>Layouts and visual.</h3></div> <div class="pbx-flex pbx-flex-col pbx-gap-5"> <div> <div class="pbx-font-medium pbx-mb-1"><p>Layouts and visual.</p></div> <div class="pbx-text-sm pbx-text-gray-500"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div> <div class="pbx-font-medium pbx-mb-1"><p>Layouts and visual.</p></div> <div class="pbx-text-sm pbx-text-gray-500"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div> <div class="pbx-font-medium pbx-mb-1"><p>Layouts and visual.</p></div> <div class="pbx-text-sm pbx-text-gray-500"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </div> </div> </div> </section>`,
          category: 'Content',
          cover_image: null,
        },
        {
          title: 'Logo Wall',
          html_code: `<section> <div class="pbx-py-16 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-text-center pbx-mb-12"> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-4"><p>Trusted by teams</p></div> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-bold pbx-tracking-tight"><h2>Layouts and visual.</h2></div> </div> <div class="pbx-grid pbx-grid-cols-2 sm:pbx-grid-cols-3 lg:pbx-grid-cols-6 pbx-gap-6"> <div class="pbx-bg-gray-50 pbx-rounded-2xl pbx-p-6 pbx-flex pbx-items-center pbx-justify-center"><img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="logo"></div> <div class="pbx-bg-gray-50 pbx-rounded-2xl pbx-p-6 pbx-flex pbx-items-center pbx-justify-center"><img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="logo"></div> <div class="pbx-bg-gray-50 pbx-rounded-2xl pbx-p-6 pbx-flex pbx-items-center pbx-justify-center"><img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="logo"></div> <div class="pbx-bg-gray-50 pbx-rounded-2xl pbx-p-6 pbx-flex pbx-items-center pbx-justify-center"><img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="logo"></div> <div class="pbx-bg-gray-50 pbx-rounded-2xl pbx-p-6 pbx-flex pbx-items-center pbx-justify-center"><img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="logo"></div> <div class="pbx-bg-gray-50 pbx-rounded-2xl pbx-p-6 pbx-flex pbx-items-center pbx-justify-center"><img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="logo"></div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: null,
        },
        {
          title: 'Pricing Single',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-xl"> <div class="pbx-border pbx-border-gray-200 pbx-rounded-3xl pbx-p-10 lg:pbx-p-12 pbx-text-center"> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-4"><p>Simple pricing</p></div> <div class="pbx-break-words pbx-text-3xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-5xl pbx-font-bold pbx-mb-2"><p>$29</p></div> <div class="pbx-text-gray-500 pbx-mb-8"><p>per month</p></div> <div class="pbx-flex pbx-flex-col pbx-gap-3 pbx-mb-10 pbx-text-gray-600 pbx-text-left pbx-max-w-xs pbx-mx-auto"> <div><p>Layouts and visual.</p></div> <div><p>Layouts and visual.</p></div> <div><p>Layouts and visual.</p></div> <div><p>Layouts and visual.</p></div> </div> <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree"><p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-gray-900 pbx-text-white pbx-font-semibold pbx-inline-block pbx-px-8 pbx-py-3 pbx-rounded-full" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div> </div> </section>`,
          category: 'Pricing',
          cover_image: null,
        },
        {
          title: 'Team Spotlight',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-items-center"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="team"> <div> <div class="pbx-text-xs pbx-font-semibold pbx-tracking-widest pbx-uppercase pbx-text-gray-400 pbx-mb-4"><p>Our team</p></div> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-6"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-600 pbx-text-lg pbx-leading-relaxed pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-flex pbx-flex-col pbx-gap-4"> <div class="pbx-flex pbx-items-center pbx-gap-4"> <img class="pbx-object-cover pbx-w-14 pbx-h-14 pbx-min-w-14 pbx-object-center pbx-rounded-full" src="${getPlaceholderImageDataUrl()}" alt="member"> <div> <div class="pbx-font-semibold"><p>Full Name</p></div> <div class="pbx-text-gray-500 pbx-text-sm"><p>Founder</p></div> </div> </div> <div class="pbx-flex pbx-items-center pbx-gap-4"> <img class="pbx-object-cover pbx-w-14 pbx-h-14 pbx-min-w-14 pbx-object-center pbx-rounded-full" src="${getPlaceholderImageDataUrl()}" alt="member"> <div> <div class="pbx-font-semibold"><p>Full Name</p></div> <div class="pbx-text-gray-500 pbx-text-sm"><p>Designer</p></div> </div> </div> </div> </div> </div> </div> </div> </section>`,
          category: 'Team',
          cover_image: null,
        },
        {
          title: 'FAQ Split',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2"> <div> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg pbx-mb-8"><p>Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-font-semibold"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> <div class="pbx-flex pbx-flex-col"> <div class="pbx-py-6 pbx-border-t pbx-border-gray-200"> <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-py-6 pbx-border-t pbx-border-gray-200"> <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-py-6 pbx-border-t pbx-border-b pbx-border-gray-200"> <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><h3>Layouts and visual.</h3></div> <div class="pbx-text-gray-600"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </div> </section>`,
          category: 'Content',
          cover_image: null,
        },
        {
          title: 'Gallery Three Wide',
          html_code: `<section> <div class="pbx-py-8 pbx-px-4"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mb-10 pbx-max-w-2xl"> <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-bold pbx-tracking-tight pbx-mb-4"><h2>Layouts and visual.</h2></div> <div class="pbx-text-gray-500 pbx-text-lg"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-3"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[3/4] pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="gallery"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[3/4] pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="gallery"> <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[3/4] pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="gallery"> </div> </div> </div> </section>`,
          category: 'Images',
          cover_image: null,
        },

        // —— Apple design style ——
        {
          title: 'Apple Product Hero',
          html_code: `<section>
            <div class="pbx-bg-neutral-100">
              <div class="pbx-pt-20 pbx-pb-10 pbx-px-4">
                <div class="pbx-mx-auto pbx-max-w-4xl pbx-text-center">
                  <div class="pbx-text-sm pbx-font-medium pbx-text-sky-600 pbx-mb-4"><p>Layouts and visual.</p></div>
                  <div class="pbx-break-words pbx-text-5xl lg:pbx-text-7xl pbx-font-semibold pbx-tracking-tight pbx-text-neutral-900 pbx-mb-5"><h2>Layouts and visual.</h2></div>
                  <div class="pbx-text-xl lg:pbx-text-2xl pbx-text-neutral-500 pbx-max-w-2xl pbx-mx-auto pbx-mb-8"><p>Start customizing by editing this default text directly in the editor.</p></div>
                  <div class="pbx-flex pbx-justify-center pbx-gap-6">
                    <div class="pbx-text-sky-600 pbx-font-medium"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div>
                    <div class="pbx-text-sky-600 pbx-font-medium"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div>
                  </div>
                </div>
              </div>
              <div class="pbx-px-4 pbx-pb-0">
                <div class="pbx-mx-auto pbx-max-w-5xl">
                  <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[16/10] pbx-rounded-t-3xl" src="${getPlaceholderImageDataUrl()}" alt="product" />
                </div>
              </div>
            </div>
          </section>`,
          cover_image: null,
          category: 'Apple',
        },
        {
          title: 'Apple Dual Canvas',
          html_code: `<section>
            <div class="pbx-py-8 pbx-px-4">
              <div class="pbx-mx-auto pbx-max-w-7xl">
                <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2">
                  <div class="pbx-bg-neutral-100 pbx-rounded-3xl pbx-overflow-hidden pbx-text-center">
                    <div class="pbx-pt-14 pbx-px-8 pbx-pb-8">
                      <div class="pbx-break-words pbx-text-3xl lg:pbx-text-4xl pbx-font-semibold pbx-tracking-tight pbx-text-neutral-900 pbx-mb-3"><h2>Layouts and visual.</h2></div>
                      <div class="pbx-text-neutral-500 pbx-text-lg pbx-mb-5"><p>Start customizing by editing this default text directly in the editor.</p></div>
                      <div class="pbx-text-sky-600 pbx-font-medium"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div>
                    </div>
                    <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="product" />
                  </div>
                  <div class="pbx-bg-neutral-900 pbx-rounded-3xl pbx-overflow-hidden pbx-text-center pbx-text-white">
                    <div class="pbx-pt-14 pbx-px-8 pbx-pb-8">
                      <div class="pbx-break-words pbx-text-3xl lg:pbx-text-4xl pbx-font-semibold pbx-tracking-tight pbx-mb-3"><h2>Layouts and visual.</h2></div>
                      <div class="pbx-text-neutral-400 pbx-text-lg pbx-mb-5"><p>Start customizing by editing this default text directly in the editor.</p></div>
                      <div class="pbx-text-sky-400 pbx-font-medium"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div>
                    </div>
                    <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="product" />
                  </div>
                </div>
              </div>
            </div>
          </section>`,
          cover_image: null,
          category: 'Apple',
        },
        {
          title: 'Apple Dark Stage',
          html_code: `<section>
            <div class="pbx-bg-black pbx-text-white">
              <div class="pbx-pt-24 pbx-pb-12 pbx-px-4">
                <div class="pbx-mx-auto pbx-max-w-3xl pbx-text-center">
                  <div class="pbx-break-words pbx-text-5xl lg:pbx-text-7xl pbx-font-semibold pbx-tracking-tight pbx-mb-5"><h2>Layouts and visual.</h2></div>
                  <div class="pbx-text-xl pbx-text-neutral-400 pbx-mb-8"><p>Start customizing by editing this default text directly in the editor.</p></div>
                  <div class="pbx-flex pbx-justify-center">
                    <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree">
                      <p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-sky-500 pbx-text-white pbx-font-medium pbx-inline-block pbx-px-7 pbx-py-3 pbx-rounded-full" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pbx-px-4 pbx-pb-16">
                <div class="pbx-mx-auto pbx-max-w-5xl">
                  <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-video pbx-rounded-3xl" src="${getPlaceholderImageDataUrl()}" alt="stage" />
                </div>
              </div>
            </div>
          </section>`,
          cover_image: null,
          category: 'Apple',
        },
        {
          title: 'Apple Spec Trio',
          html_code: `<section>
            <div class="pbx-py-20 pbx-px-4">
              <div class="pbx-mx-auto pbx-max-w-6xl">
                <div class="pbx-text-center pbx-mb-16">
                  <div class="pbx-break-words pbx-text-4xl lg:pbx-text-6xl pbx-font-semibold pbx-tracking-tight pbx-text-neutral-900 pbx-mb-4"><h2>Layouts and visual.</h2></div>
                  <div class="pbx-text-neutral-500 pbx-text-xl pbx-max-w-2xl pbx-mx-auto"><p>Start customizing by editing this default text directly in the editor.</p></div>
                </div>
                <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-3 pbx-text-center">
                  <div class="pbx-px-4">
                    <div class="pbx-text-5xl lg:pbx-text-6xl pbx-font-semibold pbx-tracking-tight pbx-text-neutral-900 pbx-mb-3"><p>01</p></div>
                    <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><h3>Layouts and visual.</h3></div>
                    <div class="pbx-text-neutral-500"><p>Start customizing by editing this default text directly in the editor.</p></div>
                  </div>
                  <div class="pbx-px-4">
                    <div class="pbx-text-5xl lg:pbx-text-6xl pbx-font-semibold pbx-tracking-tight pbx-text-neutral-900 pbx-mb-3"><p>02</p></div>
                    <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><h3>Layouts and visual.</h3></div>
                    <div class="pbx-text-neutral-500"><p>Start customizing by editing this default text directly in the editor.</p></div>
                  </div>
                  <div class="pbx-px-4">
                    <div class="pbx-text-5xl lg:pbx-text-6xl pbx-font-semibold pbx-tracking-tight pbx-text-neutral-900 pbx-mb-3"><p>03</p></div>
                    <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><h3>Layouts and visual.</h3></div>
                    <div class="pbx-text-neutral-500"><p>Start customizing by editing this default text directly in the editor.</p></div>
                  </div>
                </div>
              </div>
            </div>
          </section>`,
          cover_image: null,
          category: 'Apple',
        },
        {
          title: 'Apple Soft Panel',
          html_code: `<section>
            <div class="pbx-py-12 pbx-px-4">
              <div class="pbx-mx-auto pbx-max-w-6xl">
                <div class="pbx-bg-neutral-100 pbx-rounded-[2rem] pbx-overflow-hidden">
                  <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 lg:pbx-grid-cols-2 pbx-items-center">
                    <div class="pbx-p-10 lg:pbx-p-16">
                      <div class="pbx-break-words pbx-text-4xl lg:pbx-text-5xl pbx-font-semibold pbx-tracking-tight pbx-text-neutral-900 pbx-mb-5"><h2>Layouts and visual.</h2></div>
                      <div class="pbx-text-neutral-500 pbx-text-lg pbx-leading-relaxed pbx-mb-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div>
                      <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree">
                        <p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-neutral-900 pbx-text-white pbx-font-medium pbx-inline-block pbx-px-7 pbx-py-3 pbx-rounded-full" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p>
                      </div>
                    </div>
                    <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square lg:pbx-aspect-auto lg:pbx-h-full lg:pbx-min-h-[28rem]" src="${getPlaceholderImageDataUrl()}" alt="feature" />
                  </div>
                </div>
              </div>
            </div>
          </section>`,
          cover_image: null,
          category: 'Apple',
        },
        {
          title: 'Apple Bento Grid',
          html_code: `<section>
            <div class="pbx-py-8 pbx-px-4">
              <div class="pbx-mx-auto pbx-max-w-7xl">
                <div class="pbx-text-center pbx-mb-12">
                  <div class="pbx-break-words pbx-text-4xl lg:pbx-text-6xl pbx-font-semibold pbx-tracking-tight pbx-text-neutral-900 pbx-mb-4"><h2>Layouts and visual.</h2></div>
                  <div class="pbx-text-neutral-500 pbx-text-xl"><p>Start customizing by editing this default text directly in the editor.</p></div>
                </div>
                <div class="pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-2 pbx-gap-5">
                  <div class="pbx-bg-neutral-100 pbx-rounded-3xl pbx-overflow-hidden md:pbx-row-span-2">
                    <div class="pbx-p-8 lg:pbx-p-10">
                      <div class="pbx-break-words pbx-text-2xl lg:pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-mb-3"><h3>Layouts and visual.</h3></div>
                      <div class="pbx-text-neutral-500"><p>Start customizing by editing this default text directly in the editor.</p></div>
                    </div>
                    <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[4/5]" src="${getPlaceholderImageDataUrl()}" alt="bento" />
                  </div>
                  <div class="pbx-bg-neutral-100 pbx-rounded-3xl pbx-overflow-hidden">
                    <div class="pbx-p-8">
                      <div class="pbx-break-words pbx-text-2xl pbx-font-semibold pbx-tracking-tight pbx-mb-3"><h3>Layouts and visual.</h3></div>
                      <div class="pbx-text-neutral-500 pbx-mb-6"><p>Start customizing by editing this default text directly in the editor.</p></div>
                    </div>
                    <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-video" src="${getPlaceholderImageDataUrl()}" alt="bento" />
                  </div>
                  <div class="pbx-bg-neutral-900 pbx-text-white pbx-rounded-3xl pbx-p-8 lg:pbx-p-10 pbx-flex pbx-flex-col pbx-justify-end pbx-min-h-[16rem]">
                    <div class="pbx-break-words pbx-text-2xl pbx-font-semibold pbx-tracking-tight pbx-mb-3"><h3>Layouts and visual.</h3></div>
                    <div class="pbx-text-neutral-400 pbx-mb-5"><p>Start customizing by editing this default text directly in the editor.</p></div>
                    <div class="pbx-text-sky-400 pbx-font-medium"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div>
                  </div>
                </div>
              </div>
            </div>
          </section>`,
          cover_image: null,
          category: 'Apple',
        },
        {
          title: 'Apple Quiet Quote',
          html_code: `<section>
            <div class="pbx-py-28 pbx-px-4">
              <div class="pbx-mx-auto pbx-max-w-3xl pbx-text-center">
                <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-semibold pbx-tracking-tight pbx-text-neutral-900 pbx-leading-snug pbx-mb-10">
                  <p>Start customizing by editing this default text directly in the editor.</p>
                </div>
                <div class="pbx-flex pbx-flex-col pbx-items-center pbx-gap-3">
                  <img class="pbx-object-cover pbx-w-14 pbx-h-14 pbx-min-w-14 pbx-object-center pbx-rounded-full" src="${getPlaceholderImageDataUrl()}" alt="author" />
                  <div class="pbx-font-medium pbx-text-neutral-900"><p>Full Name</p></div>
                  <div class="pbx-text-neutral-500 pbx-text-sm"><p>Job Title</p></div>
                </div>
              </div>
            </div>
          </section>`,
          cover_image: null,
          category: 'Apple',
        },
        {
          title: 'Apple Product Pair',
          html_code: `<section>
            <div class="pbx-py-12 pbx-px-4">
              <div class="pbx-mx-auto pbx-max-w-6xl">
                <div class="pbx-text-center pbx-mb-14">
                  <div class="pbx-break-words pbx-text-4xl lg:pbx-text-5xl pbx-font-semibold pbx-tracking-tight pbx-text-neutral-900"><h2>Layouts and visual.</h2></div>
                </div>
                <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-2">
                  <div class="pbx-text-center">
                    <div class="pbx-bg-neutral-100 pbx-rounded-3xl pbx-mb-6 pbx-overflow-hidden">
                      <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="product" />
                    </div>
                    <div class="pbx-font-semibold pbx-text-xl pbx-mb-2"><h3>Layouts and visual.</h3></div>
                    <div class="pbx-text-neutral-500 pbx-mb-4"><p>Start customizing by editing this default text directly in the editor.</p></div>
                    <div class="pbx-text-sky-600 pbx-font-medium"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div>
                  </div>
                  <div class="pbx-text-center">
                    <div class="pbx-bg-neutral-100 pbx-rounded-3xl pbx-mb-6 pbx-overflow-hidden">
                      <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="product" />
                    </div>
                    <div class="pbx-font-semibold pbx-text-xl pbx-mb-2"><h3>Layouts and visual.</h3></div>
                    <div class="pbx-text-neutral-500 pbx-mb-4"><p>Start customizing by editing this default text directly in the editor.</p></div>
                    <div class="pbx-text-sky-600 pbx-font-medium"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div>
                  </div>
                </div>
              </div>
            </div>
          </section>`,
          cover_image: null,
          category: 'Apple',
        },
        {
          title: 'Apple Feature Ribbon',
          html_code: `<section>
            <div class="pbx-bg-neutral-100">
              <div class="pbx-py-20 pbx-px-4">
                <div class="pbx-mx-auto pbx-max-w-6xl">
                  <div class="pbx-text-center pbx-mb-16">
                    <div class="pbx-break-words pbx-text-4xl lg:pbx-text-5xl pbx-font-semibold pbx-tracking-tight pbx-text-neutral-900 pbx-mb-4"><h2>Layouts and visual.</h2></div>
                    <div class="pbx-text-neutral-500 pbx-text-lg pbx-max-w-xl pbx-mx-auto"><p>Start customizing by editing this default text directly in the editor.</p></div>
                  </div>
                  <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 md:pbx-grid-cols-3">
                    <div class="pbx-text-center pbx-px-4">
                      <div class="pbx-mx-auto pbx-mb-6 pbx-w-16 pbx-h-16 pbx-rounded-full pbx-bg-white pbx-flex pbx-items-center pbx-justify-center">
                        <div class="pbx-w-3 pbx-h-3 pbx-rounded-full pbx-bg-neutral-900"></div>
                      </div>
                      <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><h3>Layouts and visual.</h3></div>
                      <div class="pbx-text-neutral-500"><p>Start customizing by editing this default text directly in the editor.</p></div>
                    </div>
                    <div class="pbx-text-center pbx-px-4">
                      <div class="pbx-mx-auto pbx-mb-6 pbx-w-16 pbx-h-16 pbx-rounded-full pbx-bg-white pbx-flex pbx-items-center pbx-justify-center">
                        <div class="pbx-w-3 pbx-h-3 pbx-rounded-full pbx-bg-neutral-900"></div>
                      </div>
                      <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><h3>Layouts and visual.</h3></div>
                      <div class="pbx-text-neutral-500"><p>Start customizing by editing this default text directly in the editor.</p></div>
                    </div>
                    <div class="pbx-text-center pbx-px-4">
                      <div class="pbx-mx-auto pbx-mb-6 pbx-w-16 pbx-h-16 pbx-rounded-full pbx-bg-white pbx-flex pbx-items-center pbx-justify-center">
                        <div class="pbx-w-3 pbx-h-3 pbx-rounded-full pbx-bg-neutral-900"></div>
                      </div>
                      <div class="pbx-font-semibold pbx-text-lg pbx-mb-2"><h3>Layouts and visual.</h3></div>
                      <div class="pbx-text-neutral-500"><p>Start customizing by editing this default text directly in the editor.</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`,
          cover_image: null,
          category: 'Apple',
        },
        {
          title: 'Apple Full Bleed Caption',
          html_code: `<section>
            <div class="pbx-relative">
              <img class="pbx-object-cover pbx-w-full pbx-object-center pbx-aspect-[21/9] pbx-min-h-[22rem]" src="${getPlaceholderImageDataUrl()}" alt="landscape" />
              <div class="pbx-absolute pbx-inset-0 pbx-bg-black/35 pbx-flex pbx-items-end">
                <div class="pbx-w-full pbx-p-8 lg:pbx-p-14">
                  <div class="pbx-mx-auto pbx-max-w-7xl">
                    <div class="pbx-break-words pbx-text-3xl lg:pbx-text-5xl pbx-font-semibold pbx-tracking-tight pbx-text-white pbx-mb-3"><h2>Layouts and visual.</h2></div>
                    <div class="pbx-text-white/80 pbx-text-lg pbx-max-w-xl pbx-mb-6"><p>Start customizing by editing this default text directly in the editor.</p></div>
                    <div class="pbx-flex pbx-items-center pbx-font-medium" id="linktree">
                      <p><a class="pbx-inline-flex pbx-items-center pbx-justify-center pbx-bg-white pbx-text-neutral-900 pbx-font-medium pbx-inline-block pbx-px-7 pbx-py-3 pbx-rounded-full" target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>`,
          cover_image: null,
          category: 'Apple',
        },
      ],
    },
  },
]

export default component
