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
          title: 'Article',
          html_code: `<div id="pagebuilder" class=" style=""><section data-component-title="Header H2"><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-font-medium pbx-text-3xl lg:pbx-text-6xl"><h2>Layouts and visual.</h2></div></div></div></section> <section data-component-title="Text"> <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Header H3" class=""><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" class=""> <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p><ul><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p><p><br></p></li></ul><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Header H3" class=""><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text"> <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.<br><br>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section></div>`,
          category: 'Article',
          cover_image: `
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384.06 297.89">
  <defs>
    <style>
      .cls-1 {
        fill: #556177;
      }
    </style>
  </defs>
  <rect class="cls-1" x="0" y="0" width="384.06" height="8.8" rx="4.4" ry="4.4"/>
  <g>
    <rect class="cls-1" x="0" y="47.7" width="306.56" height="7.02" rx="3.51" ry="3.51"/>
    <rect class="cls-1" x="0" y="63.34" width="306.56" height="7.02" rx="3.51" ry="3.51"/>
    <rect class="cls-1" x="0" y="79.95" width="306.56" height="7.02" rx="3.51" ry="3.51"/>
    <rect class="cls-1" x="0" y="95.29" width="306.56" height="7.02" rx="3.51" ry="3.51"/>
  </g>
  <g>
    <rect class="cls-1" x="0" y="222.51" width="154.21" height="8.8" rx="4.4" ry="4.4"/>
    <g>
      <rect class="cls-1" x="0" y="243.28" width="306.56" height="7.02" rx="3.51" ry="3.51"/>
      <rect class="cls-1" x="0" y="258.92" width="306.56" height="7.02" rx="3.51" ry="3.51"/>
      <rect class="cls-1" x="0" y="275.53" width="306.56" height="7.02" rx="3.51" ry="3.51"/>
      <rect class="cls-1" x="0" y="290.87" width="306.56" height="7.02" rx="3.51" ry="3.51"/>
    </g>
  </g>
  <g>
    <rect class="cls-1" x="0" y="141.22" width="237.91" height="5.45" rx="2.72" ry="2.72"/>
    <rect class="cls-1" x="0" y="153.36" width="237.91" height="5.45" rx="2.72" ry="2.72"/>
    <rect class="cls-1" x="0" y="166.24" width="237.91" height="5.45" rx="2.72" ry="2.72"/>
    <rect class="cls-1" x="0" y="178.15" width="237.91" height="5.45" rx="2.72" ry="2.72"/>
  </g>
</svg>
					`,
        },
        {
          title: 'Blog Post',
          html_code: `<section data-component-title="Single Image"> <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-1 lg:pbx-grid-cols-1"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div></div></div> </section> <section data-component-title="Header H2" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-font-medium pbx-text-3xl lg:pbx-text-6xl"><h2>Layouts and visual.</h2></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Header H3" class="" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" class="" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p><ul><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p><p><br></p></li></ul><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Header H3" class="" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.<br><br>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Three Square Images"> <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 lg:pbx-grid-cols-3"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div> </section>`,
          category: 'Article',
          cover_image: `
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 173.53 366.71">
  <defs>
    <style>
      .cls-1 {
        fill: #394152;
      }

      .cls-2 {
        fill: #718096;
      }

      .cls-3 {
        fill: #556177;
      }
    </style>
  </defs>
  <g>
    <rect class="cls-3" x="0" y="154.81" width="173.07" height="3.96" rx="1.98" ry="1.98"/>
    <g>
      <rect class="cls-3" x="0" y="176.31" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
      <rect class="cls-3" x="0" y="183.36" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
      <rect class="cls-3" x="0" y="190.84" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
      <rect class="cls-3" x="0" y="197.75" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
    </g>
    <g>
      <rect class="cls-3" x="0" y="255.08" width="69.49" height="3.96" rx="1.98" ry="1.98"/>
      <g>
        <rect class="cls-3" x="0" y="264.44" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
        <rect class="cls-3" x="0" y="271.49" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
        <rect class="cls-3" x="0" y="278.97" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
        <rect class="cls-3" x="0" y="285.89" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
      </g>
    </g>
    <g>
      <rect class="cls-3" x="0" y="218.45" width="107.21" height="2.46" rx="1.23" ry="1.23"/>
      <rect class="cls-3" x="0" y="223.92" width="107.21" height="2.46" rx="1.23" ry="1.23"/>
      <rect class="cls-3" x="0" y="229.73" width="107.21" height="2.46" rx="1.23" ry="1.23"/>
      <rect class="cls-3" x="0" y="235.09" width="107.21" height="2.46" rx="1.23" ry="1.23"/>
    </g>
  </g>
  <g>
    <rect class="cls-1" x="0" width="173.06" height="129.8"/>
    <polygon class="cls-2" points="56.24 77.89 77.88 51.93 99.51 77.89 56.24 77.89"/>
    <polygon class="cls-2" points="95.19 77.89 106 64.91 116.82 77.89 95.19 77.89"/>
    <circle class="cls-2" cx="106" cy="55.51" r="3.6"/>
  </g>
  <g>
    <rect class="cls-1" x=".45" y="314.07" width="52.64" height="52.64"/>
    <rect class="cls-1" x="61.13" y="314.07" width="52.64" height="52.64"/>
    <rect class="cls-1" x="120.89" y="314.07" width="52.64" height="52.64"/>
    <polygon class="cls-2" points="8.46 348.24 21.54 332.54 34.62 348.24 8.46 348.24"/>
    <polygon class="cls-2" points="32.01 348.24 38.55 340.39 45.08 348.24 32.01 348.24"/>
    <circle class="cls-2" cx="38.55" cy="334.72" r="2.18"/>
    <polygon class="cls-2" points="69.14 348.24 82.21 332.54 95.29 348.24 69.14 348.24"/>
    <polygon class="cls-2" points="92.68 348.24 99.22 340.39 105.76 348.24 92.68 348.24"/>
    <circle class="cls-2" cx="99.22" cy="334.72" r="2.18"/>
    <polygon class="cls-2" points="128.89 348.24 141.97 332.54 155.05 348.24 128.89 348.24"/>
    <polygon class="cls-2" points="152.43 348.24 158.97 340.39 165.51 348.24 152.43 348.24"/>
    <circle class="cls-2" cx="158.97" cy="334.72" r="2.18"/>
  </g>
</svg>
					`,
        },
        {
          title: 'Stats Simple',
          html_code: `<section data-component-title="Header H2" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-font-medium pbx-text-3xl lg:pbx-text-6xl"><h2>Start customizing by editing this default text directly in the editor.</h2></div></div></div></section> <section data-component-title="Stats Split with image" > <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-2"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square "src="${getPlaceholderImageDataUrl()}" alt="provider"> </div> <div> <div class=""> <p class="pbx-font-semibold">Layouts and visual.</p> </div> <div class="pbx-font-medium pbx-text-2xl lg:pbx-text-4xl"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p></div> <div class="pbx-mt-16 pbx-grid pbx-max-w-xl pbx-grid-cols-1 pbx-gap-8 sm:pbx-mt-20 sm:pbx-grid-cols-2 xl:pbx-mt-16"> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div><p>Layouts and visual.</p></div> <div class="pbx-font-medium pbx-text-lg lg:pbx-text-2xl"><p>8,000+</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div> <p class="pbx-text-sm/6 pbx-text-gray-600">Layouts and visual.</p> </div> <div class="pbx-font-medium pbx-text-lg lg:pbx-text-2xl"><p>3%</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div> <p class="pbx-text-sm/6 pbx-text-gray-600">Layouts and visual.</p> </div> <div class="pbx-text-lg lg:pbx-text-2xl pbx-font-medium"><p>99.9%</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div> <p class="pbx-text-sm/6 pbx-text-gray-600">Layouts and visual.</p> </div> <div class="pbx-text-lg lg:pbx-text-2xl pbx-font-medium"><p>$70M</p></div> </div> </div> </div></div> </div></div> </section> <section data-component-title="Header H3" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Four Square Images With Text" > <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-2 sm:pbx-grid-cols-2 lg:pbx-grid-cols-4"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"><div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: `
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 173.22 206.05">
  <defs>
    <style>
      .cls-1 {
        fill: #394152;
      }

      .cls-2 {
        fill: #718096;
      }

      .cls-3 {
        fill: #556177;
      }

      .cls-4 {
        fill: #3a4152;
      }
    </style>
  </defs>
  <rect class="cls-3" x="0" y="0" width="173.07" height="3.96" rx="1.98" ry="1.98"/>
  <g>
    <rect class="cls-3" x="0" y="112.5" width="69.49" height="3.96" rx="1.98" ry="1.98"/>
    <g>
      <rect class="cls-3" x="0" y="121.86" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
      <rect class="cls-3" x="0" y="128.91" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
      <rect class="cls-3" x="0" y="136.39" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
      <rect class="cls-3" x="0" y="143.31" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
    </g>
  </g>
  <g>
    <g>
      <rect class="cls-1" y="24.82" width="89.11" height="66.83"/>
      <polygon class="cls-2" points="28.96 64.92 40.1 51.55 51.24 64.92 28.96 64.92"/>
      <polygon class="cls-2" points="49.01 64.92 54.58 58.24 60.15 64.92 49.01 64.92"/>
      <circle class="cls-2" cx="54.58" cy="53.4" r="1.85"/>
    </g>
    <g>
      <rect class="cls-3" x="94.48" y="24.82" width="78.6" height="2.46" rx="1.23" ry="1.23"/>
      <rect class="cls-3" x="94.48" y="30.28" width="78.6" height="2.46" rx="1.23" ry="1.23"/>
      <rect class="cls-3" x="94.48" y="36.09" width="78.6" height="2.46" rx="1.23" ry="1.23"/>
      <rect class="cls-3" x="94.48" y="41.46" width="78.6" height="2.46" rx="1.23" ry="1.23"/>
    </g>
    <g>
      <rect class="cls-3" x="94.48" y="61.06" width="78.6" height="2.46" rx="1.23" ry="1.23"/>
      <rect class="cls-3" x="94.48" y="66.53" width="78.6" height="2.46" rx="1.23" ry="1.23"/>
      <rect class="cls-3" x="94.48" y="72.34" width="78.6" height="2.46" rx="1.23" ry="1.23"/>
      <rect class="cls-3" x="94.48" y="77.71" width="78.6" height="2.46" rx="1.23" ry="1.23"/>
    </g>
  </g>
  <g>
    <rect class="cls-4" x="0" y="167.33" width="38.72" height="38.72"/>
    <rect class="cls-4" x="44.64" y="167.33" width="38.72" height="38.72"/>
    <rect class="cls-4" x="88.59" y="167.33" width="38.72" height="38.72"/>
    <rect class="cls-4" x="134.49" y="167.33" width="38.72" height="38.72"/>
    <polygon class="cls-2" points="5.89 192.46 15.51 180.91 25.14 192.46 5.89 192.46"/>
    <polygon class="cls-2" points="23.21 192.46 28.02 186.69 32.83 192.46 23.21 192.46"/>
    <circle class="cls-2" cx="28.02" cy="182.51" r="1.6"/>
    <polygon class="cls-2" points="50.53 192.46 60.15 180.91 69.77 192.46 50.53 192.46"/>
    <polygon class="cls-2" points="67.85 192.46 72.65 186.69 77.47 192.46 67.85 192.46"/>
    <circle class="cls-2" cx="72.65" cy="182.51" r="1.6"/>
    <polygon class="cls-2" points="94.48 192.46 104.1 180.91 113.73 192.46 94.48 192.46"/>
    <polygon class="cls-2" points="111.8 192.46 116.61 186.69 121.42 192.46 111.8 192.46"/>
    <circle class="cls-2" cx="116.61" cy="182.51" r="1.6"/>
    <polygon class="cls-2" points="140.38 192.46 150 180.91 159.62 192.46 140.38 192.46"/>
    <polygon class="cls-2" points="157.7 192.46 162.5 186.69 167.32 192.46 157.7 192.46"/>
    <circle class="cls-2" cx="162.5" cy="182.51" r="1.6"/>
  </g>
</svg>
					`,
        },
        {
          title: 'Job Post',
          html_code: `<section data-component-title="Header H2" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-font-medium pbx-text-3xl lg:pbx-text-6xl"><h2>Layouts and visual.</h2></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Header H3" class="" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" class="" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p><ul><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p></li><li><p><strong>Layouts and visual.</strong></p><p><br></p></li></ul><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Header H3" class="" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.<br><br>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </section> <section data-component-title="Three Square Images" > <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 lg:pbx-grid-cols-3"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}"" alt="provider"> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}"" alt="provider"> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}"" alt="provider"></div></div> </div></div> </section>`,
          category: 'Article',
          cover_image: `
<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 173.53 211.89">
  <defs>
    <style>
      .cls-1 {
        fill: #394152;
      }

      .cls-2 {
        fill: #718096;
      }

      .cls-3 {
        fill: #556177;
      }
    </style>
  </defs>
  <g>
    <rect class="cls-3" x="0" y="0" width="173.07" height="3.96" rx="1.98" ry="1.98"/>
    <g>
      <rect class="cls-3" x="0" y="21.5" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
      <rect class="cls-3" x="0" y="28.54" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
      <rect class="cls-3" x="0" y="36.03" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
      <rect class="cls-3" x="0" y="42.94" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
    </g>
    <g>
      <rect class="cls-3" x="0" y="100.27" width="69.49" height="3.96" rx="1.98" ry="1.98"/>
      <g>
        <rect class="cls-3" x="0" y="109.63" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
        <rect class="cls-3" x="0" y="116.68" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
        <rect class="cls-3" x="0" y="124.16" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
        <rect class="cls-3" x="0" y="131.08" width="138.15" height="3.16" rx="1.58" ry="1.58"/>
      </g>
    </g>
    <g>
      <rect class="cls-3" x="0" y="63.64" width="107.21" height="2.46" rx="1.23" ry="1.23"/>
      <rect class="cls-3" x="0" y="69.11" width="107.21" height="2.46" rx="1.23" ry="1.23"/>
      <rect class="cls-3" x="0" y="74.91" width="107.21" height="2.46" rx="1.23" ry="1.23"/>
      <rect class="cls-3" x="0" y="80.28" width="107.21" height="2.46" rx="1.23" ry="1.23"/>
    </g>
  </g>
  <g>
    <rect class="cls-1" x=".45" y="159.26" width="52.64" height="52.64"/>
    <rect class="cls-1" x="61.13" y="159.26" width="52.64" height="52.64"/>
    <rect class="cls-1" x="120.89" y="159.26" width="52.64" height="52.64"/>
    <polygon class="cls-2" points="8.46 193.42 21.54 177.73 34.62 193.42 8.46 193.42"/>
    <polygon class="cls-2" points="32.01 193.42 38.55 185.58 45.08 193.42 32.01 193.42"/>
    <circle class="cls-2" cx="38.55" cy="179.9" r="2.18"/>
    <polygon class="cls-2" points="69.14 193.42 82.21 177.73 95.29 193.42 69.14 193.42"/>
    <polygon class="cls-2" points="92.68 193.42 99.22 185.58 105.76 193.42 92.68 193.42"/>
    <circle class="cls-2" cx="99.22" cy="179.9" r="2.18"/>
    <polygon class="cls-2" points="128.89 193.42 141.97 177.73 155.05 193.42 128.89 193.42"/>
    <polygon class="cls-2" points="152.43 193.42 158.97 185.58 165.51 193.42 152.43 193.42"/>
    <circle class="cls-2" cx="158.97" cy="179.9" r="2.18"/>
  </g>
</svg>
					`,
        },
      ],
    },
  },
]

export default component
