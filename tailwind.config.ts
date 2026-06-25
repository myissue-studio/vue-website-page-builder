import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  prefix: 'pbx-',
  content: [
    './css/style.css',
    './src/**/*.{vue,js,ts,jsx,tsx,json,html}',
    './public/json/**/*.json',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        ...defaultTheme.colors,
        // Custom colors
        myPrimaryBrandColor: '#000000',
        myPrimaryLinkColor: '#16a34a',
        // gray colors
        myPrimaryLightGrayColor: '#eff2f6',
        // for myPrimaryTag
        myPrimaryLightMediumGrayColor: '#dee6f0',

        // just a dark gray color
        myPrimaryMediumGrayColor: '#9ca3af',

        // use as black color
        myPrimaryDarkGrayColor: '#111827',

        myPrimaryErrorColor: '#d60000',
        myPrimarySuccesColor: '#16a34a',
      },
      fontFamily: {
        sans: ['Jost', 'Raleway', "'Cormorant'", 'sans-serif', ...defaultTheme.fontFamily.sans],
        raleway: ['Raleway', 'sans-serif'],
        arial: ['Arial', 'sans-serif'],
        helvetica: ['Helvetica', 'Arial', 'sans-serif'],
        georgia: ['Georgia', 'serif'],
        times: ['Times', 'serif'],
        'times-new-roman': ['"Times New Roman"', 'Times', 'serif'],
        courier: ['Courier', 'monospace'],
        'courier-new': ['"Courier New"', 'Courier', 'monospace'],
        verdana: ['Verdana', 'Geneva', 'sans-serif'],
        tahoma: ['Tahoma', 'Geneva', 'sans-serif'],
        trebuchet: ['"Trebuchet MS"', 'Geneva', 'sans-serif'],
        garamond: ['Garamond', 'serif'],
        palantino: ['Palatino', 'serif'],
        bookman: ['Bookman', 'serif'],
        'comic-sans': ['"Comic Sans MS"', 'cursive', 'sans-serif'],
        impact: ['Impact', 'Charcoal', 'sans-serif'],
        lucida: ['"Lucida Sans Unicode"', '"Lucida Grande"', 'sans-serif'],
        'lucida-console': ['"Lucida Console"', 'Monaco', 'monospace'],
        'lucida-sans': ['"Lucida Sans Unicode"', '"Lucida Grande"', 'sans-serif'],
        candara: ['Candara', 'sans-serif'],
        optima: ['Optima', 'sans-serif'],
        avenir: ['Avenir', 'sans-serif'],
        futura: ['Futura', 'sans-serif'],
        calibri: ['Calibri', 'sans-serif'],
        cambria: ['Cambria', 'serif'],
        didot: ['Didot', 'serif'],
        'franklin-gothic': ['"Franklin Gothic Medium"', '"Franklin Gothic"', 'Arial', 'sans-serif'],
        rockwell: ['Rockwell', 'serif'],
        baskerville: ['Baskerville', 'serif'],
      },
    },
  },
  plugins: [forms, typography],
}
