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
          html_code: `<div id="pagebuilder" class=" style=""><section data-component-title="Header H2"><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-font-medium pbx-text-3xl lg:pbx-text-6xl"><h2>Inceptos himenaeos</h2></div></div></div></section> <section data-component-title="Text"> <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra.<br><br>Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p></div> </div> </div> </section> <section data-component-title="Header H3" class=""><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Fringilla lacus nec metus</h3></div></div></div></section> <section data-component-title="Text" class=""> <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra.</p><ul><li><p><strong>Blorf nizgat quarnip veloop</strong></p></li><li><p><strong>Dramble froop with lartic spindles</strong></p></li><li><p><strong>Quibber on flemt zarglo dynamics</strong></p></li><li><p><strong>Slooped jarnix under flibble zones</strong></p></li><li><p><strong>Plonk-ready trizzit with garm logic</strong></p><p><br></p></li></ul><p>Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p></div> </div> </div> </section> <section data-component-title="Header H3" class=""><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Conubia nostra inceptos</h3></div></div></div></section> <section data-component-title="Text"> <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. <br><br>Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. <br><br>Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p></div> </div> </div> </section></div>`,
          category: 'Article',
          cover_image: `
<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 173.22 194.23">
  <defs>
    <style>
      .cls-1 {
        fill: #394152;
      }
    </style>
  </defs>
  <rect class="cls-1" width="173.22" height="3.17"/>
  <g>
    <rect class="cls-1" x="1.1" y="44.85" width="98.88" height="3.05"/>
    <g>
      <rect class="cls-1" x="1.1" y="49.02" width="98.88" height="3.05"/>
      <rect class="cls-1" x="1.1" y="53.17" width="98.88" height="3.05"/>
      <rect class="cls-1" x="1.1" y="57.33" width="98.88" height="3.05"/>
      <rect class="cls-1" x="1.1" y="61.5" width="98.88" height="3.05"/>
    </g>
  </g>
  <g>
    <rect class="cls-1" x="1.1" y="75.16" width="98.88" height="3.05"/>
    <g>
      <rect class="cls-1" x="1.1" y="79.32" width="98.88" height="3.05"/>
      <rect class="cls-1" x="1.1" y="83.48" width="98.88" height="3.05"/>
      <rect class="cls-1" x="1.1" y="87.64" width="98.88" height="3.05"/>
      <rect class="cls-1" x="1.1" y="91.8" width="98.88" height="3.05"/>
    </g>
  </g>
  <g>
    <g>
      <rect class="cls-1" x="53.74" y="126.25" width="46.24" height="1.57"/>
      <g>
        <rect class="cls-1" x="53.74" y="128.4" width="46.24" height="1.57"/>
        <rect class="cls-1" x="53.74" y="130.54" width="46.24" height="1.57"/>
        <rect class="cls-1" x="53.74" y="132.69" width="46.24" height="1.57"/>
        <rect class="cls-1" x="53.74" y="134.84" width="46.24" height="1.57"/>
      </g>
    </g>
    <g>
      <rect class="cls-1" x="1.1" y="126.25" width="46.24" height="1.57"/>
      <g>
        <rect class="cls-1" x="1.1" y="128.4" width="46.24" height="1.57"/>
        <rect class="cls-1" x="1.1" y="130.54" width="46.24" height="1.57"/>
        <rect class="cls-1" x="1.1" y="132.69" width="46.24" height="1.57"/>
        <rect class="cls-1" x="1.1" y="134.84" width="46.24" height="1.57"/>
      </g>
    </g>
  </g>
  <g>
    <g>
      <rect class="cls-1" x="53.74" y="105.47" width="46.24" height="1.57"/>
      <g>
        <rect class="cls-1" x="53.74" y="107.62" width="46.24" height="1.57"/>
        <rect class="cls-1" x="53.74" y="109.76" width="46.24" height="1.57"/>
        <rect class="cls-1" x="53.74" y="111.91" width="46.24" height="1.57"/>
        <rect class="cls-1" x="53.74" y="114.06" width="46.24" height="1.57"/>
      </g>
    </g>
    <g>
      <rect class="cls-1" x="1.1" y="105.47" width="46.24" height="1.57"/>
      <g>
        <rect class="cls-1" x="1.1" y="107.62" width="46.24" height="1.57"/>
        <rect class="cls-1" x="1.1" y="109.76" width="46.24" height="1.57"/>
        <rect class="cls-1" x="1.1" y="111.91" width="46.24" height="1.57"/>
        <rect class="cls-1" x="1.1" y="114.06" width="46.24" height="1.57"/>
      </g>
    </g>
  </g>
  <g>
    <rect class="cls-1" y="13.78" width="138.31" height="3.17"/>
    <g>
      <rect class="cls-1" y="18.11" width="138.31" height="3.17"/>
      <rect class="cls-1" y="22.42" width="138.31" height="3.17"/>
      <rect class="cls-1" y="26.75" width="138.31" height="3.17"/>
      <rect class="cls-1" y="31.07" width="138.31" height="3.17"/>
    </g>
  </g>
  <g>
    <rect class="cls-1" y="147.03" width="109.07" height="2.5"/>
    <g>
      <rect class="cls-1" y="150.44" width="109.07" height="2.5"/>
      <rect class="cls-1" y="153.84" width="109.07" height="2.5"/>
      <rect class="cls-1" y="157.25" width="109.07" height="2.5"/>
      <rect class="cls-1" y="160.66" width="109.07" height="2.5"/>
    </g>
  </g>
  <g>
    <rect class="cls-1" y="173.78" width="138.31" height="3.17"/>
    <g>
      <rect class="cls-1" y="178.1" width="138.31" height="3.17"/>
      <rect class="cls-1" y="182.41" width="138.31" height="3.17"/>
      <rect class="cls-1" y="186.74" width="138.31" height="3.17"/>
      <rect class="cls-1" y="191.06" width="138.31" height="3.17"/>
    </g>
  </g>
</svg>
					`,
        },
        {
          title: 'Blog Post',
          html_code: `<section data-component-title="Single Image"> <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-1 lg:pbx-grid-cols-1"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div></div></div> </section> <section data-component-title="Header H2" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-font-medium pbx-text-3xl lg:pbx-text-6xl"><h2>Inceptos himenaeos</h2></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra.<br><br>Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p></div> </div> </div> </section> <section data-component-title="Header H3" class="" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Fringilla lacus nec metus</h3></div></div></div></section> <section data-component-title="Text" class="" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra.</p><ul><li><p><strong>Blorf nizgat quarnip veloop</strong></p></li><li><p><strong>Dramble froop with lartic spindles</strong></p></li><li><p><strong>Quibber on flemt zarglo dynamics</strong></p></li><li><p><strong>Slooped jarnix under flibble zones</strong></p></li><li><p><strong>Plonk-ready trizzit with garm logic</strong></p><p><br></p></li></ul><p>Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p></div> </div> </div> </section> <section data-component-title="Header H3" class="" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Conubia nostra inceptos</h3></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. <br><br>Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. <br><br>Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p></div> </div> </div> </section> <section data-component-title="Three Square Images"> <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-3 lg:pbx-grid-cols-3"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div> </section>`,
          category: 'Article',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 173.07 283.49">
  <defs>
    <style>
      .cls-1 {
        fill: #394152;
      }

      .cls-2 {
        fill: #718096;
      }
    </style>
  </defs>
  <g>
    <rect class="cls-1" width="173.06" height="129.8"/>
    <polygon class="cls-2" points="56.24 77.89 77.88 51.93 99.51 77.89 56.24 77.89"/>
    <polygon class="cls-2" points="95.19 77.89 106 64.91 116.82 77.89 95.19 77.89"/>
    <circle class="cls-2" cx="106" cy="55.51" r="3.6"/>
  </g>
  <g>
    <rect class="cls-1" y="140.8" width="138.31" height="3.17"/>
    <g>
      <rect class="cls-1" y="145.12" width="138.31" height="3.17"/>
      <rect class="cls-1" y="149.44" width="138.31" height="3.17"/>
      <rect class="cls-1" y="153.76" width="138.31" height="3.17"/>
      <rect class="cls-1" y="158.09" width="138.31" height="3.17"/>
    </g>
  </g>
  <g>
    <rect class="cls-1" y="172.26" width="109.07" height="2.5"/>
    <g>
      <rect class="cls-1" y="175.67" width="109.07" height="2.5"/>
      <rect class="cls-1" y="179.07" width="109.07" height="2.5"/>
      <rect class="cls-1" y="182.48" width="109.07" height="2.5"/>
      <rect class="cls-1" y="185.89" width="109.07" height="2.5"/>
    </g>
  </g>
  <g>
    <rect class="cls-1" y="199.39" width="138.31" height="3.17"/>
    <g>
      <rect class="cls-1" y="203.72" width="138.31" height="3.17"/>
      <rect class="cls-1" y="208.03" width="138.31" height="3.17"/>
      <rect class="cls-1" y="212.36" width="138.31" height="3.17"/>
      <rect class="cls-1" y="216.68" width="138.31" height="3.17"/>
    </g>
  </g>
  <g>
    <rect class="cls-1" y="230.85" width="52.64" height="52.64"/>
    <rect class="cls-1" x="60.67" y="230.85" width="52.64" height="52.64"/>
    <rect class="cls-1" x="120.44" y="230.85" width="52.64" height="52.64"/>
    <polygon class="cls-2" points="8 265.02 21.09 249.32 34.17 265.02 8 265.02"/>
    <polygon class="cls-2" points="31.55 265.02 38.09 257.17 44.62 265.02 31.55 265.02"/>
    <circle class="cls-2" cx="38.09" cy="251.5" r="2.18"/>
    <polygon class="cls-2" points="68.69 265.02 81.76 249.32 94.84 265.02 68.69 265.02"/>
    <polygon class="cls-2" points="92.22 265.02 98.76 257.17 105.3 265.02 92.22 265.02"/>
    <circle class="cls-2" cx="98.76" cy="251.5" r="2.18"/>
    <polygon class="cls-2" points="128.44 265.02 141.51 249.32 154.59 265.02 128.44 265.02"/>
    <polygon class="cls-2" points="151.98 265.02 158.52 257.17 165.06 265.02 151.98 265.02"/>
    <circle class="cls-2" cx="158.52" cy="251.5" r="2.18"/>
  </g>
</svg>
					`,
        },
        {
          title: 'Stats Simple',
          html_code: `<section data-component-title="Header H2" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-font-medium pbx-text-3xl lg:pbx-text-6xl"><h2>Eaque, iste dolor cupiditate blanditiis ratione</h2></div></div></div></section> <section data-component-title="Stats Split with image" > <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-2"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square "src="${getPlaceholderImageDataUrl()}" alt="provider"> </div> <div> <div class=""> <p class="pbx-font-semibold">Our track record</p> </div> <div class="pbx-font-medium pbx-text-2xl lg:pbx-text-4xl"><p>Trusted by thousands of creators worldwide</p></div> <div><p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.</p></div> <div class="pbx-mt-16 pbx-grid pbx-max-w-xl pbx-grid-cols-1 pbx-gap-8 sm:pbx-mt-20 sm:pbx-grid-cols-2 xl:pbx-mt-16"> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div><p>Creators on the platform</p></div> <div class="pbx-font-medium pbx-text-lg lg:pbx-text-2xl"><p>8,000+</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div> <p class="pbx-text-sm/6 pbx-text-gray-600">Flat platform fee</p> </div> <div class="pbx-font-medium pbx-text-lg lg:pbx-text-2xl"><p>3%</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div> <p class="pbx-text-sm/6 pbx-text-gray-600">Uptime guarantee</p> </div> <div class="pbx-text-lg lg:pbx-text-2xl pbx-font-medium"><p>99.9%</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div> <p class="pbx-text-sm/6 pbx-text-gray-600">Paid out to creators</p> </div> <div class="pbx-text-lg lg:pbx-text-2xl pbx-font-medium"><p>$70M</p></div> </div> </div> </div></div> </div></div> </section> <section data-component-title="Header H3" ><div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"><div class="pbx-break-words pbx-text-1xl lg:pbx-text-3xl pbx-font-medium"><h3>Layouts and visual.</h3></div></div></div></section> <section data-component-title="Text" > <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div><p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione. Dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione. Cadipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.</p></div> </div> </div> </section> <section data-component-title="Four Square Images With Text" > <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-2 sm:pbx-grid-cols-2 lg:pbx-grid-cols-4"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"><div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 173.22 169.31">
  <defs>
    <style>
      .cls-1 {
        fill: #394152;
      }

      .cls-2 {
        fill: #718096;
      }

      .cls-3 {
        fill: #3a4152;
      }
    </style>
  </defs>
  <rect class="cls-1" width="173.22" height="3.17"/>
  <rect class="cls-1" y="88.48" width="138.31" height="3.17"/>
  <g>
    <rect class="cls-1" y="100.89" width="138.31" height="3.17"/>
    <g>
      <rect class="cls-1" y="105.21" width="138.31" height="3.17"/>
      <rect class="cls-1" y="109.53" width="138.31" height="3.17"/>
      <rect class="cls-1" y="113.85" width="138.31" height="3.17"/>
      <rect class="cls-1" y="118.18" width="138.31" height="3.17"/>
    </g>
  </g>
  <g>
    <g>
      <rect class="cls-1" y="12.41" width="89.11" height="66.83"/>
      <polygon class="cls-2" points="28.96 52.51 40.1 39.15 51.24 52.51 28.96 52.51"/>
      <polygon class="cls-2" points="49.01 52.51 54.58 45.83 60.15 52.51 49.01 52.51"/>
      <circle class="cls-2" cx="54.58" cy="40.99" r="1.85"/>
    </g>
    <g>
      <rect class="cls-1" x="92.22" y="12.41" width="81" height="2.5"/>
      <g>
        <rect class="cls-1" x="92.22" y="15.82" width="81" height="2.5"/>
        <rect class="cls-1" x="92.22" y="19.22" width="81" height="2.5"/>
        <rect class="cls-1" x="92.22" y="22.63" width="81" height="2.5"/>
        <rect class="cls-1" x="92.22" y="26.04" width="81" height="2.5"/>
      </g>
    </g>
    <g>
      <rect class="cls-1" x="92.22" y="34.51" width="81" height="2.5"/>
      <g>
        <rect class="cls-1" x="92.22" y="37.92" width="81" height="2.5"/>
        <rect class="cls-1" x="92.22" y="41.32" width="81" height="2.5"/>
        <rect class="cls-1" x="92.22" y="44.73" width="81" height="2.5"/>
        <rect class="cls-1" x="92.22" y="48.14" width="81" height="2.5"/>
      </g>
    </g>
    <g>
      <g>
        <rect class="cls-1" x="135.34" y="70.91" width="37.88" height="1.29"/>
        <g>
          <rect class="cls-1" x="135.34" y="72.67" width="37.88" height="1.29"/>
          <rect class="cls-1" x="135.34" y="74.43" width="37.88" height="1.29"/>
          <rect class="cls-1" x="135.34" y="76.19" width="37.88" height="1.29"/>
          <rect class="cls-1" x="135.34" y="77.95" width="37.88" height="1.29"/>
        </g>
      </g>
      <g>
        <rect class="cls-1" x="92.22" y="70.91" width="37.88" height="1.29"/>
        <g>
          <rect class="cls-1" x="92.22" y="72.67" width="37.88" height="1.29"/>
          <rect class="cls-1" x="92.22" y="74.43" width="37.88" height="1.29"/>
          <rect class="cls-1" x="92.22" y="76.19" width="37.88" height="1.29"/>
          <rect class="cls-1" x="92.22" y="77.95" width="37.88" height="1.29"/>
        </g>
      </g>
    </g>
    <g>
      <g>
        <rect class="cls-1" x="135.34" y="56.61" width="37.88" height="1.29"/>
        <g>
          <rect class="cls-1" x="135.34" y="58.37" width="37.88" height="1.29"/>
          <rect class="cls-1" x="135.34" y="60.13" width="37.88" height="1.29"/>
          <rect class="cls-1" x="135.34" y="61.89" width="37.88" height="1.29"/>
          <rect class="cls-1" x="135.34" y="63.65" width="37.88" height="1.29"/>
        </g>
      </g>
      <g>
        <rect class="cls-1" x="92.22" y="56.61" width="37.88" height="1.29"/>
        <g>
          <rect class="cls-1" x="92.22" y="58.37" width="37.88" height="1.29"/>
          <rect class="cls-1" x="92.22" y="60.13" width="37.88" height="1.29"/>
          <rect class="cls-1" x="92.22" y="61.89" width="37.88" height="1.29"/>
          <rect class="cls-1" x="92.22" y="63.65" width="37.88" height="1.29"/>
        </g>
      </g>
    </g>
  </g>
  <g>
    <rect class="cls-3" x="0" y="130.58" width="38.72" height="38.72"/>
    <rect class="cls-3" x="44.64" y="130.58" width="38.72" height="38.72"/>
    <rect class="cls-3" x="88.59" y="130.58" width="38.72" height="38.72"/>
    <rect class="cls-3" x="134.49" y="130.58" width="38.72" height="38.72"/>
    <polygon class="cls-2" points="5.89 155.72 15.51 144.17 25.14 155.72 5.89 155.72"/>
    <polygon class="cls-2" points="23.21 155.72 28.02 149.95 32.83 155.72 23.21 155.72"/>
    <circle class="cls-2" cx="28.02" cy="145.77" r="1.6"/>
    <polygon class="cls-2" points="50.53 155.72 60.15 144.17 69.77 155.72 50.53 155.72"/>
    <polygon class="cls-2" points="67.85 155.72 72.65 149.95 77.47 155.72 67.85 155.72"/>
    <circle class="cls-2" cx="72.65" cy="145.77" r="1.6"/>
    <polygon class="cls-2" points="94.48 155.72 104.1 144.17 113.73 155.72 94.48 155.72"/>
    <polygon class="cls-2" points="111.8 155.72 116.61 149.95 121.42 155.72 111.8 155.72"/>
    <circle class="cls-2" cx="116.61" cy="145.77" r="1.6"/>
    <polygon class="cls-2" points="140.38 155.72 150 144.17 159.62 155.72 140.38 155.72"/>
    <polygon class="cls-2" points="157.7 155.72 162.5 149.95 167.32 155.72 157.7 155.72"/>
    <circle class="cls-2" cx="162.5" cy="145.77" r="1.6"/>
  </g>
</svg>
					`,
        },
      ],
    },
  },
]

export default component
