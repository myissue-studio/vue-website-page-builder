interface TailwindImage {
  objectFit: string[]
  objectPosition: string[]
  aspectRatio: string[]
}

const tailwindImage: TailwindImage = {
  objectFit: ['none', 'pbx-object-cover', 'pbx-object-contain'],
  objectPosition: [
    'none',
    'pbx-object-top-left',
    'pbx-object-top',
    'pbx-object-top-right',
    'pbx-object-left',
    'pbx-object-center',
    'pbx-object-right',
    'pbx-object-bottom-left',
    'pbx-object-bottom',
    'pbx-object-bottom-right',
  ],
  aspectRatio: ['none', 'pbx-aspect-square', 'pbx-aspect-video', 'pbx-aspect-[9/16]'],
}

export default tailwindImage
