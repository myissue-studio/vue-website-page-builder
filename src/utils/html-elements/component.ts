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
                        <defs>
                          <style>
                            .cls-1 {
                              fill: #384152;
                            }

                            .cls-2 {
                              fill: #718096;
                            }
                          </style>
                        </defs>
                        <g>
                          <rect class="cls-1" width="57.68" height="57.68"/>
                          <g>
                            <polygon class="cls-2" points="8.77 37.45 23.11 20.25 37.44 37.45 8.77 37.45"/>
                            <polygon class="cls-2" points="34.58 37.45 41.74 28.85 48.91 37.45 34.58 37.45"/>
                            <circle class="cls-2" cx="41.74" cy="22.62" r="2.39"/>
                          </g>
                        </g>
                        <g>
                          <rect class="cls-1" x="62.5" width="57.68" height="57.68"/>
                          <g>
                            <polygon class="cls-2" points="71.27 37.45 85.61 20.25 99.94 37.45 71.27 37.45"/>
                            <polygon class="cls-2" points="97.07 37.45 104.24 28.85 111.41 37.45 97.07 37.45"/>
                            <circle class="cls-2" cx="104.24" cy="22.62" r="2.39"/>
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
                        <rect class="cls-1" width="42.55" height="42.55"/>
                        <rect class="cls-1" x="49.05" width="42.55" height="42.55"/>
                        <rect class="cls-1" x="97.35" width="42.55" height="42.55"/>
                        <rect class="cls-1" x="147.79" width="42.55" height="42.55"/>
                        <polygon class="cls-2" points="6.47 27.62 17.04 14.93 27.62 27.62 6.47 27.62"/>
                        <polygon class="cls-2" points="25.5 27.62 30.79 21.28 36.07 27.62 25.5 27.62"/>
                        <circle class="cls-2" cx="30.79" cy="16.69" r="1.76"/>
                        <polygon class="cls-2" points="55.52 27.62 66.09 14.93 76.66 27.62 55.52 27.62"/>
                        <polygon class="cls-2" points="74.55 27.62 79.83 21.28 85.12 27.62 74.55 27.62"/>
                        <circle class="cls-2" cx="79.83" cy="16.69" r="1.76"/>
                        <polygon class="cls-2" points="103.82 27.62 114.39 14.93 124.97 27.62 103.82 27.62"/>
                        <polygon class="cls-2" points="122.85 27.62 128.14 21.28 133.42 27.62 122.85 27.62"/>
                        <circle class="cls-2" cx="128.14" cy="16.69" r="1.76"/>
                        <polygon class="cls-2" points="154.26 27.62 164.83 14.93 175.4 27.62 154.26 27.62"/>
                        <polygon class="cls-2" points="173.29 27.62 178.57 21.28 183.86 27.62 173.29 27.62"/>
                        <circle class="cls-2" cx="178.57" cy="16.69" r="1.76"/>
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
      ],
    },
  },
]

export default component
