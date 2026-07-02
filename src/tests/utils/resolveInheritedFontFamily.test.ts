// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { resolveInheritedFontFamily } from '../../utils/builder/resolve-inherited-font-family'
import type { PageBuilderConfig } from '../../types'

const baseConfig = {
  userSettings: {
    fontFamily: 'jost, raleway, arial, fantasy',
    elementFonts: {
      h2: 'jost, raleway, arial, fantasy',
    },
  },
} as PageBuilderConfig

describe('resolveInheritedFontFamily', () => {
  it('returns canvas fontFamily when no explicit class is set', () => {
    document.body.innerHTML = `
      <div id="pagebuilder" class="pbx-font-jost">
        <div class="pbx-font-medium">
          <h2>Title</h2>
        </div>
      </div>
    `

    const wrapper = document.querySelector('.pbx-font-medium') as HTMLElement
    expect(resolveInheritedFontFamily(wrapper, baseConfig)).toBe('Jost')
  })

  it('returns elementFonts for the text tag before canvas fontFamily', () => {
    document.body.innerHTML = `
      <div id="pagebuilder">
        <div>
          <h2>Title</h2>
        </div>
      </div>
    `

    const wrapper = document.querySelector('div > div') as HTMLElement
    expect(resolveInheritedFontFamily(wrapper, baseConfig)).toBe('Jost')
  })

  it('prefers an explicit ancestor font-family class over config defaults', () => {
    document.body.innerHTML = `
      <div id="pagebuilder" class="pbx-font-jost">
        <div class="pbx-font-raleway">
          <h2>Title</h2>
        </div>
      </div>
    `

    const wrapper = document.querySelector('.pbx-font-raleway') as HTMLElement
    expect(resolveInheritedFontFamily(wrapper, baseConfig)).toBe('Raleway')
  })

  it('ignores font-weight classes such as pbx-font-medium', () => {
    document.body.innerHTML = `
      <div id="pagebuilder" class="pbx-font-jost">
        <div class="pbx-font-medium">
          <h2>Title</h2>
        </div>
      </div>
    `

    const h2 = document.querySelector('h2') as HTMLElement
    expect(resolveInheritedFontFamily(h2, baseConfig)).toBe('Jost')
  })
})
