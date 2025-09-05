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
          html_code: `<section>\n<div class="md:pt-12 md:pb-12 pt-4 pb-4 lg:px-4 px-2"><div class="mx-auto max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div></div></div>\n</section>`,
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
          html_code: `<section>\n<div class="md:pt-12 md:pb-12 pt-4 pb-4 lg:px-4 px-2"><div class="mx-auto max-w-7xl"><div class="myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div>   </div> </div> </div>\n</section>`,
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
          html_code: `<section>\n<div class="md:pt-12 md:pb-12 pt-4 pb-4 lg:px-4 px-2"><div class="mx-auto max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div>\n</section>`,
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
          html_code: `<section>\n<div class="md:pt-12 md:pb-12 pt-4 pb-4 lg:px-4 px-2"><div class="mx-auto max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div>\n</section>`,
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
          html_code: `<section>\n<div class="md:pt-12 md:pb-12 pt-4 pb-4 lg:px-4 px-2"> <div class="mx-auto max-w-7xl"> <div class="myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"> <div><img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> <div><img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> <div><img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> <div><img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"></div> </div> </div> </div>\n</section>`,
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
          html_code: `<section>\n<div class="md:pt-12 md:pb-12 pt-4 pb-4 lg:px-4 px-2">\n<div class="mx-auto max-w-7xl">\n<div class="grid grid-cols-2 md:grid-cols-3 myPrimaryGap">\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n<div>\n<img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="image">\n</div>\n\n</div>\n</div>\n</div>\n</section>`,
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
          html_code: `<section>\n<div class="md:pt-12 md:pb-12 pt-4 pb-4 lg:px-4 px-2"><div class="mx-auto max-w-7xl">\n<div class="myPrimaryGap lg:flex lg:justify-center"><div class="flex-1 py-2">\n<div class="grid myPrimaryGap grid-cols-1 lg:grid-cols-2"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div>   </div> </div>\n\n<div class="flex-1 py-2"> <div class="break-words py-2"><p>Start customizing by editing this default text directly in the editor.</p></div></div> \n</div></div></div>\n</section>`,
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
          html_code: `<section>\n<div class="md:pt-12 md:pb-12 pt-4 pb-4 lg:px-4 px-2"><div class="mx-auto max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider">  </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-[9/16] " src="${getPlaceholderImageDataUrl()}" alt="provider"></div></div> </div></div>\n</section>`,
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
          html_code: `<section>\n<div class="md:pt-12 md:pb-12 pt-4 pb-4 lg:px-4 px-2"><div class="mx-auto max-w-7xl"><div class="myPrimaryGap grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"><div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div>\n</section>`,
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
          html_code: `<section>\n<div class="md:pt-12 md:pb-12 pt-4 pb-4 lg:px-4 px-2"><div class="mx-auto max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div>  </div> </div> </div>\n</section>`,
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
          title: 'Stats Split with image',
          html_code: `<section> <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-2"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> </div> <div> <div class=""> <p class="pbx-font-semibold">Our track record</p> </div> <div class="pbx-font-medium pbx-text-2xl lg:pbx-text-4xl"><p>Trusted by thousands of creators worldwide</p></div> <div><p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.</p></div> <div class="pbx-mt-16 pbx-grid pbx-max-w-xl pbx-grid-cols-1 pbx-gap-8 sm:pbx-mt-20 sm:pbx-grid-cols-2 xl:pbx-mt-16"> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div><p>Creators on the platform</p></div> <div class="pbx-font-medium pbx-text-lg lg:pbx-text-2xl"><p>8,000+</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div> <p class="pbx-text-sm/6 pbx-text-gray-600">Flat platform fee</p> </div> <div class="pbx-font-medium pbx-text-lg lg:pbx-text-2xl"><p>3%</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div> <p class="pbx-text-sm/6 pbx-text-gray-600">Uptime guarantee</p> </div> <div class="pbx-text-lg lg:pbx-text-2xl pbx-font-medium"><p>99.9%</p></div> </div> <div class="pbx-flex pbx-flex-col pbx-gap-y-3 pbx-border-l pbx-border-gray-900/10 pbx-pl-6"> <div> <p class="pbx-text-sm/6 pbx-text-gray-600">Paid out to creators</p> </div> <div class="pbx-text-lg lg:pbx-text-2xl pbx-font-medium"><p>$70M</p></div> </div> </div> </div></div> </div></div> </section>`,
          category: 'Marketing',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="103.953 200.017 225.995 103.408" width="225.995px" height="103.408px">
                        <rect class="bg" x="103.953" width="103.408" height="103.408" style="fill: rgb(56, 65, 82); stroke-width: 1;" y="200.017"/>
                        <polygon class="fg" points="119.698 267.14 145.377 236.302 171.076 267.14" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        <polygon class="fg" points="165.937 267.14 178.786 251.721 191.636 267.14" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        <circle class="fg" cx="178.786" cy="240.579" r="4.277" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;" y="200.017"/>
                        <rect class="bg" x="226.54" y="207.688" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" y="223.011" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;" y="230.62"/>
                        <rect class="bg" x="226.54" y="238.291" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" y="215.499" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                      </svg>
                    `,
        },
        {
          title: 'Stats Stepped',
          html_code: `<section><div class="pbx-relative pbx-py-4 pbx-bg-slate-200"><div class="pbx-mx-auto pbx-max-w-7xl pbx-px-6 lg:pbx-px-8 pbx-pt-12"> <div class="pbx-mx-auto pbx-max-w-2xl lg:pbx-mx-0"><div class="pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"><h2>We approach work as a place to make the world better</h2></div><div><p>Diam nunc lacus lacus aliquam turpis enim. Eget hac velit est euismod lacus. Est non placerat nam arcu. Cras purus nibh cursus sit eu in id. Integer vel nibh.</p></div> </div> <div class="pbx-mx-auto pbx-mt-16 pbx-flex pbx-max-w-2xl pbx-flex-col pbx-gap-8 lg:pbx-mx-0 lg:pbx-mt-20 lg:pbx-max-w-none lg:pbx-flex-row lg:pbx-items-end pbx-pb-20"> <div class="pbx-flex pbx-flex-col-reverse pbx-justify-between pbx-gap-x-16 pbx-gap-y-8 pbx-rounded-2xl pbx-bg-gray-50 pbx-p-8 sm:pbx-w-3/4 sm:pbx-max-w-md sm:pbx-flex-row-reverse sm:pbx-items-end lg:pbx-w-72 lg:pbx-max-w-none lg:pbx-flex-none lg:pbx-flex-col lg:pbx-items-start"><div class="pbx-text-lg lg:pbx-text-2xl"><p>250k</p></div><div><p>Users on the platform</p><p>Vel labore deleniti veniam consequuntur sunt nobis.</p></div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-justify-between pbx-gap-x-16 pbx-gap-y-8 pbx-rounded-2xl pbx-bg-gray-900 pbx-p-8 sm:pbx-flex-row-reverse sm:pbx-items-end lg:pbx-w-full lg:pbx-max-w-sm lg:pbx-flex-auto lg:pbx-flex-col lg:pbx-items-start lg:pbx-gap-y-44"><div class="pbx-text-white pbx-text-lg lg:pbx-text-2xl"><p>$8.9 billion</p></div><div class="sm:pbx-w-80 sm:pbx-shrink lg:pbx-w-auto lg:pbx-flex-none pbx-text-white"><p>We’re that our customers have made over $8 billion in total revenue.</p><p>Eu duis porta aliquam ornare. Elementum eget magna egestas.</p></div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-justify-between pbx-gap-x-16 pbx-gap-y-8 pbx-rounded-2xl pbx-bg-indigo-600 pbx-p-8 sm:pbx-w-11/12 sm:pbx-max-w-xl sm:pbx-flex-row-reverse sm:pbx-items-end lg:pbx-w-full lg:pbx-max-w-none lg:pbx-flex-auto lg:pbx-flex-col lg:pbx-items-start lg:pbx-gap-y-28"><div class="pbx-text-white pbx-text-lg lg:pbx-text-2xl"><p>401k</p></div><div class="sm:pbx-w-80 sm:pbx-shrink lg:pbx-w-auto lg:pbx-flex-none pbx-text-white"><p>Transactions this year</p><p>Eu duis porta aliquam ornare. Elementum eget magna egestas. Eu duis porta aliquam ornare.</p></div> </div> </div> </div></div></section>`,
          category: 'Marketing',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="103.953 200.017 225.995 103.408" width="225.995px" height="103.408px">
                        <rect class="bg" x="103.953" width="103.408" height="103.408" style="fill: rgb(56, 65, 82); stroke-width: 1;" y="200.017"/>
                        <polygon class="fg" points="119.698 267.14 145.377 236.302 171.076 267.14" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        <polygon class="fg" points="165.937 267.14 178.786 251.721 191.636 267.14" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        <circle class="fg" cx="178.786" cy="240.579" r="4.277" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;" y="200.017"/>
                        <rect class="bg" x="226.54" y="207.688" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" y="223.011" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;" y="230.62"/>
                        <rect class="bg" x="226.54" y="238.291" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" y="215.499" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                      </svg>
                    `,
        },
        {
          title: 'Stats With two column',
          html_code: `<section><div class="pbx-relative pbx-py-4 pbx-bg-gray-900"><div class="pbx-py-24 sm:pbx-py-32"> <div class="pbx-mx-auto pbx-max-w-7xl pbx-px-6 lg:pbx-px-8"> <div class="pbx-mx-auto pbx-max-w-2xl lg:pbx-mx-0 lg:pbx-max-w-none"> <div class="pbx-text-base/7 pbx-font-semibold pbx-text-indigo-400"> <p>Deploy faster</p> </div> <div class="pbx-mt-2 pbx-text-pretty pbx-font-semibold pbx-tracking-tight pbx-text-white pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"><h1>A better workflow</h1></div> <div class="pbx-mt-10 pbx-grid pbx-max-w-xl pbx-grid-cols-1 pbx-gap-8 pbx-text-base/7 pbx-text-gray-300 lg:pbx-max-w-none lg:pbx-grid-cols-2"> <div> <div><p>Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id.</p></div> <div class="pbx-mt-8"><p>Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices hac adipiscing egestas.</p></div> </div> <div> <div><p>Erat pellentesque dictumst ligula porttitor risus eget et eget. Ultricies tellus felis id dignissim eget. Est augue maecenas risus nulla ultrices congue nunc tortor. Enim et nesciunt doloremque nesciunt voluptate.</p></div> <div class="pbx-mt-8"><p>Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices hac adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem vel integer orci.</p></div> </div> </div> <div class="pbx-mt-16 pbx-grid pbx-grid-cols-1 pbx-gap-x-8 pbx-gap-y-12 sm:pbx-mt-20 sm:pbx-grid-cols-2 sm:pbx-gap-y-16 lg:pbx-mt-28 lg:pbx-grid-cols-4"> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6"> <div class="pbx-text-base/7 pbx-text-white"><p>Founded</p></div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"><p>2021</p></div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6"> <div class="pbx-text-base/7 pbx-text-white"><p>Employees</p></div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"><p>37</p></div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6"> <div class="pbx-text-base/7 pbx-text-white"> <p>Countries</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"><p>12</p></div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6"> <div class="pbx-text-base/7 pbx-text-white"> <p>Raised</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"><p>$25M</p></div> </div> </div> </div> </div> </div></div></section>`,
          category: 'Marketing',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="103.953 200.017 225.995 103.408" width="225.995px" height="103.408px">
                        <rect class="bg" x="103.953" width="103.408" height="103.408" style="fill: rgb(56, 65, 82); stroke-width: 1;" y="200.017"/>
                        <polygon class="fg" points="119.698 267.14 145.377 236.302 171.076 267.14" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        <polygon class="fg" points="165.937 267.14 178.786 251.721 191.636 267.14" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        <circle class="fg" cx="178.786" cy="240.579" r="4.277" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;" y="200.017"/>
                        <rect class="bg" x="226.54" y="207.688" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" y="223.011" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;" y="230.62"/>
                        <rect class="bg" x="226.54" y="238.291" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" y="215.499" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                      </svg>
                    `,
        },
        {
          title: 'Timeline Simple',
          html_code: `<section><div class="pbx-bg-white pbx-py-24 sm:pbx-py-32"> <div class="pbx-mx-auto pbx-max-w-7xl pbx-px-6 lg:pbx-px-8"> <div class="pbx-mx-auto pbx-grid pbx-max-w-2xl pbx-grid-cols-1 pbx-gap-8 pbx-overflow-hidden lg:pbx-mx-0 lg:pbx-max-w-none lg:pbx-grid-cols-4"> <div> <div class="pbx-flex pbx-items-center pbx-text-sm/6 pbx-font-semibold pbx-text-indigo-600"> <div class="pbx-text-black"><p>Aug 2021</p></div>  </div> <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Founded company</p></div> <div class="pbx-mt-1 pbx-text-base/7 pbx-text-black"><p>Nihil aut nam. Dignissimos a pariatur et quos omnis. Aspernatur asperiores et dolorem dolorem optio voluptate repudiandae.</p></div> </div> <div> <div class="pbx-flex pbx-items-center pbx-text-sm/6 pbx-font-semibold pbx-text-indigo-600"> <div class="pbx-text-black"><p>Dec 2021</p></div>  </div> <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Secured $65m in funding</p></div> <div class="pbx-mt-1 pbx-text-base/7 pbx-text-black"> <p>Provident quia ut esse. Vero vel eos repudiandae aspernatur. Cumque minima impedit sapiente a architecto nihil.</p> </div> </div> <div> <div class="pbx-flex pbx-items-center pbx-text-sm/6 pbx-font-semibold pbx-text-indigo-600"> <div class="pbx-text-black"><p>Feb 2022</p></div>  </div> <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Released beta</p></div> <div class="pbx-mt-1 pbx-text-base/7 pbx-text-black"> <p>Sunt perspiciatis incidunt. Non necessitatibus aliquid. Consequatur ut officiis earum eum quia facilis. Hic deleniti dolorem quia et.</p> </div> </div> <div> <div class="pbx-flex pbx-items-center pbx-text-sm/6 pbx-font-semibold pbx-text-indigo-600"> <div class="pbx-text-black"><p>Dec 2022</p></div>  </div> <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"> <p>Global launch of product</p> </div> <div class="pbx-mt-1 pbx-text-base/7 pbx-text-black"><p>Ut ipsa sint distinctio quod itaque nam qui. Possimus aut unde id architecto voluptatem hic aut pariatur velit.</p></div> </div> </div> </div> </div></section>`,
          category: 'Marketing',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="103.953 200.017 225.995 103.408" width="225.995px" height="103.408px">
                        <rect class="bg" x="103.953" width="103.408" height="103.408" style="fill: rgb(56, 65, 82); stroke-width: 1;" y="200.017"/>
                        <polygon class="fg" points="119.698 267.14 145.377 236.302 171.076 267.14" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        <polygon class="fg" points="165.937 267.14 178.786 251.721 191.636 267.14" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        <circle class="fg" cx="178.786" cy="240.579" r="4.277" style="fill: rgb(113, 128, 150); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;" y="200.017"/>
                        <rect class="bg" x="226.54" y="207.688" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" y="223.011" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;" y="230.62"/>
                        <rect class="bg" x="226.54" y="238.291" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                        <rect class="bg" x="226.54" y="215.499" width="103.408" height="5.619" style="fill: rgb(56, 65, 82); stroke-width: 1;"/>
                      </svg>
                    `,
        },
        {
          title: 'Show Single Product',
          html_code: `<section> <div class="md:pbx-pt-12 md:pbx-pb-12 pbx-pt-4 pbx-pb-4 lg:pbx-px-4 pbx-px-2"><div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-myPrimaryGap"> <div class="pbx-flex-1 pbx-py-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="pbx-break-words pbx-py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> </div> </div> </div> </section>`,
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
          html_code: `<section>\n<div class="md:pt-12 md:pb-12 pt-4 pb-4 lg:px-4 px-2"><div class="mx-auto max-w-7xl"><div class="myPrimaryGap grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div> <div class="flex-1 py-2"> <img class="object-cover w-full object-top aspect-square " src="${getPlaceholderImageDataUrl()}" alt="provider"> <div class="break-words py-2"><p>Layouts and visual.</p><p>Start customizing by editing this default text directly in the editor.</p></div> </div>  </div> </div> </div>\n</section>`,
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
          html_code: `<section> <div class="pbx-relative pbx-py-4"> <div class="pbx-mx-auto pbx-max-w-7xl lg:pbx-px-4 pbx-px-2"> <div class="pbx-mx-auto pbx-text-center pbx-px-6 pbx-py-24 pbx-sm:py-32 pbx-lg:px-8"> <div class="pbx-break-words pbx-text-6xl lg:pbx-text-8xl pbx-font-medium"> <h2>Boost your productivity. Start using our app today.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p> Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea. </p> </div> <div class="pbx-font-semibold pbx-py-4"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Learn more</a></p></div> </div> </div> </div> </section>`,
          category: 'Call To Action',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.67 74.41">
                        <defs>
                          <style>
                            .cls-1, .cls-2 {
                              fill: #394152;
                            }

                            .cls-2 {
                              fill-rule: evenodd;
                            }
                          </style>
                        </defs>
                        <rect class="cls-1" x="52.3" y="44.75" width="173.07" height="3.96" rx="1.98" ry="1.98"/>
                        <rect class="cls-1" x="52.3" y="55.48" width="173.07" height="3.96" rx="1.98" ry="1.98"/>
                        <rect class="cls-1" x="126.83" y="70.45" width="24.01" height="3.96" rx="1.98" ry="1.98"/>
                        <g id="svgGroup">
                          <path class="cls-2" d="M74.94,26.25h-3.54l4.15-8.31-5.15-10.44h3.62l2.33,4.79c.19.43.38.83.54,1.21.17.38.31.76.44,1.17.15-.4.31-.79.48-1.17.17-.37.36-.78.58-1.21l2.35-4.79h3.5l-9.31,18.75ZM263.06,26.25h-3.54l4.15-8.31-5.15-10.44h3.62l2.33,4.79c.19.43.38.83.54,1.21.17.38.31.76.44,1.17.15-.4.31-.79.48-1.17.17-.37.36-.78.58-1.21l2.35-4.79h3.5l-9.31,18.75ZM100.79,14.9v-7.4h3.27v6.96c0,.78.23,1.46.7,2.05.47.59,1.11.89,1.95.89.69,0,1.31-.25,1.86-.74.54-.49.81-1.2.81-2.14v-7.02h3.29v12.5h-3v-1.5c-.44.61-1,1.08-1.67,1.4s-1.38.48-2.15.48c-.87,0-1.7-.22-2.48-.65s-1.4-1.05-1.88-1.86c-.47-.81-.71-1.8-.71-2.97ZM186.96,14.9v-7.4h3.27v6.96c0,.78.23,1.46.7,2.05.47.59,1.11.89,1.95.89.69,0,1.31-.25,1.85-.74.54-.49.81-1.2.81-2.14v-7.02h3.29v12.5h-3v-1.5c-.44.61-1,1.08-1.67,1.4-.67.32-1.38.48-2.15.48-.88,0-1.7-.22-2.48-.65-.78-.43-1.4-1.05-1.88-1.86-.47-.81-.71-1.8-.71-2.97ZM180.85,8.46V0h3.29v20h-2.88v-1.33c-.49.5-1.08.9-1.77,1.19-.69.29-1.44.44-2.25.44-1.15,0-2.2-.3-3.15-.89-.94-.59-1.7-1.38-2.26-2.38-.56-.99-.84-2.09-.84-3.28s.28-2.31.84-3.29c.56-.99,1.32-1.77,2.26-2.36.94-.59,1.99-.89,3.15-.89.71,0,1.36.11,1.97.32s1.15.52,1.64.93ZM134.79,26.25h-3.27V7.5h2.85v1.33c.51-.51,1.11-.91,1.79-1.2.68-.28,1.42-.43,2.23-.43,1.17,0,2.22.29,3.17.88.94.58,1.7,1.37,2.26,2.36s.84,2.09.84,3.3-.28,2.29-.84,3.28c-.56.99-1.32,1.78-2.26,2.38-.94.59-2,.89-3.17.89-.71,0-1.37-.11-1.97-.33-.6-.22-1.15-.53-1.63-.92v7.21ZM44.65,18.81l.83-3.17c.4.58.95,1.08,1.64,1.48.69.4,1.41.6,2.16.6.54,0,.94-.11,1.2-.33.26-.22.38-.5.38-.83,0-.38-.13-.65-.4-.82-.26-.17-.53-.31-.79-.41l-1.73-.65c-.36-.15-.78-.36-1.27-.61-.49-.26-.91-.62-1.26-1.1-.35-.48-.53-1.11-.53-1.89,0-.71.17-1.36.52-1.96.35-.6.85-1.08,1.52-1.45.67-.37,1.46-.55,2.38-.55.83,0,1.63.14,2.4.43.76.28,1.34.64,1.73,1.05l-.79,3.08c-.43-.61-.96-1.09-1.59-1.43-.63-.34-1.24-.51-1.82-.51-.47,0-.83.11-1.07.32-.24.22-.36.47-.36.76,0,.21.08.41.25.61.17.2.44.37.81.51l1.65.62c.43.15.9.37,1.42.64.51.27.96.65,1.32,1.14s.55,1.15.55,2c0,1.18-.43,2.15-1.3,2.9s-2,1.12-3.39,1.12c-.79,0-1.6-.14-2.44-.41-.83-.27-1.5-.66-2-1.16ZM212.46,8.83l-.88,3.46c-.35-.6-.83-1.11-1.44-1.55-.61-.44-1.32-.66-2.12-.66-.69,0-1.32.17-1.86.5s-.98.77-1.29,1.32c-.31.55-.47,1.16-.47,1.84s.16,1.28.47,1.83c.31.56.74,1,1.29,1.32.55.33,1.17.49,1.86.49.81,0,1.51-.22,2.12-.65s1.09-.95,1.44-1.56l.88,3.48c-.6.56-1.28.98-2.06,1.27-.78.29-1.6.44-2.48.44-1.24,0-2.36-.3-3.39-.9-1.02-.6-1.83-1.4-2.43-2.41-.6-1.01-.9-2.11-.9-3.32s.3-2.34.9-3.34c.6-1.01,1.41-1.81,2.43-2.4,1.02-.59,2.15-.89,3.39-.89.87,0,1.7.15,2.48.44.78.29,1.47.71,2.06,1.27ZM5.52,20H0V1.25h5.71c1.24,0,2.22.24,2.96.72.74.48,1.26,1.06,1.57,1.73.31.67.47,1.31.47,1.91s-.12,1.12-.35,1.62-.56.93-.96,1.29c.89.51,1.61,1.22,2.17,2.12.56.9.83,1.91.83,3.02s-.26,2.07-.78,3.03c-.52.97-1.29,1.76-2.31,2.38s-2.28.93-3.78.93ZM242.42,7.5l-6.73,13.12-6.71-13.12h3.65l2.1,4.38c.19.38.38.75.54,1.12.17.38.33.81.5,1.29.17-.49.33-.92.5-1.29.17-.37.35-.75.54-1.12l2.1-4.38h3.5ZM60.88,20h-3.27v-9.88h-2.46v-2.62h2.52V3.33h3.15v4.17h2.65v2.62h-2.58v9.88ZM219.29,20h-3.27v-9.88h-2.46v-2.62h2.52V3.33h3.15v4.17h2.65v2.62h-2.58v9.88ZM255.25,20h-3.27v-9.88h-2.46v-2.62h2.52V3.33h3.15v4.17h2.65v2.62h-2.58v9.88ZM21.02,20.38c-1.24,0-2.36-.3-3.39-.9-1.02-.6-1.83-1.4-2.43-2.4-.6-1-.9-2.11-.9-3.33s.3-2.35.9-3.34c.6-.99,1.41-1.79,2.43-2.39,1.02-.6,2.14-.9,3.36-.9s2.38.3,3.4.9c1.01.6,1.82,1.39,2.43,2.39.6.99.91,2.11.91,3.34,0,1.21-.3,2.32-.91,3.32-.6,1.01-1.41,1.81-2.43,2.41-1.01.6-2.14.9-3.38.9ZM36.12,20.38c-1.24,0-2.36-.3-3.38-.9-1.02-.6-1.83-1.4-2.43-2.4-.6-1-.9-2.11-.9-3.33s.3-2.35.9-3.34c.6-.99,1.41-1.79,2.43-2.39,1.02-.6,2.14-.9,3.36-.9s2.38.3,3.4.9c1.01.6,1.82,1.39,2.43,2.39.6.99.91,2.11.91,3.34,0,1.21-.3,2.32-.91,3.32-.6,1.01-1.41,1.81-2.43,2.41s-2.14.9-3.38.9ZM91.96,20.38c-1.24,0-2.36-.3-3.39-.9s-1.83-1.4-2.43-2.4-.9-2.11-.9-3.33.3-2.35.9-3.34c.6-.99,1.41-1.79,2.43-2.39,1.02-.6,2.14-.9,3.37-.9s2.38.3,3.39.9c1.01.6,1.82,1.39,2.43,2.39.6.99.91,2.11.91,3.34s-.3,2.32-.91,3.32c-.6,1.01-1.41,1.81-2.43,2.41-1.01.6-2.14.9-3.38.9ZM162.6,20.38c-1.24,0-2.36-.3-3.39-.9-1.02-.6-1.83-1.4-2.43-2.4-.6-1-.9-2.11-.9-3.33s.3-2.35.9-3.34c.6-.99,1.41-1.79,2.43-2.39,1.02-.6,2.14-.9,3.36-.9s2.38.3,3.4.9c1.01.6,1.82,1.39,2.43,2.39.6.99.91,2.11.91,3.34s-.3,2.32-.91,3.32c-.6,1.01-1.41,1.81-2.43,2.41-1.01.6-2.14.9-3.38.9ZM119,20h-3.27V7.5h2.96v2.19c.43-.74.99-1.31,1.67-1.71.68-.4,1.48-.6,2.4-.6l.73,2.96c-.26-.08-.56-.12-.9-.12-1.08,0-1.95.35-2.6,1.04s-.98,1.68-.98,2.96v5.79ZM150.31,20h-3.27V7.5h2.96v2.19c.43-.74.99-1.31,1.67-1.71.68-.4,1.48-.6,2.4-.6l.73,2.96c-.26-.08-.56-.12-.9-.12-1.08,0-1.95.35-2.6,1.04-.65.69-.98,1.68-.98,2.96v5.79ZM227.25,20h-3.29V7.5h3.29v12.5ZM247.42,20h-3.29V7.5h3.29v12.5ZM21,17.4c.68,0,1.29-.16,1.83-.49.54-.33.97-.77,1.29-1.32.32-.56.48-1.17.48-1.83,0-.68-.16-1.3-.48-1.84-.32-.55-.75-.99-1.29-1.32-.54-.33-1.15-.5-1.83-.5s-1.27.17-1.81.5c-.54.33-.97.77-1.29,1.32-.32.55-.48,1.16-.48,1.84s.16,1.28.48,1.83c.32.56.75,1,1.29,1.32.54.33,1.15.49,1.81.49ZM36.1,17.4c.68,0,1.29-.16,1.83-.49.54-.33.97-.77,1.29-1.32.32-.56.48-1.17.48-1.83s-.16-1.3-.48-1.84c-.32-.55-.75-.99-1.29-1.32-.54-.33-1.15-.5-1.83-.5s-1.27.17-1.81.5c-.54.33-.97.77-1.29,1.32-.32.55-.48,1.16-.48,1.84s.16,1.28.48,1.83c.32.56.75,1,1.29,1.32.54.33,1.15.49,1.81.49ZM91.94,17.4c.68,0,1.29-.16,1.83-.49.54-.33.97-.77,1.29-1.32.32-.56.48-1.17.48-1.83s-.16-1.3-.48-1.84c-.32-.55-.75-.99-1.29-1.32-.54-.33-1.15-.5-1.83-.5s-1.27.17-1.81.5c-.54.33-.97.77-1.29,1.32-.32.55-.48,1.16-.48,1.84s.16,1.28.48,1.83c.32.56.75,1,1.29,1.32.54.33,1.15.49,1.81.49ZM162.58,17.4c.68,0,1.29-.16,1.83-.49.54-.33.97-.77,1.29-1.32.32-.56.48-1.17.48-1.83s-.16-1.3-.48-1.84c-.32-.55-.75-.99-1.29-1.32-.54-.33-1.15-.5-1.83-.5s-1.27.17-1.81.5c-.54.33-.97.77-1.29,1.32-.32.55-.48,1.16-.48,1.84s.16,1.28.48,1.83c.32.56.75,1,1.29,1.32.54.33,1.15.49,1.81.49ZM138,17.4c.67,0,1.27-.17,1.8-.5s.96-.77,1.28-1.32c.32-.55.48-1.16.48-1.82s-.16-1.27-.48-1.82c-.32-.55-.75-.99-1.28-1.32s-1.13-.5-1.78-.5-1.27.17-1.8.5c-.53.33-.96.77-1.28,1.32-.32.55-.48,1.16-.48,1.82s.16,1.27.48,1.82c.32.55.75.99,1.28,1.32.53.33,1.13.5,1.78.5ZM177.62,17.4c.67,0,1.27-.17,1.8-.5s.96-.77,1.28-1.32c.32-.55.48-1.16.48-1.82s-.16-1.27-.48-1.82c-.32-.55-.75-.99-1.28-1.32s-1.13-.5-1.78-.5-1.27.17-1.8.5-.96.77-1.28,1.32c-.32.55-.48,1.16-.48,1.82s.16,1.27.48,1.82c.32.55.75.99,1.28,1.32s1.13.5,1.78.5ZM3.31,10.19v6.75h1.9c.88,0,1.58-.17,2.11-.52s.93-.78,1.18-1.3c.25-.52.38-1.04.38-1.55s-.12-1.01-.36-1.53c-.24-.52-.63-.96-1.17-1.31-.53-.35-1.25-.53-2.14-.53h-1.9ZM3.31,3.83v3.88h1.88c.69,0,1.26-.16,1.69-.49.43-.33.65-.8.65-1.43s-.21-1.13-.64-1.46c-.42-.33-.96-.5-1.61-.5h-1.96ZM275.56,20.38c-.58,0-1.08-.2-1.48-.6-.4-.4-.6-.9-.6-1.5s.2-1.08.6-1.48c.4-.4.9-.6,1.48-.6s1.11.2,1.51.6.59.9.59,1.5-.2,1.08-.59,1.48-.9.6-1.51.6ZM225.6,5.58c-.51,0-.95-.18-1.3-.53s-.53-.79-.53-1.3.18-.97.53-1.31c.35-.35.79-.52,1.3-.52.53,0,.97.17,1.31.52.35.35.52.78.52,1.31s-.17.95-.52,1.3c-.35.35-.79.53-1.31.53ZM245.77,5.58c-.51,0-.95-.18-1.3-.53s-.53-.79-.53-1.3.18-.97.53-1.31c.35-.35.79-.52,1.3-.52.53,0,.97.17,1.31.52.35.35.52.78.52,1.31s-.17.95-.52,1.3c-.35.35-.78.53-1.31.53Z"/>
                        </g>
                      </svg>
                    `,
        },
        {
          title: 'Left Simple CTA',
          html_code: `<section> <div class="pbx-relative pbx-py-4"><div class="pbx-mx-auto pbx-px-6 pbx-py-24 pbx-sm:py-32 pbx-lg:px-8"> <div class="pbx-break-words pbx-text-6xl lg:pbx-text-8xl pbx-font-medium"> <h2>Boost your productivity. Start using our app today.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p> Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea. </p> </div> <div class="pbx-font-semibold pbx-py-4"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Learn more</a></p></div> </div></div> </section>`,
          category: 'Call To Action',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.67 74.41">
                        <defs>
                          <style>
                            .cls-1, .cls-2 {
                              fill: #394152;
                            }

                            .cls-2 {
                              fill-rule: evenodd;
                            }
                          </style>
                        </defs>
                        <rect class="cls-1" x="0" y="44.75" width="173.07" height="3.96" rx="1.98" ry="1.98"/>
                        <rect class="cls-1" x="0" y="55.48" width="173.07" height="3.96" rx="1.98" ry="1.98"/>
                        <rect class="cls-1" x="0" y="70.45" width="24.01" height="3.96" rx="1.98" ry="1.98"/>
                        <g id="svgGroup">
                          <path class="cls-2" d="M74.94,26.25h-3.54l4.15-8.31-5.15-10.44h3.62l2.33,4.79c.19.43.38.83.54,1.21.17.38.31.76.44,1.17.15-.4.31-.79.48-1.17.17-.37.36-.78.58-1.21l2.35-4.79h3.5l-9.31,18.75ZM263.06,26.25h-3.54l4.15-8.31-5.15-10.44h3.62l2.33,4.79c.19.43.38.83.54,1.21.17.38.31.76.44,1.17.15-.4.31-.79.48-1.17.17-.37.36-.78.58-1.21l2.35-4.79h3.5l-9.31,18.75ZM100.79,14.9v-7.4h3.27v6.96c0,.78.23,1.46.7,2.05.47.59,1.11.89,1.95.89.69,0,1.31-.25,1.86-.74.54-.49.81-1.2.81-2.14v-7.02h3.29v12.5h-3v-1.5c-.44.61-1,1.08-1.67,1.4s-1.38.48-2.15.48c-.87,0-1.7-.22-2.48-.65s-1.4-1.05-1.88-1.86c-.47-.81-.71-1.8-.71-2.97ZM186.96,14.9v-7.4h3.27v6.96c0,.78.23,1.46.7,2.05.47.59,1.11.89,1.95.89.69,0,1.31-.25,1.85-.74.54-.49.81-1.2.81-2.14v-7.02h3.29v12.5h-3v-1.5c-.44.61-1,1.08-1.67,1.4-.67.32-1.38.48-2.15.48-.88,0-1.7-.22-2.48-.65-.78-.43-1.4-1.05-1.88-1.86-.47-.81-.71-1.8-.71-2.97ZM180.85,8.46V0h3.29v20h-2.88v-1.33c-.49.5-1.08.9-1.77,1.19-.69.29-1.44.44-2.25.44-1.15,0-2.2-.3-3.15-.89-.94-.59-1.7-1.38-2.26-2.38-.56-.99-.84-2.09-.84-3.28s.28-2.31.84-3.29c.56-.99,1.32-1.77,2.26-2.36.94-.59,1.99-.89,3.15-.89.71,0,1.36.11,1.97.32s1.15.52,1.64.93ZM134.79,26.25h-3.27V7.5h2.85v1.33c.51-.51,1.11-.91,1.79-1.2.68-.28,1.42-.43,2.23-.43,1.17,0,2.22.29,3.17.88.94.58,1.7,1.37,2.26,2.36s.84,2.09.84,3.3-.28,2.29-.84,3.28c-.56.99-1.32,1.78-2.26,2.38-.94.59-2,.89-3.17.89-.71,0-1.37-.11-1.97-.33-.6-.22-1.15-.53-1.63-.92v7.21ZM44.65,18.81l.83-3.17c.4.58.95,1.08,1.64,1.48.69.4,1.41.6,2.16.6.54,0,.94-.11,1.2-.33.26-.22.38-.5.38-.83,0-.38-.13-.65-.4-.82-.26-.17-.53-.31-.79-.41l-1.73-.65c-.36-.15-.78-.36-1.27-.61-.49-.26-.91-.62-1.26-1.1-.35-.48-.53-1.11-.53-1.89,0-.71.17-1.36.52-1.96.35-.6.85-1.08,1.52-1.45.67-.37,1.46-.55,2.38-.55.83,0,1.63.14,2.4.43.76.28,1.34.64,1.73,1.05l-.79,3.08c-.43-.61-.96-1.09-1.59-1.43-.63-.34-1.24-.51-1.82-.51-.47,0-.83.11-1.07.32-.24.22-.36.47-.36.76,0,.21.08.41.25.61.17.2.44.37.81.51l1.65.62c.43.15.9.37,1.42.64.51.27.96.65,1.32,1.14s.55,1.15.55,2c0,1.18-.43,2.15-1.3,2.9s-2,1.12-3.39,1.12c-.79,0-1.6-.14-2.44-.41-.83-.27-1.5-.66-2-1.16ZM212.46,8.83l-.88,3.46c-.35-.6-.83-1.11-1.44-1.55-.61-.44-1.32-.66-2.12-.66-.69,0-1.32.17-1.86.5s-.98.77-1.29,1.32c-.31.55-.47,1.16-.47,1.84s.16,1.28.47,1.83c.31.56.74,1,1.29,1.32.55.33,1.17.49,1.86.49.81,0,1.51-.22,2.12-.65s1.09-.95,1.44-1.56l.88,3.48c-.6.56-1.28.98-2.06,1.27-.78.29-1.6.44-2.48.44-1.24,0-2.36-.3-3.39-.9-1.02-.6-1.83-1.4-2.43-2.41-.6-1.01-.9-2.11-.9-3.32s.3-2.34.9-3.34c.6-1.01,1.41-1.81,2.43-2.4,1.02-.59,2.15-.89,3.39-.89.87,0,1.7.15,2.48.44.78.29,1.47.71,2.06,1.27ZM5.52,20H0V1.25h5.71c1.24,0,2.22.24,2.96.72.74.48,1.26,1.06,1.57,1.73.31.67.47,1.31.47,1.91s-.12,1.12-.35,1.62-.56.93-.96,1.29c.89.51,1.61,1.22,2.17,2.12.56.9.83,1.91.83,3.02s-.26,2.07-.78,3.03c-.52.97-1.29,1.76-2.31,2.38s-2.28.93-3.78.93ZM242.42,7.5l-6.73,13.12-6.71-13.12h3.65l2.1,4.38c.19.38.38.75.54,1.12.17.38.33.81.5,1.29.17-.49.33-.92.5-1.29.17-.37.35-.75.54-1.12l2.1-4.38h3.5ZM60.88,20h-3.27v-9.88h-2.46v-2.62h2.52V3.33h3.15v4.17h2.65v2.62h-2.58v9.88ZM219.29,20h-3.27v-9.88h-2.46v-2.62h2.52V3.33h3.15v4.17h2.65v2.62h-2.58v9.88ZM255.25,20h-3.27v-9.88h-2.46v-2.62h2.52V3.33h3.15v4.17h2.65v2.62h-2.58v9.88ZM21.02,20.38c-1.24,0-2.36-.3-3.39-.9-1.02-.6-1.83-1.4-2.43-2.4-.6-1-.9-2.11-.9-3.33s.3-2.35.9-3.34c.6-.99,1.41-1.79,2.43-2.39,1.02-.6,2.14-.9,3.36-.9s2.38.3,3.4.9c1.01.6,1.82,1.39,2.43,2.39.6.99.91,2.11.91,3.34,0,1.21-.3,2.32-.91,3.32-.6,1.01-1.41,1.81-2.43,2.41-1.01.6-2.14.9-3.38.9ZM36.12,20.38c-1.24,0-2.36-.3-3.38-.9-1.02-.6-1.83-1.4-2.43-2.4-.6-1-.9-2.11-.9-3.33s.3-2.35.9-3.34c.6-.99,1.41-1.79,2.43-2.39,1.02-.6,2.14-.9,3.36-.9s2.38.3,3.4.9c1.01.6,1.82,1.39,2.43,2.39.6.99.91,2.11.91,3.34,0,1.21-.3,2.32-.91,3.32-.6,1.01-1.41,1.81-2.43,2.41s-2.14.9-3.38.9ZM91.96,20.38c-1.24,0-2.36-.3-3.39-.9s-1.83-1.4-2.43-2.4-.9-2.11-.9-3.33.3-2.35.9-3.34c.6-.99,1.41-1.79,2.43-2.39,1.02-.6,2.14-.9,3.37-.9s2.38.3,3.39.9c1.01.6,1.82,1.39,2.43,2.39.6.99.91,2.11.91,3.34s-.3,2.32-.91,3.32c-.6,1.01-1.41,1.81-2.43,2.41-1.01.6-2.14.9-3.38.9ZM162.6,20.38c-1.24,0-2.36-.3-3.39-.9-1.02-.6-1.83-1.4-2.43-2.4-.6-1-.9-2.11-.9-3.33s.3-2.35.9-3.34c.6-.99,1.41-1.79,2.43-2.39,1.02-.6,2.14-.9,3.36-.9s2.38.3,3.4.9c1.01.6,1.82,1.39,2.43,2.39.6.99.91,2.11.91,3.34s-.3,2.32-.91,3.32c-.6,1.01-1.41,1.81-2.43,2.41-1.01.6-2.14.9-3.38.9ZM119,20h-3.27V7.5h2.96v2.19c.43-.74.99-1.31,1.67-1.71.68-.4,1.48-.6,2.4-.6l.73,2.96c-.26-.08-.56-.12-.9-.12-1.08,0-1.95.35-2.6,1.04s-.98,1.68-.98,2.96v5.79ZM150.31,20h-3.27V7.5h2.96v2.19c.43-.74.99-1.31,1.67-1.71.68-.4,1.48-.6,2.4-.6l.73,2.96c-.26-.08-.56-.12-.9-.12-1.08,0-1.95.35-2.6,1.04-.65.69-.98,1.68-.98,2.96v5.79ZM227.25,20h-3.29V7.5h3.29v12.5ZM247.42,20h-3.29V7.5h3.29v12.5ZM21,17.4c.68,0,1.29-.16,1.83-.49.54-.33.97-.77,1.29-1.32.32-.56.48-1.17.48-1.83,0-.68-.16-1.3-.48-1.84-.32-.55-.75-.99-1.29-1.32-.54-.33-1.15-.5-1.83-.5s-1.27.17-1.81.5c-.54.33-.97.77-1.29,1.32-.32.55-.48,1.16-.48,1.84s.16,1.28.48,1.83c.32.56.75,1,1.29,1.32.54.33,1.15.49,1.81.49ZM36.1,17.4c.68,0,1.29-.16,1.83-.49.54-.33.97-.77,1.29-1.32.32-.56.48-1.17.48-1.83s-.16-1.3-.48-1.84c-.32-.55-.75-.99-1.29-1.32-.54-.33-1.15-.5-1.83-.5s-1.27.17-1.81.5c-.54.33-.97.77-1.29,1.32-.32.55-.48,1.16-.48,1.84s.16,1.28.48,1.83c.32.56.75,1,1.29,1.32.54.33,1.15.49,1.81.49ZM91.94,17.4c.68,0,1.29-.16,1.83-.49.54-.33.97-.77,1.29-1.32.32-.56.48-1.17.48-1.83s-.16-1.3-.48-1.84c-.32-.55-.75-.99-1.29-1.32-.54-.33-1.15-.5-1.83-.5s-1.27.17-1.81.5c-.54.33-.97.77-1.29,1.32-.32.55-.48,1.16-.48,1.84s.16,1.28.48,1.83c.32.56.75,1,1.29,1.32.54.33,1.15.49,1.81.49ZM162.58,17.4c.68,0,1.29-.16,1.83-.49.54-.33.97-.77,1.29-1.32.32-.56.48-1.17.48-1.83s-.16-1.3-.48-1.84c-.32-.55-.75-.99-1.29-1.32-.54-.33-1.15-.5-1.83-.5s-1.27.17-1.81.5c-.54.33-.97.77-1.29,1.32-.32.55-.48,1.16-.48,1.84s.16,1.28.48,1.83c.32.56.75,1,1.29,1.32.54.33,1.15.49,1.81.49ZM138,17.4c.67,0,1.27-.17,1.8-.5s.96-.77,1.28-1.32c.32-.55.48-1.16.48-1.82s-.16-1.27-.48-1.82c-.32-.55-.75-.99-1.28-1.32s-1.13-.5-1.78-.5-1.27.17-1.8.5c-.53.33-.96.77-1.28,1.32-.32.55-.48,1.16-.48,1.82s.16,1.27.48,1.82c.32.55.75.99,1.28,1.32.53.33,1.13.5,1.78.5ZM177.62,17.4c.67,0,1.27-.17,1.8-.5s.96-.77,1.28-1.32c.32-.55.48-1.16.48-1.82s-.16-1.27-.48-1.82c-.32-.55-.75-.99-1.28-1.32s-1.13-.5-1.78-.5-1.27.17-1.8.5-.96.77-1.28,1.32c-.32.55-.48,1.16-.48,1.82s.16,1.27.48,1.82c.32.55.75.99,1.28,1.32s1.13.5,1.78.5ZM3.31,10.19v6.75h1.9c.88,0,1.58-.17,2.11-.52s.93-.78,1.18-1.3c.25-.52.38-1.04.38-1.55s-.12-1.01-.36-1.53c-.24-.52-.63-.96-1.17-1.31-.53-.35-1.25-.53-2.14-.53h-1.9ZM3.31,3.83v3.88h1.88c.69,0,1.26-.16,1.69-.49.43-.33.65-.8.65-1.43s-.21-1.13-.64-1.46c-.42-.33-.96-.5-1.61-.5h-1.96ZM275.56,20.38c-.58,0-1.08-.2-1.48-.6-.4-.4-.6-.9-.6-1.5s.2-1.08.6-1.48c.4-.4.9-.6,1.48-.6s1.11.2,1.51.6.59.9.59,1.5-.2,1.08-.59,1.48-.9.6-1.51.6ZM225.6,5.58c-.51,0-.95-.18-1.3-.53s-.53-.79-.53-1.3.18-.97.53-1.31c.35-.35.79-.52,1.3-.52.53,0,.97.17,1.31.52.35.35.52.78.52,1.31s-.17.95-.52,1.3c-.35.35-.79.53-1.31.53ZM245.77,5.58c-.51,0-.95-.18-1.3-.53s-.53-.79-.53-1.3.18-.97.53-1.31c.35-.35.79-.52,1.3-.52.53,0,.97.17,1.31.52.35.35.52.78.52,1.31s-.17.95-.52,1.3c-.35.35-.78.53-1.31.53Z"/>
                        </g>
                      </svg>
                    `,
        },
        {
          title: 'Image & Left CTA',
          html_code: `<section><div class="pbx-myPrimaryGap pbx-grid pbx-grid-cols-1 sm:pbx-grid-cols-2 lg:pbx-grid-cols-2"> <img class="pbx-object-cover pbx-w-full pbx-object-top pbx-aspect-square" src="${getPlaceholderImageDataUrl()}" alt="provider"/> <div class="pbx-mx-auto pbx-px-6 pbx-py-12"> <div class="pbx-break-words pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>Boost your productivity. Start using our app today.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p> Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea. </p> </div> <div class="pbx-font-semibold pbx-py-4"> <p> <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com" >Learn more</a > </p> </div> </div> </div></section>`,
          category: 'Call To Action',
          cover_image: `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470.69 129.8">
                        <defs>
                          <style>
                            .cls-1, .cls-2 {
                              fill: #394152;
                            }

                            .cls-3 {
                              fill: #718096;
                            }

                            .cls-2 {
                              fill-rule: evenodd;
                            }
                          </style>
                        </defs>
                        <g>
                          <rect class="cls-1" width="173.06" height="129.8"/>
                          <polygon class="cls-3" points="56.24 77.89 77.88 51.93 99.51 77.89 56.24 77.89"/>
                          <polygon class="cls-3" points="95.19 77.89 106 64.91 116.82 77.89 95.19 77.89"/>
                          <circle class="cls-3" cx="106" cy="55.51" r="3.6"/>
                        </g>
                        <rect class="cls-1" x="193.02" y="52.44" width="173.07" height="3.96" rx="1.98" ry="1.98"/>
                        <rect class="cls-1" x="193.02" y="63.17" width="173.07" height="3.96" rx="1.98" ry="1.98"/>
                        <rect class="cls-1" x="193.02" y="88.14" width="24.01" height="3.96" rx="1.98" ry="1.98"/>
                        <g id="svgGroup">
                          <path class="cls-2" d="M267.96,33.94h-3.54l4.15-8.31-5.15-10.44h3.62l2.33,4.79c.19.43.38.83.54,1.21.17.38.31.76.44,1.17.15-.4.31-.79.48-1.17.17-.37.36-.78.58-1.21l2.35-4.79h3.5l-9.31,18.75ZM456.08,33.94h-3.54l4.15-8.31-5.15-10.44h3.62l2.33,4.79c.19.43.38.83.54,1.21.17.38.31.76.44,1.17.15-.4.31-.79.48-1.17.17-.37.36-.78.58-1.21l2.35-4.79h3.5l-9.31,18.75ZM293.81,22.59v-7.4h3.27v6.96c0,.78.23,1.46.7,2.05.47.59,1.11.89,1.95.89.69,0,1.31-.25,1.86-.74.54-.49.81-1.2.81-2.14v-7.02h3.29v12.5h-3v-1.5c-.44.61-1,1.08-1.67,1.4s-1.38.48-2.15.48c-.87,0-1.7-.22-2.48-.65s-1.4-1.05-1.88-1.86c-.47-.81-.71-1.8-.71-2.97ZM379.98,22.59v-7.4h3.27v6.96c0,.78.23,1.46.7,2.05.47.59,1.11.89,1.95.89.69,0,1.31-.25,1.85-.74.54-.49.81-1.2.81-2.14v-7.02h3.29v12.5h-3v-1.5c-.44.61-1,1.08-1.67,1.4-.67.32-1.38.48-2.15.48-.88,0-1.7-.22-2.48-.65-.78-.43-1.4-1.05-1.88-1.86-.47-.81-.71-1.8-.71-2.97ZM373.88,16.15V7.69h3.29v20h-2.88v-1.33c-.49.5-1.08.9-1.77,1.19-.69.29-1.44.44-2.25.44-1.15,0-2.2-.3-3.15-.89-.94-.59-1.7-1.38-2.26-2.38-.56-.99-.84-2.09-.84-3.28s.28-2.31.84-3.29c.56-.99,1.32-1.77,2.26-2.36.94-.59,1.99-.89,3.15-.89.71,0,1.36.11,1.97.32s1.15.52,1.64.93ZM327.81,33.94h-3.27V15.19h2.85v1.33c.51-.51,1.11-.91,1.79-1.2.68-.28,1.42-.43,2.23-.43,1.17,0,2.22.29,3.17.88.94.58,1.7,1.37,2.26,2.36s.84,2.09.84,3.3-.28,2.29-.84,3.28c-.56.99-1.32,1.78-2.26,2.38-.94.59-2,.89-3.17.89-.71,0-1.37-.11-1.97-.33-.6-.22-1.15-.53-1.63-.92v7.21ZM237.67,26.51l.83-3.17c.4.58.95,1.08,1.64,1.48.69.4,1.41.6,2.16.6.54,0,.94-.11,1.2-.33.26-.22.38-.5.38-.83,0-.38-.13-.65-.4-.82-.26-.17-.53-.31-.79-.41l-1.73-.65c-.36-.15-.78-.36-1.27-.61-.49-.26-.91-.62-1.26-1.1-.35-.48-.53-1.11-.53-1.89,0-.71.17-1.36.52-1.96.35-.6.85-1.08,1.52-1.45.67-.37,1.46-.55,2.38-.55.83,0,1.63.14,2.4.43.76.28,1.34.64,1.73,1.05l-.79,3.08c-.43-.61-.96-1.09-1.59-1.43-.63-.34-1.24-.51-1.82-.51-.47,0-.83.11-1.07.32-.24.22-.36.47-.36.76,0,.21.08.41.25.61.17.2.44.37.81.51l1.65.62c.43.15.9.37,1.42.64.51.27.96.65,1.32,1.14s.55,1.15.55,2c0,1.18-.43,2.15-1.3,2.9s-2,1.12-3.39,1.12c-.79,0-1.6-.14-2.44-.41-.83-.27-1.5-.66-2-1.16ZM405.48,16.53l-.88,3.46c-.35-.6-.83-1.11-1.44-1.55-.61-.44-1.32-.66-2.12-.66-.69,0-1.32.17-1.86.5s-.98.77-1.29,1.32c-.31.55-.47,1.16-.47,1.84s.16,1.28.47,1.83c.31.56.74,1,1.29,1.32.55.33,1.17.49,1.86.49.81,0,1.51-.22,2.12-.65s1.09-.95,1.44-1.56l.88,3.48c-.6.56-1.28.98-2.06,1.27-.78.29-1.6.44-2.48.44-1.24,0-2.36-.3-3.39-.9-1.02-.6-1.83-1.4-2.43-2.41-.6-1.01-.9-2.11-.9-3.32s.3-2.34.9-3.34c.6-1.01,1.41-1.81,2.43-2.4,1.02-.59,2.15-.89,3.39-.89.87,0,1.7.15,2.48.44.78.29,1.47.71,2.06,1.27ZM198.54,27.69h-5.52V8.94h5.71c1.24,0,2.22.24,2.96.72.74.48,1.26,1.06,1.57,1.73.31.67.47,1.31.47,1.91s-.12,1.12-.35,1.62-.56.93-.96,1.29c.89.51,1.61,1.22,2.17,2.12.56.9.83,1.91.83,3.02s-.26,2.07-.78,3.03c-.52.97-1.29,1.76-2.31,2.38s-2.28.93-3.78.93ZM435.44,15.19l-6.73,13.12-6.71-13.12h3.65l2.1,4.38c.19.38.38.75.54,1.12.17.38.33.81.5,1.29.17-.49.33-.92.5-1.29.17-.37.35-.75.54-1.12l2.1-4.38h3.5ZM253.9,27.69h-3.27v-9.88h-2.46v-2.62h2.52v-4.17h3.15v4.17h2.65v2.62h-2.58v9.88ZM412.31,27.69h-3.27v-9.88h-2.46v-2.62h2.52v-4.17h3.15v4.17h2.65v2.62h-2.58v9.88ZM448.27,27.69h-3.27v-9.88h-2.46v-2.62h2.52v-4.17h3.15v4.17h2.65v2.62h-2.58v9.88ZM214.04,28.07c-1.24,0-2.36-.3-3.39-.9-1.02-.6-1.83-1.4-2.43-2.4-.6-1-.9-2.11-.9-3.33s.3-2.35.9-3.34c.6-.99,1.41-1.79,2.43-2.39,1.02-.6,2.14-.9,3.36-.9s2.38.3,3.4.9c1.01.6,1.82,1.39,2.43,2.39.6.99.91,2.11.91,3.34,0,1.21-.3,2.32-.91,3.32-.6,1.01-1.41,1.81-2.43,2.41-1.01.6-2.14.9-3.38.9ZM229.15,28.07c-1.24,0-2.36-.3-3.38-.9-1.02-.6-1.83-1.4-2.43-2.4-.6-1-.9-2.11-.9-3.33s.3-2.35.9-3.34c.6-.99,1.41-1.79,2.43-2.39,1.02-.6,2.14-.9,3.36-.9s2.38.3,3.4.9c1.01.6,1.82,1.39,2.43,2.39.6.99.91,2.11.91,3.34,0,1.21-.3,2.32-.91,3.32-.6,1.01-1.41,1.81-2.43,2.41s-2.14.9-3.38.9ZM284.98,28.07c-1.24,0-2.36-.3-3.39-.9s-1.83-1.4-2.43-2.4-.9-2.11-.9-3.33.3-2.35.9-3.34c.6-.99,1.41-1.79,2.43-2.39,1.02-.6,2.14-.9,3.37-.9s2.38.3,3.39.9c1.01.6,1.82,1.39,2.43,2.39.6.99.91,2.11.91,3.34s-.3,2.32-.91,3.32c-.6,1.01-1.41,1.81-2.43,2.41-1.01.6-2.14.9-3.38.9ZM355.63,28.07c-1.24,0-2.36-.3-3.39-.9-1.02-.6-1.83-1.4-2.43-2.4-.6-1-.9-2.11-.9-3.33s.3-2.35.9-3.34c.6-.99,1.41-1.79,2.43-2.39,1.02-.6,2.14-.9,3.36-.9s2.38.3,3.4.9c1.01.6,1.82,1.39,2.43,2.39.6.99.91,2.11.91,3.34s-.3,2.32-.91,3.32c-.6,1.01-1.41,1.81-2.43,2.41-1.01.6-2.14.9-3.38.9ZM312.02,27.69h-3.27v-12.5h2.96v2.19c.43-.74.99-1.31,1.67-1.71.68-.4,1.48-.6,2.4-.6l.73,2.96c-.26-.08-.56-.12-.9-.12-1.08,0-1.95.35-2.6,1.04s-.98,1.68-.98,2.96v5.79ZM343.33,27.69h-3.27v-12.5h2.96v2.19c.43-.74.99-1.31,1.67-1.71.68-.4,1.48-.6,2.4-.6l.73,2.96c-.26-.08-.56-.12-.9-.12-1.08,0-1.95.35-2.6,1.04-.65.69-.98,1.68-.98,2.96v5.79ZM420.27,27.69h-3.29v-12.5h3.29v12.5ZM440.44,27.69h-3.29v-12.5h3.29v12.5ZM214.02,25.09c.68,0,1.29-.16,1.83-.49.54-.33.97-.77,1.29-1.32.32-.56.48-1.17.48-1.83,0-.68-.16-1.3-.48-1.84-.32-.55-.75-.99-1.29-1.32-.54-.33-1.15-.5-1.83-.5s-1.27.17-1.81.5c-.54.33-.97.77-1.29,1.32-.32.55-.48,1.16-.48,1.84s.16,1.28.48,1.83c.32.56.75,1,1.29,1.32.54.33,1.15.49,1.81.49ZM229.13,25.09c.68,0,1.29-.16,1.83-.49.54-.33.97-.77,1.29-1.32.32-.56.48-1.17.48-1.83s-.16-1.3-.48-1.84c-.32-.55-.75-.99-1.29-1.32-.54-.33-1.15-.5-1.83-.5s-1.27.17-1.81.5c-.54.33-.97.77-1.29,1.32-.32.55-.48,1.16-.48,1.84s.16,1.28.48,1.83c.32.56.75,1,1.29,1.32.54.33,1.15.49,1.81.49ZM284.96,25.09c.68,0,1.29-.16,1.83-.49.54-.33.97-.77,1.29-1.32.32-.56.48-1.17.48-1.83s-.16-1.3-.48-1.84c-.32-.55-.75-.99-1.29-1.32-.54-.33-1.15-.5-1.83-.5s-1.27.17-1.81.5c-.54.33-.97.77-1.29,1.32-.32.55-.48,1.16-.48,1.84s.16,1.28.48,1.83c.32.56.75,1,1.29,1.32.54.33,1.15.49,1.81.49ZM355.6,25.09c.68,0,1.29-.16,1.83-.49.54-.33.97-.77,1.29-1.32.32-.56.48-1.17.48-1.83s-.16-1.3-.48-1.84c-.32-.55-.75-.99-1.29-1.32-.54-.33-1.15-.5-1.83-.5s-1.27.17-1.81.5c-.54.33-.97.77-1.29,1.32-.32.55-.48,1.16-.48,1.84s.16,1.28.48,1.83c.32.56.75,1,1.29,1.32.54.33,1.15.49,1.81.49ZM331.02,25.09c.67,0,1.27-.17,1.8-.5s.96-.77,1.28-1.32c.32-.55.48-1.16.48-1.82s-.16-1.27-.48-1.82c-.32-.55-.75-.99-1.28-1.32s-1.13-.5-1.78-.5-1.27.17-1.8.5c-.53.33-.96.77-1.28,1.32-.32.55-.48,1.16-.48,1.82s.16,1.27.48,1.82c.32.55.75.99,1.28,1.32.53.33,1.13.5,1.78.5ZM370.65,25.09c.67,0,1.27-.17,1.8-.5s.96-.77,1.28-1.32c.32-.55.48-1.16.48-1.82s-.16-1.27-.48-1.82c-.32-.55-.75-.99-1.28-1.32s-1.13-.5-1.78-.5-1.27.17-1.8.5-.96.77-1.28,1.32c-.32.55-.48,1.16-.48,1.82s.16,1.27.48,1.82c.32.55.75.99,1.28,1.32s1.13.5,1.78.5ZM196.33,17.88v6.75h1.9c.88,0,1.58-.17,2.11-.52s.93-.78,1.18-1.3c.25-.52.38-1.04.38-1.55s-.12-1.01-.36-1.53c-.24-.52-.63-.96-1.17-1.31-.53-.35-1.25-.53-2.14-.53h-1.9ZM196.33,11.53v3.88h1.88c.69,0,1.26-.16,1.69-.49.43-.33.65-.8.65-1.43s-.21-1.13-.64-1.46c-.42-.33-.96-.5-1.61-.5h-1.96ZM468.58,28.07c-.58,0-1.08-.2-1.48-.6-.4-.4-.6-.9-.6-1.5s.2-1.08.6-1.48c.4-.4.9-.6,1.48-.6s1.11.2,1.51.6.59.9.59,1.5-.2,1.08-.59,1.48-.9.6-1.51.6ZM418.63,13.28c-.51,0-.95-.18-1.3-.53s-.53-.79-.53-1.3.18-.97.53-1.31c.35-.35.79-.52,1.3-.52.53,0,.97.17,1.31.52.35.35.52.78.52,1.31s-.17.95-.52,1.3c-.35.35-.79.53-1.31.53ZM438.79,13.28c-.51,0-.95-.18-1.3-.53s-.53-.79-.53-1.3.18-.97.53-1.31c.35-.35.79-.52,1.3-.52.53,0,.97.17,1.31.52.35.35.52.78.52,1.31s-.17.95-.52,1.3c-.35.35-.78.53-1.31.53Z"/>
                        </g>
                      </svg>
                    `,
        },
      ],
    },
  },
]

export default component
