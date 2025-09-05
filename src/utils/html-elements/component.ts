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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 422.91 129.8">
  <defs>
    <style>
      .cls-1 {
        fill: #231f20;
      }

      .cls-2 {
        fill: #394152;
      }

      .cls-3 {
        fill: #718096;
      }
    </style>
  </defs>
  <g>
    <rect class="cls-2" width="173.06" height="129.8"/>
    <polygon class="cls-3" points="56.24 77.89 77.88 51.93 99.51 77.89 56.24 77.89"/>
    <polygon class="cls-3" points="95.19 77.89 106 64.91 116.82 77.89 95.19 77.89"/>
    <circle class="cls-3" cx="106" cy="55.51" r="3.6"/>
  </g>
  <rect class="cls-2" x="193.02" y="52.44" width="173.07" height="3.96" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="193.02" y="63.17" width="173.07" height="3.96" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="193.02" y="88.14" width="24.01" height="3.96" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="283.02" y="88.14" width="24.01" height="3.96" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="193.02" y="111.14" width="24.01" height="3.96" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="283.02" y="111.14" width="24.01" height="3.96" rx="1.98" ry="1.98"/>
  <g>
    <path class="cls-1" d="M191.28,4.59h7.98v1.78h-3.02v9.66h-1.93V6.37h-3.02v-1.78Z"/>
    <path class="cls-1" d="M200.96,16.03h-1.75v-7.52h1.75v7.52ZM202.75,10.1c-.15-.07-.33-.1-.55-.1-.29,0-.53.08-.72.23-.19.15-.32.36-.4.63-.08.27-.12.58-.12.94l-.59-.34c0-.6.11-1.13.33-1.59.22-.46.51-.83.87-1.11.35-.28.72-.42,1.1-.42.27,0,.53.04.77.13.24.09.45.23.62.44l-.87,1.49c-.15-.13-.3-.23-.45-.29Z"/>
    <path class="cls-1" d="M207.43,14.33c.23.29.58.44,1.06.44.33,0,.62-.07.87-.21.25-.14.45-.34.59-.59.14-.25.21-.54.21-.88v-4.58h1.77v7.52h-1.77v-1.16c-.24.44-.55.77-.92.99-.38.22-.83.34-1.35.34-.84,0-1.49-.26-1.94-.78-.45-.52-.68-1.23-.68-2.13v-4.77h1.81v4.58c0,.53.11.95.34,1.24Z"/>
    <path class="cls-1" d="M215.27,14.24c.24.18.48.33.74.43.25.1.5.15.75.15.32,0,.56-.07.74-.21.18-.14.27-.34.27-.59,0-.22-.07-.41-.21-.56-.14-.16-.34-.29-.59-.41-.25-.11-.55-.23-.88-.35-.34-.13-.67-.29-1.01-.47-.33-.18-.6-.42-.82-.71-.21-.29-.32-.66-.32-1.11s.12-.84.35-1.14c.23-.31.55-.53.95-.68s.83-.22,1.28-.22c.41,0,.8.06,1.17.18s.7.28.99.47c.29.2.54.42.75.67l-.98,1.05c-.24-.29-.53-.53-.88-.72-.35-.18-.71-.28-1.08-.28-.26,0-.47.05-.64.16-.16.11-.24.27-.24.47,0,.17.07.33.22.47.15.14.34.26.59.37.25.11.52.22.83.34.43.16.81.34,1.16.54.35.2.63.44.83.72.21.28.31.65.31,1.11,0,.71-.24,1.28-.73,1.71s-1.14.65-1.95.65c-.52,0-1-.08-1.42-.24-.43-.16-.8-.37-1.13-.62-.33-.26-.6-.53-.82-.81l1.03-1.05c.25.27.5.5.74.69Z"/>
    <path class="cls-1" d="M224.34,8.52v1.55h-4.27v-1.55h4.27ZM223.08,5.9v10.13h-1.73V5.9h1.73Z"/>
    <path class="cls-1" d="M226.8,15.71c-.58-.33-1.03-.78-1.35-1.37s-.47-1.28-.47-2.06.16-1.49.48-2.08c.32-.59.78-1.04,1.36-1.36.59-.32,1.28-.48,2.08-.48s1.47.15,2.04.46c.56.31.99.74,1.28,1.32.29.57.44,1.26.44,2.07,0,.09,0,.18,0,.28,0,.1,0,.17,0,.21h-6.6v-1.23h5.08l-.54.75c.03-.07.07-.15.11-.26.04-.11.06-.2.06-.28,0-.4-.08-.75-.24-1.05-.16-.29-.38-.52-.65-.69-.28-.16-.6-.24-.97-.24-.45,0-.83.1-1.14.29s-.55.48-.72.85-.25.83-.25,1.37c-.01.53.07.99.24,1.37.17.38.41.67.73.87s.7.29,1.16.29c.49,0,.92-.1,1.28-.29.36-.2.65-.5.88-.9l1.54.61c-.4.68-.92,1.19-1.54,1.53s-1.37.51-2.24.51c-.76,0-1.44-.16-2.02-.49Z"/>
    <path class="cls-1" d="M234.29,10.16c.34-.58.79-1.03,1.35-1.34s1.16-.47,1.81-.47,1.18.16,1.66.47.85.77,1.13,1.35c.28.58.42,1.28.42,2.1s-.14,1.5-.42,2.09c-.28.59-.65,1.04-1.13,1.36s-1.03.47-1.66.47-1.25-.16-1.81-.47-1.01-.76-1.35-1.35-.51-1.29-.51-2.11.17-1.53.51-2.12ZM235.93,13.57c.21.36.48.63.83.82s.72.28,1.12.28c.35,0,.69-.09,1.01-.28.33-.19.6-.45.81-.81.21-.35.32-.79.32-1.3s-.11-.95-.32-1.3c-.21-.35-.48-.62-.81-.81-.33-.18-.66-.28-1.01-.28-.4,0-.78.09-1.12.28-.34.19-.62.46-.83.82s-.31.79-.31,1.29.1.93.31,1.29ZM241.79,3.28v12.75h-1.78V3.28h1.78Z"/>
    <path class="cls-1" d="M250.61,16.03h-1.78V3.28h1.78v12.75ZM256.33,14.38c-.34.59-.78,1.04-1.34,1.35-.56.31-1.16.47-1.81.47s-1.17-.16-1.65-.47-.86-.77-1.14-1.36c-.28-.59-.42-1.29-.42-2.09s.14-1.52.42-2.1c.28-.58.66-1.03,1.14-1.35s1.03-.47,1.65-.47c.65,0,1.26.16,1.81.47.56.31,1,.76,1.34,1.34.34.58.51,1.29.51,2.12s-.17,1.52-.51,2.11ZM254.69,10.98c-.21-.36-.48-.63-.82-.82-.34-.18-.71-.28-1.13-.28-.35,0-.69.09-1.01.28-.33.19-.6.46-.81.81-.21.35-.32.79-.32,1.3s.11.95.32,1.3c.21.35.48.62.81.81.33.19.66.28,1.01.28.41,0,.79-.09,1.13-.28s.61-.46.82-.82.31-.79.31-1.29-.1-.93-.31-1.29Z"/>
    <path class="cls-1" d="M260.02,19.63h-1.88l1.98-4.48-3.04-6.64h2.03l2.4,5.95-.83-.05,2.35-5.9h1.9l-4.9,11.12Z"/>
    <path class="cls-1" d="M274.13,8.52v1.55h-4.27v-1.55h4.27ZM272.87,5.9v10.13h-1.73V5.9h1.73Z"/>
    <path class="cls-1" d="M277.12,16.03h-1.78V3.28h1.78v12.75ZM279.84,10.2c-.22-.28-.57-.43-1.05-.43-.34,0-.63.07-.88.21s-.44.34-.58.59c-.14.25-.2.54-.2.88h-.43c0-.6.11-1.14.32-1.61.21-.47.52-.85.92-1.13s.88-.42,1.45-.42,1.04.11,1.42.33c.38.22.67.54.87.97.2.43.29.97.29,1.61v4.82h-1.78v-4.58c0-.56-.11-.98-.34-1.26Z"/>
    <path class="cls-1" d="M284.17,10.23c.35-.59.84-1.05,1.46-1.38.62-.33,1.3-.5,2.07-.5s1.47.17,2.08.5c.61.33,1.09.79,1.45,1.38.35.59.53,1.27.53,2.04s-.18,1.44-.53,2.03c-.35.59-.84,1.06-1.45,1.39-.61.33-1.3.5-2.08.5s-1.45-.17-2.07-.5c-.62-.33-1.1-.8-1.46-1.39-.35-.59-.53-1.27-.53-2.03s.18-1.46.53-2.04ZM285.75,13.51c.2.35.46.63.8.83.34.2.72.3,1.14.3s.81-.1,1.14-.3c.34-.2.6-.48.8-.83.2-.35.29-.77.29-1.23s-.1-.88-.29-1.24c-.2-.36-.46-.64-.8-.83-.34-.2-.72-.29-1.14-.29s-.81.1-1.14.29-.6.47-.8.83c-.2.36-.29.77-.29,1.24s.1.88.29,1.23Z"/>
    <path class="cls-1" d="M295.59,14.33c.23.29.58.44,1.06.44.33,0,.62-.07.87-.21.25-.14.45-.34.59-.59.14-.25.21-.54.21-.88v-4.58h1.77v7.52h-1.77v-1.16c-.24.44-.55.77-.92.99-.38.22-.83.34-1.35.34-.84,0-1.49-.26-1.94-.78-.45-.52-.68-1.23-.68-2.13v-4.77h1.81v4.58c0,.53.11.95.34,1.24Z"/>
    <path class="cls-1" d="M303.42,14.24c.24.18.48.33.74.43.25.1.5.15.75.15.32,0,.56-.07.74-.21.18-.14.27-.34.27-.59,0-.22-.07-.41-.21-.56-.14-.16-.34-.29-.59-.41-.25-.11-.55-.23-.88-.35-.34-.13-.67-.29-1.01-.47-.33-.18-.6-.42-.82-.71-.21-.29-.32-.66-.32-1.11s.12-.84.35-1.14c.23-.31.55-.53.95-.68s.83-.22,1.28-.22c.41,0,.8.06,1.17.18s.7.28.99.47c.29.2.54.42.75.67l-.98,1.05c-.24-.29-.53-.53-.88-.72-.35-.18-.71-.28-1.08-.28-.26,0-.47.05-.64.16-.16.11-.24.27-.24.47,0,.17.07.33.22.47.15.14.34.26.59.37.25.11.52.22.83.34.43.16.81.34,1.16.54.35.2.63.44.83.72.21.28.31.65.31,1.11,0,.71-.24,1.28-.73,1.71s-1.14.65-1.95.65c-.52,0-1-.08-1.42-.24-.43-.16-.8-.37-1.13-.62-.33-.26-.6-.53-.82-.81l1.03-1.05c.25.27.5.5.74.69Z"/>
    <path class="cls-1" d="M310.56,14.34c.12.18.29.31.5.4.21.09.45.13.73.13.36,0,.68-.07.97-.22.29-.15.52-.36.69-.63.17-.27.26-.6.26-.98l.26.98c0,.48-.14.88-.42,1.21-.28.33-.63.57-1.05.73-.42.16-.85.24-1.28.24-.47,0-.9-.09-1.31-.28-.4-.18-.73-.46-.96-.82-.24-.36-.36-.8-.36-1.31,0-.73.26-1.31.77-1.74s1.24-.65,2.17-.65c.5,0,.93.05,1.3.16.36.11.67.24.91.38.24.15.41.28.51.4v.9c-.34-.24-.7-.41-1.08-.52-.38-.11-.78-.16-1.21-.16-.37,0-.67.05-.9.14s-.4.22-.51.38c-.11.16-.17.37-.17.61s.06.47.18.65ZM309.11,9.23c.35-.21.79-.41,1.32-.6.53-.2,1.15-.29,1.86-.29.61,0,1.16.09,1.63.27.48.18.85.44,1.12.79.27.35.4.77.4,1.28v5.36h-1.73v-5.02c0-.24-.04-.44-.11-.59-.08-.15-.19-.28-.33-.38-.15-.1-.32-.17-.52-.21-.2-.04-.41-.07-.64-.07-.35,0-.68.04-.99.12s-.57.18-.79.29-.39.21-.51.29l-.72-1.24Z"/>
    <path class="cls-1" d="M322.01,10.2c-.23-.28-.58-.43-1.05-.43-.34,0-.63.07-.88.2s-.44.33-.58.59c-.14.26-.2.55-.2.89v4.58h-1.78v-7.52h1.78v1.16c.24-.45.55-.78.92-1s.82-.33,1.33-.33c.85,0,1.5.26,1.95.78.45.52.67,1.22.67,2.12v4.79h-1.81v-4.58c0-.56-.11-.98-.34-1.26Z"/>
    <path class="cls-1" d="M326.35,10.16c.34-.58.79-1.03,1.35-1.34s1.16-.47,1.81-.47,1.18.16,1.66.47.85.77,1.13,1.35c.28.58.42,1.28.42,2.1s-.14,1.5-.42,2.09c-.28.59-.65,1.04-1.13,1.36s-1.03.47-1.66.47-1.25-.16-1.81-.47-1.01-.76-1.35-1.35-.51-1.29-.51-2.11.17-1.53.51-2.12ZM327.99,13.57c.21.36.48.63.83.82s.72.28,1.12.28c.35,0,.69-.09,1.01-.28.33-.19.6-.45.81-.81.21-.35.32-.79.32-1.3s-.11-.95-.32-1.3c-.21-.35-.48-.62-.81-.81-.33-.18-.66-.28-1.01-.28-.4,0-.78.09-1.12.28-.34.19-.62.46-.83.82s-.31.79-.31,1.29.1.93.31,1.29ZM333.86,3.28v12.75h-1.78V3.28h1.78Z"/>
    <path class="cls-1" d="M337.13,14.24c.24.18.48.33.74.43.25.1.5.15.75.15.32,0,.56-.07.74-.21.18-.14.27-.34.27-.59,0-.22-.07-.41-.21-.56-.14-.16-.34-.29-.59-.41-.25-.11-.55-.23-.88-.35-.34-.13-.67-.29-1.01-.47-.33-.18-.6-.42-.82-.71-.21-.29-.32-.66-.32-1.11s.12-.84.35-1.14c.23-.31.55-.53.95-.68s.83-.22,1.28-.22c.41,0,.8.06,1.17.18s.7.28.99.47c.29.2.54.42.75.67l-.98,1.05c-.24-.29-.53-.53-.88-.72-.35-.18-.71-.28-1.08-.28-.26,0-.47.05-.64.16-.16.11-.24.27-.24.47,0,.17.07.33.22.47.15.14.34.26.59.37.25.11.52.22.83.34.43.16.81.34,1.16.54.35.2.63.44.83.72.21.28.31.65.31,1.11,0,.71-.24,1.28-.73,1.71s-1.14.65-1.95.65c-.52,0-1-.08-1.42-.24-.43-.16-.8-.37-1.13-.62-.33-.26-.6-.53-.82-.81l1.03-1.05c.25.27.5.5.74.69Z"/>
    <path class="cls-1" d="M347.84,10.23c.35-.59.84-1.05,1.46-1.38.62-.33,1.3-.5,2.07-.5s1.47.17,2.08.5c.61.33,1.09.79,1.45,1.38.35.59.53,1.27.53,2.04s-.18,1.44-.53,2.03c-.35.59-.84,1.06-1.45,1.39-.61.33-1.3.5-2.08.5s-1.45-.17-2.07-.5c-.62-.33-1.1-.8-1.46-1.39-.35-.59-.53-1.27-.53-2.03s.18-1.46.53-2.04ZM349.42,13.51c.2.35.46.63.8.83.34.2.72.3,1.14.3s.81-.1,1.14-.3c.34-.2.6-.48.8-.83.2-.35.29-.77.29-1.23s-.1-.88-.29-1.24c-.2-.36-.46-.64-.8-.83-.34-.2-.72-.29-1.14-.29s-.81.1-1.14.29-.6.47-.8.83c-.2.36-.29.77-.29,1.24s.1.88.29,1.23Z"/>
    <path class="cls-1" d="M360.8,8.52v1.55h-4.32v-1.55h4.32ZM360.24,4.84c-.14-.05-.28-.08-.41-.08-.16,0-.3.04-.42.13s-.2.23-.27.43c-.07.2-.1.45-.1.77v9.96h-1.75V5.74c0-.59.1-1.08.29-1.46.19-.39.47-.68.83-.89.36-.21.81-.31,1.34-.31.29,0,.55.04.77.11.22.08.4.17.56.29.15.11.27.23.36.34l-.82,1.37c-.11-.17-.23-.29-.38-.34Z"/>
    <path class="cls-1" d="M368.54,13.52c.21.36.49.64.84.85.35.21.75.31,1.19.31.37,0,.72-.06,1.04-.17s.61-.27.86-.46c.25-.19.44-.41.56-.65v1.95c-.26.26-.62.47-1.06.62-.45.15-.94.23-1.47.23-.76,0-1.45-.17-2.07-.5-.62-.33-1.1-.8-1.46-1.39-.36-.59-.54-1.27-.54-2.03s.18-1.46.54-2.04c.36-.59.85-1.05,1.46-1.38.62-.33,1.31-.5,2.07-.5.53,0,1.02.08,1.47.23.45.15.8.35,1.06.61v1.96c-.12-.25-.31-.47-.56-.66-.26-.19-.55-.34-.87-.45-.33-.11-.66-.16-1.01-.16-.44,0-.83.1-1.19.31-.35.21-.64.49-.84.85-.21.36-.31.77-.31,1.24s.1.88.31,1.24Z"/>
    <path class="cls-1" d="M376.72,16.03h-1.75v-7.52h1.75v7.52ZM378.51,10.1c-.15-.07-.33-.1-.55-.1-.29,0-.53.08-.72.23-.19.15-.32.36-.4.63-.08.27-.12.58-.12.94l-.59-.34c0-.6.11-1.13.33-1.59.22-.46.51-.83.87-1.11.35-.28.72-.42,1.1-.42.27,0,.53.04.77.13.24.09.45.23.62.44l-.87,1.49c-.15-.13-.3-.23-.45-.29Z"/>
    <path class="cls-1" d="M382.04,15.71c-.58-.33-1.03-.78-1.35-1.37s-.47-1.28-.47-2.06.16-1.49.48-2.08c.32-.59.78-1.04,1.36-1.36.59-.32,1.28-.48,2.08-.48s1.47.15,2.04.46c.56.31.99.74,1.28,1.32.29.57.44,1.26.44,2.07,0,.09,0,.18,0,.28,0,.1,0,.17,0,.21h-6.6v-1.23h5.08l-.54.75c.03-.07.07-.15.11-.26.04-.11.06-.2.06-.28,0-.4-.08-.75-.24-1.05-.16-.29-.38-.52-.65-.69-.28-.16-.6-.24-.97-.24-.45,0-.83.1-1.14.29s-.55.48-.72.85-.25.83-.25,1.37c-.01.53.07.99.24,1.37.17.38.41.67.73.87s.7.29,1.16.29c.49,0,.92-.1,1.28-.29.36-.2.65-.5.88-.9l1.54.61c-.4.68-.92,1.19-1.54,1.53s-1.37.51-2.24.51c-.76,0-1.44-.16-2.02-.49Z"/>
    <path class="cls-1" d="M390.89,14.34c.12.18.29.31.5.4.21.09.45.13.73.13.36,0,.68-.07.97-.22.29-.15.52-.36.69-.63.17-.27.26-.6.26-.98l.26.98c0,.48-.14.88-.42,1.21-.28.33-.63.57-1.05.73-.42.16-.85.24-1.28.24-.47,0-.9-.09-1.31-.28-.4-.18-.73-.46-.96-.82-.24-.36-.36-.8-.36-1.31,0-.73.26-1.31.77-1.74s1.24-.65,2.17-.65c.5,0,.93.05,1.3.16.36.11.67.24.91.38.24.15.41.28.51.4v.9c-.34-.24-.7-.41-1.08-.52-.38-.11-.78-.16-1.21-.16-.37,0-.67.05-.9.14s-.4.22-.51.38c-.11.16-.17.37-.17.61s.06.47.18.65ZM389.43,9.23c.35-.21.79-.41,1.32-.6.53-.2,1.15-.29,1.86-.29.61,0,1.16.09,1.63.27.48.18.85.44,1.12.79.27.35.4.77.4,1.28v5.36h-1.73v-5.02c0-.24-.04-.44-.11-.59-.08-.15-.19-.28-.33-.38-.15-.1-.32-.17-.52-.21-.2-.04-.41-.07-.64-.07-.35,0-.68.04-.99.12s-.57.18-.79.29-.39.21-.51.29l-.72-1.24Z"/>
    <path class="cls-1" d="M401.06,8.52v1.55h-4.27v-1.55h4.27ZM399.8,5.9v10.13h-1.73V5.9h1.73Z"/>
    <path class="cls-1" d="M402.23,10.23c.35-.59.84-1.05,1.46-1.38.62-.33,1.3-.5,2.07-.5s1.47.17,2.08.5c.61.33,1.09.79,1.45,1.38.35.59.53,1.27.53,2.04s-.18,1.44-.53,2.03c-.35.59-.84,1.06-1.45,1.39-.61.33-1.3.5-2.08.5s-1.45-.17-2.07-.5c-.62-.33-1.1-.8-1.46-1.39-.35-.59-.53-1.27-.53-2.03s.18-1.46.53-2.04ZM403.8,13.51c.2.35.46.63.8.83.34.2.72.3,1.14.3s.81-.1,1.14-.3c.34-.2.6-.48.8-.83.2-.35.29-.77.29-1.23s-.1-.88-.29-1.24c-.2-.36-.46-.64-.8-.83-.34-.2-.72-.29-1.14-.29s-.81.1-1.14.29-.6.47-.8.83c-.2.36-.29.77-.29,1.24s.1.88.29,1.23Z"/>
    <path class="cls-1" d="M413.23,16.03h-1.75v-7.52h1.75v7.52ZM415.02,10.1c-.15-.07-.33-.1-.55-.1-.29,0-.53.08-.72.23-.19.15-.32.36-.4.63-.08.27-.12.58-.12.94l-.59-.34c0-.6.11-1.13.33-1.59.22-.46.51-.83.87-1.11.35-.28.72-.42,1.1-.42.27,0,.53.04.77.13.24.09.45.23.62.44l-.87,1.49c-.15-.13-.3-.23-.45-.29Z"/>
    <path class="cls-1" d="M418.63,14.24c.24.18.48.33.74.43.25.1.5.15.75.15.32,0,.56-.07.74-.21.18-.14.27-.34.27-.59,0-.22-.07-.41-.21-.56-.14-.16-.34-.29-.59-.41-.25-.11-.55-.23-.88-.35-.34-.13-.67-.29-1.01-.47-.33-.18-.6-.42-.82-.71-.21-.29-.32-.66-.32-1.11s.12-.84.35-1.14c.23-.31.55-.53.95-.68s.83-.22,1.28-.22c.41,0,.8.06,1.17.18s.7.28.99.47c.29.2.54.42.75.67l-.98,1.05c-.24-.29-.53-.53-.88-.72-.35-.18-.71-.28-1.08-.28-.26,0-.47.05-.64.16-.16.11-.24.27-.24.47,0,.17.07.33.22.47.15.14.34.26.59.37.25.11.52.22.83.34.43.16.81.34,1.16.54.35.2.63.44.83.72.21.28.31.65.31,1.11,0,.71-.24,1.28-.73,1.71s-1.14.65-1.95.65c-.52,0-1-.08-1.42-.24-.43-.16-.8-.37-1.13-.62-.33-.26-.6-.53-.82-.81l1.03-1.05c.25.27.5.5.74.69Z"/>
    <path class="cls-1" d="M193.08,28.13l1.75,4.46,2.09-5.03,2.19,5.07,1.77-4.5h1.93l-3.51,8.04-2.37-5.07-2.26,5.07-3.51-8.04h1.93Z"/>
    <path class="cls-1" d="M203.65,29.85c.35-.59.84-1.05,1.46-1.38.62-.33,1.3-.5,2.07-.5s1.47.17,2.08.5c.61.33,1.09.79,1.45,1.38.35.59.53,1.27.53,2.04s-.18,1.44-.53,2.03c-.35.59-.84,1.06-1.45,1.39-.61.33-1.3.5-2.08.5s-1.45-.17-2.07-.5c-.62-.33-1.1-.8-1.46-1.39-.35-.59-.53-1.27-.53-2.03s.18-1.46.53-2.04ZM205.23,33.12c.2.35.46.63.8.83.34.2.72.3,1.14.3s.81-.1,1.14-.3c.34-.2.6-.48.8-.83.2-.35.29-.77.29-1.23s-.1-.88-.29-1.24c-.2-.36-.46-.64-.8-.83-.34-.2-.72-.29-1.14-.29s-.81.1-1.14.29-.6.47-.8.83c-.2.36-.29.77-.29,1.24s.1.88.29,1.23Z"/>
    <path class="cls-1" d="M214.66,35.65h-1.75v-7.52h1.75v7.52ZM216.45,29.72c-.15-.07-.33-.1-.55-.1-.29,0-.53.08-.72.23-.19.15-.32.36-.4.63-.08.27-.12.58-.12.94l-.59-.34c0-.6.11-1.13.33-1.59.22-.46.51-.83.87-1.11.35-.28.72-.42,1.1-.42.27,0,.53.04.77.13.24.09.45.23.62.44l-.87,1.49c-.15-.13-.3-.23-.45-.29Z"/>
    <path class="cls-1" d="M220.76,22.9v12.75h-1.78v-12.75h1.78Z"/>
    <path class="cls-1" d="M222.93,29.77c.34-.58.79-1.03,1.35-1.34s1.16-.47,1.81-.47,1.18.16,1.66.47.85.77,1.13,1.35c.28.58.42,1.28.42,2.1s-.14,1.5-.42,2.09c-.28.59-.65,1.04-1.13,1.36s-1.03.47-1.66.47-1.25-.16-1.81-.47-1.01-.76-1.35-1.35-.51-1.29-.51-2.11.17-1.53.51-2.12ZM224.57,33.18c.21.36.48.63.83.82s.72.28,1.12.28c.35,0,.69-.09,1.01-.28.33-.19.6-.45.81-.81.21-.35.32-.79.32-1.3s-.11-.95-.32-1.3c-.21-.35-.48-.62-.81-.81-.33-.18-.66-.28-1.01-.28-.4,0-.78.09-1.12.28-.34.19-.62.46-.83.82s-.31.79-.31,1.29.1.93.31,1.29ZM230.43,22.9v12.75h-1.78v-12.75h1.78Z"/>
    <path class="cls-1" d="M233.42,28.13l1.75,4.46,2.09-5.03,2.19,5.07,1.77-4.5h1.93l-3.51,8.04-2.37-5.07-2.26,5.07-3.51-8.04h1.93Z"/>
    <path class="cls-1" d="M244.55,24.37c.22-.21.48-.31.78-.31.32,0,.58.1.8.31.22.21.33.46.33.77s-.11.55-.33.76c-.22.21-.48.32-.8.32-.29,0-.55-.11-.78-.32-.22-.21-.34-.47-.34-.76s.11-.56.34-.77ZM246.21,28.13v7.52h-1.75v-7.52h1.75Z"/>
    <path class="cls-1" d="M248.58,29.77c.34-.58.79-1.03,1.35-1.34s1.16-.47,1.81-.47,1.18.16,1.66.47.85.77,1.13,1.35c.28.58.42,1.28.42,2.1s-.14,1.5-.42,2.09c-.28.59-.65,1.04-1.13,1.36s-1.03.47-1.66.47-1.25-.16-1.81-.47-1.01-.76-1.35-1.35-.51-1.29-.51-2.11.17-1.53.51-2.12ZM250.21,33.18c.21.36.48.63.83.82s.72.28,1.12.28c.35,0,.69-.09,1.01-.28.33-.19.6-.45.81-.81.21-.35.32-.79.32-1.3s-.11-.95-.32-1.3c-.21-.35-.48-.62-.81-.81-.33-.18-.66-.28-1.01-.28-.4,0-.78.09-1.12.28-.34.19-.62.46-.83.82s-.31.79-.31,1.29.1.93.31,1.29ZM256.08,22.9v12.75h-1.78v-12.75h1.78Z"/>
    <path class="cls-1" d="M259.52,35.32c-.58-.33-1.03-.78-1.35-1.37s-.47-1.28-.47-2.06.16-1.49.48-2.08c.32-.59.78-1.04,1.36-1.36.59-.32,1.28-.48,2.08-.48s1.47.15,2.04.46c.56.31.99.74,1.28,1.32.29.57.44,1.26.44,2.07,0,.09,0,.18,0,.28,0,.1,0,.17,0,.21h-6.6v-1.23h5.08l-.54.75c.03-.07.07-.15.11-.26.04-.11.06-.2.06-.28,0-.4-.08-.75-.24-1.05-.16-.29-.38-.52-.65-.69-.28-.16-.6-.24-.97-.24-.45,0-.83.1-1.14.29s-.55.48-.72.85-.25.83-.25,1.37c-.01.53.07.99.24,1.37.17.38.41.67.73.87s.7.29,1.16.29c.49,0,.92-.1,1.28-.29.36-.2.65-.5.88-.9l1.54.61c-.4.68-.92,1.19-1.54,1.53s-1.37.51-2.24.51c-.76,0-1.44-.16-2.02-.49Z"/>
  </g>
</svg>
                    `,
        },
        {
          title: 'Stats Stepped',
          html_code: `<section> <div class="pbx-relative pbx-py-4 pbx-bg-slate-200"> <div class="pbx-mx-auto pbx-max-w-7xl pbx-px-6 lg:pbx-px-8 pbx-pt-12"> <div class="pbx-mx-auto pbx-max-w-2xl lg:pbx-mx-0"> <div class="pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"> <h2>We approach work as a place to make the world better</h2> </div> <div> <p> Diam nunc lacus lacus aliquam turpis enim. Eget hac velit est euismod lacus. Est non placerat nam arcu. Cras purus nibh cursus sit eu in id. Integer vel nibh. </p> </div> </div> <div class="pbx-flex pbx-justify-between pbx-items-center pbx-gap-4 pbx-mt-12 lg:pbx-flex-row pbx-flex-col" > <div class="pbx-text-2xl pbx-font-semibold">250k</div> <div class="pbx-text-2xl pbx-font-semibold">$8.9 billion</div> <div class="pbx-text-2xl pbx-font-semibold">401k</div> </div> </div> </div> </section>`,
          category: 'Marketing',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 374.69 157.08">
  <defs>
    <style>
      .cls-1 {
        fill: #231f20;
      }

      .cls-2, .cls-3 {
        fill: #394152;
      }

      .cls-3 {
        fill-rule: evenodd;
      }
    </style>
  </defs>
  <rect class="cls-2" x="2.98" y="56.78" width="219.58" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="2.98" y="70.39" width="219.58" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="2.98" y="102.06" width="30.46" height="5.03" rx="1.98" ry="1.98"/>
  <g id="svgGroup">
    <path class="cls-3" d="M98.05,33.3h-4.49l5.26-10.55-6.53-13.24h4.6l2.96,6.08c.25.55.48,1.06.69,1.53.21.48.4.97.55,1.48.19-.51.4-1,.61-1.48.21-.48.46-.99.74-1.53l2.99-6.08h4.44l-11.81,23.79ZM336.73,33.3h-4.49l5.26-10.55-6.53-13.24h4.6l2.96,6.08c.25.55.48,1.06.69,1.53.21.48.4.97.55,1.48.19-.51.4-1,.61-1.48.21-.48.46-.99.74-1.53l2.99-6.08h4.44l-11.81,23.79ZM130.85,18.9v-9.38h4.15v8.83c0,.99.29,1.85.88,2.6.59.75,1.41,1.12,2.47,1.12.88,0,1.67-.31,2.35-.94.69-.63,1.03-1.53,1.03-2.71v-8.91h4.18v15.86h-3.81v-1.9c-.56.78-1.27,1.37-2.11,1.77s-1.75.61-2.72.61c-1.11,0-2.16-.27-3.15-.82s-1.78-1.33-2.38-2.36c-.6-1.03-.9-2.29-.9-3.77ZM240.18,18.9v-9.38h4.15v8.83c0,.99.3,1.85.89,2.6.59.75,1.41,1.12,2.47,1.12.88,0,1.67-.31,2.35-.94.69-.63,1.03-1.53,1.03-2.71v-8.91h4.18v15.86h-3.81v-1.9c-.56.78-1.27,1.37-2.11,1.77-.85.41-1.75.61-2.72.61-1.11,0-2.16-.27-3.15-.82-.99-.55-1.78-1.33-2.38-2.36-.6-1.03-.9-2.29-.9-3.77ZM232.43,10.73V0h4.18v25.37h-3.65v-1.69c-.62.63-1.37,1.14-2.25,1.51-.88.37-1.83.56-2.85.56-1.46,0-2.79-.37-3.99-1.12-1.2-.75-2.15-1.75-2.87-3.01-.71-1.26-1.07-2.65-1.07-4.16s.36-2.92,1.07-4.18c.71-1.25,1.67-2.25,2.87-3,1.2-.75,2.53-1.12,3.99-1.12.9,0,1.73.14,2.5.41s1.46.67,2.07,1.18ZM173.99,33.3h-4.15V9.52h3.62v1.69c.65-.65,1.41-1.16,2.27-1.52.86-.36,1.81-.54,2.83-.54,1.48,0,2.82.37,4.02,1.11,1.2.74,2.15,1.74,2.87,3s1.07,2.66,1.07,4.19-.36,2.9-1.07,4.16c-.71,1.26-1.67,2.26-2.87,3.01-1.2.75-2.54,1.12-4.02,1.12-.9,0-1.73-.14-2.5-.42-.77-.28-1.46-.67-2.07-1.16v9.15ZM59.62,23.87l1.06-4.02c.51.74,1.2,1.37,2.08,1.88.87.51,1.78.77,2.74.77.69,0,1.19-.14,1.52-.42.33-.28.49-.63.49-1.06,0-.48-.17-.82-.5-1.04-.33-.22-.67-.39-1-.52l-2.19-.82c-.46-.19-1-.45-1.61-.78-.62-.33-1.15-.79-1.6-1.4-.45-.61-.67-1.41-.67-2.39,0-.9.22-1.73.66-2.48.44-.76,1.08-1.37,1.93-1.84.85-.47,1.85-.7,3.01-.7,1.06,0,2.07.18,3.04.54.97.36,1.7.81,2.19,1.33l-1,3.91c-.55-.78-1.22-1.38-2.02-1.81-.8-.43-1.57-.65-2.31-.65-.6,0-1.05.14-1.36.41-.31.27-.46.59-.46.96,0,.26.11.52.32.78.21.26.55.47,1.03.65l2.09.79c.55.19,1.15.46,1.8.81.65.34,1.21.82,1.68,1.44s.7,1.46.7,2.54c0,1.5-.55,2.72-1.65,3.67s-2.53,1.43-4.3,1.43c-1,0-2.03-.17-3.09-.52-1.06-.34-1.9-.83-2.54-1.47ZM272.53,11.21l-1.11,4.39c-.44-.76-1.05-1.41-1.82-1.97-.78-.56-1.67-.83-2.7-.83-.88,0-1.67.21-2.37.63s-1.24.98-1.64,1.68c-.4.7-.6,1.48-.6,2.34s.2,1.62.6,2.33c.4.71.94,1.26,1.64,1.68.7.41,1.48.62,2.37.62,1.02,0,1.92-.27,2.7-.82s1.38-1.21,1.82-1.98l1.11,4.41c-.76.7-1.63,1.24-2.62,1.61-.99.37-2.04.55-3.15.55-1.57,0-3-.38-4.3-1.14-1.29-.76-2.32-1.78-3.08-3.05-.76-1.28-1.14-2.68-1.14-4.22s.38-2.96,1.14-4.24c.76-1.28,1.78-2.29,3.08-3.04,1.3-.75,2.73-1.12,4.3-1.12,1.11,0,2.16.19,3.15.56.99.37,1.86.91,2.62,1.61ZM9.98,25.37H2.98V1.59h7.24c1.57,0,2.82.3,3.75.91.93.61,1.6,1.34,2,2.19.4.85.59,1.66.59,2.42s-.15,1.43-.45,2.06-.7,1.18-1.22,1.64c1.13.65,2.04,1.55,2.75,2.7.7,1.15,1.06,2.42,1.06,3.83s-.33,2.62-.99,3.85c-.66,1.22-1.64,2.23-2.93,3.01s-2.89,1.18-4.8,1.18ZM310.54,9.52l-8.54,16.65-8.51-16.65h4.63l2.67,5.55c.25.48.48.95.69,1.43.21.48.42,1.02.63,1.64.21-.62.42-1.16.63-1.64.21-.48.44-.95.69-1.43l2.67-5.55h4.44ZM80.21,25.37h-4.15v-12.53h-3.12v-3.33h3.2v-5.29h3.99v5.29h3.36v3.33h-3.28v12.53ZM281.2,25.37h-4.15v-12.53h-3.12v-3.33h3.2v-5.29h3.99v5.29h3.36v3.33h-3.28v12.53ZM326.82,25.37h-4.15v-12.53h-3.12v-3.33h3.2v-5.29h3.99v5.29h3.36v3.33h-3.28v12.53ZM29.65,25.85c-1.57,0-3-.38-4.3-1.14-1.29-.76-2.32-1.77-3.08-3.04-.76-1.27-1.14-2.68-1.14-4.23s.38-2.98,1.14-4.24c.76-1.26,1.78-2.27,3.08-3.03,1.3-.76,2.72-1.14,4.27-1.14s3.02.38,4.31,1.14c1.29.76,2.31,1.77,3.08,3.03.77,1.26,1.15,2.67,1.15,4.24,0,1.53-.38,2.94-1.15,4.22-.77,1.28-1.79,2.29-3.08,3.05-1.29.76-2.71,1.14-4.28,1.14ZM48.81,25.85c-1.57,0-3-.38-4.29-1.14-1.3-.76-2.32-1.77-3.08-3.04-.76-1.27-1.14-2.68-1.14-4.23s.38-2.98,1.14-4.24c.76-1.26,1.78-2.27,3.08-3.03,1.29-.76,2.72-1.14,4.27-1.14s3.02.38,4.31,1.14c1.29.76,2.31,1.77,3.08,3.03.77,1.26,1.15,2.67,1.15,4.24,0,1.53-.38,2.94-1.15,4.22-.77,1.28-1.79,2.29-3.08,3.05s-2.71,1.14-4.28,1.14ZM119.65,25.85c-1.57,0-3-.38-4.29-1.14s-2.32-1.77-3.08-3.04-1.14-2.68-1.14-4.23.38-2.98,1.14-4.24c.76-1.26,1.78-2.27,3.08-3.03,1.29-.76,2.72-1.14,4.27-1.14s3.02.38,4.31,1.14c1.29.76,2.31,1.77,3.08,3.03.77,1.26,1.15,2.67,1.15,4.24s-.38,2.94-1.15,4.22c-.77,1.28-1.79,2.29-3.08,3.05-1.29.76-2.71,1.14-4.28,1.14ZM209.28,25.85c-1.57,0-3-.38-4.29-1.14-1.29-.76-2.32-1.77-3.08-3.04-.76-1.27-1.14-2.68-1.14-4.23s.38-2.98,1.14-4.24c.76-1.26,1.78-2.27,3.08-3.03,1.29-.76,2.72-1.14,4.27-1.14s3.02.38,4.31,1.14c1.29.76,2.31,1.77,3.08,3.03.77,1.26,1.15,2.67,1.15,4.24s-.38,2.94-1.15,4.22c-.77,1.28-1.79,2.29-3.08,3.05-1.29.76-2.71,1.14-4.28,1.14ZM153.95,25.37h-4.15v-15.86h3.75v2.78c.55-.93,1.25-1.66,2.11-2.17.86-.51,1.88-.77,3.04-.77l.92,3.75c-.33-.11-.71-.16-1.14-.16-1.37,0-2.48.44-3.3,1.32s-1.24,2.13-1.24,3.75v7.35ZM193.68,25.37h-4.15v-15.86h3.75v2.78c.55-.93,1.25-1.66,2.11-2.17.86-.51,1.88-.77,3.04-.77l.92,3.75c-.33-.11-.71-.16-1.14-.16-1.37,0-2.48.44-3.3,1.32-.83.88-1.24,2.13-1.24,3.75v7.35ZM291.3,25.37h-4.18v-15.86h4.18v15.86ZM316.88,25.37h-4.18v-15.86h4.18v15.86ZM29.62,22.07c.86,0,1.64-.21,2.33-.62.69-.41,1.23-.97,1.64-1.68.41-.7.61-1.48.61-2.33,0-.86-.2-1.64-.61-2.34-.41-.7-.95-1.26-1.64-1.68-.69-.42-1.46-.63-2.33-.63s-1.61.21-2.3.63c-.69.42-1.23.98-1.64,1.68-.41.7-.61,1.48-.61,2.34s.2,1.62.61,2.33c.41.71.95,1.26,1.64,1.68.69.41,1.45.62,2.3.62ZM48.78,22.07c.86,0,1.64-.21,2.33-.62.69-.41,1.23-.97,1.64-1.68.41-.7.61-1.48.61-2.33s-.2-1.64-.61-2.34c-.41-.7-.95-1.26-1.64-1.68-.69-.42-1.46-.63-2.33-.63s-1.61.21-2.3.63c-.69.42-1.23.98-1.64,1.68-.41.7-.61,1.48-.61,2.34s.2,1.62.61,2.33c.41.71.95,1.26,1.64,1.68.69.41,1.45.62,2.3.62ZM119.62,22.07c.86,0,1.64-.21,2.33-.62.69-.41,1.23-.97,1.64-1.68.41-.7.61-1.48.61-2.33s-.2-1.64-.61-2.34c-.41-.7-.95-1.26-1.64-1.68-.69-.42-1.46-.63-2.33-.63s-1.61.21-2.3.63c-.69.42-1.23.98-1.64,1.68-.41.7-.61,1.48-.61,2.34s.2,1.62.61,2.33c.41.71.95,1.26,1.64,1.68.69.41,1.45.62,2.3.62ZM209.25,22.07c.86,0,1.64-.21,2.33-.62.69-.41,1.23-.97,1.64-1.68.41-.7.61-1.48.61-2.33s-.2-1.64-.61-2.34c-.41-.7-.95-1.26-1.64-1.68-.69-.42-1.46-.63-2.33-.63s-1.61.21-2.3.63c-.69.42-1.23.98-1.64,1.68-.41.7-.61,1.48-.61,2.34s.2,1.62.61,2.33c.41.71.95,1.26,1.64,1.68.69.41,1.45.62,2.3.62ZM178.06,22.07c.85,0,1.61-.21,2.29-.63s1.22-.98,1.63-1.68c.41-.7.61-1.47.61-2.31s-.2-1.62-.61-2.31c-.41-.7-.95-1.26-1.63-1.68s-1.43-.63-2.26-.63-1.61.21-2.29.63c-.68.42-1.22.98-1.63,1.68-.41.7-.61,1.47-.61,2.31s.2,1.62.61,2.31c.41.7.95,1.26,1.63,1.68.68.42,1.43.63,2.26.63ZM228.33,22.07c.85,0,1.61-.21,2.29-.63s1.22-.98,1.63-1.68c.41-.7.61-1.47.61-2.31s-.2-1.62-.61-2.31c-.41-.7-.95-1.26-1.63-1.68s-1.43-.63-2.26-.63-1.61.21-2.29.63-1.22.98-1.63,1.68c-.41.7-.61,1.47-.61,2.31s.2,1.62.61,2.31c.41.7.95,1.26,1.63,1.68s1.43.63,2.26.63ZM7.18,12.93v8.56h2.4c1.11,0,2.01-.22,2.68-.66s1.18-.99,1.49-1.65c.32-.66.48-1.32.48-1.97s-.15-1.28-.46-1.94c-.31-.66-.8-1.22-1.48-1.66-.68-.45-1.58-.67-2.71-.67h-2.4ZM7.18,4.86v4.92h2.38c.88,0,1.59-.21,2.14-.62.55-.41.82-1.02.82-1.81s-.27-1.43-.81-1.85c-.54-.42-1.22-.63-2.05-.63h-2.48ZM352.59,25.85c-.74,0-1.37-.26-1.88-.77-.51-.51-.77-1.15-.77-1.9s.26-1.37.77-1.88c.51-.51,1.14-.77,1.88-.77s1.41.26,1.92.77.75,1.15.75,1.9-.25,1.37-.75,1.88-1.14.77-1.92.77ZM289.21,7.08c-.65,0-1.2-.22-1.65-.67s-.67-1-.67-1.65.22-1.22.67-1.66c.45-.44,1-.66,1.65-.66.67,0,1.23.22,1.67.66.44.44.66.99.66,1.66s-.22,1.2-.66,1.65c-.44.45-1,.67-1.67.67ZM314.79,7.08c-.65,0-1.2-.22-1.65-.67s-.67-1-.67-1.65.22-1.22.67-1.66c.45-.44,1-.66,1.65-.66.67,0,1.22.22,1.66.66.44.44.66.99.66,1.66s-.22,1.2-.66,1.65c-.44.45-.99.67-1.66.67Z"/>
  </g>
  <g>
    <path class="cls-1" d="M6.35,148.14c.33-.35.61-.69.84-1.02s.41-.65.53-.98c.12-.33.18-.67.18-1.04,0-.26-.05-.52-.15-.77s-.25-.49-.45-.69-.45-.38-.73-.5c-.29-.12-.62-.19-1-.19-.52,0-.97.12-1.35.36-.38.24-.67.59-.87,1.05-.2.46-.3.99-.3,1.59H.74c0-.98.19-1.85.56-2.62s.92-1.36,1.65-1.8c.73-.44,1.61-.66,2.64-.66.8,0,1.49.13,2.08.38.59.25,1.07.58,1.46.99s.68.85.87,1.33.29.95.29,1.41c0,.72-.18,1.41-.53,2.08s-.81,1.26-1.37,1.78l-3.88,3.82h5.93v2.16H0l6.35-6.68Z"/>
    <path class="cls-1" d="M21.93,152.43c-.28.59-.66,1.07-1.15,1.46-.48.39-1.03.67-1.63.86-.6.19-1.23.28-1.9.28-.84,0-1.58-.11-2.22-.33s-1.21-.52-1.68-.89c-.47-.37-.88-.77-1.23-1.21l1.37-1.68c.27.37.59.69.96.99.37.29.77.53,1.2.71.44.18.87.26,1.3.26.61,0,1.14-.11,1.57-.32.43-.22.76-.52.99-.92.23-.4.34-.87.34-1.42s-.13-1.04-.39-1.43c-.26-.39-.61-.69-1.06-.9s-.93-.31-1.45-.31c-.4,0-.8.03-1.18.09-.39.06-.78.17-1.18.32-.4.16-.83.38-1.3.67l1.86-7.54h7.05v2.04h-5.31l-.86,3.13c.34-.17.69-.29,1.06-.37.37-.08.74-.12,1.12-.12.76,0,1.45.19,2.08.57.63.38,1.13.91,1.5,1.59s.56,1.48.56,2.41c0,.8-.14,1.49-.42,2.08Z"/>
    <path class="cls-1" d="M24.59,144.24c.45-1.06,1.08-1.88,1.88-2.47.8-.59,1.73-.88,2.79-.88s2,.29,2.8.88c.8.59,1.42,1.41,1.86,2.47.44,1.06.67,2.3.67,3.72s-.22,2.66-.67,3.72c-.44,1.06-1.06,1.88-1.86,2.47-.8.59-1.73.88-2.8.88s-1.99-.29-2.79-.88c-.8-.59-1.43-1.41-1.88-2.47-.45-1.06-.68-2.3-.68-3.72s.23-2.66.68-3.72ZM26.4,149.98c.14.61.35,1.14.62,1.59.27.44.59.79.97,1.03.38.24.8.36,1.27.36s.89-.12,1.26-.36c.37-.24.69-.58.96-1.03.27-.44.47-.97.62-1.59.14-.61.22-1.29.22-2.02s-.07-1.4-.22-2.02c-.14-.61-.35-1.14-.62-1.59-.27-.44-.59-.79-.96-1.03-.37-.24-.79-.36-1.26-.36s-.89.12-1.27.36c-.38.24-.7.59-.97,1.03-.27.44-.47.97-.62,1.59s-.22,1.29-.22,2.02.07,1.4.22,2.02Z"/>
    <path class="cls-1" d="M38.72,139.54v15.28h-2.08v-15.28h2.08ZM44.64,145.81l-3.9,3.72,4.29,5.29h-2.59l-4.29-5.29,3.88-3.72h2.6Z"/>
  </g>
  <g>
    <path class="cls-1" d="M146.51,143.96c-.25-.32-.54-.58-.86-.77-.33-.2-.71-.29-1.16-.29s-.83.07-1.12.2c-.29.13-.5.32-.64.56s-.21.53-.21.87c0,.44.15.81.44,1.1.29.29.68.54,1.17.74s1,.42,1.55.63c.39.14.79.33,1.2.55s.79.49,1.14.81c.35.32.62.7.82,1.16s.3.98.3,1.6c0,.81-.18,1.52-.54,2.12-.36.6-.88,1.06-1.57,1.38-.69.32-1.52.48-2.5.48-.77,0-1.5-.16-2.18-.48-.69-.32-1.28-.75-1.79-1.3s-.91-1.18-1.2-1.88l1.78-1.16c.3.59.62,1.09.95,1.52.33.43.71.75,1.13.97.42.22.89.33,1.41.33.47,0,.86-.08,1.17-.23.31-.15.53-.37.69-.65.15-.28.22-.62.22-1.01,0-.5-.15-.9-.44-1.22-.29-.32-.67-.59-1.14-.81s-.96-.43-1.48-.63c-.34-.12-.71-.28-1.13-.48-.41-.2-.8-.46-1.17-.78s-.67-.71-.9-1.17-.35-1.01-.35-1.67.19-1.22.56-1.74.88-.94,1.54-1.25c.65-.31,1.39-.47,2.21-.47s1.55.14,2.14.43,1.08.65,1.48,1.1c.4.44.71.91.93,1.39l-1.8,1.12c-.2-.38-.42-.73-.67-1.05ZM145.42,138.86l-.04,3.17h-1.74l-.06-3.17h1.84ZM145.38,153.83l.04,3.25h-1.84l.06-3.25h1.74Z"/>
    <path class="cls-1" d="M151.63,149.42c.26-.5.61-.91,1.06-1.24s.94-.58,1.49-.74c.55-.16,1.1-.24,1.66-.24s1.12.08,1.68.24c.55.16,1.05.41,1.5.74s.8.75,1.06,1.24c.26.5.39,1.08.39,1.74,0,.58-.12,1.1-.36,1.58-.24.48-.57.9-1,1.25-.42.36-.91.64-1.47.83s-1.15.29-1.79.29-1.22-.1-1.77-.29c-.55-.2-1.04-.47-1.47-.83s-.76-.78-1-1.25c-.24-.48-.36-1-.36-1.58,0-.67.13-1.25.39-1.74ZM152.27,142.63c.37-.53.86-.95,1.49-1.25.63-.31,1.32-.46,2.08-.46s1.47.15,2.09.46c.62.31,1.12.73,1.49,1.25s.56,1.15.56,1.85c0,.58-.11,1.08-.32,1.52-.22.44-.51.81-.89,1.11-.38.3-.82.53-1.32.69-.5.16-1.03.23-1.6.23s-1.09-.08-1.59-.23c-.5-.16-.93-.39-1.31-.69-.38-.3-.68-.67-.89-1.11-.22-.44-.32-.94-.32-1.52,0-.7.18-1.32.55-1.85ZM153.83,152.1c.22.34.5.6.86.78.36.18.74.27,1.15.27s.8-.09,1.16-.27c.35-.18.64-.44.86-.78.22-.34.33-.76.33-1.25,0-.43-.11-.82-.33-1.18-.22-.35-.51-.63-.86-.83-.35-.2-.74-.3-1.16-.3s-.79.1-1.15.3c-.36.2-.65.48-.86.83-.22.35-.32.74-.32,1.18,0,.5.11.91.32,1.25ZM154.18,145.74c.18.29.41.51.71.67.29.16.61.25.95.25s.68-.08.97-.25c.29-.16.53-.39.71-.67.18-.29.26-.63.26-1.02s-.08-.72-.25-1.02c-.17-.3-.4-.53-.68-.7-.28-.16-.62-.24-1.01-.24-.37,0-.69.08-.99.24-.29.16-.52.4-.69.7-.16.3-.24.64-.24,1.02s.09.73.26,1.02Z"/>
    <path class="cls-1" d="M163.27,152.92c.27-.27.6-.4.99-.4s.72.13.98.4.39.59.39.97-.13.69-.39.96-.59.41-.98.41-.72-.14-.99-.41-.4-.59-.4-.96.13-.7.4-.97Z"/>
    <path class="cls-1" d="M169.86,154.87l4.35-5.39.35-.06c-.3.34-.62.56-.97.66-.35.11-.75.16-1.21.16-.55,0-1.07-.11-1.56-.31-.49-.21-.93-.51-1.32-.91-.39-.4-.7-.87-.92-1.42-.22-.55-.33-1.15-.33-1.8,0-1.02.22-1.89.68-2.61.45-.73,1.05-1.28,1.81-1.68.76-.39,1.61-.59,2.55-.59s1.79.2,2.55.59c.76.39,1.36.95,1.81,1.68s.68,1.6.68,2.61c0,.64-.11,1.23-.33,1.76-.22.54-.5,1.02-.82,1.47l-4.37,5.84h-2.94ZM175.69,144.32c-.24-.42-.57-.76-.99-1s-.89-.36-1.41-.36-.99.12-1.41.36c-.42.24-.75.58-.99,1s-.36.92-.36,1.48.12,1.06.36,1.49c.24.43.57.77.99,1.02.42.25.89.37,1.41.37s.99-.12,1.41-.37c.42-.25.75-.59.99-1.02.24-.43.36-.93.36-1.49s-.12-1.05-.36-1.48Z"/>
    <path class="cls-1" d="M188.59,154.88h-2.14v-15.28h2.14v15.28ZM195.44,152.91c-.4.7-.94,1.24-1.61,1.62-.67.37-1.39.56-2.17.56s-1.4-.19-1.98-.57c-.57-.38-1.03-.92-1.36-1.63-.33-.71-.5-1.54-.5-2.51s.17-1.82.5-2.52c.33-.7.79-1.24,1.36-1.62s1.23-.57,1.98-.57c.78,0,1.51.18,2.17.56.67.37,1.2.91,1.61,1.61.4.7.61,1.54.61,2.54s-.2,1.82-.61,2.53ZM193.48,148.83c-.25-.43-.57-.76-.98-.98-.4-.22-.86-.33-1.35-.33-.42,0-.82.11-1.21.33-.39.22-.71.55-.97.97-.25.42-.38.94-.38,1.56s.13,1.13.38,1.56c.26.42.58.75.97.97.39.22.8.33,1.21.33.5,0,.95-.11,1.35-.33s.73-.55.98-.98c.25-.43.37-.95.37-1.55s-.12-1.12-.37-1.55Z"/>
    <path class="cls-1" d="M198.39,141.37c.27-.25.58-.37.93-.37.38,0,.7.12.96.37.26.25.39.56.39.92s-.13.66-.39.91c-.26.26-.58.38-.96.38-.35,0-.66-.13-.93-.38s-.4-.56-.4-.91.13-.67.4-.92ZM200.38,145.88v9.01h-2.1v-9.01h2.1Z"/>
    <path class="cls-1" d="M205.43,139.61v15.28h-2.14v-15.28h2.14Z"/>
    <path class="cls-1" d="M210.25,139.61v15.28h-2.14v-15.28h2.14Z"/>
    <path class="cls-1" d="M213.26,141.37c.27-.25.58-.37.93-.37.38,0,.7.12.96.37.26.25.39.56.39.92s-.13.66-.39.91c-.26.26-.58.38-.96.38-.35,0-.66-.13-.93-.38s-.4-.56-.4-.91.13-.67.4-.92ZM215.24,145.88v9.01h-2.1v-9.01h2.1Z"/>
    <path class="cls-1" d="M218.11,147.93c.42-.71,1.01-1.26,1.74-1.66.74-.4,1.56-.6,2.48-.6s1.76.2,2.49.6c.73.4,1.31.95,1.73,1.66.42.7.64,1.52.64,2.45s-.21,1.73-.64,2.44c-.42.71-1,1.27-1.73,1.66-.73.4-1.56.6-2.49.6s-1.74-.2-2.48-.6c-.74-.4-1.32-.95-1.74-1.66-.42-.71-.64-1.53-.64-2.44s.21-1.74.64-2.45ZM220,151.86c.24.42.55.76.96,1,.4.24.86.36,1.37.36s.97-.12,1.37-.36c.4-.24.72-.57.96-1,.24-.43.35-.92.35-1.48s-.12-1.06-.35-1.49-.56-.76-.96-1c-.4-.23-.86-.35-1.37-.35s-.97.12-1.37.35c-.4.24-.72.57-.96,1s-.35.93-.35,1.49.12,1.05.35,1.48Z"/>
    <path class="cls-1" d="M234.6,147.89c-.27-.34-.69-.51-1.25-.51-.4,0-.76.08-1.06.24-.3.16-.53.4-.69.71-.16.31-.24.66-.24,1.07v5.49h-2.14v-9.01h2.14v1.39c.29-.54.66-.93,1.11-1.2.45-.26.98-.39,1.6-.39,1.02,0,1.8.31,2.33.93.53.62.8,1.47.8,2.54v5.74h-2.17v-5.49c0-.66-.14-1.17-.41-1.51Z"/>
  </g>
  <g>
    <path class="cls-1" d="M339.27,141.79h1.39v13.71h-2.37v-3.45l.16-.22v-5.92l-3.53,5.11h4.76l.33-.16h2.8v2h-11.28l7.74-11.09Z"/>
    <path class="cls-1" d="M344.96,144.92c.45-1.06,1.08-1.88,1.88-2.47.8-.59,1.73-.88,2.79-.88s2.01.29,2.8.88c.8.59,1.42,1.41,1.86,2.47.44,1.06.67,2.3.67,3.72s-.22,2.66-.67,3.72c-.44,1.06-1.06,1.88-1.86,2.47-.8.59-1.73.88-2.8.88s-1.99-.29-2.79-.88c-.8-.59-1.43-1.41-1.88-2.47-.45-1.06-.68-2.3-.68-3.72s.22-2.66.68-3.72ZM346.78,150.66c.14.61.35,1.14.62,1.59.27.44.59.79.97,1.03.38.24.8.36,1.27.36s.89-.12,1.26-.36c.37-.24.69-.58.96-1.03.27-.44.47-.97.62-1.59s.22-1.29.22-2.02-.07-1.4-.22-2.02-.35-1.14-.62-1.59c-.27-.44-.59-.79-.96-1.03-.37-.24-.79-.36-1.26-.36s-.89.12-1.27.36c-.38.24-.7.59-.97,1.03-.27.44-.47.97-.62,1.59s-.22,1.29-.22,2.02.07,1.4.22,2.02Z"/>
    <path class="cls-1" d="M357.22,142.81l5.46-1.23v13.93h-2.27v-11.38l-3.19.88v-2.19Z"/>
    <path class="cls-1" d="M368.38,140.22v15.28h-2.08v-15.28h2.08ZM374.3,146.49l-3.9,3.72,4.29,5.29h-2.59l-4.29-5.29,3.88-3.72h2.6Z"/>
  </g>
</svg>
                    `,
        },
        {
          title: 'Stats With two column',
          html_code: `<section><div class="pbx-relative pbx-py-4 pbx-bg-gray-900"><div class="pbx-py-24 sm:pbx-py-32"> <div class="pbx-mx-auto pbx-max-w-7xl pbx-px-6 lg:pbx-px-8"> <div class="pbx-mx-auto pbx-max-w-2xl lg:pbx-mx-0 lg:pbx-max-w-none"> <div class="pbx-text-base/7 pbx-font-semibold pbx-text-indigo-400"> <p>Deploy faster</p> </div> <div class="pbx-mt-2 pbx-text-pretty pbx-font-semibold pbx-tracking-tight pbx-text-white pbx-text-2xl lg:pbx-text-4xl pbx-font-medium"><h1>A better workflow</h1></div> <div class="pbx-mt-10 pbx-grid pbx-max-w-xl pbx-grid-cols-1 pbx-gap-8 pbx-text-base/7 pbx-text-gray-300 lg:pbx-max-w-none lg:pbx-grid-cols-2"> <div> <div><p>Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id.</p></div> <div class="pbx-mt-8"><p>Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices hac adipiscing egestas.</p></div> </div> <div> <div><p>Erat pellentesque dictumst ligula porttitor risus eget et eget. Ultricies tellus felis id dignissim eget. Est augue maecenas risus nulla ultrices congue nunc tortor. Enim et nesciunt doloremque nesciunt voluptate.</p></div> <div class="pbx-mt-8"><p>Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices hac adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem vel integer orci.</p></div> </div> </div> <div class="pbx-mt-16 pbx-grid pbx-grid-cols-1 pbx-gap-x-8 pbx-gap-y-12 sm:pbx-mt-20 sm:pbx-grid-cols-2 sm:pbx-gap-y-16 lg:pbx-mt-28 lg:pbx-grid-cols-4"> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6"> <div class="pbx-text-base/7 pbx-text-white"><p>Founded</p></div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"><p>2021</p></div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6"> <div class="pbx-text-base/7 pbx-text-white"><p>Employees</p></div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"><p>37</p></div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6"> <div class="pbx-text-base/7 pbx-text-white"> <p>Countries</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"><p>12</p></div> </div> <div class="pbx-flex pbx-flex-col-reverse pbx-gap-y-3 pbx-border-l pbx-border-white/20 pbx-pl-6"> <div class="pbx-text-base/7 pbx-text-white"> <p>Raised</p> </div> <div class="pbx-text-3xl pbx-font-semibold pbx-tracking-tight pbx-text-white"><p>$25M</p></div> </div> </div> </div> </div> </div></div></section>`,
          category: 'Marketing',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 376.51 132.53">
  <defs>
    <style>
      .cls-1 {
        fill: #231f20;
      }

      .cls-2 {
        fill: #394152;
      }
    </style>
  </defs>
  <rect class="cls-2" x="0" y="127.5" width="30.46" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="125.08" y="127.5" width="30.46" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="233.02" y="127.5" width="30.46" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="345.79" y="127.5" width="30.46" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="3.75" y="43.74" width="161.44" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="3.75" y="58.23" width="161.44" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="3.75" y="72.72" width="161.44" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="184.75" y="43.74" width="161.44" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="184.75" y="58.23" width="161.44" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="184.75" y="72.72" width="161.44" height="5.03" rx="1.98" ry="1.98"/>
  <g>
    <path class="cls-1" d="M9.63,13.88l-.05.66-2.46,5.55h-3.37L12.42,1.37l8.69,18.72h-3.39l-2.41-5.4-.05-.73-2.84-6.59-2.79,6.51ZM8.36,13h8.23l.56,2.53H7.78l.58-2.53Z"/>
    <path class="cls-1" d="M33.16,20.09h-2.76V.33h2.76v19.76ZM42.03,17.53c-.52.91-1.22,1.61-2.08,2.09-.86.48-1.8.72-2.81.72s-1.82-.25-2.56-.73-1.33-1.19-1.76-2.1c-.43-.91-.65-1.99-.65-3.24s.22-2.35.65-3.26c.43-.9,1.02-1.6,1.76-2.09s1.6-.73,2.56-.73c1.01,0,1.95.24,2.81.72.86.48,1.55,1.17,2.08,2.08.52.9.79,2,.79,3.28s-.26,2.36-.79,3.27ZM39.5,12.26c-.32-.56-.74-.98-1.27-1.27-.52-.29-1.11-.43-1.75-.43-.54,0-1.06.14-1.57.43-.51.29-.92.71-1.25,1.25-.33.55-.49,1.22-.49,2.01s.16,1.46.49,2.01c.33.55.75.97,1.25,1.25.51.29,1.03.43,1.57.43.64,0,1.22-.14,1.75-.43s.95-.71,1.27-1.27.48-1.22.48-2-.16-1.44-.48-2Z"/>
    <path class="cls-1" d="M47.36,19.58c-.9-.51-1.6-1.22-2.09-2.13s-.73-1.98-.73-3.19.25-2.31.75-3.22c.5-.91,1.2-1.62,2.12-2.12.91-.5,1.98-.75,3.22-.75s2.28.24,3.15.71c.87.47,1.53,1.15,1.99,2.04.46.89.68,1.95.68,3.2,0,.14,0,.28-.01.43,0,.15-.01.26-.01.33h-10.23v-1.9h7.88l-.84,1.16c.05-.1.11-.24.16-.41.06-.17.09-.31.09-.43,0-.62-.12-1.16-.37-1.62-.25-.46-.58-.81-1.01-1.06-.43-.25-.93-.38-1.51-.38-.69,0-1.28.15-1.76.46s-.85.74-1.11,1.32-.39,1.28-.39,2.13c-.02.83.11,1.54.37,2.13.26.59.64,1.04,1.13,1.34s1.09.46,1.8.46c.76,0,1.42-.15,1.98-.46.56-.3,1.01-.77,1.37-1.39l2.38.94c-.62,1.05-1.42,1.84-2.38,2.37s-2.12.8-3.47.8c-1.18,0-2.23-.25-3.13-.76Z"/>
    <path class="cls-1" d="M64.07,8.44v2.41h-6.61v-2.41h6.61ZM62.12,4.38v15.71h-2.69V4.38h2.69Z"/>
    <path class="cls-1" d="M70.93,8.44v2.41h-6.61v-2.41h6.61ZM68.98,4.38v15.71h-2.69V4.38h2.69Z"/>
    <path class="cls-1" d="M74.75,19.58c-.9-.51-1.6-1.22-2.09-2.13s-.73-1.98-.73-3.19.25-2.31.75-3.22c.5-.91,1.2-1.62,2.12-2.12.91-.5,1.98-.75,3.22-.75s2.28.24,3.15.71c.87.47,1.53,1.15,1.99,2.04.46.89.68,1.95.68,3.2,0,.14,0,.28-.01.43,0,.15-.01.26-.01.33h-10.23v-1.9h7.88l-.84,1.16c.05-.1.11-.24.16-.41.06-.17.09-.31.09-.43,0-.62-.12-1.16-.37-1.62-.25-.46-.58-.81-1.01-1.06-.43-.25-.93-.38-1.51-.38-.69,0-1.28.15-1.76.46s-.85.74-1.11,1.32-.39,1.28-.39,2.13c-.02.83.11,1.54.37,2.13.26.59.64,1.04,1.13,1.34s1.09.46,1.8.46c.76,0,1.42-.15,1.98-.46.56-.3,1.01-.77,1.37-1.39l2.38.94c-.62,1.05-1.42,1.84-2.38,2.37s-2.12.8-3.47.8c-1.18,0-2.23-.25-3.13-.76Z"/>
    <path class="cls-1" d="M89.17,20.09h-2.71v-11.65h2.71v11.65ZM91.95,10.89c-.23-.1-.51-.15-.85-.15-.46,0-.83.12-1.11.36-.29.24-.49.56-.62.98-.13.41-.19.9-.19,1.46l-.91-.53c0-.93.17-1.75.52-2.47.35-.72.79-1.29,1.34-1.72.55-.43,1.12-.65,1.71-.65.42,0,.82.07,1.19.2.37.14.69.36.96.68l-1.34,2.3c-.24-.2-.47-.35-.7-.46Z"/>
    <path class="cls-1" d="M104.7,8.44l2.71,6.92,3.24-7.8,3.4,7.85,2.74-6.97h2.99l-5.45,12.46-3.67-7.85-3.5,7.85-5.45-12.46h2.99Z"/>
    <path class="cls-1" d="M121.08,11.1c.55-.91,1.3-1.63,2.26-2.14.95-.52,2.02-.77,3.2-.77s2.27.26,3.22.77c.95.52,1.69,1.23,2.24,2.14.55.91.82,1.97.82,3.17s-.27,2.23-.82,3.15c-.55.92-1.3,1.64-2.24,2.15-.95.52-2.02.77-3.22.77s-2.25-.26-3.2-.77c-.95-.51-1.71-1.23-2.26-2.15-.55-.92-.82-1.97-.82-3.15s.27-2.26.82-3.17ZM123.52,16.18c.3.55.72.98,1.24,1.29.52.31,1.11.47,1.77.47s1.25-.16,1.77-.47c.52-.31.94-.74,1.24-1.29.3-.55.46-1.19.46-1.91s-.15-1.37-.46-1.93c-.3-.56-.72-.99-1.24-1.29-.52-.3-1.12-.46-1.77-.46s-1.25.15-1.77.46-.94.73-1.24,1.29c-.3.56-.46,1.2-.46,1.93s.15,1.36.46,1.91Z"/>
    <path class="cls-1" d="M138.14,20.09h-2.71v-11.65h2.71v11.65ZM140.91,10.89c-.23-.1-.51-.15-.85-.15-.46,0-.83.12-1.11.36-.29.24-.49.56-.62.98-.13.41-.19.9-.19,1.46l-.91-.53c0-.93.17-1.75.52-2.47.35-.72.79-1.29,1.34-1.72.55-.43,1.12-.65,1.71-.65.42,0,.82.07,1.19.2.37.14.69.36.96.68l-1.34,2.3c-.24-.2-.47-.35-.7-.46Z"/>
    <path class="cls-1" d="M147.41.33v19.76h-2.69V.33h2.69ZM155.06,8.44l-5.04,4.81,5.55,6.84h-3.34l-5.55-6.84,5.02-4.81h3.37Z"/>
    <path class="cls-1" d="M163.09,8.44v2.41h-6.69v-2.41h6.69ZM162.23,2.74c-.22-.08-.43-.13-.63-.13-.25,0-.47.07-.65.2s-.32.35-.42.66c-.1.3-.15.7-.15,1.19v15.43h-2.71V4.13c0-.91.15-1.67.44-2.27.29-.6.72-1.06,1.28-1.38.56-.32,1.25-.48,2.08-.48.46,0,.85.06,1.19.18.34.12.62.27.86.44.24.18.42.35.56.52l-1.27,2.13c-.17-.27-.36-.45-.58-.53Z"/>
    <path class="cls-1" d="M167.96.33v19.76h-2.76V.33h2.76Z"/>
    <path class="cls-1" d="M171.36,11.1c.55-.91,1.3-1.63,2.26-2.14.95-.52,2.02-.77,3.2-.77s2.27.26,3.22.77c.95.52,1.69,1.23,2.24,2.14.55.91.82,1.97.82,3.17s-.27,2.23-.82,3.15c-.55.92-1.3,1.64-2.24,2.15-.95.52-2.02.77-3.22.77s-2.25-.26-3.2-.77c-.95-.51-1.71-1.23-2.26-2.15-.55-.92-.82-1.97-.82-3.15s.27-2.26.82-3.17ZM173.81,16.18c.3.55.72.98,1.24,1.29.52.31,1.11.47,1.77.47s1.25-.16,1.77-.47c.52-.31.94-.74,1.24-1.29.3-.55.46-1.19.46-1.91s-.15-1.37-.46-1.93c-.3-.56-.72-.99-1.24-1.29-.52-.3-1.12-.46-1.77-.46s-1.25.15-1.77.46-.94.73-1.24,1.29c-.3.56-.46,1.2-.46,1.93s.15,1.36.46,1.91Z"/>
    <path class="cls-1" d="M186.57,8.44l2.71,6.92,3.24-7.8,3.4,7.85,2.74-6.97h2.99l-5.45,12.46-3.67-7.85-3.5,7.85-5.45-12.46h2.99Z"/>
  </g>
  <g>
    <path class="cls-1" d="M4.74,108.66c.2-.22.37-.42.52-.62s.25-.4.32-.6c.07-.2.11-.41.11-.64,0-.16-.03-.32-.09-.47s-.15-.3-.28-.43c-.12-.13-.27-.23-.45-.31-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22s-.41.36-.53.64c-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6s.57-.84,1.01-1.1c.45-.27.99-.4,1.62-.4.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27s-.5.77-.84,1.09l-2.38,2.34h3.64v1.32H.85l3.89-4.09Z"/>
    <path class="cls-1" d="M8.75,106.27c.28-.65.66-1.15,1.15-1.51.49-.36,1.06-.54,1.71-.54s1.23.18,1.72.54c.49.36.87.86,1.14,1.51.27.65.41,1.41.41,2.28s-.14,1.63-.41,2.28c-.27.65-.65,1.15-1.14,1.51-.49.36-1.06.54-1.72.54s-1.22-.18-1.71-.54c-.49-.36-.88-.86-1.15-1.51-.28-.65-.41-1.41-.41-2.28s.14-1.63.41-2.28ZM9.86,109.79c.09.38.21.7.38.97.16.27.36.48.59.63.23.15.49.22.78.22s.55-.07.77-.22c.23-.15.42-.36.59-.63.16-.27.29-.6.38-.97.09-.38.13-.79.13-1.24s-.04-.86-.13-1.24c-.09-.38-.21-.7-.38-.97-.16-.27-.36-.48-.59-.63-.23-.15-.49-.22-.77-.22s-.55.07-.78.22c-.23.15-.43.36-.59.63-.16.27-.29.6-.38.97s-.13.79-.13,1.24.04.86.13,1.24Z"/>
    <path class="cls-1" d="M16.25,106.27c.28-.65.66-1.15,1.15-1.51.49-.36,1.06-.54,1.71-.54s1.23.18,1.72.54c.49.36.87.86,1.14,1.51.27.65.41,1.41.41,2.28s-.14,1.63-.41,2.28c-.27.65-.65,1.15-1.14,1.51-.49.36-1.06.54-1.72.54s-1.22-.18-1.71-.54c-.49-.36-.88-.86-1.15-1.51-.28-.65-.41-1.41-.41-2.28s.14-1.63.41-2.28ZM17.36,109.79c.09.38.21.7.38.97.16.27.36.48.59.63.23.15.49.22.78.22s.55-.07.77-.22c.23-.15.42-.36.59-.63.16-.27.29-.6.38-.97.09-.38.13-.79.13-1.24s-.04-.86-.13-1.24c-.09-.38-.21-.7-.38-.97-.16-.27-.36-.48-.59-.63-.23-.15-.49-.22-.77-.22s-.55.07-.78.22c-.23.15-.43.36-.59.63-.16.27-.29.6-.38.97s-.13.79-.13,1.24.04.86.13,1.24Z"/>
    <path class="cls-1" d="M23.76,104.97l3.35-.76v8.53h-1.39v-6.97l-1.96.54v-1.34Z"/>
  </g>
  <g>
    <path class="cls-1" d="M127.3,111.79c-.36-.13-.66-.32-.91-.55-.25-.24-.45-.51-.58-.82-.14-.31-.2-.63-.2-.98h1.43c0,.26.07.5.2.7.13.2.31.35.54.46.23.11.48.16.76.16s.54-.05.76-.16c.22-.1.38-.25.5-.45.12-.2.17-.43.17-.71,0-.22-.04-.42-.13-.6-.09-.18-.21-.32-.38-.44s-.36-.21-.59-.28c-.23-.06-.49-.1-.77-.1v-.8c.46,0,.9.04,1.3.13.4.09.75.23,1.05.42.3.19.53.44.7.74s.25.66.25,1.07c0,.48-.12.9-.36,1.26-.24.36-.58.64-1.01.84-.43.2-.94.3-1.51.3-.45,0-.85-.07-1.21-.2ZM128.09,106.97c.26,0,.48-.03.68-.1.2-.07.37-.16.51-.29s.25-.27.32-.43c.08-.16.11-.33.11-.5,0-.22-.04-.42-.13-.59-.08-.17-.21-.31-.38-.4s-.38-.14-.64-.14c-.36,0-.66.11-.91.33-.25.22-.37.5-.37.83h-1.33c0-.46.11-.87.33-1.22.22-.35.53-.63.92-.83.39-.2.84-.31,1.36-.31.54,0,1.01.1,1.39.31.38.21.68.48.88.82s.31.72.31,1.13-.13.8-.4,1.13c-.26.33-.63.58-1.09.76-.46.18-.99.26-1.58.26v-.76Z"/>
    <path class="cls-1" d="M132.04,103.45h6.28l-4.04,8.4h-1.51l3.44-7.07h-4.16v-1.33Z"/>
  </g>
  <g>
    <path class="cls-1" d="M236.81,104.59l3.35-.76v8.53h-1.39v-6.97l-1.96.54v-1.34Z"/>
    <path class="cls-1" d="M245.73,108.28c.2-.22.37-.42.52-.62s.25-.4.32-.6c.07-.2.11-.41.11-.64,0-.16-.03-.32-.09-.47s-.15-.3-.28-.43c-.12-.13-.27-.23-.45-.31-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22s-.41.36-.53.64c-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6s.57-.84,1.01-1.1c.45-.27.99-.4,1.62-.4.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27s-.5.77-.84,1.09l-2.38,2.34h3.64v1.32h-6.41l3.89-4.09Z"/>
  </g>
  <g>
    <path class="cls-1" d="M351.11,106.06c-.15-.2-.33-.35-.53-.47s-.44-.18-.71-.18-.51.04-.68.12c-.18.08-.31.19-.39.34-.08.15-.13.33-.13.53,0,.27.09.5.27.67s.42.33.71.46.61.26.95.38c.24.09.49.2.74.34s.48.3.7.5.38.43.5.71.19.6.19.98c0,.5-.11.93-.33,1.3-.22.37-.54.65-.96.85-.42.2-.93.29-1.53.29-.47,0-.92-.1-1.34-.29-.42-.2-.79-.46-1.1-.8-.31-.34-.56-.72-.73-1.15l1.09-.71c.18.36.38.67.58.93.2.26.43.46.69.59.26.14.54.2.86.2.29,0,.53-.05.71-.14.19-.09.33-.22.42-.4.09-.17.14-.38.14-.62,0-.3-.09-.55-.27-.75-.18-.2-.41-.36-.7-.5s-.59-.26-.91-.38c-.21-.07-.44-.17-.69-.29-.25-.12-.49-.28-.71-.48-.22-.2-.41-.43-.55-.71-.14-.28-.22-.62-.22-1.02s.11-.75.34-1.07c.23-.32.54-.58.94-.77.4-.19.85-.29,1.36-.29s.95.09,1.31.26c.36.18.66.4.91.67s.43.56.57.85l-1.1.68c-.12-.23-.26-.45-.41-.64ZM350.44,102.93l-.02,1.94h-1.07l-.04-1.94h1.13ZM350.42,112.1l.02,1.99h-1.13l.04-1.99h1.07Z"/>
    <path class="cls-1" d="M357.49,108.66c.2-.22.37-.42.52-.62.14-.2.25-.4.32-.6.07-.2.11-.41.11-.64,0-.16-.03-.32-.09-.47-.06-.16-.15-.3-.28-.43-.12-.13-.27-.23-.45-.31-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22-.23.15-.41.36-.53.64-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6.23-.47.57-.84,1.01-1.1.45-.27.99-.4,1.62-.4.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27s-.5.77-.84,1.09l-2.38,2.34h3.64v1.32h-6.41l3.89-4.09Z"/>
    <path class="cls-1" d="M367.03,111.29c-.17.36-.41.66-.7.89-.3.24-.63.41-1,.53-.37.12-.76.17-1.16.17-.51,0-.97-.07-1.36-.2-.4-.14-.74-.32-1.03-.55-.29-.23-.54-.47-.76-.74l.84-1.03c.17.22.36.43.59.61.22.18.47.32.74.43.27.11.53.16.8.16.38,0,.7-.07.96-.2.26-.13.47-.32.61-.56s.21-.53.21-.87-.08-.64-.24-.88c-.16-.24-.38-.42-.65-.55-.27-.13-.57-.19-.89-.19-.25,0-.49.02-.73.05s-.48.1-.72.2c-.24.1-.51.23-.8.41l1.14-4.62h4.32v1.25h-3.25l-.53,1.92c.21-.1.42-.18.65-.23.22-.05.45-.07.68-.07.46,0,.89.12,1.27.35.38.23.69.56.92.97.23.42.34.91.34,1.48,0,.49-.09.91-.26,1.27Z"/>
    <path class="cls-1" d="M376.51,112.75h-1.31v-3.36c0-.42-.07-.73-.22-.93-.15-.2-.38-.31-.69-.31-.22,0-.42.05-.58.14-.16.1-.29.24-.38.42-.09.18-.14.41-.14.67v3.36h-1.3v-3.36c0-.42-.07-.73-.22-.93-.15-.2-.38-.31-.7-.31-.22,0-.41.05-.57.14s-.29.24-.38.42c-.09.18-.14.41-.14.67v3.36h-1.27v-5.52h1.27v.8c.17-.3.38-.53.64-.69.26-.16.56-.23.92-.23.4,0,.73.08,1,.25.27.17.46.41.58.73.2-.33.45-.57.74-.74s.62-.25.99-.25c.4,0,.73.08.98.25s.45.41.58.73.2.7.2,1.15v3.52Z"/>
  </g>
</svg>
                    `,
        },
        {
          title: 'Timeline Simple',
          html_code: `<section><div class="pbx-bg-white pbx-py-24 sm:pbx-py-32"> <div class="pbx-mx-auto pbx-max-w-7xl pbx-px-6 lg:pbx-px-8"> <div class="pbx-mx-auto pbx-grid pbx-max-w-2xl pbx-grid-cols-1 pbx-gap-8 pbx-overflow-hidden lg:pbx-mx-0 lg:pbx-max-w-none lg:pbx-grid-cols-4"> <div> <div class="pbx-flex pbx-items-center pbx-text-sm/6 pbx-font-semibold pbx-text-indigo-600"> <div class="pbx-text-black"><p>Aug 2021</p></div>  </div> <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Founded company</p></div> <div class="pbx-mt-1 pbx-text-base/7 pbx-text-black"><p>Nihil aut nam. Dignissimos a pariatur et quos omnis. Aspernatur asperiores et dolorem dolorem optio voluptate repudiandae.</p></div> </div> <div> <div class="pbx-flex pbx-items-center pbx-text-sm/6 pbx-font-semibold pbx-text-indigo-600"> <div class="pbx-text-black"><p>Dec 2021</p></div>  </div> <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Secured $65m in funding</p></div> <div class="pbx-mt-1 pbx-text-base/7 pbx-text-black"> <p>Provident quia ut esse. Vero vel eos repudiandae aspernatur. Cumque minima impedit sapiente a architecto nihil.</p> </div> </div> <div> <div class="pbx-flex pbx-items-center pbx-text-sm/6 pbx-font-semibold pbx-text-indigo-600"> <div class="pbx-text-black"><p>Feb 2022</p></div>  </div> <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"><p>Released beta</p></div> <div class="pbx-mt-1 pbx-text-base/7 pbx-text-black"> <p>Sunt perspiciatis incidunt. Non necessitatibus aliquid. Consequatur ut officiis earum eum quia facilis. Hic deleniti dolorem quia et.</p> </div> </div> <div> <div class="pbx-flex pbx-items-center pbx-text-sm/6 pbx-font-semibold pbx-text-indigo-600"> <div class="pbx-text-black"><p>Dec 2022</p></div>  </div> <div class="pbx-mt-6 pbx-text-lg/8 pbx-font-semibold pbx-tracking-tight pbx-text-black"> <p>Global launch of product</p> </div> <div class="pbx-mt-1 pbx-text-base/7 pbx-text-black"><p>Ut ipsa sint distinctio quod itaque nam qui. Possimus aut unde id architecto voluptatem hic aut pariatur velit.</p></div> </div> </div> </div> </div></section>`,
          category: 'Marketing',
          cover_image: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 521.91 64.62">
  <defs>
    <style>
      .cls-1 {
        fill: #231f20;
      }

      .cls-2 {
        fill: #394152;
      }
    </style>
  </defs>
  <rect class="cls-2" x="0" y="30.61" width="57.38" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="0" y="45.1" width="90.91" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="0" y="59.59" width="90.91" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="146" y="30.61" width="57.38" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="146" y="45.1" width="90.91" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="146" y="59.59" width="90.91" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="288" y="30.61" width="57.38" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="288" y="45.1" width="90.91" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="288" y="59.59" width="90.91" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="431" y="30.61" width="57.38" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="431" y="45.1" width="90.91" height="5.03" rx="1.98" ry="1.98"/>
  <rect class="cls-2" x="431" y="59.59" width="90.91" height="5.03" rx="1.98" ry="1.98"/>
  <g>
    <path class="cls-1" d="M2.78,6.42l-.02.31-1.16,2.63H0L4.1.49l4.12,8.87h-1.61l-1.14-2.56-.02-.35-1.34-3.12-1.32,3.08ZM2.18,6h3.9l.26,1.2H1.91l.28-1.2Z"/>
    <path class="cls-1" d="M10.42,8.11c.17.22.43.32.78.32.24,0,.45-.05.64-.16.18-.1.33-.25.43-.43.1-.18.16-.4.16-.65v-3.36h1.3v5.52h-1.3v-.85c-.18.32-.4.56-.68.73-.28.16-.61.25-.99.25-.62,0-1.09-.19-1.42-.58-.33-.38-.5-.9-.5-1.56v-3.5h1.33v3.36c0,.39.08.7.25.91Z"/>
    <path class="cls-1" d="M15.32,5.02c.25-.42.58-.74.99-.97.41-.22.85-.34,1.33-.34s.87.11,1.22.34.62.55.83.97c.2.42.31.93.31,1.53s-.1,1.1-.31,1.53c-.2.43-.48.76-.83.98-.35.23-.75.34-1.22.34s-.91-.11-1.33-.34-.74-.55-.99-.97c-.25-.42-.37-.94-.37-1.55s.12-1.12.37-1.54ZM16.36,9.73c0,.25.08.47.2.67.13.2.31.35.54.47.23.12.5.17.82.17.26,0,.52-.06.77-.19.25-.13.45-.32.61-.59.16-.26.23-.6.23-1.02V3.84h1.27v5.4c0,.66-.13,1.21-.4,1.64s-.62.75-1.05.97c-.43.21-.9.32-1.4.32-.59,0-1.1-.1-1.52-.31-.42-.2-.75-.49-.98-.86-.23-.37-.36-.79-.37-1.27h1.3ZM16.52,7.51c.15.26.35.46.61.59.25.13.53.2.82.2.26,0,.5-.07.74-.2.24-.13.44-.33.59-.58.16-.26.23-.57.23-.95,0-.28-.05-.53-.14-.74-.09-.21-.21-.39-.37-.54-.15-.15-.32-.26-.5-.33-.18-.07-.37-.11-.56-.11-.3,0-.57.07-.82.2s-.45.33-.61.58-.23.57-.23.94.08.68.23.94Z"/>
    <path class="cls-1" d="M29.3,5.27c.2-.22.37-.42.52-.62.14-.2.25-.4.32-.6.07-.2.11-.41.11-.64,0-.16-.03-.32-.09-.47-.06-.16-.15-.3-.28-.43s-.27-.23-.45-.31c-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22s-.41.36-.53.64c-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6.23-.47.57-.84,1.01-1.1.45-.27.99-.4,1.62-.4.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27-.22.41-.5.77-.84,1.09l-2.38,2.34h3.64v1.32h-6.41l3.89-4.09Z"/>
    <path class="cls-1" d="M33.32,2.88c.28-.65.66-1.15,1.15-1.51.49-.36,1.06-.54,1.71-.54s1.23.18,1.72.54c.49.36.87.86,1.14,1.51s.41,1.41.41,2.28-.14,1.63-.41,2.28-.65,1.15-1.14,1.51c-.49.36-1.06.54-1.72.54s-1.22-.18-1.71-.54c-.49-.36-.88-.86-1.15-1.51s-.41-1.41-.41-2.28.14-1.63.41-2.28ZM34.43,6.4c.09.38.21.7.38.97.16.27.36.48.59.63.23.15.49.22.78.22s.55-.07.77-.22.42-.36.59-.63c.16-.27.29-.6.38-.97.09-.38.13-.79.13-1.24s-.04-.86-.13-1.24c-.09-.38-.21-.7-.38-.97-.16-.27-.36-.48-.59-.63-.23-.15-.49-.22-.77-.22s-.55.07-.78.22c-.23.15-.43.36-.59.63-.16.27-.29.6-.38.97s-.13.79-.13,1.24.04.86.13,1.24Z"/>
    <path class="cls-1" d="M44.05,5.27c.2-.22.37-.42.52-.62.14-.2.25-.4.32-.6.07-.2.11-.41.11-.64,0-.16-.03-.32-.09-.47-.06-.16-.15-.3-.28-.43s-.27-.23-.45-.31c-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22s-.41.36-.53.64c-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6.23-.47.57-.84,1.01-1.1.45-.27.99-.4,1.62-.4.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27-.22.41-.5.77-.84,1.09l-2.38,2.34h3.64v1.32h-6.41l3.89-4.09Z"/>
    <path class="cls-1" d="M48.07,1.58l3.35-.76v8.53h-1.39V2.39l-1.96.54v-1.34Z"/>
  </g>
  <g>
    <path class="cls-1" d="M146.67.96v8.4h-1.45V.96h1.45ZM146.1,9.36v-1.33h1.8c.42,0,.8-.06,1.15-.19.35-.12.66-.3.92-.54.26-.24.46-.53.61-.89.15-.36.22-.78.22-1.25s-.07-.89-.22-1.25c-.15-.36-.35-.66-.61-.9-.26-.24-.57-.42-.92-.54-.35-.12-.74-.18-1.15-.18h-1.8V.96h1.84c.86,0,1.61.17,2.26.52s1.15.84,1.52,1.46c.36.63.55,1.37.55,2.21s-.18,1.59-.55,2.21c-.36.63-.87,1.12-1.52,1.46s-1.4.52-2.26.52h-1.84Z"/>
    <path class="cls-1" d="M154.44,9.12c-.43-.24-.76-.58-.99-1.01s-.35-.94-.35-1.51.12-1.09.35-1.52c.24-.43.57-.77,1-1,.43-.24.94-.35,1.52-.35s1.08.11,1.49.34c.41.22.73.55.94.97.22.42.32.93.32,1.52,0,.06,0,.13,0,.2,0,.07,0,.12,0,.16h-4.85v-.9h3.73l-.4.55s.05-.11.08-.19c.03-.08.04-.15.04-.2,0-.3-.06-.55-.17-.77-.12-.22-.28-.38-.48-.5-.2-.12-.44-.18-.71-.18-.33,0-.61.07-.83.22s-.4.35-.53.62-.19.61-.19,1.01c0,.39.05.73.17,1.01.12.28.3.49.53.64s.52.22.85.22c.36,0,.67-.07.94-.22.26-.14.48-.36.65-.66l1.13.44c-.3.5-.67.87-1.13,1.12s-1,.38-1.64.38c-.56,0-1.05-.12-1.48-.36Z"/>
    <path class="cls-1" d="M161.09,7.51c.15.26.36.47.62.62.26.15.55.23.87.23.27,0,.53-.04.76-.13s.45-.2.63-.34c.18-.14.32-.3.41-.47v1.43c-.19.19-.45.34-.78.46-.33.11-.69.17-1.08.17-.56,0-1.07-.12-1.52-.37-.45-.24-.81-.58-1.07-1.02-.26-.44-.4-.93-.4-1.49s.13-1.07.4-1.5c.26-.43.62-.77,1.07-1.01.45-.24.96-.37,1.52-.37.39,0,.75.06,1.08.17.33.11.59.26.78.44v1.44c-.09-.18-.23-.35-.41-.49-.19-.14-.4-.25-.64-.33-.24-.08-.49-.12-.74-.12-.32,0-.61.08-.87.23-.26.15-.47.36-.62.62-.15.26-.23.57-.23.91s.08.65.23.91Z"/>
    <path class="cls-1" d="M172.7,5.27c.2-.22.37-.42.52-.62.14-.2.25-.4.32-.6.07-.2.11-.41.11-.64,0-.16-.03-.32-.09-.47-.06-.16-.15-.3-.28-.43s-.27-.23-.45-.31c-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22s-.41.36-.53.64c-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6.23-.47.57-.84,1.01-1.1.45-.27.99-.4,1.62-.4.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27-.22.41-.5.77-.84,1.09l-2.38,2.34h3.64v1.32h-6.41l3.89-4.09Z"/>
    <path class="cls-1" d="M176.71,2.88c.28-.65.66-1.15,1.15-1.51.49-.36,1.06-.54,1.71-.54s1.23.18,1.72.54c.49.36.87.86,1.14,1.51s.41,1.41.41,2.28-.14,1.63-.41,2.28-.65,1.15-1.14,1.51c-.49.36-1.06.54-1.72.54s-1.22-.18-1.71-.54c-.49-.36-.88-.86-1.15-1.51s-.41-1.41-.41-2.28.14-1.63.41-2.28ZM177.82,6.4c.09.38.21.7.38.97.16.27.36.48.59.63.23.15.49.22.78.22s.55-.07.77-.22.42-.36.59-.63c.16-.27.29-.6.38-.97.09-.38.13-.79.13-1.24s-.04-.86-.13-1.24c-.09-.38-.21-.7-.38-.97-.16-.27-.36-.48-.59-.63-.23-.15-.49-.22-.77-.22s-.55.07-.78.22c-.23.15-.43.36-.59.63-.16.27-.29.6-.38.97s-.13.79-.13,1.24.04.86.13,1.24Z"/>
    <path class="cls-1" d="M187.45,5.27c.2-.22.37-.42.52-.62.14-.2.25-.4.32-.6.07-.2.11-.41.11-.64,0-.16-.03-.32-.09-.47-.06-.16-.15-.3-.28-.43s-.27-.23-.45-.31c-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22s-.41.36-.53.64c-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6.23-.47.57-.84,1.01-1.1.45-.27.99-.4,1.62-.4.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27-.22.41-.5.77-.84,1.09l-2.38,2.34h3.64v1.32h-6.41l3.89-4.09Z"/>
    <path class="cls-1" d="M191.47,1.58l3.35-.76v8.53h-1.39V2.39l-1.96.54v-1.34Z"/>
  </g>
  <g>
    <path class="cls-1" d="M433.77.96v8.4h-1.45V.96h1.45ZM433.19,9.36v-1.33h1.8c.42,0,.8-.06,1.15-.19s.66-.3.92-.54c.26-.24.46-.53.61-.89.15-.36.22-.78.22-1.25s-.07-.89-.22-1.25c-.15-.36-.35-.66-.61-.9-.26-.24-.57-.42-.92-.54-.35-.12-.74-.18-1.15-.18h-1.8V.96h1.84c.86,0,1.61.17,2.26.52.65.35,1.15.84,1.52,1.46.36.63.55,1.37.55,2.21s-.18,1.59-.55,2.21-.87,1.12-1.52,1.46c-.65.35-1.4.52-2.26.52h-1.84Z"/>
    <path class="cls-1" d="M441.54,9.12c-.43-.24-.76-.58-.99-1.01-.23-.43-.35-.94-.35-1.51s.12-1.09.35-1.52c.24-.43.57-.77,1-1,.43-.24.94-.35,1.52-.35s1.08.11,1.49.34c.41.22.73.55.94.97.22.42.32.93.32,1.52,0,.06,0,.13,0,.2,0,.07,0,.12,0,.16h-4.85v-.9h3.73l-.4.55s.05-.11.08-.19c.03-.08.04-.15.04-.2,0-.3-.06-.55-.17-.77-.12-.22-.28-.38-.48-.5s-.44-.18-.71-.18c-.33,0-.61.07-.83.22-.23.14-.4.35-.53.62s-.19.61-.19,1.01c0,.39.05.73.17,1.01.12.28.3.49.53.64.23.14.52.22.85.22.36,0,.67-.07.94-.22.26-.14.48-.36.65-.66l1.13.44c-.3.5-.67.87-1.13,1.12s-1,.38-1.64.38c-.56,0-1.05-.12-1.48-.36Z"/>
    <path class="cls-1" d="M448.18,7.51c.15.26.36.47.62.62.26.15.55.23.87.23.27,0,.53-.04.76-.13.24-.08.45-.2.63-.34.18-.14.32-.3.41-.47v1.43c-.19.19-.45.34-.78.46-.33.11-.69.17-1.08.17-.56,0-1.07-.12-1.52-.37-.45-.24-.81-.58-1.07-1.02s-.4-.93-.4-1.49.13-1.07.4-1.5c.26-.43.62-.77,1.07-1.01.45-.24.96-.37,1.52-.37.39,0,.75.06,1.08.17.33.11.59.26.78.44v1.44c-.09-.18-.23-.35-.41-.49-.19-.14-.4-.25-.64-.33-.24-.08-.49-.12-.74-.12-.32,0-.61.08-.87.23-.26.15-.47.36-.62.62-.15.26-.23.57-.23.91s.08.65.23.91Z"/>
    <path class="cls-1" d="M459.79,5.27c.2-.22.37-.42.52-.62.14-.2.25-.4.32-.6.07-.2.11-.41.11-.64,0-.16-.03-.32-.09-.47-.06-.16-.15-.3-.28-.43s-.27-.23-.45-.31c-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22-.23.15-.41.36-.53.64-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6.23-.47.57-.84,1.01-1.1.45-.27.99-.4,1.62-.4.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27-.22.41-.5.77-.84,1.09l-2.38,2.34h3.64v1.32h-6.41l3.89-4.09Z"/>
    <path class="cls-1" d="M463.81,2.88c.28-.65.66-1.15,1.15-1.51.49-.36,1.06-.54,1.71-.54s1.23.18,1.72.54c.49.36.87.86,1.14,1.51.27.65.41,1.41.41,2.28s-.14,1.63-.41,2.28c-.27.65-.65,1.15-1.14,1.51-.49.36-1.06.54-1.72.54s-1.22-.18-1.71-.54c-.49-.36-.88-.86-1.15-1.51-.28-.65-.41-1.41-.41-2.28s.14-1.63.41-2.28ZM464.92,6.4c.09.38.21.7.38.97.16.27.36.48.59.63s.49.22.78.22.55-.07.77-.22c.23-.15.42-.36.59-.63.16-.27.29-.6.38-.97.09-.38.13-.79.13-1.24s-.04-.86-.13-1.24c-.09-.38-.21-.7-.38-.97-.16-.27-.36-.48-.59-.63-.23-.15-.49-.22-.77-.22s-.55.07-.78.22c-.23.15-.43.36-.59.63-.16.27-.29.6-.38.97s-.13.79-.13,1.24.04.86.13,1.24Z"/>
    <path class="cls-1" d="M474.54,5.27c.2-.22.37-.42.52-.62.14-.2.25-.4.32-.6s.11-.41.11-.64c0-.16-.03-.32-.09-.47-.06-.16-.15-.3-.28-.43s-.27-.23-.45-.31c-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22-.23.15-.41.36-.53.64-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6.23-.47.57-.84,1.01-1.1s.99-.4,1.62-.4c.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27-.22.41-.5.77-.84,1.09l-2.38,2.34h3.64v1.32h-6.41l3.89-4.09Z"/>
    <path class="cls-1" d="M481.79,5.27c.2-.22.37-.42.52-.62.14-.2.25-.4.32-.6s.11-.41.11-.64c0-.16-.03-.32-.09-.47-.06-.16-.15-.3-.28-.43s-.27-.23-.45-.31c-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22-.23.15-.41.36-.53.64-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6.23-.47.57-.84,1.01-1.1s.99-.4,1.62-.4c.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27-.22.41-.5.77-.84,1.09l-2.38,2.34h3.64v1.32h-6.41l3.89-4.09Z"/>
  </g>
  <g>
    <path class="cls-1" d="M290.01.96v8.4h-1.39V.96h1.39ZM289.49.96h3.76v1.27h-3.76V.96ZM289.49,4.33h3.64v1.24h-3.64v-1.24Z"/>
    <path class="cls-1" d="M295.32,9.12c-.43-.24-.76-.58-.99-1.01-.23-.43-.35-.94-.35-1.51s.12-1.09.35-1.52c.24-.43.57-.77,1-1,.43-.24.94-.35,1.52-.35s1.08.11,1.49.34c.41.22.73.55.94.97s.32.93.32,1.52c0,.06,0,.13,0,.2,0,.07,0,.12,0,.16h-4.85v-.9h3.73l-.4.55s.05-.11.08-.19.04-.15.04-.2c0-.3-.06-.55-.17-.77-.12-.22-.28-.38-.48-.5-.2-.12-.44-.18-.71-.18-.33,0-.61.07-.83.22-.23.14-.4.35-.53.62s-.19.61-.19,1.01c0,.39.05.73.17,1.01.12.28.3.49.53.64.23.14.52.22.85.22.36,0,.67-.07.94-.22s.48-.36.65-.66l1.13.44c-.3.5-.67.87-1.13,1.12s-1,.38-1.64.38c-.56,0-1.05-.12-1.48-.36Z"/>
    <path class="cls-1" d="M302.13,9.36h-1.31V0h1.31v9.36ZM306.33,8.15c-.25.43-.58.76-.98.99s-.85.34-1.33.34-.86-.12-1.21-.35c-.35-.23-.63-.56-.83-1-.2-.43-.31-.94-.31-1.54s.1-1.11.31-1.54c.2-.43.48-.76.83-.99.35-.23.76-.35,1.21-.35.48,0,.92.11,1.33.34s.74.56.98.98c.25.43.37.95.37,1.55s-.12,1.12-.37,1.55ZM305.13,5.65c-.15-.26-.35-.46-.6-.6-.25-.14-.52-.2-.83-.2-.26,0-.5.07-.74.2-.24.14-.44.33-.59.59-.16.26-.23.58-.23.95s.08.69.23.95c.16.26.35.46.59.59.24.14.49.2.74.2.3,0,.58-.07.83-.2s.45-.34.6-.6c.15-.26.23-.58.23-.95s-.08-.68-.23-.95Z"/>
    <path class="cls-1" d="M314.84,5.27c.2-.22.37-.42.52-.62.14-.2.25-.4.32-.6.07-.2.11-.41.11-.64,0-.16-.03-.32-.09-.47-.06-.16-.15-.3-.28-.43s-.27-.23-.45-.31c-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22-.23.15-.41.36-.53.64-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6.23-.47.57-.84,1.01-1.1.45-.27.99-.4,1.62-.4.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27-.22.41-.5.77-.84,1.09l-2.38,2.34h3.64v1.32h-6.41l3.89-4.09Z"/>
    <path class="cls-1" d="M318.85,2.88c.28-.65.66-1.15,1.15-1.51.49-.36,1.06-.54,1.71-.54s1.23.18,1.72.54c.49.36.87.86,1.14,1.51.27.65.41,1.41.41,2.28s-.14,1.63-.41,2.28c-.27.65-.65,1.15-1.14,1.51-.49.36-1.06.54-1.72.54s-1.22-.18-1.71-.54c-.49-.36-.88-.86-1.15-1.51-.28-.65-.41-1.41-.41-2.28s.14-1.63.41-2.28ZM319.96,6.4c.09.38.21.7.38.97.16.27.36.48.59.63.23.15.49.22.78.22s.55-.07.77-.22c.23-.15.42-.36.59-.63.16-.27.29-.6.38-.97s.13-.79.13-1.24-.04-.86-.13-1.24-.21-.7-.38-.97c-.16-.27-.36-.48-.59-.63-.23-.15-.49-.22-.77-.22s-.55.07-.78.22c-.23.15-.43.36-.59.63-.16.27-.29.6-.38.97s-.13.79-.13,1.24.04.86.13,1.24Z"/>
    <path class="cls-1" d="M329.58,5.27c.2-.22.37-.42.52-.62.14-.2.25-.4.32-.6.07-.2.11-.41.11-.64,0-.16-.03-.32-.09-.47-.06-.16-.15-.3-.28-.43s-.27-.23-.45-.31c-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22-.23.15-.41.36-.53.64-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6.23-.47.57-.84,1.01-1.1.45-.27.99-.4,1.62-.4.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27-.22.41-.5.77-.84,1.09l-2.38,2.34h3.64v1.32h-6.41l3.89-4.09Z"/>
    <path class="cls-1" d="M336.83,5.27c.2-.22.37-.42.52-.62.14-.2.25-.4.32-.6.07-.2.11-.41.11-.64,0-.16-.03-.32-.09-.47-.06-.16-.15-.3-.28-.43s-.27-.23-.45-.31c-.18-.08-.38-.11-.61-.11-.32,0-.6.07-.83.22-.23.15-.41.36-.53.64-.12.28-.19.6-.19.97h-1.4c0-.6.11-1.13.34-1.6.23-.47.57-.84,1.01-1.1.45-.27.99-.4,1.62-.4.49,0,.91.08,1.27.23.36.16.66.36.89.61.24.25.41.52.53.82.12.3.18.58.18.86,0,.44-.11.86-.32,1.27-.22.41-.5.77-.84,1.09l-2.38,2.34h3.64v1.32h-6.41l3.89-4.09Z"/>
  </g>
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
