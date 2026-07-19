import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { afterEach, describe, expect, it } from 'vitest'
import {
  Slider,
  SliderControl,
  SliderLabel,
  SliderRoot,
  SliderValue,
} from '../src/components/ui/slider'

const disposers: Array<() => void> = []
const containers: Array<HTMLElement> = []

afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose()
  for (const container of containers.splice(0)) container.remove()
})

function createContainer() {
  const container = document.createElement('div')
  document.body.append(container)
  containers.push(container)
  return container
}

describe('Slider', () => {
  it('preserves the shorthand slider and its default range', () => {
    const container = createContainer()
    disposers.push(render(() => <Slider />, container))

    const thumbs = container.querySelectorAll('[role="slider"]')

    expect(thumbs).toHaveLength(2)
    expect(thumbs[0]?.getAttribute('aria-valuenow')).toBe('0')
    expect(thumbs[1]?.getAttribute('aria-valuenow')).toBe('100')
  })

  it('connects its label to the hidden input and accessible thumb name', () => {
    const container = createContainer()
    disposers.push(
      render(
        () => (
          <SliderRoot defaultValue={[25]}>
            <SliderLabel>Volume</SliderLabel>
            <SliderValue />
            <SliderControl />
          </SliderRoot>
        ),
        container,
      ),
    )

    const label = container.querySelector<HTMLLabelElement>(
      '[data-slot="slider-label"]',
    )
    const value = container.querySelector('[data-slot="slider-value"]')
    const thumb = container.querySelector<HTMLElement>('[role="slider"]')
    const hiddenInput =
      container.querySelector<HTMLInputElement>('input[hidden]')

    expect(label).not.toBeNull()
    expect(value?.textContent).toBe('25')
    expect(thumb?.getAttribute('aria-labelledby')).toBe(label?.id)
    expect(label?.htmlFor).toBe(hiddenInput?.id)

    label?.click()
    expect(document.activeElement).toBe(thumb)
  })

  it('updates controlled thumbs and exposes formatted value text', async () => {
    const container = createContainer()
    const [values, setValues] = createSignal([0])
    const formatValue = (value: number) =>
      value === 0 ? 'Instant' : `${value}ms`

    disposers.push(
      render(
        () => (
          <SliderRoot
            value={values()}
            getAriaValueText={({ value }) => formatValue(value)}
          >
            <SliderLabel>Debounce amount</SliderLabel>
            <SliderValue>{values().map(formatValue).join(', ')}</SliderValue>
            <SliderControl />
          </SliderRoot>
        ),
        container,
      ),
    )

    expect(container.querySelectorAll('[role="slider"]')).toHaveLength(1)
    expect(
      container
        .querySelector('[role="slider"]')
        ?.getAttribute('aria-valuetext'),
    ).toBe('Instant')
    expect(
      container.querySelector('[data-slot="slider-value"]')?.textContent,
    ).toBe('Instant')

    setValues([50, 100])
    await Promise.resolve()

    const thumbs = container.querySelectorAll('[role="slider"]')
    expect(thumbs).toHaveLength(2)
    expect(thumbs[0]?.getAttribute('aria-valuetext')).toBe('50ms')
    expect(thumbs[1]?.getAttribute('aria-valuetext')).toBe('100ms')
    expect(
      container.querySelector('[data-slot="slider-value"]')?.textContent,
    ).toBe('50ms, 100ms')
  })
})
