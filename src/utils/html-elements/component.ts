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
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="125.5201 272.4783 227.6296 170.7227" width="227.63px" height="170.723px">
                        <g transform="matrix(2.0564050674438477, 0, 0, 2.0564050674438477, -299.93572998046875, 191.27296447753906)" style="">
                          <rect class="bg" width="110.693" height="83.02" style="fill: rgb(56, 65, 82); stroke-width: 1;" x="206.893" y="39.489"/>
                          <polygon class="fg" points="242.868 89.308 256.705 72.703 270.543 89.308" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                          <polygon class="fg" points="267.776 89.308 274.694 81.005 281.614 89.308" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                          <circle class="fg" cx="274.694" cy="74.995" r="2.303" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        </g>
                      </svg>
        `,
        },
        {
          title: 'Two Vertical Images',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div>   </div> </div> </div>\n</section>`,
          category: 'Images',
          cover_image: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="77.1285 230.6534 251.166 229.0848" width="251.166px" height="229.085px">
                      <g transform="matrix(1.876052975654602, 0, 0, 1.876052975654602, 77.12846374511719, 230.65336608886716)" style="">
                        <rect class="cls-1" width="63.93" height="122.11" style="fill: rgb(56, 65, 82);"/>
                        <g>
                          <polygon class="cls-2" points="8.68 71.04 25.31 51.08 41.94 71.04 8.68 71.04" style="fill: rgb(113, 128, 150);"/>
                          <polygon class="cls-2" points="38.62 71.04 46.93 61.06 55.24 71.04 38.62 71.04" style="fill: rgb(113, 128, 150);"/>
                          <circle class="cls-2" cx="46.93" cy="53.84" r="2.77" style="fill: rgb(113, 128, 150);"/>
                        </g>
                      </g>
                      <g transform="matrix(1.876052975654602, 0, 0, 1.876052975654602, 77.12846374511719, 230.65336608886716)" style="">
                        <rect class="cls-1" x="69.95" width="63.93" height="122.11" style="fill: rgb(56, 65, 82);"/>
                        <g>
                          <polygon class="cls-2" points="78.64 71.04 95.27 51.08 111.89 71.04 78.64 71.04" style="fill: rgb(113, 128, 150);"/>
                          <polygon class="cls-2" points="108.57 71.04 116.88 61.06 125.2 71.04 108.57 71.04" style="fill: rgb(113, 128, 150);"/>
                          <circle class="cls-2" cx="116.88" cy="53.84" r="2.77" style="fill: rgb(113, 128, 150);"/>
                        </g>
                      </g>
                    </svg>
                    `,
        },
        {
          title: 'Two Square Images',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div>\n</section>`,
          category: 'Images',
          cover_image: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120.18 57.68">
                      <g>
                        <rect width="57.68" height="57.68" style="fill:#384152;"/>
                        <g>
                          <polygon points="8.77 37.45 23.11 20.25 37.44 37.45 8.77 37.45" style="fill:#718096;"/>
                          <polygon points="34.58 37.45 41.74 28.85 48.91 37.45 34.58 37.45" style="fill:#718096;"/>
                          <circle cx="41.74" cy="22.62" r="2.39" style="fill:#718096;"/>
                        </g>
                      </g>
                      <g>
                        <rect x="62.5" width="57.68" height="57.68" style="fill:#384152;"/>
                        <g>
                          <polygon points="71.27 37.45 85.61 20.25 99.94 37.45 71.27 37.45" style="fill:#718096;"/>
                          <polygon points="97.07 37.45 104.24 28.85 111.41 37.45 97.07 37.45" style="fill:#718096;"/>
                          <circle cx="104.24" cy="22.62" r="2.39" style="fill:#718096;"/>
                        </g>
                      </g>
                    </svg>
                    `,
        },
        {
          title: 'Three Square Images',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div>\n</section>`,
          category: 'Images',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 177.28 53.92">
                        <defs>
                          <style>
                            .bg { fill: #384152; }
                            .fg { fill: #718096; }
                          </style>
                        </defs>
                        <rect class="bg" width="53.92" height="53.92"/>
                        <rect class="bg" x="62.15" width="53.92" height="53.92"/>
                        <rect class="bg" x="123.37" width="53.92" height="53.92"/>
                        <polygon class="fg" points="8.2 35 21.6 18.92 35 35"/>
                        <polygon class="fg" points="32.32 35 39.02 26.96 45.71 35"/>
                        <circle class="fg" cx="39.02" cy="21.15" r="2.23"/>
                        <polygon class="fg" points="70.36 35 83.75 18.92 97.15 35"/>
                        <polygon class="fg" points="94.47 35 101.17 26.96 107.87 35"/>
                        <circle class="fg" cx="101.17" cy="21.15" r="2.23"/>
                        <polygon class="fg" points="131.57 35 144.96 18.92 158.36 35"/>
                        <polygon class="fg" points="155.68 35 162.38 26.96 169.08 35"/>
                        <circle class="fg" cx="162.38" cy="21.15" r="2.23"/>
                      </svg>
                    `,
        },
        {
          title: 'Four Square Images',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"> <div><img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> <div><img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> <div><img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> <div><img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> </div> </div> </div>\n</section>`,
          category: 'Images',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190.34 42.55">
                        <rect width="42.55" height="42.55" style="fill:#394152;"/>
                        <rect x="49.05" width="42.55" height="42.55" style="fill:#394152;"/>
                        <rect x="97.35" width="42.55" height="42.55" style="fill:#394152;"/>
                        <rect x="147.79" width="42.55" height="42.55" style="fill:#394152;"/>
                        <polygon points="6.47 27.62 17.04 14.93 27.62 27.62 6.47 27.62" style="fill:#718096;"/>
                        <polygon points="25.5 27.62 30.79 21.28 36.07 27.62 25.5 27.62" style="fill:#718096;"/>
                        <circle cx="30.79" cy="16.69" r="1.76" style="fill:#718096;"/>
                        <polygon points="55.52 27.62 66.09 14.93 76.66 27.62 55.52 27.62" style="fill:#718096;"/>
                        <polygon points="74.55 27.62 79.83 21.28 85.12 27.62 74.55 27.62" style="fill:#718096;"/>
                        <circle cx="79.83" cy="16.69" r="1.76" style="fill:#718096;"/>
                        <polygon points="103.82 27.62 114.39 14.93 124.97 27.62 103.82 27.62" style="fill:#718096;"/>
                        <polygon points="122.85 27.62 128.14 21.28 133.42 27.62 122.85 27.62" style="fill:#718096;"/>
                        <circle cx="128.14" cy="16.69" r="1.76" style="fill:#718096;"/>
                        <polygon points="154.26 27.62 164.83 14.93 175.4 27.62 154.26 27.62" style="fill:#718096;"/>
                        <polygon points="173.29 27.62 178.57 21.28 183.86 27.62 173.29 27.62" style="fill:#718096;"/>
                        <circle cx="178.57" cy="16.69" r="1.76" style="fill:#718096;"/>
                      </svg>

                    `,
        },
        {
          title: 'Six Square Images Grid',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2">\n<div class="pbx-mx-auto pbx-max-w-7xl">\n<div class="grid grid-cols-2 md:grid-cols-3 myPrimaryGap">\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n</div>\n</div>\n</div>\n</section>`,
          category: 'Images',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 177.28 120.27">
                        <defs>
                          <style>
                            .bg { fill: #384152; }
                            .fg { fill: #718096; }
                          </style>
                        </defs>
                        <rect class="bg" width="53.92" height="53.92"/>
                        <rect class="bg" x="62.15" width="53.92" height="53.92"/>
                        <rect class="bg" x="123.37" width="53.92" height="53.92"/>
                        <rect class="bg" y="66.35" width="53.92" height="53.92"/>
                        <rect class="bg" x="62.15" y="66.35" width="53.92" height="53.92"/>
                        <rect class="bg" x="123.37" y="66.35" width="53.92" height="53.92"/>
                        <polygon class="fg" points="8.2 35 21.6 18.92 35 35"/>
                        <polygon class="fg" points="32.32 35 39.02 26.96 45.71 35"/>
                        <circle class="fg" cx="39.02" cy="21.15" r="2.23"/>
                        <polygon class="fg" points="70.36 35 83.75 18.92 97.15 35"/>
                        <polygon class="fg" points="94.47 35 101.17 26.96 107.87 35"/>
                        <circle class="fg" cx="101.17" cy="21.15" r="2.23"/>
                        <polygon class="fg" points="131.57 35 144.96 18.92 158.36 35"/>
                        <polygon class="fg" points="155.68 35 162.38 26.96 169.08 35"/>
                        <circle class="fg" cx="162.38" cy="21.15" r="2.23"/>
                        <polygon class="fg" points="8.2 101.35 21.6 85.28 35 101.35"/>
                        <polygon class="fg" points="32.32 101.35 39.02 93.32 45.71 101.35"/>
                        <circle class="fg" cx="39.02" cy="87.5" r="2.23"/>
                        <polygon class="fg" points="70.36 101.35 83.75 85.28 97.15 101.35"/>
                        <polygon class="fg" points="94.47 101.35 101.17 93.32 107.87 101.35"/>
                        <circle class="fg" cx="101.17" cy="87.5" r="2.23"/>
                        <polygon class="fg" points="131.57 101.35 144.96 85.28 158.36 101.35"/>
                        <polygon class="fg" points="155.68 101.35 162.38 93.32 169.08 101.35"/>
                        <circle class="fg" cx="162.38" cy="87.5" r="2.23"/>
                      </svg>
                    `,
        },
        {
          title: 'Two Square Images With Text',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl">\n<div class="myPrimaryGap lg:flex lg:justify-center"><div class="flex-1 py-2">\n<div class="grid myPrimaryGap grid-cols-1 lg:grid-cols-2"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div>   </div> </div>\n\n<div class="flex-1 py-2"> <div class="break-words py-2"><p>Start customizing by editing this default text directly in the editor.</p></div></div> \n</div></div></div>\n</section>`,
          category: 'Images & Text',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 179.99 53.92">
                        <defs>
                          <style>
                            .bg { fill: #384152; }
                            .fg { fill: #718096; }
                          </style>
                        </defs>
                        <rect class="bg" width="53.92" height="53.92"/>
                        <rect class="bg" x="62.15" width="53.92" height="53.92"/>
                        <polygon class="fg" points="8.2 35 21.6 18.92 35 35"/>
                        <polygon class="fg" points="32.32 35 39.02 26.96 45.71 35"/>
                        <circle class="fg" cx="39.02" cy="21.15" r="2.23"/>
                        <polygon class="fg" points="70.36 35 83.75 18.92 97.15 35"/>
                        <polygon class="fg" points="94.47 35 101.17 26.96 107.87 35"/>
                        <circle class="fg" cx="101.17" cy="21.15" r="2.23"/>
                        <rect class="bg" x="126.07" width="53.92" height="2.93"/>
                        <rect class="bg" x="126.07" y="4" width="53.92" height="2.93"/>
                        <rect class="bg" x="126.07" y="7.99" width="53.92" height="2.93"/>
                        <rect class="bg" x="126.07" y="11.99" width="53.92" height="2.93"/>
                        <rect class="bg" x="126.07" y="15.99" width="53.92" height="2.93"/>
                      </svg>
                    `,
        },
        {
          title: 'Three Vertical Images',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div>\n</section>`,
          category: 'Images',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 179.84 110.72">
                        <defs>
                          <style>
                            .bg { fill: #384152; }
                            .fg { fill: #718096; }
                          </style>
                        </defs>
                        <rect class="bg" width="54.28" height="110.72"/>
                        <rect class="bg" x="62.79" width="54.28" height="110.72"/>
                        <rect class="bg" x="125.56" width="54.28" height="110.72"/>
                        <polygon class="fg" points="7.37 63.83 21.49 46.89 35.61 63.83"/>
                        <polygon class="fg" points="32.79 63.83 39.85 55.36 46.91 63.83"/>
                        <circle class="fg" cx="39.85" cy="49.23" r="2.35"/>
                        <polygon class="fg" points="70.17 63.83 84.29 46.89 98.4 63.83"/>
                        <polygon class="fg" points="95.58 63.83 102.64 55.36 109.7 63.83"/>
                        <circle class="fg" cx="102.64" cy="49.23" r="2.35"/>
                        <polygon class="fg" points="132.94 63.83 147.06 46.89 161.18 63.83"/>
                        <polygon class="fg" points="158.35 63.83 165.41 55.36 172.47 63.83"/>
                        <circle class="fg" cx="165.41" cy="49.23" r="2.35"/>
                      </svg>
                    `,
        },
        {
          title: 'Four Square Images With Text',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"><div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div>\n</section>`,
          category: 'Images & Text',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190.33 55.9">
                        <defs>
                          <style>
                            .bg { fill: #384152; }
                            .fg { fill: #718096; }
                          </style>
                        </defs>
                        <rect class="bg" width="42.55" height="42.55"/>
                        <rect class="bg" x="49.05" width="42.55" height="42.55"/>
                        <rect class="bg" x="97.35" width="42.55" height="42.55"/>
                        <rect class="bg" x="147.79" width="42.55" height="42.55"/>
                        <polygon class="fg" points="6.47 27.62 17.04 14.93 27.62 27.62"/>
                        <polygon class="fg" points="25.5 27.62 30.79 21.28 36.07 27.62"/>
                        <circle class="fg" cx="30.79" cy="16.69" r="1.76"/>
                        <polygon class="fg" points="55.52 27.62 66.09 14.93 76.66 27.62"/>
                        <polygon class="fg" points="74.55 27.62 79.83 21.28 85.12 27.62"/>
                        <circle class="fg" cx="79.83" cy="16.69" r="1.76"/>
                        <polygon class="fg" points="103.82 27.62 114.39 14.93 124.97 27.62"/>
                        <polygon class="fg" points="122.85 27.62 128.14 21.28 133.42 27.62"/>
                        <circle class="fg" cx="128.14" cy="16.69" r="1.76"/>
                        <polygon class="fg" points="154.26 27.62 164.83 14.93 175.4 27.62"/>
                        <polygon class="fg" points="173.29 27.62 178.57 21.28 183.86 27.62"/>
                        <circle class="fg" cx="178.57" cy="16.69" r="1.76"/>
                        <rect class="bg" y="47.28" width="42.55" height="2.31"/>
                        <rect class="bg" y="50.43" width="42.55" height="2.31"/>
                        <rect class="bg" y="53.59" width="42.55" height="2.31"/>
                        <rect class="bg" x="49.05" y="47.28" width="42.55" height="2.31"/>
                        <rect class="bg" x="49.05" y="50.43" width="42.55" height="2.31"/>
                        <rect class="bg" x="49.05" y="53.59" width="42.55" height="2.31"/>
                        <rect class="bg" x="97.35" y="47.28" width="42.55" height="2.31"/>
                        <rect class="bg" x="97.35" y="50.43" width="42.55" height="2.31"/>
                        <rect class="bg" x="97.35" y="53.59" width="42.55" height="2.31"/>
                        <rect class="bg" x="147.79" y="47.28" width="42.55" height="2.31"/>
                        <rect class="bg" x="147.79" y="50.43" width="42.55" height="2.31"/>
                        <rect class="bg" x="147.79" y="53.59" width="42.55" height="2.31"/>
                      </svg>
                    `,
        },
        {
          title: 'Three Square Images With Text',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div>  </div> </div> </div>\n</section>`,
          category: 'Images & Text',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 177.28 70.84">
                        <defs>
                          <style>
                            .bg { fill: #384152; }
                            .fg { fill: #718096; }
                          </style>
                        </defs>
                        <rect class="bg" width="53.92" height="53.92"/>
                        <rect class="bg" x="62.15" width="53.92" height="53.92"/>
                        <rect class="bg" x="123.37" width="53.92" height="53.92"/>
                        <polygon class="fg" points="8.2 35 21.6 18.92 35 35"/>
                        <polygon class="fg" points="32.32 35 39.02 26.96 45.71 35"/>
                        <circle class="fg" cx="39.02" cy="21.15" r="2.23"/>
                        <polygon class="fg" points="70.36 35 83.75 18.92 97.15 35"/>
                        <polygon class="fg" points="94.47 35 101.17 26.96 107.87 35"/>
                        <circle class="fg" cx="101.17" cy="21.15" r="2.23"/>
                        <polygon class="fg" points="131.57 35 144.96 18.92 158.36 35"/>
                        <polygon class="fg" points="155.68 35 162.38 26.96 169.08 35"/>
                        <circle class="fg" cx="162.38" cy="21.15" r="2.23"/>
                        <rect class="bg" y="59.92" width="53.92" height="2.93"/>
                        <rect class="bg" y="63.91" width="53.92" height="2.93"/>
                        <rect class="bg" y="67.91" width="53.92" height="2.93"/>
                        <rect class="bg" x="62.15" y="59.92" width="53.92" height="2.93"/>
                        <rect class="bg" x="62.15" y="63.91" width="53.92" height="2.93"/>
                        <rect class="bg" x="62.15" y="67.91" width="53.92" height="2.93"/>
                        <rect class="bg" x="123.37" y="59.92" width="53.92" height="2.93"/>
                        <rect class="bg" x="123.37" y="63.91" width="53.92" height="2.93"/>
                        <rect class="bg" x="123.37" y="67.91" width="53.92" height="2.93"/>
                      </svg>
                    `,
        },
        {
          title: 'Stats Split with Image',
          html_code: `<section> <div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2 pbx-bg-gray-900" > <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mx-auto pbx-max-w-2xl lg:pbx-mx-0 lg:pbx-max-w-none"> <div class="pbx-text-base/7 pbx-font-semibold pbx-text-indigo-400"> <p>Layouts and visual.</p> </div> <div class="pbx-mt-2 pbx-text-pretty pbx-tracking-tight pbx-text-white pbx-text-2xl lg:pbx-text-4xl pbx-font-medium" > <h1>Layouts and visual.</h1> </div> <div class="pbx-mt-10 pbx-grid pbx-max-w-xl pbx-grid-cols-1 pbx-gap-8 pbx-text-base/7 pbx-text-gray-300 lg:pbx-max-w-none lg:pbx-grid-cols-2" > <div> <div> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> <div class="pbx-mt-8"> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> </div> <div> <div> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> <div class="pbx-mt-8"> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> </div> </div> <div class="pbx-mt-16 pbx-grid pbx-grid-cols-1 pbx-gap-x-8 pbx-gap-y-12 sm:pbx-mt-20 sm:pbx-grid-cols-2 sm:pbx-gap-y-16 lg:pbx-mt-28 lg:pbx-grid-cols-4" > <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6" > <div class="pbx-text-base/7 pbx-text-white"><p>Layouts and visual.</p></div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"> <p>2021</p> </div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6" > <div class="pbx-text-base/7 pbx-text-white"><p>Layouts and visual.</p></div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"> <p>37</p> </div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6" > <div class="pbx-text-base/7 pbx-text-white"><p>Layouts and visual.</p></div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"> <p>12</p> </div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6" > <div class="pbx-text-base/7 pbx-text-white"><p>Layouts and visual.</p></div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"> <p>$25M</p> </div> </div> </div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: `
                    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 369.55 129.8">
                      <g>
                        <rect fill="#394152" width="173.06" height="129.8"/>
                        <polygon fill="#718096" points="56.24 77.89 77.88 51.93 99.51 77.89 56.24 77.89"/>
                        <polygon fill="#718096" points="95.19 77.89 106 64.91 116.82 77.89 95.19 77.89"/>
                        <circle fill="#718096" cx="106" cy="55.51" r="3.6"/>
                      </g>
                      <rect fill="#394152" x="196.48" y="26.58" width="173.07" height="4.91"/>
                      <rect fill="#394152" x="196.48" y="13.3" width="173.07" height="4.91"/>
                      <rect fill="#394152" x="196.48" y="0" width="173.07" height="4.91"/>
                      <rect fill="#394152" x="196.48" y="39.87" width="173.07" height="4.91"/>
                      <rect fill="#394152" x="196.48" y="65.78" width="24.01" height="4.91"/>
                      <rect fill="#394152" x="286.48" y="65.78" width="24.01" height="4.91"/>
                      <rect fill="#394152" x="196.48" y="91.26" width="24.01" height="4.91"/>
                      <rect fill="#394152" x="286.48" y="91.26" width="24.01" height="4.91"/>
                    </svg>
                    `,
        },
        {
          title: 'Stats Stepped',
          html_code: `<section> <div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mx-auto pbx-max-w-2xl lg:pbx-mx-0"> <div class="pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> </div> <div class="pbx-flex pbx-justify-between pbx-items-center pbx-gap-4 pbx-mt-12 lg:pbx-flex-row pbx-flex-col" > <div class="pbx-text-2xl pbx-font-semibold">250k</div> <div class="pbx-text-2xl pbx-font-semibold">$8.9</div> <div class="pbx-text-2xl pbx-font-semibold">401k</div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 285.5 87.89">
  <rect fill="#394152" x="0" y="38.3" width="173.07" height="4.91"/>
  <rect fill="#394152" x="0" y="25.01" width="173.07" height="4.91"/>
  <rect fill="#394152" x="0" y="0" width="277.5" height="7.87"/>
  <rect fill="#394152" x="0" y="51.59" width="173.07" height="4.91"/>
  <rect fill="#394152" x="0" y="82.98" width="24.01" height="4.91"/>
  <rect fill="#394152" x="130.75" y="82.98" width="24.01" height="4.91"/>
  <rect fill="#394152" x="261.49" y="82.98" width="24.01" height="4.91"/>
</svg>

                    `,
        },
        {
          title: 'Stats With Two Column',
          html_code: `<section><div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2 pbx-bg-gray-900"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mx-auto pbx-max-w-2xl lg:pbx-mx-0 lg:pbx-max-w-none"> <div class="pbx-text-base/7 pbx-font-semibold pbx-text-indigo-400"> <p>Layouts and visual.</p> </div> <div class="pbx-mt-2 pbx-text-pretty pbx-tracking-tight pbx-text-white pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"><h1>Layouts and visual.</h1></div> <div class="pbx-mt-10 pbx-grid pbx-max-w-xl pbx-grid-cols-1 pbx-gap-8 pbx-text-base/7 pbx-text-gray-300 lg:pbx-max-w-none lg:pbx-grid-cols-2"> <div> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-mt-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div> <div><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> <div class="pbx-mt-8"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> </div> <div class="pbx-mt-16 pbx-grid pbx-grid-cols-1 pbx-gap-x-8 pbx-gap-y-12 sm:pbx-mt-20 sm:pbx-grid-cols-2 sm:pbx-gap-y-16 lg:pbx-mt-28 lg:pbx-grid-cols-4"> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6"> <div class="pbx-text-base/7 pbx-text-white"><p>Layouts and visual.</p></div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"><p>2021</p></div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6"> <div class="pbx-text-base/7 pbx-text-white"><p>Layouts and visual.</p></div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"><p>37</p></div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6"> <div class="pbx-text-base/7 pbx-text-white"> <p>Layouts and visual.</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"><p>12</p></div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6"> <div class="pbx-text-base/7 pbx-text-white"> <p>Layouts and visual.</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"><p>$25M</p></div> </div> </div> </div> </div> </div></section>`,
          category: 'Marketing',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 285.5 103.47">
  <rect fill="#394152" x="0" y="38.3" width="106.81" height="4.91"/>
  <rect fill="#394152" x="0" y="25.01" width="106.81" height="4.91"/>
  <rect fill="#394152" x="0" y="0" width="146.48" height="7.87"/>
  <rect fill="#394152" x="0" y="51.59" width="106.81" height="4.91"/>
  <rect fill="#394152" x="130.75" y="38.3" width="106.81" height="4.91"/>
  <rect fill="#394152" x="130.75" y="25.01" width="106.81" height="4.91"/>
  <rect fill="#394152" x="130.75" y="51.59" width="106.81" height="4.91"/>
  <rect fill="#394152" x="0" y="82.98" width="24.01" height="4.91"/>
  <rect fill="#394152" x="87.16" y="82.98" width="24.01" height="4.91"/>
  <rect fill="#394152" x="174.33" y="82.98" width="24.01" height="4.91"/>
  <rect fill="#394152" x="261.49" y="82.98" width="24.01" height="4.91"/>
  <rect fill="#394152" x="0" y="98.56" width="24.01" height="4.91"/>
  <rect fill="#394152" x="87.16" y="98.56" width="24.01" height="4.91"/>
  <rect fill="#394152" x="174.33" y="98.56" width="24.01" height="4.91"/>
  <rect fill="#394152" x="261.49" y="98.56" width="24.01" height="4.91"/>
</svg>

                    `,
        },
        {
          title: 'Timeline Simple',
          html_code: `<section><div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-mx-auto pbx-grid pbx-max-w-2xl pbx-grid-cols-1 pbx-gap-8 pbx-overflow-hidden lg:pbx-mx-0 lg:pbx-max-w-none lg:pbx-grid-cols-4"> <div> <div class="pbx-flex pbx-items-center pbx-text-sm/6 pbx-font-semibold pbx-text-indigo-600"> <div class="pbx-text-black"><p>Layouts and visual.</p></div>  </div> <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Layouts and visual.</p></div> <div class="pbx-mt-1 pbx-text-base/7 pbx-text-black"><p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p></div> </div> <div> <div class="pbx-flex pbx-items-center pbx-text-sm/6 pbx-font-semibold pbx-text-indigo-600"> <div class="pbx-text-black"><p>Layouts and visual.</p></div>  </div> <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Layouts and visual.</p></div> <div class="pbx-mt-1 pbx-text-base/7 pbx-text-black"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> </div> <div> <div class="pbx-flex pbx-items-center pbx-text-sm/6 pbx-font-semibold pbx-text-indigo-600"> <div class="pbx-text-black"><p>Layouts and visual.</p></div>  </div> <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Layouts and visual.</p></div> <div class="pbx-mt-1 pbx-text-base/7 pbx-text-black"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> </div> <div> <div class="pbx-flex pbx-items-center pbx-text-sm/6 pbx-font-semibold pbx-text-indigo-600"> <div class="pbx-text-black"><p>Layouts and visual.</p></div>  </div> <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"> <p>Layouts and visual.</p> </div> <div class="pbx-mt-1 pbx-text-base/7 pbx-text-black"><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div></section>`,
          category: 'Marketing',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440.22 66.6">
  <g>
    <rect fill="#394152" x="0" y="38.7" width="80.69" height="3.71"/>
    <rect fill="#394152" x="0" y="26.6" width="80.69" height="3.71"/>
    <rect fill="#394152" x="0" y="50.79" width="80.69" height="3.71"/>
    <rect fill="#394152" x="0" y="62.89" width="80.69" height="3.71"/>
    <rect fill="#394152" x="0" y="0" width="24.01" height="4.91"/>
    <rect fill="#394152" x="0" y="13.3" width="32.69" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="119.84" y="38.7" width="80.69" height="3.71"/>
    <rect fill="#394152" x="119.84" y="26.6" width="80.69" height="3.71"/>
    <rect fill="#394152" x="119.84" y="50.79" width="80.69" height="3.71"/>
    <rect fill="#394152" x="119.84" y="62.89" width="80.69" height="3.71"/>
    <rect fill="#394152" x="119.84" y="0" width="24.01" height="4.91"/>
    <rect fill="#394152" x="119.84" y="13.3" width="32.69" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="239.69" y="38.7" width="80.69" height="3.71"/>
    <rect fill="#394152" x="239.69" y="26.6" width="80.69" height="3.71"/>
    <rect fill="#394152" x="239.69" y="50.79" width="80.69" height="3.71"/>
    <rect fill="#394152" x="239.69" y="62.89" width="80.69" height="3.71"/>
    <rect fill="#394152" x="239.69" y="0" width="24.01" height="4.91"/>
    <rect fill="#394152" x="239.69" y="13.3" width="32.69" height="4.91"/>
  </g>
  <g>
    <rect fill="#394152" x="359.53" y="38.7" width="80.69" height="3.71"/>
    <rect fill="#394152" x="359.53" y="26.6" width="80.69" height="3.71"/>
    <rect fill="#394152" x="359.53" y="50.79" width="80.69" height="3.71"/>
    <rect fill="#394152" x="359.53" y="62.89" width="80.69" height="3.71"/>
    <rect fill="#394152" x="359.53" y="0" width="24.01" height="4.91"/>
    <rect fill="#394152" x="359.53" y="13.3" width="32.69" height="4.91"/>
  </g>
</svg>

                    `,
        },
        {
          title: 'Show Single Product',
          html_code: `<section> <div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
          category: 'Products',
          cover_image: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="122.319 300.3 122.364 160.763" width="122.364px" height="160.763px">
                      <rect class="bg" width="122.364" height="122.364" style="fill: rgb(56, 65, 82); stroke-width: 1;" x="122.319" y="300.3"/>
                      <polygon class="fg" points="140.928 379.728 171.337 343.237 201.747 379.728" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                      <polygon class="fg" points="195.665 379.728 210.87 361.483 226.052 379.728" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                      <circle class="fg" cx="210.87" cy="348.297" r="5.061" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                      <rect class="bg" y="436.28" width="122.364" height="6.65" style="fill: rgb(56, 65, 82); stroke-width: 1;" x="122.319"/>
                      <rect class="bg" y="445.335" width="122.364" height="6.65" style="fill: rgb(56, 65, 82); stroke-width: 1;" x="122.319"/>
                      <rect class="bg" y="454.413" width="122.364" height="6.65" style="fill: rgb(56, 65, 82); stroke-width: 1;" x="122.319"/>
                    </svg>
                    `,
        },
        {
          title: 'Show Multiple Products',
          html_code: `<section>\n<div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div>  </div> </div> </div>\n</section>`,
          category: 'Products',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 177.28 70.84">
                        <defs>
                          <style>
                            .bg { fill: #384152; }
                            .fg { fill: #718096; }
                          </style>
                        </defs>
                        <rect class="bg" width="53.92" height="53.92"/>
                        <rect class="bg" x="62.15" width="53.92" height="53.92"/>
                        <rect class="bg" x="123.37" width="53.92" height="53.92"/>
                        <polygon class="fg" points="8.2 35 21.6 18.92 35 35"/>
                        <polygon class="fg" points="32.32 35 39.02 26.96 45.71 35"/>
                        <circle class="fg" cx="39.02" cy="21.15" r="2.23"/>
                        <polygon class="fg" points="70.36 35 83.75 18.92 97.15 35"/>
                        <polygon class="fg" points="94.47 35 101.17 26.96 107.87 35"/>
                        <circle class="fg" cx="101.17" cy="21.15" r="2.23"/>
                        <polygon class="fg" points="131.57 35 144.96 18.92 158.36 35"/>
                        <polygon class="fg" points="155.68 35 162.38 26.96 169.08 35"/>
                        <circle class="fg" cx="162.38" cy="21.15" r="2.23"/>
                        <rect class="bg" y="59.92" width="53.92" height="2.93"/>
                        <rect class="bg" y="63.91" width="53.92" height="2.93"/>
                        <rect class="bg" y="67.91" width="53.92" height="2.93"/>
                        <rect class="bg" x="62.15" y="59.92" width="53.92" height="2.93"/>
                        <rect class="bg" x="62.15" y="63.91" width="53.92" height="2.93"/>
                        <rect class="bg" x="62.15" y="67.91" width="53.92" height="2.93"/>
                        <rect class="bg" x="123.37" y="59.92" width="53.92" height="2.93"/>
                        <rect class="bg" x="123.37" y="63.91" width="53.92" height="2.93"/>
                        <rect class="bg" x="123.37" y="67.91" width="53.92" height="2.93"/>
                      </svg>
                    `,
        },
        {
          title: 'Simple Centered CTA',
          html_code: `<section><div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-mx-auto pbx-text-center"> <div class="pbx-break-words pbx-text-6xl lg:pbx-text-8xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-font-semibold pbx-py-4"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div> </div></div></section>`,
          category: 'Call To Action',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.5 67.89">
  <rect fill="#394152" x="38.96" y="42.97" width="199.58" height="4.91"/>
  <rect fill="#394152" x="38.96" y="22.97" width="199.58" height="4.91"/>
  <rect fill="#394152" x="0" y="0" width="277.5" height="7.87"/>
  <rect fill="#394152" x="120.43" y="62.98" width="36.64" height="4.91"/>
</svg>

                    `,
        },
        {
          title: 'Left Simple CTA',
          html_code: `<section> <div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-break-words pbx-text-6xl lg:pbx-text-8xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-font-semibold pbx-py-4"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and visual.</a></p></div> </div></div> </section>`,
          category: 'Call To Action',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.5 67.89">
  <rect fill="#394152" x="0" y="42.97" width="199.58" height="4.91"/>
  <rect fill="#394152" x="0" y="22.97" width="199.58" height="4.91"/>
  <rect fill="#394152" x="0" y="0" width="277.5" height="7.87"/>
  <rect fill="#394152" x="0" y="62.98" width="36.64" height="4.91"/>
</svg>

                    `,
        },
        {
          title: 'Image & Left CTA',
          html_code: `<section> <div class="md:pbx-pt-16 md:pbx-pb-16 pbx-pt-6 pbx-pb-6 lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-max-w-7xl"> <div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-2" > <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="provider" /> <div class="pbx-mx-auto pbx-px-6 pbx-py-12"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p> Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor. </p> </div> <div class="pbx-font-semibold pbx-py-4"> <p> <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" >Layouts and visual.</a > </p> </div> </div> </div> </div> </div> </section>`,
          category: 'Call To Action',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 482.23 129.8">
  <g>
    <rect fill="#394152" width="173.06" height="129.8"/>
    <polygon fill="#718096" points="56.24 77.89 77.88 51.93 99.51 77.89 56.24 77.89"/>
    <polygon fill="#718096" points="95.19 77.89 106 64.91 116.82 77.89 95.19 77.89"/>
    <circle fill="#718096" cx="106" cy="55.51" r="3.6"/>
  </g>
  <rect fill="#394152" x="204.72" y="43.01" width="199.58" height="4.91"/>
  <rect fill="#394152" x="204.72" y="23" width="199.58" height="4.91"/>
  <rect fill="#394152" x="204.72" y=".03" width="277.5" height="7.87"/>
  <rect fill="#394152" x="204.72" y="63.01" width="36.64" height="4.91"/>
</svg>
                    `,
        },
      ],
    },
  },
]

export default component
