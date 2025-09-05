interface ComponentData {
  title: string
  html_code: string
  cover_image: string | null
  category: string
}

interface Themes {
  themes: {
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

const component: Themes[] = [
  {
    themes: {
      data: [
        {
          title: 'Basic Article',
          html_code: `<div id="pagebuilder" class=" style=""><section data-component-title="Header H2"><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-font-medium pbx-text-3xl lg:pbx-text-6xl"><h2>Layouts and visual.</h2></div></div></div></section> <section data-component-title="Text"> <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Header H3" class=""><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" class=""> <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p><ul><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p><p><br></p></li></ul><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Header H3" class=""><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text"> <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.<br><br>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section></div>`,
          category: 'Article',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.5 215.93">
  <rect fill="#394152" x="0" y="0" width="277.5" height="7.87"/>
  <g>
    <rect fill="#394152" x="0" y="38.3" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="25.01" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="51.59" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="64.87" width="234.19" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="23.49" y="111.37" width="210.69" height="4.91"/>
    <rect fill="#394152" x="23.49" y="98.09" width="210.69" height="4.91"/>
    <rect fill="#394152" x="23.49" y="124.66" width="210.69" height="4.91"/>
    <rect fill="#394152" x="23.49" y="137.95" width="210.69" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="0" y="184.45" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="171.16" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="197.73" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="211.02" width="234.19" height="4.91"/>
  </g>
  <ellipse fill="#394152" cx="11.43" cy="100.54" rx="2.57" ry="2.45"/>
  <ellipse fill="#394152" cx="11.43" cy="113.83" rx="2.57" ry="2.45"/>
  <ellipse fill="#394152" cx="11.43" cy="127.11" rx="2.57" ry="2.45"/>
  <ellipse fill="#394152" cx="11.43" cy="140.4" rx="2.57" ry="2.45"/>
</svg>


					`,
        },
        {
          title: 'Blog Post',
          html_code: `<section data-component-title="Single Image"> <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-1 lg:pbx-grid-cols-1"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div></div></div> </section> <section data-component-title="Header H2" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-font-medium pbx-text-3xl lg:pbx-text-6xl"><h2>Layouts and visual.</h2></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Header H3" class="" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" class="" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p><ul><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p><p><br></p></li></ul><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Header H3" class="" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.<br><br>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Three Square Images"> <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 lg:pbx-grid-cols-3"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div> </section>`,
          category: 'Article',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 278.95 603.06">
  <g>
    <rect fill="#394152" width="278.95" height="209.21"/>
    <polygon fill="#718096" points="90.66 125.55 125.53 83.7 160.4 125.55 90.66 125.55"/>
    <polygon fill="#718096" points="153.43 125.55 170.86 104.62 188.3 125.55 153.43 125.55"/>
    <circle fill="#718096" cx="170.86" cy="89.48" r="5.8"/>
  </g>
  <g>
    <rect fill="#394152" x="0" y="518.22" width="84.84" height="84.84"/>
    <rect fill="#394152" x="97.79" y="518.22" width="84.84" height="84.84"/>
    <rect fill="#394152" x="194.11" y="518.22" width="84.84" height="84.84"/>
    <polygon fill="#718096" points="12.9 573.29 33.99 547.99 55.07 573.29 12.9 573.29"/>
    <polygon fill="#718096" points="50.85 573.29 61.39 560.64 71.92 573.29 50.85 573.29"/>
    <circle fill="#718096" cx="61.39" cy="551.5" r="3.51"/>
    <polygon fill="#718096" points="110.71 573.29 131.77 547.99 152.86 573.29 110.71 573.29"/>
    <polygon fill="#718096" points="148.64 573.29 159.18 560.64 169.72 573.29 148.64 573.29"/>
    <circle fill="#718096" cx="159.18" cy="551.5" r="3.51"/>
    <polygon fill="#718096" points="207.01 573.29 228.08 547.99 249.17 573.29 207.01 573.29"/>
    <polygon fill="#718096" points="244.95 573.29 255.49 560.64 266.03 573.29 244.95 573.29"/>
    <circle fill="#718096" cx="255.49" cy="551.5" r="3.51"/>
  </g>
  <rect fill="#394152" x="0" y="233.3" width="129.7" height="7.87"/>
  <rect fill="#394152" x="0" y="341.86" width="58.76" height="7.87"/>
  <g>
    <rect fill="#394152" x="0" y="271.6" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="258.32" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="284.89" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="298.18" width="234.19" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="23.49" y="384.68" width="210.69" height="4.91"/>
    <rect fill="#394152" x="23.49" y="371.39" width="210.69" height="4.91"/>
    <rect fill="#394152" x="23.49" y="397.96" width="210.69" height="4.91"/>
    <rect fill="#394152" x="23.49" y="411.25" width="210.69" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="0" y="457.75" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="444.47" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="471.04" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="484.32" width="234.19" height="4.91"/>
  </g>
  <ellipse fill="#394152" cx="11.43" cy="373.85" rx="2.57" ry="2.45"/>
  <ellipse fill="#394152" cx="11.43" cy="387.13" rx="2.57" ry="2.45"/>
  <ellipse fill="#394152" cx="11.43" cy="400.42" rx="2.57" ry="2.45"/>
  <ellipse fill="#394152" cx="11.43" cy="413.7" rx="2.57" ry="2.45"/>
</svg>

					`,
        },
        {
          title: 'Stats Simple',
          html_code: `<section data-component-title="Header H2" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-font-medium pbx-text-3xl lg:pbx-text-6xl"><h2>Start customizing by editing this default text directly in the editor.</h2></div></div></div></section> <section data-component-title="Stats Split with Image" > <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-2"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square "src="${getPlaceholderImageDataUrl()}" alt="provider"> </div> <div> <div class=""> <p class="pbx-font-semibold">Layouts and visual.</p> </div> <div class="pbx-font-medium pbx-text-2xl lg:pbx-text-4xl"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p></div> <div class="pbx-mt-16 pbx-grid pbx-max-w-xl pbx-grid-cols-1 pbx-gap-8 sm:pbx-mt-20 sm:pbx-grid-cols-2 xl:pbx-mt-16"> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div><p>Layouts and visual.</p></div> <div class="pbx-font-medium pbx-text-lg lg:pbx-text-2xl"><p>8,000+</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div> <p class="pbx-text-sm/6 pbx-text-gray-600">Layouts and visual.</p> </div> <div class="pbx-font-medium pbx-text-lg lg:pbx-text-2xl"><p>3%</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div> <p class="pbx-text-sm/6 pbx-text-gray-600">Layouts and visual.</p> </div> <div class="pbx-text-lg lg:pbx-text-2xl pbx-font-medium"><p>99.9%</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div> <p class="pbx-text-sm/6 pbx-text-gray-600">Layouts and visual.</p> </div> <div class="pbx-text-lg lg:pbx-text-2xl pbx-font-medium"><p>$70M</p></div> </div> </div> </div></div> </div></div> </section> <section data-component-title="Header H3" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Four Square Images With Text" > <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-2 sm:pbx-grid-cols-2 lg:pbx-grid-cols-4"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"><div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 398.96 455.95">
  <g>
    <rect fill="#394152" x="0" y="34.97" width="213.57" height="160.18"/>
    <polygon fill="#718096" points="69.41 131.09 96.11 99.06 122.81 131.09 69.41 131.09"/>
    <polygon fill="#718096" points="117.47 131.09 130.82 115.07 144.17 131.09 117.47 131.09"/>
    <circle fill="#718096" cx="130.82" cy="103.48" r="4.44"/>
  </g>
  <g>
    <g>
      <rect fill="#394152" x="0" y="341.4" width="84.84" height="84.84"/>
      <polygon fill="#718096" points="12.9 396.47 33.99 371.17 55.07 396.47 12.9 396.47"/>
      <polygon fill="#718096" points="50.85 396.47 61.39 383.82 71.92 396.47 50.85 396.47"/>
      <circle fill="#718096" cx="61.39" cy="374.68" r="3.51"/>
    </g>
    <g>
      <rect fill="#394152" x="97.46" y="341.4" width="84.84" height="84.84"/>
      <polygon fill="#718096" points="110.37 396.47 131.44 371.17 152.53 396.47 110.37 396.47"/>
      <polygon fill="#718096" points="148.31 396.47 158.85 383.82 169.39 396.47 148.31 396.47"/>
      <circle fill="#718096" cx="158.85" cy="374.68" r="3.51"/>
    </g>
    <g>
      <rect fill="#394152" x="194.91" y="341.4" width="84.84" height="84.84"/>
      <polygon fill="#718096" points="207.82 396.47 228.88 371.17 249.97 396.47 207.82 396.47"/>
      <polygon fill="#718096" points="245.75 396.47 256.29 383.82 266.84 396.47 245.75 396.47"/>
      <circle fill="#718096" cx="256.29" cy="374.68" r="3.51"/>
    </g>
    <g>
      <rect fill="#394152" x="292.37" y="341.4" width="84.84" height="84.84"/>
      <polygon fill="#718096" points="305.27 396.47 326.34 371.17 347.43 396.47 305.27 396.47"/>
      <polygon fill="#718096" points="343.21 396.47 353.75 383.82 364.29 396.47 343.21 396.47"/>
      <circle fill="#718096" cx="353.75" cy="374.68" r="3.51"/>
    </g>
  </g>
  <rect fill="#394152" x="0" y="240.06" width="129.7" height="7.87"/>
  <rect fill="#394152" x="0" y="0" width="321.57" height="7.87"/>
  <g>
    <rect fill="#394152" x="0" y="278.36" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="265.07" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="291.65" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="304.93" width="234.19" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="0" y="451.05" width="50.85" height="4.91"/>
    <rect fill="#394152" x="0" y="437.76" width="50.85" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="97.46" y="451.05" width="50.85" height="4.91"/>
    <rect fill="#394152" x="97.46" y="437.76" width="50.85" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="194.91" y="451.05" width="50.85" height="4.91"/>
    <rect fill="#394152" x="194.91" y="437.76" width="50.85" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="292.37" y="451.05" width="50.85" height="4.91"/>
    <rect fill="#394152" x="292.37" y="437.76" width="50.85" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="234.19" y="48.26" width="164.77" height="4.91"/>
    <rect fill="#394152" x="234.19" y="34.97" width="164.77" height="4.91"/>
    <rect fill="#394152" x="234.19" y="61.54" width="164.77" height="4.91"/>
    <rect fill="#394152" x="234.19" y="74.83" width="164.77" height="4.91"/>
  </g>
  <rect fill="#394152" x="234.19" y="106.2" width="24.01" height="4.91"/>
  <rect fill="#394152" x="332.19" y="106.2" width="24.01" height="4.91"/>
  <rect fill="#394152" x="234.19" y="135.68" width="24.01" height="4.91"/>
  <rect fill="#394152" x="332.19" y="135.68" width="24.01" height="4.91"/>
</svg>

					`,
        },
        {
          title: 'Job Post',
          html_code: `<section data-component-title="Header H2" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-font-medium pbx-text-3xl lg:pbx-text-6xl"><h2>Layouts and visual.</h2></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Header H3" class="" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" class="" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p><ul><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p><p><br></p></li></ul><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Header H3" class="" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.<br><br>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Three Square Images" > <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 lg:pbx-grid-cols-3"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}"" alt="provider"> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}"" alt="provider"> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}"" alt="provider"></div></div> </div></div> </section>`,
          category: 'Article',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 278.95 369.75">
  <g>
    <rect fill="#394152" y="284.91" width="84.84" height="84.84"/>
    <rect fill="#394152" x="97.79" y="284.91" width="84.84" height="84.84"/>
    <rect fill="#394152" x="194.11" y="284.91" width="84.84" height="84.84"/>
    <polygon fill="#718096" points="12.9 339.98 33.99 314.68 55.07 339.98 12.9 339.98"/>
    <polygon fill="#718096" points="50.85 339.98 61.39 327.33 71.92 339.98 50.85 339.98"/>
    <circle fill="#718096" cx="61.39" cy="318.19" r="3.51"/>
    <polygon fill="#718096" points="110.71 339.98 131.77 314.68 152.86 339.98 110.71 339.98"/>
    <polygon fill="#718096" points="148.64 339.98 159.18 327.33 169.72 339.98 148.64 339.98"/>
    <circle fill="#718096" cx="159.18" cy="318.19" r="3.51"/>
    <polygon fill="#718096" points="207.01 339.98 228.08 314.68 249.17 339.98 207.01 339.98"/>
    <polygon fill="#718096" points="244.95 339.98 255.49 327.33 266.03 339.98 244.95 339.98"/>
    <circle fill="#718096" cx="255.49" cy="318.19" r="3.51"/>
  </g>
  <rect fill="#394152" x="0" y="0" width="129.7" height="7.87"/>
  <rect fill="#394152" x="0" y="108.55" width="58.76" height="7.87"/>
  <g>
    <rect fill="#394152" x="0" y="38.3" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="25.01" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="51.59" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="64.87" width="234.19" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="23.49" y="151.37" width="210.69" height="4.91"/>
    <rect fill="#394152" x="23.49" y="138.09" width="210.69" height="4.91"/>
    <rect fill="#394152" x="23.49" y="164.66" width="210.69" height="4.91"/>
    <rect fill="#394152" x="23.49" y="177.95" width="210.69" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="0" y="224.45" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="211.16" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="237.73" width="234.19" height="4.91"/>
    <rect fill="#394152" x="0" y="251.02" width="234.19" height="4.91"/>
  </g>
  <ellipse fill="#394152" cx="11.43" cy="140.54" rx="2.57" ry="2.45"/>
  <ellipse fill="#394152" cx="11.43" cy="153.83" rx="2.57" ry="2.45"/>
  <ellipse fill="#394152" cx="11.43" cy="167.11" rx="2.57" ry="2.45"/>
  <ellipse fill="#394152" cx="11.43" cy="180.4" rx="2.57" ry="2.45"/>
</svg>

					`,
        },
      ],
    },
  },
]

export default component
