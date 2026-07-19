// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import CustomDropdown from '../../Components/Inputs/CustomDropdown.vue'

describe('CustomDropdown', () => {
  it('does not overwrite modelValue when selecting action sentinels like __custom__', async () => {
    const modelValue = ref('custom:#ef4444')
    const selected: string[] = []
    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h(CustomDropdown, {
              modelValue: modelValue.value,
              options: [
                { value: 'none', label: 'Transparent' },
                { value: '__custom__', label: 'Custom color' },
                { value: 'custom:#ef4444', label: 'Red' },
              ],
              'onUpdate:modelValue': (value: string) => {
                modelValue.value = value
              },
              onSelect: (value: string) => {
                selected.push(value)
              },
            })
        },
      }),
    )

    app.mount(container)
    await nextTick()

    const trigger = container.querySelector('.pbx-custom-dropdown__trigger') as HTMLButtonElement
    trigger.click()
    await nextTick()

    const optionButtons = Array.from(
      container.querySelectorAll('.pbx-custom-dropdown__item'),
    ) as HTMLButtonElement[]
    const customOption = optionButtons.find((button) =>
      button.textContent?.includes('Custom color'),
    )
    expect(customOption).toBeTruthy()
    customOption!.click()
    await nextTick()

    expect(selected).toEqual(['__custom__'])
    expect(modelValue.value).toBe('custom:#ef4444')

    app.unmount()
    container.remove()
  })

  it('updates modelValue for real color options', async () => {
    const modelValue = ref('none')
    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h(CustomDropdown, {
              modelValue: modelValue.value,
              options: [
                { value: 'none', label: 'Transparent' },
                { value: 'pbx-bg-rose-400', label: 'Rose' },
              ],
              'onUpdate:modelValue': (value: string) => {
                modelValue.value = value
              },
            })
        },
      }),
    )

    app.mount(container)
    await nextTick()

    ;(container.querySelector('.pbx-custom-dropdown__trigger') as HTMLButtonElement).click()
    await nextTick()

    const roseOption = Array.from(
      container.querySelectorAll('.pbx-custom-dropdown__item'),
    ).find((button) => button.textContent?.includes('Rose')) as HTMLButtonElement
    roseOption.click()
    await nextTick()

    expect(modelValue.value).toBe('pbx-bg-rose-400')

    app.unmount()
    container.remove()
  })
})
