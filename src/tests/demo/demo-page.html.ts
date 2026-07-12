/**
 * Loads mybuilder.dev demo HTML from demo-page.content.html
 *
 * You only edit demo-page.content.html — paste the full copied page there.
 * This file stays as-is.
 */
import demoPageContent from './demo-page.content.html?raw'

/** Strip the HTML comment at the top so parsePageBuilderHTML sees valid markup */
function stripDemoFileComment(html: string): string {
  return html.replace(/^<!--[\s\S]*?-->\s*/, '').trim()
}

export const DEMO_PAGE_HTML = stripDemoFileComment(demoPageContent)
