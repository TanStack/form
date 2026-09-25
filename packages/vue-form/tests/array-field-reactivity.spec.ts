import { render } from 'vitest-browser-vue'
import { expect, it } from 'vitest'
import ArrayFieldReactivity from './fixtures/ArrayFieldReactivity.vue'

it('updates ArrayField validation in a compiled child without another structural change', async () => {
  let resolveValidation!: (error: string) => void
  const validation = new Promise<string>((resolve) => {
    resolveValidation = resolve
  })
  const view = await render(ArrayFieldReactivity, {
    props: { validate: () => validation },
  })

  await view.getByRole('button', { name: 'Add item' }).click()
  await expect.element(view.getByTestId('length')).toHaveTextContent('2')
  await expect.element(view.getByTestId('validating')).toHaveTextContent('true')

  resolveValidation('Array error')
  await expect
    .element(view.getByTestId('validating'))
    .toHaveTextContent('false')
  await expect
    .element(view.getByTestId('errors'))
    .toHaveTextContent('Array error')
  await expect.element(view.getByTestId('length')).toHaveTextContent('2')
})
