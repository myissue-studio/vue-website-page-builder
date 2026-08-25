import { extractCleanHTMLFromPageBuilder } from './extract-clean-html'

const PAGE_RESET_CSS = `
      <style>
        #pagebuilder blockquote,
        #pagebuilder dl,
        #pagebuilder dd,
        #pagebuilder pre,
        #pagebuilder hr,
        #pagebuilder figure,
        #pagebuilder p,
        #pagebuilder h1,
        #pagebuilder h2,
        #pagebuilder h3,
        #pagebuilder h4,
        #pagebuilder h5,
        #pagebuilder h6,
        #pagebuilder ul,
        #pagebuilder ol {
          margin: 0;
          padding: 0;
        }
      </style>
    `

export function collectDocumentStyles(sourceDocument: Document = document): string {
  return Array.from(sourceDocument.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((style) => {
      if (style.tagName === 'STYLE') return style.outerHTML
      if (style.tagName === 'LINK') {
        return `<link rel="stylesheet" href="${(style as HTMLLinkElement).href}">`
      }
      return ''
    })
    .join('\n')
}

export function extractStandalonePageContent(pagebuilder: HTMLElement): string {
  const tempDiv = pagebuilder.ownerDocument.createElement('div')
  tempDiv.innerHTML = extractCleanHTMLFromPageBuilder(pagebuilder)
  tempDiv.querySelectorAll('[hovered], [selected]').forEach((element) => {
    element.removeAttribute('hovered')
    element.removeAttribute('selected')
  })
  return tempDiv.innerHTML
}

export function buildStandaloneHtml(
  contentHtml: string,
  sourceDocument: Document = document,
  title = 'Downloaded HTML',
): string {
  const styles = `${collectDocumentStyles(sourceDocument)}\n${PAGE_RESET_CSS}`
  const escapedTitle = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${escapedTitle}</title>
            ${styles}
        </head>
        <body>
            <div id="pagebuilder" class="pbx-font-sans pbx-text-black">
                ${contentHtml}
            </div>
        </body>
        </html>
    `
}

export function getStandalonePageHtml(
  pagebuilder: HTMLElement,
  sourceDocument: Document = document,
  title?: string,
): string {
  return buildStandaloneHtml(extractStandalonePageContent(pagebuilder), sourceDocument, title)
}

export function downloadStandaloneHtml(
  filename: string,
  html: string,
  sourceDocument: Document = document,
): void {
  const element = sourceDocument.createElement('a')
  element.setAttribute('href', `data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  sourceDocument.body.appendChild(element)
  element.click()
  sourceDocument.body.removeChild(element)
}
