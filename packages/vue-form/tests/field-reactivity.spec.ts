import { render } from 'vitest-browser-vue'
import { describe, expect, it, vi } from 'vitest'
import FieldReactivity from './fixtures/FieldReactivity.vue'

describe.each(['slot', 'injected'] as const)(
  'compiled Vue field consumers (%s)',
  (mode) => {
    it('updates value, synchronous errors, and pending asynchronous validation without remounting', async () => {
      let resolveValidation!: (error: string | null) => void
      const validation = new Promise<string | null>((resolve) => {
        resolveValidation = resolve
      })
      const onFieldMount = vi.fn()
      const view = await render(FieldReactivity, {
        props: {
          mode,
          onFieldMount,
          validate: (value) => {
            if (value === 'bad') return 'Synchronous error'
            if (value === 'pending') return validation
            return null
          },
        },
      })
      const input = view.getByRole('textbox', { name: 'Value' })

      await input.fill('bad')
      await expect.element(view.getByTestId('value')).toHaveTextContent('bad')
      await expect
        .element(view.getByTestId('meta-errors'))
        .toHaveTextContent('Synchronous error')
      await expect
        .element(view.getByTestId('errors'))
        .toHaveTextContent('Synchronous error')
      await expect
        .element(view.getByTestId('touched'))
        .toHaveTextContent('true')

      await input.fill('valid')
      await expect.element(view.getByTestId('errors')).toBeEmptyDOMElement()
      await expect
        .element(view.getByTestId('meta-errors'))
        .toBeEmptyDOMElement()

      await input.fill('pending')
      await expect
        .element(view.getByTestId('validating'))
        .toHaveTextContent('true')
      resolveValidation('Asynchronous error')
      await expect
        .element(view.getByTestId('validating'))
        .toHaveTextContent('false')
      await expect
        .element(view.getByTestId('meta-errors'))
        .toHaveTextContent('Asynchronous error')
      await expect
        .element(view.getByTestId('errors'))
        .toHaveTextContent('Asynchronous error')

      await input.fill('valid again')
      await expect.element(view.getByTestId('errors')).toBeEmptyDOMElement()
      await expect
        .element(view.getByTestId('meta-errors'))
        .toBeEmptyDOMElement()
      expect(onFieldMount).toHaveBeenCalledOnce()
    })

    it('reads and writes the current field after reset and a name change without remounting', async () => {
      const onFieldMount = vi.fn()
      const view = await render(FieldReactivity, {
        props: { mode, onFieldMount, validate: () => null },
      })
      const input = view.getByRole('textbox', { name: 'Value' })

      await input.fill('Changed')
      await expect
        .element(view.getByTestId('first-value'))
        .toHaveTextContent('Changed')
      await view.getByRole('button', { name: 'Reset' }).click()
      await expect.element(input).toHaveValue('First')
      await expect
        .element(view.getByTestId('touched'))
        .toHaveTextContent('false')
      await input.fill('After reset')
      await expect
        .element(view.getByTestId('first-value'))
        .toHaveTextContent('After reset')
      await expect
        .element(view.getByTestId('value'))
        .toHaveTextContent('After reset')

      await view.getByRole('button', { name: 'Switch field' }).click()
      await expect.element(view.getByTestId('name')).toHaveTextContent('second')
      await expect.element(input).toHaveValue('Second')
      await input.fill('Updated second')
      await expect
        .element(view.getByTestId('value'))
        .toHaveTextContent('Updated second')
      await expect
        .element(view.getByTestId('second-value'))
        .toHaveTextContent('Updated second')
      await expect
        .element(view.getByTestId('first-value'))
        .toHaveTextContent('After reset')
      expect(onFieldMount).toHaveBeenCalledOnce()
    })
  },
)
