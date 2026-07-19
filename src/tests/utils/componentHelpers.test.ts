import { describe, expect, it } from 'vitest'
import componentHelpers, {
  getComponentHelpers,
} from '../../utils/html-elements/componentHelpers'

describe('getComponentHelpers', () => {
  it('includes Header H1 by default and when disableH1 is false', () => {
    expect(componentHelpers.some((comp) => comp.title === 'Header H1')).toBe(true)
    expect(
      getComponentHelpers({ userSettings: { disableH1: false } }).some(
        (comp) => comp.title === 'Header H1',
      ),
    ).toBe(true)
    expect(getComponentHelpers(null).some((comp) => comp.title === 'Header H1')).toBe(true)
  })

  it('omits Header H1 when disableH1 is true', () => {
    const helpers = getComponentHelpers({ userSettings: { disableH1: true } })
    expect(helpers.some((comp) => comp.title === 'Header H1')).toBe(false)
    expect(helpers.some((comp) => comp.title === 'Header H2')).toBe(true)
  })
})
