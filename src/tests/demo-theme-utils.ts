import themes from '../utils/html-elements/themes'
import { DEMO_PAGE_HTML } from './demo-page.html'
import type { PageBuilderService } from '../services/PageBuilderService'

export function getThemeHtmlByTitle(title: string): string {
  return themes[0].themes.data.find((theme) => theme.title === title)?.html_code ?? ''
}

/** Full mybuilder.dev page — private, not in the public Themes tab */
export function getDemoPageHtml(): string {
  return DEMO_PAGE_HTML
}

export async function restoreDemoPage(
  pageBuilderService: PageBuilderService,
  translate: (key: string) => string,
): Promise<void> {
  const html = translateThemePlaceholderText(DEMO_PAGE_HTML, translate)
  await pageBuilderService.replaceTheme(html)
}

export function translateThemePlaceholderText(
  html: string,
  translate: (key: string) => string,
): string {
  return html
    .replace(/Layouts and visual\./g, translate('Layouts and visual.'))
    .replace(
      /Start customizing by editing this default text directly in the editor\./g,
      translate('Start customizing by editing this default text directly in the editor.'),
    )
}
